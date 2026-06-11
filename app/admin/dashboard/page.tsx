import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [declarations, companies, users, payments, tickets] = await Promise.all([
    prisma.declaration.count(),
    prisma.company.count(),
    prisma.user.count(),
    prisma.payment.findMany(),
    prisma.supportTicket.count({ where: { status: "OPEN" } })
  ]);
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const latest = await prisma.declaration.findMany({ include: { company: true }, orderBy: { createdAt: "desc" }, take: 5 });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Tableau de bord</h1><p>Vue d'ensemble de votre plateforme Tantor Déc.</p></div></div>
      <div className="page-banner"><div><h3>Tableau de bord administrateur</h3><p>Suivez l’activité globale, les alertes système, les paiements et les déclarations transmises.</p></div></div>
      <div className="kpi-grid">
        <div className="kpi"><span>Déclarations</span><strong>{declarations}</strong><p>Déclarations soumises</p></div>
        <div className="kpi"><span>Entreprises</span><strong>{companies}</strong><p>+12% par rapport au mois dernier</p></div>
        <div className="kpi"><span>Utilisateurs</span><strong>{users}</strong><p>+8% par rapport au mois dernier</p></div>
        <div className="kpi"><span>Paiements réalisés</span><strong>{formatEuro(total)}</strong><p>+15% par rapport au mois dernier</p></div>
      </div>
      <div className="grid-2">
        <div className="card"><h3>Activité récente</h3>{latest.map(d => <p key={d.id}><strong>{d.type}</strong> - {d.company.name}<br />{d.status}</p>)}</div>
        <div className="card"><h3>Alertes système</h3><p>Tickets d'assistance ouverts : <strong>{tickets}</strong></p><p>Déclarations en erreur : <strong>{latest.filter(d => d.status === "REJECTED").length}</strong></p></div>
      </div>
    </>
  );
}
