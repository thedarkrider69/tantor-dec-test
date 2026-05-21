import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { buildInvoiceText, readStorageFile } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const invoice = await prisma.invoice.findUnique({ where: { id: params.id }, include: { declaration: { include: { company: true } }, payment: true } });

  if (!invoice || invoice.organizationId !== organizationId) {
    return new NextResponse("Facture introuvable.", { status: 404 });
  }

  const content = invoice.invoiceFilePath
    ? await readStorageFile(invoice.invoiceFilePath).catch(() => buildInvoiceText(invoice))
    : buildInvoiceText(invoice);

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${invoice.number}.txt"`
    }
  });
}
