# Plano de Execucao por Sprints - Rick Travel

## Objetivo

Converter o roadmap em um backlog tecnico executavel, com ordem de implementacao, dependencias e criterio objetivo de conclusao.

## Regra de Prioridade

- `P0`: risco operacional ou financeiro
- `P1`: necessario para escalar o produto
- `P2`: ganho de produtividade, UX ou conversao

## Sprint 1 - Corrigir o Core de Reservas

Duracao sugerida: 5 dias

### Objetivo

Parar de confirmar reservas cedo demais e fechar as lacunas mais criticas de seguranca e validacao.

### Tarefas

- `P0` Alterar criacao de booking para status inicial `PENDING`
- `P0` Ajustar UI para exibir claramente diferenca entre reserva pendente, confirmada e cancelada
- `P0` Revisar fluxo de `paymentStatus` para nao induzir leitura errada no admin
- `P0` Proteger a rota `/[locale]/reservas` alem do `/admin`
- `P0` Adicionar checagem admin nas actions de agenda
- `P0` Validar agenda:
  - `startAt` obrigatoriamente menor que `endAt`
  - `capacity` maior que zero
  - `pricePerPersonCents` nao negativo
  - impedir datas passadas, se essa for a regra operacional desejada
- `P1` Revisar cancelamento de reserva com regra minima
- `P1` Impedir exclusao de schedule com bookings ativos

### Arquivos mais provaveis de mudanca

- `app/api/bookings/route.ts`
- `app/api/bookings/[id]/route.ts`
- `components/my-bookings.tsx`
- `components/admin/booking-actions.tsx`
- `middleware.ts`
- `app/[locale]/admin/trips/[id]/schedules/page.tsx`
- `prisma/schema.prisma`

### Dependencias

- Nenhuma externa obrigatoria

### Criterios de aceite

- Nova reserva criada sem pagamento nao aparece como confirmada
- Usuario deslogado nao acessa `/reservas`
- Usuario comum nao consegue executar action administrativa
- Schedule invalido nao pode ser criado
- Schedule com booking ativo nao pode ser removido

### Definicao de pronto

- Fluxo manual testado:
  - login
  - reserva
  - visualizacao em minhas reservas
  - cancelamento
  - acesso admin

## Sprint 2 - Extrair Regra de Negocio para Services

Duracao sugerida: 5 dias

### Objetivo

Reduzir acoplamento e centralizar as regras do dominio.

### Tarefas

- `P0` Criar `lib/services/booking.service.ts`
- `P0` Criar `lib/services/trip.service.ts`
- `P0` Criar `lib/services/schedule.service.ts`
- `P1` Criar `lib/services/email.service.ts`
- `P0` Mover validacao e criacao de booking para service
- `P0` Mover validacao e criacao de schedule para service
- `P1` Padronizar erros de dominio com tipo unico
- `P1` Criar helpers de autorizacao reutilizaveis

### Estrutura sugerida

- `lib/services/booking.service.ts`
- `lib/services/trip.service.ts`
- `lib/services/schedule.service.ts`
- `lib/services/email.service.ts`
- `lib/errors/domain-error.ts`
- `lib/authz.ts`

### Dependencias

- Sprint 1 concluida

### Criterios de aceite

- API routes ficam finas, delegando regra para services
- Server actions param de duplicar logica de negocio
- Erros de validacao e autorizacao seguem formato consistente

## Sprint 3 - Preparar Pagamentos

Duracao sugerida: 5 a 7 dias

### Objetivo

Criar a base do fluxo de pagamento sem ainda fechar toda a operacao comercial.

### Tarefas

- `P0` Escolher gateway principal
- `P0` Criar modelo para transacao ou payment intent
- `P0` Vincular booking a tentativa de pagamento
- `P0` Criar endpoint de webhook
- `P0` Definir transicoes de estado:
  - booking `PENDING`
  - payment `UNPAID`
  - booking `CONFIRMED` somente apos pagamento aprovado
- `P1` Registrar falhas de webhook e tentativas
- `P1` Exibir status de pagamento na area admin

### Decisao tecnica recomendada

- Se o negocio for majoritariamente Brasil: Mercado Pago
- Se o negocio for internacional: Stripe

### Dependencias

- Sprint 2 concluida

### Criterios de aceite

- Nao existe mais confirmacao sem evento confiavel de pagamento
- O sistema registra status de pagamento separado do status da reserva
- O admin enxerga reservas pendentes de pagamento

