# Status Operacional - Rick Travel

Data: 2026-04-22

## Protocolo Rick

Fase atual: Fase 2 - Higiene Operacional e Preparo de Staging.

Status da fase: DONE.

Fase 1 permanece: REVIEW.

## Estado reconstruido

Rick Travel e uma plataforma web de turismo para tours no Rio de Janeiro, com vitrine publica, reserva autenticada, pagamento Pix via Mercado Pago, painel admin, i18n e analytics interno.

## Fase 2 - Diagnostico por item

### E2E autenticado

- Sintoma: suite completa falhava no booking autenticado, enquanto testes publicos passavam.
- Causa exata: concorrencia/timeout de E2E em execucao paralela por arquivo. O teste `e2e/booking.spec.ts` passou isolado com `--workers=1`, provando que nao era fixture, seed, env, auth flow, locale, redirect ou selector.
- Acao aplicada: `playwright.config.ts` foi serializado com `workers: 1`.
- Resultado: `npm.cmd run test:e2e` passou com 5/5.
- Severidade: P1.
- Status: DONE.

### Governanca de secrets

- Sintoma: `.env` local possui valores reais.
- Impacto: risco operacional se valores forem compartilhados, copiados ou vazarem em logs.
- Acao aplicada: `.env.example` existe, `.env*` continua ignorado, `docs/ops/secrets.md` criado, `scripts/validate-env.ts` criado e scripts `check:env` adicionados.
- Evidencia: `git ls-files .env .env.local .env.example` rastreia apenas `.env.example`; `git check-ignore` confirma `.env` e `.env.local` ignorados.
- Severidade: P1.
- Status: DONE para governanca minima; rotacao segue READY.

### Prisma audit residual

- Sintoma: `npm.cmd audit --audit-level=moderate` ainda reporta 3 vulnerabilidades moderadas.
- Pacotes: `prisma` -> `@prisma/dev` -> `@hono/node-server`.
- Impacto: tooling/dev dependency, nao evidenciado como runtime direto da aplicacao Next.
- Decisao: aceitar temporariamente com justificativa e backlogar para janela controlada. Nao usar `npm audit fix --force`, porque a propria saida do npm sugere instalar `prisma@6.19.3`, mudanca breaking/downgrade em relacao a Prisma 7.
- Severidade: P1.
- Status: REVIEW.

### Preparo de staging

- Acao aplicada: `docs/ops/staging-checklist.md`, `npm run check:env`, `npm run check:db`, `npm run preflight:staging`, healthcheck profundo `/api/health?deep=1`.
- Resultado local: `check:env -- --target=local` PASS; `check:db` PASS.
- Resultado staging simulado com env local: BLOCKED esperado por `MP_ACCESS_TOKEN` ausente e `BETTER_AUTH_URL` apontando para localhost.
- Severidade: P1.
- Status: READY para configurar quando provider/envs externos existirem.

## Estado de verificacao final

- `npm.cmd run check:env -- --target=local`: PASS.
- `npm.cmd run check:env -- --target=staging`: BLOCKED esperado; faltam envs reais de staging e URL nao local.
- `npm.cmd run check:db`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run test`: PASS, 4 arquivos, 15 testes.
- `npm.cmd run test:e2e`: PASS, 5/5.
- `npm.cmd audit --audit-level=moderate`: FAIL residual, 3 moderadas em Prisma dev tooling.

## Riscos remanescentes

- P1: `npm audit` residual em Prisma dev tooling precisa janela controlada.
- P1: secrets locais devem ser rotacionados se houve compartilhamento fora da maquina.
- P1: staging real segue BLOCKED por definicoes externas: provider, banco, dominio/subdominio, envs reais, Mercado Pago sandbox e Resend.
- P2: Mercado Pago externo segue fora da Fase 2 ate existir ambiente publico.

## Decisoes que nao devem ser quebradas

- Reserva nasce `PENDING` e `UNPAID`.
- Booking so vira `CONFIRMED` apos evento confiavel de pagamento.
- Auth/admin deve passar por Better Auth e checagens centralizadas.
- Regras de dominio devem ficar em `lib/services`.
- Conteudo multilanguage usa JSON por locale com fallback em PT.
- Tour tecnico E2E deve ficar oculto da vitrine publica.
- Staging deve passar por preflight antes de qualquer promocao.
