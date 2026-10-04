import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/app" className="font-display text-lg font-semibold text-ink">
            DevisImmo
          </Link>
          <nav className="flex items-center gap-5 text-sm text-ink-soft">
            <Link href="/app/devis" className="hover:text-ink">
              Devis
            </Link>
            <Link href="/app/clients" className="hover:text-ink">
              Clients
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-ink-soft">
          <Link href="/app/reglages" className="hover:text-ink">
            Réglages
          </Link>
          <span>{user.email}</span>
          <form action={logout}>
            <button type="submit" className="underline underline-offset-2 hover:text-ink">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 bg-paper-dim">{children}</main>
    </div>
  );
}
