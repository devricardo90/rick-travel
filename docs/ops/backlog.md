# Backlog Canonico - Protocolo Rick

Estados permitidos: READY, IN_PROGRESS, REVIEW, DONE, BLOCKED.

## RT-001 Descoberta e contexto do produto

Estado: DONE

Objetivo: consolidar visao de produto, contexto tecnico e operacao real.

Tarefas:

- RT-001.1 Inventariar docs, configs, rotas, modelos e scripts. Estado: DONE.
- RT-001.2 Separar evidencias reais de assumptions/unknowns. Estado: DONE.
- RT-001.3 Validar decisoes de negocio com owner. Estado: PLANNED.

Criterios de aceite: status, backlog, handoff, resume pack e matriz de versoes existem e refletem o repositorio.
Dependencias: nenhuma.
Risco: medio.
Evidencia esperada: `docs/ops/status.md`, `docs/ops/resume-pack.md`.

## RT-002 Arquitetura base

Estado: REVIEW

Objetivo: manter arquitetura Next + services + Prisma consistente.

Tarefas:

- RT-002.1 Confirmar qual `package.json` e fonte de verdade. Estado: DONE.
- RT-002.2 Resolver duplicatas `(2)` sem apagar contexto valido. Estado: DONE.
- RT-002.3 Corrigir typecheck global. Estado: DONE.
- RT-002.4 Manter build sem dependencia de fonte remota. Estado: DONE.
- RT-002.5 Revisar E2E autenticado remanescente. Estado: PLANNED.

Criterios de aceite: lint, typecheck, build e unit tests verdes.
Dependencias: RT-001.
Risco: medio.
Evidencia esperada: comandos verdes e package canonico.

## RT-003 Ambiente local

Estado: REVIEW

Objetivo: garantir setup local reproduzivel.

Tarefas:

- RT-003.1 Criar/atualizar `.env.example` sem segredos. Estado: DONE.
- RT-003.2 Documentar uso de `npm.cmd`/`npx.cmd` no Windows. Estado: DONE.
- RT-003.3 Confirmar fluxo Docker PostgreSQL em `localhost:5433`. Estado: PLANNED.
- RT-003.4 Congelar Node em `.nvmrc`. Estado: DONE.

Criterios de aceite: novo dev consegue subir app com Postgres local e Prisma.
Dependencias: RT-002.
Risco: medio.
Evidencia esperada: healthcheck e dev server ok.

## RT-004 Autenticacao

Estado: PLANNED

Objetivo: validar auth usuario/admin.

Tarefas:

- RT-004.1 Validar login/registro com Better Auth. Estado: PLANNED.
- RT-004.2 Validar protecao de `/reservas` e `/admin`. Estado: PLANNED.
- RT-004.3 Revisar rotas debug para ambiente nao desenvolvimento. Estado: PLANNED.

Criterios de aceite: usuarios anonimos nao acessam areas privadas; admin comum nao executa actions restritas.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: E2E auth verde.

## RT-005 Base de dados

Estado: PLANNED

Objetivo: estabilizar Prisma/PostgreSQL.

Tarefas:

- RT-005.1 Validar migrations em banco limpo. Estado: PLANNED.
- RT-005.2 Criar seed controlado para dev/E2E. Estado: PLANNED.
- RT-005.3 Validar indices e integridade para booking/schedule/payment. Estado: PLANNED.

Criterios de aceite: `prisma migrate deploy` e seed rodam em ambiente limpo.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: banco local recriado e healthcheck ok.

## RT-006 Fluxos principais do app

Estado: IN_PROGRESS

Objetivo: estabilizar o fluxo publico ja deployado.

Tarefas:

- RT-006.1 Home/listagem/detalhe de tour em runtime publicado. Estado: PLANNED.
- RT-006.2 Reserva autenticada com agenda/capacidade em runtime publicado. Estado: PLANNED.
- RT-006.3 Minhas reservas com status e polling em runtime publicado. Estado: PLANNED.
- RT-006.4 Rodar smoke pos-deploy nos fluxos publicos prioritarios. Estado: PLANNED.
- RT-006.5 Registrar gaps reais encontrados no runtime publicado. Estado: PLANNED.

Criterios de aceite: MVP publico permanece acessivel e sem regressao critica nos fluxos publicos.
Dependencias: RT-004, RT-005.
Risco: alto.
Evidencia esperada: smoke pos-deploy e registro objetivo de ocorrencias.

## RT-007 Painel/admin

Estado: PLANNED

Objetivo: reconstruir o Admin MVP de forma controlada e segura.

Tarefas:

- RT-007.1 Reativar protecao de rotas e auth skeleton. Estado: PLANNED.
- RT-007.2 Dashboard simples com stats basicos. Estado: PLANNED.
- RT-007.3 Listagem e visualizacao de bookings. Estado: PLANNED.
- RT-007.4 Listagem e triagem de contatos. Estado: PLANNED.

Criterios de aceite: acesso restrito a role ADMIN; codigo reconstruido com auditoria; sem regressao de seguranca.
Dependencias: RT-013A.
Risco: alto.
Evidencia esperada: painel admin funcional e seguro.

## RT-008 Integracoes

Estado: BLOCKED

Objetivo: manter integracoes externas congeladas fora do escopo atual.

Tarefas:

- RT-008.1 Mercado Pago sandbox/producao: token, Pix e webhook publico. Estado: BLOCKED.
- RT-008.2 Resend: dominio/remetente e email de confirmacao. Estado: PLANNED.
- RT-008.3 MyMemory/traducao: validar limite/fallback. Estado: PLANNED.
- RT-008.4 WhatsApp: confirmar numero e mensagem comercial. Estado: PLANNED.

Criterios de aceite: nenhuma retomada de Mercado Pago sem justificativa operacional especifica.
Dependencias: decisao de escopo e credenciais externas.
Risco: alto.
Evidencia esperada: nao aplicavel nesta fase para Mercado Pago.

## RT-009 Testes

Estado: DONE

Objetivo: recuperar suite automatizada.

Tarefas:

- RT-009.1 Restaurar `vitest` e `@playwright/test` no package ativo. Estado: DONE.
- RT-009.2 Rodar unit tests. Estado: DONE.
- RT-009.3 Rodar E2E publico. Estado: DONE.
- RT-009.4 Rodar E2E autenticado. Estado: DONE.
- RT-009.5 Adicionar scripts `test` e `test:e2e`. Estado: DONE.

Criterios de aceite: lint, typecheck, build, unit e E2E verdes.
Dependencias: RT-002.
Risco: medio.
Evidencia esperada: `npm.cmd run test:e2e` 5/5 verde.

