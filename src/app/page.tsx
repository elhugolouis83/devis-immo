import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { DevisMockup } from "@/components/landing/DevisMockup";

const BENEFICES = [
  {
    numero: "01",
    titre: "Conforme, point.",
    texte:
      "TVA réduite immo (5,5 % / 10 % / 20 %) calculée ligne par ligne, CGV légales incluses automatiquement sur chaque devis.",
  },
  {
    numero: "02",
    titre: "3 minutes montre en main",
    texte:
      "Client, prestations, totaux HT/TTC : le devis est prêt, en PDF, avant que le café refroidisse.",
  },
  {
    numero: "03",
    titre: "Rien ne se perd",
    texte:
      "Historique par client, PDF archivés, envoi direct par email. Fini les devis égarés entre les emails et les clés USB.",
  },
];

export default function HomePage() {
  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
        <span className="font-display text-lg font-semibold text-ink">
          DevisImmo
        </span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/connexion" className="text-ink-soft hover:text-ink">
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="press-hard border-2 border-ink bg-brick px-4 py-2 font-medium text-paper shadow-hard-sm"
          >
            Essai gratuit
          </Link>
        </nav>
      </header>

      <main className="flex-1 overflow-x-clip">
        <section className="bg-dot-grid border-b-2 border-ink px-6 py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brick">
                Pour bailleurs, syndics &amp; artisans
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                Le devis travaux qui{" "}
                <span className="italic">respecte la loi</span> à votre
                place.
              </h1>
              <p className="mt-6 max-w-lg text-base text-ink-soft">
                Un devis fait à la main prend 30 à 45 minutes et laisse
                passer des oublis : TVA mal calculée, CGV manquantes,
                facture introuvable six mois plus tard. DevisImmo calcule,
                structure et archive tout, automatiquement.
              </p>
              <div className="mt-8 flex flex-col items-start gap-2">
                <Link
                  href="/inscription"
                  className="press-hard border-2 border-ink bg-brick px-6 py-3 text-base font-medium text-paper shadow-hard"
                >
                  Essai gratuit — sans carte bancaire
                </Link>
                <span className="text-xs text-ink-soft">
                  25 €/mois ensuite, sans engagement.
                </span>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <DevisMockup />
            </Reveal>
          </div>
        </section>

        <section className="border-b-2 border-ink bg-white px-6 py-16">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3">
            {BENEFICES.map((b, i) => (
              <Reveal key={b.numero} delay={i * 100}>
                <div className="relative h-full border-2 border-ink p-5 shadow-hard-sm transition-transform duration-200 hover:-translate-y-1">
                  <span className="font-display text-3xl font-semibold text-brick/25">
                    {b.numero}
                  </span>
                  <h2 className="mt-1 font-display text-lg font-semibold text-ink">
                    {b.titre}
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">{b.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <Reveal className="mx-auto max-w-2xl">
            <div className="relative border-2 border-dashed border-line bg-white p-8 text-center">
              <p className="text-sm text-ink-soft">
                Les premiers retours clients arriveront ici.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="border-y-2 border-ink bg-ink px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-paper">
              Ton premier devis conforme,{" "}
              <span className="italic text-brick">en 3 minutes.</span>
            </h2>
            <Link
              href="/inscription"
              className="mt-8 inline-block border-2 border-paper bg-brick px-6 py-3 text-base font-medium text-paper shadow-[6px_6px_0_0_var(--color-paper)] transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Essai gratuit — sans carte bancaire
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-ink-soft">
        DevisImmo — {new Date().getFullYear()}
      </footer>
    </>
  );
}
