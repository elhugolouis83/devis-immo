import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NouveauDevisForm } from "@/components/devis/NouveauDevisForm";
import { redirect } from "next/navigation";

export default async function NouveauDevisPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, city: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
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
