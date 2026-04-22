# Resume Pack - Rick Travel

## Produto

Rick Travel e uma plataforma web de turismo para venda/reserva de passeios no Rio de Janeiro com guia credenciado Cadastur.

## Stack

- Frontend: Next.js 16.2.4 App Router, React 19, TypeScript, Tailwind 4, Radix, lucide, motion/GSAP.
- Backend: Next API routes/server actions, services em `lib/services`.
- Banco: PostgreSQL via Prisma.
- Auth: Better Auth.
- I18n: next-intl com PT, EN, ES, SV.
- Pagamento: Mercado Pago Pix.
- Email: Resend.
- Analytics: tabela propria `AnalyticsEvent`.
- Testes: Vitest e Playwright configurados; E2E roda serializado para estabilidade.

## Estado tecnico real

Funcionando por evidencia:

- `npm.cmd run check:env -- --target=local`: PASS.
- `npm.cmd run check:db`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run test`: PASS com 15 testes.
- `npm.cmd run test:e2e`: PASS com 5/5.

Pendente por evidencia:

- `npm audit` ainda reporta 3 vulnerabilidades moderadas em cadeia Prisma dev tooling.
- `npm.cmd run check:env -- --target=staging` bloqueia corretamente sem envs reais de staging.
- Mercado Pago externo e staging/producao continuam UNKNOWN/BLOCKED.

## Decisoes de dominio

- Booking nasce pendente e nao pago.
- Confirmacao depende de pagamento.
- Services concentram regra de negocio.
- Admin exige role `ADMIN`.
- Conteudo localizado tem fallback em PT.
- Mercado Pago e o gateway atual para Pix.

## Dados faltantes para dominar o projeto Rick Travel

### Produto

- Persona primaria.
- MVP comercial fechado.
- Prioridade entre reserva online e venda assistida por WhatsApp.
- Roadmap de features futuras.
- Metricas de sucesso.

### Engenharia

- Provider de deploy.
- Banco staging/producao.
- Observabilidade.
- Rotacao/governanca final de segredos.
- Janela controlada para Prisma audit.

### Operacao

- Dominio.
- Ambiente staging.
- Ambiente producao.
- Politica de release.
- Backup do banco.
- Monitoramento e alertas.
- Custo esperado.

## Plano ate deploy

### Fase 1 - Entendimento e estabilizacao

- Reconciliar `package.json`. DONE.
- Remover duplicatas `(2)` com criterio. DONE.
- Criar `.env.example`. DONE.
- Congelar Node. DONE.
- Typecheck, lint, build e unit tests verdes. DONE.
- Status final: REVIEW, por audit residual e necessidade de staging real.

### Fase 2 - Higiene operacional e staging

- Governanca de secrets. DONE.
- E2E autenticado. DONE.
- Classificacao audit Prisma. DONE/REVIEW.
- Checklist/preflight de staging. DONE.
- Provider de deploy. BLOCKED.
- Banco staging. BLOCKED.
- Env vars staging. BLOCKED.
- Smoke tests de staging. BLOCKED ate ambiente existir.

### Fase 3 - Staging real

- Escolher provider.
- Criar banco staging.
- Configurar env vars.
- Rodar `npm run preflight:staging`.
- Validar `/api/health` e `/api/health?deep=1`.
- Configurar Mercado Pago sandbox e Resend staging.
