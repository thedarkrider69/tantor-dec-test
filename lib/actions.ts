"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getCurrentUser, getOrganizationId, hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { makeReference } from "@/lib/utils";
import { buildLocalEdiTdfc, makeEdiFileName } from "@/lib/edi";
import { buildTdfc2025InfentDf, makeTdfc2025FileName } from "@/lib/tdfc-2025";
import { buildLocalEdiLocRequest, buildSimulatedLocResponse, isValidSirenFormat, makeEdiLocFileName, normalizeSiren } from "@/lib/edi-requete";
import { collectDeclarationValues, validateDeclarationValues } from "@/lib/tax-rules";
import {
  saveCompanySnapshot,
  saveDeclarationSnapshot,
  saveEdiFile,
  saveFiscalYearSnapshot,
  saveInvoiceAndReceiptFiles,
  saveEdiLocRequestFile,
  saveSupportTicketSnapshot,
  saveUserProfileSnapshot
} from "@/lib/storage";

function val(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function registerAction(formData: FormData) {
  const fullName = val(formData, "fullName");
  const email = val(formData, "email").toLowerCase();
  const password = val(formData, "password");
  const confirmPassword = val(formData, "confirmPassword");
  const cabinet = val(formData, "cabinet") || "Mon cabinet";

  if (!fullName || !email || !password) fail("/register", "Tous les champs obligatoires doivent être remplis.");
  if (password.length < 8) fail("/register", "Le mot de passe doit contenir au moins 8 caractères.");
  if (password !== confirmPassword) fail("/register", "Les mots de passe ne correspondent pas.");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) fail("/register", "Un compte existe déjà avec cette adresse email.");

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash: await hashPassword(password) }
  });

  const organization = await prisma.organization.create({
    data: { name: cabinet, trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) }
  });

  await prisma.membership.create({ data: { userId: user.id, organizationId: organization.id, role: "OWNER" } });
  await saveUserProfileSnapshot(user, organization);
  await prisma.activityLog.create({ data: { userId: user.id, label: "Compte créé", detail: "Dossier utilisateur local créé" } });
  await createSession(user.id);
  redirect("/app/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = val(formData, "email").toLowerCase();
  const password = val(formData, "password");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) fail("/login", "Email ou mot de passe invalide.");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) fail("/login", "Email ou mot de passe invalide.");
  await createSession(user.id);
  if (user.role === "ADMIN") redirect("/admin/dashboard");
  redirect("/app/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function createCompanyAction(formData: FormData) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  if (!organizationId) fail("/app/entreprises/nouvelle", "Aucune organisation trouvée.");

  const name = val(formData, "name");
  const siren = val(formData, "siren").replace(/\s/g, "");
  if (!name || !siren) fail("/app/entreprises/nouvelle", "Le nom et le SIREN sont obligatoires.");

  const company = await prisma.company.create({
    data: {
      organizationId,
      name,
      siren,
      siret: val(formData, "siret"),
      legalForm: val(formData, "legalForm") || "SARL",
      taxRegime: val(formData, "taxRegime") || "IS",
      vatRegime: val(formData, "vatRegime") || "Réel simplifié",
      closingDate: val(formData, "closingDate") || "31/12/2024",
      address: val(formData, "address"),
      representative: val(formData, "representative"),
      repEmail: val(formData, "repEmail"),
      repPhone: val(formData, "repPhone")
    }
  });

  await saveCompanySnapshot(user, company);
  await prisma.activityLog.create({ data: { userId: user.id, label: "Nouvelle entreprise ajoutée", detail: `${company.name} — sauvegardée dans le dossier utilisateur` } });
  revalidatePath("/app/entreprises");
  redirect("/app/entreprises");
}

export async function createFiscalYearAction(formData: FormData) {
  const user = await requireUser();
  const companyId = val(formData, "companyId");
  const startDate = val(formData, "startDate");
  const endDate = val(formData, "endDate");
  if (!companyId || !startDate || !endDate) fail("/app/declarations?tab=exercices", "Entreprise et période obligatoires.");

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) fail("/app/declarations?tab=exercices", "Entreprise introuvable.");

  const fiscalYear = await prisma.fiscalYear.create({
    data: {
      companyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      fecImported: val(formData, "fecImported") === "on",
      fecFileName: val(formData, "fecFileName"),
      linesCount: Number(val(formData, "linesCount") || 0),
      benefit: Number(val(formData, "benefit") || 0)
    }
  });
  await saveFiscalYearSnapshot(user, fiscalYear, company);
  await prisma.activityLog.create({ data: { userId: user.id, label: "Exercice comptable créé", detail: `${company.name} — sauvegardé dans le dossier utilisateur` } });
  revalidatePath("/app/declarations");
  redirect("/app/declarations?created=exercise");
}

