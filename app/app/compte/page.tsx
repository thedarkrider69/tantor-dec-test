import { prisma } from "@/lib/prisma";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { updateProfileAction } from "@/lib/actions";
import { userStorageRelativePath } from "@/lib/storage";

export default async function AccountPage({ searchParams }: { searchParams: { updated?: string, error?: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const organization = organizationId ? await prisma.organization.findUnique({ where: { id: organizationId } }) : null;
  const storagePath = userStorageRelativePath(user);
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Mon Compte</h1><p>Gérez vos informations personnelles et vos moyens de paiement.</p></div></div>
      {searchParams.updated && <div className="notice" style={{marginBottom: 16}}>Profil mis à jour.</div>}
      {searchParams.error && <div className="error" style={{marginBottom: 16}}>{searchParams.error}</div>}
      <div className="grid-2">
        <form className="card form" action={updateProfileAction}>
          <h3>Informations personnelles</h3>
          <label className="label">Nom complet<input name="fullName" className="input" defaultValue={user.fullName} /></label>
          <label className="label">Adresse email<input className="input" defaultValue={user.email} disabled /></label>
          <label className="label">Organisation<input className="input" defaultValue={organization?.name ?? "-"} disabled /></label>
          <label className="label">Dossier local utilisateur<input className="input" defaultValue={storagePath} disabled /></label>
          <button className="btn btn-primary" type="submit">Enregistrer</button>
        </form>
        <div className="card">
          <h3>Comptes bancaires</h3>
          <p>Carte •••• 5284 — Exp. 08/27</p>
          <button className="btn btn-secondary" type="button">Ajouter une nouvelle carte</button>
          <p style={{marginTop: 16}}>Vos données sont sécurisées grâce à un cryptage SSL. Dans cette version locale, aucune carte n'est stockée.</p>
        </div>
      </div>
    </>
  );
}
