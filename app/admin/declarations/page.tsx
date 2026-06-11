import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { badgeClass, formatDate, formatEuro, statusLabel } from "@/lib/utils";

export default async function AdminDeclarationsPage() {
  const declarations = await prisma.declaration.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="page-title"><div><h1 style={{fontSize: 38, margin: 0}}>Déclarations</h1><p>Gestion des modèles, types de déclaration et déclarations soumises.</p></div><button className="btn btn-primary">Créer un nouveau modèle</button></div>
      <div className="page-banner"><div><h3>Gestion des modèles</h3><p>Créez les types, documents PDF, champs, formules et règles d’anomalie comme prévu dans le cahier des charges.</p></div><button className="btn">Ajouter un type</button></div>
      <div className="grid-3" style={{marginBottom: 18}}>
        <div className="card"><h3>Modèles de déclaration</h3><p>Créez et configurez les formulaires PDF, champs et règles.</p><button className="btn btn-secondary">Voir les modèles</button></div>
        <div className="card"><h3>Types de déclaration</h3><p>TVA, IS, CET, revenus personnels et déclarations sociales.</p><button className="btn btn-secondary">Ajouter un type</button></div>
        <div className="card"><h3>Règles d'anomalie</h3><p>Paramétrez les contrôles : champs obligatoires, égalités, seuils.</p><button className="btn btn-secondary">Créer une règle</button></div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Numéro</th><th>Entreprise</th><th>Type</th><th>Statut</th><th>Date envoi</th><th>Montant</th><th>Actions</th></tr></thead><tbody>
        {declarations.map(d => <tr key={d.id}><td>{d.reference}</td><td>{d.company.name}</td><td>{d.type}</td><td><span className={badgeClass(d.status)}>{statusLabel(d.status)}</span></td><td>{formatDate(d.sentAt)}</td><td>{formatEuro(d.amount)}</td><td><Link href={`/app/declarations/${d.id}`}>Voir</Link></td></tr>)}
      </tbody></table></div>
    </>
  );
}
