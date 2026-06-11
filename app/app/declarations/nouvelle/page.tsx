import Link from "next/link";
import { Banner, PageHeader, Status, TableShell } from "@/components/ui";

export default function NouvelleDeclaration(){
  return <>
    <PageHeader
      title="Ajouter une déclaration"
      subtitle="Sélectionnez l’entreprise, l’exercice comptable disponible et le type de déclaration EDI compatible."
    />

    <div className="card form-grid">
      <h2>1. Entreprise concernée</h2>
      <div className="field">
        <label>Entreprise</label>
        <select>
          <option>ALPHA CONSULTING — SIREN 948 123 456 — SAS — IS — TVA réel normal</option>
          <option>BETA SERVICES — SIREN 812 345 678 — SARL — BIC — Franchise TVA</option>
        </select>
      </div>
      <div className="grid-4">
        <div className="info-tile"><small>Raison sociale</small><strong>ALPHA CONSULTING</strong></div>
        <div className="info-tile"><small>SIREN</small><strong>948 123 456</strong></div>
        <div className="info-tile"><small>Régime fiscal</small><strong>IS</strong></div>
        <div className="info-tile"><small>Régime TVA</small><strong>Réel normal</strong></div>
      </div>
    </div>

    <div className="card">
      <div className="table-head"><h2>2. Exercices disponibles</h2><button className="btn btn-secondary">Créer un nouvel exercice comptable</button></div>
      <TableShell
        headers={["Période", "Date de clôture", "État", "FEC", "Déclaration", "Sélection"]}
        rows={[
          ["01/01/2024 - 31/12/2024", "31/12/2024", <Status tone="green">Ouvert</Status>, <Status tone="green">Disponible</Status>, <Status tone="neutral">Aucune déclaration</Status>, <input type="radio" name="exercise" defaultChecked />],
          ["01/01/2023 - 31/12/2023", "31/12/2023", <Status tone="neutral">Clôturé</Status>, <Status tone="green">Disponible</Status>, <Status tone="yellow">Déclaration existante</Status>, <span className="muted">Grisé</span>],
        ]}
      />
    </div>

    <div className="card form-grid">
      <h2>3. Type de déclaration</h2>
      <div className="field">
        <label>Type EDI compatible</label>
        <select>
          <option>Impôts sur les sociétés — 2065 : Déclaration de résultat IS</option>
          <option>TVA — CA3 mensuelle</option>
          <option>CVAE</option>
          <option>Liasse fiscale 2065</option>
        </select>
      </div>
      <Banner title="Règle de compatibilité">
        Le système n’affiche que les déclarations compatibles avec l’entreprise, son régime fiscal, son régime TVA et l’exercice sélectionné.
      </Banner>
      <div className="tabs">
        <Link className="btn btn-primary" href="/app/declarations/demo">Continuer vers la déclaration</Link>
        <Link className="btn btn-secondary" href="/app/declarations">Annuler</Link>
      </div>
    </div>
  </>;
}
