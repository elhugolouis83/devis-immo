"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { creerDevisSchema } from "@/lib/validation";
import { calculerLigne, calculerTotaux, formaterMontant } from "@/lib/montants";
import { generateDevisPdf } from "@/lib/pdf/generateDevisPdf";
import { envoyerEmailDevis } from "@/lib/email";
import { getAccesStatus } from "@/lib/subscription";

export type DevisFormState = { error: string } | undefined;
export type EnvoiEmailState = { error: string } | { success: true } | undefined;

async function prochainNumero(userId: string) {
  const annee = new Date().getFullYear();
  const debutAnnee = new Date(`${annee}-01-01T00:00:00.000Z`);
  const count = await prisma.devis.count({
    where: { userId, createdAt: { gte: debutAnnee } },
  });
  return `DEV-${annee}-${String(count + 1).padStart(3, "0")}`;
}

export async function creerDevis(
  _prevState: DevisFormState,
  formData: FormData,
): Promise<DevisFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { peutCreerDevis } = await getAccesStatus(user.id);
  if (!peutCreerDevis) {
    return { error: "Essai gratuit terminé — abonne-toi depuis les Réglages pour continuer." };
  }

  let lignesBrutes: unknown;
  try {
    lignesBrutes = JSON.parse(String(formData.get("lignes") || "[]"));
  } catch {
    return { error: "Lignes de devis invalides." };
  }

  const clientId = String(formData.get("clientId") || "");
  const nouveauClientRaw = {
    name: String(formData.get("newClientName") || ""),
    address: String(formData.get("newClientAddress") || ""),
    zipCode: String(formData.get("newClientZipCode") || ""),
    city: String(formData.get("newClientCity") || ""),
    email: String(formData.get("newClientEmail") || ""),
    phone: String(formData.get("newClientPhone") || ""),
  };
  const utiliseNouveauClient = !clientId;

  const parsed = creerDevisSchema.safeParse({
    clientId: clientId || undefined,
    nouveauClient: utiliseNouveauClient ? nouveauClientRaw : undefined,
    lignes: lignesBrutes,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let finalClientId = parsed.data.clientId;

  if (utiliseNouveauClient && parsed.data.nouveauClient) {
    const nc = parsed.data.nouveauClient;
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: nc.name,
        address: nc.address,
        zipCode: nc.zipCode,
        city: nc.city,
        email: nc.email || null,
        phone: nc.phone || null,
      },
    });
    finalClientId = client.id;
  } else if (finalClientId) {
    const client = await prisma.client.findFirst({
      where: { id: finalClientId, userId: user.id },
    });
    if (!client) {
      return { error: "Client introuvable." };
    }
  }

  if (!finalClientId) {
    return { error: "Client manquant." };
  }

  const { totalHT, totalTVA, totalTTC } = calculerTotaux(parsed.data.lignes);
  const number = await prochainNumero(user.id);

  const devis = await prisma.devis.create({
    data: {
      number,
      userId: user.id,
      clientId: finalClientId,
      totalHT,
      totalTVA,
      totalTTC,
      lignes: {
        create: parsed.data.lignes.map((l, index) => ({
          description: l.description,
          quantite: l.quantite,
          prixUnitaireHT: l.prixUnitaireHT,
          tauxTVA: l.tauxTVA,
          totalLigneHT: calculerLigne(l),
          ordre: index,
        })),
      },
    },
  });

  redirect(`/app/devis/${devis.id}`);
}

export async function envoyerDevisParEmail(
  devisId: string,
  _prevState: EnvoiEmailState,
): Promise<EnvoiEmailState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const devis = await prisma.devis.findFirst({
    where: { id: devisId, userId: user.id },
    include: { client: true, lignes: { orderBy: { ordre: "asc" } } },
  });

  if (!devis) {
    return { error: "Devis introuvable." };
  }

  if (!devis.client.email) {
    return { error: "Ce client n'a pas d'adresse email enregistrée." };
  }

  const emetteurNom = user.companyName || user.email;

  try {
    const pdfBuffer = await generateDevisPdf({
      devis,
      emetteur: { nom: emetteurNom },
    });

    await envoyerEmailDevis({
      to: devis.client.email,
      clientNom: devis.client.name,
      emetteurNom,
      devisNumber: devis.number,
      totalTTC: formaterMontant(devis.totalTTC),
      pdfBuffer: Buffer.from(pdfBuffer),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return { error: `Échec de l'envoi : ${message}` };
  }

  await prisma.devis.update({
    where: { id: devis.id },
    data: { status: "envoye", sentAt: new Date() },
  });

  revalidatePath(`/app/devis/${devis.id}`);
  return { success: true };
}
