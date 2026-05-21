import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="footer">
      <div className="container grid-4">
        <div>
          <div className="logo"><span className="logo-mark">T</span><span>Tantor Déc</span></div>
          <p>La plateforme intelligente pour vos déclarations EDI. Simple, rapide et conforme.</p>
        </div>
        <div>
          <h3>Navigation rapide</h3>
          <p><Link href="/">Accueil</Link></p>
          <p><Link href="/#fonctionnalites">Fonctionnalités</Link></p>
          <p><Link href="/#tarifs">Tarifs</Link></p>
        </div>
        <div>
          <h3>Support</h3>
          <p>support@tantordec.fr</p>
          <p>+33 1 23 45 67 89</p>
          <p>Du lundi au vendredi, 9h – 18h</p>
        </div>
        <div>
          <h3>Légal</h3>
          <p>Mentions légales</p>
          <p>Politique de confidentialité</p>
          <p>Conditions générales</p>
          <p>Cookies</p>
        </div>
      </div>
      <div className="container" style={{marginTop: 30, borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: 18}}>
        <p>© 2026 Tantor Déc. Tous droits réservés. Prototype MVP local.</p>
      </div>
    </footer>
  );
}
