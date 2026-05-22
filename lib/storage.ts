import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type BasicUser = { id: string; email: string; fullName?: string | null; role?: string | null };
type BasicOrganization = { id: string; name: string; plan?: string | null; createdAt?: Date | string };
type BasicCompany = { id: string; name: string; siren?: string | null; organizationId?: string | null };
type BasicDeclaration = { id: string; reference: string; type?: string | null; fiscalYear?: number | null; company?: BasicCompany | null };
type BasicInvoice = { id: string; number: string; amountHt?: number; vat?: number; amountTtc?: number; status?: string; issuedAt?: Date | string; paidAt?: Date | string | null; declaration?: (BasicDeclaration & { company?: BasicCompany | null }) | null; payment?: { reference?: string; method?: string; status?: string; paidAt?: Date | string } | null };

// En local, les fichiers sont écrits dans ./storage.
// Sur Vercel, le système de fichiers du projet est en lecture seule :
// on écrit donc temporairement dans /tmp pour éviter les erreurs serveur.
// Pour une vraie production, remplacer ceci par Supabase Storage / S3 / R2.
export const STORAGE_ROOT = process.env.TANTOR_STORAGE_DIR
  ? path.resolve(process.env.TANTOR_STORAGE_DIR)
  : process.env.VERCEL
    ? path.join("/tmp", "tantor-storage")
    : path.join(process.cwd(), "storage");

export function safeName(value: string | null | undefined) {
  const cleaned = String(value || "sans-nom")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || "sans-nom";
}

export function userStorageName(user: BasicUser) {
  return `${safeName(user.email)}_${user.id.slice(0, 8)}`;
}

export function userStorageRoot(user: BasicUser) {
  return path.join(STORAGE_ROOT, "users", userStorageName(user));
}

export function userStorageRelativePath(user: BasicUser) {
  return normalizeRelative(path.relative(process.cwd(), userStorageRoot(user)));
}

export function normalizeRelative(value: string) {
  return value.split(path.sep).join("/");
}

export async function ensureUserStorage(user: BasicUser) {
  const root = userStorageRoot(user);
  await mkdir(path.join(root, "01-profil"), { recursive: true });
  await mkdir(path.join(root, "02-entreprises"), { recursive: true });
  await mkdir(path.join(root, "03-exercices"), { recursive: true });
  await mkdir(path.join(root, "04-declarations"), { recursive: true });
  await mkdir(path.join(root, "05-edi"), { recursive: true });
  await mkdir(path.join(root, "06-factures"), { recursive: true });
  await mkdir(path.join(root, "07-recus"), { recursive: true });
  await mkdir(path.join(root, "08-support"), { recursive: true });
  return root;
}

async function writeJson(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  return filePath;
}

async function writeText(filePath: string, data: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, data, "utf8");
  return filePath;
}

function relativeFromProject(filePath: string) {
  return normalizeRelative(path.relative(process.cwd(), filePath));
}

export async function saveUserProfileSnapshot(user: BasicUser, organization?: BasicOrganization | null) {
  const root = await ensureUserStorage(user);
  const filePath = path.join(root, "01-profil", "profil-utilisateur.json");
  await writeJson(filePath, {
    exportedAt: new Date().toISOString(),
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    organization
  });
  return relativeFromProject(filePath);
}

export async function saveCompanySnapshot(user: BasicUser, company: BasicCompany & Record<string, unknown>) {
  const root = await ensureUserStorage(user);
  const companyDir = path.join(root, "02-entreprises", `${safeName(company.name)}_${safeName(company.siren || company.id)}`);
  const filePath = path.join(companyDir, "entreprise.json");
  await writeJson(filePath, { exportedAt: new Date().toISOString(), company });
  return relativeFromProject(filePath);
}

export async function saveFiscalYearSnapshot(user: BasicUser, fiscalYear: Record<string, unknown>, company?: BasicCompany | null) {
  const root = await ensureUserStorage(user);
  const companyName = company ? `${safeName(company.name)}_${safeName(company.siren || company.id)}` : "entreprise-inconnue";
  const fyName = safeName(`${fiscalYear.startDate || "debut"}_${fiscalYear.endDate || "fin"}`);
  const filePath = path.join(root, "03-exercices", companyName, `${fyName}.json`);
  await writeJson(filePath, { exportedAt: new Date().toISOString(), fiscalYear, company });
  return relativeFromProject(filePath);
}

export function declarationStorageDir(user: BasicUser, declaration: BasicDeclaration) {
  const companyPart = declaration.company ? `${safeName(declaration.company.name)}_${safeName(declaration.company.siren || declaration.company.id)}` : "entreprise";
  return path.join(userStorageRoot(user), "04-declarations", companyPart, `${safeName(declaration.reference)}_${declaration.id.slice(0, 8)}`);
}

export async function saveDeclarationSnapshot({
  user,
  declaration,
  values,
  anomalies
}: {
  user: BasicUser;
  declaration: BasicDeclaration & Record<string, unknown>;
  values?: Record<string, string>;
  anomalies?: string[];
}) {
  await ensureUserStorage(user);
  const dir = declarationStorageDir(user, declaration);
  const snapshot = {
    exportedAt: new Date().toISOString(),
    declaration,
    values: values ?? safeParseRecord((declaration as { valuesJson?: string }).valuesJson),
    anomalies: anomalies ?? safeParseArray((declaration as { anomaliesJson?: string }).anomaliesJson)
  };
  await writeJson(path.join(dir, "declaration.json"), snapshot);
  await writeJson(path.join(dir, "liasse-valeurs.json"), snapshot.values);
  await writeJson(path.join(dir, "anomalies.json"), snapshot.anomalies);
  return relativeFromProject(dir);
}

