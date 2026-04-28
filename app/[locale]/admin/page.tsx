import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Painel Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este é o esqueleto inicial do Admin MVP. O acesso está protegido e validado para usuários com a role <strong>ADMIN</strong>.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 bg-background">
              <h3 className="font-semibold mb-2">Estado Atual</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Rota protegida: OK</li>
                <li>Better Auth integration: OK</li>
                <li>RBAC (Role-Based Access Control): OK</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4 bg-background">
              <h3 className="font-semibold mb-2">Próximos Passos (Backlog)</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Listagem de Reservas (Bookings)</li>
                <li>Visualização de Contatos</li>
                <li>Ações rápidas de confirmação</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
