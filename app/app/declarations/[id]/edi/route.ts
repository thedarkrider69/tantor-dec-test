import { NextResponse } from "next/server";
export async function GET() {
  const content = "RECU DE DEPOT EDI\nEntreprise: ALPHA CONSULTING\nStatut: Acceptée\nCode retour: ACK-00\nProtocole: EDI-TDFC\n";
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": "attachment; filename=rec u-depot-edi.txt".replace(" ","") } });
}
