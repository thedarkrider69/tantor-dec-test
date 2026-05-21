import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}


function safeName(value) {
  return String(value || "sans-nom")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "sans-nom";
}

function userStorageRoot(user) {
  return path.join(process.cwd(), "storage", "users", `${safeName(user.email)}_${user.id.slice(0, 8)}`);
}

function ensureUserStorage(user) {
  const root = userStorageRoot(user);
  ["01-profil", "02-entreprises", "03-exercices", "04-declarations", "05-edi", "06-factures", "07-recus", "08-support"].forEach((dir) => {
    mkdirSync(path.join(root, dir), { recursive: true });
  });
  return root;
}

function writeJson(filePath, data) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return filePath.split(path.sep).join("/");
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function saveDemoStorage(user, org, companies, fiscalYears, declarations) {
  const root = ensureUserStorage(user);
  writeJson(path.join(root, "01-profil", "profil-utilisateur.json"), { exportedAt: new Date().toISOString(), user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }, organization: org });
  for (const company of companies) {
    const companyDir = `${safeName(company.name)}_${safeName(company.siren || company.id)}`;
    writeJson(path.join(root, "02-entreprises", companyDir, "entreprise.json"), { exportedAt: new Date().toISOString(), company });
  }
  for (const fy of fiscalYears) {
    const company = companies.find((c) => c.id === fy.companyId);
    const companyDir = company ? `${safeName(company.name)}_${safeName(company.siren || company.id)}` : "entreprise";
    writeJson(path.join(root, "03-exercices", companyDir, `${safeName(String(fy.startDate))}_${safeName(String(fy.endDate))}.json`), { exportedAt: new Date().toISOString(), fiscalYear: fy, company });
  }
  for (const declaration of declarations) {
    const company = companies.find((c) => c.id === declaration.companyId);
    const companyDir = company ? `${safeName(company.name)}_${safeName(company.siren || company.id)}` : "entreprise";
    const declarationDir = path.join(root, "04-declarations", companyDir, `${safeName(declaration.reference)}_${declaration.id.slice(0, 8)}`);
    writeJson(path.join(declarationDir, "declaration.json"), { exportedAt: new Date().toISOString(), declaration: { ...declaration, company }, values: JSON.parse(declaration.valuesJson || "{}"), anomalies: JSON.parse(declaration.anomaliesJson || "[]") });
    writeJson(path.join(declarationDir, "liasse-valeurs.json"), JSON.parse(declaration.valuesJson || "{}"));
    writeJson(path.join(declarationDir, "anomalies.json"), JSON.parse(declaration.anomaliesJson || "[]"));
  }
  return relative(root);
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function ensureUser(email, fullName, password, role = "USER") {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, fullName, passwordHash: hashPassword(password), role }
  });
}

