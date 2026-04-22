# Session Handoff - Rick Travel

Data: 2026-04-22

## Contexto

Sessao atualizada ate a Fase 3 - Staging Real Controlado seguindo o Protocolo Rick.

Fase 1 permanece REVIEW.
Fase 2 esta DONE no que dependia do repositorio.
Fase 3 esta BLOCKED por acoes externas, com repositorio READY para configurar staging na Vercel.

## O que foi feito

### Fase 3

- Provider confirmado: Vercel.
- Estrategia de dominio registrada: previews tecnicos em `.vercel.app`; staging em `staging.<dominio-do-projeto>`; producao separada.
- Vercel CLI validado via `npx vercel`.
- Conta autenticada: `devricardo90`.
- Ausencia de projeto `rick-travel` na Vercel confirmada.
- Ausencia de dominios cadastrados na Vercel confirmada.
- Contrato de staging reforcado em `docs/ops/secrets.md` e `docs/ops/staging-checklist.md`.
- Documento operacional `docs/ops/vercel-staging.md` criado.
- Runtime Node definido em `package.json` como `22.x` para alinhar Vercel com `.nvmrc`.
- `lib/auth.ts` passou a incluir `BETTER_AUTH_URL` em `trustedOrigins` quando definido, mantendo localhost/127.0.0.1.

### Fase 2

- E2E autenticado diagnosticado e estabilizado.
- `playwright.config.ts` passou a usar `workers: 1`.
- `next.config.ts` passou a aceitar qualidade de imagem `90`, removendo warning de E2E.
- `scripts/validate-env.ts` criado.
- `scripts/test-db.ts` tornado nao destrutivo.
- `app/api/health/route.ts` ganhou healthcheck profundo com banco via `?deep=1`.
- Scripts `check:env`, `check:db` e `preflight:staging` adicionados.
- `docs/ops/secrets.md` e `docs/ops/staging-checklist.md` criados.
- Docs operacionais atualizados.

## Evidencias importantes

- Fase 3 nao publicou staging porque a conta Vercel nao possui projeto Rick Travel nem dominio cadastrado.
- O repositorio esta READY para staging do ponto de vista de build e documentacao operacional.
- E2E completo passou 5/5 na Fase 2.
- `.env` e `.env.local` seguem ignorados pelo Git; apenas `.env.example` e rastreavel.
- Audit residual Prisma e de tooling/dev dependency.

## Comandos executados

- `npx.cmd vercel --version`
- `npx.cmd vercel whoami`
- `npx.cmd vercel project ls`
- `npx.cmd vercel domains ls`
- `npm.cmd run check:env -- --target=staging`
- `npm.cmd run preflight:staging`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run check:db`
- `npm.cmd test -- --run`
- `npm.cmd install --package-lock-only`
- `npm.cmd run lint`
- `npm.cmd run typecheck`

## Resultados

- `npx.cmd vercel project ls`: PASS; nao existe projeto Rick Travel na conta.
- `npx.cmd vercel domains ls`: PASS; 0 dominios encontrados.
- `npm.cmd run check:env -- --target=staging`: BLOCKED esperado por envs reais ausentes/URL local.
- `npm.cmd run preflight:staging`: BLOCKED no primeiro passo por env staging incompleta.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run check:db`: PASS com banco local.
- `npm.cmd test -- --run`: PASS, 4 arquivos e 15 testes.
- `npm.cmd run lint`: PASS apos ajuste de auth.
- `npm.cmd run typecheck`: PASS apos ajuste de auth.

## Bloqueios e pendencias

- Projeto Vercel Rick Travel: BLOCKED.
- Banco staging: BLOCKED.
- Dominio/subdominio de staging: BLOCKED.
- `MP_ACCESS_TOKEN` de staging sandbox: BLOCKED.
- `BETTER_AUTH_URL` de staging precisa URL publica, nao localhost; suporte em `trustedOrigins` esta READY no codigo.
- Resend staging/remetente: BLOCKED ate configuracao externa.
- `npm audit` moderado remanescente deve ser tratado em janela controlada.

## Proxima acao recomendada

1. Criar/importar projeto `rick-travel` na Vercel a partir de `devricardo90/rick-travel`.
2. Cadastrar dominio e apontar `staging.<dominio-do-projeto>`.
3. Configurar envs reais de staging e rodar `npm run preflight:staging`.
