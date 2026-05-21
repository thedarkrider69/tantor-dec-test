import { prisma } from "@/lib/prisma";

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({ include: { organization: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Entreprises</h1><p>Consultez toutes les entreprises inscrites sur la plateforme.</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Entreprise</th><th>SIREN</th><th>Forme juridique</th><th>Régime fiscal</th><th>Organisation</th><th>Adresse</th></tr></thead><tbody>
        {companies.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.siren}</td><td>{c.legalForm}</td><td>{c.taxRegime}</td><td>{c.organization.name}</td><td>{c.address}</td></tr>)}
      </tbody></table></div>
    </>
  );
}
