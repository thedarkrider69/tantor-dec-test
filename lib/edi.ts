import { DECLARATION_FIELD_LABELS, DECLARATION_FIELD_KEYS, formatAmountForEdi } from "@/lib/tax-rules";

function sanitizeSegmentValue(value: string | number | Date | null | undefined) {
  return String(value ?? "")
    .replace(/[+'\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function compactTime(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
}

export type EdiDeclarationData = {
  reference: string;
  type: string;
  fiscalYear: number;
  dueDate?: Date | string | null;
  createdAt?: Date | string | null;
  values: Record<string, string>;
  company: {
    name: string;
    siren: string;
    siret?: string | null;
    legalForm?: string | null;
    taxRegime?: string | null;
    vatRegime?: string | null;
    address?: string | null;
  };
  fiscalPeriod?: {
    startDate?: Date | string | null;
    endDate?: Date | string | null;
  } | null;
};

export function makeEdiFileName(reference: string) {
  return `${reference.replace(/[^A-Z0-9-]/gi, "_")}_TDFC_LOCAL_TEST.edi`;
}

export function buildLocalEdiTdfc(data: EdiDeclarationData) {
  const now = new Date();
  const control = data.reference.replace(/[^A-Z0-9]/gi, "").slice(-14) || "TANTORLOCAL";
  const segments: string[] = [];
  segments.push("# FICHIER LOCAL DE TEST - NON HOMOLOGUE DGFiP");
  segments.push("# Ce fichier sert uniquement à valider le parcours Tantor Déc en local.");
  segments.push("# Pour la production, il faudra remplacer ce générateur par le cahier des charges EDI-TDFC officiel ou l'API d'un partenaire EDI habilité.");
  segments.push(`UNB+UNOC:3+TANTORDEC-DEMO+PARTENAIRE-EDI-DEMO+${compactDate(now)}:${compactTime(now)}+${sanitizeSegmentValue(control)}'`);
  segments.push(`UNH+${sanitizeSegmentValue(control)}+TDFC:D:LOCAL:TANTOR'`);
  segments.push(`BGM+TDFC+${sanitizeSegmentValue(data.reference)}+9'`);
  segments.push(`DTM+137:${compactDate(now)}:102'`);
  segments.push(`DTM+194:${compactDate(data.dueDate)}:102'`);
  segments.push(`NAD+DT+++${sanitizeSegmentValue(data.company.name)}'`);
  segments.push(`RFF+SIREN:${sanitizeSegmentValue(data.company.siren)}'`);
  if (data.company.siret) segments.push(`RFF+SIRET:${sanitizeSegmentValue(data.company.siret)}'`);
  if (data.company.address) segments.push(`ADR+${sanitizeSegmentValue(data.company.address)}'`);
  segments.push(`TAX+7+${sanitizeSegmentValue(data.company.taxRegime || "IS")}'`);
  segments.push(`FTX+REG+++${sanitizeSegmentValue(data.company.legalForm || "")}/${sanitizeSegmentValue(data.company.vatRegime || "")}'`);
  segments.push(`RFF+EXERCICE:${sanitizeSegmentValue(String(data.fiscalYear))}'`);
  if (data.fiscalPeriod?.startDate || data.fiscalPeriod?.endDate) {
    segments.push(`DTM+718:${compactDate(data.fiscalPeriod?.startDate)}-${compactDate(data.fiscalPeriod?.endDate)}:718'`);
  }
  segments.push("DOC+2050+BILAN ACTIF'");
  segments.push("DOC+2051+BILAN PASSIF'");
  segments.push("DOC+2052+COMPTE DE RESULTAT'");

  let fieldCount = 0;
  for (const key of DECLARATION_FIELD_KEYS) {
    const rawValue = data.values[key];
    const amount = formatAmountForEdi(rawValue);
    if (amount === "") continue;
    fieldCount += 1;
    segments.push(`MOA+${sanitizeSegmentValue(key)}:${amount}:EUR'`);
    segments.push(`FTX+LIB+++${sanitizeSegmentValue(DECLARATION_FIELD_LABELS[key])}'`);
  }

  segments.push(`CNT+2:${fieldCount}'`);
  segments.push(`UNT+${segments.length + 2}+${sanitizeSegmentValue(control)}'`);
  segments.push(`UNZ+1+${sanitizeSegmentValue(control)}'`);
  return segments.join("\n") + "\n";
}
