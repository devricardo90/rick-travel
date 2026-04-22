# Secrets e Ambientes - Rick Travel

Data: 2026-04-22

## Regra operacional

Nenhum segredo real deve ser commitado. Use `.env.example` como contrato publico de variaveis e configure valores reais no ambiente local, staging ou producao.

## Risco atual

- P1: o ambiente local possui `.env` com valores reais.
- Acao nesta fase: `.env.example` existe e `.env*` continua ignorado pelo Git.
- Acao pendente: rotacionar qualquer segredo que tenha sido compartilhado fora do ambiente local ou exposto em logs.

## Variaveis por ambiente

### Local

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY` opcional se emails reais nao forem testados.
- `MP_ACCESS_TOKEN` opcional se Pix real nao for testado.

### Staging

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET` recomendado.

### Producao

- mesmas variaveis de staging.
- usar credenciais separadas de staging.
- `BETTER_AUTH_URL` deve apontar para o dominio canonico de producao.

## Validacao

```bash
npm run check:env -- --target=local
npm run check:env -- --target=staging
npm run check:env -- --target=production
```

O validador verifica existencia, placeholders, URL de auth, connection string PostgreSQL e tamanho minimo do segredo de auth.
