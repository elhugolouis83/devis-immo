"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function InscriptionPage() {
  const [state, formAction] = useActionState(signup, undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Créer un compte
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Essai gratuit, sans carte bancaire.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-ink">
              Société ou nom (optionnel)
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              autoComplete="organization"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
            <p className="mt-1 text-xs text-ink-soft">8 caractères minimum.</p>
          </div>

          {state?.error && (
            <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">
              {state.error}
            </p>
          )}

          <SubmitButton>Créer mon compte</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-ink underline underline-offset-2">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
