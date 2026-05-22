import fields from "@/data/tdfc2025-fields.json";
import forms from "@/data/tdfc2025-forms.json";
import tables from "@/data/tdfc2025-tables.json";
import type { TdfcSegmentType } from "@/lib/tdfc-2025";

export type OfficialTdfcField = {
  form: string;
  millesime: string;
  code: string;
  segment: TdfcSegmentType;
  dataIndex: string;
  repeatability: string;
  change: string;
  label: string;
  tableEdi?: string;
  groupLabel?: string;
  details: Array<{
    codificationEdi: string;
    composite: string;
    simple: string;
    simpleIndex: string;
    label: string;
    tableEdi: string;
    change: string;
  }>;
};

export type OfficialTdfcForm = { form: string; millesime: string; flags: string; documentCodes: string; raw: string; };
export type OfficialTdfcTableValue = { table: string; value: string; label: string; };

export const TDFC_OFFICIAL_SOURCE = {
  campaign: "2025",
  dictionaryVersion: "V2025.7",
  files: [
    "DICTIONNAIRE TDFC 2024-2025 EDITEURS V2025.7.xls",
    "Structure Tables TDFC 2025 / tdfc25d.edi",
    "Structure Tables TDFC 2025 / tdfc25f.edi"
  ]
};

export const OFFICIAL_TDFC_FIELDS = fields as OfficialTdfcField[];
export const OFFICIAL_TDFC_FORMS = forms as OfficialTdfcForm[];
export const OFFICIAL_TDFC_TABLES = tables as OfficialTdfcTableValue[];

export function normalizeTdfcForm(form: string) {
  return String(form || "").trim().toUpperCase();
}

export function getOfficialTdfcField(form: string, code: string, segment?: TdfcSegmentType) {
  const f = normalizeTdfcForm(form);
  const c = String(code || "").trim().toUpperCase();
  return OFFICIAL_TDFC_FIELDS.find((item) =>
    normalizeTdfcForm(item.form) === f &&
    item.code.toUpperCase() === c &&
    (!segment || item.segment === segment) &&
    item.change !== "SUPPRESSION"
  );
}

export function getOfficialTdfcFieldsByForm(form: string) {
  const f = normalizeTdfcForm(form);
  return OFFICIAL_TDFC_FIELDS.filter((item) => normalizeTdfcForm(item.form) === f && item.change !== "SUPPRESSION");
}

export function searchOfficialTdfcFields(query: string, limit = 80) {
  const q = String(query || "").trim().toLowerCase();
  const source = OFFICIAL_TDFC_FIELDS.filter((item) => item.change !== "SUPPRESSION");
  if (!q) return source.slice(0, limit);
  return source.filter((item) =>
    item.form.toLowerCase().includes(q) ||
    item.code.toLowerCase().includes(q) ||
    item.segment.toLowerCase().includes(q) ||
    item.label.toLowerCase().includes(q) ||
    item.groupLabel?.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function getOfficialTdfcForm(form: string) {
  const f = normalizeTdfcForm(form);
  return OFFICIAL_TDFC_FORMS.find((item) => normalizeTdfcForm(item.form) === f);
}

export function getOfficialTdfcTableValues(table: string) {
  const t = String(table || "").trim().toUpperCase();
  return OFFICIAL_TDFC_TABLES.filter((item) => item.table.toUpperCase() === t);
}