## RT-010 Deploy/staging

Estado: DONE

Objetivo: concluir deploy tecnico e publicacao inicial.

Tarefas:

- RT-010.1 Definir provider de deploy. Estado: DONE.
- RT-010.2 Definir banco staging. Estado: DONE.
- RT-010.3 Configurar env vars staging/deploy inicial. Estado: DONE.
- RT-010.4 Resolver build offline/fonts. Estado: DONE.
- RT-010.5 Criar checklist operacional de staging. Estado: DONE.
- RT-010.6 Criar preflight de staging. Estado: DONE.
- RT-010.7 Criar healthcheck profundo com DB. Estado: DONE.
- RT-010.8 Criar/importar projeto Rick Travel na Vercel. Estado: DONE.
- RT-010.9 Publicar projeto na Vercel. Estado: DONE.
- RT-010.10 Validar runtime inicial ate o ponto atual. Estado: DONE.
- RT-010.11 Permitir `BETTER_AUTH_URL` em `trustedOrigins` para ambiente publicado. Estado: DONE.

Criterios de aceite: deploy tecnico concluido, app publicada e runtime inicial validado ate o ponto atual.
Dependencias: RT-002, RT-003.
Risco: medio.
Evidencia esperada: `vercel inspect` do alias publico, healthchecks `200` e validacao objetiva da URL publicada.

## RT-011 Pos-deploy/estabilizacao

Estado: IN_PROGRESS

Objetivo: estabilizar o MVP publico apos a publicacao.

Tarefas:

- RT-011.1 Executar smoke pos-deploy focado no fluxo publico. Estado: DONE.
- RT-011.2 Revisar logs, healthchecks e erros do ambiente publicado. Estado: DONE.
- RT-011.3 Registrar incidentes e regressões reais observadas apos deploy. Estado: DONE.
- RT-011.4 Alinhar dominio canonico publico com a URL operacional real. Estado: DONE.
- RT-011.5 Diagnosticar catalogo publico vazio. Estado: DONE.
- RT-011.6 Corrigir exposicao publica do catalogo se houver incidente funcional. Estado: BLOCKED.
- RT-011.7 Registrar vazio operacional como estado esperado. Estado: DONE.
- RT-011.8 Formalizar checklist minima de validacao pos-publicacao e rollback. Estado: DONE.

Criterios de aceite: fase atual com leitura objetiva do runtime publicado e sem reabertura indevida de escopo congelado.
Dependencias: RT-010.
Risco: alto.
Evidencia esperada: smoke em `rick-travel.vercel.app`, healthchecks `200`, amostra de logs Vercel e ocorrencias reais documentadas.

Notas operacionais:

- RT-011.4 validado em producao com `GET /robots.txt = 200`, `GET /sitemap.xml = 200` e artefatos publicos apontando para `https://rick-travel.vercel.app`.
- RT-011.5 concluiu `EXPECTED_EMPTY_STATE`.
- RT-011.6 permanece bloqueado porque a dependencia `FUNCTIONAL_INCIDENT` nao ocorreu.
- RT-011.7 documenta que o vazio atual decorre de ausencia de conteudo publicavel: banco validado com `0` trips e `0` trips publicadas.
- RT-011.8 formalizou o runbook minimo em `docs/ops/release-rollback-runbook.md`, com validacao local, smoke pos-deploy, rollback e regra de `EXPECTED_EMPTY_STATE`.
- Slice atual ja foi publicado em `main`.
- Sincronizacao Git concluida com `git pull --rebase origin main` sem conflito e `git push origin main` com sucesso.

## RT-012 Observabilidade

Estado: PLANNED

Objetivo: ter visibilidade minima.

Tarefas:

- RT-012.1 Healthcheck com banco. Estado: PLANNED.
- RT-012.2 Logs estruturados para webhook/pagamento. Estado: PLANNED.
- RT-012.3 Monitoramento de erro. Estado: BLOCKED.

Criterios de aceite: falhas criticas aparecem em logs/alertas.
Dependencias: ambiente publicado.
Risco: medio.
Evidencia esperada: painel/logs acessiveis.

## RT-012A Remove unsafe hardcoded admin bootstrap

Estado: DONE

Objetivo: remover ou neutralizar risco de credencial hardcoded em bootstrap de ADMIN.

Tarefas:

- RT-012A.1 Inspecionar `scripts/create-admin.ts`. Estado: DONE.
- RT-012A.2 Procurar credenciais hardcoded relacionadas a admin/setup. Estado: DONE.
- RT-012A.3 Remover script inseguro nao referenciado pelo `package.json`. Estado: DONE.
- RT-012A.4 Remover fallback hardcoded de credenciais ADMIN E2E. Estado: DONE.
- RT-012A.5 Registrar regra operacional para bootstrap futuro de ADMIN. Estado: DONE.
- RT-012A.6 Publicar commit de contencao no remoto. Estado: DONE.

Criterios de aceite: nenhuma credencial real de bootstrap admin versionada; admin continua congelado; checks seguros passam.
Dependencias: auditoria tecnica do admin.
Risco: alto.
Evidencia esperada: commit `128e095 security: remove hardcoded admin bootstrap credentials` publicado em `origin/main`; `lint` PASS com warnings existentes; `typecheck` PASS; `test` PASS; `build` PASS; `git diff --check` PASS com warnings LF/CRLF.

Notas operacionais:

- A credencial removida deve ser considerada potencialmente exposta.
- Recomenda-se rotacao manual da senha em qualquer ambiente onde ela tenha sido usada.
- A senha removida nao deve ser repetida em documentacao.

## RT-012B Align admin E2E with frozen admin scope

Estado: DONE

Objetivo: resolver o desalinhamento entre o escopo atual do MVP e `e2e/admin.spec.ts`, que espera `/pt/admin` com dashboard ativo.

Tarefas:

- RT-012B.1 Auditar `e2e/admin.spec.ts`. Estado: DONE.
- RT-012B.2 Confirmar admin fora de escopo/congelado no MVP. Estado: DONE.
- RT-012B.3 Neutralizar, remover ou marcar como skipped o teste admin de forma explicita e documentada. Estado: DONE.
- RT-012B.4 Atualizar backlog, status e handoff com a decisao. Estado: DONE.

Criterios de aceite: teste admin nao falha por esperar funcionalidade fora do escopo; documentacao explica que admin esta congelado no MVP; lint, typecheck, test e build passam; git status final limpo; commit separado.
Dependencias: RT-012A.
Risco: medio.
Evidencia esperada: `e2e/admin.spec.ts` marcado como skipped explicitamente porque admin esta congelado fora do MVP publico; `npx.cmd playwright test e2e/admin.spec.ts --list` lista 1 teste coletavel; `npm.cmd run lint` PASS com warnings existentes; `npm.cmd run typecheck` PASS; `npm.cmd run test` PASS fora do sandbox; `npm.cmd run build` PASS fora do sandbox; commit separado da RT-012B.

