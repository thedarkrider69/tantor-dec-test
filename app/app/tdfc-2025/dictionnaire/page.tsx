import Link from "next/link";
import { buildTdfcDataCode } from "@/lib/tdfc-2025";
import { OFFICIAL_TDFC_FIELDS, OFFICIAL_TDFC_FORMS, TDFC_OFFICIAL_SOURCE, searchOfficialTdfcFields } from "@/lib/tdfc-dictionary";

export default function TdfcDictionaryPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";
  const results = searchOfficialTdfcFields(query, 120);
  const activeForms = OFFICIAL_TDFC_FORMS.filter((form) => form.documentCodes.includes("IDF"));
  const segmentCounts = OFFICIAL_TDFC_FIELDS.reduce<Record<string, number>>((acc, field) => {
    if (field.change === "SUPPRESSION") return acc;
    acc[field.segment] = (acc[field.segment] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{ fontSize: 34, margin: 0 }}>Dictionnaire EDI-TDFC 2025</h1>
          <p>Recherche dans le dictionnaire officiel intégré à Tantor Déc.</p>
        </div>
        <Link className="btn btn-secondary" href="/app/tdfc-2025">Retour au module</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi"><span>Source</span><strong>{TDFC_OFFICIAL_SOURCE.dictionaryVersion}</strong></div>
        <div className="kpi"><span>Champs</span><strong>{OFFICIAL_TDFC_FIELDS.length}</strong></div>
        <div className="kpi"><span>Formulaires</span><strong>{OFFICIAL_TDFC_FORMS.length}</strong></div>
        <div className="kpi"><span>Formulaires IDF</span><strong>{activeForms.length}</strong></div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Rechercher un formulaire, une zone ou un libellé</h3>
        <form style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input name="q" defaultValue={query} className="input" placeholder="Ex : 2050, AH, fonds commercial, MOA..." style={{ flex: "1 1 320px" }} />
          <button className="btn btn-primary" type="submit">Rechercher</button>
        </form>
        <p style={{ marginBottom: 0, color: "#64748b" }}>
          Segments disponibles : {Object.entries(segmentCounts).map(([k, v]) => `${k} (${v})`).join(" · ")}
        </p>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Résultats {query ? `pour “${query}”` : "principaux"}</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Formulaire</th><th>Code</th><th>Segment</th><th>Indice</th><th>Code donnée</th><th>Libellé</th><th>Table</th></tr>
            </thead>
            <tbody>
              {results.map((field, index) => (
                <tr key={`${field.form}-${field.code}-${field.segment}-${field.dataIndex}-${index}`}>
                  <td>{field.form}</td>
                  <td>{field.code}</td>
                  <td>{field.segment}</td>
                  <td>{field.dataIndex}</td>
                  <td><code>{buildTdfcDataCode({ form: field.form, millesime: field.millesime, formRepeat: "0000", dataRepeat: field.dataIndex, code: field.code, segment: field.segment })}</code></td>
                  <td>{field.label}</td>
                  <td>{field.tableEdi || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