export async function saveEdiFile({ user, declaration, ediContent, ediFileName }: { user: BasicUser; declaration: BasicDeclaration; ediContent: string; ediFileName: string }) {
  await ensureUserStorage(user);
  const declarationDir = declarationStorageDir(user, declaration);
  const localDeclarationEdi = path.join(declarationDir, "edi", ediFileName);
  const globalEdi = path.join(userStorageRoot(user), "05-edi", ediFileName);
  await writeText(localDeclarationEdi, ediContent);
  await writeText(globalEdi, ediContent);
  return {
    declarationPath: relativeFromProject(localDeclarationEdi),
    ediPath: relativeFromProject(globalEdi)
  };
}

export function buildInvoiceText(invoice: BasicInvoice) {
  const company = invoice.declaration?.company;
  return [
    "TANTOR DÉC - FACTURE",
    `Facture : ${invoice.number}`,
    `Date : ${formatDateText(invoice.issuedAt)}`,
    "",
    "DESTINATAIRE",
    company?.name || "-",
    company?.siren ? `SIREN : ${company.siren}` : "",
    "",
    "SERVICE",
    "Prestation de dépôt fiscal",
    `Montant HT : ${formatMoney(invoice.amountHt)}`,
    `TVA : ${formatMoney(invoice.vat)}`,
    `Total TTC : ${formatMoney(invoice.amountTtc)}`,
    "",
    "RÈGLEMENT",
    `Statut : ${invoice.status || "-"}`,
    `Référence paiement : ${invoice.payment?.reference || "-"}`,
    `Mode : ${invoice.payment?.method || "Carte bancaire"}`
  ].filter(Boolean).join("\n");
}

export function buildReceiptText(invoice: BasicInvoice) {
  const declaration = invoice.declaration;
  const company = declaration?.company;
  return [
    "TANTOR DÉC - REÇU DE DÉPÔT EDI LOCAL",
    `Référence déclaration : ${declaration?.reference || "-"}`,
    `Facture : ${invoice.number}`,
    `Date : ${formatDateText(new Date())}`,
    "",
    "ENTREPRISE",
    company?.name || "-",
    company?.siren ? `SIREN : ${company.siren}` : "",
    "",
    "DÉCLARATION",
    declaration?.type || "-",
    declaration?.fiscalYear ? `Année fiscale : ${declaration.fiscalYear}` : "",
    "",
    "Statut local : accepté en simulation",
    "Ce reçu est généré localement pour le MVP. Il ne remplace pas un accusé DGFiP officiel."
  ].filter(Boolean).join("\n");
}

export async function saveInvoiceAndReceiptFiles(user: BasicUser, invoice: BasicInvoice) {
  const root = await ensureUserStorage(user);
  const invoiceBase = safeName(invoice.number);
  const invoiceJson = path.join(root, "06-factures", `${invoiceBase}.json`);
  const invoiceTxt = path.join(root, "06-factures", `${invoiceBase}.txt`);
  await writeJson(invoiceJson, { exportedAt: new Date().toISOString(), invoice });
  await writeText(invoiceTxt, buildInvoiceText(invoice));

  let receiptPath: string | null = null;
  if (invoice.declaration) {
    const receiptFile = `${safeName(invoice.declaration.reference)}_recu-local.txt`;
    const receiptAbs = path.join(root, "07-recus", receiptFile);
    await writeText(receiptAbs, buildReceiptText(invoice));
    receiptPath = relativeFromProject(receiptAbs);
  }

  return {
    invoiceJsonPath: relativeFromProject(invoiceJson),
    invoiceTextPath: relativeFromProject(invoiceTxt),
    receiptPath
  };
}

export async function saveSupportTicketSnapshot(user: BasicUser | null | undefined, ticket: Record<string, unknown>) {
  if (!user) return null;
  const root = await ensureUserStorage(user);
  const filePath = path.join(root, "08-support", `${safeName(String(ticket.id || Date.now()))}.json`);
  await writeJson(filePath, { exportedAt: new Date().toISOString(), ticket });
  return relativeFromProject(filePath);
}

export async function listUserStorageFiles(user: BasicUser) {
  const root = await ensureUserStorage(user);
  const results: Array<{ name: string; path: string; size: number; updatedAt: Date; type: string }> = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        const info = await stat(full);
        const rel = relativeFromProject(full);
        results.push({ name: entry.name, path: rel, size: info.size, updatedAt: info.mtime, type: path.extname(entry.name).replace(".", "") || "fichier" });
      }
    }
  }

  await walk(root);
  return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function readStorageFile(relativePath: string) {
  const absolute = path.resolve(process.cwd(), relativePath);
  const storageRoot = path.resolve(STORAGE_ROOT);
  if (!absolute.startsWith(storageRoot)) throw new Error("Chemin de stockage invalide.");
  return readFile(absolute, "utf8");
}

function safeParseRecord(value?: string) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function safeParseArray(value?: string) {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDateText(value?: Date | string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value || 0);
}
