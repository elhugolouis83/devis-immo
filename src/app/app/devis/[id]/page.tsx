import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formaterMontant } from "@/lib/montants";
import { MENTIONS_CGV, MENTIONS_DISCLAIMER } from "@/lib/legal";

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { id } = await params;
  const devis = await prisma.devis.findFirst({
    where: { id, userId: user.id },
    include: { client: true, lignes: { orderBy: { ordre: "asc" } } },
  });

  if (!devis) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-soft">Devis</p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {devis.number}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide text-ink-soft">
            {devis.status}
          </span>
          <a
            href={`/app/devis/${devis.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-ink"
          >
            Télécharger le PDF
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Client</h2>
        <p className="mt-2 text-sm text-ink">{devis.client.name}</p>
        <p className="text-sm text-ink-soft">
          {devis.client.address}, {devis.client.zipCode} {devis.client.city}
        </p>
        {devis.client.email && (
          <p className="text-sm text-ink-soft">{devis.client.email}</p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Prestations
        </h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-2 pr-2">Description</th>
              <th className="px-2 py-2 text-right">Qté</th>
              <th className="px-2 py-2 text-right">Prix HT</th>
              <th className="px-2 py-2 text-right">TVA</th>
              <th className="py-2 pl-2 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {devis.lignes.map((l) => (
              <tr key={l.id} className="border-b border-line/60">
                <td className="py-2 pr-2 text-ink">{l.description}</td>
                <td className="px-2 py-2 text-right tabular-nums text-ink-soft">
                  {l.quantite}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-ink-soft">
                  {formaterMontant(l.prixUnitaireHT)}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-ink-soft">
                  {l.tauxTVA} %
                </td>
                <td className="py-2 pl-2 text-right tabular-nums text-ink">
                  {formaterMontant(l.totalLigneHT)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Total HT</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(devis.totalHT)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">TVA</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(devis.totalTVA)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-1 font-display text-base font-semibold">
              <dt className="text-ink">Total TTC</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(devis.totalTTC)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Conditions générales de vente
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
          {MENTIONS_CGV.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-soft/80">{MENTIONS_DISCLAIMER}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link href="/app/devis" className="text-sm text-ink-soft underline underline-offset-2">
          ← Tous les devis
        </Link>
        <p className="text-xs text-ink-soft">
          Envoi par email au client disponible à la prochaine étape.
        </p>
      </div>
    </div>
  );
}
