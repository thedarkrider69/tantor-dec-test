"use client";

import Link from "next/link";
import { useState } from "react";
import { Banner, PageHeader, StatCard, Status, TableShell } from "@/components/ui";

const supportedEdi = [
  {
    title: "1. Impôt sur les Sociétés (IS)",
    items: [
      "IS – Réel Simplifié : 2033A à 2033G + 2065",
      "IS – Réel Normal : 2050 à 2059G + 2065",
    ],
  },
  {
    title: "2. Impôt sur le Revenu",
    items: [
      "BIC – Réel Simplifié : 2033A à 2033G + 2031",
      "BIC – Réel Normal : 2050 à 2059G + 2031",
      "BNC : 2035 + annexes",
      "SCI : 2072-S ou 2072-C",
      "SCM : 2036-BIS, 2031, 2050 à 2059G",
    ],
  },
  {
    title: "3. Bénéfices Agricoles (BA)",
    items: [
      "BA Réel Simplifié : 2139 + annexes",
      "BA Réel Normal : 2143 + annexes",
    ],
  },
  {
    title: "4. Intégration fiscale",
    items: [
      "Membre du groupe : 2058-A-Bis, 2058-B-Bis + 2065",
      "Tête de groupe : 2065 (résultat d’ensemble)",
    ],
  },
];

export default function DashboardPage() {
  const [showEdiModal, setShowEdiModal] = useState(false);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Suivez vos entreprises, déclarations et activités récentes."
        action={<Link className="btn btn-primary" href="/app/entreprises/nouvelle">Ajouter une entreprise</Link>}
      />

      <Banner
        title="Déclarations EDI disponibles"
        action={
          <button className="btn btn-secondary" type="button" onClick={() => setShowEdiModal(true)}>
            Voir les EDI supportés
          </button>
        }
      >
        Consultez les modèles configurés par l’administrateur : IS, impôt sur le revenu, bénéfices agricoles et intégration fiscale.
      </Banner>

      <div className="grid-4">
        <StatCard label="Déclarations" value="12" hint="Total" />
        <StatCard label="Entreprises actives" value="3" hint="Enregistrées" />
        <StatCard label="En attente" value="4" hint="À compléter" />
        <StatCard label="Complétées" value="8" hint="Terminées" />
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Guide de démarrage</h2>
          <div className="grid-3">
            <Link className="btn btn-secondary" href="/app/entreprises/nouvelle">1. Ajouter une entreprise</Link>
            <Link className="btn btn-secondary" href="/app/declarations">2. Enregistrer un exercice</Link>
            <Link className="btn btn-secondary" href="/app/declarations/nouvelle">3. Créer une déclaration</Link>
          </div>
        </div>
        <div className="card">
          <h2>Statut global</h2>
          <TableShell headers={["État", "Nombre"]} rows={[[<Status key="y" tone="yellow">À compléter</Status>, "4"], [<Status key="b" tone="blue">Envoyée</Status>, "2"], [<Status key="g" tone="green">Acceptée</Status>, "6"], [<Status key="r" tone="red">Refusée</Status>, "0"]]} />
        </div>
      </div>

      <div className="card">
        <h2>Activité récente</h2>
        <TableShell headers={["Action", "Entreprise", "Statut"]} rows={[["Déclaration 2065 créée", "ALPHA CONSULTING", <Status key="s1" tone="yellow">À compléter</Status>], ["FEC importé", "BETA SERVICES", <Status key="s2" tone="green">Disponible</Status>], ["Paiement validé", "OMEGA SAS", <Status key="s3" tone="green">Payé</Status>]]} />
      </div>

      {showEdiModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edi-modal-title" onClick={() => setShowEdiModal(false)}>
          <div className="edi-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Fermer" onClick={() => setShowEdiModal(false)}>
              ×
            </button>
            <h2 id="edi-modal-title">Types de déclarations prises en charge</h2>
            <div className="edi-modal-content">
              {supportedEdi.map((category) => (
                <section key={category.title}>
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
