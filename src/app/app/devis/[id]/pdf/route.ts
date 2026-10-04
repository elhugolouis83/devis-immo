import { createElement, type ReactElement } from "react";
import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DevisDocument } from "@/lib/pdf/DevisDocument";

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

  // DevisDocument renders a <Document> at its root, but its own prop type
  // (devis/emetteur) differs from DocumentProps — react-pdf's types want the
  // latter, so we assert what we know to be true about the rendered tree.
  const element = createElement(DevisDocument, {
    devis,
    emetteur: { nom: user.companyName || user.email },
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${devis.number}.pdf"`,
    },
  });
}
