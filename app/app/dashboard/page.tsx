import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser, getOrganizationId } from "@/lib/auth";
import { badgeClass, formatDate, statusLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const [companies, declarations, invoices, activities] = await Promise.all([
    organizationId ? prisma.company.findMany({ where: { organizationId } }) : [],
    organizationId ? prisma.declaration.findMany({ where: { company: { organizationId } }, include: { company: true }, orderBy: { createdAt: "desc" }, take: 5 }) : [],
    organizationId ? prisma.invoice.findMany({ where: { organizationId }, orderBy: { issuedAt: "desc" } }) : [],
    prisma.activityLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  const pending = declarations.filter(d => ["TO_COMPLETE", "PROCESSING"].includes(d.status)).length;
  const completed = declarations.filter(d => ["SENT", "ACCEPTED"].includes(d.status)).length;

  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{fontSize: 38, margin: 0}}>Dashboard</h1>
          <p>Bienvenue sur votre compte Tantor Déc.</p>
        </div>
        <Link className="btn btn-primary" href="/app/declarations/nouvelle">Ajouter une déclaration</Link>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><span>Total Déclarations</span><strong>{declarations.length}</strong><p>+2 ce mois-ci</p></div>
        <div className="kpi"><span>Entreprises</span><strong>{companies.length}</strong><p>Actives</p></div>
        <div className="kpi"><span>En attente</span><strong>{pending}</strong><p>À traiter</p></div>
        <div className="kpi"><span>Complétées</span><strong>{completed}</strong><p>Ce mois-ci</p></div>
      </div>
      <div className="two-col">
        <div className="card">
          <h3>Guide de démarrage</h3>
          <p>Suivez ces étapes simples pour commencer à utiliser Tantor Déc.</p>
          <ul className="clean">
            <li>Ajouter votre entreprise <Link href="/app/entreprises/nouvelle"><strong>Ajouter maintenant</strong></Link></li>
            <li>Enregistrer l'exercice <Link href="/app/declarations"><strong>Enregistrer</strong></Link></li>
            <li>Remplir la liasse fiscale <Link href="/app/declarations/nouvelle"><strong>Remplir</strong></Link></li>
          </ul>
        </div>
        <div className="card">
          <h3>Statut des Déclarations</h3>
          <ul className="clean">
            <li>À compléter : {declarations.filter(d => d.status === "TO_COMPLETE").length}</li>
            <li>Envoyées : {declarations.filter(d => d.status === "SENT").length}</li>
            <li>Reçues – Acceptées : {declarations.filter(d => d.status === "ACCEPTED").length}</li>
            <li>Refusées : {declarations.filter(d => d.status === "REJECTED").length}</li>
          </ul>
        </div>
      </div>
      <div className="grid-2" style={{marginTop: 18}}>
        <div className="card">
          <h3>Activité récente</h3>
          {activities.length ? activities.map(a => <p key={a.id}><strong>{a.label}</strong><br />{a.detail} — {formatDate(a.createdAt)}</p>) : <p>Aucune activité récente.</p>}
        </div>
        <div className="card">
          <h3>Dernières déclarations</h3>
          {declarations.length ? declarations.map(d => <p key={d.id}><Link href={`/app/declarations/${d.id}`}><strong>{d.type}</strong></Link><br />{d.company.name} — <span className={badgeClass(d.status)}>{statusLabel(d.status)}</span></p>) : <p>Aucune déclaration disponible.</p>}
        </div>
      </div>
    </>
  );
}