export async function createDeclarationAction(formData: FormData) {
  const user = await requireUser();
  const companyId = val(formData, "companyId");
  const fiscalYearId = val(formData, "fiscalYearId") || undefined;
  if (!companyId) fail("/app/declarations/nouvelle", "Sélectionnez une entreprise.");
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) fail("/app/declarations/nouvelle", "Entreprise introuvable.");

  const declaration = await prisma.declaration.create({
    data: {
      companyId,
      fiscalYearId,
      reference: makeReference("DEC"),
      type: val(formData, "type") || "Liasse 2065 - IS - BIC",
      fiscalYear: Number(val(formData, "fiscalYear") || new Date().getFullYear()),
      dueDate: val(formData, "dueDate") ? new Date(val(formData, "dueDate")) : null,
      amount: Number(val(formData, "amount") || 49),
      valuesJson: "{}",
      anomaliesJson: JSON.stringify(["Bloquant — Total actif net manquant.", "Bloquant — Total passif manquant.", "Bloquant — Total produits manquant.", "Bloquant — Total charges manquant.", "Bloquant — Résultat de l'exercice manquant."])
    }
  });
  await saveDeclarationSnapshot({ user, declaration: { ...declaration, company }, values: {}, anomalies: JSON.parse(declaration.anomaliesJson || "[]") });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Déclaration créée", detail: `${company.name} - ${declaration.type} — dossier déclaration créé` } });
  redirect(`/app/declarations/${declaration.id}/remplir`);
}

export async function saveDeclarationValuesAction(formData: FormData) {
  const user = await requireUser();
  const declarationId = val(formData, "declarationId");
  const values = collectDeclarationValues(formData);
  const anomalies = validateDeclarationValues(values);

  const declaration = await prisma.declaration.update({
    where: { id: declarationId },
    data: {
      valuesJson: JSON.stringify(values),
      anomaliesJson: JSON.stringify(anomalies),
      lastValidatedAt: new Date(),
      ediFileName: null,
      ediContent: null,
      ediFilePath: null,
      ediDeclarationPath: null,
      ediGeneratedAt: null,
      status: anomalies.length ? "TO_COMPLETE" : "DRAFT"
    },
    include: { company: true }
  });
  await saveDeclarationSnapshot({ user, declaration, values, anomalies });
  revalidatePath(`/app/declarations/${declarationId}`);
  redirect(`/app/declarations/${declarationId}?saved=1`);
}

export async function validateDeclarationAction(formData: FormData) {
  const user = await requireUser();
  const declarationId = val(formData, "declarationId");
  const declaration = await prisma.declaration.findUnique({ where: { id: declarationId } });
  if (!declaration) fail("/app/declarations", "Déclaration introuvable.");
  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const anomalies = validateDeclarationValues(values);
  const updatedDeclaration = await prisma.declaration.update({
    where: { id: declarationId },
    data: { anomaliesJson: JSON.stringify(anomalies), lastValidatedAt: new Date(), status: anomalies.length ? "TO_COMPLETE" : "DRAFT" },
    include: { company: true }
  });
  await saveDeclarationSnapshot({ user, declaration: updatedDeclaration, values, anomalies });
  revalidatePath(`/app/declarations/${declarationId}`);
  redirect(`/app/declarations/${declarationId}?validated=1`);
}

