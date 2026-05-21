import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateEdiFileAction, sendDeclarationAction, validateDeclarationAction } from "@/lib/actions";
import { badgeClass, formatDate, formatEuro, statusLabel } from "@/lib/utils";

export default async function DeclarationDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { saved?: string; error?: string; validated?: string; edi?: string };
}) {
  const declaration = await prisma.declaration.findUnique({ where: { id: params.id }, include: { company: true, year: true, invoices: true } });
  if (!declaration) notFound();
  const anomalies = JSON.parse(declaration.anomaliesJson || "[]") as string[];
  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;

  return (
    <>
      <div className="page-title">
        <div>
          <Link href="/app/declarations">Retour</Link>
          <h1 style={{fontSize: 34, margin: 0}}>Déclaration fiscale</h1>
          <p>{declaration.type} — {declaration.company.name}</p>
        </div>
        <div className="actions">
          <Link className="btn btn-secondary" href={`/app/declarations/${declaration.id}/remplir`}>Modifier la liasse</Link>
          <form action={validateDeclarationAction}>
            <input type="hidden" name="declarationId" value={declaration.id} />
            <button className="btn btn-secondary" type="submit">Tester les anomalies</button>
          </form>
          <form action={generateEdiFileAction}>
            <input type="hidden" name="declarationId" value={declaration.id} />
            <button className="btn btn-secondary" type="submit">Générer EDI local</button>
          </form>
          <form action={sendDeclarationAction}>
            <input type="hidden" name="declarationId" value={declaration.id} />
            <button className="btn btn-primary" type="submit">Envoi simulé</button>
          </form>
        </div>
      </div>
      {searchParams.saved && <div className="notice" style={{marginBottom: 16}}>Déclaration sauvegardée et contrôles d'anomalies relancés.</div>}
      {searchParams.validated && <div className="notice" style={{marginBottom: 16}}>Contrôles terminés.</div>}
      {searchParams.edi && <div className="notice" style={{marginBottom: 16}}>Fichier EDI local généré.</div>}
      {searchParams.error && <div className="error" style={{marginBottom: 16}}>{searchParams.error}</div>}
      <div className="kpi-grid">
        <div className="kpi"><span>Référence</span><strong style={{fontSize: 20}}>{declaration.reference}</strong></div>
        <div className="kpi"><span>État</span><strong style={{fontSize: 20}}><span className={badgeClass(declaration.status)}>{statusLabel(declaration.status)}</span></strong></div>
        <div className="kpi"><span>Date limite</span><strong style={{fontSize: 20}}>{formatDate(declaration.dueDate)}</strong></div>
        <div className="kpi"><span>Montant</span><strong style={{fontSize: 20}}>{formatEuro(declaration.amount)}</strong></div>
      </div>
      <div className="two-col">
        <div className="card">
          <h3>Documents de la liasse</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Document</th><th>État</th><th>Anomalies</th><th>Action</th></tr></thead>
              <tbody>
                {["2050 - Bilan - Actif", "2051 - Bilan - Passif", "2052 - Compte de résultat"].map((doc, idx) => (
                  <tr key={doc}>
                    <td>{doc}</td>
                    <td><span className={anomalies.length ? "badge badge-yellow" : "badge badge-green"}>{anomalies.length ? "À corriger" : "Complet"}</span></td>
                    <td>{idx === 0 ? anomalies.length : anomalies.length ? "Voir rapport" : "Aucune"}</td>
                    <td><Link href={`/app/declarations/${declaration.id}/remplir`}>Remplir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <h3>Anomalies de la déclaration</h3>
          {anomalies.length ? <ul className="clean">{anomalies.map(a => <li key={a}>{a}</li>)}</ul> : <p>Aucune anomalie détectée.</p>}
          <p className="muted">Dernière validation : {formatDate(declaration.lastValidatedAt)}</p>
          <h3 style={{marginTop: 24}}>Fichier EDI local</h3>
          {declaration.ediContent ? (
            <>
              <p><strong>{declaration.ediFileName}</strong></p>
              <p className="muted">Généré le {formatDate(declaration.ediGeneratedAt)}. Ce fichier est un fichier local de test, non homologué DGFiP.</p>
              {declaration.ediFilePath && <p className="muted">Dossier utilisateur : <code>{declaration.ediFilePath}</code></p>}
              {declaration.ediDeclarationPath && <p className="muted">Copie déclaration : <code>{declaration.ediDeclarationPath}</code></p>}
              <Link className="btn btn-secondary" href={`/app/declarations/${declaration.id}/edi`}>Télécharger le fichier .edi</Link>
            </>
          ) : (
            <p>Aucun fichier EDI généré. Corrigez les anomalies puis cliquez sur “Générer EDI local”.</p>
          )}
        </div>
      </div>
      <div className="card" style={{marginTop: 18}}>
        <h3>Valeurs principales</h3>
        <div className="kpi-grid">
          <div className="kpi"><span>Total actif net</span><strong>{values.totalActifNet || "-"}</strong></div>
          <div className="kpi"><span>Total passif</span><strong>{values.totalPassif || "-"}</strong></div>
          <div className="kpi"><span>Total produits</span><strong>{values.totalProduits || "-"}</strong></div>
          <div className="kpi"><span>Résultat</span><strong>{values.resultExercice || values.DC || "-"}</strong></div>
        </div>
      </div>
    </>
  );
}
