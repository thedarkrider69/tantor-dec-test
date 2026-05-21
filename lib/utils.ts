export function formatEuro(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Brouillon",
    TO_COMPLETE: "À compléter",
    PROCESSING: "En cours",
    SENT: "Envoyée",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
    LATE: "En retard",
    ARCHIVED: "Archivée",
    PENDING: "À payer",
    PAID: "Payée",
    CANCELED: "Annulée",
    OPEN: "Ouvert",
    ANSWERED: "Répondu",
    CLOSED: "Fermé"
  };
  return labels[status] ?? status;
}

export function badgeClass(status: string) {
  if (["ACCEPTED", "PAID", "SENT", "Réussi"].includes(status)) return "badge badge-green";
  if (["TO_COMPLETE", "PENDING", "PROCESSING"].includes(status)) return "badge badge-yellow";
  if (["REJECTED", "LATE", "CANCELED"].includes(status)) return "badge badge-red";
  return "badge";
}

export function makeReference(prefix = "DEC") {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 899999);
  return `${prefix}-${year}-${random}`;
}
