import { NextResponse } from "next/server";
export async function GET() {
  const content = "FACTURE TANTOR DEC\nN° FAC-2026-001\nService: Dépôt EDI fiscal\nTotal TTC: 90,00 EUR\n";
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": "attachment; filename=facture-tantor-dec.txt" } });
}
