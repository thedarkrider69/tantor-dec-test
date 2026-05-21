import { prisma } from "@/lib/prisma";
import { badgeClass, formatDate, statusLabel } from "@/lib/utils";

export default async function AdminSupportPage() {
  const [tickets, articles] = await Promise.all([
    prisma.supportTicket.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.helpArticle.findMany({ orderBy: { createdAt: "desc" } })
  ]);
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Assistance utilisateur</h1><p>Gérez les demandes d'assistance et les manuels utilisateur.</p></div><button className="btn btn-primary">Ajouter un manuel</button></div>
      <div className="grid-2" style={{marginBottom: 18}}>
        <div className="card"><h3>Ajouter un manuel utilisateur</h3><p>Ajoutez un guide PDF ou une vidéo accessible aux utilisateurs.</p><div className="form"><input className="input" placeholder="Titre du manuel" /><input className="input" placeholder="Description courte" /><select className="select"><option>PDF</option><option>Lien vidéo</option></select><button className="btn btn-secondary">Enregistrer le manuel</button></div></div>
        <div className="card"><h3>Manuels existants</h3>{articles.map(a => <p key={a.id}><strong>{a.title}</strong><br />{a.description}</p>)}</div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Nom</th><th>Email</th><th>Sujet</th><th>Message</th><th>Répondu</th><th>Date réception</th><th>Actions</th></tr></thead><tbody>
        {tickets.map(t => <tr key={t.id}><td>{t.name}</td><td>{t.email}</td><td>{t.subject}</td><td>{t.message}</td><td><span className={badgeClass(t.status)}>{statusLabel(t.status)}</span></td><td>{formatDate(t.createdAt)}</td><td><button className="btn btn-secondary">Répondre</button></td></tr>)}
      </tbody></table></div>
    </>
  );
}
