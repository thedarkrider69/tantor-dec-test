"use client";

import Link from "next/link";
import { useState } from "react";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
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
        <button className="mobile-menu-button public-menu-button" type="button" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}>
          ☰
        </button>
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
      </div>

      {open && (
        <div className="mobile-drawer-root" aria-modal="true" role="dialog">
          <button className="mobile-drawer-backdrop" type="button" aria-label="Fermer le menu" onClick={close} />
          <aside className="public-mobile-panel mobile-drawer-panel">
            <div className="mobile-drawer-title">
              <span>Tantor Déc</span>
              <button type="button" className="mobile-drawer-close" aria-label="Fermer le menu" onClick={close}>×</button>
            </div>
            {links.map(([href, label]) => (
              <Link key={href} href={href} onClick={close}>{label}</Link>
            ))}
            <Link className="btn btn-secondary" href="/login" onClick={close}>Connexion</Link>
            <Link className="btn btn-primary" href="/register" onClick={close}>Créer un compte</Link>
          </aside>
        </div>
      )}
    </header>
  );
}
