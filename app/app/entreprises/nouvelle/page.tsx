import Link from "next/link";
import { demoSuccessAction } from "@/lib/actions";

const foundCompany = {
  name: "TANTOR DÉCLARATION SARL",
  siren: "812 345 678",
  legalForm: "SARL",
  fiscalRegime: "BIC",
  closingDate: "31/12/2024",
  vatRegime: "Sélectionnez le régime de TVA",
  street: "12 rue des Entrepreneurs",
  postalCode: "75015",
  address2: "Bâtiment B",
  country: "France",
  city: "Paris",
  representative: "Jean Dupont",
  civility: "Monsieur",
  quality: "Gérant",
  email: "jean.dupont@teledec.fr",
  phone: "+33 6 12 34 56 78"
};

export default function NouvelleEntreprisePage({ searchParams }: { searchParams?: { siren?: string } }) {
  const searchedSiren = String(searchParams?.siren ?? "").trim();
  const hasSearch = searchedSiren.length > 0;

  return (
    <div className="enterprise-add-page">
      <div className="breadcrumb-bar">
        <span>Mes Entreprises</span>
        <span>›</span>
        <strong>Ajouter Une Entreprise</strong>
      </div>

      <div className="back-row">
        <Link className="back-btn" href="/app/entreprises">← Retour</Link>
      </div>

      <section className="company-search-card">
        <div>
          <h1>Ajouter une entreprise</h1>
          <p>Recherchez l’entreprise avec son numéro SIREN puis vérifiez les informations préremplies.</p>
        </div>
        <div className="company-search-actions">
          <form className="siren-search-form" action="/app/entreprises/nouvelle" method="get">
            <label htmlFor="siren">Numéro SIREN</label>
            <div className="siren-search-line">
              <input id="siren" name="siren" placeholder="Ex : 812345678" defaultValue={searchedSiren} required />
              <button className="btn btn-primary" type="submit">Rechercher l’entreprise</button>
            </div>
          </form>
          <div className="manual-company-box">
            <span>Entreprise introuvable ou saisie spécifique ?</span>
            <Link className="btn btn-secondary manual-company-btn" href="/app/entreprises/nouvelle/manuelle">
              Ajout manuel des informations
            </Link>
          </div>
        </div>
      </section>

      {hasSearch ? (
        <form className="company-found-panel" action={demoSuccessAction}>
          <input type="hidden" name="next" value="/app/entreprises?success=Entreprise%20enregistrée" />

          <h2>Informations de l’entreprise trouvée</h2>

          <fieldset className="company-section">
            <legend>Informations générales</legend>
            <div className="company-name">{foundCompany.name}</div>
            <div className="company-form-grid two">
              <div className="field compact">
                <label>Numéro SIREN</label>
                <input name="siren" defaultValue={foundCompany.siren} readOnly />
              </div>
              <div className="field compact">
                <label>Forme juridique</label>
                <select name="legalForm" defaultValue={foundCompany.legalForm}>
                  <option>SARL</option>
                  <option>SAS</option>
                  <option>EURL</option>
                  <option>EI</option>
                </select>
              </div>
              <div className="field compact">
                <label>Régime fiscal</label>
                <select name="fiscalRegime" defaultValue={foundCompany.fiscalRegime}>
                  <option>BIC</option>
                  <option>IS</option>
                  <option>IR</option>
                  <option>BNC</option>
                </select>
              </div>
              <div className="field compact">
                <label>Date de clôture des comptes</label>
                <input name="closingDate" defaultValue={foundCompany.closingDate} />
              </div>
              <div className="field compact">
                <label>Régime TVA</label>
                <select name="vatRegime" defaultValue={foundCompany.vatRegime}>
                  <option>Sélectionnez le régime de TVA</option>
                  <option>Franchise en base</option>
                  <option>Réel simplifié</option>
                  <option>Réel normal</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="company-section">
            <legend>Adresse du siège social</legend>
            <div className="company-form-grid two">
              <div className="field compact">
                <label>Rue / Numéro</label>
                <input name="street" defaultValue={foundCompany.street} />
              </div>
              <div className="field compact">
                <label>Code postal</label>
                <input name="postalCode" defaultValue={foundCompany.postalCode} />
              </div>
              <div className="field compact wide">
                <label>Complément d’adresse</label>
                <input name="address2" defaultValue={foundCompany.address2} />
              </div>
              <div className="field compact">
                <label>Pays</label>
                <select name="country" defaultValue={foundCompany.country}>
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Luxembourg</option>
                </select>
              </div>
              <div className="field compact">
                <label>Ville</label>
                <select name="city" defaultValue={foundCompany.city}>
                  <option>Paris</option>
                  <option>Lyon</option>
                  <option>Marseille</option>
                  <option>Orléans</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="company-section">
            <legend>Représentant légal</legend>
            <div className="company-form-grid two">
              <div className="field compact wide">
                <label>Nom complet</label>
                <input name="representative" defaultValue={foundCompany.representative} />
              </div>
              <div className="field compact">
                <label>Civilité / Sexe</label>
                <select name="civility" defaultValue={foundCompany.civility}>
                  <option>Monsieur</option>
                  <option>Madame</option>
                </select>
              </div>
              <div className="field compact">
                <label>Qualité</label>
                <select name="quality" defaultValue={foundCompany.quality}>
                  <option>Gérant</option>
                  <option>Président</option>
                  <option>Directeur général</option>
                  <option>Entrepreneur individuel</option>
                </select>
              </div>
              <div className="field compact">
                <label>Email</label>
                <input name="email" type="email" defaultValue={foundCompany.email} />
              </div>
              <div className="field compact">
                <label>Téléphone</label>
                <input name="phone" defaultValue={foundCompany.phone} />
              </div>
            </div>
          </fieldset>

          <div className="company-actions-sticky">
            <Link className="btn btn-secondary" href="/app/entreprises">Annuler</Link>
            <button className="btn btn-primary" type="submit">Enregistrer l’entreprise</button>
          </div>
        </form>
      ) : (
        <div className="company-empty-search">
          <strong>Recherchez une entreprise avec son numéro SIREN.</strong>
          <p>Après la recherche, Tantor Déc affiche le formulaire prérempli comme dans le cahier des charges.</p>
        </div>
      )}
    </div>
  );
}
