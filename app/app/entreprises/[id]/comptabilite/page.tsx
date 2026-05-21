import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEuro, formatDate } from "@/lib/utils";

export default async function AccountingPage({ params }: { params: { id: string } }) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: { fiscalYears: { include: { accountingEntries: true }, orderBy: { startDate: "desc" } } }
  });
  if (!company) notFound();
  const year = company.fiscalYears[0];
  const entries = year?.accountingEntries ?? [];
  const debit = entries.reduce((sum, e) => sum + e.debit, 0);
  const credit = entries.reduce((sum, e) => sum + e.credit, 0);

  return (
    <>
      <div className="page-title">
        <div>
          <Link href="/app/entreprises">Retour</Link>
          <h1 style={{fontSize: 34, margin: 0}}>Comptabilité - {company.name}</h1>
          <p>Importez un fichier FEC pour consulter automatiquement le bilan, le compte de résultat et la balance.</p>
        </div>
        <button className="btn btn-primary" type="button">Importer un fichier FEC</button>
      </div>
      {!year ? <div className="card"><h3>Aucun exercice comptable</h3><p>Commencez par créer un exercice comptable depuis Mes Déclarations.</p></div> : (
        <>
          <div className="kpi-grid">
            <div className="kpi"><span>Exercice</span><strong style={{fontSize: 22}}>{formatDate(year.startDate)} - {formatDate(year.endDate)}</strong></div>
            <div className="kpi"><span>FEC importé</span><strong>{year.fecImported ? "Oui" : "Non"}</strong></div>
            <div className="kpi"><span>Bénéfice / Déficit</span><strong>{formatEuro(year.benefit)}</strong></div>
            <div className="kpi"><span>Nombre de lignes</span><strong>{year.linesCount}</strong></div>
          </div>
          <div className="tabs"><span className="tab">Balance</span><span className="tab">Bilan</span><span className="tab">Compte de résultat</span><span className="tab">Comptes auxiliaires</span></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Compte</th><th>Libellé</th><th>Débit</th><th>Crédit</th></tr></thead>
              <tbody>
                {entries.map(e => <tr key={e.id}><td>{e.account}</td><td>{e.label}</td><td>{formatEuro(e.debit)}</td><td>{formatEuro(e.credit)}</td></tr>)}
                <tr><td colSpan={2}><strong>Total</strong></td><td><strong>{formatEuro(debit)}</strong></td><td><strong>{formatEuro(credit)}</strong></td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid-2" style={{marginTop: 18}}>
            <div className="card"><h3>ACTIF</h3><p>Créances clients : {formatEuro(18000)}</p><p>Disponibilités : {formatEuro(27000)}</p><p><strong>Total actif : {formatEuro(156000)}</strong></p></div>
            <div className="card"><h3>PASSIF</h3><p>Capital social : {formatEuro(12000)}</p><p>Réserves : {formatEuro(8000)}</p><p><strong>Total passif : {formatEuro(156000)}</strong></p></div>
          </div>
        </>
      )}
    </>
  );
}