## RT-013 Seguranca

Estado: REVIEW

Objetivo: reduzir risco pos-publicacao.

Tarefas:

- RT-013.1 Rotacionar segredos locais se necessario. Estado: PLANNED.
- RT-013.2 Criar `.env.example`. Estado: DONE.
- RT-013.3 Revisar webhook secret Mercado Pago. Estado: BLOCKED.
- RT-013.4 Revisar dados sensiveis em logs. Estado: PLANNED.
- RT-013.5 Classificar audit moderado remanescente em Prisma dev tooling. Estado: DONE.
- RT-013.6 Resolver audit moderado remanescente em janela controlada. Estado: PLANNED.
- RT-013.7 Documentar contrato de secrets por ambiente. Estado: DONE.

Criterios de aceite: nenhum segredo versionado; logs revisados; escopo congelado preservado.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: checklist seguranca e plano de janela controlada.

## RT-014 UX/UI polish

Estado: PLANNED

Objetivo: melhorar conversao sem mexer no core.

Tarefas:

- RT-014.1 Revisar responsividade dos fluxos publicos. Estado: PLANNED.
- RT-014.2 Revisar acessibilidade basica. Estado: PLANNED.
- RT-014.3 Validar assets reais e performance. Estado: PLANNED.

Criterios de aceite: smoke visual desktop/mobile sem overlap critico.
Dependencias: core estavel.
Risco: medio.
Evidencia esperada: screenshots e checklist UX.

## RT-015 Conteudo/comercial

Estado: PLANNED

Objetivo: consolidar proposta comercial e canais sem ampliar escopo tecnico atual.

Tarefas:

- RT-015.1 Definir persona primaria. Estado: BLOCKED.
- RT-015.2 Definir MVP comercial e metricas. Estado: BLOCKED.
- RT-015.3 Confirmar monetizacao e operacao de suporte. Estado: BLOCKED.

Criterios de aceite: jornada e metricas aprovadas pelo owner.
Dependencias: input de negocio.
Risco: medio.
Evidencia esperada: documento de produto validado.

## RT-013A Admin MVP Scope and Guardrails

Estado: DONE

Objetivo: definir escopo, guardrails e plano tecnico do Admin MVP antes de qualquer implementacao.

Tarefas:

- RT-013A.1 Registrar decisao formal de reconstrucao do Admin MVP. Estado: DONE.
- RT-013A.2 Definir escopo permitido e proibido do Admin MVP. Estado: DONE.
- RT-013A.3 Definir regras de seguranca para auth/RBAC/bootstrap. Estado: DONE.
- RT-013A.4 Atualizar documentacao operacional (backlog, status, handoff). Estado: DONE.

Criterios de aceite: documentacao reflete a decisao; guardrails claros; sem alteracao de codigo de aplicacao.
Dependencias: decisao do owner no Admin Discussion Gate.
Risco: baixo.
Evidencia esperada: `docs/ops/backlog.md`, `docs/ops/status.md` e `docs/ops/session-handoff.md` atualizados.

## RT-013B Admin MVP Route Protection Skeleton

Estado: DONE

Objetivo: implementar o esqueleto de protecao de rotas para o novo Admin MVP.

Tarefas:

- RT-013B.1 Criar esqueleto de rota `/[locale]/admin`. Estado: DONE.
- RT-013B.2 Garantir protecao em layout/page com `requireAdminSession()`. Estado: DONE.
- RT-013B.3 Validar que usuarios sem role ADMIN sao bloqueados. Estado: DONE.

Criterios de aceite: rota `/admin` existe mas e inacessivel para nao-admins; sem dashboard ou logica complexa ainda.
Dependencias: RT-013A.
Risco: medio.
Evidencia esperada: smoke test de acesso negado para usuario comum.

## RT-013C Admin Bookings Read-Only

Estado: DONE

Objetivo: implementar listagem e visualizacao somente leitura de reservas no Admin MVP.

Tarefas:

- RT-013C.1 Criar service `listAllBookings` em `booking.service.ts`. Estado: DONE.
- RT-013C.2 Criar server action `getBookingsAction` em `app/actions/admin.ts` protegida. Estado: DONE.
- RT-013C.3 Criar pagina `/[locale]/admin/bookings` com listagem em tabela. Estado: DONE.
- RT-013C.4 Tratar empty state e erros basicos. Estado: DONE.

Criterios de aceite: admins conseguem listar todas as reservas; dados do cliente e viagem visiveis; sem mutacao permitida.
Dependencias: RT-013B.
Risco: baixo.
Evidencia esperada: pagina `/admin/bookings` funcional para admins.

## RT-013D Admin Contacts Read-Only

Estado: DONE

Objetivo: implementar listagem e visualizacao somente leitura de contatos/mensagens no Admin MVP.

Tarefas:

- RT-013D.1 Criar service `listAllContacts` em `contact.service.ts`. Estado: DONE.
- RT-013D.2 Criar server action `getContactsAction` em `app/actions/admin.ts` protegida. Estado: DONE.
- RT-013D.3 Criar pagina `/[locale]/admin/contacts` com listagem em tabela. Estado: DONE.
- RT-013D.4 Tratar empty state e erros basicos. Estado: DONE.

Criterios de aceite: admins conseguem listar todas as mensagens de contato; dados do remetente e mensagem visiveis; sem mutacao permitida.
Dependencias: RT-013B.
Risco: baixo.
Evidencia esperada: pagina `/admin/contacts` funcional para admins.

## RT-013E Admin Contact Mark as Read

Estado: DONE

Objetivo: adicionar acao para marcar mensagem de contato como lida no Admin MVP.

Tarefas:

- RT-013E.1 Adicionar `markContactAsRead` em `contact.service.ts`. Estado: DONE.
- RT-013E.2 Adicionar `markContactAsReadAction` em `app/actions/admin.ts`. Estado: DONE.
- RT-013E.3 Adicionar botao de acao na pagina de contatos. Estado: DONE.

Criterios de aceite: admins podem marcar mensagens como lidas; status visual atualiza; protecao de rota mantida.
Dependencias: RT-013D.
Risco: baixo.
Evidencia esperada: botao funcional na listagem de contatos.

## RT-013F Admin Navigation and Dashboard Minimal Polish

Estado: DONE

Objetivo: melhorar a navegacao e a pagina inicial do Admin MVP.

Tarefas:

- RT-013F.1 Adicionar menu de navegacao no `AdminLayout`. Estado: DONE.
- RT-013F.2 Implementar hub de links rapidos na `AdminPage`. Estado: DONE.
- RT-013F.3 Atualizar copy de status do MVP. Estado: DONE.

Criterios de aceite: navegacao clara entre Dashboard, Reservas e Contatos; dashboard util com cards clicaveis.
Dependencias: RT-013E.
Risco: baixo.
Evidencia esperada: menu funcional e dashboard populado.

## RT-013G Admin Booking Detail Read-Only

Estado: DONE

Objetivo: criar pagina protegida de detalhe de reserva no admin, somente leitura.

Tarefas:

- RT-013G.1 Adicionar `getBookingById` em `lib/services/booking.service.ts`. Estado: DONE.
- RT-013G.2 Adicionar `getBookingByIdAction` em `app/actions/admin.ts` protegida por `requireAdminSession`. Estado: DONE.
- RT-013G.3 Criar pagina `/[locale]/admin/bookings/[id]` com dados completos da reserva. Estado: DONE.
- RT-013G.4 Adicionar link "Ver detalhes" na listagem de bookings. Estado: DONE.

Criterios de aceite: pagina de detalhe existe; rota protegida por admin; listagem aponta para detalhe; nenhuma mutation criada.
Dependencias: RT-013F.
Risco: baixo.
Evidencia esperada: rota `ƒ /[locale]/admin/bookings/[id]` no build; commit `09ffcb0` em `origin/main`.

## RT-014A Admin Booking Cancellation Rules

Estado: DONE

Objetivo: definir a regra minima de cancelamento de reservas pelo admin antes de implementar qualquer mutation.

Tarefas:

- RT-014A.1 Decidir status cancelaveis pelo admin. Estado: DONE.
- RT-014A.2 Decidir comportamento de `paymentStatus` no cancelamento admin. Estado: DONE.
- RT-014A.3 Decidir sobre envio de e-mail no cancelamento admin. Estado: DONE.
- RT-014A.4 Decidir sobre motivo de cancelamento (`cancelReason`). Estado: DONE.
- RT-014A.5 Decidir sobre analytics/log de cancelamento admin. Estado: DONE.
- RT-014A.6 Registrar autorizacao e separacao tecnica da funcao admin. Estado: DONE.
- RT-014A.7 Atualizar documentacao operacional. Estado: DONE.

Criterios de aceite: todas as dimensoes de regra decididas e registradas; nenhum arquivo de codigo alterado; documento serve de especificacao direta para RT-014B.
Dependencias: RT-013G.
Risco: baixo.
Evidencia esperada: este registro em `docs/ops/backlog.md`; commit documental em `origin/main`.

Notas operacionais — Regras decididas pelo Trigger:

Status cancelaveis pelo admin:
- PENDING: permitido.
- CONFIRMED: permitido.
- CANCELED: tratar como idempotente/no-op (reserva ja cancelada).
- Qualquer outro status (COMPLETED, EXPIRED, REFUNDED ou futuro): bloqueado ate existir regra explicita.

Janela de 24h:
- Admin nao esta sujeito a janela de 24h aplicada ao usuario.
- A funcao `cancelBookingForUser` permanece separada e intacta.
- A futura RT-014B deve criar funcao admin separada (`cancelBookingByAdmin`) sem contaminar a logica do usuario.

paymentStatus:
- A acao admin NAO deve alterar `paymentStatus`.
- Reserva PAID cancelada pelo admin: `booking.status` muda para CANCELED; `paymentStatus` permanece PAID.
- Reembolso nao e automatico.
- Reembolso via Mercado Pago fica fora do MVP e deve virar task futura especifica.

Motivo de cancelamento:
- Nao adicionar `cancelReason` agora.
- Schema Prisma nao deve ser alterado nesta serie de tasks.
- Motivo persistido pode ser avaliado em task futura com migration propria.

E-mail:
- Nao enviar e-mail automatico no MVP.
- Nao criar template BOOKING_CANCELED agora.
- Comunicacao ao cliente fica manual por enquanto.

Analytics/log:
- Nao adicionar `AnalyticsEvent` de cancelamento admin nesta task.
- Nao existe tipo `BOOKING_CANCELED` no schema atual; nao criar agora.

Autorizacao:
- Somente ADMIN pode cancelar via `requireAdminSession` (padrao ja existente).

Separacao tecnica para RT-014B:
- Criar funcao `cancelBookingByAdmin(bookingId)` em `booking.service.ts`.
- Criar server action `cancelBookingByAdminAction(id)` em `app/actions/admin.ts`.
- Adicionar botao de cancelar na pagina de detalhe `/admin/bookings/[id]` com confirmacao simples.
- Nao alterar `cancelBookingForUser`.
- Nao alterar schema Prisma.
- Nao criar migration.

## RT-014B Admin Booking Cancellation Action

Estado: DONE

Objetivo: implementar acao de cancelamento de reserva pelo admin usando as regras documentadas em RT-014A.

Tarefas:

- RT-014B.1 Criar `cancelBookingByAdmin` em `lib/services/booking.service.ts`. Estado: DONE.
- RT-014B.2 Criar `cancelBookingByAdminAction` em `app/actions/admin.ts` protegida por `requireAdminSession`. Estado: DONE.
- RT-014B.3 Criar `CancelBookingButton` client component em `app/[locale]/admin/bookings/[id]/cancel-booking-button.tsx`. Estado: DONE.
- RT-014B.4 Integrar botao na pagina de detalhe, exibindo somente para PENDING/CONFIRMED. Estado: DONE.

Criterios de aceite: cancelamento altera apenas `booking.status`; `paymentStatus` nao e alterado; `cancelBookingForUser` permanece intacto; botao exibido apenas para status permitidos; schema Prisma nao alterado.
Dependencias: RT-014A.
Risco: baixo.
Evidencia esperada: commit `08a3de2 feat: implement admin booking cancellation action (RT-014B)` em `origin/main`; Vercel Production Deployment `Ready`; admin production validado; bookings admin empty state validado.

Notas operacionais:

- GitHub `main` aponta para `08a3de2`.
- Vercel production esta `Ready` com `08a3de2`.
- Admin acessado com sucesso em `https://rick-travel.vercel.app/pt/admin`.
- Bookings admin carregou `https://rick-travel.vercel.app/pt/admin/bookings` com empty state: nenhuma reserva encontrada.
- Neon production: usuario `ricardo@gmail.com` promovido manualmente para `ADMIN` e `emailVerified = true`; alteracao feita no banco, nao no codigo.
- Proximo passo: criar booking de teste pelo fluxo publico em producao e validar listagem, detalhe e cancelamento admin apenas nessa reserva de teste.