export async function generateEdiFileAction(formData: FormData) {
  const user = await requireUser();
  const declarationId = val(formData, "declarationId");
  const declaration = await prisma.declaration.findUnique({
    where: { id: declarationId },
    include: { company: true, year: true }
  });
  if (!declaration) fail("/app/declarations", "Déclaration introuvable.");

  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const anomalies = validateDeclarationValues(values);
  if (anomalies.length > 0) {
    await prisma.declaration.update({
      where: { id: declarationId },
      data: { anomaliesJson: JSON.stringify(anomalies), lastValidatedAt: new Date(), status: "TO_COMPLETE" }
    });
    redirect(`/app/declarations/${declarationId}?error=${encodeURIComponent("Corrigez les anomalies avant de générer le fichier EDI local.")}`);
  }

  const ediContent = buildLocalEdiTdfc({
    reference: declaration.reference,
    type: declaration.type,
    fiscalYear: declaration.fiscalYear,
    dueDate: declaration.dueDate,
    createdAt: declaration.createdAt,
    company: declaration.company,
    fiscalPeriod: declaration.year ? { startDate: declaration.year.startDate, endDate: declaration.year.endDate } : null,
    values
  });
  const ediFileName = makeEdiFileName(declaration.reference);
  const ediPaths = await saveEdiFile({ user, declaration, ediContent, ediFileName });

  const updatedDeclaration = await prisma.declaration.update({
    where: { id: declarationId },
    data: {
      anomaliesJson: JSON.stringify([]),
      lastValidatedAt: new Date(),
      ediContent,
      ediFileName,
      ediFilePath: ediPaths.ediPath,
      ediDeclarationPath: ediPaths.declarationPath,
      ediGeneratedAt: new Date(),
      status: "PROCESSING"
    },
    include: { company: true }
  });
  await saveDeclarationSnapshot({ user, declaration: updatedDeclaration, values, anomalies: [] });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Fichier EDI local généré", detail: ediPaths.ediPath } });
  revalidatePath(`/app/declarations/${declarationId}`);
  redirect(`/app/declarations/${declarationId}?edi=1`);
}

export async function generateTdfc2025FileAction(formData: FormData) {
  const user = await requireUser();
  const declarationId = val(formData, "declarationId");
  const declaration = await prisma.declaration.findUnique({
    where: { id: declarationId },
    include: { company: true, year: true }
  });
  if (!declaration) fail("/app/declarations", "Déclaration introuvable.");

  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const anomalies = validateDeclarationValues(values);
  if (anomalies.length > 0) {
    await prisma.declaration.update({
      where: { id: declarationId },
      data: { anomaliesJson: JSON.stringify(anomalies), lastValidatedAt: new Date(), status: "TO_COMPLETE" }
    });
    redirect(`/app/declarations/${declarationId}?error=${encodeURIComponent("Corrigez les anomalies avant de générer le fichier INFENT DF EDI-TDFC 2025.")}`);
  }

  const ediContent = buildTdfc2025InfentDf({
    reference: declaration.reference,
    fiscalYear: declaration.fiscalYear,
    company: declaration.company,
    fiscalPeriod: declaration.year ? { startDate: declaration.year.startDate, endDate: declaration.year.endDate } : null,
    values,
    testMode: true
  });
  const ediFileName = makeTdfc2025FileName(declaration.reference);
  const ediPaths = await saveEdiFile({ user, declaration, ediContent, ediFileName });

  const updatedDeclaration = await prisma.declaration.update({
    where: { id: declarationId },
    data: {
      anomaliesJson: JSON.stringify([]),
      lastValidatedAt: new Date(),
      ediContent,
      ediFileName,
      ediFilePath: ediPaths.ediPath,
      ediDeclarationPath: ediPaths.declarationPath,
      ediGeneratedAt: new Date(),
      status: "PROCESSING"
    },
    include: { company: true }
  });
  await saveDeclarationSnapshot({ user, declaration: updatedDeclaration, values, anomalies: [] });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Fichier INFENT DF EDI-TDFC 2025 généré", detail: ediPaths.ediPath } });
  revalidatePath(`/app/declarations/${declarationId}`);
  redirect(`/app/declarations/${declarationId}?tdfc2025=1`);
}

