import { prisma } from "@/lib/prisma";
import { supportTicketAction } from "@/lib/actions";

export default async function HelpPage({ searchParams }: { searchParams: { sent?: string } }) {
  const articles = await prisma.helpArticle.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Aide & Documentation</h1><p>Consultez les guides ou contactez l'assistance.</p></div></div>
      {searchParams.sent && <div className="notice" style={{marginBottom: 16}}>Votre demande a bien été envoyée.</div>}
      <div className="grid-3">
        {articles.map(article => <div className="card" key={article.id}><h3>{article.title}</h3><p>{article.description}</p><button className="btn btn-secondary" type="button">{article.type === "Vidéo" ? "Regarder la vidéo" : "Lire le manuel"}</button></div>)}
      </div>
      <div className="grid-2" style={{marginTop: 18}}>
        <div className="card"><h3>Contact direct</h3><p>Vous préférez nous appeler ?</p><p><strong>+33 1 23 45 67 89</strong><br />support@tantordec.fr</p></div>
        <form className="card form" action={supportTicketAction}>
          <h3>Formulaire de contact</h3>
          <label className="label">Sujet<input name="subject" className="input" placeholder="Votre sujet" required /></label>
          <label className="label">Message<textarea name="message" className="textarea" placeholder="Votre message" required /></label>
          <button className="btn btn-primary" type="submit">Envoyer ma demande</button>
        </form>
      </div>
    </>
  );
}
