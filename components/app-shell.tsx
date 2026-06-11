"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";

type UserLike = { fullName: string; email: string; role: string };

const clientNav = [
  ["/app/dashboard", "Tableau de bord"],
  ["/app/entreprises", "Mes Entreprises"],
  ["/app/declarations", "Mes Déclarations"],
  ["/app/previsionnel", "Prévisionnel"],
  ["/app/factures", "Mes Factures"],
  ["/app/compte", "Mon Compte"],
  ["/app/aide", "Aide"]
];

const adminNav = [
  ["/admin/dashboard", "Tableau de bord"],
  ["/admin/declarations", "Déclarations"],
  ["/admin/entreprises", "Entreprises"],
  ["/admin/utilisateurs", "Utilisateurs"],
  ["/admin/paiements", "Paiements & Factures"],
  ["/admin/support", "Assistance utilisateur"],
  ["/admin/cgv", "CGV"]
];

export function AppShell({ user, mode, children }: { user: UserLike; mode: "client" | "admin"; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = mode === "admin" ? adminNav : clientNav;
  const home = mode === "admin" ? "/admin/dashboard" : "/app/dashboard";
  const initial = mode === "admin" ? "A" : (user.fullName?.[0]?.toUpperCase() || "M");

  return (
    <div className="shell">
      <header className="mobilebar">
        <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">☰</button>
        <Link className="brand compact" href={home}><span className="brand-mark">T</span><span>Tantor Déc</span></Link>
      </header>
      {open && <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Fermer" />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Link className="brand" href={home}><span className="brand-mark">T</span><span>Tantor Déc</span></Link>
          <button className="icon-btn close" onClick={() => setOpen(false)} aria-label="Fermer">×</button>
        </div>
        <nav className="side-nav">
          {nav.map(([href, label]) => (
            <Link key={href} className={`side-link ${pathname === href || pathname.startsWith(href + "/") ? "active" : ""}`} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip"><span className="avatar">{initial}</span><div><strong>{mode === "admin" ? "ADMIN" : user.fullName}</strong><small>{user.email}</small></div></div>
          <form action={logoutAction}><button className="btn btn-ghost full">Déconnexion</button></form>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <span>{mode === "admin" ? "Espace Administrateur" : "Espace sécurisé Tantor Déc"}</span>
          <span className="pill">Simple. Rapide. 100% sécurisé.</span>
        </div>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