export async function sendDeclarationAction(formData: FormData) {
  const user = await requireUser();
  const declarationId = val(formData, "declarationId");
  const declaration = await prisma.declaration.findUnique({ where: { id: declarationId }, include: { company: true } });
  if (!declaration) fail("/app/declarations", "Déclaration introuvable.");
  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const anomalies = validateDeclarationValues(values);
  if (anomalies.length > 0) {
    await prisma.declaration.update({
      where: { id: declarationId },
      data: { anomaliesJson: JSON.stringify(anomalies), lastValidatedAt: new Date(), status: "TO_COMPLETE" }
    });
    redirect(`/app/declarations/${declarationId}?error=${encodeURIComponent("Corrigez les anomalies avant l'envoi.")}`);
  }
  if (!declaration.ediContent) {
    redirect(`/app/declarations/${declarationId}?error=${encodeURIComponent("Générez d'abord le fichier EDI local avant l'envoi simulé.")}`);
  }

  const sentDeclaration = await prisma.declaration.update({ where: { id: declarationId }, data: { status: "SENT", sentAt: new Date() }, include: { company: true } });
  await saveDeclarationSnapshot({ user, declaration: sentDeclaration, values, anomalies: [] });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Déclaration transmise en simulation", detail: `${declaration.reference} — état sauvegardé dans le dossier utilisateur` } });
  redirect(`/app/declarations/${declarationId}/paiement`);
}

export async function payDeclarationAction(formData: FormData) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const declarationId = val(formData, "declarationId");
  if (!organizationId) fail("/app/declarations", "Organisation introuvable.");
  const declaration = await prisma.declaration.findUnique({ where: { id: declarationId } });
  if (!declaration) fail("/app/declarations", "Déclaration introuvable.");

  const amountHt = Math.round((declaration.amount / 1.2) * 100) / 100;
  const vat = Math.round((declaration.amount - amountHt) * 100) / 100;
  const number = makeReference("TD");

  const invoice = await prisma.invoice.create({
    data: {
      organizationId,
      declarationId,
      number,
      amountHt,
      vat,
      amountTtc: declaration.amount,
      status: "PAID",
      paidAt: new Date(),
      payment: { create: { reference: makeReference("PAY"), amount: declaration.amount } }
    },
    include: { declaration: { include: { company: true } }, payment: true }
  });

  const acceptedDeclaration = await prisma.declaration.update({ where: { id: declarationId }, data: { status: "ACCEPTED", acceptedAt: new Date() }, include: { company: true } });
  await saveDeclarationSnapshot({ user, declaration: acceptedDeclaration });
  const savedFiles = await saveInvoiceAndReceiptFiles(user, invoice);
  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { invoiceFilePath: savedFiles.invoiceTextPath, invoiceJsonPath: savedFiles.invoiceJsonPath, receiptFilePath: savedFiles.receiptPath }
  });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Paiement effectué", detail: `${invoice.number} — facture sauvegardée dans le dossier utilisateur` } });
  redirect(`/app/factures?paid=${invoice.id}`);
}

export async function supportTicketAction(formData: FormData) {
  const user = await getCurrentUser();
  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user?.id,
      name: user?.fullName ?? (val(formData, "name") || "Visiteur"),
      email: user?.email ?? val(formData, "email"),
      subject: val(formData, "subject"),
      message: val(formData, "message")
    }
  });
  await saveSupportTicketSnapshot(user, ticket);
  redirect("/app/aide?sent=1");
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const fullName = val(formData, "fullName");
  if (!fullName) fail("/app/compte", "Le nom complet est obligatoire.");
  const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { fullName } });
  const organizationId = getOrganizationId(user);
  const organization = organizationId ? await prisma.organization.findUnique({ where: { id: organizationId } }) : null;
  await saveUserProfileSnapshot(updatedUser, organization);
  revalidatePath("/app/compte");
  redirect("/app/compte?updated=1");
}

export async function adminCreateUserAction(formData: FormData) {
  const admin = await requireUser();
  if (admin.role !== "ADMIN") redirect("/app/dashboard");
  const email = val(formData, "email").toLowerCase();
  const fullName = val(formData, "fullName");
  const password = val(formData, "password") || "Tantor123!";
  const roleInput = val(formData, "role");
  const role = roleInput === "ADMIN" || roleInput === "PARTNER" ? roleInput : "USER";
  if (!email || !fullName) redirect("/admin/utilisateurs?error=1");
  const createdUser = await prisma.user.create({ data: { email, fullName, role, passwordHash: await hashPassword(password) } });
  await saveUserProfileSnapshot(createdUser, null);
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?created=1");
}


