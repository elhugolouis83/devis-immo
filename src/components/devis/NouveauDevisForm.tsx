"use client";

import { useActionState, useMemo, useState } from "react";
import { creerDevis, type DevisFormState } from "@/actions/devis";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { calculerLigne, calculerTotaux, formaterMontant } from "@/lib/montants";
import { MENTIONS_CGV, MENTIONS_DISCLAIMER, TAUX_TVA_OPTIONS } from "@/lib/legal";

type ClientOption = { id: string; name: string; city: string };

type Ligne = {
  description: string;
  quantite: string;
  prixUnitaireHT: string;
  tauxTVA: number;
};

const ligneVide = (): Ligne => ({
  description: "",
  quantite: "1",
  prixUnitaireHT: "",
  tauxTVA: 5.5,
});

export function NouveauDevisForm({ clients }: { clients: ClientOption[] }) {
  const [state, formAction] = useActionState<DevisFormState, FormData>(
    creerDevis,
    undefined,
  );
  const [clientMode, setClientMode] = useState<"existing" | "new">(
    clients.length > 0 ? "existing" : "new",
  );
  const [lignes, setLignes] = useState<Ligne[]>([ligneVide()]);

  const lignesCalcul = useMemo(
    () =>
      lignes.map((l) => ({
        description: l.description,
        quantite: Number(l.quantite) || 0,
        prixUnitaireHT: Number(l.prixUnitaireHT) || 0,
        tauxTVA: l.tauxTVA,
      })),
    [lignes],
  );

  const totaux = useMemo(() => calculerTotaux(lignesCalcul), [lignesCalcul]);

  function updateLigne(index: number, patch: Partial<Ligne>) {
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  function ajouterLigne() {
    setLignes((prev) => [...prev, ligneVide()]);
  }

  function supprimerLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="lignes" value={JSON.stringify(lignesCalcul)} readOnly />

      <section className="rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Client</h2>

        {clients.length > 0 && (
          <div className="mt-3 flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setClientMode("existing")}
              className={`rounded-md border px-3 py-1.5 ${clientMode === "existing" ? "border-ink bg-ink text-paper" : "border-line text-ink-soft"}`}
            >
              Client existant
            </button>
            <button
              type="button"
              onClick={() => setClientMode("new")}
              className={`rounded-md border px-3 py-1.5 ${clientMode === "new" ? "border-ink bg-ink text-paper" : "border-line text-ink-soft"}`}
            >
              Nouveau client
            </button>
          </div>
        )}

        {clientMode === "existing" && clients.length > 0 ? (
          <div className="mt-4">
            <label htmlFor="clientId" className="block text-sm font-medium text-ink">
              Choisir un client
            </label>
            <select
              id="clientId"
              name="clientId"
              required
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="newClientName" className="block text-sm font-medium text-ink">
                Nom ou raison sociale
              </label>
              <input
                id="newClientName"
                name="newClientName"
                required
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="newClientAddress" className="block text-sm font-medium text-ink">
                Adresse
              </label>
              <input
                id="newClientAddress"
                name="newClientAddress"
                required
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="newClientZipCode" className="block text-sm font-medium text-ink">
                Code postal
              </label>
              <input
                id="newClientZipCode"
                name="newClientZipCode"
                required
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="newClientCity" className="block text-sm font-medium text-ink">
                Ville
              </label>
              <input
                id="newClientCity"
                name="newClientCity"
                required
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="newClientEmail" className="block text-sm font-medium text-ink">
                Email (optionnel)
              </label>
              <input
                id="newClientEmail"
                name="newClientEmail"
                type="email"
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="newClientPhone" className="block text-sm font-medium text-ink">
                Téléphone (optionnel)
              </label>
              <input
                id="newClientPhone"
                name="newClientPhone"
                type="tel"
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Prestations
          </h2>
          <button
            type="button"
            onClick={ajouterLigne}
            className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-ink"
          >
            + Ajouter une ligne
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="py-2 pr-2">Description</th>
                <th className="w-20 px-2 py-2 text-right">Qté</th>
                <th className="w-28 px-2 py-2 text-right">Prix HT</th>
                <th className="w-24 px-2 py-2 text-right">TVA</th>
                <th className="w-28 px-2 py-2 text-right">Total HT</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, index) => (
                <tr key={index} className="border-b border-line/60">
                  <td className="py-2 pr-2">
                    <input
                      value={ligne.description}
                      onChange={(e) => updateLigne(index, { description: e.target.value })}
                      required
                      placeholder="Ex. Remplacement chaudière"
                      className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={ligne.quantite}
                      onChange={(e) => updateLigne(index, { quantite: e.target.value })}
                      required
                      className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-right text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={ligne.prixUnitaireHT}
                      onChange={(e) => updateLigne(index, { prixUnitaireHT: e.target.value })}
                      required
                      placeholder="0,00"
                      className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-right text-sm outline-none focus:border-ink"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={ligne.tauxTVA}
                      onChange={(e) => updateLigne(index, { tauxTVA: Number(e.target.value) })}
                      className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-right text-sm outline-none focus:border-ink"
                    >
                      {TAUX_TVA_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t} %
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-ink">
                    {formaterMontant(calculerLigne(lignesCalcul[index]))}
                  </td>
                  <td className="py-2 text-right">
                    {lignes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerLigne(index)}
                        aria-label="Supprimer la ligne"
                        className="text-ink-soft hover:text-error"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Total HT</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(totaux.totalHT)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">TVA</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(totaux.totalTVA)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-1 font-display text-base font-semibold">
              <dt className="text-ink">Total TTC</dt>
              <dd className="tabular-nums text-ink">{formaterMontant(totaux.totalTTC)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Conditions générales de vente
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
          {MENTIONS_CGV.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-soft/80">{MENTIONS_DISCLAIMER}</p>
      </section>

      {state?.error && (
        <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <div className="w-full max-w-xs">
          <SubmitButton>Créer le devis</SubmitButton>
        </div>
      </div>
    </form>
  );
}
