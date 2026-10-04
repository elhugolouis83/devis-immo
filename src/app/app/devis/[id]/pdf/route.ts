import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDevisPdf } from "@/lib/pdf/generateDevisPdf";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const devis = await prisma.devis.findFirst({
    where: { id, userId: user.id },
    include: { client: true, lignes: { orderBy: { ordre: "asc" } } },
  });

  if (!devis) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

  const buffer = await generateDevisPdf({
    devis,
    emetteur: { nom: user.companyName || user.email },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${devis.number}.pdf"`,
    },
  });
}
