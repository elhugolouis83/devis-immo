import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontant } from "@/lib/montants";

export default async function DevisListPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const devis = await prisma.devis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Devis</h1>
        <Link
          href="/app/devis/nouveau"
          className="press-hard border-2 border-ink bg-brick px-4 py-2 text-sm font-medium text-paper shadow-hard-sm"
        >
          + Nouveau devis
        </Link>
      </div>

      <div className="mt-6">
        {devis.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-soft">Aucun devis pour l&apos;instant.</p>
            <Link
              href="/app/devis/nouveau"
              className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-2"
            >
              Créer ton premier devis
            </Link>
          </div>
        ) : (
          <table className="w-full overflow-hidden rounded-lg border border-line bg-white text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3">Numéro</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d) => (
                <tr key={d.id} className="border-b border-line/60 last:border-0 hover:bg-paper-dim">
                  <td className="px-4 py-3">
                    <Link
                      href={`/app/devis/${d.id}`}
                      className="font-medium text-ink underline underline-offset-2"
                    >
                      {d.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    <Link href={`/app/clients/${d.clientId}`} className="hover:text-ink">
                      {d.client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Intl.DateTimeFormat("fr-FR").format(d.issuedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-line px-2 py-0.5 text-xs uppercase tracking-wide text-ink-soft">
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {formaterMontant(d.totalTTC)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
