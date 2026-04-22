# Status Operacional - Rick Travel

Data: 2026-04-22

## Protocolo Rick

Fase atual: Fase 3 - Staging Real Controlado.

Status da fase: BLOCKED por acoes externas; repositorio READY para configuracao de staging na Vercel.

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

## Fase 3 - Staging real controlado

### Diagnostico

- Provider definido: Vercel.
- Estrategia aprovada: preview tecnico em `.vercel.app`, staging real em `staging.<dominio-do-projeto>`, producao separada e fora desta fase.
- Conta Vercel autenticada via CLI: `devricardo90`.
- Projetos Vercel encontrados: `eco-pickup-web` e `bio-loop-orchestrator-web`; nenhum projeto `rick-travel`.
- Dominios Vercel encontrados: nenhum.
- Deploy de staging real nao deve usar preview `.vercel.app` como substituto de staging.

### Validacoes Fase 3

- `npm.cmd run check:env -- --target=staging`: BLOCKED esperado; falta `MP_ACCESS_TOKEN` e `BETTER_AUTH_URL` ainda aponta para localhost.
- `npm.cmd run preflight:staging`: BLOCKED no primeiro passo por contrato de env staging incompleto.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run check:db`: PASS com banco local.
- `npm.cmd test -- --run`: PASS, 4 arquivos e 15 testes.
- `npx.cmd vercel project ls`: PASS; confirma ausencia do projeto Rick Travel.
- `npx.cmd vercel domains ls`: PASS; confirma ausencia de dominio cadastrado.
- `/api/health` em URL publica: BLOCKED ate existir deploy de staging.
- `/api/health?deep=1` em URL publica: BLOCKED ate existir deploy de staging e banco de staging.
- Auth com `BETTER_AUTH_URL` publico: BLOCKED ate existir `https://staging.<dominio-do-projeto>`.

### Bloqueio externo preciso

- Criar/importar projeto Vercel `rick-travel` a partir de `devricardo90/rick-travel`.
- Cadastrar dominio proprio na Vercel.
- Criar/apontar `staging.<dominio-do-projeto>` no DNS.
- Provisionar PostgreSQL isolado para staging.
- Configurar env vars de staging no projeto Vercel.
- Configurar Mercado Pago sandbox e Resend para staging.

## Riscos remanescentes

- P1: `npm audit` residual em Prisma dev tooling precisa janela controlada.
- P1: secrets locais devem ser rotacionados se houve compartilhamento fora da maquina.
- P1: staging real segue BLOCKED por acoes externas: projeto Vercel, banco, dominio/subdominio, envs reais, Mercado Pago sandbox e Resend.
- P2: Mercado Pago sandbox segue BLOCKED ate existir ambiente publico de staging e credenciais externas.

## Decisoes que nao devem ser quebradas

- Reserva nasce `PENDING` e `UNPAID`.
- Booking so vira `CONFIRMED` apos evento confiavel de pagamento.
- Auth/admin deve passar por Better Auth e checagens centralizadas.
- Regras de dominio devem ficar em `lib/services`.
- Conteudo multilanguage usa JSON por locale com fallback em PT.
- Tour tecnico E2E deve ficar oculto da vitrine publica.
- Staging deve passar por preflight antes de qualquer promocao.
