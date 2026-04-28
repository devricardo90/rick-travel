# Status Operacional - Rick Travel

Data: 2026-04-28

## Protocolo Rick

Fase atual: Fase 3 - Operacao publica controlada do MVP.

Status da fase: IN_PROGRESS.

Leitura objetiva da fase:

- deploy tecnico concluido;
- MVP publico publicado na Vercel;
- build estabilizado;
- runtime inicial validado ate o ponto atual;
- admin continua fora do escopo atual;
- Mercado Pago continua fora do escopo atual.

Fase 1 permanece: REVIEW.

## Estado reconstruido

Rick Travel e uma plataforma web de turismo para tours no Rio de Janeiro, com vitrine publica, reserva autenticada, i18n e analytics interno.

O projeto nao esta mais na etapa de bloqueio de build nem na etapa de preparo de staging. O estado real agora e de publicacao tecnica concluida, com foco operacional em estabilizacao pos-deploy.

## Evidencia operacional consolidada

- `npm.cmd run check:env -- --target=local`: PASS.
- `npm.cmd run check:db`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run typecheck`: PASS.
- `npm.cmd run build`: PASS fora do sandbox.
- `npm.cmd run test`: PASS, 4 arquivos, 15 testes.
- `npm.cmd run test:e2e`: PASS, 5/5.
- `npx.cmd vercel inspect rick-travel.vercel.app`: PASS; alias canonico agora aponta para `dpl_4vxzDoDd7Du1qLxtTBbyPgYFb36F`, status `Ready`, projeto `rick-travel`.
- `https://rick-travel.vercel.app`: PASS `200`.
- `https://rick-travel.vercel.app/api/health`: PASS `200`, body `{\"ok\":true,\"service\":\"rick-travel\",\"checks\":{\"app\":\"ok\"}}`.
- `https://rick-travel.vercel.app/api/health?deep=1`: PASS `200`, body `{\"ok\":true,\"service\":\"rick-travel\",\"checks\":{\"app\":\"ok\",\"database\":\"ok\"}}`.
- `npx.cmd vercel logs dpl_EALNcKfyquenXcV5j6voQBgeS86C --scope devricardo90s-projects --no-follow --limit 50 --json`: amostra sem erro runtime explicito; requests publicos observados com `200`.
- `npx.cmd vercel deploy --prod --yes --scope devricardo90s-projects`: PASS; hotfix minima de canonical publicada e aliased em `https://rick-travel.vercel.app`.
- Slice de estabilizacao publicado em `main`.
- `git pull --rebase origin main`: PASS, sem conflito.
- `git push origin main`: PASS.
- Remoto `origin/main` atualizado ate `cd14311`.
- RT-011.8: runbook minimo criado em `docs/ops/release-rollback-runbook.md`; validacoes executadas em 2026-04-28: `npm.cmd run lint` PASS com 2 warnings, `npm.cmd run typecheck` PASS, `npm.cmd run test` PASS fora do sandbox com 3 arquivos e 12 testes, `npm.cmd run build` PASS fora do sandbox.
- RT-012A: risco de bootstrap ADMIN com credencial hardcoded removido; commit `128e095 security: remove hardcoded admin bootstrap credentials` publicado em `origin/main`; validacoes: `npm.cmd run lint` PASS com 2 warnings existentes, `npm.cmd run typecheck` PASS, `npm.cmd run test` PASS fora do sandbox com 3 arquivos e 12 testes, `npm.cmd run build` PASS fora do sandbox, `git diff --check` PASS com warnings LF/CRLF.
- RT-012B: `e2e/admin.spec.ts` neutralizado com skip explicito porque admin esta congelado fora do MVP publico; nao cria `/admin`, dashboard ou credenciais; validacoes: `npx.cmd playwright test e2e/admin.spec.ts --list` lista 1 teste coletavel, `npm.cmd run lint` PASS com 2 warnings existentes, `npm.cmd run typecheck` PASS, `npm.cmd run test` PASS fora do sandbox com 3 arquivos e 12 testes, `npm.cmd run build` PASS fora do sandbox.

