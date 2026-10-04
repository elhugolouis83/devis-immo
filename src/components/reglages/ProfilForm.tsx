"use client";

import { useActionState } from "react";
import { mettreAJourProfil } from "@/actions/subscription";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ProfilForm({ companyName }: { companyName: string | null }) {
  const [state, formAction] = useActionState(mettreAJourProfil, undefined);

  return (
    <form action={formAction} className="mt-4 flex items-end gap-3">
      <div className="flex-1">
        <label htmlFor="companyName" className="block text-sm font-medium text-ink">
          Société ou nom
        </label>
        <input
          id="companyName"
          name="companyName"
          defaultValue={companyName ?? ""}
          className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      </div>
      <div className="w-32">
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
      {state && "error" in state && (
        <p className="text-sm text-error">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-ok">Enregistré.</p>
      )}
    </form>
  );
}
