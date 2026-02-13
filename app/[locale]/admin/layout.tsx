
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 🔐 Proteção REAL de admin
  if (!session || session.user.role !== "ADMIN") {
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
            <AdminLogoutButton />
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
