export const DECLARATION_FIELD_LABELS: Record<string, string> = {
  AA: "2050 - Capital souscrit non appelé (brut)",
  AB: "2050 - Frais d'établissement (brut)",
  AC: "2050 - Frais d'établissement (amortissements/provisions)",
  AD: "2050 - Frais d'établissement (net)",
  CX: "2050 - Frais de développement (brut)",
  CQ: "2050 - Frais de développement (amortissements/provisions)",
  CR: "2050 - Frais de développement (net)",
  AF: "2050 - Concessions, brevets et droits similaires (brut)",
  AG: "2050 - Concessions, brevets et droits similaires (amortissements/provisions)",
  AH_NET: "2050 - Concessions, brevets et droits similaires (net)",
  AH: "2050 - Fonds commercial (brut)",
  AI: "2050 - Fonds commercial (provisions)",
  AJ: "2050 - Fonds commercial (net)",
  AK: "2050 - Autres immobilisations incorporelles (brut)",
  AL: "2050 - Autres immobilisations incorporelles (amortissements/provisions)",
  AM: "2050 - Autres immobilisations incorporelles (net)",
  AN: "2050 - Immobilisations corporelles (brut)",
  AO: "2050 - Immobilisations corporelles (amortissements/provisions)",
  AP: "2050 - Immobilisations corporelles (net)",
  BR: "2050 - Créances clients (net)",
  BT: "2050 - Disponibilités (net)",
  totalActifBrut: "2050 - Total actif brut",
  totalActifAmort: "2050 - Total amortissements/provisions actif",
  totalActifNet: "2050 - Total actif net",
  DA: "2051 - Capital social",
  DB: "2051 - Réserves",
  DC: "2051 - Résultat de l'exercice",
  DD: "2051 - Provisions",
  DE: "2051 - Emprunts et dettes financières",
  DF: "2051 - Dettes fournisseurs",
  DG: "2051 - Dettes fiscales et sociales",
  totalPassif: "2051 - Total passif",
  FA: "2052 - Ventes de marchandises",
  FB: "2052 - Production vendue",
  FC: "2052 - Subventions d'exploitation",
  FD: "2052 - Autres produits",
  totalProduits: "2052 - Total produits",
  GA: "2052 - Achats de marchandises",
  GB: "2052 - Impôts et taxes",
  GC: "2052 - Salaires et traitements",
  GD: "2052 - Charges sociales",
  GE: "2052 - Dotations aux amortissements",
  GF: "2052 - Autres charges",
  totalCharges: "2052 - Total charges",
  resultExercice: "2052 - Résultat de l'exercice"
};

export const DECLARATION_FIELD_KEYS = Object.keys(DECLARATION_FIELD_LABELS);

function normalizeNumber(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/,/g, ".")
    .trim();
}

export function toNumber(value: string | number | null | undefined): number | null {
  const normalized = normalizeNumber(value);
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatAmountForEdi(value: string | number | null | undefined) {
  const number = toNumber(value);
  if (number === null) return "";
  return number.toFixed(2);
}

function amount(values: Record<string, string>, key: string) {
  return toNumber(values[key]);
}

function present(values: Record<string, string>, key: string) {
  return String(values[key] ?? "").trim() !== "";
}

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) < 0.01;
}

function sumKnown(values: Record<string, string>, keys: string[]) {
  let total = 0;
  let hasAny = false;
  for (const key of keys) {
    const value = amount(values, key);
    if (value !== null) {
      total += value;
      hasAny = true;
    }
  }
  return hasAny ? total : null;
}

function checkNet(
  anomalies: string[],
  values: Record<string, string>,
  brutKey: string,
  amortKey: string,
  netKey: string,
  label: string
) {
  const brut = amount(values, brutKey) ?? 0;
  const amort = amount(values, amortKey) ?? 0;
  const net = amount(values, netKey);
  if (net === null && (present(values, brutKey) || present(values, amortKey))) {
    anomalies.push(`Bloquant — ${label} : la colonne net est obligatoire dès qu'un brut ou un amortissement est saisi.`);
    return;
  }
  if (net !== null && !nearlyEqual(net, brut - amort)) {
    anomalies.push(`Bloquant — ${label} : le net doit être égal au brut moins les amortissements/provisions.`);
  }
}

export function collectDeclarationValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of DECLARATION_FIELD_KEYS) {
    values[key] = String(formData.get(key) ?? "").trim();
  }
  return values;
}

