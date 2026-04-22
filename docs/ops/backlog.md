# Backlog Canonico - Protocolo Rick

Estados permitidos: READY, IN_PROGRESS, REVIEW, DONE, BLOCKED.

## RT-001 Descoberta e contexto do produto

Estado: DONE

Objetivo: consolidar visao de produto, contexto tecnico e operacao real.

Tarefas:

- RT-001.1 Inventariar docs, configs, rotas, modelos e scripts. Estado: DONE.
- RT-001.2 Separar evidencias reais de assumptions/unknowns. Estado: DONE.
- RT-001.3 Validar decisoes de negocio com owner. Estado: READY.

Criterios de aceite: status, backlog, handoff, resume pack e matriz de versoes existem e refletem o repositorio.
Dependencias: nenhuma.
Risco: medio.
Evidencia esperada: `docs/ops/status.md`, `docs/ops/resume-pack.md`.

## RT-002 Arquitetura base

Estado: REVIEW

Objetivo: manter arquitetura Next + services + Prisma consistente.

Tarefas:

- RT-002.1 Confirmar qual `package.json` e fonte de verdade. Estado: DONE.
- RT-002.2 Resolver duplicatas `(2)` sem apagar contexto valido. Estado: DONE.
- RT-002.3 Corrigir typecheck global. Estado: DONE.
- RT-002.4 Manter build sem dependencia de fonte remota. Estado: DONE.
- RT-002.5 Revisar E2E autenticado remanescente. Estado: READY.

Criterios de aceite: lint, typecheck, build e unit tests verdes.
Dependencias: RT-001.
Risco: medio.
Evidencia esperada: comandos verdes e package canonico.

## RT-003 Ambiente local

Estado: REVIEW

Objetivo: garantir setup local reproduzivel.

Tarefas:

- RT-003.1 Criar/atualizar `.env.example` sem segredos. Estado: DONE.
- RT-003.2 Documentar uso de `npm.cmd`/`npx.cmd` no Windows. Estado: DONE.
- RT-003.3 Confirmar fluxo Docker PostgreSQL em `localhost:5433`. Estado: READY.
- RT-003.4 Congelar Node em `.nvmrc`. Estado: DONE.

Criterios de aceite: novo dev consegue subir app com Postgres local e Prisma.
Dependencias: RT-002.
Risco: medio.
Evidencia esperada: healthcheck e dev server ok.

## RT-004 Autenticacao

Estado: READY

Objetivo: validar auth usuario/admin.

Tarefas:

- RT-004.1 Validar login/registro com Better Auth. Estado: READY.
- RT-004.2 Validar protecao de `/reservas` e `/admin`. Estado: READY.
- RT-004.3 Revisar rotas debug para ambiente nao desenvolvimento. Estado: READY.

Criterios de aceite: usuarios anonimos nao acessam areas privadas; admin comum nao executa actions restritas.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: E2E auth verde.

## RT-005 Base de dados

Estado: READY

Objetivo: estabilizar Prisma/PostgreSQL.

Tarefas:

- RT-005.1 Validar migrations em banco limpo. Estado: READY.
- RT-005.2 Criar seed controlado para dev/E2E. Estado: READY.
- RT-005.3 Validar indices e integridade para booking/schedule/payment. Estado: READY.

Criterios de aceite: `prisma migrate deploy` e seed rodam em ambiente limpo.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: banco local recriado e healthcheck ok.

## RT-006 Fluxos principais do app

Estado: READY

Objetivo: validar fluxo publico ate reserva.

Tarefas:

- RT-006.1 Home/listagem/detalhe de tour. Estado: READY.
- RT-006.2 Reserva autenticada com agenda/capacidade. Estado: READY.
- RT-006.3 Minhas reservas com status e polling. Estado: READY.

Criterios de aceite: usuario cria reserva `PENDING/UNPAID` e visualiza status correto.
Dependencias: RT-004, RT-005.
Risco: alto.
Evidencia esperada: E2E booking verde.

## RT-007 Painel/admin

Estado: READY

Objetivo: validar rotina operacional.

Tarefas:

- RT-007.1 Dashboard admin. Estado: READY.
- RT-007.2 CRUD tours e agenda. Estado: READY.
- RT-007.3 Bookings e contatos. Estado: READY.
- RT-007.4 Recuperacao de abandono. Estado: READY.

Criterios de aceite: admin consegue operar tours, agendas, reservas e contatos sem acesso indevido.
Dependencias: RT-004, RT-005.
Risco: medio.
Evidencia esperada: smoke admin e E2E admin.

## RT-008 Integracoes

Estado: BLOCKED

Objetivo: fechar integracoes externas reais.

Tarefas:

- RT-008.1 Mercado Pago sandbox: token, Pix, webhook publico. Estado: BLOCKED.
- RT-008.2 Resend: dominio/remetente e email de confirmacao. Estado: READY.
- RT-008.3 MyMemory/traducao: validar limite/fallback. Estado: READY.
- RT-008.4 WhatsApp: confirmar numero e mensagem comercial. Estado: READY.

Criterios de aceite: Pix real confirma booking via webhook e email e enviado.
Dependencias: credenciais e dominio/tunnel.
Risco: alto.
Evidencia esperada: pagamento ponta a ponta em sandbox.

