# Resume Pack - Rick Travel

## Produto

Rick Travel e uma plataforma web de turismo para venda/reserva de passeios no Rio de Janeiro com guia credenciado Cadastur.

Proposta atual evidenciada: permitir que turistas descubram tours, reservem online, paguem via Pix e recebam atendimento/apoio comercial; admin gerencia passeios, agendas, reservas, contatos e abandono.

ASSUMPTION: persona primaria inclui turistas nacionais e internacionais interessados em tours guiados no Rio.

UNKNOWN: priorizacao comercial oficial, canais de aquisicao, metricas de sucesso e modelo de suporte.

## Stack

- Frontend: Next.js 16.2.4 App Router, React 19, TypeScript, Tailwind 4, Radix, lucide, motion/GSAP.
- Backend: Next API routes/server actions, services em `lib/services`.
- Banco: PostgreSQL via Prisma.
- Auth: Better Auth.
- I18n: next-intl com PT, EN, ES, SV.
- Pagamento: Mercado Pago Pix.
- Email: Resend.
- Analytics: tabela propria `AnalyticsEvent`.
- Testes: Vitest e Playwright configurados no package canonico.

## Estado tecnico real

O repositorio foi estabilizado na Fase 1 para a trilha minima de qualidade, mas ainda nao deve ir a deploy sem Fase 2.

Funcionando por evidencia:

- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run test`: PASS com 15 testes.
- E2E publico: 3 testes passaram.

Pendente por evidencia:

- E2E autenticado ainda falha em login/helper ou servidor dev existente.
- `npm audit` ainda reporta 3 vulnerabilidades moderadas em cadeia Prisma dev tooling.
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

Respondido pelo projeto:

- Produto e turismo/tours no Rio.
- Fluxos principais: descobrir tour, reservar, pagar Pix, acompanhar reserva, contato/WhatsApp.

Precisa ser definido pelo owner:

- Persona primaria.
- MVP comercial fechado.
- Prioridade entre reserva online e venda assistida por WhatsApp.
- Roadmap de features futuras.
- Metricas de sucesso.

### Design/UX

Respondido pelo projeto:

- Existem paginas publicas e componentes de UI.
- I18n em quatro idiomas.
- Assets e videos em `public`.

Precisa ser definido pelo owner:

- Identidade visual final.
- Criterios de acessibilidade.
- Fluxos mobile prioritarios.
- Conteudo final por idioma.
- Padrao visual oficial/design system.

### Engenharia

Respondido pelo projeto:

- Stack atual identificada.
- Banco e modelos existem.
- Auth, payment, email e analytics existem no codigo.
- Package canonico definido.

Precisa ser definido/resolvido:

- Provider de deploy.
- Banco staging/producao.
- Observabilidade.
- Rotacao/governanca de segredos.
- E2E autenticado.
- Audit moderado Prisma.

### Operacao

Respondido pelo projeto:

- Setup local usa Postgres Docker em `localhost:5433`.
- Mercado Pago precisa webhook publico.

Precisa ser definido pelo owner:

- Dominio.
- Ambiente staging.
- Ambiente producao.
- Politica de release.
- Backup do banco.
- Monitoramento e alertas.
- Custo esperado.

### Comercial/negocio

Respondido pelo projeto:

- Venda de tours/reservas.
- WhatsApp e contato existem como canais.
- Analytics de funil existe.

Precisa ser definido pelo owner:

- Monetizacao detalhada.
- Politica de cancelamento/reembolso.
- CRM.
- Canais de aquisicao.
- Retencao e suporte.
- SLAs de atendimento.

## Plano ate deploy

### Fase 1 - Entendimento e estabilizacao

- Reconciliar `package.json`. DONE.
- Remover duplicatas `(2)` com criterio. DONE para duplicatas textuais e assets starter.
- Criar `.env.example`. DONE.
- Congelar Node. DONE em `.nvmrc`.
- Typecheck, lint, build e unit tests verdes. DONE.
- E2E autenticado. REVIEW.

### Fase 2 - Higiene operacional e staging

- Governanca de secrets.
- Provider de deploy.
- Banco staging.
- Env vars staging.
- Smoke tests de staging.

### Fase 3 - MVP funcional

- Validar catalogo, detalhe, auth, reserva e minhas reservas.
- Validar admin basico.
- Validar banco limpo com migrations/seed.
- Validar pagamento sandbox.

### Fase 4 - Qualidade

- Estabilizar E2E autenticado.
- Revisar audit moderado do Prisma.
- Validar autorizacao, erros, logs e webhooks.

### Fase 5 - Deploy

- Criar staging.
- Configurar env vars.
- Configurar Mercado Pago webhook.
- Rodar checklist pos deploy.
- Promover para producao.
