import Link from "next/link";
import { createCompanyAction } from "@/lib/actions";
import { ErrorMessage } from "@/components/forms";

export default function NewCompanyPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <>
      <div className="page-title">
        <div>
          <Link href="/app/entreprises">Retour</Link>
          <h1 style={{fontSize: 38, margin: 0}}>Ajouter une entreprise</h1>
          <p>Recherchez votre entreprise avec son numéro SIREN puis complétez les informations.</p>
        </div>
      </div>
      <form className="card form" action={createCompanyAction}>
        <ErrorMessage message={searchParams.error} />
        <div className="form-grid">
          <label className="label">Nom de l'entreprise *<input name="name" className="input" placeholder="ALPHA CONSULTING SARL" required /></label>
          <label className="label">Numéro SIREN *<input name="siren" className="input" placeholder="812345678" required /></label>
          <label className="label">SIRET<input name="siret" className="input" placeholder="81234567800012" /></label>
          <label className="label">Forme juridique<select name="legalForm" className="select"><option>SARL</option><option>SAS</option><option>SA</option><option>EURL</option><option>SCI</option></select></label>
          <label className="label">Régime fiscal<select name="taxRegime" className="select"><option>IS</option><option>BIC</option><option>BNC</option><option>SCI</option></select></label>
          <label className="label">Régime TVA<select name="vatRegime" className="select"><option>Réel simplifié</option><option>Réel normal</option><option>Franchise en base</option></select></label>
          <label className="label">Date de clôture<input name="closingDate" className="input" placeholder="31/12/2024" /></label>
          <label className="label">Représentant légal<input name="representative" className="input" placeholder="Jean Dupont" /></label>
          <label className="label">Email représentant<input name="repEmail" className="input" placeholder="jean@entreprise.fr" /></label>
          <label className="label">Téléphone<input name="repPhone" className="input" placeholder="+33 6 12 34 56 78" /></label>
          <label className="label full">Adresse du siège social<textarea name="address" className="textarea" placeholder="12 rue des Entrepreneurs, 75015 Paris, France" /></label>
        </div>
        <div className="actions"><Link className="btn btn-secondary" href="/app/entreprises">Annuler</Link><button className="btn btn-primary" type="submit">Enregistrer l'entreprise</button></div>
      </form>
    </>
  );
}