export function validateDeclarationValues(values: Record<string, string>) {
  const anomalies: string[] = [];

  const required = [
    ["totalActifNet", "Total actif net"],
    ["totalPassif", "Total passif"],
    ["totalProduits", "Total produits"],
    ["totalCharges", "Total charges"],
    ["resultExercice", "Résultat de l'exercice"]
  ] as const;

  for (const [key, label] of required) {
    if (!present(values, key)) anomalies.push(`Bloquant — ${label} manquant.`);
  }

  for (const key of DECLARATION_FIELD_KEYS) {
    if (present(values, key) && amount(values, key) === null) {
      anomalies.push(`Bloquant — ${DECLARATION_FIELD_LABELS[key]} doit être un montant numérique.`);
    }
  }

  const nonNegativeKeys = DECLARATION_FIELD_KEYS.filter(key => !["DC", "resultExercice"].includes(key));
  for (const key of nonNegativeKeys) {
    const value = amount(values, key);
    if (value !== null && value < 0) anomalies.push(`Bloquant — ${DECLARATION_FIELD_LABELS[key]} ne peut pas être négatif.`);
  }

  checkNet(anomalies, values, "AB", "AC", "AD", "Frais d'établissement");
  checkNet(anomalies, values, "CX", "CQ", "CR", "Frais de développement");
  checkNet(anomalies, values, "AF", "AG", "AH_NET", "Concessions, brevets et droits similaires");
  checkNet(anomalies, values, "AH", "AI", "AJ", "Fonds commercial");
  checkNet(anomalies, values, "AK", "AL", "AM", "Autres immobilisations incorporelles");
  checkNet(anomalies, values, "AN", "AO", "AP", "Immobilisations corporelles");

  const totalActifBrut = amount(values, "totalActifBrut");
  const totalActifAmort = amount(values, "totalActifAmort");
  const totalActifNet = amount(values, "totalActifNet");
  const totalPassif = amount(values, "totalPassif");

  const computedActifNet = sumKnown(values, ["AA", "AD", "CR", "AH_NET", "AJ", "AM", "AP", "BR", "BT"]);
  if (totalActifNet !== null && computedActifNet !== null && !nearlyEqual(totalActifNet, computedActifNet)) {
    anomalies.push("Bloquant — Total actif net incohérent avec la somme des lignes 2050 renseignées.");
  }

  if (totalActifBrut !== null && totalActifAmort !== null && totalActifNet !== null && !nearlyEqual(totalActifNet, totalActifBrut - totalActifAmort)) {
    anomalies.push("Bloquant — Total actif net doit être égal au total brut moins les amortissements/provisions.");
  }

  if (totalActifNet !== null && totalPassif !== null && !nearlyEqual(totalActifNet, totalPassif)) {
    anomalies.push("Bloquant — Total actif net différent du total passif.");
  }

  const computedPassif = sumKnown(values, ["DA", "DB", "DC", "DD", "DE", "DF", "DG"]);
  if (totalPassif !== null && computedPassif !== null && !nearlyEqual(totalPassif, computedPassif)) {
    anomalies.push("Bloquant — Total passif incohérent avec la somme des lignes 2051 renseignées.");
  }

  const totalProduits = amount(values, "totalProduits");
  const totalCharges = amount(values, "totalCharges");
  const resultExercice = amount(values, "resultExercice");
  const computedProduits = sumKnown(values, ["FA", "FB", "FC", "FD"]);
  const computedCharges = sumKnown(values, ["GA", "GB", "GC", "GD", "GE", "GF"]);

  if (totalProduits !== null && computedProduits !== null && !nearlyEqual(totalProduits, computedProduits)) {
    anomalies.push("Bloquant — Total produits incohérent avec la somme des lignes 2052.");
  }

  if (totalCharges !== null && computedCharges !== null && !nearlyEqual(totalCharges, computedCharges)) {
    anomalies.push("Bloquant — Total charges incohérent avec la somme des lignes 2052.");
  }

  if (totalProduits !== null && totalCharges !== null && resultExercice !== null && !nearlyEqual(resultExercice, totalProduits - totalCharges)) {
    anomalies.push("Bloquant — Résultat de l'exercice doit être égal à Total produits moins Total charges.");
  }

  if (present(values, "AH") && !present(values, "AJ")) {
    anomalies.push("Bloquant — Fonds commercial renseigné : la valeur nette doit être indiquée.");
  }

  return anomalies;
}
