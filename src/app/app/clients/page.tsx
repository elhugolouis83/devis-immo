import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClientsListPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { devis: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Clients</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Un client est créé automatiquement quand tu lui fais un premier devis.
      </p>

      <div className="mt-6">
        {clients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-soft">Aucun client pour l&apos;instant.</p>
            <Link
              href="/app/devis/nouveau"
              className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-2"
            >
              Créer ton premier devis
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/app/clients/${c.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-paper-dim"
                >
                  <span>
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="text-ink-soft"> — {c.city}</span>
                  </span>
                  <span className="text-ink-soft">
                    {c._count.devis} devis
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
