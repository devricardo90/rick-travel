# Status Operacional - Rick Travel

Data: 2026-04-30

## Protocolo Rick

Fase atual: Fase 3 - Operacao publica controlada do MVP.

Status da fase: IN_PROGRESS.

Leitura objetiva da fase:

- deploy tecnico concluido;
- MVP publico publicado na Vercel;
- build estabilizado;
- runtime inicial validado ate o ponto atual;
- decisao Admin Discussion Gate: B) Reconstruir Admin MVP minimo e seguro;
- Mercado Pago continua fora do escopo atual.

Fase 1 permanece: REVIEW.

## Estado reconstruido

Rick Travel e uma plataforma web de turismo para tours no Rio de Janeiro, com vitrine publica, reserva autenticada, i18n e analytics interno.

O projeto nao esta mais na etapa de bloqueio de build nem na etapa de preparo de staging. O estado real agora e de publicacao tecnica concluida, com foco operacional em estabilizacao pos-deploy e reconstrucao controlada do painel admin.

## Evidencia operacional consolidada

- `npm.cmd run check:env -- --target=local`: PASS.
- `npm.cmd run check:db`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run test`: PASS, 4 arquivos, 15 testes.
- `npm.cmd run test:e2e`: PASS, 5/5.
- `npx.cmd vercel inspect rick-travel.vercel.app`: PASS; alias canonico agora aponta para `dpl_4vxzDoDd7Du1qLxtTBbyPgYFb36F`, status `Ready`, projeto `rick-travel`.
- `https://rick-travel.vercel.app`: PASS `200`.
- `https://rick-travel.vercel.app/api/health`: PASS `200`.
- `https://rick-travel.vercel.app/api/health?deep=1`: PASS `200`, database `ok`.
- Slice de estabilizacao publicado em `main`.
- `git pull --rebase origin main`: PASS.
- `git push origin main`: PASS.
- RT-011.8: runbook minimo criado.
- RT-012A DONE remoto: risco de bootstrap ADMIN removido.
- RT-012B DONE remoto: admin e2e neutralizado.
- RT-013B DONE remoto: esqueleto de protecao de rotas do novo Admin MVP.
- RT-013C DONE remoto: listagem de reservas somente leitura implementada no Admin MVP; commit pendente.
- RT-013D DONE: listagem de contatos somente leitura implementada.
- RT-013E DONE: acao de marcar contato como lido implementada.
- RT-013F DONE remoto: navegacao e dashboard do admin aprimorados.
- RT-013G DONE remoto: pagina de detalhe de reserva somente leitura; commit `09ffcb0` em `origin/main`.
- RT-014A DONE remoto: regras de cancelamento admin definidas e registradas.
- RT-014B DONE remoto: acao de cancelamento admin implementada; commit `08a3de2` no topo de `main`/`origin/main`.
- RT-015A DONE: auditoria de catalogo confirmou 0 trips em Neon production; causa do vazio identificada (ausencia de dados, nao bug de codigo).
- RT-015B DONE: seed idempotente criado (`prisma/seed.ts`); commit `cf0f96f` em `origin/main`; seed executado manualmente pelo Trigger contra Neon production; 1 Trip (Cristo Redentor + Mirante Dona Marta, R$ 245,00) e 1 TripSchedule OPEN (29/07/2026) criados.
- RT-015C-FIX DONE: bug critico corrigido — bottom sheet do mobile-menu interceptava cliques invisivelmente (`opacity: 0` sem `pointer-events: none`); commit `fa83e02 fix: prevent invisible mobile menu sheet from intercepting page clicks (RT-015C)` em `origin/main`.
- RT-015C DONE: smoke completo validado em producao pelo Trigger — tour visivel em `/pt/tours`, reserva criada (Ricardo / ricardo@gmail.com, R$ 245,00, 1 hospede, 29/07/2026), listagem e detalhe admin corretos, cancelamento admin confirmado (status = CANCELED na listagem; detalhe pos-cancelamento: "Nenhuma tentativa de pagamento registrada."; payment attempts remained absent — no payment gateway/refund/payment mutation was triggered in the MVP flow).
- RT-016A DONE remoto + production smoke validated: commit `799698c feat: polish booking confirmation flow`; fluxo user-side pos-reserva polido para pre-reserva com confirmacao manual; redirect para `/pt/reservas/{bookingId}` validado em producao; `/pt/reservas` lista a reserva e "Ver detalhes" abre o detalhe; payment status nao aparece mais como enum cru `UNPAID`; admin booking list permanece funcional; nenhum gateway, schema, migration, seed, env ou regra admin alterados.
- RT-016B DONE remoto + production smoke validated: commit `5e120a4 chore: simplify home catalog entry point`; Home deixou de renderizar os package cards comerciais antigos que apontavam para contato; `Passeios disponiveis` permanece como catalogo real principal; seed preparado para usar imagem real local `/images/trips/imagem-morro-pao-de-acucar.jpg`; seed nao executado; sem schema, migration, Neon, gateway, admin, auth/env/provider.
- RT-016C DONE remoto + production smoke validated: seed controlado executado manualmente pelo Trigger contra Neon production para aplicar imagem real ao tour existente; imagem `/images/trips/imagem-morro-pao-de-acucar.jpg` validada em producao na Home e tours; agenda renovada para 90 dias; nenhum novo tour adicionado; sem schema, migration ou code change.
- RT-017A DONE: regras e escopo do Admin Tour Manager MVP definidos e documentados em `docs/ops/admin-tour-manager-rules.md`; backlog fatiado em RT-017B/C/D/E.
- RT-017B DONE remoto + production smoke validated: listagem somente leitura de tours implementada no admin; acesso via `/[locale]/admin/tours`; link "Tours" ativo no menu; tour "Cristo Redentor + Mirante Dona Marta" exibido com imagem, preco R$ 245,00 e 1 agenda; status PUBLICADO; sem acoes mutaveis (create/edit/delete/publish/schedule); deploy automatico Vercel verificado; proteção herdada do AdminLayout (teste explícito com não-admin pendente).
- RT-017C DONE remoto + production smoke manual validated: commit `4c3e3fe feat: add admin tour draft creation` publicado em producao Vercel; smoke manual executado pelo Trigger com credencial ADMIN privada, sem compartilhar credenciais com agente; tour real "Pao de Acucar ao Entardecer" criado como rascunho; ID `cmolfs9eu000004l2trz4q8bf`; cidade `rio de janeiro`; preco R$ 245,00; status RASCUNHO / `isPublished=false`; 0 agendas; aparece em `/pt/admin/tours`; nao aparece em `/pt/tours`, onde permanece visivel apenas o tour publicado "Cristo Redentor + Mirante Dona Marta"; nenhum deploy manual, migration, seed ou alteracao direta no banco executado pelo agente.
- RT-018A DONE: Production Product Smoke Check executado em producao no commit `6b59c92`; fluxo publico PASS ate confirmacao manual (`/pt/reservas/cmoli78ld000204js1agra4il`, status Pendente, R$ 245,00, pagamento "A combinar com a equipe"); admin anonimo PASS com redirect para `/pt/login`; admin com usuario comum autenticado FAIL com 500 nas rotas `/pt/admin`, `/pt/admin/tours`, `/pt/admin/bookings` e `/pt/admin/contacts` (`ERROR 2933230167`); login ADMIN BLOCKED por ausencia de credencial no ambiente; checkout externo NOT TESTED/nao iniciado; alinhamento de imagem WARN; React hydration `#418` WARN.
- RT-018B DONE remoto + production non-admin smoke validated: commit `bcf8119`; bug de autorizacao admin non-admin corrigido no `AdminLayout`; `FORBIDDEN` agora renderiza tela controlada "Acesso negado"; `UNAUTHENTICATED` continua redirecionando para login; ADMIN continua renderizando o painel; teste unitario cobre os tres cenarios; smoke em producao confirmou usuario comum sem 500 nas rotas admin; sem schema, seed, migration, deploy manual ou alteracao manual de banco.
- RT-018C DONE: Production Admin Access validation concluída via RT-018D; login ADMIN, rotas admin e visibilidade de booking validados em produção com sucesso.
- RT-018D DONE: Validate Existing Production Admin User executado em produção; login ADMIN PASS; rotas admin PASS; booking `cmoli78ld000204js1agra4il` visível PASS.
- RT-018E DONE + Production Smoke PASS: Fix Logout Flow; causa raiz: rota customizada `app/api/auth/sign-out/route.ts` interceptava o handler Better Auth e limpava cookies sem invalidar sessao no banco; solucao: rota removida, `authClient.signOut()` agora atinge `[...all]` corretamente; commit `837694b`; lint/typecheck/test/build PASS; push para `origin/main` concluido; smoke em producao validou header `X-Matched-Path: /api/auth/[...all]`, clear cookies e redirect para locale.
- GitHub `main` está em `622df2a` após RT-018E.
- Vercel production validada com RT-018E smoke.