## RT-015A Catalog Model Audit

Estado: DONE

Objetivo: auditar por que `/tours` nao exibe nada em producao, sem alterar codigo ou banco.

Tarefas:

- RT-015A.1 Confirmar filtro `isPublished: true` em `trip-list.tsx`. Estado: DONE.
- RT-015A.2 Confirmar que Neon production tem 0 trips publicadas. Estado: DONE.
- RT-015A.3 Confirmar que schema `Trip` nao tem campo `slug`. Estado: DONE.
- RT-015A.4 Registrar causa raiz do vazio: ausencia de registros, nao bug de codigo. Estado: DONE.

Criterios de aceite: causa do vazio identificada sem mudanca de codigo ou banco.
Dependencias: RT-014B.
Risco: baixo.
Evidencia esperada: registro documental da auditoria.

Notas operacionais:

- Neon production: 0 trips, 0 trips publicadas.
- Filtro `isPublished: true` em `trip-list.tsx` e correto; o problema e ausencia de dados.
- Schema `Trip` nao tem campo `slug`; id e o unico campo unico.

## RT-015B Minimal Production Tour Seed

Estado: DONE

Objetivo: criar seed idempotente para 1 Trip publicada + 1 TripSchedule OPEN em producao.

Tarefas:

- RT-015B.1 Criar `prisma/seed.ts` com Trip e TripSchedule usando IDs deterministicos. Estado: DONE.
- RT-015B.2 Adicionar `prisma.seed` em `package.json`. Estado: DONE.
- RT-015B.3 Commitar e publicar `prisma/seed.ts` em `origin/main`. Estado: DONE.
- RT-015B.4 Executar seed manualmente contra Neon production (pelo Trigger). Estado: DONE.

Criterios de aceite: seed idempotente; sem `deleteMany`; sem migration; sem alteracao de schema; `/tours` exibe 1 tour apos seed.
Dependencias: RT-015A.
Risco: baixo.
Evidencia esperada: commit `cf0f96f` em `origin/main`; seed executado manualmente; tour visivel em `/pt/tours`.

Notas operacionais:

- IDs deterministicos: `seed-001-cristo-dona-marta` (Trip), `seed-001-schedule-001` (TripSchedule).
- Trip: Cristo Redentor + Mirante Dona Marta, R$ 245,00, physicalLevel MODERATE, i18n pt/en/es/sv.
- Schedule: startAt = 90 dias a partir da execucao (dinamico), capacity = 10, status = OPEN.
- Seed executado manualmente pelo Trigger contra Neon production apos push de `cf0f96f`.
- Tour visivel em `/pt/tours` apos seed.

## RT-015C End-to-End Booking and Admin Validation

Estado: DONE

Objetivo: validar o fluxo completo de reserva, visualizacao admin e cancelamento admin em producao com o tour semeado.

Tarefas:

- RT-015C.1 Verificar `/pt/tours` exibe o tour semeado. Estado: DONE.
- RT-015C.2 Diagnosticar e corrigir click interception do mobile-menu (RT-015C-FIX). Estado: DONE.
- RT-015C.3 Verificar tour detail abre corretamente. Estado: DONE.
- RT-015C.4 Verificar schedule selector funcional. Estado: DONE.
- RT-015C.5 Criar reserva de teste pelo fluxo publico autenticado. Estado: DONE.
- RT-015C.6 Verificar reserva aparece em `/pt/admin/bookings`. Estado: DONE.
- RT-015C.7 Verificar detalhe da reserva no admin. Estado: DONE.
- RT-015C.8 Cancelar reserva de teste e confirmar status = CANCELED e ausencia de tentativas de pagamento. Estado: DONE.

Criterios de aceite: fluxo completo publico → admin → cancelamento validado em producao sem regressao.
Dependencias: RT-015B, RT-015C-FIX.
Risco: medio.
Evidencia esperada: reserva de teste com Ricardo / ricardo@gmail.com; R$ 245,00; 1 hospede; data 29/07/2026; status CANCELED apos cancelamento admin; nenhuma tentativa de pagamento registrada.

Notas operacionais:

- Bloqueio inicial: click interception por bottom sheet do mobile-menu invisivel com `opacity: 0` mas sem `pointer-events: none`.
- RT-015C-FIX: commit `fa83e02 fix: prevent invisible mobile menu sheet from intercepting page clicks (RT-015C)` em `origin/main`.
- Fix: (1) `pointer-events-none` no className inicial do sheet; (2) `sheet.style.pointerEvents = "auto"` no branch open; (3) `sheet.style.pointerEvents = "none"` no branch close.
- Smoke final confirmado pelo Trigger em producao:
  - `/pt/tours`: tour Cristo Redentor + Mirante Dona Marta visivel.
  - Tour detail: abre corretamente apos fix.
  - Schedule selector: funcional apos fix.
  - Reserva criada: Ricardo / ricardo@gmail.com, R$ 245,00, 1 hospede, 29/07/2026.
  - `/pt/admin/bookings`: reserva aparece na listagem com status CANCELED apos cancelamento.
  - Detalhe admin apos cancelamento: Hospedes: 1; Total: R$ 245,00; Data: 29/07/2026; "Nenhuma tentativa de pagamento registrada."
  - Payment attempts remained absent; no payment gateway/refund/payment mutation was triggered in the MVP flow.
- Lint, typecheck e build passaram antes do commit da fix.

## RT-016A Booking Confirmation and User Reservation Flow Polish

Estado: DONE

Objetivo: melhorar o fluxo do usuario apos criar uma reserva, deixando explicito que a reserva nasce como pre-reserva pendente com confirmacao manual, sem gateway de pagamento.

Tarefas:

- RT-016A.1 Criar rota `/[locale]/reservas/[bookingId]`. Estado: DONE.
- RT-016A.2 Criar componente de confirmacao de reserva. Estado: DONE.
- RT-016A.3 Adicionar `getBookingForUser(bookingId, userId)` com validacao de ownership. Estado: DONE.
- RT-016A.4 Redirecionar o usuario apos criacao para `/reservas/{bookingId}` somente quando a API retorna `booking.id`. Estado: DONE.
- RT-016A.5 Melhorar `/reservas` com status/pagamento legiveis e link "Ver detalhes". Estado: DONE.
- RT-016A.6 Adicionar traducoes minimas pt/en/es/sv. Estado: DONE.
- RT-016A.7 Atualizar documentacao operacional. Estado: DONE.

