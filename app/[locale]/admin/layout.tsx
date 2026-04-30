import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/authz";
import { redirect } from "next/navigation";
import { isDomainError } from "@/lib/errors/domain-error";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, MessageSquare, Map, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    if (isDomainError(error)) {
      if (error.code === "UNAUTHENTICATED") {
        redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
      }

      if (error.code === "FORBIDDEN") {
        return (
          <main className="min-h-screen bg-muted/30 px-6 py-16">
            <Card className="mx-auto max-w-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <CardTitle>Acesso negado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  Sua conta nao tem permissao para acessar o painel administrativo.
                </p>
                <Button asChild variant="outline">
                  <Link href={`/${locale}`}>Voltar para o site</Link>
                </Button>
              </CardContent>
            </Card>
          </main>
        );
      }
    }

    throw error;
  }

  const navItems = [
    { href: `/${locale}/admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${locale}/admin/tours`, label: "Tours", icon: Map },
    { href: `/${locale}/admin/bookings`, label: "Reservas", icon: CalendarDays },
    { href: `/${locale}/admin/contacts`, label: "Contatos", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tight">Rick Travel Admin</h1>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 border border-muted-foreground/20 px-2 py-0.5 rounded">
              MVP Protected
            </span>
          </div>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
