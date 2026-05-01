import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays, MessageSquare, ArrowRight } from "lucide-react";

/**
 * RT-013F: Dashboard Minimal Polish
 * Página inicial do admin com links rápidos para as principais seções.
 */
export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const quickLinks = [
    {
      href: `/${locale}/admin/bookings`,
      title: "Reservas",
      description: "Visualize e gerencie as reservas de viagens dos clientes.",
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      href: `/${locale}/admin/contacts`,
      title: "Contatos",
      description: "Acesse as mensagens enviadas através do formulário de contato.",
      icon: MessageSquare,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao centro de operações do Rick Travel. Selecione uma área abaixo para gerenciar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card className="h-full transition-all hover:shadow-md hover:border-foreground/20">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`p-2 rounded-lg ${link.bg} ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {link.title}
                  </CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {link.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Informações do MVP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              O painel admin está operando em modo <strong>MVP (Minimum Viable Product)</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Funcionalidades de leitura (Read-Only) para Bookings e Contacts: Ativas</li>
              <li>Ação de marcar contato como lido: Ativa</li>
              <li>Proteção de rotas via Better Auth + RBAC: Ativa</li>
              <li>Ações de Reservas: confirmar pendentes e cancelar pendentes/confirmadas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
