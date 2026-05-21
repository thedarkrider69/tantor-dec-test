import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { readStorageFile, userStorageRelativePath } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  const requestedPath = request.nextUrl.searchParams.get("path") || "";
  const userFolder = userStorageRelativePath(user);
  const absoluteRequested = path.resolve(process.cwd(), requestedPath);
  const absoluteUserFolder = path.resolve(process.cwd(), userFolder);

  if (!requestedPath || !absoluteRequested.startsWith(absoluteUserFolder)) {
    return new NextResponse("Fichier non autorisé.", { status: 403 });
  }

  const content = await readStorageFile(requestedPath).catch(() => null);
  if (!content) return new NextResponse("Fichier introuvable.", { status: 404 });

  const ext = path.extname(requestedPath).toLowerCase();
  const contentType = ext === ".json" ? "application/json; charset=utf-8" : "text/plain; charset=utf-8";
  const fileName = path.basename(requestedPath);
  return new NextResponse(content, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`
    }
  });
}
