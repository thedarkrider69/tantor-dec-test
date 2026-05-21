import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createDeclarationAction } from "@/lib/actions";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function NewDeclarationPage({ searchParams }: { searchParams: { error?: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const companies = organizationId ? await prisma.company.findMany({ where: { organizationId }, include: { fiscalYears: true } }) : [];
  return (
    <>
      <div className="page-title">
        <div><Link href="/app/declarations">Retour</Link><h1 style={{fontSize: 38, margin: 0}}>Ajouter une déclaration</h1><p>Créez une déclaration fiscale pour une entreprise.</p></div>
      </div>
      <form className="card form" action={createDeclarationAction}>
        {searchParams.error && <div className="error">{searchParams.error}</div>}
        <div className="form-grid">
          <label className="label">Entreprise concernée *<select name="companyId" className="select" required><option value="">Choisir une entreprise</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="label">Exercice lié<select name="fiscalYearId" className="select"><option value="">Pas applicable</option>{companies.flatMap(c => c.fiscalYears.map(y => <option key={y.id} value={y.id}>{c.name} — {formatDate(y.startDate)} - {formatDate(y.endDate)}</option>))}</select></label>
          <label className="label">Année fiscale<input name="fiscalYear" className="input" type="number" defaultValue={2024} /></label>
          <label className="label">Type de déclaration<select name="type" className="select"><option>Liasse 2065 - IS - BIC</option><option>Liasse 2031 + 2033</option><option>Liasse 2035</option><option>CA3 TVA</option><option>CA12 TVA</option></select></label>
          <label className="label">Date d'échéance<input name="dueDate" className="input" type="date" /></label>
          <label className="label">Montant à payer<input name="amount" className="input" type="number" defaultValue={49} /></label>
        </div>
        <div className="actions"><Link className="btn btn-secondary" href="/app/declarations">Annuler</Link><button className="btn btn-primary" type="submit">Ajouter la déclaration</button></div>
      </form>
    </>
  );
}
