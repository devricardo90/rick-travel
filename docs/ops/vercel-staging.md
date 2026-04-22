# Vercel Staging - Rick Travel

Data: 2026-04-22

## Decisao operacional

- Provider do app: Vercel.
- Preview tecnico: URLs `.vercel.app`.
- Staging real: `staging.<dominio-do-projeto>`.
- Producao: separada, futura, fora desta fase.

## Estado atual verificado

- Vercel CLI disponivel via `npx vercel`.
- Usuario autenticado: `devricardo90`.
- Projetos listados na conta: nao ha projeto `rick-travel`.
- Dominios listados na conta: nenhum dominio cadastrado.
- `package.json` declara Node `22.x` para alinhar build Vercel com `.nvmrc`.

## Evidencias de CLI

- `npx.cmd vercel project ls`: lista apenas `eco-pickup-web` e `bio-loop-orchestrator-web`.
- `npx.cmd vercel domains ls`: retorna `0 Domains found`.

## Conclusao

Deploy de staging real esta BLOCKED por acoes externas:

- criar/importar projeto Rick Travel na Vercel;
- cadastrar dominio proprio na Vercel;
- criar/apontar `staging.<dominio-do-projeto>`;
- configurar banco PostgreSQL de staging;
- configurar env vars de staging.

## Configuracao esperada do projeto Vercel

- Framework preset: Next.js.
- Install command: `npm install`.
- Build command: `npm run build`.
- Output: padrao Next.js/Vercel.
- Node.js: 22.x, conforme `package.json` e `.nvmrc`.

## Preflight local

- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run check:db`: PASS com banco local.
- `npm.cmd test -- --run`: PASS, 4 arquivos e 15 testes.
- `npm.cmd run check:env -- --target=staging`: BLOCKED por `MP_ACCESS_TOKEN` ausente e `BETTER_AUTH_URL` local.
- `npm.cmd run preflight:staging`: BLOCKED no contrato de env staging.

## Variaveis de staging

- `DATABASE_URL`
- `BETTER_AUTH_URL=https://staging.<dominio-do-projeto>`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`

## Validacoes apos deploy

```bash
curl https://staging.<dominio-do-projeto>/api/health
curl https://staging.<dominio-do-projeto>/api/health?deep=1
```

Smoke manual:

- abrir home localizada;
- abrir listagem de tours;
- abrir login;
- autenticar usuario/admin de staging;
- criar reserva pendente em tour controlado;
- validar painel admin;
- validar checkout Pix sandbox quando Mercado Pago estiver configurado.
