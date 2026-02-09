
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold">RickTravel Admin</h2>

          <nav className="flex gap-4 text-sm items-center">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/trips">Trips</Link>
            <Link href="/admin/bookings">Reservas</Link>

            {/* Logout */}
            <form action="/api/auth/sign-out" method="POST">
              <button className="text-red-500 hover:underline">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
