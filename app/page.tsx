import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

const features = [
  ["Téléversement intelligent", "Importez vos fichiers EDI et FEC. Le système prépare vos déclarations et détecte les incohérences."],
  ["Suivi en temps réel", "Suivez chaque déclaration : brouillon, à compléter, envoyée, acceptée, refusée ou en retard."],
  ["Historique sécurisé", "Conservez les exercices, factures, reçus et déclarations dans un espace centralisé."],
  ["Assistance intégrée", "Un espace aide et support permet de créer des demandes et de consulter la documentation."]
];

const prices = [
  ["Essentielle", "29 €", "Pour indépendants", ["1 déclaration EDI / mois", "Assistance par email", "Archivage sécurisé 12 mois"]],
  ["Pro", "59 €", "Pour TPE & PME", ["Déclarations illimitées", "Tous les formulaires", "Tableau de bord personnalisé"]],
  ["Expert", "89 €", "Pour cabinets", ["Multi-clients", "Utilisateurs illimités", "Support prioritaire"]]
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Simple. Rapide. 100% sécurisé.</span>
            <h1>Simplifiez vos déclarations fiscales</h1>
            <p>Notre plateforme EDI vous permet de déclarer en quelques clics, d'organiser vos entreprises, de suivre vos exercices et de centraliser vos factures.</p>
            <div className="actions" style={{marginTop: 24}}>
              <Link className="btn btn-primary" href="/register">Créer un compte gratuitement</Link>
              <Link className="btn btn-secondary" href="#fonctionnalites">Découvrir les fonctionnalités</Link>
            </div>
            <div className="stats">
              <div className="stat"><b>EDI</b><span>IS, TVA, BIC, BNC</span></div>
              <div className="stat"><b>FEC</b><span>Balance et états</span></div>
              <div className="stat"><b>24/7</b><span>Espace sécurisé</span></div>
            </div>
          </div>
          <div className="hero-card">
            <h3>Dashboard Tantor Déc</h3>
            <p>Vue d'ensemble de vos déclarations fiscales.</p>
            <div className="kpi-grid" style={{gridTemplateColumns: "1fr 1fr"}}>
              <div className="kpi"><span>Total Déclarations</span><strong>24</strong></div>
              <div className="kpi"><span>Entreprises</span><strong>3</strong></div>
              <div className="kpi"><span>En attente</span><strong>5</strong></div>
              <div className="kpi"><span>Complétées</span><strong>19</strong></div>
            </div>
            <div className="card">
              <strong>Guide de démarrage</strong>
              <ul className="clean">
                <li>Ajouter votre entreprise</li>
                <li>Enregistrer l'exercice</li>
                <li>Remplir la liasse fiscale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="section">
        <div className="container">
          <div className="section-head">
            <h2>Fonctionnalités</h2>
            <p>Tantor Déc vous offre une plateforme EDI complète, intuitive et sécurisée pour gagner du temps et éviter les erreurs.</p>
          </div>
          <div className="grid-4">
            {features.map(([title, body]) => <div className="card" key={title}><h3>{title}</h3><p>{body}</p></div>)}
          </div>
        </div>
      </section>

      <section id="edi" className="section" style={{background: "white"}}>
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Les EDI</span>
            <h2>Comprendre les EDI et leur utilité</h2>
            <p>Les Échanges de Données Informatisés permettent d'envoyer automatiquement vos déclarations fiscales à l'administration, sans papier, sans erreur et sans délai.</p>
          </div>
          <div className="card">
            <h3>Déclarations prises en charge</h3>
            <ul className="clean">
              <li>IS réel simplifié : 2033A à 2033G + 2065</li>
              <li>IS réel normal : 2050 à 2059G + 2065</li>
              <li>BIC, BNC, SCI, SCM</li>
              <li>TVA CA3, CA12 et déclarations associées</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="tarifs" className="section">
        <div className="container">
          <div className="section-head">
            <h2>Des tarifs simples et transparents</h2>
            <p>Choisissez la formule qui vous convient, sans engagement.</p>
          </div>
          <div className="grid-3">
            {prices.map(([name, price, subtitle, items]) => (
              <div className="card" key={String(name)}>
                <h3>{name}</h3>
                <p>{subtitle as string}</p>
                <div className="price">{price}<span style={{fontSize: 16, color: "var(--muted)"}}> / mois</span></div>
                <Link className="btn btn-primary" href="/register" style={{width: "100%"}}>Choisir {name}</Link>
                <ul className="clean">{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section" style={{background: "white"}}>
        <div className="container grid-2">
          <div className="card"><h3>Qu'est-ce qu'un EDI ?</h3><p>Un format d'échange permettant la transmission dématérialisée de données fiscales.</p></div>
          <div className="card"><h3>Puis-je tester gratuitement ?</h3><p>Oui, cette version propose une période d'essai locale et un parcours de démonstration.</p></div>
          <div className="card"><h3>Est-ce conforme ?</h3><p>La structure est prévue pour les exigences françaises, mais la production nécessite une intégration EDI agréée.</p></div>
          <div className="card"><h3>Plusieurs formulaires ?</h3><p>Oui, le modèle supporte plusieurs types de déclarations et formulaires.</p></div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container grid-2">
          <div>
            <h2>Une question ? Contactez-nous</h2>
            <p>Notre équipe est disponible pour répondre à toutes vos demandes concernant Tantor Déc.</p>
            <p><strong>Email :</strong> support@tantordec.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          </div>
          <form className="card form">
            <label className="label">Nom<input className="input" placeholder="Jean Dupont" /></label>
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
