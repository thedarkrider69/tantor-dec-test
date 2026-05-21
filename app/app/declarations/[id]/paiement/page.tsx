import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { payDeclarationAction } from "@/lib/actions";
import { formatEuro } from "@/lib/utils";

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const declaration = await prisma.declaration.findUnique({ where: { id: params.id }, include: { company: true } });
  if (!declaration) notFound();
  const ht = Math.round((declaration.amount / 1.2) * 100) / 100;
  const vat = Math.round((declaration.amount - ht) * 100) / 100;
  return (
    <>
      <div className="page-title">
        <div><Link href={`/app/declarations/${declaration.id}`}>Retour</Link><h1 style={{fontSize: 34, margin: 0}}>Paiement de la déclaration</h1><p>{declaration.reference} — {declaration.company.name}</p></div>
      </div>
      <div className="two-col">
        <div className="card">
          <h3>Récapitulatif</h3>
          <p><strong>Type :</strong> {declaration.type}</p>
          <p><strong>Montant HT :</strong> {formatEuro(ht)}</p>
          <p><strong>TVA :</strong> {formatEuro(vat)}</p>
          <p><strong>Total TTC :</strong> {formatEuro(declaration.amount)}</p>
        </div>
        <form className="card form" action={payDeclarationAction}>
          <input type="hidden" name="declarationId" value={declaration.id} />
          <h3>Nouvelle carte bancaire</h3>
          <label className="label">Nom sur la carte<input className="input" placeholder="Jean Dupont" /></label>
          <label className="label">Numéro de carte<input className="input" placeholder="1234 5678 9101" /></label>
          <div className="form-grid"><label className="label">Date d'expiration<input className="input" placeholder="MM/AAAA" /></label><label className="label">CVV<input className="input" placeholder="123" /></label></div>
          <p>Paiement simulé en local. Aucune carte n'est réellement débitée.</p>
          <button className="btn btn-primary" type="submit">Confirmer et payer</button>
        </form>
      </div>
    </>
  );
}