Criterios de aceite: user-side de reserva fica compreensivel; usuario so ve a propria reserva; nenhum gateway foi adicionado; schema/migration/env/admin cancellation permanecem intactos.
Dependencias: RT-015C.
Risco: baixo.
Evidencia esperada: `/pt/reservas/[bookingId]` no build; `getBookingForUser` filtra por `id` e `userId`; listagem nao mostra enum cru de pagamento.

Notas operacionais:

- `getBookingForUser` usa `findFirst` com `id` e `userId`; reserva inexistente ou de outro usuario cai em `notFound()` na pagina.
- `components/trips/tour-actions.tsx` preserva o tratamento de erro atual e so redireciona se `data.id` for string nao vazia.
- `components/my-bookings.tsx` removeu CTAs/fluxo visual de checkout e mostra pagamento como etapa manual.
- Nenhuma alteracao feita em `schema.prisma`, migrations, seed, Neon/env/provider/auth ou regras admin.
- Validacoes locais: `npm.cmd run lint` PASS com warning pre-existente em `components/mobile-menu.tsx`; `npm.cmd run typecheck` PASS; `npm.cmd run build` PASS fora do sandbox; `git diff --check` PASS com avisos LF/CRLF.
- Commit publicado: `799698c feat: polish booking confirmation flow`.
- Production smoke validado pelo Trigger:
  - `/pt/tours` abre corretamente;
  - detalhe do tour abre corretamente;
  - criacao de booking funciona;
  - usuario e redirecionado para `/pt/reservas/{bookingId}`;
  - pagina de confirmacao funciona;
  - mensagem de pre-reserva/confirmacao manual esta clara;
  - `/pt/reservas` lista a reserva;
  - "Ver detalhes" abre o detalhe da reserva;
  - payment status nao aparece mais como enum cru `UNPAID`;
  - listagem admin de bookings permanece funcional.

## RT-016B Remove Confusing Package Cards and Promote Real Catalog

Estado: DONE

Objetivo: remover da Home os cards comerciais antigos que pareciam tours reais, mas apontavam para contato, mantendo `Passeios disponiveis` como caminho principal para catalogo real, detalhe e reserva.

Tarefas:

- RT-016B.1 Remover renderizacao da secao legada de package cards na Home e excluir o componente legado nao referenciado. Estado: DONE.
- RT-016B.2 Manter `ReservationsSection` e `Passeios disponiveis` como catalogo real principal. Estado: DONE.
- RT-016B.3 Preparar seed do tour existente para usar imagem real local. Estado: DONE.
- RT-016B.4 Atualizar documentacao operacional. Estado: DONE.

Criterios de aceite: Home nao mostra mais os cards comerciais antigos apontando para contato; `/tours` segue como catalogo oficial; seed fica preparado com imagem real sem execucao; nenhuma mudanca de schema/migration/gateway/admin/auth/env.
Dependencias: RT-016A.
Risco: baixo.
Evidencia esperada: commit `5e120a4`.

## RT-016C Controlled Production Seed for Existing Tour Image

Estado: DONE

Objetivo: executar o seed controlado em producao apenas para aplicar a imagem real ao tour semeado anteriormente e renovar a agenda.

Tarefas:

- RT-016C.1 Validar existencia da imagem real em `public/images/trips/`. Estado: DONE.
- RT-016C.2 Auditar `prisma/seed.ts` para garantir idempotencia e ausencia de operacoes destrutivas. Estado: DONE.
- RT-016C.3 Executar seed manualmente contra Neon production (Trigger). Estado: DONE.
- RT-016C.4 Validar imagem real renderizada na Home e `/tours` em producao. Estado: DONE.
- RT-016C.5 Atualizar documentacao operacional. Estado: DONE.

Criterios de aceite: imagem real aplicada; agenda renovada; nenhum novo tour adicionado; sem code change ou migration.
Dependencias: RT-016B.
Risco: baixo.
Evidencia esperada: smoke PASS em producao; tour exibe imagem `/images/trips/imagem-morro-pao-de-acucar.jpg`.

## RT-017A Admin Tour Manager Rules and Scope

Estado: DONE

Objetivo: registrar as regras funcionais e tecnicas do Admin Tour Manager MVP antes de implementar codigo.

Tarefas:

- RT-017A.1 Criar documento de regras para Admin Tour Manager MVP. Estado: DONE.
- RT-017A.2 Definir diretrizes de integridade, imagens e i18n. Estado: DONE.
- RT-017A.3 Fatiar o backlog de implementacao em tarefas granulares. Estado: DONE.
- RT-017A.4 Atualizar documentacao operacional. Estado: DONE.

Criterios de aceite: documento `docs/ops/admin-tour-manager-rules.md` existe; regras aprovadas; tarefas subsequentes mapeadas.
Dependencias: RT-016C.
Risco: baixo.
Evidencia esperada: este registro e o arquivo de regras.

## RT-017B Admin Tour List

Estado: DONE

Objetivo: implementar listagem somente leitura de tours no admin.

Tarefas:

- RT-017B.1 Adicionar `listAllTrips` em `trip.service.ts`. Estado: DONE.
- RT-017B.2 Adicionar `listAllTripsAction` em `app/actions/admin.ts`. Estado: PLANNED (Substituida por chamada direta ao service no Server Component).
- RT-017B.3 Criar pagina `/[locale]/admin/tours` com tabela de listagem. Estado: DONE.

Criterios de aceite: admins conseguem ver todos os tours; link de navegacao no admin layout funciona.
Dependencias: RT-017A.

## RT-017C Admin Tour Create

Estado: DONE

Objetivo: implementar criacao de novos tours via admin como rascunho.

Tarefas:

- RT-017C.1 Criar Server Action de criacao protegida forçando `isPublished: false`. Estado: DONE.
- RT-017C.2 Criar formulario em `/[locale]/admin/tours/new` com validacao de campos Json. Estado: DONE.
- RT-017C.3 Adicionar botao "Novo Tour" na listagem. Estado: DONE.

Criterios de aceite: novo tour criado com `isPublished: false`; campos i18n persistidos corretamente; redirect funciona.
Dependencias: RT-017B.

## RT-017D Admin Tour Edit & Visibility

Estado: PLANNED

Objetivo: implementar edicao e controle de publicacao de tours.

Tarefas:

- RT-017D.1 Criar Server Action de edicao protegida. Estado: PLANNED.
- RT-017D.2 Criar pagina de edicao `/[locale]/admin/tours/[id]`. Estado: PLANNED.
- RT-017D.3 Implementar toggle de `isPublished`. Estado: PLANNED.

Criterios de aceite: edicao nao afeta bookings historicos; tour aparece/some do publico conforme status.
Dependencias: RT-017C.

