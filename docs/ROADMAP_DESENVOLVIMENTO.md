# Roadmap de Desenvolvimento - Rick Travel

## Objetivo

Evoluir o projeto de uma base funcional de vitrine + reservas para uma plataforma operacional confiavel, com fluxo comercial real, painel administrativo consistente e qualidade de producao.

## Diagnostico Resumido

O projeto ja possui:

- Catalogo de tours com i18n
- Autenticacao com Better Auth
- Estrutura de reservas
- Painel admin para viagens, agendas e bookings
- Persistencia com Prisma/PostgreSQL

Os principais gaps atuais sao:

- Reserva confirma sem pagamento
- Protecao de rotas incompleta fora do admin
- Regras de negocio espalhadas entre rotas, pages e server actions
- Agenda com validacoes ainda superficiais
- Traducao automatica dependente de servico externo fragil
- Baixa cobertura de testes
- Documentacao e comportamento real estao desalinhados

## Principios do Roadmap

- Primeiro corrigir risco operacional
- Depois consolidar a arquitetura
- Em seguida melhorar a operacao do admin
- So depois expandir UX, analytics e escala

## Status Atual do Roadmap

### 1. Corrigir risco operacional

Status: `quase concluido`

Ja entregue:

- reservas `PENDING` e `UNPAID`
- confirmacao por webhook
- protecao de `/reservas`
- validacoes de agenda e cancelamento
- recuperacao de abandono de checkout no admin

Pendente:

- fechamento externo do Mercado Pago com credenciais e webhook publico

### 2. Consolidar a arquitetura

Status: `concluido na base principal`

Ja entregue:

- camada `services`
- `authz` centralizado
- `DomainError`
- typecheck saneado
- camada de e-mail
- testes unitarios e E2E

### 3. Melhorar a operacao do admin

Status: `bem avancado`

Ja entregue:

- dashboard operacional
- filtros de reservas
- fila de abandono
- contatos com workflow
- agendas com ocupacao e fechamento
- publicacao de passeios

### 4. Expandir UX, analytics e escala

Status: `iniciado`

Ja entregue:

- analytics de funil
- origem de trafego
- polling automatico em `/reservas`

Pausado para depois:

- CI/CD
- observabilidade
- refinamentos extras de UX

## Fase 1 - Estabilizacao do Core

Prazo sugerido: Semana 1

### Metas

- Garantir que o fluxo de reserva nao gere confirmacoes indevidas
- Fechar brechas de autorizacao
- Padronizar validacoes criticas

### Entregas

- Alterar criacao de booking para `PENDING` por padrao
- Separar `bookingStatus` de `paymentStatus` de forma coerente
- Proteger a area `/reservas` e revisar middleware
- Adicionar checagem de permissao admin em todas as actions sensiveis
- Validar melhor agendas:
  - `startAt < endAt`
  - capacidade > 0
  - preco >= 0
  - impedir criacao de datas invalidas
- Revisar cancelamento:
  - permitir apenas ao dono ou admin
  - definir regras minimas de janela de cancelamento

### Resultado esperado

O sistema deixa de confirmar reserva cedo demais e passa a operar com regras basicas confiaveis.

## Fase 2 - Refatoracao da Regra de Negocio

Prazo sugerido: Semana 2

### Metas

- Tirar logica de negocio das rotas e paginas
- Organizar o backend para evolucao segura

### Entregas

- Criar camada `services` em `lib/services`
- Extrair servicos:
  - `booking.service.ts`
  - `trip.service.ts`
  - `schedule.service.ts`
  - `email.service.ts`
- Padronizar retornos de erro e validacao
- Reaproveitar a mesma regra entre API routes e server actions
- Centralizar verificacoes de sessao e papel do usuario

### Resultado esperado

A manutencao fica mais simples, com menos duplicacao e menor risco de regressao.

## Fase 3 - Pagamentos e Confirmacao Real

Prazo sugerido: Semana 3

### Metas

- Transformar reserva em fluxo comercial verdadeiro

### Entregas

- Escolher gateway:
  - Stripe para operacao internacional
  - Mercado Pago para foco Brasil
