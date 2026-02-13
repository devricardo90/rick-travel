
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const [usersCount, tripsCount, bookingsCount] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin</h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Usuários</p>
          <p className="text-2xl font-bold text-slate-900">{usersCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Passeios</p>
          <p className="text-2xl font-bold text-slate-900">{tripsCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Reservas</p>
          <p className="text-2xl font-bold text-slate-900">{bookingsCount}</p>
        </div>
      </div>
    </div>
  );
}

