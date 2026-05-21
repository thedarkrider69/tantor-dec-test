import { prisma } from "@/lib/prisma";
import { badgeClass, formatDate, formatEuro, statusLabel } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const invoices = await prisma.invoice.findMany({ include: { declaration: { include: { company: true } }, payment: true }, orderBy: { issuedAt: "desc" } });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Paiements & Factures</h1><p>Consultez, validez et suivez toutes les transactions et factures.</p></div><button className="btn btn-secondary">Exporter</button></div>
      <div className="table-wrap"><table><thead><tr><th>Facture N°</th><th>Entreprise</th><th>Utilisateur</th><th>Montant</th><th>Statut</th><th>Date de génération</th><th>Référence paiement</th></tr></thead><tbody>
        {invoices.map(i => <tr key={i.id}><td>{i.number}</td><td>{i.declaration?.company.name ?? "-"}</td><td>-</td><td>{formatEuro(i.amountTtc)}</td><td><span className={badgeClass(i.status)}>{statusLabel(i.status)}</span></td><td>{formatDate(i.issuedAt)}</td><td>{i.payment?.reference ?? "-"}</td></tr>)}
      </tbody></table></div>
    </>
  );
}
