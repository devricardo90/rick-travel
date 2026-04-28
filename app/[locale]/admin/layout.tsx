import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/authz";
import { redirect } from "next/navigation";
import { isDomainError } from "@/lib/errors/domain-error";

export default async function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    await requireAdminSession();
  } catch (error: unknown) {
    if (isDomainError(error) && error.code === "UNAUTHENTICATED") {
      redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
    }
    // Se for FORBIDDEN, deixa o Next.js lidar com o erro ou mostra algo simples
    throw error;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Rick Travel Admin MVP</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground italic">
              Escopo Protegido (RT-013B)
            </span>
          </div>
        </div>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
