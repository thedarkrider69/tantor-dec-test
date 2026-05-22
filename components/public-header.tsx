import Link from "next/link";

export function PublicHeader() {
  const links = [
    ["/#fonctionnalites", "Fonctionnalités"],
    ["/#edi", "Les EDI"],
    ["/#tarifs", "Tarifs"],
    ["/#faq", "FAQ"],
    ["/#contact", "Contact"]
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">T</span>
          <span>Tantor Déc</span>
        </Link>
        <nav className="nav">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="actions desktop-actions">
          <Link className="btn btn-secondary" href="/login">Connexion</Link>
          <Link className="btn btn-primary" href="/register">Créer un compte</Link>
        </div>
        <details className="public-mobile-menu">
          <summary>Menu</summary>
          <div className="public-mobile-panel">
            {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            <Link className="btn btn-secondary" href="/login">Connexion</Link>
            <Link className="btn btn-primary" href="/register">Créer un compte</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
