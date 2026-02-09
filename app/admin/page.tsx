
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats() {
  const res = await fetch("http://localhost:3000/api/admin/stats", {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AdminPage() {
  const session = await auth.api.getSession();

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const stats = await getStats();

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">Usuários</p>
          <p className="text-2xl font-bold">{stats?.users ?? "-"}</p>
        </div>

        <div className="rounded-xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">Passeios</p>
          <p className="text-2xl font-bold">{stats?.trips ?? "-"}</p>
        </div>

        <div className="rounded-xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">Reservas</p>
          <p className="text-2xl font-bold">{stats?.bookings ?? "-"}</p>
        </div>
      </div>
    </>
  );
}

