

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Painel Admin</h1>
      <p className="mt-4">Bem-vindo ao painel administrativo.</p>
    </main>
  );
}
