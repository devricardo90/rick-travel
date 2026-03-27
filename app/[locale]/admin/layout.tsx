import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.08), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.05) 0%, transparent 18%)",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071826]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8c18f]">
              Rick Travel
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">
              Painel administrativo
            </h2>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href={`/${locale}/admin`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href={`/${locale}/admin/trips`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Trips
            </Link>
            <Link
              href={`/${locale}/admin/bookings`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Reservas
            </Link>
            <Link
              href={`/${locale}/admin/contacts`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Contatos
            </Link>
            <AdminLogoutButton />
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