## RT-017E Admin Tour Basic Schedule Management

Estado: PLANNED

Objetivo: permitir controle basico de agendas vinculadas a um tour no admin.

Tarefas:

- RT-017E.1 Listar schedules dentro do detalhe do tour. Estado: PLANNED.
- RT-017E.2 Implementar acao para abrir/fechar (`status`) de um schedule. Estado: PLANNED.

Criterios de aceite: admin consegue bloquear datas sem excluir o registro.
Dependencias: RT-017D.

## RT-018A Production Product Smoke Check

Estado: DONE

Objetivo: auditar o produto em producao como usuario real, validando descoberta de tour, reserva, confirmacao manual e protecoes admin.

Tarefas:

- RT-018A.1 Validar Git limpo e sincronizado antes do smoke. Estado: DONE.
- RT-018A.2 Confirmar commit Vercel em producao. Estado: DONE.
- RT-018A.3 Validar Home, catalogo, detalhe, login e registro. Estado: DONE.
- RT-018A.4 Criar reserva pelo fluxo publico normal ate confirmacao manual. Estado: DONE.
- RT-018A.5 Validar protecao admin sem sessao. Estado: DONE.
- RT-018A.6 Validar comportamento admin com usuario comum autenticado. Estado: DONE.
- RT-018A.7 Registrar bugs, bloqueios e proximas candidatas sem alterar codigo. Estado: DONE.

Criterios de aceite: resultado objetivo em PASS/FAIL/BLOCKED/WARN; nenhuma alteracao de codigo, schema, seed, migration, deploy ou banco manual; nenhuma nova READY aberta automaticamente.
Dependencias: RT-017C.
Risco: medio.
Evidencia: commit de producao `6b59c92`; booking publico `cmoli78ld000204js1agra4il`; public flow PASS; admin anonymous PASS; admin non-admin FAIL com `ERROR 2933230167`; admin real login BLOCKED; checkout externo NOT TESTED/nao iniciado; content image alignment WARN; React hydration `#418` WARN.

Notas operacionais:

- O booking de auditoria foi criado apenas pelo fluxo publico normal do produto.
- O segundo tour "Pao de Acucar ao Entardecer" permanece rascunho corretamente fora do catalogo publico.
- O catalogo publico tem apenas 1 tour publicado; isso e aceitavel para o smoke, mas e uma limitacao de produto.
- Proxima candidata recomendada, sem READY automatica: RT-018B - Fix Admin Non-Admin Authorization Handling.

## RT-018B Fix Admin Non-Admin Authorization Handling

Estado: DONE

Objetivo: corrigir o tratamento de autorizacao das rotas admin para usuario autenticado sem role ADMIN, substituindo erro 500 por bloqueio controlado.

Tarefas:

- RT-018B.1 Reproduzir localmente o acesso non-admin a `/[locale]/admin`. Estado: DONE.
- RT-018B.2 Ajustar tratamento de `FORBIDDEN`/non-admin no AdminLayout ou boundary apropriado. Estado: DONE.
- RT-018B.3 Validar `/pt/admin`, `/pt/admin/tours`, `/pt/admin/bookings` e `/pt/admin/contacts` para anonimo, USER e ADMIN. Estado: DONE via teste unitario do layout central.
- RT-018B.4 Registrar evidencias sem expor credenciais. Estado: DONE.

Criterios de aceite: anonimo redireciona para login; USER autenticado recebe bloqueio controlado ou redirect previsto, nunca 500; ADMIN continua acessando painel; sem schema, migration, seed ou deploy manual.
Dependencias: RT-018A.
Risco: alto.
Evidencia: `AdminLayout` agora trata `DomainError` `FORBIDDEN` com tela controlada "Acesso negado"; `UNAUTHENTICATED` segue redirecionando para login; ADMIN segue renderizando o painel; `tests/admin-layout.test.tsx` cobre os tres cenarios; lint PASS, typecheck PASS, tests PASS, build PASS, `git diff --check` PASS.

Notas operacionais:

- Causa provavel do 500: `requireAdminSession()` lancava `DomainError` com `code = FORBIDDEN`, mas o `AdminLayout` so tratava `UNAUTHENTICATED` e relancava `FORBIDDEN`, gerando erro 500 em Server Components no runtime publicado.
- A correcao ficou centralizada no `AdminLayout`; paginas e actions admin continuam usando a protecao existente.
- Nenhuma regra de booking, tour, contact, schema, seed, migration, banco manual ou deploy manual foi alterada.

## RT-018C Validate Production Admin Access

Estado: DONE

Objetivo: validar acesso ADMIN real em producao e confirmar que o painel administrativo renderiza para leitura/gestao basica.

Tarefas:

- RT-018C.1 Validar Git limpo e sincronizado. Estado: DONE.
- RT-018C.2 Confirmar Vercel production Ready no commit esperado. Estado: DONE.
- RT-018C.3 Verificar existencia de credencial ADMIN utilizavel sem expor segredo. Estado: DONE via RT-018D.
- RT-018C.4 Login ADMIN em producao. Estado: DONE via RT-018D.
- RT-018C.5 Validar `/pt/admin`, `/pt/admin/tours`, `/pt/admin/bookings` e `/pt/admin/contacts`. Estado: DONE via RT-018D.
- RT-018C.6 Verificar booking `cmoli78ld000204js1agra4il` no admin. Estado: DONE via RT-018D.

Criterios de aceite: ADMIN real consegue acessar painel e rotas principais; booking de smoke fica visivel em admin bookings ou detalhe equivalente; nenhuma acao destrutiva executada.
Dependencias: RT-018D.
Risco: medio.
Evidencia: login ADMIN PASS; rotas admin PASS; booking visível PASS em produção.

## RT-018D Validate Existing Production Admin User

Estado: DONE

Objetivo: validar o usuário administrador existente em produção utilizando as credenciais fornecidas pelo Trigger.

Tarefas:

- RT-018D.1 Verificar estado Git. Estado: DONE.
- RT-018D.2 Confirmar produção acessível. Estado: DONE.
- RT-018D.3 Validar login ADMIN sem expor credenciais. Estado: DONE.
- RT-018D.4 Testar rotas `/pt/admin`, `/pt/admin/tours`, `/pt/admin/bookings`, `/pt/admin/contacts`. Estado: DONE.
- RT-018D.5 Validar visibilidade do booking `cmoli78ld000204js1agra4il`. Estado: DONE.
- RT-018D.6 Registrar resultados e atualizar documentação operacional. Estado: DONE.

