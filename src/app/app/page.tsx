import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontant } from "@/lib/montants";
import { getAccesStatus, DEVIS_GRATUITS } from "@/lib/subscription";

export default async function AppHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [devisRecents, { estAbonne, restants }] = await Promise.all([
    prisma.devis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
    getAccesStatus(user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Bienvenue{user.companyName ? `, ${user.companyName}` : ""}.
          </h1>
          {!estAbonne && (
            <p className="mt-1 text-xs text-ink-soft">
              {restants > 0
                ? `Essai gratuit — ${restants}/${DEVIS_GRATUITS} devis restants`
                : "Essai gratuit terminé"}{" "}
              ·{" "}
              <Link href="/app/reglages" className="underline underline-offset-2 hover:text-ink">
                voir l&apos;abonnement
              </Link>
            </p>
          )}
        </div>
        <Link
          href="/app/devis/nouveau"
          className="press-hard border-2 border-ink bg-brick px-4 py-2 text-sm font-medium text-paper shadow-hard-sm"
        >
          + Nouveau devis
        </Link>
      </div>

      <div className="mt-8">
        {devisRecents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-soft">
              Aucun devis pour l&apos;instant.
            </p>
            <Link
              href="/app/devis/nouveau"
              className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-2"
            >
              Créer ton premier devis
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {devisRecents.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/app/devis/${d.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-paper-dim"
                >
                  <span>
                    <span className="font-medium text-ink">{d.number}</span>
                    <span className="text-ink-soft"> — {d.client.name}</span>
                  </span>
                  <span className="tabular-nums text-ink-soft">
                    {formaterMontant(d.totalTTC)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
