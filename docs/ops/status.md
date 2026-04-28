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
- decisao Admin Discussion Gate: B) Reconstruir Admin MVP minimo e seguro;
- Mercado Pago continua fora do escopo atual.

Fase 1 permanece: REVIEW.

## Estado reconstruido

Rick Travel e uma plataforma web de turismo para tours no Rio de Janeiro, com vitrine publica, reserva autenticada, i18n e analytics interno.

O projeto nao esta mais na etapa de bloqueio de build nem na etapa de preparo de staging. O estado real agora e de publicacao tecnica concluida, com foco operacional em estabilizacao pos-deploy e reconstrucao controlada do painel admin.

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
- Remoto `origin/main` atualizado ate `2ea0324`.
- RT-011.8: runbook minimo criado em `docs/ops/release-rollback-runbook.md`.
- RT-012A DONE remoto: risco de bootstrap ADMIN removido; commit `128e095`.
- RT-012B DONE remoto: admin e2e neutralizado; commit `2ea0324`.
- RT-013B DONE remoto: esqueleto de protecao de rotas do novo Admin MVP; commit `be7f914`.
- RT-013C DONE: listagem de reservas somente leitura implementada no Admin MVP.
- Working tree sujo com alteracoes da RT-013C.
- Nenhuma migration/deploy/seed executado.

## Novo status geral do projeto

- Build: estabilizado.
- Publicacao: MVP publico acessivel em `https://rick-travel.vercel.app`.
- Runtime inicial: validado com alias publico e healthchecks `200`.
- Admin: em reconstrucao controlada (RT-013A/B/C concluidas).
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

## Foco atual

### Curto prazo

- concluir RT-013C (Bookings Read-Only);
- iniciar RT-013D (Contacts Read-Only);
- consolidar checklist de estabilizacao pos-deploy do MVP publico.

### Medio prazo

- fortalecer observabilidade minima do ambiente publicado;
- revisar janela controlada para o residual de `npm audit` em tooling Prisma.

### Continua congelado

- integracao externa real do Mercado Pago;
- qualquer reabertura de escopo comercial ou operacional alem do MVP publico atual.

## Riscos remanescentes

- P1: estabilizacao pos-deploy ainda depende de evidencias operacionais continuas no ambiente publicado.
- P1: o MVP publico esta acessivel, mas o catalogo atual nao exibe inventario porque nao ha trips publicadas no ambiente validado.
- P1: `npm audit` residual em Prisma dev tooling segue pendente para janela controlada.
- P1: a credencial de bootstrap ADMIN removida deve ser considerada potencialmente exposta; recomenda-se rotacao manual da senha em qualquer ambiente onde tenha sido usada.
- P2: reabrir Mercado Pago agora ampliaria escopo sem justificativa operacional desta fase.
