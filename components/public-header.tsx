import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">T</span>
          <span>Tantor Déc</span>
        </Link>
        <nav className="nav">
          <Link href="/#fonctionnalites">Fonctionnalités</Link>
          <Link href="/#edi">Les EDI</Link>
          <Link href="/#tarifs">Tarifs</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <div className="actions">
          <Link className="btn btn-secondary" href="/login">Connexion</Link>
          <Link className="btn btn-primary" href="/register">Créer un compte</Link>
        </div>
      </div>
    </header>
  );
}
