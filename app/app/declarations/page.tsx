import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createFiscalYearAction } from "@/lib/actions";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { badgeClass, formatDate, statusLabel } from "@/lib/utils";

export default async function DeclarationsPage() {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const companies = organizationId ? await prisma.company.findMany({ where: { organizationId }, include: { fiscalYears: true } }) : [];
  const declarations = organizationId ? await prisma.declaration.findMany({ where: { company: { organizationId } }, include: { company: true, year: true }, orderBy: { createdAt: "desc" } }) : [];
  const years = companies.flatMap(c => c.fiscalYears.map(y => ({ ...y, companyName: c.name })));

  return (
    <>
      <div className="page-title">
        <div><h1 style={{fontSize: 38, margin: 0}}>Mes Déclarations</h1><p>Déposez vos déclarations EDI pour chaque entreprise enregistrée.</p></div>
        <Link className="btn btn-primary" href="/app/declarations/nouvelle">Ajouter une déclaration</Link>
      </div>
      <div className="page-banner">
        <div><h3>Gérez vos déclarations fiscales</h3><p>Créez vos exercices, suivez vos déclarations existantes et anticipez les prochaines échéances.</p></div>
        <Link className="btn" href="/app/declarations/nouvelle">Ajouter une déclaration</Link>
      </div>
      <div className="tabs"><span className="tab active">Exercices comptables</span><span className="tab">Mes déclarations</span><span className="tab">Déclarations à venir</span></div>
      <div className="filters"><select className="select"><option>Toutes les entreprises</option></select><select className="select"><option>Toutes les périodes</option></select><select className="select"><option>Tous les régimes</option></select><select className="select"><option>Toutes les déclarations</option></select></div>
      <div className="grid-2">
        <div className="card">
          <h3>Ajouter un exercice comptable</h3>
          <p>Un exercice doit toujours être lié à une entreprise unique.</p>
          <form className="form" action={createFiscalYearAction}>
            <label className="label">Entreprise concernée<select className="select" name="companyId" required><option value="">Choisir une entreprise</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <div className="form-grid">
              <label className="label">Exercice du<input name="startDate" className="input" type="date" required /></label>
              <label className="label">Au<input name="endDate" className="input" type="date" required /></label>
              <label className="label">Nom FEC<input name="fecFileName" className="input" placeholder="FEC_2024.txt" /></label>
              <label className="label">Nombre de lignes<input name="linesCount" className="input" type="number" placeholder="12000" /></label>
              <label className="label">Bénéfice / Déficit<input name="benefit" className="input" type="number" placeholder="45000" /></label>
              <label className="label"><span>FEC importé</span><input name="fecImported" type="checkbox" /></label>
            </div>
            <button className="btn btn-secondary" type="submit">Enregistrer l'exercice</button>
          </form>
        </div>
        <div className="card">
          <h3>Déclarations à venir</h3>
          <p>Cette section vous rappelle automatiquement les prochaines déclarations attendues.</p>
          <ul className="clean">
            <li>Liasse 2065 — 19 Juillet 2025</li>
            <li>CA3 TVA — prochaine échéance mensuelle</li>
            <li>CVAE — selon régime fiscal</li>
          </ul>
        </div>
      </div>
      <div className="card" style={{marginTop: 18}}>
        <h3>Exercices comptables</h3>
        <div className="table-wrap">
          <table><thead><tr><th>Entreprise</th><th>Période</th><th>FEC importé</th><th>Bénéfice / Déficit</th><th>Lignes</th></tr></thead><tbody>
            {years.length ? years.map(y => <tr key={y.id}><td>{y.companyName}</td><td>{formatDate(y.startDate)} - {formatDate(y.endDate)}</td><td>{y.fecImported ? "✅ Oui" : "❌ Non"}</td><td>{y.benefit} €</td><td>{y.linesCount}</td></tr>) : <tr><td colSpan={5}>Aucun exercice comptable disponible.</td></tr>}
          </tbody></table>
        </div>
      </div>
      <div className="card" style={{marginTop: 18}}>
        <h3>Déclarations fiscales</h3>
        <div className="table-wrap">
          <table><thead><tr><th>Entreprise</th><th>Exercice lié</th><th>Année fiscale</th><th>Type</th><th>Date d'échéance</th><th>État</th><th>Actions</th></tr></thead><tbody>
            {declarations.length ? declarations.map(d => <tr key={d.id}><td>{d.company.name}</td><td>{d.year ? `${formatDate(d.year.startDate)} - ${formatDate(d.year.endDate)}` : "-"}</td><td>{d.fiscalYear}</td><td>{d.type}</td><td>{formatDate(d.dueDate)}</td><td><span className={badgeClass(d.status)}>{statusLabel(d.status)}</span></td><td><Link className="btn btn-secondary" href={`/app/declarations/${d.id}`}>Voir</Link></td></tr>) : <tr><td colSpan={7}>Aucune déclaration disponible.</td></tr>}
          </tbody></table>
        </div>
      </div>
    </>
  );
}
