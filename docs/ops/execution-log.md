# Execution Log - Rick Travel

Registro cronologico de execucoes operacionais significativas em producao.
Nao registrar operacoes de codigo ou commits rotineiros — apenas execucoes com efeito em banco ou ambiente de producao.

---

## 2026-04-30 — RT-015B Seed de Producao

**Executado por:** Trigger (manual)
**Comando:** `DATABASE_URL=<neon-prod> npx tsx prisma/seed.ts`
**Commit base:** `cf0f96f feat: add idempotent minimal seed for RT-015B`
**Estrategia:** upsert idempotente via IDs deterministicos; sem deleteMany; sem migration.

**Resultado:**

- Trip upserted: `seed-001-cristo-dona-marta` — "Cristo Redentor + Mirante Dona Marta"
- TripSchedule upserted: `seed-001-schedule-001` — startAt: 2026-07-29T12:00:00.000Z
- Nenhuma linha deletada.
- Seed pode ser re-executado com seguranca (idempotente).

**Verificacao pos-seed:**

- `/pt/tours`: tour visivel.
- `/api/trips`: retorna 1 trip publicada.

---

## 2026-04-30 — RT-015C Smoke — Fluxo Completo de Reserva e Admin

**Executado por:** Trigger (manual, browser em producao)
**Ambiente:** `https://rick-travel.vercel.app`
**Commit Vercel:** `fa83e02 fix: prevent invisible mobile menu sheet from intercepting page clicks (RT-015C)`
**Pre-requisito:** seed executado acima; fix RT-015C-FIX deployado.

**Passos e resultados:**

| Passo | URL / Acao | Resultado |
|---|---|---|
| 1 | `/pt/tours` | Tour Cristo Redentor + Mirante Dona Marta visivel |
| 2 | Click no card do tour | Tour detail abre corretamente |
| 3 | Schedule selector | 29/07/2026 selecionavel; sem redirect espurio |
| 4 | "Reservar Agora" (autenticado) | Booking criado com sucesso |
| 5 | `/pt/admin/bookings` | Reserva aparece na listagem |
| 6 | "Ver detalhes" | Pagina de detalhe abre com dados corretos |
| 7 | Dados do detalhe | Cliente: Ricardo / ricardo@gmail.com; Trip: Cristo Redentor + Mirante Dona Marta; Data: 29/07/2026; Hospedes: 1; Total: R$ 245,00 |
| 8 | Botao Cancelar | Exibido (booking estava PENDING/CONFIRMED) |
| 9 | Confirmacao e cancelamento | `booking.status` = CANCELED (visivel na listagem) |
| 10 | Detalhe apos cancelamento | Hospedes: 1; Total: R$ 245,00; Data: 29/07/2026 |
| 11 | Tentativas de pagamento | "Nenhuma tentativa de pagamento registrada." |

**Validacao de pagamento:** Payment attempts remained absent; no payment gateway/refund/payment mutation was triggered in the MVP flow. Nenhum campo `paymentStatus` e exposto diretamente pela UI do detalhe da reserva.

**Status do smoke:** PASS completo.

**Bugs encontrados e resolvidos nesta sprint:**

- RT-015C-FIX: `MobileMenu` bottom sheet interceptava cliques invisivelmente em `/pt/tours` e em todas as paginas publicas. Causa: `position: fixed; z-index: 50; opacity: 0` sem `pointer-events: none`. Fix: commit `fa83e02`. Lint PASS, typecheck PASS, build PASS antes do push.

**Estado pos-smoke:**

- Neon production: 1 Trip publicada, 1 TripSchedule OPEN, 1 Booking (CANCELED).
- Nao executar seed novamente.
- Nao executar migration.
- Nao alterar Neon manualmente.
