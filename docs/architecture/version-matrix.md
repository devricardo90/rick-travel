# Matriz de Versoes - Rick Travel

Data: 2026-04-22

## Fonte de verdade atual

Arquivo canonico: `package.json`.

Decisao da Fase 1: manter o package ativo como fonte de verdade, preservar a identidade `rick-travel`, incorporar scripts/dependencias relevantes do `package (2).json` e remover o package duplicado.

## Runtime e framework

| Item | Versao | Evidencia | Risco |
| --- | --- | --- | --- |
| Node.js | 22 | `.nvmrc` | Medio: congelado em major 22; pode ser refinado para versao exata depois. |
| Next.js | ^16.2.4 | `package.json` | Baixo/medio: atualizado para remover vulnerabilidade critica; build usa Webpack explicitamente. |
| React | 19.2.0 | `package.json` | Baixo/medio: stack moderna, depende de compatibilidade das libs. |
| React DOM | 19.2.0 | `package.json` | Baixo/medio. |
| TypeScript | ^5 | `package.json` | Baixo: typecheck passa. |

## UI e frontend

| Item | Versao | Evidencia | Risco |
| --- | --- | --- | --- |
| Tailwind CSS | ^4 | `package.json` | Medio: versao nova, exige padrao de config correto. |
| @tailwindcss/postcss | ^4 | `package.json` | Baixo. |
| Radix UI | multiplas libs 1.x/2.x | `package.json` | Baixo. |
| lucide-react | ^0.460.0 | `package.json` | Baixo. |
| motion | ^11.0.0 | `package.json` | Medio: manter congelado antes de novas animacoes. |
| gsap | ^3.12.0 | `package.json` | Baixo. |
| next-intl | ^4.0.0 | `package.json` | Baixo/medio. |
| next-themes | ^0.4.0 | `package.json` | Baixo. |

## Backend e dados

| Item | Versao | Evidencia | Risco |
| --- | --- | --- | --- |
| Prisma Client | ^7.5.0 | `package.json` | Medio: audit moderado remanescente vem de Prisma dev tooling. |
| Prisma CLI | ^7.5.0 | `package.json` devDependency | Medio: nao aplicar `npm audit fix --force` sem fase dedicada. |
| @prisma/adapter-pg | ^7.5.0 | `package.json` | Baixo/medio. |
| PostgreSQL | 16 local | `docker-compose.yml` | Baixo local; prod/staging UNKNOWN. |
| pg | ^8.18.0 | `package.json` | Baixo: dependencia usada por Prisma adapter/scripts declarada explicitamente. |
| better-auth | ^1.2.0 | `package.json` | Medio: congelar antes de staging. |
| zod | ^4.3.6 | `package.json` | Baixo. |

## Integracoes

| Item | Versao/estado | Evidencia | Risco |
| --- | --- | --- | --- |
| Mercado Pago | API REST via fetch | `lib/services/payment.service.ts` | Alto: credencial/webhook real pendente. |
| Resend | ^6.9.3 | `package.json`, `lib/resend.ts` | Medio: requer dominio/remetente validos. |
| MyMemory | via service de traducao | docs/codigo | Medio: dependencia externa fragil. |
| WhatsApp | link generator | `lib/whatsapp.ts` | Baixo/medio: numero e copy precisam validacao. |

## Qualidade

| Item | Versao/estado | Evidencia | Risco |
| --- | --- | --- | --- |
| ESLint | ^9 | `package.json` | Baixo: lint passa. |
| eslint-config-next | ^16.2.4 | `package.json` | Baixo. |
| Vitest | ^4.1.0 | `package.json`, `vitest.config.ts` | Baixo: unit tests passam. |
| Playwright | ^1.58.2 | `package.json`, `playwright.config.ts` | Medio: E2E publico passa; fluxos autenticados ainda parciais. |

## Congelamentos e decisoes

- Package ativo definido como canonico.
- Node congelado em `.nvmrc`.
- Build definido como Webpack para estabilizacao.
- Fonte remota removida do build; CSS usa fontes de sistema.
- Prisma/Better Auth/next-intl/motion ainda devem ser congelados com mais criterio antes de staging.
- Provider de deploy e versao de PostgreSQL em staging/producao continuam UNKNOWN.
