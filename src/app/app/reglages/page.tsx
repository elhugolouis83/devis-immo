import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAccesStatus, DEVIS_GRATUITS } from "@/lib/subscription";
import { creerSessionCheckout, creerSessionPortail } from "@/actions/subscription";
import { ProfilForm } from "@/components/reglages/ProfilForm";
import { SupprimerCompteForm } from "@/components/reglages/SupprimerCompteForm";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function ReglagesPage({
  searchParams,
}: {
  searchParams: Promise<{ abonnement?: string; erreur?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { abonnement, erreur } = await searchParams;
  const { estAbonne, restants, subscription } = await getAccesStatus(user.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Réglages
      </h1>

      {abonnement === "actif" && (
        <p className="mt-4 border-2 border-ok bg-ok/5 px-4 py-3 text-sm text-ok">
          Abonnement activé. Merci !
        </p>
      )}
      {abonnement === "annule" && (
        <p className="mt-4 border border-line bg-white px-4 py-3 text-sm text-ink-soft">
          Paiement annulé — rien n&apos;a été débité.
        </p>
      )}
      {erreur === "confirmation" && (
        <p className="mt-4 border-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          L&apos;email ne correspond pas. Compte non supprimé.
        </p>
      )}

      <section className="mt-8 border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Compte
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
        <ProfilForm companyName={user.companyName} />
      </section>

      <section className="mt-6 border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Abonnement
        </h2>

        {estAbonne ? (
          <>
            <p className="mt-2 text-sm text-ink">
              Statut :{" "}
              <span className="font-medium text-ok">Actif</span>
              {subscription?.currentPeriodEnd && (
                <>
                  {" "}
                  — prochain renouvellement le{" "}
                  {new Intl.DateTimeFormat("fr-FR").format(
                    subscription.currentPeriodEnd,
                  )}
                </>
              )}
            </p>
            <form action={creerSessionPortail} className="mt-4 w-56">
              <SubmitButton>Gérer mon abonnement</SubmitButton>
            </form>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              {restants > 0
                ? `Essai gratuit : ${restants} devis restant${restants > 1 ? "s" : ""} sur ${DEVIS_GRATUITS}.`
                : "Ton essai gratuit est terminé."}
            </p>
            <form action={creerSessionCheckout} className="mt-4 w-56">
              <SubmitButton>S&apos;abonner — 25 €/mois</SubmitButton>
            </form>
          </>
        )}
      </section>

      <section className="mt-6 border-2 border-dashed border-error/40 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Zone de danger
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Supprime définitivement ton compte et toutes tes données.
        </p>
        <div className="mt-4">
          <SupprimerCompteForm email={user.email} />
        </div>
      </section>
    </div>
  );
}
