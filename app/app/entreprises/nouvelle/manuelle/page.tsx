import Link from "next/link";
import { demoSuccessAction } from "@/lib/actions";

export default function NouvelleEntrepriseManuellePage() {
  return (
    <div className="enterprise-add-page">
      <div className="breadcrumb-bar">
        <span>Mes Entreprises</span>
        <span>›</span>
        <Link href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>
        <span>›</span>
        <strong>Ajout manuel</strong>
      </div>

      <div className="back-row">
        <Link className="back-btn" href="/app/entreprises/nouvelle">← Retour</Link>
      </div>

      <form className="company-found-panel" action={demoSuccessAction}>
        <input type="hidden" name="next" value="/app/entreprises?success=Entreprise%20enregistrée%20manuellement" />

        <div className="manual-form-heading">
          <div>
            <h2>Ajout manuel des informations</h2>
            <p>Remplissez les informations de l’entreprise à la main si la recherche SIREN ne retourne pas de résultat.</p>
          </div>
          <Link className="btn btn-secondary" href="/app/entreprises/nouvelle">Rechercher avec un SIREN</Link>
        </div>

        <fieldset className="company-section">
          <legend>Informations générales</legend>
          <div className="company-form-grid two">
            <div className="field compact wide">
              <label>Raison sociale</label>
              <input name="name" placeholder="Ex : TANTOR DÉCLARATION SARL" required />
            </div>
            <div className="field compact">
              <label>Numéro SIREN</label>
              <input name="siren" placeholder="Ex : 812 345 678" required />
            </div>
            <div className="field compact">
              <label>Forme juridique</label>
              <select name="legalForm" defaultValue="">
                <option value="" disabled>Sélectionnez la forme juridique</option>
                <option>SARL</option>
                <option>SAS</option>
                <option>SASU</option>
                <option>EURL</option>
                <option>EI</option>
                <option>SCI</option>
              </select>
            </div>
            <div className="field compact">
              <label>Régime fiscal</label>
              <select name="fiscalRegime" defaultValue="">
                <option value="" disabled>Sélectionnez le régime fiscal</option>
                <option>BIC</option>
                <option>IS</option>
                <option>IR</option>
                <option>BNC</option>
                <option>BA</option>
              </select>
            </div>
            <div className="field compact">
              <label>Date de clôture des comptes</label>
              <input name="closingDate" placeholder="31/12/2024" />
            </div>
            <div className="field compact">
              <label>Régime TVA</label>
              <select name="vatRegime" defaultValue="">
                <option value="" disabled>Sélectionnez le régime de TVA</option>
                <option>Franchise en base</option>
                <option>Réel simplifié</option>
                <option>Réel normal</option>
                <option>Non assujetti</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="company-section">
          <legend>Adresse du siège social</legend>
          <div className="company-form-grid two">
            <div className="field compact">
              <label>Rue / Numéro</label>
              <input name="street" placeholder="12 rue des Entrepreneurs" />
            </div>
            <div className="field compact">
              <label>Code postal</label>
              <input name="postalCode" placeholder="75015" />
            </div>
            <div className="field compact wide">
              <label>Complément d’adresse</label>
              <input name="address2" placeholder="Bâtiment, étage, appartement..." />
            </div>
            <div className="field compact">
              <label>Pays</label>
              <select name="country" defaultValue="France">
                <option>France</option>
                <option>Belgique</option>
                <option>Luxembourg</option>
                <option>Autre</option>
              </select>
            </div>
            <div className="field compact">
              <label>Ville</label>
              <input name="city" placeholder="Paris" />
            </div>
          </div>
        </fieldset>

        <fieldset className="company-section">
          <legend>Représentant légal</legend>
          <div className="company-form-grid two">
            <div className="field compact wide">
              <label>Nom complet</label>
              <input name="representative" placeholder="Jean Dupont" />
            </div>
            <div className="field compact">
              <label>Civilité / Sexe</label>
              <select name="civility" defaultValue="">
                <option value="" disabled>Sélectionnez</option>
                <option>Monsieur</option>
                <option>Madame</option>
              </select>
            </div>
            <div className="field compact">
              <label>Qualité</label>
              <select name="quality" defaultValue="">
                <option value="" disabled>Sélectionnez la qualité</option>
                <option>Gérant</option>
                <option>Président</option>
                <option>Directeur général</option>
                <option>Entrepreneur individuel</option>
              </select>
            </div>
            <div className="field compact">
              <label>Email</label>
              <input name="email" type="email" placeholder="contact@entreprise.fr" />
            </div>
            <div className="field compact">
              <label>Téléphone</label>
              <input name="phone" placeholder="+33 6 12 34 56 78" />
            </div>
          </div>
        </fieldset>

        <div className="company-actions-sticky">
          <Link className="btn btn-secondary" href="/app/entreprises">Annuler</Link>
          <button className="btn btn-primary" type="submit">Enregistrer l’entreprise</button>
        </div>
      </form>
    </div>
  );
}
