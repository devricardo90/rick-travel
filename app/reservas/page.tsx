
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MyBookings } from "@/components/my-bookings";

export default async function ReservasPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="mb-8 text-3xl font-bold">Minhas reservas</h1>
      <MyBookings />
    </main>
  );
}