## Novo status geral do projeto

- Build: estabilizado.
- Publicacao: MVP publico acessivel em `https://rick-travel.vercel.app`.
- Runtime inicial: validado com alias publico e healthchecks `200`.
- Admin: implementado no codigo, mas fora do escopo da fase atual.
- Mercado Pago: implementacao existente no repositorio, mas fora do escopo da fase atual.

## Validacao publica objetiva

### Smoke do fluxo publico

- `GET /pt`: `200`.
- `GET /pt/tours`: `200`.
- `GET /pt/quem-somos`: `200`.
- `GET /pt/contato`: `200`.
- `GET /api/trips`: `200`, retorno atual `[]`.
- `GET /robots.txt`: `200`.
- `GET /sitemap.xml`: `200`.
- `robots.txt` agora publica `Sitemap: https://rick-travel.vercel.app/sitemap.xml`.
- `sitemap.xml` agora publica URLs `https://rick-travel.vercel.app/...`.
- `GET /pt/contato`: canonical e `og:url` publicados em `https://rick-travel.vercel.app/pt/contato`.

### Incidentes reais observados

- Resolvido neste slice: inconsistencia de dominio canonico publico.
  Decisao aplicada: artefatos publicos temporariamente alinhados para `https://rick-travel.vercel.app` enquanto o dominio final nao estiver operacional.
  Evidencia: `GET /robots.txt = 200`; `GET /sitemap.xml = 200`; canonical publico validado em `/pt/contato`; sem referencia a `ricktravel.com.br` em `app`/`lib`, exceto remetente de email fora deste escopo.
- Classificacao final do catalogo vazio: `EXPECTED_EMPTY_STATE`.
  Impacto: o fluxo publico esta tecnicamente saudavel, mas sem inventario para descoberta e reserva.
  Evidencia: banco local consultado com `total = 0` trips e `published = 0`; `GET /api/trips` retornou `[]`; `/pt/tours` exibiu `Nenhum passeio encontrado`.

## Foco atual

### Curto prazo

- consolidar checklist de estabilizacao pos-deploy do MVP publico;
- executar smoke operacional focado nos fluxos publicos ja expostos;
- revisar logs/healthchecks/erros do runtime publicado;
- registrar dependencia operacional de conteudo/publicacao para sair do estado de catalogo vazio;
- usar o runbook minimo de release/rollback em qualquer proxima release publica controlada.

### Medio prazo

- fortalecer observabilidade minima do ambiente publicado;
- revisar janela controlada para o residual de `npm audit` em tooling Prisma;
- formalizar rotina de release, rollback e verificacao pos-publicacao.

### Continua congelado

- escopo admin;
- integracao externa real do Mercado Pago;
- qualquer reabertura de escopo comercial ou operacional alem do MVP publico atual.

## Riscos remanescentes

- P1: estabilizacao pos-deploy ainda depende de evidencias operacionais continuas no ambiente publicado.
- P1: o MVP publico esta acessivel, mas o catalogo atual nao exibe inventario porque nao ha trips publicadas no ambiente validado.
- P1: `npm audit` residual em Prisma dev tooling segue pendente para janela controlada.
- P1: a credencial de bootstrap ADMIN removida deve ser considerada potencialmente exposta; recomenda-se rotacao manual da senha em qualquer ambiente onde tenha sido usada.
- P2: reabrir admin ou Mercado Pago agora ampliaria escopo sem justificativa operacional desta fase.

## Decisoes que nao devem ser quebradas

- Reserva nasce `PENDING` e `UNPAID`.
- Booking so vira `CONFIRMED` apos evento confiavel de pagamento.
- Auth/admin deve passar por Better Auth e checagens centralizadas.
- Regras de dominio devem ficar em `lib/services`.
- Conteudo multilanguage usa JSON por locale com fallback em PT.
- Tour tecnico E2E deve ficar oculto da vitrine publica.
- Admin continua fora do escopo atual.
- Mercado Pago continua fora do escopo atual.
