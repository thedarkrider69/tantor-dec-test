import Link from "next/link";
import { Banner, EmptyState, PageHeader, StatCard, Status, TableShell } from "@/components/ui";

export default function DashboardPage(){
  return <>
    <PageHeader title="Tableau de bord" subtitle="Suivez vos entreprises, déclarations et activités récentes." action={<Link className="btn btn-primary" href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>} />
    <Banner title="Déclarations EDI disponibles" action={<button className="btn btn-secondary">Voir les EDI supportés</button>}>Consultez les modèles configurés par l’administrateur : IS, impôt sur le revenu, bénéfices agricoles et intégration fiscale.</Banner>
    <div className="grid-4"><StatCard label="Déclarations" value="12" hint="Total"/><StatCard label="Entreprises actives" value="3" hint="Enregistrées"/><StatCard label="En attente" value="4" hint="À compléter"/><StatCard label="Complétées" value="8" hint="Terminées"/></div>
    <div className="grid-2"><div className="card"><h2>Guide de démarrage</h2><div className="grid-3"><Link className="btn btn-secondary" href="/app/entreprises/nouvelle">1. Ajouter une entreprise</Link><Link className="btn btn-secondary" href="/app/declarations">2. Enregistrer un exercice</Link><Link className="btn btn-secondary" href="/app/declarations/nouvelle">3. Créer une déclaration</Link></div></div><div className="card"><h2>Statut global</h2><TableShell headers={["État","Nombre"]} rows={[[<Status tone="yellow">À compléter</Status>,"4"],[<Status tone="blue">Envoyée</Status>,"2"],[<Status tone="green">Acceptée</Status>,"6"],[<Status tone="red">Refusée</Status>,"0"]]} /></div></div>
    <div className="card"><h2>Activité récente</h2><TableShell headers={["Action","Entreprise","Statut"]} rows={[["Déclaration 2065 créée","ALPHA CONSULTING",<Status tone="yellow">À compléter</Status>],["FEC importé","BETA SERVICES",<Status tone="green">Disponible</Status>],["Paiement validé","OMEGA SAS",<Status tone="green">Payé</Status>]]}/></div>
  </>
}
