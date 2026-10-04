"use client";

import { useActionState } from "react";
import { envoyerDevisParEmail } from "@/actions/devis";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function EnvoyerDevisButton({
  devisId,
  clientEmail,
  dejaEnvoye,
}: {
  devisId: string;
  clientEmail: string | null;
  dejaEnvoye: boolean;
}) {
  const action = envoyerDevisParEmail.bind(null, devisId);
  const [state, formAction] = useActionState(action, undefined);

  if (!clientEmail) {
    return (
      <p className="text-xs text-ink-soft">
        Ajoute un email pour ce client afin de pouvoir lui envoyer ce devis.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-3">
      <div className="w-48">
        <SubmitButton>
          {dejaEnvoye ? "Renvoyer au client" : "Envoyer au client"}
        </SubmitButton>
      </div>
      {state && "error" in state && (
        <p className="text-sm text-error">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-ok">Devis envoyé à {clientEmail}.</p>
      )}
    </form>
  );
}
