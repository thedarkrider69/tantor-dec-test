import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizationId, requireUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const request = await prisma.ediLocRequest.findFirst({ where: { id: params.id, company: { organizationId: organizationId || "" } } });
  if (!request?.fileContent) return new NextResponse("Fichier introuvable", { status: 404 });
  return new NextResponse(request.fileContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${request.fileName || `${request.reference}.edi`}"`
    }
  });
}
