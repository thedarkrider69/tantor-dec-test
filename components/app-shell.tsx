import Link from "next/link";
import { logoutAction } from "@/lib/actions";

type UserLike = { fullName: string; email: string; role: string };

const clientNav = [
  ["/app/dashboard", "Dashboard"],
  ["/app/entreprises", "Mes Entreprises"],
  ["/app/declarations", "Mes Déclarations"],
  ["/app/factures", "Mes factures"],
  ["/app/fichiers", "Mes fichiers"],
  ["/app/compte", "Mon Compte"],
  ["/app/aide", "Aide"]
];

const adminNav = [
  ["/admin/dashboard", "Tableau de bord"],
  ["/admin/declarations", "Déclarations"],
  ["/admin/entreprises", "Entreprises"],
  ["/admin/utilisateurs", "Utilisateurs"],
  ["/admin/paiements", "Paiements & Factures"],
  ["/admin/support", "Assistance utilisateur"]
];

export function AppShell({ user, mode, children }: { user: UserLike; mode: "client" | "admin"; children: React.ReactNode }) {
  const nav = mode === "admin" ? adminNav : clientNav;
  const initial = user.fullName?.[0]?.toUpperCase() || "M";
  const home = mode === "admin" ? "/admin/dashboard" : "/app/dashboard";
  return (
    <div className="shell">
      <div className="mobile-appbar">
        <div className="mobile-appbar-row">
          <Link className="logo" href={home}>
            <span className="logo-mark">T</span>
            <span>Tantor Déc</span>
          </Link>
          <details className="mobile-menu">
            <summary>Menu</summary>
            <div className="mobile-menu-panel">
              <div className="user-chip mobile-user-chip">
                <span className="avatar">{mode === "admin" ? "A" : initial}</span>
                <div style={{minWidth: 0}}>
                  <strong>{mode === "admin" ? "ADMIN" : user.fullName}</strong>
                  <div className="ellipsis-small">{user.email}</div>
                </div>
              </div>
              <nav className="mobile-nav">
                {nav.map(([href, label]) => <Link key={href} className="side-link" href={href}>{label}</Link>)}
              </nav>
              <form action={logoutAction}>
                <button className="btn btn-secondary" style={{width: "100%"}}>Déconnexion</button>
              </form>
            </div>
          </details>
        </div>
      </div>

      <aside className="sidebar">
        <Link className="logo" href={home}>
          <span className="logo-mark">T</span>
          <span>Tantor Déc</span>
        </Link>
        <nav className="side-nav">
          {nav.map(([href, label]) => <Link key={href} className="side-link" href={href}>{label}</Link>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip">
            <span className="avatar">{mode === "admin" ? "A" : initial}</span>
            <div style={{minWidth: 0}}>
              <strong>{mode === "admin" ? "ADMIN" : user.fullName}</strong>
              <div className="ellipsis-small">{user.email}</div>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="btn btn-secondary" style={{width: "100%"}}>Déconnexion</button>
          </form>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <strong>{mode === "admin" ? "Administration" : "Espace client"}</strong>
          <span className="badge">{mode === "admin" ? "Back-office" : "MVP test"}</span>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
