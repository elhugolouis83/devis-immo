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
        <span className="font-display text-lg font-semibold text-ink">
          DevisImmo
        </span>
        <div className="flex items-center gap-4 text-sm text-ink-soft">
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
