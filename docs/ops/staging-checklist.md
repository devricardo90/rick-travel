# Staging Checklist - Rick Travel

Data: 2026-04-22

## Objetivo

Preparar um ambiente de staging validavel antes de qualquer deploy de producao.

## Status

Estado: BLOCKED para publicacao real ate existir projeto Vercel, dominio proprio e envs de staging.

Bloqueios externos:

- Provider de deploy: Vercel.
- Projeto Vercel: BLOCKED. A conta Vercel autenticada nao possui projeto Rick Travel linkado.
- Banco staging: BLOCKED ate provisionamento externo.
- Dominio/subdominio de staging: BLOCKED. A conta Vercel autenticada nao possui dominios cadastrados.
- Credenciais Mercado Pago sandbox: BLOCKED.
- Remetente/dominio Resend: BLOCKED ate configuracao externa.

## Decisao de dominio

- Previews tecnicos continuam em `.vercel.app`.
- Staging real deve usar subdominio proprio dedicado: `staging.<dominio-do-projeto>`.
- Producao futura fica separada: `app.<dominio-do-projeto>` ou dominio principal.
- Nao promover producao nesta fase.

## Variaveis obrigatorias

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `MP_ACCESS_TOKEN`

## Variaveis recomendadas

- `MP_WEBHOOK_SECRET`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`
- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`

## Preflight

```bash
npm run check:env -- --target=staging
npm run check:db
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Quando todas as variaveis de staging estiverem configuradas:

```bash
npm run preflight:staging
```

## Healthcheck

- `/api/health` valida apenas app.
- `/api/health?deep=1` valida app e conexao com banco.

O healthcheck profundo nao expoe secrets nem connection string.

## Deploy path recomendado

1. Criar staging com banco PostgreSQL isolado.
2. Configurar env vars de staging pelo painel do provider.
3. Rodar migrations contra staging.
4. Rodar preflight.
5. Configurar webhook Mercado Pago sandbox para `/api/payments/webhook`.
6. Validar healthcheck app e banco.
7. Validar smoke publico, auth, reserva pendente, Pix sandbox e email.

## Vercel - execucao manual bloqueada

Pre-condicoes externas:

1. Criar/importar o projeto `rick-travel` na Vercel a partir de `devricardo90/rick-travel`.
2. Cadastrar o dominio do projeto na Vercel.
3. Criar o subdominio `staging.<dominio-do-projeto>` e apontar DNS conforme instrucoes da Vercel.
4. Configurar as variaveis de staging/preview no projeto Vercel.
5. Garantir banco PostgreSQL isolado para staging.

Depois das pre-condicoes:

```bash
npm run preflight:staging
npx vercel pull --yes --environment=preview
npx vercel build
npx vercel deploy --prebuilt
```

Validar:

```bash
curl https://staging.<dominio-do-projeto>/api/health
curl https://staging.<dominio-do-projeto>/api/health?deep=1
```
