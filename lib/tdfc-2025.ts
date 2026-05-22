import { DECLARATION_FIELD_KEYS, DECLARATION_FIELD_LABELS, formatAmountForEdi } from "@/lib/tax-rules";
import { getOfficialTdfcField, TDFC_OFFICIAL_SOURCE } from "@/lib/tdfc-dictionary";

export type TdfcSegmentType = "RFF" | "MOA" | "FTX" | "DTM" | "QTY" | "CUX" | "PCD" | "NAD" | "CCI";

export type TdfcFieldDefinition = {
  key: string;
  form: string;
  millesime: string;
  formRepeat: string;
  dataRepeat: string;
  code: string;
  segment: TdfcSegmentType;
  label: string;
  required?: boolean;
};

export const TDFC_CAMPAIGN = {
  year: "2025",
  millesime: "25",
  interchangeAgreement: "PED-DGI-IN-TD2501",
  functionalVersion: "FD2501",
  documentCode: "IDF",
  messageType: "INFENT",
  messageDirectory: "D:00B:UN:FD2501",
  currency: "EUR"
};

const moneyMap: Record<string, { form: string; code: string }> = {
  AA: { form: "2050", code: "AA" },
  AB: { form: "2050", code: "AB" },
  AC: { form: "2050", code: "AC" },
  AD: { form: "2050", code: "AD" },
  CX: { form: "2050", code: "CX" },
  CQ: { form: "2050", code: "CQ" },
  CR: { form: "2050", code: "CR" },
  AF: { form: "2050", code: "AF" },
  AG: { form: "2050", code: "AG" },
  AH_NET: { form: "2050", code: "AI" },
  AH: { form: "2050", code: "AH" },
  AI: { form: "2050", code: "AJ" },
  AJ: { form: "2050", code: "AK" },
  AK: { form: "2050", code: "AL" },
  AL: { form: "2050", code: "AM" },
  AM: { form: "2050", code: "AN" },
  AN: { form: "2050", code: "AP" },
  AO: { form: "2050", code: "AQ" },
  AP: { form: "2050", code: "AR" },
  BR: { form: "2050", code: "BR" },
  BT: { form: "2050", code: "BT" },
  totalActifBrut: { form: "2050", code: "CO" },
  totalActifAmort: { form: "2050", code: "CP" },
  totalActifNet: { form: "2050", code: "CQ" },
  DA: { form: "2051", code: "DA" },
  DB: { form: "2051", code: "DB" },
  DC: { form: "2051", code: "DC" },
  DD: { form: "2051", code: "DD" },
  DE: { form: "2051", code: "DE" },
  DF: { form: "2051", code: "DF" },
  DG: { form: "2051", code: "DG" },
  totalPassif: { form: "2051", code: "EE" },
  FA: { form: "2052", code: "FA" },
  FB: { form: "2052", code: "FB" },
  FC: { form: "2052", code: "FC" },
  FD: { form: "2052", code: "FD" },
  totalProduits: { form: "2052", code: "FL" },
  GA: { form: "2052", code: "GA" },
  GB: { form: "2052", code: "GB" },
  GC: { form: "2052", code: "GC" },
  GD: { form: "2052", code: "GD" },
  GE: { form: "2052", code: "GE" },
  GF: { form: "2052", code: "GF" },
  totalCharges: { form: "2052", code: "GU" },
  resultExercice: { form: "2052", code: "HN" }
};

function normalizeFormName(form: string) {
  return form.padEnd(10, " ").slice(0, 10);
}

function repeat(value = "0000") {
  return value.padStart(4, "0").slice(-4);
}

export function buildTdfcDataCode(input: {
  form: string;
  millesime?: string;
  formRepeat?: string;
  dataRepeat?: string;
  code: string;
  segment: TdfcSegmentType;
}) {
  return `${normalizeFormName(input.form)}${input.millesime ?? TDFC_CAMPAIGN.millesime}${repeat(input.formRepeat)}${repeat(input.dataRepeat)}${input.code}${input.segment}`;
}

export const TDFC_FIELD_DEFINITIONS: TdfcFieldDefinition[] = DECLARATION_FIELD_KEYS.map((key) => {
  const meta = moneyMap[key] || { form: "2050", code: key.slice(0, 2).toUpperCase() };
  const official = getOfficialTdfcField(meta.form, meta.code, "MOA");
  return {
    key,
    form: meta.form,
    millesime: official?.millesime || TDFC_CAMPAIGN.millesime,
    formRepeat: "0000",
    dataRepeat: official?.dataIndex || "0000",
    code: meta.code,
    segment: "MOA",
    label: official?.label || DECLARATION_FIELD_LABELS[key],
    required: ["totalActifNet", "totalPassif", "totalProduits", "totalCharges", "resultExercice"].includes(key)
  };
});

