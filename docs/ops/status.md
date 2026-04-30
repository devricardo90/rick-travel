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
- GitHub `main` aponta para `5e120a4`.
- Vercel production validada pelo Trigger com RT-016C.
- Neon production: 1 Trip publicada com imagem real, 1 TripSchedule OPEN renovado, 1 Booking de teste (status CANCELED).
- Neon production: usuario `ricardo@gmail.com` com `role = ADMIN` e `emailVerified = true` (alteracao manual anterior).

## Novo status geral do projeto

- Build: estabilizado.
- Publicacao: MVP publico acessivel em `https://rick-travel.vercel.app`.
- Runtime inicial: validado com alias publico e healthchecks `200`.
- Admin: em reconstrucao controlada (RT-013A/B/C/D/E/F/G, RT-014A e RT-014B concluidas).
- Mercado Pago: implementacao existente no repositorio, mas fora do escopo da fase atual.
- Reservas do usuario: RT-016A ajustou a experiencia para deixar explicito que o MVP opera com pre-reserva pendente e confirmacao/pagamento manual pela equipe Rick Travel.
- Catalogo publico: RT-016B consolidou a Home em torno de `Passeios disponiveis` como caminho real para detalhe e reserva.


## Validacao publica objetiva

### Smoke do fluxo publico

- `GET /pt`: `200`.
- `GET /pt/tours`: `200`.
- `GET /pt/quem-somos`: `200`.
- `GET /pt/contato`: `200`.
- `GET /api/trips`: `200`, retorno com 1 trip publicada (Cristo Redentor + Mirante Dona Marta).
- `GET /robots.txt`: `200`.
- `GET /sitemap.xml`: `200`.
- RT-016A production smoke PASS: `/pt/tours` abre; detalhe do tour abre; booking cria; usuario redireciona para `/pt/reservas/{bookingId}`; pagina de confirmacao funciona; mensagem de pre-reserva/confirmacao manual esta clara; `/pt/reservas` lista a reserva; "Ver detalhes" abre o detalhe; payment status nao exibe enum cru; admin booking list segue funcional.

## Foco atual

### Curto prazo

- avaliar proximas tasks operacionais: conteudo adicional, UX polish ou integracao de pagamento;
- janela controlada para o residual de `npm audit` em tooling Prisma.

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
