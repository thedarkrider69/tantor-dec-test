import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

const features = [
  ["Téléversement intelligent", "Importez vos fichiers EDI, FEC, PDF, Excel ou TXT. Tantor reconnaît les données et prépare les formulaires."],
  ["Suivi en temps réel", "Suivez chaque statut : à compléter, en cours, envoyée, acceptée ou refusée."],
  ["Historique sécurisé", "Retrouvez vos déclarations, reçus, factures et fichiers EDI dans votre espace."],
  ["Assistance intégrée", "Guides, documentation et support client sont accessibles depuis la plateforme."],
];

const prices = [
  ["Essentielle", "29 €", "Pour indépendants et auto-entrepreneurs", ["1 déclaration EDI / mois", "Assistance par email", "Archivage sécurisé 12 mois", "Accès 24/7"]],
  ["Pro", "59 €", "Pour TPE & PME en croissance", ["Déclarations illimitées", "Tous les formulaires", "Envoi EDI simulé", "Archivage 24 mois"]],
  ["Expert", "89 €", "Pour cabinets & partenaires", ["Multi-clients", "Utilisateurs illimités", "Support prioritaire", "Facturation mensuelle"]],
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Simple. Rapide. 100% sécurisé.</span>
            <h1>Simplifiez vos déclarations fiscales avec <span className="hero-title-accent">Tantor Déc</span></h1>
            <p>Notre plateforme EDI vous permet de déclarer en quelques clics, d’importer vos fichiers FEC et de suivre vos obligations fiscales dans un espace clair et conforme.</p>
            <div className="hero-points">
              <span>Téléversement simple</span>
              <span>Assistance</span>
              <span>Historique</span>
            </div>
            <div className="actions" style={{marginTop: 24}}>
              <Link className="btn btn-secondary" href="#fonctionnalites">Découvrir les fonctionnalités</Link>
              <Link className="btn btn-primary" href="/register">Créer un compte</Link>
            </div>
            <div className="stats">
              <div className="stat"><b>EDI</b><span>IS, TVA, BIC, BNC</span></div>
              <div className="stat"><b>FEC</b><span>Balance et états</span></div>
              <div className="stat"><b>DGFiP</b><span>Flux de test structurés</span></div>
            </div>
          </div>

          <div className="hero-card" aria-label="Aperçu déclaration Tantor Déc">
            <div className="mock-screen">
              <div className="mock-screen-head">Déclaration de revenus</div>
              <div className="mock-screen-body">
                <strong>Déclaration des revenus</strong>
                <p style={{margin: "6px 0 0", fontSize: 12}}>Sélectionnez un document à compléter.</p>
                <div className="mock-list">
                  <div className="mock-row"><span className="mock-check" /><span>Déclaration 2065</span><strong>À remplir</strong></div>
                  <div className="mock-row"><span className="mock-check" /><span>Bilan actif 2050</span><strong>Validé</strong></div>
                  <div className="mock-row"><span className="mock-check" /><span>Compte de résultat</span><strong>En cours</strong></div>
                </div>
                <div style={{marginTop: 14}}><span className="btn btn-primary" style={{width: "100%"}}>Continuer</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="section">
        <div className="container">
          <div className="section-head">
            <h2>Fonctionnalités</h2>
            <p>Tantor Déc suit le parcours du cahier des charges : entreprises, exercices, FEC, déclarations, paiements, factures et assistance.</p>
          </div>
          <div className="grid-4">
            {features.map(([title, body], index) => (
              <div className="card" key={title}>
                <div className="feature-icon">{index + 1}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="edi" className="section" style={{background: "#fff"}}>
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Les EDI</span>
            <h2>Comprendre les EDI et leur utilité</h2>
            <p>Les Échanges de Données Informatisés permettent de préparer automatiquement les déclarations fiscales à transmettre à l’administration, sans papier et avec un meilleur contrôle des données.</p>
          </div>
          <div className="card">
            <h3>Types de déclarations prises en charge</h3>
            <ul className="clean">
              <li>IS réel simplifié : 2033A à 2033G + 2065</li>
              <li>IS réel normal : 2050 à 2059G + 2065</li>
              <li>BIC, BNC, SCI, SCM et intégration fiscale</li>
              <li>TVA CA3, CA12, CVAE et déclarations associées</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="tarifs" className="section">
        <div className="container">
          <div className="section-head">
            <h2>Des tarifs simples et transparents</h2>
            <p>Choisissez la formule adaptée à votre usage : standard, professionnel ou cabinet partenaire.</p>
          </div>
          <div className="grid-3">
            {prices.map(([name, price, subtitle, items]) => (
              <div className="card" key={String(name)}>
                <h3>Formule {name}</h3>
                <p>{subtitle as string}</p>
                <div className="price">{price}<span style={{fontSize: 15, color: "var(--muted)"}}> / mois</span></div>
                <Link className="btn btn-primary" href="/register" style={{width: "100%"}}>Choisir {name}</Link>
                <ul className="clean">{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section" style={{background: "#fff"}}>
        <div className="container grid-2">
          <div className="card"><h3>Qu’est-ce qu’un EDI ?</h3><p>Un format d’échange permettant la transmission dématérialisée de données fiscales.</p></div>
          <div className="card"><h3>Puis-je tester Tantor Déc gratuitement ?</h3><p>Oui, la version test permet de créer un compte, ajouter une entreprise et générer des fichiers de démonstration.</p></div>
          <div className="card"><h3>Est-ce conforme aux normes fiscales ?</h3><p>Le projet intègre les structures TDFC 2025, mais la production officielle nécessite l’agrément et les tests EDIFICAS.</p></div>
          <div className="card"><h3>Puis-je transmettre plusieurs formulaires ?</h3><p>Oui, l’architecture prévoit plusieurs documents par modèle de déclaration.</p></div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container grid-2">
          <div>
            <h2>Une question ? Contactez-nous</h2>
            <p>Notre équipe répond aux demandes concernant Tantor Déc, les déclarations EDI et les fonctionnalités de la plateforme.</p>
            <p><strong>Email :</strong> support@tantordec.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          </div>
          <form className="card form">
            <div className="form-grid">
              <label className="label">Nom<input className="input" placeholder="Dupont" /></label>
              <label className="label">Prénom<input className="input" placeholder="Jean" /></label>
            </div>
            <label className="label">Adresse email<input className="input" placeholder="votre@email.com" /></label>
            <label className="label">Message<textarea className="textarea" placeholder="Votre message" /></label>
            <button className="btn btn-primary" type="button">Envoyer</button>
          </form>
        </div>
      </section>
      <PublicFooter />
    </>
  );
}
