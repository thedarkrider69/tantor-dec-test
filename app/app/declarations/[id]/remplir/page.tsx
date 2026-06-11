import Link from "next/link";
import { PageHeader, Status, TableShell } from "@/components/ui";

const cells = [
  ["AA", "Frais d’établissement", ""],
  ["AF", "Concessions, brevets et droits similaires", "2 000"],
  ["AG", "Amortissements concessions", "500"],
  ["AP", "Constructions", ""],
  ["AQ", "Amortissements constructions", ""],
  ["BL", "Matières premières", "1 200"],
  ["BM", "Stocks en cours", ""],
  ["BT", "Marchandises", "3 400"],
  ["BU", "Avances et acomptes", ""],
  ["CB", "Capital souscrit non appelé", ""],
  ["CF", "Disponibilités", "5 150"],
  ["CG", "Total actif", "11 250"],
];

export default function Remplir(){
  return <>
    <PageHeader
      title="2050 — Bilan Actif"
      subtitle="Formulaire fiscal avec zones saisissables, informations préremplies, préremplissage FEC et contrôle des anomalies."
      action={<select className="tab"><option>Changer de document</option><option>2051 — Bilan Passif</option><option>2052 — Compte de résultat</option></select>}
    />

    <div className="notice-error">1 anomalie détectée : la case AA est obligatoire ou le total actif doit être vérifié.</div>

    <div className="card">
      <div className="table-head"><h2>Informations préremplies automatiquement</h2><button className="btn btn-secondary">Compléter avec FEC</button></div>
      <div className="grid-4">
        <div className="info-tile"><small>Entreprise</small><strong>ALPHA CONSULTING</strong></div>
        <div className="info-tile"><small>SIRET</small><strong>94812345600010</strong></div>
        <div className="info-tile"><small>Période</small><strong>01/01/2024 - 31/12/2024</strong></div>
        <div className="info-tile"><small>FEC</small><strong>Importé</strong></div>
      </div>
    </div>

    <form className="card">
      <div className="table-head"><h2>Cases du formulaire</h2><button className="btn btn-ghost" type="button">Afficher les anomalies</button></div>
      <div className="doc-form extended">
        {cells.map(([code,label,value]) => <div className={`tax-cell ${code === "AA" ? "has-error" : ""}`} key={code}>
          <label>{code} — {label}</label>
          <input placeholder="Montant" defaultValue={value} />
        </div>)}
      </div>
      <div className="tabs" style={{marginTop:18}}>
        <button className="btn btn-secondary" type="button">Réinitialiser</button>
        <button className="btn btn-secondary" type="button">Enregistrer comme brouillon</button>
        <Link className="btn btn-primary" href="/app/declarations/demo">Sauvegarder</Link>
      </div>
    </form>

    <div className="card">
      <h2>Préremplissage issu du FEC</h2>
      <TableShell
        headers={["Case", "Source FEC", "Compte", "Valeur proposée", "Statut"]}
        rows={[
          ["CF", "Banque", "512", "5 150 €", <Status tone="green">Injecté</Status>],
          ["BT", "Marchandises", "3xxx", "3 400 €", <Status tone="green">Injecté</Status>],
          ["BX", "Clients", "411", "12 000 €", <Status tone="blue">Disponible</Status>],
          ["TVA", "TVA collectée", "44571", "160 €", <Status tone="blue">Disponible</Status>],
        ]}
      />
    </div>

    <div className="card anomaly-panel">
      <h2>Anomalies du document</h2>
      <p><strong>Case AA vide.</strong> Cause : une ligne obligatoire n’est pas renseignée ou le total ne correspond pas à la somme des sous-lignes.</p>
      <p><Link className="hint-link" href="#">Aller à la case AA</Link></p>
    </div>
  </>;
}
