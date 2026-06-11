export default function AdminCgvPage() {
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>CGV</h1><p>Mise à jour dynamique des Conditions Générales de Vente.</p></div><button className="btn btn-primary">Publier</button></div>
      <div className="grid-2">
        <form className="card form">
          <h3>Édition du contenu</h3>
          <label className="label">Titre<input className="input" defaultValue="Conditions Générales de Vente" /></label>
          <label className="label">Contenu<textarea className="textarea" defaultValue="Collez ici les CGV de Tantor Déc et Tantor Prévi." /></label>
          <button type="button" className="btn btn-primary">Enregistrer</button>
        </form>
        <div className="card">
          <h3>Historique des versions</h3>
          <div className="table-wrap"><table><thead><tr><th>Date</th><th>Administrateur</th><th>Statut</th></tr></thead><tbody><tr><td>Aucune version</td><td>-</td><td><span className="badge">Brouillon</span></td></tr></tbody></table></div>
        </div>
      </div>
    </>
  );
}
