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
- GitHub `main` aponta para `fa83e02`.
- Vercel production esta `Ready` com `fa83e02`.
- Neon production: 1 Trip publicada, 1 TripSchedule OPEN, 1 Booking de teste (status CANCELED apos smoke).
- Neon production: usuario `ricardo@gmail.com` com `role = ADMIN` e `emailVerified = true` (alteracao manual anterior).

## Novo status geral do projeto

- Build: estabilizado.
- Publicacao: MVP publico acessivel em `https://rick-travel.vercel.app`.
- Runtime inicial: validado com alias publico e healthchecks `200`.
- Admin: em reconstrucao controlada (RT-013A/B/C/D/E/F/G, RT-014A e RT-014B concluidas).
- Mercado Pago: implementacao existente no repositorio, mas fora do escopo da fase atual.


## Validacao publica objetiva

### Smoke do fluxo publico

- `GET /pt`: `200`.
- `GET /pt/tours`: `200`.
- `GET /pt/quem-somos`: `200`.
- `GET /pt/contato`: `200`.
- `GET /api/trips`: `200`, retorno com 1 trip publicada (Cristo Redentor + Mirante Dona Marta).
- `GET /robots.txt`: `200`.
- `GET /sitemap.xml`: `200`.

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
