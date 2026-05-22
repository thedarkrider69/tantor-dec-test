import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateEdiLocRequestAction, simulateSendEdiLocRequestAction } from "@/lib/actions";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

function locStatusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Brouillon",
    GENERATED: "Fichier généré",
    SENT_SIMULATED: "Envoyée en simulation",
    ACCEPTED_SIMULATED: "Acceptée en simulation",
    REJECTED_SIMULATED: "Rejetée en simulation"
  };
  return labels[status] || status;
}

function locBadgeClass(status: string) {
  if (status.includes("ACCEPTED")) return "badge badge-green";
  if (status.includes("REJECTED")) return "badge badge-red";
  if (status.includes("GENERATED") || status.includes("SENT")) return "badge badge-yellow";
  return "badge";
}

export default async function EdiLocRequestDetailPage({ params, searchParams }: { params: { id: string }; searchParams?: { generated?: string; sent?: string; error?: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const request = await prisma.ediLocRequest.findFirst({
    where: { id: params.id, company: { organizationId: organizationId || "" } },
    include: { company: true }
  });
  if (!request) notFound();

  const response = request.simulatedResponseJson ? JSON.parse(request.simulatedResponseJson) : null;

  return (
    <>
      <div className="page-title">
        <div>
          <Link href="/app/requetes-loc" className="btn btn-secondary" style={{marginBottom: 12}}>← Retour</Link>
          <h1 style={{fontSize: 38, margin: 0}}>Requête LOC</h1>
          <p>{request.reference} — {request.company.name}</p>
        </div>
        <span className={locBadgeClass(request.status)}>{locStatusLabel(request.status)}</span>
      </div>

      {searchParams?.generated && <div className="notice" style={{marginBottom: 16}}>Fichier INFENT RQ LOC généré.</div>}
      {searchParams?.sent && <div className="notice" style={{marginBottom: 16}}>Envoi simulé : réponse R-LISTELOC fictive enregistrée.</div>}
      {searchParams?.error && <div className="error" style={{marginBottom: 16}}>{decodeURIComponent(searchParams.error)}</div>}

      <div className="grid-2">
        <div className="card">
          <h3>Informations de la demande</h3>
          <div className="table-wrap">
            <table style={{minWidth: 460}}>
              <tbody>
                <tr><th>Entreprise</th><td>{request.company.name}</td></tr>
                <tr><th>SIREN demandeur</th><td>{request.requesterSiren}</td></tr>
                <tr><th>SIREN redevable</th><td>{request.taxpayerSiren}</td></tr>
                <tr><th>Code demande</th><td>{request.requestCode}</td></tr>
                <tr><th>Mode unitaire</th><td>{request.unitMode ? "Oui" : "Non"}</td></tr>
                <tr><th>Créée le</th><td>{formatDate(request.createdAt)}</td></tr>
                <tr><th>Générée le</th><td>{formatDate(request.generatedAt)}</td></tr>
                <tr><th>Chemin fichier</th><td>{request.filePath || "-"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Actions</h3>
          <div style={{display: "grid", gap: 12}}>
            <form action={generateEdiLocRequestAction}>
              <input type="hidden" name="requestId" value={request.id} />
              <button className="btn btn-primary" type="submit" style={{width: "100%"}}>Générer INFENT RQ LOC</button>
            </form>
            {request.fileContent && <Link className="btn btn-secondary" href={`/app/requetes-loc/${request.id}/telecharger`}>Télécharger le fichier .edi</Link>}
            <form action={simulateSendEdiLocRequestAction}>
              <input type="hidden" name="requestId" value={request.id} />
              <button className="btn btn-secondary" type="submit" style={{width: "100%"}}>Simuler l’envoi et la réponse</button>
            </form>
          </div>
          <p style={{marginTop: 12}}>Cette version ne transmet rien à la DGFiP : elle génère un fichier local de test puis simule un retour.</p>
        </div>
      </div>

      {request.fileContent && <div className="card" style={{marginTop: 18}}>
        <h3>Aperçu du fichier INFENT RQ LOC</h3>
        <pre className="edi-preview">{request.fileContent}</pre>
      </div>}

      {response && <div className="card" style={{marginTop: 18}}>
        <h3>Réponse simulée R-LISTELOC</h3>
        <p>Cette réponse fictive sert à tester la mémorisation des références de locaux avant la déclaration de loyers.</p>
        <pre className="edi-preview">{JSON.stringify(response, null, 2)}</pre>
      </div>}
    </>
  );
}
