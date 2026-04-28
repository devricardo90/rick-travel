import { getContactsAction } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkAsReadButton } from "./mark-as-read-button";

/**
 * RT-013D: Admin Contacts Read-Only
 * Página para listagem de todas as mensagens de contato recebidas pelo sistema.
 */
export default async function AdminContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let contacts = [];

  try {
    contacts = await getContactsAction();
  } catch {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar contatos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nao foi possivel carregar a lista de contatos. Verifique suas permissoes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens de Contato</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-semibold">Data</th>
                    <th className="py-3 px-4 font-semibold">Nome</th>
                    <th className="py-3 px-4 font-semibold">E-mail / Telefone</th>
                    <th className="py-3 px-4 font-semibold">Mensagem</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-xs whitespace-nowrap text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString(locale, {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm">{contact.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-[10px] text-muted-foreground">{contact.phone}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs max-w-md line-clamp-2" title={contact.message}>
                          {contact.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                          contact.status === 'READ' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          contact.status === 'REPLIED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {contact.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {contact.status !== 'READ' && contact.status !== 'REPLIED' && (
                          <MarkAsReadButton id={contact.id} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
