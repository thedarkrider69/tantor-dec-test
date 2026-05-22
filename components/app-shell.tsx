"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";

type UserLike = { fullName: string; email: string; role: string };

const clientNav = [
  ["/app/dashboard", "Dashboard"],
  ["/app/entreprises", "Mes Entreprises"],
  ["/app/declarations", "Mes Déclarations"],
  ["/app/requetes-loc", "Requêtes LOC"],
  ["/app/tdfc-2025", "EDI-TDFC 2025"],
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
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const nav = mode === "admin" ? adminNav : clientNav;
  const initial = user.fullName?.[0]?.toUpperCase() || "M";
  const home = mode === "admin" ? "/admin/dashboard" : "/app/dashboard";

  return (
    <div className="shell">
      <div className="mobile-appbar">
        <div className="mobile-appbar-row">
          <button className="mobile-menu-button" type="button" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}>
            ☰
          </button>
          <Link className="logo" href={home} onClick={close}>
            <span className="logo-mark">T</span>
            <span>Tantor Déc</span>
          </Link>
          <span className="mobile-appbar-spacer" aria-hidden="true" />
        </div>
      </div>

      {open && (
        <div className="mobile-drawer-root" aria-modal="true" role="dialog">
          <button className="mobile-drawer-backdrop" type="button" aria-label="Fermer le menu" onClick={close} />
          <aside className="mobile-menu-panel mobile-drawer-panel">
            <div className="mobile-drawer-title">
              <span>Tantor Déc</span>
              <button type="button" className="mobile-drawer-close" aria-label="Fermer le menu" onClick={close}>×</button>
            </div>
            <div className="user-chip mobile-user-chip">
              <span className="avatar">{mode === "admin" ? "A" : initial}</span>
              <div style={{minWidth: 0}}>
                <strong>{mode === "admin" ? "ADMIN" : user.fullName}</strong>
                <div className="ellipsis-small">{user.email}</div>
              </div>
            </div>
            <nav className="mobile-nav">
              {nav.map(([href, label]) => <Link key={href} className="side-link" href={href} onClick={close}>{label}</Link>)}
            </nav>
            <form action={logoutAction}>
              <button className="btn btn-secondary" style={{width: "100%"}}>Déconnexion</button>
            </form>
          </aside>
        </div>
      )}

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
