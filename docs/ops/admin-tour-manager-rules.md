# Regras e Escopo — Admin Tour Manager MVP

Este documento define as diretrizes para a implementação do gerenciamento de tours no painel administrativo do Rick Travel (Fase 3).

## 1. Diretrizes Técnicas

- **Sem Hard Delete**: O modelo `Trip` não deve ser excluído fisicamente para preservar a integridade referencial de `Booking` e `AnalyticsEvent`. O controle será feito via `isPublished`.
- **Imagens**: O campo `imageUrl` será tratado estritamente como `string` (caminho local ou URL externa).
    - **Proibido**: Upload binário, integração com storage providers (S3/Cloudinary) ou tratamento de arquivos multipart no servidor nesta fase.
- **Preços**:
    - `Trip.priceCents`: Atua como preço base de exibição no catálogo. Alterar este valor **não** altera o total de reservas já existentes.
    - `TripSchedule.pricePerPersonCents`: É o valor efetivo utilizado no momento da reserva.
- **i18n (Json)**: Os campos `title`, `description` e `highlights` são do tipo `Json`. O formulário deve garantir a estrutura `{ pt: string, en: string, ... }`. O idioma `pt` é obrigatório.

## 2. Fatiamento de Implementação (Roadmap)

Para garantir segurança e revisões granulares, o épico será dividido nas seguintes tarefas:

- **RT-017B — Admin Tour List**: Página de listagem somente leitura de todos os tours cadastrados.
- **RT-017C — Admin Tour Create**: Formulário e Server Action para criação de novos tours (status inicial `isPublished: false`).
- **RT-017D — Admin Tour Edit & Visibility**: Formulário de edição e controle de publicação/despublicação.
- **RT-017E — Admin Tour Basic Schedule Management**: Visualização e controle de status (`OPEN`/`CLOSED`) de agendas vinculadas ao tour.

## 3. Integridade de Dados

- **Edição de Tours com Reservas**: Permitida com cautela, pois o Booking persiste o `totalPriceCents` no momento da reserva. A edição de dados públicos do tour não deve alterar valores históricos de reservas já criadas.
- **Exclusão de Tours**: Substituída por `isPublished: false`.
- **Validação de Schema**: Seguir rigorosamente o `prisma/schema.prisma` atual (ex: `city` é string obrigatória, `title` é Json obrigatório).

## 4. Segurança

- Todas as rotas e Server Actions devem ser protegidas por `requireAdminSession()`.
- Logs de auditoria via `AnalyticsEvent` são desejáveis, mas ficam fora do escopo inicial de RT-017B, RT-017C, RT-017D e RT-017E, salvo nova decisão explícita do Trigger.
