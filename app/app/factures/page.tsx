import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { badgeClass, formatDate, formatEuro, statusLabel } from "@/lib/utils";

export default async function InvoicesPage({ searchParams }: { searchParams: { paid?: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const invoices = organizationId ? await prisma.invoice.findMany({ where: { organizationId }, include: { declaration: { include: { company: true } }, payment: true }, orderBy: { issuedAt: "desc" } }) : [];
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Mes factures</h1><p>Consultez et téléchargez vos factures de déclaration.</p></div></div>
      {searchParams.paid && <div className="notice" style={{marginBottom: 16}}>Paiement effectué avec succès. Votre déclaration a été acceptée dans cette version de démonstration.</div>}
      {invoices.length === 0 ? <div className="card"><h3>Aucune facture disponible</h3><p>Une facture est créée automatiquement après chaque déclaration payée.</p><Link className="btn btn-primary" href="/app/declarations">Voir les déclarations</Link></div> : (
        <div className="table-wrap"><table><thead><tr><th>Date</th><th>Entreprise</th><th>N° facture</th><th>Montant TTC</th><th>État</th><th>Action</th></tr></thead><tbody>
          {invoices.map(i => <tr key={i.id}><td>{formatDate(i.issuedAt)}</td><td>{i.declaration?.company.name ?? "-"}</td><td>{i.number}</td><td>{formatEuro(i.amountTtc)}</td><td><span className={badgeClass(i.status)}>{statusLabel(i.status)}</span></td><td><Link className="btn btn-secondary" href={`/app/factures/${i.id}`}>Voir</Link></td></tr>)}
        </tbody></table></div>
      )}
    </>
  );
}