## Sprint 4 - Painel Admin Operacional

Duracao sugerida: 5 dias

### Objetivo

Tornar o painel utilizavel para rotina real da operacao.

### Tarefas

- `P1` Adicionar filtros de reservas por status
- `P1` Adicionar filtros por data
- `P1` Adicionar busca por tour
- `P1` Exibir vagas restantes por schedule
- `P1` Permitir fechar schedule sem excluir
- `P1` Adicionar listagem de contatos recebidos
- `P2` Permitir reenvio de e-mail
- `P2` Criar indicador de publicacao de tour

### Dependencias

- Sprint 2 concluida

### Criterios de aceite

- Operador consegue localizar reservas com rapidez
- Operador consegue entender ocupacao das datas
- Contatos deixam de ficar invisiveis no banco

## Sprint 5 - Conteudo e i18n Confiavel

Duracao sugerida: 4 a 5 dias

### Objetivo

Remover fragilidade da traducao e dar governanca ao conteudo.

### Tarefas

- `P1` Decidir estrategia:
  - manual por idioma
  - automatica em background
  - API profissional
- `P1` Refatorar `translation-service.ts`
- `P1` Adicionar fallback e log de falha
- `P1` Melhorar formulario admin para conteudo multilíngue
- `P2` Revisar chaves de `messages/*.json`

### Dependencias

- Sprint 2 concluida

### Criterios de aceite

- Falha de traducao nao quebra cadastro de tour
- Admin consegue editar conteudo por idioma com previsibilidade

## Sprint 6 - Testes e Pipeline

Duracao sugerida: 5 dias

### Objetivo

Criar rede de seguranca para manutencao e evolucao.

### Tarefas

- `P1` Configurar `Vitest`
- `P1` Criar testes unitarios para booking service
- `P1` Criar testes unitarios para schedule service
- `P1` Configurar `Playwright`
- `P1` Criar cenarios E2E principais
- `P1` Criar GitHub Actions para lint, build e testes

### Casos minimos de teste

- booking duplicado
- booking acima da capacidade
- booking com schedule fechado
- cancelamento pelo dono
- bloqueio de usuario sem permissao
- login e reserva ponta a ponta

### Dependencias

- Sprint 2 concluida

### Criterios de aceite

- Pipeline falha quando regra critica quebra
- Fluxos principais possuem cobertura automatizada minima

## Sprint 7 - UX, SEO e Conversao

Duracao sugerida: continuo

### Objetivo

Melhorar apresentacao comercial e conversao sem comprometer o core.

### Tarefas

- `P2` Revisar home com foco em CTA principal e prova social
- `P2` Melhorar cards de tours
- `P2` Melhorar pagina de detalhe
- `P2` Criar jornada de quote via WhatsApp mais clara
- `P2` Revisar metadata, sitemap e robots
- `P2` Adicionar analytics de funil

### Dependencias

- Core estavel

### Criterios de aceite

- Eventos de funil disponiveis
- CTAs mais claros
- Melhor legibilidade das informacoes do tour

## Backlog Tecnico Transversal

Esses itens podem entrar em qualquer sprint, desde que nao disputem com `P0`.

- Atualizar `README.md`
- Criar `.env.example`
- Revisar scripts
- Remover arquivos improprios de `public/`
- Criar seed de trips e usuarios
- Adicionar healthcheck de banco
- Padronizar encoding de arquivos para evitar texto corrompido

## Ordem Recomendada de Execucao Imediata

### Semana 1

1. Corrigir status inicial do booking
2. Proteger `/reservas`
3. Bloquear actions admin sem permissao
4. Validar agenda
5. Bloquear exclusao de schedule com booking ativo

### Semana 2

1. Extrair booking service
2. Extrair schedule service
3. Centralizar authz
4. Padronizar erros

### Semana 3

1. Escolher gateway
2. Modelar pagamento
3. Criar webhook
4. Confirmar booking apenas apos pagamento

## Proxima Execucao Tecnica Recomendada

Se o objetivo agora for comecar implementando, a primeira entrega deve ser um pacote unico:

1. Ajustar `Booking` para nascer `PENDING`
2. Corrigir middleware para `/reservas`
3. Endurecer criacao e exclusao de schedules
4. Atualizar telas para refletir status reais

Esse e o melhor primeiro bloco porque reduz risco sem depender de integracao externa.
