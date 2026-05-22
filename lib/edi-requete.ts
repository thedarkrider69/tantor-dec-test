function sanitizeSegmentValue(value: string | number | Date | null | undefined) {
  return String(value ?? "")
    .replace(/[+'\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactDate(date: Date | string | null | undefined = new Date()) {
  const d = date ? new Date(date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function compactShortDate(date = new Date()) {
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function compactTime(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
}

export function normalizeSiren(value: string) {
  return String(value || "").replace(/\D/g, "").slice(0, 9);
}

export function isValidSirenFormat(value: string) {
  return /^\d{9}$/.test(normalizeSiren(value));
}

export type EdiLocRequestData = {
  reference: string;
  requesterSiren: string;
  taxpayerSiren: string;
  unitMode: boolean;
  company: {
    name: string;
    siren: string;
    legalForm?: string | null;
    address?: string | null;
  };
  partner?: {
    approvalNumber?: string;
    name?: string;
  };
};

export function makeEdiLocFileName(reference: string) {
  return `${reference.replace(/[^A-Z0-9-]/gi, "_")}_INFENT_RQ_LOC_TEST.edi`;
}

export function buildLocalEdiLocRequest(data: EdiLocRequestData) {
  const now = new Date();
  const control = data.reference.replace(/[^A-Z0-9]/gi, "").slice(-14).padStart(14, "0");
  const messageRef = "00001";
  const partnerId = sanitizeSegmentValue(data.partner?.approvalNumber || "0000000");
  const requesterSiren = normalizeSiren(data.requesterSiren);
  const taxpayerSiren = normalizeSiren(data.taxpayerSiren);
  const lines: string[] = [];

  lines.push("# FICHIER LOCAL DE TEST - NON HOMOLOGUE DGFiP");
  lines.push("# Prototype Tantor Déc : demande EDI Requête LOC / INFENT RQ.");
  lines.push("# Production réelle : partenaire EDI habilité, AUTACK, contrôles DGFiP, CFT/FTPS et attestation de conformité requis.");
  lines.push("UNA:+,? '");
  lines.push(`UNB+UNOL:3+${partnerId}:146:TDEMO000+ DGI_EDI_REQ+${compactShortDate(now)}:${compactTime(now)}+${control}++++++PED-DGI-IN-RQ1301/LOC16+1'`);
  lines.push(`UNG+INFENT+RQ3:146+EDI_REQ+${compactShortDate(now)}:${compactTime(now)}+1+UN+D:00B:RD1301'`);
  lines.push(`UNH+${messageRef}+INFENT:D:00B:UN:RD1301'`);
  lines.push(`BGM+LOC:71:211+INFENT${sanitizeSegmentValue(data.reference)}'`);
  lines.push(`DTM+242:${compactDate(now)}:102'`);
  lines.push("RFF+AUM:TANTOR DEC DEMO'");
  lines.push("RFF+AUN:TantorDec-MVP:1.0:0'");
  lines.push("RFF+AUO:ATTESTATION-DEMO-NON-HOMOLOGUEE'");
  lines.push(`NAD+MS+${partnerId}:100:268++${sanitizeSegmentValue(data.partner?.name || "Tantor Dec Demo")}'`);
  lines.push("NAD+MR+++DGI_EDI_REQ'");

  // Section détail - formulaire R-IDENTIF.
  lines.push("SEQ+1'");
  lines.push("IND+R-IDENTIF 0000000000AANAD'");
  lines.push(`NAD+AA+${requesterSiren}:100:107++${sanitizeSegmentValue(data.company.name)}'`);
  lines.push("SEQ+2'");
  lines.push("IND+R-IDENTIF 0000000000ABNAD'");
  lines.push(`NAD+AB+${taxpayerSiren}:100:107++${sanitizeSegmentValue(data.company.name)}'`);
  lines.push("SEQ+3'");
  lines.push("IND+R-IDENTIF 0000000000BACCI'");
  lines.push("CCI+ZZZ++REQ:LOC:211'");
  if (data.unitMode) {
    lines.push("SEQ+4'");
    lines.push("IND+R-IDENTIF 0000000000BBCCI'");
    lines.push("CCI+ZZZ++TBX:X:211'");
  }

  lines.push(`UNT+${lines.filter(l => !l.startsWith("#")).length + 2}+${messageRef}'`);
  lines.push("UNE+1+1'");
  lines.push(`UNZ+1+${control}'`);
  return lines.join("\n") + "\n";
}

export function buildSimulatedLocResponse(data: EdiLocRequestData) {
  const taxpayerSiren = normalizeSiren(data.taxpayerSiren);
  const seed = Number(taxpayerSiren.slice(-3) || "1");
  const refLocal = `${taxpayerSiren}${String(seed).padStart(3, "0")}LOC000000000` .slice(0, 24).padEnd(24, "0");
  const invariant = `${taxpayerSiren}${String(seed % 1000).padStart(3, "0")}`.slice(0, 12).padEnd(12, "0");
  return {
    responseType: "INFENT REP LOC SIMULE",
    generatedAt: new Date().toISOString(),
    requestReference: data.reference,
    requesterSiren: normalizeSiren(data.requesterSiren),
    taxpayerSiren,
    forms: ["R-IDENTIF", "R-LISTELOC"],
    obligationsCfe: [
      {
        rof: "CFE1",
        activityCode: "6202A",
        address: data.company.address || "12 rue des Entrepreneurs, 75015 Paris",
        locals: [
          {
            localReference: refLocal,
            invariant,
            occupation: "0",
            parking: false,
            basement: false,
            mainSurface: 120,
            coveredSecondarySurface: 15,
            uncoveredSecondarySurface: 0,
            coveredParkingSurface: 0,
            uncoveredParkingSurface: 0,
            revisedCategory: "MAG1"
          }
        ]
      }
    ],
    note: "Réponse fictive générée pour tester l'interface. Ne constitue pas une réponse DGFiP officielle."
  };
}
