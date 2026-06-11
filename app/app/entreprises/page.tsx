import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser, getOrganizationId } from "@/lib/auth";

export default async function CompaniesPage() {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const companies = organizationId ? await prisma.company.findMany({ where: { organizationId }, include: { fiscalYears: true, declarations: true }, orderBy: { createdAt: "desc" } }) : [];

  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{fontSize: 38, margin: 0}}>Mes Entreprises</h1>
          <p>Gérez les entreprises liées à vos déclarations fiscales.</p>
        </div>
        <Link className="btn btn-primary" href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>
      </div>
      <div className="page-banner">
        <div>
          <h3>{companies.length === 0 ? "Enregistrez votre première entreprise" : "Gérez vos entreprises"}</h3>
          <p>Commencez par ajouter une entreprise grâce à son numéro SIREN. Les informations peuvent ensuite être complétées.</p>
        </div>
        <Link className="btn" href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>
      </div>
      {companies.length > 0 && <div className="filters"><input className="input" placeholder="Rechercher une entreprise par nom ou numéro SIREN..." /><select className="select"><option>Toutes les formes</option></select><select className="select"><option>Tous les régimes</option></select><select className="select"><option>Tous les pays</option></select></div>}
      {companies.length === 0 ? (
        <div className="card">
          <h3>Aucune entreprise enregistrée</h3>
          <p>Commencez par ajouter une entreprise grâce à son numéro SIREN.</p>
          <Link className="btn btn-primary" href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>
        </div>
      ) : (
        <div className="grid-2">
          {companies.map(company => (
            <div className="card" key={company.id}>
              <h3>{company.name}</h3>
              <p><strong>SIREN :</strong> {company.siren}</p>
              <p><strong>Forme juridique :</strong> {company.legalForm}</p>
              <p><strong>Régime fiscal :</strong> {company.taxRegime}</p>
              <p><strong>Régime TVA :</strong> {company.vatRegime}</p>
              <p><strong>Date de clôture :</strong> {company.closingDate}</p>
              <p><strong>Adresse :</strong><br />{company.address || "Adresse non renseignée"}</p>
              <p><strong>Représentant légal :</strong><br />{company.representative || "Non renseigné"}</p>
              <div className="actions">
                <button className="btn btn-danger" type="button">Supprimer</button>
                <button className="btn btn-secondary" type="button">Modifier</button>
                <Link className="btn btn-primary" href={`/app/entreprises/${company.id}/comptabilite`}>Comptabilité</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