Criterios de aceite: Todas as validações concluídas com sucesso (PASS); nenhuma exposição de credenciais; nenhuma alteração destrutiva ou no banco realizada.
Dependencias: RT-018B.
Risco: baixo.
Evidencia: Login Status 200; Rotas Status 200; Booking visível: True.

## RT-019A Publicar Pao de Acucar com caminho controlado de dados
Estado: DONE
Objetivo: Fazer o tour Pao de Acucar aparecer no catalogo publico de forma controlada, segura e reproduzivel.
Criterios de aceite: seed atualizado de forma idempotente com logica de Semantic Match para evitar duplicacao; Pao de Acucar publicado com imagem correta e agenda futura; Cristo Redentor mantido com imagem atual (sem placeholder); lint/typecheck/build PASS; producao validada com 2 tours no catalogo.
Evidencia: Remote DONE + Production Seed/Smoke PASS; seed detectou tour existente `cmolfs9eu000004l2trz4q8bf` pelo titulo; Pao de Acucar publicado em producao; `/pt/tours` validado com 2 tours; sem duplicacao; seed executado uma unica vez e nao executado novamente apos documentacao; commit topo `8f4061b`.

## RT-018E Fix Logout Flow

Estado: DONE

Objetivo: corrigir o fluxo de logout que nao encerrava a sessao corretamente.

Tarefas:

- RT-018E.1 Auditar rota customizada `app/api/auth/sign-out/route.ts` e identificar conflito com Better Auth. Estado: DONE.
- RT-018E.2 Remover rota customizada incorreta. Estado: DONE.
- RT-018E.3 Corrigir redirect locale-aware em `auth-status.tsx`. Estado: DONE.
- RT-018E.4 Corrigir wiring de `useLocale` e redirect em `mobile-menu.tsx`. Estado: DONE.
- RT-018E.5 Validar localmente e publicar commit. Estado: DONE.

Criterios de aceite: logout invalida sessao no banco; cookie limpo; redirect para locale correto; `/pt/admin` apos logout redireciona para login; refresh nao restaura sessao.
Dependencias: RT-018D.
Risco: alto.
Evidencia: commit `837694b fix: correct logout flow`; lint/typecheck/test/build PASS; push para `origin/main`; Production Smoke PASS validado em producao.

Notas operacionais:

- Causa raiz: rota `app/api/auth/sign-out/route.ts` interceptava POST `/api/auth/sign-out` antes do handler `[...all]` do Better Auth, limpando apenas cookies sem invalidar a sessao no banco. Com a rota customizada removida, `authClient.signOut()` chama o handler Better Auth que invalida a sessao no banco via `nextCookies()`.
- Nenhum schema, seed, migration, deploy manual, banco manual, imagem, tour ou checkout foi alterado.

## RT-021A Revisao de UX, Navegacao e Busca Publica

Estado: DONE
Objetivo: corrigir pequenos problemas publicos de UX/navegacao sem redesign e sem tocar em areas sensiveis.
Escopo executado:
- Hero Search corrigida para nao passar URL com locale duplicado ao router locale-aware.
- Busca do catalogo corrigida de forma minima: `?search=` agora filtra titulo, descricao, cidade e localizacao.
- Filtro lateral da pagina Nossos Tours removido do MVP com 2 tours.
- CTA principal do card de tour agora leva ao detalhe/selecionar data, sem tentar criar booking sem `scheduleId`.
- Footer sem `href="#"` visivel; redes sociais sem destino real foram removidas e "Precos" removido.

Criterios de aceite: logo, contato, tours, cards e detalhe preservam locale; Hero Search nao gera locale duplicado; busca falsa removida/corrigida; Nossos Tours sem filtro inutil; card nao tenta reservar sem data; footer sem controles falsos; lint/typecheck/test/build/git diff --check PASS. Production UX Smoke PASS em `69379fe`: Hero Search sem `/pt/pt`, `?search=Pao` filtra Pao de Acucar e exclui Cristo, busca sem resultado mostra empty state generico aceitavel, detalhes dos 2 tours `200`, CTA de reserva anonima redireciona para login com redirect seguro sem criar booking, menu desktop/mobile preserva locale.
Restricoes mantidas: sem admin, auth/logout, seed, banco, migration, pagamento, schema, deploy manual ou regra de booking.

## RT-022A Admin Booking Actions

Estado: REVIEW

Objetivo: tornar o fluxo operacional basico de reservas no admin seguro para o ciclo PENDING -> CONFIRMED/CANCELED, sem tocar em checkout, pagamento, schema, seed, tour ou schedule.

Decisao: implementar acoes de reserva primeiro. Admin tour edit/publish, schedule management e hard delete ficam fora desta task.

Tarefas:

- RT-022A.1 Promover a task como unica ativa e confirmar repo limpo/sincronizado. Estado: DONE.
- RT-022A.2 Adicionar `confirmBookingByAdmin` no service central de reservas. Estado: DONE local.
- RT-022A.3 Adicionar Server Action admin protegida por `requireAdminSession()`. Estado: DONE local.
- RT-022A.4 Exibir no detalhe apenas acoes validas por status. Estado: DONE local.
- RT-022A.5 Alinhar copy/listagem/status do admin. Estado: DONE local.
- RT-022A.6 Adicionar/atualizar testes aplicaveis. Estado: DONE local.
- RT-022A.7 Rodar lint/typecheck/test/build/git diff --check e smoke admin possivel. Estado: DONE automatizado; smoke manual mutavel BLOCKED sem ambiente local/admin controlado (`check:db` carregou `.env` com banco remoto/gerenciado; `.env.local` nao possui credenciais admin).

Criterios de aceite: ADMIN confirma apenas reserva PENDING; ADMIN cancela apenas PENDING/CONFIRMED; CANCELED nao mostra acoes; CONFIRMED nao mostra confirmar novamente; transicoes invalidas bloqueadas server-side; confirmar nao altera `paymentStatus`; cancelar nao aciona refund; sem schema, migration, seed, banco manual, auth, payment, checkout, tour, schedule ou deploy manual.

Evidencia atual: implementacao local sem commit/push; review aceita somente como REVIEW, nao DONE; lint/typecheck/test/build/git diff --check PASS; smoke manual de confirmar/cancelar BLOCKED para evitar alteracao de banco remoto/gerenciado e porque nao ha credenciais admin locais em `.env.local`.

Proximo passo obrigatorio: preparar ambiente local/admin controlado para smoke mutavel com dados de teste ou abrir task separada de validacao para verificar com seguranca o ciclo admin de reserva.

## Proxima Discussion Gate

Nenhuma nova READY task alem da RT-022A. Proxima Discussion Gate recomendada apos RT-022A: evoluir o admin existente para edicao/publicacao de tours, sem recriar o admin do zero.
