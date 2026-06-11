import Link from "next/link";
import { Banner, EmptyState, PageHeader, Status, TableShell } from "@/components/ui";

export default function DeclarationsPage(){
  return <>
    <PageHeader
      title="Mes Déclarations"
      subtitle="Consultez les exercices comptables, les déclarations EDI existantes et les déclarations à venir."
      action={<Link className="btn btn-primary" href="/app/declarations/nouvelle">Ajouter une déclaration</Link>}
    />

    <div className="tabs">
      <span className="tab active">Exercices comptables</span>
      <span className="tab">Mes déclarations</span>
      <span className="tab">Déclarations à venir</span>
    </div>

    <Banner title="Gérez vos déclarations fiscales">
      Chaque déclaration est rattachée à une entreprise, à un exercice comptable et à un type compatible avec le régime fiscal. Si un FEC existe, le bouton “Compléter avec FEC” devient disponible.
    </Banner>

    <div className="filters">
      <input placeholder="Rechercher entreprise ou SIREN" />
      <select><option>Entreprise</option><option>ALPHA CONSULTING</option></select>
      <select><option>État de déclaration</option><option>À compléter</option><option>Envoyée</option><option>Refusée</option></select>
      <select><option>Régime fiscal</option><option>IS</option><option>BIC</option></select>
      <select><option>Type de déclaration</option><option>Liasse 2065</option><option>TVA CA3</option></select>
    </div>

    <div className="card">
      <div className="table-head">
        <h2>1. Exercices comptables</h2>
        <button className="btn btn-secondary">Ajouter un exercice</button>
      </div>
      <TableShell
        headers={["Forme juridique", "Entreprise", "Régime TVA", "Période", "Régime fiscal", "Date clôture", "Déclaration liée", "Action"]}
        rows={[
          ["SAS", "ALPHA CONSULTING", "Réel normal", "01/01/2024 - 31/12/2024", "IS", "31/12/2024", <Status tone="green">Liée</Status>, "Modifier"],
          ["SARL", "BETA SERVICES", "Franchise", "01/01/2025 - 31/12/2025", "BIC", "31/12/2025", <Status tone="neutral">Aucune</Status>, "Modifier"],
        ]}
      />
    </div>

    <div className="card">
      <div className="table-head"><h2>2. Mes déclarations</h2><Link href="/app/declarations/nouvelle" className="btn btn-secondary">Ajouter une déclaration</Link></div>
      <TableShell
        headers={["Entreprise", "Exercice lié", "FEC", "Année fiscale", "Type", "Message", "État", "Résultat", "Actions"]}
        rows={[
          ["ALPHA CONSULTING", "2024", <Status tone="green">Disponible</Status>, "2025", "Liasse 2065", "Créée aujourd’hui", <Status tone="yellow">À compléter</Status>, <Status tone="neutral">Non reçue</Status>, <div className="action-stack"><Link className="btn btn-secondary" href="/app/declarations/demo">Compléter</Link><button className="mini-action">Compléter avec FEC</button><button className="mini-action">Actualiser FEC</button></div>],
          ["OMEGA SAS", "2023", <Status tone="green">Disponible</Status>, "2024", "TVA CA3", "Envoyée le 10/05", <Status tone="blue">En cours</Status>, <Status tone="neutral">Non reçue</Status>, "Voir · Reçu provisoire · Dupliquer · Archiver"],
          ["DELTA BTP", "2023", <Status tone="neutral">Non disponible</Status>, "2024", "Liasse 2065", "Refusée : total incohérent", <Status tone="red">Refusée</Status>, <Status tone="red">Refusée</Status>, "Corriger · Télécharger reçu · Dupliquer"],
        ]}
      />
    </div>

    <div className="card">
      <h2>3. Déclarations à venir</h2>
      <TableShell
        headers={["Entreprise", "Type de déclaration", "Date limite estimée", "État", "Action"]}
        rows={[
          ["ALPHA CONSULTING", "TVA CA3", "20/07/2025", <Status tone="yellow">À compléter</Status>, "Créer déclaration"],
          ["BETA SERVICES", "Liasse 2065", "15/05/2026", <Status tone="neutral">À venir</Status>, "Créer déclaration"],
        ]}
      />
    </div>

    <EmptyState title="Utiliser le FEC pour simplifier le remplissage" text="Quand un exercice dispose d’un FEC valide, Tantor peut pré-remplir la TVA, les ventes, les achats, le résultat, la banque, les clients et les fournisseurs." />
  </>;
}
