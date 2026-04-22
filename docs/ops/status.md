# Status Operacional - Rick Travel

Data: 2026-04-22

## Protocolo Rick

Fase atual: Fase 1 - Estabilizacao da Base.

Status da fase: REVIEW.

Evidencia minima coletada:

- Estrutura real do repositorio: `app`, `components`, `lib`, `prisma`, `tests`, `e2e`, `docs`, `public`.
- Stack real: `package.json`, `prisma/schema.prisma`, `next.config.ts`, `playwright.config.ts`, `vitest.config.ts`.
- Documentacao existente: `README.md`, `docs/README.md`, `docs/ROADMAP_DESENVOLVIMENTO.md`, `docs/IMPLEMENTACAO_LOGICA.md`, `docs/MERCADO_PAGO_SETUP.md`, `docs/analysis_and_growth_plan.md`.
- Validacoes finais: lint, typecheck, build e unit tests passaram.

## Estado reconstruido

Rick Travel e uma plataforma web de turismo para tours no Rio de Janeiro, com vitrine publica, reserva autenticada, pagamento Pix via Mercado Pago, painel admin, i18n e analytics interno.

O codigo indica um app Next.js App Router com Prisma/PostgreSQL, Better Auth, next-intl, componentes React, services de dominio e rotas API.

## O que existe

- Catalogo publico de tours.
- Paginas publicas localizadas: home, tours, detalhe, reservas, contato, quem somos.
- Auth por email/senha com Better Auth.
- Painel admin para dashboard, tours, agendas, bookings e contatos.
- Modelos Prisma para usuarios, sessoes, trips, schedules, bookings, payments, analytics, emails e contatos.
- Integracao Mercado Pago Pix implementada no codigo.
- Webhook de pagamento implementado.
- Email transacional via Resend implementado.
- Analytics interno em banco.
- Testes unitarios e E2E presentes como arquivos.

## Fase 1 - Problemas tratados

- P0: `package.json` ativo nao declarava scripts/dependencias usadas por testes e codigo. Acao: package ativo mantido como canonico e ampliado com scripts `typecheck`, `test`, `test:e2e`, `optimize-images` e dependencias necessarias.
- P0: build bloqueado por `next/font/google`. Acao: removida dependencia de fonte remota e adotadas fontes de sistema em CSS.
- P0: rota raiz `app/page.tsx` sem root layout quebrava build. Acao: removida rota raiz duplicada; rotas localizadas permanecem como entrada real do app.
- P0: vulnerabilidade critica em `next@16.0.1`. Acao: atualizado para `next@16.2.4` e `eslint-config-next@16.2.4`.
- P1: typecheck carregava artefatos `.next` duplicados. Acao: limpeza estrutural, build regenerado e typecheck verde.
- P1: scripts/test runners ausentes. Acao: instalados `vitest` e `@playwright/test`.
- P1: residuos e duplicatas `(2)` em configs/package/assets. Acao: duplicatas textuais e assets starter removidos; `.gitignore` atualizado.
- P1: segredos reais em `.env` local. Acao: criado `.env.example`; valores reais nao foram expostos.

## Estado de verificacao

- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox; dentro do sandbox falhava por `spawn EPERM`.
- `npm.cmd run test`: PASS fora do sandbox; 4 arquivos, 15 testes.
- `npm.cmd run test:e2e`: PARTIAL. 3 testes publicos passaram; 2 testes autenticados falharam em login/helper quando executados contra servidor dev existente.
- `npm.cmd audit --audit-level=moderate`: FAIL. Restam 3 vulnerabilidades moderadas ligadas a `prisma`/`@prisma/dev`; `npm audit fix --force` sugere mudanca breaking.

## Riscos remanescentes

- P1: E2E autenticado ainda nao esta verde.
- P1: `npm audit` ainda reporta 3 vulnerabilidades moderadas em cadeia Prisma dev tooling.
- P1: segredos locais precisam de governanca e possivel rotacao antes de staging/producao.
- P2: webhook Mercado Pago sem validacao real em ambiente publico impede fechamento comercial, mas nao pertence a Fase 1.

## Decisoes que nao devem ser quebradas

- Reserva nasce `PENDING` e `UNPAID`.
- Booking so vira `CONFIRMED` apos evento confiavel de pagamento.
- Auth/admin deve passar por Better Auth e checagens centralizadas.
- Regras de dominio devem ficar em `lib/services`.
- Conteudo multilanguage usa JSON por locale com fallback em PT.
- Tour tecnico E2E deve ficar oculto da vitrine publica.
