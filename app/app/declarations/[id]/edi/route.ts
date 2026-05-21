import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrganizationId, requireUser } from "@/lib/auth";
import { readStorageFile } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const organizationId = getOrganizationId(user);
  const declaration = await prisma.declaration.findUnique({ where: { id: params.id }, include: { company: true } });

  if (!declaration || declaration.company.organizationId !== organizationId) {
    return new NextResponse("Déclaration introuvable.", { status: 404 });
  }

  let ediContent = declaration.ediContent;
  if (declaration.ediFilePath) {
    ediContent = await readStorageFile(declaration.ediFilePath).catch(() => declaration.ediContent);
  }

  if (!ediContent) {
    return new NextResponse("Aucun fichier EDI généré.", { status: 404 });
  }

  return new NextResponse(ediContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${declaration.ediFileName || `${declaration.reference}.edi`}"`
    }
  });
}