- Neon production: 1 Trip publicada com imagem real, 1 TripSchedule OPEN renovado, 1 Booking de teste (status CANCELED), 1 Trip rascunho "Pao de Acucar ao Entardecer" com 0 agendas, e 1 booking de auditoria criado pelo fluxo publico normal (`cmoli78ld000204js1agra4il`).
- Neon production: usuario `ricardo@gmail.com` com `role = ADMIN` e `emailVerified = true` (alteracao manual anterior).

## Novo status geral do projeto

- Build: estabilizado.
- Publicacao: MVP publico acessivel em `https://rick-travel.vercel.app`.
- Runtime inicial: validado com alias publico e healthchecks `200`.
- Admin: em reconstrucao controlada (RT-013A ate RT-014B; RT-017A ate RT-017C concluidas; RT-018B corrige localmente o bug de autorizacao para usuario autenticado sem role ADMIN; RT-018D valida acesso admin em producao).
- Mercado Pago: implementacao existente no repositorio, mas fora do escopo da fase atual.
- Gerenciamento de Tours: listagem e criacao funcional (RT-017B/C); criacao de rascunho validada em producao com tour real; regras do MVP definidas (RT-017A); foco futuro em edicao segura sem hard delete ou upload binario.


## Validacao publica objetiva

### Smoke do fluxo publico

