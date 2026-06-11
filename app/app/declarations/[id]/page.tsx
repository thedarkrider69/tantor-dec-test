import Link from "next/link";
import { Banner, PageHeader, Status, TableShell } from "@/components/ui";

const docs = [
  ["2065", "Déclaration de résultat", "À compléter", "Aucune"],
  ["2050", "Bilan Actif", "En anomalie", "1 anomalie"],
  ["2051", "Bilan Passif", "À compléter", "Aucune"],
  ["2052", "Compte de résultat", "Complété", "Aucune"],
  ["2053", "Compte de résultat suite", "Complété", "Aucune"],
  ["2054", "Immobilisations", "En cours", "Aucune"],
];

function tone(state: string){
  if(state === "Complété") return "green" as const;
  if(state === "En cours") return "blue" as const;
  if(state === "En anomalie") return "red" as const;
  return "yellow" as const;
}

export default function DeclarationDetail(){
  return <>
    <PageHeader
      title="Liasse 2065 — IS — BIC"
      subtitle="ALPHA CONSULTING · SAS · IS · période 01/01/2024 - 31/12/2024 · Statut global : À compléter"
    />

    <Banner title="Dossier fiscal">
      Complétez les documents obligatoires, ajoutez les annexes utiles, utilisez le FEC disponible, testez les anomalies puis envoyez la déclaration uniquement si tout est cohérent.
    </Banner>

    <div className="grid-4">
      <div className="info-tile"><small>Entreprise</small><strong>ALPHA CONSULTING</strong></div>
      <div className="info-tile"><small>Régime fiscal</small><strong>IS / BIC</strong></div>
      <div className="info-tile"><small>FEC</small><strong>Disponible</strong></div>
      <div className="info-tile"><small>Anomalies</small><strong>1 bloquante</strong></div>
    </div>

    <div className="card">
      <div className="table-head"><h2>Documents obligatoires</h2><button className="btn btn-secondary">Compléter avec FEC</button></div>
      <TableShell
        headers={["Document", "Nom", "État", "Anomalies", "Actions"]}
        rows={docs.map((d) => [
          d[0],
          d[1],
          <Status tone={tone(d[2])}>{d[2]}</Status>,
          d[3],
          <div className="action-stack"><Link className="btn btn-secondary" href="/app/declarations/demo/remplir">{d[2] === "Complété" ? "Voir" : d[2] === "En cours" ? "Modifier" : "Remplir"}</Link><button className="mini-action">Pré-remplir FEC</button></div>,
        ])}
      />
    </div>

    <div className="card">
      <h2>Documents optionnels</h2>
      <div className="filters">
        <select><option>Ajouter une annexe</option><option>2055 — Amortissements</option><option>2057 — Créances et dettes</option><option>2067 — Frais généraux</option></select>
        <button className="btn btn-secondary">Ajouter</button>
      </div>
    </div>

    <div className="card anomaly-panel">
      <h2>Anomalies globales de la déclaration</h2>
      <div className="notice-error">Total actif différent du total passif. Corrigez le document 2050 ou 2051 avant envoi.</div>
      <p><Link className="hint-link" href="/app/declarations/demo/remplir">Aller à 2050 — Bilan Actif</Link></p>
    </div>

    <div className="tabs">
      <button className="btn btn-secondary">Imprimer la déclaration</button>
      <button className="btn btn-secondary">Tester les anomalies</button>
      <Link className="btn btn-primary" href="/app/declarations/demo/paiement">Envoyer la déclaration</Link>
    </div>
  </>;
}
