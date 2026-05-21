import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatEuro } from "@/lib/utils";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({ where: { id: params.id }, include: { organization: true, declaration: { include: { company: true } }, payment: true } });
  if (!invoice) notFound();
  return (
    <>
      <div className="page-title"><div><Link href="/app/factures">Retour</Link><h1 style={{fontSize: 34, margin: 0}}>FACTURE</h1></div><Link className="btn btn-secondary" href={`/app/factures/${invoice.id}/telecharger`}>Télécharger</Link></div>
      <div className="receipt">
        <div className="page-title"><div><h2>Tantor Déc</h2><p>Plateforme de télétransmission EDI</p></div><div><strong>FACTURE N° : {invoice.number}</strong><p>Date : {formatDate(invoice.issuedAt)}</p></div></div>
        <div className="grid-2">
          <div><h3>ÉMETTEUR</h3><p>Tantor Déc<br />contact@tantordec.fr<br />www.tantordec.fr</p></div>
          <div><h3>DESTINATAIRE</h3><p>{invoice.declaration?.company.name}<br />SIREN : {invoice.declaration?.company.siren}<br />{invoice.declaration?.company.address}</p></div>
        </div>
        <div className="table-wrap" style={{marginTop: 18}}><table><thead><tr><th>Description</th><th>Prix unitaire</th><th>Quantité</th><th>Total</th></tr></thead><tbody><tr><td>Prestation de dépôt fiscal</td><td>{formatEuro(invoice.amountTtc)}</td><td>1</td><td>{formatEuro(invoice.amountTtc)}</td></tr></tbody></table></div>
        <div style={{marginTop: 18, textAlign: "right"}}><p>Total HT : {formatEuro(invoice.amountHt)}</p><p>TVA : {formatEuro(invoice.vat)}</p><h3>Total TTC : {formatEuro(invoice.amountTtc)}</h3></div>
        <h3>Règlement</h3><p>Mode de paiement : {invoice.payment?.method ?? "Carte bancaire"}<br />Référence : {invoice.payment?.reference ?? "-"}<br />Statut : {invoice.status}</p>
        {(invoice.invoiceFilePath || invoice.receiptFilePath) && (
          <div className="notice">
            {invoice.invoiceFilePath && <p>Facture sauvegardée : <code>{invoice.invoiceFilePath}</code></p>}
            {invoice.receiptFilePath && <p>Reçu sauvegardé : <code>{invoice.receiptFilePath}</code></p>}
          </div>
        )}
      </div>
    </>
  );
}
