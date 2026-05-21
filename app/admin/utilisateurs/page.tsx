import { prisma } from "@/lib/prisma";
import { adminCreateUserAction } from "@/lib/actions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ include: { memberships: { include: { organization: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Utilisateurs</h1><p>Gérez les rôles utilisateur : admin, partenaire, standard.</p></div></div>
      <div className="grid-2" style={{marginBottom: 18}}>
        <form className="card form" action={adminCreateUserAction}>
          <h3>Ajouter un utilisateur</h3>
          <label className="label">Nom complet<input name="fullName" className="input" placeholder="John Doe" /></label>
          <label className="label">Email<input name="email" className="input" type="email" placeholder="john@gmail.com" /></label>
          <label className="label">Rôle<select name="role" className="select"><option value="USER">Standard</option><option value="PARTNER">Partenaire</option><option value="ADMIN">Admin</option></select></label>
          <label className="label">Mot de passe<input name="password" className="input" placeholder="Tantor123!" /></label>
          <button className="btn btn-primary" type="submit">Créer utilisateur</button>
        </form>
        <div className="card"><h3>Rôles des utilisateurs</h3><p>L'admin gère tout le système, les partenaires envoient des déclarations sans payer, et les utilisateurs standards doivent payer avant l'envoi.</p></div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nom complet</th><th>Email</th><th>Rôle</th><th>Entreprises associées</th><th>Date de création</th></tr></thead><tbody>
        {users.map(u => <tr key={u.id}><td>{u.id.slice(0,8)}</td><td>{u.fullName}</td><td>{u.email}</td><td>{u.role}</td><td>{u.memberships.map(m => m.organization.name).join(", ") || "-"}</td><td>{u.createdAt.toLocaleDateString("fr-FR")}</td></tr>)}
      </tbody></table></div>
    </>
  );
}