## RT-009 Testes

Estado: DONE

Objetivo: recuperar suite automatizada.

Tarefas:

- RT-009.1 Restaurar `vitest` e `@playwright/test` no package ativo. Estado: DONE.
- RT-009.2 Rodar unit tests. Estado: DONE.
- RT-009.3 Rodar E2E publico. Estado: DONE.
- RT-009.4 Rodar E2E autenticado. Estado: DONE.
- RT-009.5 Adicionar scripts `test` e `test:e2e`. Estado: DONE.

Criterios de aceite: lint, typecheck, build, unit e E2E verdes.
Dependencias: RT-002.
Risco: medio.
Evidencia esperada: `npm.cmd run test:e2e` 5/5 verde.

## RT-010 Deploy/staging

Estado: BLOCKED

Objetivo: preparar ambiente de homologacao.

Tarefas:

- RT-010.1 Definir provider de deploy. Estado: DONE.
- RT-010.2 Definir banco staging. Estado: BLOCKED.
- RT-010.3 Configurar env vars staging. Estado: BLOCKED.
- RT-010.4 Resolver build offline/fonts. Estado: DONE.
- RT-010.5 Criar checklist operacional de staging. Estado: DONE.
- RT-010.6 Criar preflight de staging. Estado: DONE.
- RT-010.7 Criar healthcheck profundo com DB. Estado: DONE.
- RT-010.8 Criar/importar projeto Rick Travel na Vercel. Estado: BLOCKED.
- RT-010.9 Cadastrar dominio proprio e subdominio `staging.<dominio-do-projeto>`. Estado: BLOCKED.
- RT-010.10 Validar staging publico com `/api/health`, `/api/health?deep=1` e auth. Estado: BLOCKED.

Criterios de aceite: staging publica com healthcheck, auth, DB e webhook testaveis.
Dependencias: RT-002, RT-003, RT-008.
Risco: medio.
Evidencia esperada: checklist, preflight e healthcheck prontos; URL staging e smoke test dependem de projeto Vercel, dominio, banco e envs externos.

## RT-011 Producao

Estado: BLOCKED

Objetivo: publicar com dominio e credenciais reais.

Tarefas:

- RT-011.1 Definir dominio. Estado: BLOCKED.
- RT-011.2 Configurar env vars producao. Estado: BLOCKED.
- RT-011.3 Configurar Mercado Pago producao. Estado: BLOCKED.
- RT-011.4 Checklist release. Estado: READY.

Criterios de aceite: release aprovado com rollback conhecido.
Dependencias: RT-010.
Risco: alto.
Evidencia esperada: release notes e validacao pos deploy.

## RT-012 Observabilidade

Estado: READY

Objetivo: ter visibilidade minima.

Tarefas:

- RT-012.1 Healthcheck com banco. Estado: READY.
- RT-012.2 Logs estruturados para webhook/pagamento. Estado: READY.
- RT-012.3 Monitoramento de erro. Estado: BLOCKED.

Criterios de aceite: falhas criticas aparecem em logs/alertas.
Dependencias: provider de deploy.
Risco: medio.
Evidencia esperada: painel/logs acessiveis.

## RT-013 Seguranca

Estado: REVIEW

Objetivo: reduzir risco antes do deploy.

Tarefas:

- RT-013.1 Rotacionar segredos locais se necessario. Estado: READY.
- RT-013.2 Criar `.env.example`. Estado: DONE.
- RT-013.3 Revisar webhook secret Mercado Pago. Estado: READY.
- RT-013.4 Revisar dados sensiveis em logs. Estado: READY.
- RT-013.5 Classificar audit moderado remanescente em Prisma dev tooling. Estado: DONE.
- RT-013.6 Resolver audit moderado remanescente em janela controlada. Estado: READY.
- RT-013.7 Documentar contrato de secrets por ambiente. Estado: DONE.

Criterios de aceite: nenhum segredo versionado; webhook validado; rotas privadas protegidas.
Dependencias: RT-003.
Risco: alto.
Evidencia esperada: git clean sem env, checklist seguranca.

## RT-014 UX/UI polish

Estado: READY

Objetivo: melhorar conversao sem mexer no core.

Tarefas:

- RT-014.1 Revisar responsividade dos fluxos publicos. Estado: READY.
- RT-014.2 Revisar acessibilidade basica. Estado: READY.
- RT-014.3 Validar assets reais e performance. Estado: READY.

Criterios de aceite: smoke visual desktop/mobile sem overlap critico.
Dependencias: core estavel.
Risco: medio.
Evidencia esperada: screenshots e checklist UX.

## RT-015 Conteudo/comercial

Estado: READY

Objetivo: consolidar proposta comercial e canais.

Tarefas:

- RT-015.1 Definir persona primaria. Estado: BLOCKED.
- RT-015.2 Definir MVP comercial e metricas. Estado: BLOCKED.
- RT-015.3 Confirmar monetizacao e operacao de suporte. Estado: BLOCKED.

Criterios de aceite: jornada e metricas aprovadas pelo owner.
Dependencias: input de negocio.
Risco: medio.
Evidencia esperada: documento de produto validado.