async function main() {
  const admin = await ensureUser("admin@tantordec.fr", "Administrateur Tantor", "Admin123!", "ADMIN");
  const user = await ensureUser("user@tantordec.fr", "Jean Dupont", "User123!", "USER");

  const org = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: {
      id: "demo-org",
      name: "Cabinet Comptable Démo",
      plan: "Pro",
      trialEndsAt: addMonths(new Date(), 1)
    }
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: {},
    create: { userId: user.id, organizationId: org.id, role: "OWNER" }
  });

  const alpha = await prisma.company.upsert({
    where: { id: "alpha-company" },
    update: {},
    create: {
      id: "alpha-company",
      organizationId: org.id,
      name: "ALPHA CONSULTING SARL",
      siren: "812345678",
      siret: "81234567800012",
      legalForm: "SARL",
      taxRegime: "IS",
      vatRegime: "Réel simplifié",
      closingDate: "31/12/2024",
      address: "12 rue des Entrepreneurs, 75015 Paris, France",
      representative: "Jean Dupont",
      repEmail: "jean.dupont@alphaconsulting.fr",
      repPhone: "+33 6 12 34 56 78"
    }
  });

  const beta = await prisma.company.upsert({
    where: { id: "beta-company" },
    update: {},
    create: {
      id: "beta-company",
      organizationId: org.id,
      name: "NOVATECH SAS",
      siren: "901234567",
      siret: "90123456700018",
      legalForm: "SAS",
      taxRegime: "BIC",
      vatRegime: "Réel normal",
      closingDate: "31/12/2024",
      address: "5 avenue des Sciences, 69100 Villeurbanne, France",
      representative: "Clara Martin",
      repEmail: "clara.martin@novatech.io",
      repPhone: "+33 7 23 45 67 89"
    }
  });

  const fy2024 = await prisma.fiscalYear.upsert({
    where: { id: "fy-alpha-2024" },
    update: {},
    create: {
      id: "fy-alpha-2024",
      companyId: alpha.id,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      fecImported: true,
      fecFileName: "FEC_ALPHA_2024.txt",
      linesCount: 12000,
      benefit: 45000
    }
  });

  await prisma.accountingEntry.createMany({
    data: [
      { fiscalYearId: fy2024.id, account: "101000", label: "Capital social", debit: 0, credit: 12000 },
      { fiscalYearId: fy2024.id, account: "411000", label: "Clients", debit: 18000, credit: 0 },
      { fiscalYearId: fy2024.id, account: "512000", label: "Banque principale", debit: 27000, credit: 0 },
      { fiscalYearId: fy2024.id, account: "707000", label: "Ventes de marchandises", debit: 0, credit: 155000 },
      { fiscalYearId: fy2024.id, account: "607000", label: "Achats de marchandises", debit: 110000, credit: 0 }
    ]
  });

  const dec1 = await prisma.declaration.upsert({
    where: { reference: "DEC-2025-000123" },
    update: {},
    create: {
      companyId: alpha.id,
      fiscalYearId: fy2024.id,
      reference: "DEC-2025-000123",
      type: "Liasse 2065 - IS - BIC",
      fiscalYear: 2024,
      dueDate: new Date("2025-07-19"),
      status: "TO_COMPLETE",
      amount: 49,
      valuesJson: JSON.stringify({
        AA: "0",
        AB: "12000",
        AC: "4000",
        AD: "8000",
        CX: "0",
        CQ: "0",
        CR: "0",
        AF: "0",
        AG: "0",
        AH_NET: "0",
        AH: "0",
        AI: "0",
        AJ: "0",
        AK: "0",
        AL: "0",
        AM: "0",
        AN: "103000",
        AO: "12000",
        AP: "91000",
        BR: "18000",
        BT: "27000",
        totalActifBrut: "160000",
        totalActifAmort: "16000",
        totalActifNet: "144000",
        DA: "12000",
        DB: "87000",
        DC: "45000",
        DD: "0",
        DE: "0",
        DF: "0",
        DG: "0",
        totalPassif: "144000",
        FA: "150000",
        FB: "5000",
        FC: "0",
        FD: "0",
        totalProduits: "155000",
        GA: "100000",
        GB: "5000",
        GC: "3000",
        GD: "2000",
        GE: "0",
        GF: "0",
        totalCharges: "110000",
        resultExercice: "45000"
      }),
      anomaliesJson: JSON.stringify([])
    }
  });

  await prisma.declaration.upsert({
    where: { reference: "DEC-2024-000044" },
    update: {},
    create: {
      companyId: beta.id,
      reference: "DEC-2024-000044",
      type: "Liasse 2031 + 2033",
      fiscalYear: 2023,
      dueDate: new Date("2024-12-31"),
      status: "ACCEPTED",
      amount: 49,
      sentAt: new Date("2024-12-10"),
      acceptedAt: new Date("2024-12-10")
    }
  });

  const invoice = await prisma.invoice.upsert({
    where: { number: "TD-20250104-00123" },
    update: {},
    create: {
      organizationId: org.id,
      declarationId: dec1.id,
      number: "TD-20250104-00123",
      amountHt: 40.83,
      vat: 8.17,
      amountTtc: 49,
      status: "PENDING"
    }
  });

  await prisma.helpArticle.createMany({
    data: [
      { title: "Débuter sur Tantor Déc", description: "Premiers pas pour ajouter une entreprise et créer votre première déclaration.", type: "PDF" },
      { title: "Comment remplir une déclaration CA3", description: "Guide pas-à-pas pour compléter votre déclaration TVA mensuelle.", type: "PDF" },
      { title: "Créer et envoyer une déclaration CA3", description: "Tutoriel vidéo pour comprendre les étapes d'une déclaration TVA mensuelle.", type: "Vidéo" }
    ]
  });

  await prisma.supportTicket.createMany({
    data: [
      { userId: user.id, name: "Jean Dupont", email: "user@tantordec.fr", subject: "Problème de paiement", message: "Je n'arrive pas à finaliser mon paiement.", status: "OPEN" }
    ]
  });

  await prisma.activityLog.createMany({
    data: [
      { userId: user.id, label: "Déclaration TVA Q4 2024", detail: "Soumise avec succès" },
      { userId: user.id, label: "Déclaration sociale", detail: "Envoyée" },
      { userId: user.id, label: "Nouvelle entreprise ajoutée", detail: "SARL Innovation Tech" }
    ]
  });

  const userFolder = saveDemoStorage(user, org, [alpha, beta], [fy2024], [dec1]);

  console.log("Base de données initialisée.");
  console.log(`Dossier utilisateur démo créé : ${userFolder}`);
  console.log("Admin: admin@tantordec.fr / Admin123!");
  console.log("Utilisateur: user@tantordec.fr / User123!");
}

main().finally(async () => prisma.$disconnect());
