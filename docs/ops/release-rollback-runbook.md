# Release/Rollback Runbook - Rick Travel

Data: 2026-04-28

## Objetivo

Formalizar a rotina minima para publicar, validar e reverter uma release publica controlada do MVP Rick Travel.

Este runbook cobre apenas o MVP publico atualmente publicado em `https://rick-travel.vercel.app`. Ele nao reabre escopo de admin, Mercado Pago, banco, migracoes, conteudo ou trips.

## Escopo da release publica controlada

Uma release publica controlada deve preservar:

- home e rotas publicas localizadas acessiveis;
- catalogo publico tecnicamente saudavel;
- healthchecks `200`;
- build, lint, typecheck e testes automatizados verdes;
- comportamento conhecido de catalogo vazio como `EXPECTED_EMPTY_STATE` enquanto nao houver trips publicaveis.

## Pre-condicoes

Antes de iniciar uma release:

- a task de release deve estar autorizada no Protocolo Rick;
- o working tree deve estar revisado com `git status --short`;
- nao deve haver mudanca nao explicada em auth, pagamento, banco, catalogo ou conteudo;
- `README.md`, `docs/ops/status.md`, `docs/ops/backlog.md` e `docs/ops/session-handoff.md` devem refletir o estado operacional atual;
- `package.json` deve ser a fonte dos scripts de validacao;
- `.env.example` deve continuar sem segredos;
- secrets reais devem permanecer fora do git;
- Mercado Pago e admin continuam fora do escopo desta fase;
- RT-011.6 permanece bloqueada enquanto nao houver conteudo/trips publicaveis ou incidente funcional real.

## Validacao local antes de publicar

Verificar os scripts reais antes de rodar comandos:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Opcional quando a release depender explicitamente de contrato de ambiente local:

```bash
npm.cmd run check:env -- --target=local
```

Nao rodar nesta rotina minima sem autorizacao explicita:

- deploy;
- migrations;
- comandos que alterem banco;
- seed ou criacao de trips/conteudo;
- testes E2E autenticados contra ambiente publico;
- reativacao de admin ou Mercado Pago.

## Publicacao

A publicacao so deve ocorrer depois das validacoes locais verdes e de uma ordem explicita de release.

Fluxo esperado:

1. Confirmar branch e diff final.
2. Confirmar que a release tem commit documental/tecnico rastreavel.
3. Publicar pelo fluxo Vercel configurado para o projeto `rick-travel`.
4. Registrar deployment, alias publico, commit e horario.
5. Executar smoke pos-deploy antes de considerar a release valida.

O alias publico operacional atual e `https://rick-travel.vercel.app`.

## Checklist pos-deploy

Validar no ambiente publicado:

```bash
curl https://rick-travel.vercel.app/api/health
curl "https://rick-travel.vercel.app/api/health?deep=1"
curl https://rick-travel.vercel.app/robots.txt
curl https://rick-travel.vercel.app/sitemap.xml
```

Verificar tambem:

- deployment na Vercel esta `Ready`;
- alias publico aponta para o deployment esperado;
- logs recentes nao mostram erro runtime critico;
- `robots.txt` aponta para `https://rick-travel.vercel.app/sitemap.xml`;
- `sitemap.xml` publica URLs sob `https://rick-travel.vercel.app`;
- rotas publicas principais respondem `200`.

## Smoke test minimo

Executar smoke publico sem login:

- abrir `https://rick-travel.vercel.app/pt`;
- abrir `https://rick-travel.vercel.app/pt/tours`;
- abrir `https://rick-travel.vercel.app/pt/quem-somos`;
- abrir `https://rick-travel.vercel.app/pt/contato`;
- chamar `https://rick-travel.vercel.app/api/trips`;
- confirmar que a pagina de tours renderiza sem erro 5xx;
- confirmar que o estado visual de catalogo vazio nao quebra navegacao publica.

## Catalogo vazio

O catalogo publico vazio deve ser interpretado como `EXPECTED_EMPTY_STATE` quando:

- `/api/trips` retorna `200` com `[]`;
- `/pt/tours` carrega normalmente;
- nao ha erro 5xx;
- nao ha evidencia de falha em filtro, query, auth publica ou banco;
- o estado operacional registrado continua sendo `0` trips totais e `0` trips publicadas.

Nesse caso, nao abrir bug de catalogo e nao criar trips para "corrigir" a release. A dependencia correta permanece conteudo/trips publicaveis.

## Quando nao prosseguir

Nao publicar ou nao promover a release se qualquer item ocorrer:

- `lint`, `typecheck`, `test` ou `build` falha;
- healthcheck app ou deep healthcheck falha sem explicacao controlada;
- diff inclui mudanca nao autorizada em pagamento, auth, banco, catalogo ou conteudo;
- ha migration pendente ou alteracao de schema sem janela propria;
- ha segredo real em arquivo versionado;
- Vercel nao aponta para o projeto `rick-travel`;
- alias publico nao pode ser confirmado;
- logs recentes mostram erro runtime critico apos deploy;
- catalogo vazio vem acompanhado de erro 5xx, excecao de query ou regressao de UI.

## Regra de rollback

Rollback deve ser iniciado quando a release publicada causar:

- indisponibilidade do app publico;
- healthcheck app ou deep healthcheck falhando;
- rotas publicas prioritarias com 5xx;
- regressao critica em navegacao publica;
- alias publico apontando para deployment incorreto;
- erro runtime critico recorrente em logs;
- qualquer mudanca indevida em auth, pagamento, banco ou catalogo.

Procedimento minimo:

1. Registrar o deployment atual, commit, horario e sintoma.
2. Identificar o ultimo deployment publico valido.
3. Reapontar o alias publico para o ultimo deployment valido pelo fluxo Vercel autorizado.
4. Reexecutar healthchecks e smoke minimo.
5. Registrar resultado em `docs/ops/status.md` ou `docs/ops/session-handoff.md`.
6. Abrir task de correcao separada apenas com o escopo do incidente.

Rollback nao deve criar conteudo, rodar migration, alterar banco ou reabrir Mercado Pago/admin.

## Evidencias obrigatorias

Para marcar uma release como valida, registrar:

- commit publicado;
- deployment/alias publico;
- data e horario da validacao;
- resultado de `npm.cmd run lint`;
- resultado de `npm.cmd run typecheck`;
- resultado de `npm.cmd run test`;
- resultado de `npm.cmd run build`;
- resultado de `/api/health`;
- resultado de `/api/health?deep=1`;
- resultado do smoke minimo;
- leitura de logs recentes;
- classificacao do catalogo, incluindo `EXPECTED_EMPTY_STATE` quando aplicavel;
- decisao final: validada, em observacao ou rollback executado.
