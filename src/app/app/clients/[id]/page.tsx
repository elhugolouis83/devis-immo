import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontant } from "@/lib/montants";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, userId: user.id },
    include: { devis: { orderBy: { createdAt: "desc" } } },
  });

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-ink-soft">Client</p>
      <h1 className="font-display text-2xl font-semibold text-ink">{client.name}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {client.address}, {client.zipCode} {client.city}
      </p>
      {(client.email || client.phone) && (
        <p className="text-sm text-ink-soft">
          {[client.email, client.phone].filter(Boolean).join(" · ")}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Historique des devis
        </h2>
        <Link
          href="/app/devis/nouveau"
          className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-ink"
        >
          + Nouveau devis
        </Link>
      </div>

      <div className="mt-3">
        {client.devis.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-soft">Aucun devis pour ce client.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {client.devis.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/app/devis/${d.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-paper-dim"
                >
                  <span className="font-medium text-ink">{d.number}</span>
                  <span className="tabular-nums text-ink-soft">
                    {formaterMontant(d.totalTTC)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/app/clients"
        className="mt-6 inline-block text-sm text-ink-soft underline underline-offset-2"
      >
        ← Tous les clients
      </Link>
    </div>
  );
}
