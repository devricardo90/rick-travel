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
- Provider de staging: Vercel.
- Projeto Vercel Rick Travel: BLOCKED; `npx.cmd vercel project ls` nao lista o projeto.
- Dominio de staging: BLOCKED; `npx.cmd vercel domains ls` retorna 0 dominios.
- Auth staging: `BETTER_AUTH_URL` e incorporado a `trustedOrigins` quando definido, preservando localhost.

Pendente por evidencia:

- `npm audit` ainda reporta 3 vulnerabilidades moderadas em cadeia Prisma dev tooling.
- `npm.cmd run check:env -- --target=staging` bloqueia corretamente sem envs reais de staging.
- Mercado Pago externo, banco staging, dominio staging e producao continuam BLOCKED por acoes externas.

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
- Provider de deploy definido na Fase 3: Vercel.
- Banco staging. BLOCKED.
- Env vars staging. BLOCKED.
- Smoke tests de staging. BLOCKED ate ambiente existir.

### Fase 3 - Staging real

- Provider Vercel. DONE.
- Criar/importar projeto Rick Travel na Vercel. BLOCKED.
- Cadastrar dominio proprio e `staging.<dominio-do-projeto>`. BLOCKED.
- Criar banco staging. BLOCKED.
- Configurar env vars. BLOCKED.
- Compatibilizar Better Auth com `BETTER_AUTH_URL` em staging. DONE.
- Rodar `npm run preflight:staging`.
- Validar `/api/health` e `/api/health?deep=1`.
- Configurar Mercado Pago sandbox e Resend staging.