export const TDFC_DICTIONARY_INFO = TDFC_OFFICIAL_SOURCE;

export const F_IDENTIF_FIELDS: TdfcFieldDefinition[] = [
  { key: "SIREN", form: "F-IDENTIF", millesime: TDFC_CAMPAIGN.millesime, formRepeat: "0000", dataRepeat: "0000", code: "AA", segment: "RFF", label: "SIREN / identifiant déclarant", required: true },
  { key: "ROF", form: "F-IDENTIF", millesime: TDFC_CAMPAIGN.millesime, formRepeat: "0000", dataRepeat: "0000", code: "AB", segment: "RFF", label: "Référence d’obligation fiscale", required: true },
  { key: "PERIODE", form: "F-IDENTIF", millesime: TDFC_CAMPAIGN.millesime, formRepeat: "0000", dataRepeat: "0000", code: "AC", segment: "DTM", label: "Période de déclaration", required: true },
  { key: "MONNAIE", form: "F-IDENTIF", millesime: TDFC_CAMPAIGN.millesime, formRepeat: "0000", dataRepeat: "0000", code: "DA", segment: "CUX", label: "Monnaie de souscription", required: true }
];

function sanitize(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/[+'\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function edifactDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function edifactDateYYMMDD(date = new Date()) {
  const full = edifactDate(date);
  return full.slice(2);
}

function edifactTime(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
}

function interchangeRef(reference: string, partnerApproval = "0000000") {
  const digits = reference.replace(/\D/g, "").slice(-6).padStart(6, "0");
  const year = String(new Date().getFullYear()).slice(-1);
  return `${partnerApproval.replace(/\D/g, "").padStart(7, "0").slice(0, 7)}${year}${digits}`.slice(0, 14);
}

function amountToMoa(value: string | number | null | undefined) {
  const formatted = formatAmountForEdi(value);
  if (formatted === "") return null;
  const numeric = Number(String(formatted).replace(",", "."));
  const abs = Math.abs(Math.trunc(numeric));
  return { amount: String(abs), status: numeric < 0 ? "65" : numeric === 0 ? "62" : undefined };
}

export type TdfcGenerationInput = {
  reference: string;
  values: Record<string, string>;
  fiscalYear: number;
  company: {
    name: string;
    siren: string;
    siret?: string | null;
    taxRegime?: string | null;
    legalForm?: string | null;
    address?: string | null;
  };
  fiscalPeriod?: { startDate?: Date | string | null; endDate?: Date | string | null } | null;
  partner?: {
    approvalNumber?: string;
    name?: string;
    softwareEditor?: string;
    softwareName?: string;
    softwareVersion?: string;
    conformityCertificate?: string;
    alias?: string;
  };
  testMode?: boolean;
};

export function makeTdfc2025FileName(reference: string) {
  return `${reference.replace(/[^A-Z0-9-]/gi, "_")}_INFENT_DF_TDFC_2025_TEST.edi`;
}

export function buildTdfc2025InfentDf(data: TdfcGenerationInput) {
  const now = new Date();
  const partner = {
    approvalNumber: data.partner?.approvalNumber || "0000000",
    name: data.partner?.name || "Tantor Dec Demo",
    softwareEditor: data.partner?.softwareEditor || "Tantor Dec",
    softwareName: data.partner?.softwareName || "Tantor Dec MVP",
    softwareVersion: data.partner?.softwareVersion || "0.1-test",
    conformityCertificate: data.partner?.conformityCertificate || "NON-HOMOLOGUE-TEST",
    alias: data.partner?.alias || "TDEMO000"
  };
  const ref = interchangeRef(data.reference, partner.approvalNumber);
  const messageRef = "00001";
  const documentReference = `INFENT${data.reference.replace(/[^A-Z0-9-]/gi, "").slice(-29)}`;
  const siren = sanitize(data.company.siren).replace(/\s/g, "").slice(0, 9);
  const rof = (data.company.taxRegime || "IS").toUpperCase().includes("BIC") ? "BIC1" : "IS1";
  const periodStart = edifactDate(data.fiscalPeriod?.startDate) || `${data.fiscalYear}0101`;
  const periodEnd = edifactDate(data.fiscalPeriod?.endDate) || `${data.fiscalYear}1231`;

  const segments: string[] = [];
  segments.push("# FICHIER INFENT DF EDI-TDFC 2025 DE TEST - NON HOMOLOGUE DGFiP");
  segments.push(`# Dictionnaire officiel intégré : ${TDFC_OFFICIAL_SOURCE.dictionaryVersion} / campagne ${TDFC_OFFICIAL_SOURCE.campaign}.`);
  segments.push("# Généré par Tantor Déc pour contrôle interne et démonstration.");
  segments.push("# La télétransmission réelle exige un partenaire EDI habilité, AUTACK et une attestation de conformité.");
  segments.push("UNA:+,? '");
  segments.push(`UNB+UNOL:3+${partner.approvalNumber}:146:${partner.alias}+DGI_EDI_TDFC+${edifactDateYYMMDD(now)}:${edifactTime(now)}+${ref}++++++${TDFC_CAMPAIGN.interchangeAgreement}${data.testMode === false ? "" : "+1"}'`);
  segments.push(`UNG+INFENT+${data.testMode === false ? "DF1" : "DF4"}:146+EDI_TDFC+${edifactDateYYMMDD(now)}:${edifactTime(now)}+1+UN+D:00B:${TDFC_CAMPAIGN.functionalVersion}'`);
  segments.push(`UNH+${messageRef}+INFENT:${TDFC_CAMPAIGN.messageDirectory}'`);
  segments.push(`BGM+${TDFC_CAMPAIGN.documentCode}:71:211+${sanitize(documentReference)}'`);
  segments.push(`DTM+242:${edifactDate(now)}:102'`);
  segments.push(`RFF+AUM:${sanitize(partner.softwareEditor)}'`);
  segments.push(`RFF+AUN:${sanitize(partner.softwareName)}::${sanitize(partner.softwareVersion)}'`);
  segments.push(`RFF+AUO:${sanitize(partner.conformityCertificate)}'`);
  segments.push(`NAD+MS+${partner.approvalNumber}:100:268++${sanitize(partner.name)}'`);
  segments.push("NAD+MR+++DGI_EDI_TDFC'");

  let seq = 1;
  function pushSeqInd(def: TdfcFieldDefinition, valueSegments: string[]) {
    segments.push(`SEQ+${seq}'`);
    segments.push(`IND+${buildTdfcDataCode(def)}'`);
    segments.push(...valueSegments);
    seq += 1;
  }

  const findIdent = (key: string) => F_IDENTIF_FIELDS.find((f) => f.key === key)!;
  pushSeqInd(findIdent("SIREN"), [`RFF+ZZZ:${siren}'`]);
  pushSeqInd(findIdent("ROF"), [`RFF+ZZZ:${rof}'`]);
  pushSeqInd(findIdent("PERIODE"), [`DTM+ZZZ:${periodStart}${periodEnd}:718'`]);
  pushSeqInd(findIdent("MONNAIE"), [`CUX+3:${TDFC_CAMPAIGN.currency}'`]);

  for (const def of TDFC_FIELD_DEFINITIONS) {
    const moa = amountToMoa(data.values[def.key]);
    if (!moa) continue;
    const status = moa.status ? `:::${moa.status}` : "";
    pushSeqInd(def, [`MOA+ZZZ:${moa.amount}${status}'`]);
  }

  segments.push(`UNT+${segments.filter((s) => !s.startsWith("#")).length - 3 + 2}+${messageRef}'`);
  segments.push(`UNE+1+1'`);
  segments.push(`UNG+AUTACK+${data.testMode === false ? "AC1" : "AC4"}:146+EDI_TDFC+${edifactDateYYMMDD(now)}:${edifactTime(now)}+2+UN+D:96A:AF1301'`);
  segments.push("UNH+00002+AUTACK:D:96A:UN:AF1301'");
  segments.push("BGM+AUTACK+SIGNATURE-DEMO-NON-PRODUCTION'");
  segments.push("FTX+AAI+++AUTACK non généré dans cette version de test Tantor Déc'");
  segments.push("UNT+4+00002'");
  segments.push("UNE+1+2'");
  segments.push(`UNZ+2+${ref}'`);
  return segments.join("\n") + "\n";
}

export function previewTdfcMappedFields(values: Record<string, string>) {
  return TDFC_FIELD_DEFINITIONS.map((def) => ({
    ...def,
    ediCode: buildTdfcDataCode(def),
    value: values[def.key] || ""
  }));
}
