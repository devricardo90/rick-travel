# Resume Pack - Rick Travel

## Produto

Rick Travel e uma plataforma web de turismo para venda/reserva de passeios no Rio de Janeiro com MVP publico ja deployado.

## Stack

- Frontend: Next.js 16.2.4 App Router, React 19, TypeScript, Tailwind 4, Radix, lucide, motion/GSAP.
- Backend: Next API routes/server actions, services em `lib/services`.
- Banco: PostgreSQL via Prisma.
- Auth: Better Auth.
- I18n: next-intl com PT, EN, ES, SV.
- Pagamento: Mercado Pago Pix no repositorio, fora do escopo atual.
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
- Deploy tecnico concluido.
- MVP publico publicado na Vercel.
- Runtime inicial validado ate o ponto atual.

Pendente por evidencia:

- estabilizacao pos-deploy do ambiente publicado;
- `npm audit` ainda reporta 3 vulnerabilidades moderadas em cadeia Prisma dev tooling;
- admin continua fora do escopo atual;
- Mercado Pago continua fora do escopo atual.

## Decisoes de dominio

- Booking nasce pendente e nao pago.
- Confirmacao depende de pagamento.
- Services concentram regra de negocio.
- Admin exige role `ADMIN`, mas nao faz parte do foco atual.
- Conteudo localizado tem fallback em PT.
- Mercado Pago nao deve ser reaberto nesta fase sem justificativa.

## Dados faltantes para dominar o projeto Rick Travel

### Produto

- Persona primaria.
- MVP comercial fechado.
- Prioridade entre reserva online e venda assistida por WhatsApp.
- Roadmap de features futuras.
- Metricas de sucesso.

### Engenharia

- rotina de observabilidade do ambiente publicado;
- politica de release/rollback pos-publicacao;
- rotacao/governanca final de segredos;
- janela controlada para Prisma audit.

### Operacao

- checklist curta de smoke pos-deploy;
- monitoramento e alertas;
- backup do banco;
- custo esperado.

## Plano da fase atual

### Curto prazo

- estabilizar o MVP publico ja deployado;
- rodar smoke operacional focado no fluxo publico;
- revisar logs/healthchecks/erros do runtime publicado;
- registrar apenas gaps reais observados apos a publicacao.

### Medio prazo

- fortalecer observabilidade minima;
- formalizar rotina de release e rollback;
- tratar residual de `npm audit` em janela controlada.

### Congelado

- admin;
- Mercado Pago;
- ampliacao de escopo comercial/operacional fora da estabilizacao pos-deploy.
