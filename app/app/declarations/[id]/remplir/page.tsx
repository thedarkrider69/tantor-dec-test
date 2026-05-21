import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveDeclarationValuesAction } from "@/lib/actions";

const actifRows = [
  ["Capital souscrit non appelé", "AA", "", ""],
  ["Frais d'établissement", "AB", "AC", "AD"],
  ["Frais de développement", "CX", "CQ", "CR"],
  ["Concessions, brevets et droits similaires", "AF", "AG", "AH_NET"],
  ["Fonds commercial", "AH", "AI", "AJ"],
  ["Autres immobilisations incorporelles", "AK", "AL", "AM"],
  ["Immobilisations corporelles", "AN", "AO", "AP"],
  ["Créances clients", "", "", "BR"],
  ["Disponibilités", "", "", "BT"]
] as const;

const passifRows = [
  ["Capital social", "DA"],
  ["Réserves", "DB"],
  ["Résultat de l'exercice", "DC"],
  ["Provisions", "DD"],
  ["Emprunts et dettes financières", "DE"],
  ["Dettes fournisseurs", "DF"],
  ["Dettes fiscales et sociales", "DG"]
] as const;

const resultRows = [
  ["Ventes de marchandises", "FA", "produit"],
  ["Production vendue", "FB", "produit"],
  ["Subventions d'exploitation", "FC", "produit"],
  ["Autres produits", "FD", "produit"],
  ["Achats de marchandises", "GA", "charge"],
  ["Impôts et taxes", "GB", "charge"],
  ["Salaires et traitements", "GC", "charge"],
  ["Charges sociales", "GD", "charge"],
  ["Dotations aux amortissements", "GE", "charge"],
  ["Autres charges", "GF", "charge"]
] as const;

function MoneyInput({ name, values }: { name?: string; values: Record<string, string> }) {
  if (!name) return <span className="muted">—</span>;
  return <input name={name} defaultValue={values[name] || ""} className="input mini-input" type="number" step="0.01" placeholder={name} />;
}

export default async function FillDeclarationPage({ params }: { params: { id: string } }) {
  const declaration = await prisma.declaration.findUnique({ where: { id: params.id }, include: { company: true, year: true } });
  if (!declaration) notFound();
  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const anomalies = JSON.parse(declaration.anomaliesJson || "[]") as string[];

  return (
    <>
      <div className="page-title">
        <div>
          <Link href={`/app/declarations/${declaration.id}`}>Retour</Link>
          <h1 style={{fontSize: 34, margin: 0}}>Remplir la liasse fiscale</h1>
          <p>{declaration.company.name} — {declaration.type}</p>
        </div>
      </div>
      <form className="form" action={saveDeclarationValuesAction}>
        <input type="hidden" name="declarationId" value={declaration.id} />
        {anomalies.length > 0 && (
          <div className="error">
            <strong>{anomalies.length} anomalie(s) détectée(s)</strong>
            <ul>{anomalies.slice(0, 5).map(a => <li key={a}>{a}</li>)}</ul>
          </div>
        )}

        <div className="card">
          <div className="page-title" style={{marginBottom: 0}}>
            <div>
              <h3>2050 — Bilan actif</h3>
              <p>Désignation de l'entreprise : {declaration.company.name}</p>
            </div>
            <div className="actions">
              <button className="btn btn-secondary" type="reset">Réinitialiser</button>
              <button className="btn btn-primary" type="submit">Sauvegarder + contrôler</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Libellé</th><th>Brut</th><th>Amortissements / provisions</th><th>Net</th></tr></thead>
              <tbody>
                {actifRows.map(([label, brut, amort, net]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td><MoneyInput name={brut} values={values} /></td>
                    <td><MoneyInput name={amort} values={values} /></td>
                    <td><MoneyInput name={net} values={values} /></td>
                  </tr>
                ))}
                <tr>
                  <td><strong>TOTAL ACTIF</strong></td>
                  <td><MoneyInput name="totalActifBrut" values={values} /></td>
                  <td><MoneyInput name="totalActifAmort" values={values} /></td>
                  <td><MoneyInput name="totalActifNet" values={values} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>2051 — Bilan passif</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Libellé</th><th>Montant</th></tr></thead>
              <tbody>
                {passifRows.map(([label, name]) => (
                  <tr key={label}><td>{label}</td><td><MoneyInput name={name} values={values} /></td></tr>
                ))}
                <tr><td><strong>TOTAL PASSIF</strong></td><td><MoneyInput name="totalPassif" values={values} /></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>2052 — Compte de résultat</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Libellé</th><th>Produits</th><th>Charges</th></tr></thead>
              <tbody>
                {resultRows.map(([label, name, type]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{type === "produit" ? <MoneyInput name={name} values={values} /> : <span className="muted">—</span>}</td>
                    <td>{type === "charge" ? <MoneyInput name={name} values={values} /> : <span className="muted">—</span>}</td>
                  </tr>
                ))}
                <tr><td><strong>TOTAL PRODUITS</strong></td><td><MoneyInput name="totalProduits" values={values} /></td><td /></tr>
                <tr><td><strong>TOTAL CHARGES</strong></td><td /><td><MoneyInput name="totalCharges" values={values} /></td></tr>
                <tr><td><strong>RÉSULTAT DE L'EXERCICE</strong></td><td colSpan={2}><MoneyInput name="resultExercice" values={values} /></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Contrôles ajoutés</h3>
          <ul className="clean">
            <li>Total actif net obligatoire.</li>
            <li>Total passif obligatoire.</li>
            <li>Total actif net doit être égal au total passif.</li>
            <li>Chaque ligne avec brut/amortissement doit avoir un net cohérent.</li>
            <li>Total produits, total charges et résultat doivent être cohérents.</li>
            <li>Les montants ne peuvent pas être négatifs, sauf résultat.</li>
          </ul>
        </div>

        <div className="actions">
          <Link className="btn btn-secondary" href={`/app/declarations/${declaration.id}`}>Annuler</Link>
          <button className="btn btn-primary" type="submit">Enregistrer comme brouillon</button>
        </div>
      </form>
    </>
  );
}