- `GET /pt`: `200`.
- `GET /pt/tours`: `200`.
- `GET /pt/quem-somos`: `200`.
- `GET /pt/contato`: `200`.
- `GET /api/trips`: `200`, retorno com 1 trip publicada (Cristo Redentor + Mirante Dona Marta).
- RT-017C production smoke manual PASS: novo tour "Pao de Acucar ao Entardecer" criado como rascunho no admin e ausente do catalogo publico `/pt/tours`, confirmando `isPublished=false`.
- RT-018A production product smoke: Home PASS; `/pt/tours` PASS; detalhe do tour publicado PASS; login/register PASS; reserva publica PASS ate confirmacao manual; checkout externo nao iniciado; catalogo publico contem 1 tour publicado.
- RT-018E production smoke PASS: logout agora invalida sessao no banco e limpa cookies via Better Auth nativo; header `X-Matched-Path: /api/auth/[...all]` confirmado em producao; `/api/auth/sign-out` retorna `{"success":true}`; redirect para locale-aware URL PASS; `/pt/admin` redireciona para login apos logout PASS.
- `GET /robots.txt`: `200`.
- `GET /sitemap.xml`: `200`.
- RT-016A production smoke PASS: `/pt/tours` abre; detalhe do tour abre; booking cria; usuario redireciona para `/pt/reservas/{bookingId}`; pagina de confirmacao funciona; mensagem de pre-reserva/confirmacao manual esta clara; `/pt/reservas` lista a reserva; "Ver detalhes" abre o detalhe; payment status nao exibe enum cru; admin booking list segue funcional.

## Foco atual

### Curto prazo

- definir proxima tarefa READY em Discussion Gate;
- candidatos planejados: RT-017D (edicao de tours), RT-017E (agendas), follow-up de imagem/conteudo e investigacao do hydration `#418`, ainda sem READY aberta.


### Medio prazo

- fortalecer observabilidade minima do ambiente publicado;
- revisar janela controlada para o residual de `npm audit` em tooling Prisma.

### Continua congelado

- integracao externa real do Mercado Pago;
- qualquer reabertura de escopo comercial ou operacional alem do MVP publico atual.

## Riscos remanescentes

- P1: estabilizacao pos-deploy ainda depende de evidencias operacionais continuas no ambiente publicado.
- P1: `npm audit` residual em Prisma dev tooling segue pendente para janela controlada.
- P1: a credencial de bootstrap ADMIN removida deve ser considerada potencialmente exposta.
- P2: reabrir Mercado Pago agora ampliaria escopo sem justificativa operacional desta fase.