- Criar intento de pagamento vinculado ao booking
- Confirmar booking apenas por webhook confiavel
- Atualizar `paymentStatus` para `PAID`, `REFUNDED` ou `PARTIAL`
- Registrar falhas e retries de webhook
- Exibir status real no painel admin e na area do usuario

### Resultado esperado

Reserva passa a refletir pagamento real, reduzindo erro operacional e retrabalho manual.

## Fase 4 - Fortalecimento do Painel Admin

Prazo sugerido: Semana 4

### Metas

- Tornar o admin utilizavel no dia a dia da operacao

### Entregas

- Melhorar gestao de viagens:
  - filtros
  - busca
  - duplicar viagem
  - status de publicacao
- Melhorar gestao de agendas:
  - editar horario
  - fechar agenda
  - mostrar vagas restantes
  - bloquear exclusao com bookings ativos
- Melhorar gestao de reservas:
  - filtros por status
  - filtros por data
  - busca por tour
  - timeline simples de eventos
  - reenvio de email
- Criar visao de contatos recebidos

### Resultado esperado

O admin deixa de ser apenas base tecnica e vira ferramenta operacional.

## Fase 5 - i18n e Conteudo

Prazo sugerido: Semana 5

### Metas

- Reduzir dependencia de traducao instavel
- Melhorar governanca de conteudo

### Entregas

- Trocar traducao em tempo de cadastro por uma destas abordagens:
  - traducao assistida em background
  - edicao manual por idioma
  - integracao com API profissional
- Adicionar fallback e logs para falhas de traducao
- Revisar consistencia das mensagens em `messages/*.json`
- Garantir que titulos, descricoes e highlights sejam editaveis por idioma

### Resultado esperado

Conteudo multilíngue fica previsivel e sustentavel.

## Fase 6 - Testes e Qualidade

Prazo sugerido: Semana 6

### Metas

- Criar confianca para evoluir sem quebrar o core

### Entregas

- Configurar `Vitest` ou `Jest`
- Criar testes unitarios para:
  - criacao de booking
  - validacao de duplicidade
  - validacao de capacidade
  - calculo de preco
  - cancelamento
- Configurar `Playwright`
- Criar testes E2E:
  - cadastro e login
  - reserva de tour
  - cancelamento de reserva
  - acesso admin
- Rodar lint e testes em pipeline CI

### Resultado esperado

O projeto ganha previsibilidade e pode ser expandido com menos risco.

## Fase 7 - Produto, SEO e Conversao

Prazo sugerido: Semana 7+

### Metas

- Melhorar conversao e apresentacao comercial

### Entregas

- Refinar cards e pagina de detalhe de tour
- Adicionar provas sociais mais fortes
- Melhorar CTA para WhatsApp e contato
- Criar paginas de categorias ou colecoes de tours
- Revisar metadata, sitemap e robots
- Adicionar eventos de analytics:
  - visualizacao de tour
  - clique em reservar
  - booking iniciado
  - booking pago

### Resultado esperado

A plataforma fica mais preparada para atracao e conversao de clientes.

## Prioridade Recomendada

Ordem sugerida de execucao:

1. Fase 1 - Estabilizacao do Core
2. Fase 2 - Refatoracao da Regra de Negocio
3. Fase 3 - Pagamentos e Confirmacao Real
4. Fase 4 - Fortalecimento do Painel Admin
5. Fase 5 - i18n e Conteudo
6. Fase 6 - Testes e Qualidade
7. Fase 7 - Produto, SEO e Conversao

## Backlog Tecnico Complementar

- Atualizar README para refletir o comportamento real
- Definir env vars obrigatorias e opcionais
- Remover inconsistencias entre docs e scripts
- Revisar arquivos indevidos em `public/`
- Criar seeds de desenvolvimento
- Adicionar observabilidade basica:
  - logs estruturados
  - monitoramento de erro
  - healthcheck mais util

## Proximo Passo Recomendado

Retomada planejada:

1. Fechar configuracao externa do Mercado Pago
2. Validar webhook publico
3. Executar teste ponta a ponta do Pix real

Esse e o ponto correto para retomar amanha sem perder a ordem do roadmap.
