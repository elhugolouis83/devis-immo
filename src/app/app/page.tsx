import { getCurrentUser } from "@/lib/auth";

export default async function AppHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Bienvenue{user?.companyName ? `, ${user.companyName}` : ""}.
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Ton compte est créé et ta session fonctionne. Le générateur de devis
        arrive à la prochaine étape.
      </p>
    </div>
  );
}
