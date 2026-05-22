import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createEdiLocRequestAction } from "@/lib/actions";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

function locStatusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Brouillon",
    GENERATED: "Fichier généré",
    SENT_SIMULATED: "Envoyée en simulation",
    ACCEPTED_SIMULATED: "Acceptée en simulation",
    REJECTED_SIMULATED: "Rejetée en simulation"
  };
  return labels[status] || status;
}

function locBadgeClass(status: string) {
  if (status.includes("ACCEPTED")) return "badge badge-green";
  if (status.includes("REJECTED")) return "badge badge-red";
  if (status.includes("GENERATED") || status.includes("SENT")) return "badge badge-yellow";
  return "badge";
}

export default async function EdiLocRequestsPage() {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const companies = organizationId ? await prisma.company.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }) : [];
  const requests = organizationId ? await prisma.ediLocRequest.findMany({
    where: { company: { organizationId } },
    include: { company: true },
    orderBy: { createdAt: "desc" }
  }) : [];

  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{fontSize: 38, margin: 0}}>Requêtes LOC</h1>
          <p>Générez un fichier local de test INFENT RQ pour demander la liste des locaux occupés d’une entreprise.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Nouvelle demande de liste des locaux</h3>
          <p>La demande utilise le formulaire technique R-IDENTIF avec un SIREN demandeur, un SIREN redevable et le code de demande LOC.</p>
          <form className="form" action={createEdiLocRequestAction}>
            <label className="label">Entreprise concernée
              <select className="select" name="companyId" required>
                <option value="">Choisir une entreprise</option>
                {companies.map(company => <option key={company.id} value={company.id}>{company.name} — {company.siren}</option>)}
              </select>
            </label>
            <div className="form-grid">
              <label className="label">SIREN demandeur
                <input className="input" name="requesterSiren" placeholder="9 chiffres" maxLength={14} />
              </label>
              <label className="label">SIREN redevable
                <input className="input" name="taxpayerSiren" placeholder="9 chiffres" maxLength={14} />
              </label>
            </div>
            <label className="label" style={{display: "flex", alignItems: "center", gap: 10}}>
              <input name="unitMode" type="checkbox" />
              Demande en mode unitaire
            </label>
            <button className="btn btn-primary" type="submit" disabled={!companies.length}>Créer la requête LOC</button>
          </form>
          {!companies.length && <p className="error" style={{marginTop: 12}}>Ajoute d’abord une entreprise pour pouvoir créer une requête LOC.</p>}
        </div>

        <div className="card">
          <h3>À quoi sert cette requête ?</h3>
          <p>La requête LOC sert à récupérer les références des locaux occupés par l’entreprise : ROF CFE, référence du local, invariant, surfaces et catégorie révisée.</p>
          <ul className="clean">
            <li>Étape 1 : création de la demande R-IDENTIF</li>
            <li>Étape 2 : génération locale du fichier INFENT RQ</li>
            <li>Étape 3 : simulation d’un retour INFENT REP / R-LISTELOC</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{marginTop: 18}}>
        <h3>Historique des requêtes LOC</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Référence</th><th>Entreprise</th><th>SIREN redevable</th><th>Mode unitaire</th><th>Statut</th><th>Généré le</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.length ? requests.map(req => (
                <tr key={req.id}>
                  <td>{req.reference}</td>
                  <td>{req.company.name}</td>
                  <td>{req.taxpayerSiren}</td>
                  <td>{req.unitMode ? "Oui" : "Non"}</td>
                  <td><span className={locBadgeClass(req.status)}>{locStatusLabel(req.status)}</span></td>
                  <td>{formatDate(req.generatedAt)}</td>
                  <td><Link className="btn btn-secondary" href={`/app/requetes-loc/${req.id}`}>Voir</Link></td>
                </tr>
              )) : <tr><td colSpan={7}>Aucune requête LOC pour le moment.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
