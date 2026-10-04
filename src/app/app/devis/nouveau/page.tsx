import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccesStatus, DEVIS_GRATUITS } from "@/lib/subscription";
import { NouveauDevisForm } from "@/components/devis/NouveauDevisForm";
import { redirect } from "next/navigation";

export default async function NouveauDevisPage({
  searchParams,
}: {
  searchParams: Promise<{ bienvenue?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { bienvenue } = await searchParams;
  const { peutCreerDevis } = await getAccesStatus(user.id);

  if (!peutCreerDevis) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="border-2 border-ink bg-white p-8 text-center shadow-hard-sm">
          <h1 className="font-display text-xl font-semibold text-ink">
            Essai gratuit terminé
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Tu as utilisé tes {DEVIS_GRATUITS} devis gratuits. Abonne-toi
            pour continuer à en créer — tes devis existants restent
            accessibles.
          </p>
          <Link
            href="/app/reglages"
            className="press-hard mt-6 inline-block border-2 border-ink bg-brick px-5 py-2.5 text-sm font-medium text-paper shadow-hard-sm"
          >
            Voir l&apos;abonnement
          </Link>
        </div>
      </div>
    );
  }

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, city: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {bienvenue && (
        <div className="mb-6 rounded-lg border border-brick/30 bg-brick/5 px-4 py-3 text-sm text-ink">
          Bienvenue ! Remplis les champs ci-dessous — ton premier devis sera
          prêt en 2 minutes.
        </div>
      )}

      <h1 className="font-display text-2xl font-semibold text-ink">
        Nouveau devis
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Les totaux se calculent automatiquement au fur et à mesure.
      </p>

      <div className="mt-6">
        <NouveauDevisForm clients={clients} />
      </div>
    </div>
  );
}
