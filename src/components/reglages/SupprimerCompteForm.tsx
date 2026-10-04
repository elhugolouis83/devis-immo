"use client";

import { useState } from "react";
import { supprimerCompte } from "@/actions/subscription";

export function SupprimerCompteForm({ email }: { email: string }) {
  const [confirmation, setConfirmation] = useState(false);

  if (!confirmation) {
    return (
      <button
        type="button"
        onClick={() => setConfirmation(true)}
        className="border-2 border-error px-4 py-2 text-sm font-medium text-error hover:bg-error/5"
      >
        Supprimer mon compte
      </button>
    );
  }

  return (
    <form action={supprimerCompte} className="space-y-3">
      <p className="text-sm text-ink">
        Cette action est définitive : tous tes devis, clients et factures
        seront supprimés. Pour confirmer, tape ton email ({email})
        ci-dessous.
      </p>
      <input
        name="confirmation"
        type="email"
        required
        placeholder={email}
        className="w-full max-w-sm border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-error"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="border-2 border-error bg-error px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
        >
          Oui, supprimer définitivement
        </button>
        <button
          type="button"
          onClick={() => setConfirmation(false)}
          className="px-4 py-2 text-sm text-ink-soft hover:text-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
