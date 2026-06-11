import Link from "next/link";
export function PublicHeader() {
  return <header className="public-header"><div className="container public-nav"><Link className="brand" href="/"><span className="brand-mark">T</span><span>Tantor Déc</span></Link><div className="nav-actions"><Link className="btn btn-secondary" href="/login">Connexion</Link><Link className="btn btn-primary" href="/register">Créer un compte</Link></div></div></header>;
}
