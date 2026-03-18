# Rick Travel

Plataforma de turismo em `Next.js App Router` com `Prisma + PostgreSQL`, autenticacao com `Better Auth`, i18n com `next-intl`, reservas, pagamentos Pix com Mercado Pago e painel admin operacional.

## Estado Atual

O projeto ja tem:

- catalogo publico de passeios
- reservas autenticadas em `/reservas`
- painel admin para viagens, agendas, reservas e contatos
- fluxo de pagamento com `booking` pendente e confirmacao por webhook
- analytics de funil e origem de trafego
- testes unitarios com `Vitest`
- testes E2E com `Playwright`

## Ponto Atual do Desenvolvimento

Status consolidado:

- risco operacional principal ja tratado
- arquitetura ja consolidada em `services`
- operacao admin ja fortalecida
- UX do pagamento melhorada com atualizacao automatica em `/reservas`

Ponto pausado para retomar amanha:

- fechamento externo do Mercado Pago
- configurar credenciais reais
- configurar webhook publico
- validar fluxo Pix ponta a ponta fora do ambiente local

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Prisma`
- `PostgreSQL`
- `Better Auth`
- `next-intl`
- `Tailwind CSS`
- `Mercado Pago`
- `Vitest`
- `Playwright`

## Execucao Local

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Variaveis Importantes

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET` opcional

## Documentos de Referencia

- `ROADMAP_DESENVOLVIMENTO.md`: visao do roadmap e status por fase
- `IMPLEMENTACAO_LOGICA.md`: historico tecnico detalhado de cada etapa
- `MERCADO_PAGO_SETUP.md`: configuracao externa do Pix e webhook
- `analysis_and_growth_plan.md`: analise macro do produto e proximos blocos

## Estrutura Simplificada

```text
app/
components/
lib/
prisma/
tests/
e2e/
middleware.ts
```

## Proximo Passo Quando Retomarmos

Fechar a integracao externa do Mercado Pago em producao ou homologacao, porque esse e o ultimo ponto relevante do bloco de risco operacional.
