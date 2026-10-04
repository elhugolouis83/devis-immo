import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">
        DevisImmo
      </h1>
      <p className="max-w-md text-sm text-ink-soft">
        La landing page arrive à l&apos;étape 6. Pour l&apos;instant, teste
        l&apos;inscription et la connexion.
      </p>
      <div className="flex gap-3">
        <Link
          href="/inscription"
          className="rounded-md bg-brick px-4 py-2.5 text-sm font-medium text-paper hover:bg-brick-dark"
        >
          Créer un compte
        </Link>
        <Link
          href="/connexion"
          className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
