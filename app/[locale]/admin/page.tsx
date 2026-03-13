
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect(`/${locale}/login`);
  if (session.user.role !== "ADMIN") redirect(`/${locale}`);


  const [usersCount, tripsCount, bookingsCount] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Usuários</p>
          <p className="text-2xl font-bold text-foreground">{usersCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Passeios</p>
          <p className="text-2xl font-bold text-foreground">{tripsCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Reservas</p>
          <p className="text-2xl font-bold text-foreground">{bookingsCount}</p>
        </div>
      </div>
    </div>
  );
}
