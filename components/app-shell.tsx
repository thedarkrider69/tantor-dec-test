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
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="logo" href={mode === "admin" ? "/admin/dashboard" : "/app/dashboard"}>
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
              <div style={{fontSize: 12, color: "#d0d5dd", overflow: "hidden", textOverflow: "ellipsis"}}>{user.email}</div>
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
          <span className="badge">{mode === "admin" ? "Back-office" : "MVP local"}</span>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
