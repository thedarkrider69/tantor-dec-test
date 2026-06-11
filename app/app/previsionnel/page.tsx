export default function PrevisionnelPage() {
  return (
    <>
      <div className="page-title">
        <div><h1 style={{fontSize: 38, margin: 0}}>Prévisionnel</h1><p>Tantor Prévi est une extension disponible sur abonnement.</p></div>
        <button className="btn btn-primary">Activer Tantor Prévi</button>
      </div>
      <div className="page-banner">
        <div><h3>Tableau de bord Tantor Prévi</h3><p>Créez vos dossiers, saisissez vos hypothèses et générez des rapports professionnels.</p></div>
        <button className="btn">Créer un nouveau prévisionnel</button>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><span>Dossiers actifs</span><strong>0</strong></div>
        <div className="kpi"><span>Dossiers validés</span><strong>0</strong></div>
        <div className="kpi"><span>Dossiers archivés</span><strong>0</strong></div>
        <div className="kpi"><span>Rapports générés</span><strong>0</strong></div>
      </div>
      <div className="card">
        <h3>Parcours prévu</h3>
        <ul className="clean">
          <li>Informations générales de l’entreprise</li>
          <li>Capital social, associés et dirigeants</li>
          <li>Saisie : N-1, investissements, charges, exploitation et impôts</li>
          <li>Contrôle : synthèse, bilan, compte de résultat et trésorerie</li>
          <li>Rapport PDF professionnel</li>
        </ul>
      </div>
    </>
  );
}
