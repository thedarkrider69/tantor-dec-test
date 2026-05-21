import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listUserStorageFiles, userStorageRelativePath } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default async function UserFilesPage() {
  const user = await requireUser();
  const files = await listUserStorageFiles(user);
  const folder = userStorageRelativePath(user);

  return (
    <>
      <div className="page-title">
        <div>
          <h1 style={{fontSize: 38, margin: 0}}>Mes fichiers locaux</h1>
          <p>Chaque utilisateur possède son propre dossier physique avec ses données, déclarations, EDI, factures et reçus.</p>
        </div>
      </div>
      <div className="notice" style={{marginBottom: 16}}>Dossier utilisateur : <code>{folder}</code></div>
      <div className="card">
        <h3>Structure créée automatiquement</h3>
        <ul className="clean">
          <li>01-profil : informations utilisateur et organisation.</li>
          <li>02-entreprises : fiches entreprises.</li>
          <li>03-exercices : exercices comptables et FEC déclaré.</li>
          <li>04-declarations : valeurs de liasse, anomalies et copie EDI par déclaration.</li>
          <li>05-edi : tous les fichiers .edi de l'utilisateur.</li>
          <li>06-factures : factures JSON et texte.</li>
          <li>07-recus : reçus locaux de dépôt.</li>
          <li>08-support : demandes d'aide envoyées.</li>
        </ul>
      </div>
      <div className="card" style={{marginTop: 18}}>
        <h3>Fichiers sauvegardés</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Type</th><th>Taille</th><th>Modifié le</th><th>Chemin</th><th>Action</th></tr></thead>
            <tbody>
              {files.length ? files.map((file) => (
                <tr key={file.path}>
                  <td>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{formatSize(file.size)}</td>
                  <td>{formatDate(file.updatedAt)}</td>
                  <td><code>{file.path}</code></td>
                  <td><Link className="btn btn-secondary" href={`/app/fichiers/telecharger?path=${encodeURIComponent(file.path)}`}>Télécharger</Link></td>
                </tr>
              )) : <tr><td colSpan={6}>Aucun fichier sauvegardé pour le moment. Crée une entreprise ou génère un EDI pour alimenter ton dossier.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
