import { Banner, EmptyState, PageHeader, Status, TableShell } from "@/components/ui";

const fecRules = [
  "Fichier texte .txt avec colonnes séparées par TABULATION",
  "Colonnes officielles conservées dans le bon ordre",
  "Dates au format YYYYMMDD",
  "Montants avec virgule : 178,80 et non 178.80",
  "Une ligne contient soit un débit soit un crédit, jamais les deux",
  "Un seul exercice comptable par fichier FEC",
];

const mappingRows = [
  ["Ventes", "706", "Compte de résultat → Produits", "BIC / BA → chiffre d’affaires"],
  ["Achats / charges", "606, 623", "Compte de résultat → Charges", "BIC / BA → charges professionnelles"],
  ["TVA collectée", "44571", "TVA collectée", "Déclaration TVA"],
  ["TVA déductible", "44566", "TVA récupérable", "Déclaration TVA"],
  ["Banque", "512", "Disponibilités", "Bilan / trésorerie"],
  ["Clients", "411", "Créances clients", "Bilan actif"],
  ["Fournisseurs", "401", "Dettes fournisseurs", "Bilan passif"],
];

export default function ComptabilitePage(){
  return <>
    <PageHeader
      title="Comptabilité & FEC"
      subtitle="Créez les exercices, importez le FEC, contrôlez sa conformité et générez les états comptables utiles aux déclarations."
      action={<button className="btn btn-primary">Créer un exercice comptable</button>}
    />

    <Banner title="Suivez la comptabilité de votre entreprise" action={<button className="btn btn-secondary">Importer un fichier FEC</button>}>
      Le FEC sert à générer automatiquement la balance, le bilan, le compte de résultat et à pré-remplir les déclarations fiscales.
    </Banner>

    <div className="grid-3">
      <div className="stat-card"><small>FEC importé</small><strong>Oui</strong><span>1 244 lignes contrôlées</span></div>
      <div className="stat-card"><small>Résultat calculé</small><strong>18 450 €</strong><span>Bénéfice de l’exercice</span></div>
      <div className="stat-card"><small>Anomalies FEC</small><strong>0</strong><span>Import conforme</span></div>
    </div>

    <div className="card">
      <div className="table-head">
        <h2>Exercices fiscaux</h2>
        <button className="btn btn-secondary">Ajouter un exercice</button>
      </div>
      <TableShell
        headers={["Période", "FEC", "Bénéfice / déficit", "Nombre de lignes", "Date d’import", "Actions"]}
        rows={[
          ["01/01/2024 - 31/12/2024", <Status tone="green">Importé</Status>, "18 450 €", "1 244", "17/06/2025", "Voir états · Télécharger FEC · Mettre à jour"],
          ["01/01/2025 - 31/12/2025", <Status tone="yellow">Non importé</Status>, "—", "—", "—", "Importer"],
        ]}
      />
    </div>

    <div className="grid-2">
      <div className="card">
        <h2>Contrôles obligatoires avant import</h2>
        <div className="check-list">
          {fecRules.map((rule) => <div className="check-item" key={rule}><span>✓</span>{rule}</div>)}
        </div>
      </div>
      <div className="card">
        <h2>Rapport d’import FEC</h2>
        <TableShell
          headers={["Contrôle", "Résultat", "Message"]}
          rows={[
            ["Structure des colonnes", <Status tone="green">OK</Status>, "JournalCode, EcritureDate, CompteNum, Debit, Credit…"],
            ["Période", <Status tone="green">OK</Status>, "Toutes les écritures appartiennent à l’exercice"],
            ["Montants", <Status tone="green">OK</Status>, "Virgule décimale détectée"],
            ["Débit / Crédit", <Status tone="green">OK</Status>, "Aucune écriture vide ou double sens"],
          ]}
        />
      </div>
    </div>

    <div className="card">
      <h2>Utilisation automatique du FEC dans les déclarations</h2>
      <TableShell
        headers={["Élément du FEC", "Compte", "État généré", "Déclaration alimentée"]}
        rows={mappingRows}
      />
    </div>

    <div className="card">
      <div className="table-head">
        <h2>États comptables générés</h2>
        <button className="btn btn-secondary">Paramétrer comptes auxiliaires</button>
      </div>
      <div className="tabs">
        <span className="tab active">Balance</span>
        <span className="tab">Bilan</span>
        <span className="tab">Compte de résultat</span>
        <span className="tab">Comptes auxiliaires</span>
      </div>
      <div style={{height:14}} />
      <TableShell
        headers={["Compte", "Libellé", "Débit (€)", "Crédit (€)"]}
        rows={[
          ["41100000", "Clients", "12 000,00", "0,00"],
          ["40100000", "Fournisseurs", "0,00", "7 400,00"],
          ["44571700", "TVA collectée 20 %", "0,00", "160,00"],
          ["51210000", "Banque", "5 150,00", "0,00"],
        ]}
      />
    </div>

    <div className="grid-2">
      <div className="card">
        <h2>Comptes auxiliaires</h2>
        <TableShell
          headers={["Nom", "Racine début", "Racine fin", "Nb caractères", "Comptes concernés", "Action"]}
          rows={[
            ["Clients", "41100000", "41199999", "8", "12", "Voir détails"],
            ["Fournisseurs", "40100000", "40199999", "8", "9", "Voir détails"],
          ]}
        />
      </div>
      <EmptyState title="Ajouter un compte auxiliaire" text="Définissez une racine de début, une racine de fin, une longueur de caractères et choisissez les comptes à regrouper." label="Ajouter" href="/app/entreprises/demo/comptabilite" />
    </div>
  </>;
}
