import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTdfc2025FileAction } from "@/lib/actions";
import { F_IDENTIF_FIELDS, previewTdfcMappedFields, buildTdfcDataCode, TDFC_CAMPAIGN } from "@/lib/tdfc-2025";

export default async function TdfcPreviewPage({ params }: { params: { id: string } }) {
  const declaration = await prisma.declaration.findUnique({ where: { id: params.id }, include: { company: true, year: true } });
  if (!declaration) notFound();
  const values = JSON.parse(declaration.valuesJson || "{}") as Record<string, string>;
  const mapped = previewTdfcMappedFields(values).filter((field) => field.value);

  return (
    <>
      <div className="page-title">
        <div>
          <Link href={`/app/declarations/${declaration.id}`}>Retour</Link>
          <h1 style={{ fontSize: 34, margin: 0 }}>Prévisualisation EDI-TDFC 2025</h1>
          <p>{declaration.company.name} — {declaration.reference}</p>
        </div>
        <form action={generateTdfc2025FileAction}>
          <input type="hidden" name="declarationId" value={declaration.id} />
          <button className="btn btn-primary" type="submit">Générer le fichier INFENT DF 2025</button>
        </form>
      </div>

      <div className="notice" style={{ marginBottom: 18 }}>
        Cette page montre le mapping technique de test : code donnée <code>FFFFFFFFFFMMIIIIDDDDCCSSS</code>, groupe <code>SEQ/IND</code>, puis segment de valeur. Le fichier généré est un fichier de démonstration non homologué DGFiP.
      </div>

      <div className="kpi-grid">
        <div className="kpi"><span>Campagne</span><strong>{TDFC_CAMPAIGN.year}</strong></div>
        <div className="kpi"><span>Accord interchange</span><strong style={{ fontSize: 16 }}>{TDFC_CAMPAIGN.interchangeAgreement}</strong></div>
        <div className="kpi"><span>Version message</span><strong>{TDFC_CAMPAIGN.functionalVersion}</strong></div>
        <div className="kpi"><span>Document BGM</span><strong>{TDFC_CAMPAIGN.documentCode}</strong></div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>F-IDENTIF obligatoire</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Donnée</th><th>Segment</th><th>Code EDI-TDFC</th><th>Valeur prévue</th></tr></thead>
            <tbody>
              {F_IDENTIF_FIELDS.map((field) => {
                const value = field.key === "SIREN" ? declaration.company.siren : field.key === "ROF" ? (declaration.company.taxRegime?.includes("BIC") ? "BIC1" : "IS1") : field.key === "PERIODE" ? "Exercice" : "EUR";
                return <tr key={field.key}><td>{field.label}</td><td>{field.segment}</td><td><code>{buildTdfcDataCode(field)}</code></td><td>{value}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Données de liasse prêtes à transmettre</h3>
        {mapped.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Formulaire</th><th>Libellé</th><th>Segment</th><th>Code EDI-TDFC</th><th>Valeur</th></tr></thead>
              <tbody>
                {mapped.map((field) => (
                  <tr key={field.key}>
                    <td>{field.form}</td>
                    <td>{field.label}</td>
                    <td>{field.segment}</td>
                    <td><code>{field.ediCode}</code></td>
                    <td>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucune donnée de liasse n’est encore renseignée. Remplis d’abord la déclaration.</p>
        )}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Contrôles avant production réelle</h3>
        <ul className="clean">
          <li>Utiliser un vrai numéro d’agrément partenaire EDI.</li>
          <li>Remplacer l’attestation fictive par une attestation de conformité valide.</li>
          <li>Ajouter la sécurisation électronique AUTACK réelle.</li>
          <li>Effectuer les tests syntaxiques et d’intégration DGFiP.</li>
        </ul>
      </div>
    </>
  );
}
