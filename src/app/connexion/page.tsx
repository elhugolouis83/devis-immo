"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function ConnexionPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Connexion
        </h1>

        <form action={formAction} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
          </div>

          {state?.error && (
            <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">
              {state.error}
            </p>
          )}

          <SubmitButton>Se connecter</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-ink underline underline-offset-2">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
