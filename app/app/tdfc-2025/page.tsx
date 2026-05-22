import Link from "next/link";
import { F_IDENTIF_FIELDS, TDFC_FIELD_DEFINITIONS, TDFC_CAMPAIGN, buildTdfcDataCode, TDFC_DICTIONARY_INFO } from "@/lib/tdfc-2025";

export default function Tdfc2025CatalogPage() {
  const samples = [...F_IDENTIF_FIELDS, ...TDFC_FIELD_DEFINITIONS.slice(0, 24)];
  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{ fontSize: 34, margin: 0 }}>Module EDI-TDFC 2025</h1>
          <p>Catalogue de mapping utilisé par Tantor Déc pour générer un INFENT DF de test.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-secondary" href="/app/tdfc-2025/dictionnaire">Voir le dictionnaire officiel</Link>
          <Link className="btn btn-primary" href="/app/declarations">Créer ou ouvrir une déclaration</Link>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi"><span>Campagne</span><strong>{TDFC_CAMPAIGN.year}</strong></div>
        <div className="kpi"><span>Message</span><strong>{TDFC_CAMPAIGN.messageType} DF</strong></div>
        <div className="kpi"><span>Accord UNB</span><strong style={{ fontSize: 15 }}>{TDFC_CAMPAIGN.interchangeAgreement}</strong></div>
        <div className="kpi"><span>Dictionnaire</span><strong>{TDFC_DICTIONARY_INFO.dictionaryVersion}</strong></div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Ce qui est intégré dans cette version</h3>
        <ul className="clean">
          <li>Génération du code donnée <code>FFFFFFFFFFMMIIIIDDDDCCSSS</code>.</li>
          <li>F-IDENTIF : SIREN, ROF, période et monnaie EUR.</li>
          <li>Dictionnaire officiel éditeurs V2025.7 intégré pour contrôler les couples formulaire / code / segment.</li>
          <li>Formulaires de test : 2050, 2051 et 2052, avec libellés issus du dictionnaire quand disponibles.</li>
          <li>Segments MOA pour les montants de la liasse.</li>
          <li>Enveloppe INFENT DF campagne générale 2025 : UNB, UNG, UNH, BGM, DTM, RFF, NAD, SEQ/IND.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Extrait du catalogue de données</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Clé</th><th>Formulaire</th><th>Segment</th><th>Code EDI-TDFC</th><th>Libellé</th></tr></thead>
            <tbody>
              {samples.map((field) => (
                <tr key={`${field.form}-${field.key}`}>
                  <td>{field.key}</td>
                  <td>{field.form}</td>
                  <td>{field.segment}</td>
                  <td><code>{buildTdfcDataCode(field)}</code></td>
                  <td>{field.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