export async function createEdiLocRequestAction(formData: FormData) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  if (!organizationId) fail("/app/requetes-loc", "Organisation introuvable.");

  const companyId = val(formData, "companyId");
  const company = await prisma.company.findFirst({ where: { id: companyId, organizationId } });
  if (!company) fail("/app/requetes-loc", "Entreprise introuvable.");

  const requesterSiren = normalizeSiren(val(formData, "requesterSiren") || company.siren);
  const taxpayerSiren = normalizeSiren(val(formData, "taxpayerSiren") || company.siren);
  const unitMode = val(formData, "unitMode") === "on";

  if (!isValidSirenFormat(requesterSiren)) fail("/app/requetes-loc", "Le SIREN demandeur doit contenir 9 chiffres.");
  if (!isValidSirenFormat(taxpayerSiren)) fail("/app/requetes-loc", "Le SIREN redevable doit contenir 9 chiffres.");

  const request = await prisma.ediLocRequest.create({
    data: {
      companyId,
      reference: makeReference("LOC"),
      requesterSiren,
      taxpayerSiren,
      unitMode,
      status: "DRAFT"
    },
    include: { company: true }
  });

  await prisma.activityLog.create({ data: { userId: user.id, label: "Requête LOC créée", detail: `${company.name} — ${request.reference}` } });
  redirect(`/app/requetes-loc/${request.id}`);
}

export async function generateEdiLocRequestAction(formData: FormData) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const requestId = val(formData, "requestId");
  const request = await prisma.ediLocRequest.findFirst({
    where: { id: requestId, company: { organizationId: organizationId || "" } },
    include: { company: true }
  });
  if (!request) fail("/app/requetes-loc", "Requête LOC introuvable.");
  if (!isValidSirenFormat(request.requesterSiren) || !isValidSirenFormat(request.taxpayerSiren)) {
    redirect(`/app/requetes-loc/${request.id}?error=${encodeURIComponent("SIREN demandeur ou redevable invalide.")}`);
  }

  const fileContent = buildLocalEdiLocRequest({
    reference: request.reference,
    requesterSiren: request.requesterSiren,
    taxpayerSiren: request.taxpayerSiren,
    unitMode: request.unitMode,
    company: request.company,
    partner: { approvalNumber: "0000000", name: "Tantor Dec Demo" }
  });
  const fileName = makeEdiLocFileName(request.reference);
  const saved = await saveEdiLocRequestFile({ user, request, fileName, content: fileContent });

  await prisma.ediLocRequest.update({
    where: { id: request.id },
    data: { fileName, fileContent, filePath: saved.filePath, generatedAt: new Date(), status: "GENERATED" }
  });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Fichier INFENT RQ LOC généré", detail: saved.filePath } });
  revalidatePath(`/app/requetes-loc/${request.id}`);
  redirect(`/app/requetes-loc/${request.id}?generated=1`);
}

export async function simulateSendEdiLocRequestAction(formData: FormData) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const requestId = val(formData, "requestId");
  const request = await prisma.ediLocRequest.findFirst({
    where: { id: requestId, company: { organizationId: organizationId || "" } },
    include: { company: true }
  });
  if (!request) fail("/app/requetes-loc", "Requête LOC introuvable.");
  if (!request.fileContent || !request.fileName) {
    redirect(`/app/requetes-loc/${request.id}?error=${encodeURIComponent("Générez d'abord le fichier INFENT RQ LOC de test.")}`);
  }

  const simulatedResponse = buildSimulatedLocResponse({
    reference: request.reference,
    requesterSiren: request.requesterSiren,
    taxpayerSiren: request.taxpayerSiren,
    unitMode: request.unitMode,
    company: request.company,
    partner: { approvalNumber: "0000000", name: "Tantor Dec Demo" }
  });
  await saveEdiLocRequestFile({ user, request, fileName: request.fileName, content: request.fileContent, response: simulatedResponse });

  await prisma.ediLocRequest.update({
    where: { id: request.id },
    data: { status: "ACCEPTED_SIMULATED", sentAt: new Date(), acceptedAt: new Date(), simulatedResponseJson: JSON.stringify(simulatedResponse, null, 2) }
  });
  await prisma.activityLog.create({ data: { userId: user.id, label: "Requête LOC acceptée en simulation", detail: request.reference } });
  revalidatePath(`/app/requetes-loc/${request.id}`);
  redirect(`/app/requetes-loc/${request.id}?sent=1`);
}
