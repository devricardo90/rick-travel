# Implementacao e Logica Guardada

## Objetivo deste arquivo

Registrar a logica de cada etapa executada no projeto para que as decisoes fiquem persistidas e possam ser reaproveitadas sem depender de memoria oral.

## Etapa 1 - Estabilizacao do core de reservas

### O que foi consolidado

- `Booking` deixou de nascer confirmado e passou a nascer como `PENDING`
- `paymentStatus` passou a nascer como `UNPAID`
- o e-mail de confirmacao saiu da criacao da reserva e foi movido para a confirmacao administrativa
- a rota `/reservas` passou a ser protegida no middleware
- cancelamento online passou a respeitar janela minima de 24h
- a criacao e exclusao de agendas ganhou validacao minima e bloqueio por reservas ativas

### Logica de negocio guardada

- criar reserva nao significa confirmar pagamento
- data com agenda aberta exige selecao explicita de `scheduleId`
- duplicidade de booking e capacidade continuam sendo regras de dominio, nao de interface
- exclusao de schedule com booking ativo e bloqueada para preservar integridade operacional

## Etapa 2 - Extracao de logica para services

### Motivo

A regra de negocio estava espalhada entre API routes, server actions e pages. Isso aumentava o custo de manutencao e tornava facil criar divergencia de comportamento entre fluxos.

### Decisao arquitetural

Foram criadas camadas pequenas e diretas:

- `lib/authz.ts`
- `lib/errors/domain-error.ts`
- `lib/services/booking.service.ts`
- `lib/services/schedule.service.ts`
- `lib/services/trip.service.ts`

### Logica guardada por camada

#### `authz`

- `requireSession()` centraliza a obtencao de sessao autenticada
- `requireAdminSession()` centraliza a verificacao de papel administrativo
- falhas de autenticacao e autorizacao passam a ser erros de dominio previsiveis

#### `DomainError`

- o dominio agora pode falhar com `message`, `code` e `status`
- isso evita espalhar `if` de resposta HTTP pela regra de negocio
- as bordas do sistema convertem erro de dominio em resposta HTTP ou redirect

#### `booking.service`

- concentra a criacao e o cancelamento de reservas
- a regra de duplicidade mora aqui
- a regra de capacidade mora aqui
- a regra de exigencia de agenda mora aqui
- a regra de cancelamento com 24h de antecedencia mora aqui

#### `schedule.service`

- concentra validacao de datas, capacidade e preco
- centraliza a protecao de integridade para exclusao de agenda com bookings ativos

#### `trip.service`

- concentra validacao do input de viagem
- concentra traducao automatica do conteudo
- concentra protecao contra exclusao de viagem com reservas ativas

### Regra de fronteira adotada

- routes e actions devem autenticar/autorizarem e delegar
- services devem decidir a regra de negocio
- a UI deve apenas refletir resultado e estado

### Integracoes executadas nesta etapa

- `app/api/bookings/route.ts` passou a usar `requireSession()` e `booking.service`
- `app/api/bookings/[id]/route.ts` passou a usar `requireSession()` e `booking.service`
- `app/[locale]/admin/bookings/actions.ts` passou a usar `requireAdminSession()`
- `app/[locale]/admin/trips/actions.ts` passou a usar `trip.service`
- `app/[locale]/admin/trips/[id]/schedules/page.tsx` passou a usar `schedule.service`

### Logica guardada de integracao

- autenticacao agora e um detalhe de borda, nao uma regra copiada em cada arquivo
- as rotas ficaram mais finas e previsiveis
- os redirects de sucesso e erro continuam na camada de pagina, porque isso pertence ao fluxo de interface
- as validacoes de agenda e reserva ficaram fora da page e dentro do dominio

### Validacao executada

- `npm.cmd run lint` passou
- `npx.cmd tsc --noEmit` ainda falha no projeto, mas os erros remanescentes continuam concentrados em tipagem legada de `JsonValue`, em `trip-form` e em pontos antigos com `ZodError`
- a conclusao pratica desta etapa e: a extracao para services ficou estruturalmente valida no lint, mas o typecheck global do repositorio ainda precisa de uma etapa dedicada de saneamento

## Etapas seguintes previstas

- migrar mais paginas e actions para consumir exclusivamente services
- padronizar todas as mensagens expostas ao usuario
- iniciar fluxo de pagamento real sem recolocar logica de dominio nas rotas

## Etapa 3 - Saneamento do typecheck global

### Motivo

Mesmo com a arquitetura melhor organizada, o repositório ainda nao fechava `tsc --noEmit`. Isso impedia evolucao segura e escondia regressao entre erros novos e erros antigos.

### Causas raiz encontradas

- campos JSON do Prisma (`title`, `description`, `highlights`) chegavam como `JsonValue`, mas a UI esperava `string` ou `Record<string, string>`
- o `trip-form` aceitava dados ambigos e tinha parsing duplicado e inconsistente
- havia uso antigo de `error.errors` em `ZodError`, incompatível com a versao atual
- o script de banco dependia de declaracao de tipos para `pg`

### Decisoes tecnicas aplicadas

- foi criado `lib/types.ts` para definir:
  - `LocalizedText`
  - `LocalizedList`
  - `TripCardData`
  - `TripFormDataLike`
- foram criados adaptadores simples:
  - `asLocalizedText()`
  - `asLocalizedList()`
- a borda entre Prisma e UI agora converte JSON antes do uso em componentes
- `trip-form` foi reescrito para lidar com dados multilíngues de forma previsivel
- a rota `app/api/trips/[id]/route.ts` foi saneada para `error.issues`
- foi adicionada declaracao local para o modulo `pg`

### Logica guardada

- `JsonValue` nao deve vazar cru para a UI
- a UI deve trabalhar com tipos de apresentacao e nao com tipos brutos do ORM
- toda conversao entre Prisma JSON e componente React deve acontecer na borda
- formularios admin devem receber valores normalizados, preferencialmente em PT como base de edicao

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Estado atual apos esta etapa

- o projeto voltou a ter typecheck global verde
- as proximas mudancas podem ser verificadas com mais confianca
- a base esta pronta para entrar em pagamento real ou fortalecimento do admin sem carregar debito tecnico imediato de tipagem

## Etapa 4 - Base de pagamento e confirmacao por evento

### Motivo

O sistema ainda confirmava reserva sem gateway real. A meta desta etapa foi inverter essa responsabilidade: a reserva so deve ser confirmada quando um evento de pagamento confirmar isso.

### Estrategia adotada

Foi implementado um provedor interno `MOCK` para validar a arquitetura antes de integrar Stripe ou Mercado Pago.

### Estrutura criada

- novo modelo `PaymentAttempt` em `prisma/schema.prisma`
- nova migration:
  - `prisma/migrations/20260315113000_add_payment_attempts/migration.sql`
- novo service:
  - `lib/services/payment.service.ts`
- novas rotas:
  - `app/api/payments/checkout/route.ts`
  - `app/api/payments/webhook/route.ts`
- nova tela de checkout mock:
  - `app/[locale]/payments/mock/[bookingId]/page.tsx`

### Logica de negocio guardada

#### `PaymentAttempt`

- cada tentativa de pagamento pertence a um `Booking`
- o booking continua sendo o agregado principal da reserva
- o `PaymentAttempt` guarda o estado transitorio do gateway
- a relacao permite reprocessar pagamento sem perder historico

#### Checkout

- o usuario inicia pagamento a partir de uma reserva pendente
- o endpoint `/api/payments/checkout` cria ou reaproveita tentativa ativa
- o retorno entrega uma `checkoutUrl`
- por enquanto essa URL leva ao checkout mock interno

#### Webhook

- o endpoint `/api/payments/webhook` e a fronteira oficial para atualizar pagamento
- o webhook recebe `bookingId` e `status`
- quando o status chega como `SUCCEEDED`:
  - `paymentStatus` do booking vira `PAID`
  - `status` do booking vira `CONFIRMED`
  - o email de confirmacao e disparado
- quando falha:
  - a reserva continua pendente
  - o pagamento nao e marcado como pago

#### UI do usuario

- `MyBookings` agora exibe `paymentStatus`
- reservas pendentes e nao pagas exibem CTA `Pagar`
- o botao leva ao checkout mock

#### UI do admin

- a listagem admin de bookings agora mostra tambem o status de pagamento

### Validacao executada

- `npx.cmd prisma generate` executado com sucesso
- migration aplicada com `npx.cmd prisma migrate deploy`
- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Observacoes importantes

- o fluxo atual usa gateway mock apenas para validar arquitetura e estados
- a migracao foi aplicada no PostgreSQL local configurado em `localhost:5433`
- um smoke test com `tsx` nao foi concluido por restricao de spawn no ambiente sandbox, mas a migration e as validacoes de tipo/lint passaram

### Proximo encaixe natural

- trocar o provider `MOCK` por um provider real
- mapear eventos do provider real para `PaymentAttemptStatus`
- guardar ids externos e payloads relevantes no `PaymentAttempt`

## Etapa 5 - Integracao inicial com Mercado Pago Pix

### Motivo

Depois de validar a arquitetura com provider mock, o proximo passo foi conectar um provider real alinhado ao contexto Brasil-first do produto.

### Escolha

- provider implementado: Mercado Pago
- metodo inicial: Pix

### Estrutura criada ou alterada

- `lib/services/payment.service.ts`
- `app/api/payments/checkout/route.ts`
- `app/api/payments/webhook/route.ts`
- `app/[locale]/payments/mercadopago/[bookingId]/page.tsx`
- `MERCADO_PAGO_SETUP.md`

### Logica guardada

#### Entrada no checkout

- o endpoint `/api/payments/checkout` nao cria mais um checkout mock
- ele apenas valida a reserva e redireciona para uma pagina interna de pagamento Mercado Pago

#### Geracao do Pix

- a pagina interna coleta o CPF do pagador
- o backend cria um pagamento Pix em `https://api.mercadopago.com/v1/payments`
- a resposta do Mercado Pago fornece QR Code, imagem base64 e `ticket_url`
- esses dados ficam persistidos em `PaymentAttempt.metadata`

#### Webhook

- o webhook agora recebe notificacoes do Mercado Pago
- o backend consulta o pagamento real pelo `resourceId`
- a reserva e localizada por `external_reference`
- o status externo e convertido para `PaymentAttemptStatus`
- se o pagamento estiver aprovado:
  - `booking.paymentStatus = PAID`
  - `booking.status = CONFIRMED`
  - email de confirmacao e enviado

#### Validacao de assinatura

- se `MP_WEBHOOK_SECRET` estiver configurado, o backend tenta validar `x-signature`
- se a assinatura nao bater, o webhook e rejeitado
- se o segredo nao estiver configurado, a validacao fica permissiva

### O que o usuario precisa configurar fora do codigo

- `MP_ACCESS_TOKEN`
- webhook no painel do Mercado Pago apontando para `/api/payments/webhook`
- opcionalmente `MP_WEBHOOK_SECRET`
- uma URL publica no ambiente local, se quiser testar webhook fora da producao

### Pendencia registrada para fazer depois

- configurar as credenciais reais do Mercado Pago no ambiente
- registrar o webhook no painel do Mercado Pago
- testar o fluxo externo ponta a ponta com URL publica

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Estado atual

- o projeto ja consegue gerar Pix via Mercado Pago
- a confirmacao da reserva agora depende do webhook do provider real
- falta apenas configurar credenciais e webhook no painel para fechar o ciclo em ambiente real

## Etapa 6 - Filtros operacionais no admin de reservas

### Motivo

Depois de colocar pagamento no fluxo, o painel admin precisava ganhar leitura operacional melhor para acompanhar pendencias, pagamentos e janela de reservas.

### O que foi implementado

- filtros em `app/[locale]/admin/bookings/page.tsx` para:
  - busca por cliente
  - status da reserva
  - status do pagamento
  - periodo por data de criacao

### Logica guardada

- o filtro usa `AND` entre os blocos ativos para reduzir ruído operacional
- busca textual continua focada em nome e email do usuario
- filtro de datas atua sobre `createdAt`, porque isso ajuda a acompanhar volume operacional e conciliacao
- status de pagamento e status da reserva aparecem juntos porque sao conceitos diferentes e ambos importam para operacao

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o admin agora consegue localizar:
  - reservas pendentes de pagamento
  - reservas confirmadas
  - reservas de um intervalo especifico
  - clientes especificos com mais rapidez

## Etapa 7 - Visao admin de contatos recebidos

### Motivo

O formulario de contato ja persistia mensagens no banco, mas isso ainda nao existia como ferramenta operacional no painel admin.

### O que foi implementado

- nova pagina:
  - `app/[locale]/admin/contacts/page.tsx`
- novo link no menu admin:
  - `app/[locale]/admin/layout.tsx`

### Funcionalidades entregues

- listagem de contatos recebidos
- busca por nome, email ou conteudo da mensagem
- filtro por status
- filtro por intervalo de datas
- cards-resumo com:
  - total de contatos
  - total de pendentes

### Logica guardada

- a area de contatos foi pensada como inbox operacional minima
- por enquanto os status sao lidos do campo `status` ja existente no banco
- a busca textual foi mantida simples e util para rotina de atendimento
- a pagina prioriza leitura rapida e nao workflow completo de resposta

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- mensagens do formulario deixaram de ficar invisiveis no banco
- o admin agora tem uma visao minima para acompanhamento comercial e atendimento

## Etapa 8 - Workflow minimo de status para contatos

### Passo 1 - Action server-side

- foi criada `app/[locale]/admin/contacts/actions.ts`
- essa action:
  - exige sessao admin
  - atualiza o campo `status` do `ContactSubmission`
  - revalida `/admin/contacts`

### Passo 2 - Controle visual no admin

- foi criado `components/admin/contact-actions.tsx`
- o componente expoe tres acoes:
  - voltar para `PENDING`
  - marcar como `READ`
  - marcar como `REPLIED`

### Passo 3 - Integracao na tabela

- `app/[locale]/admin/contacts/page.tsx` passou a renderizar a coluna `Acoes`
- cada linha agora pode ser atualizada sem sair da listagem

### Logica guardada

- contato e tratado como inbox simples, nao como CRM completo
- atualizar status precisa ser uma acao leve e imediata
- `REPLIED` serve como encerramento operacional minimo
- `READ` separa triagem de resposta concluida

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o admin agora consegue triar contatos sem sair da tela
- existe um workflow minimo entre:
  - novo contato
  - contato lido
  - contato respondido

## Etapa 9 - Operacao de agenda com ocupacao e fechamento

### Passo 1 - Servico de agenda ampliado

- `lib/services/schedule.service.ts` ganhou:
  - `listSchedulesWithOccupancy()`
  - `updateScheduleStatus()`

### Logica do passo 1

- ocupacao considera bookings `PENDING` e `CONFIRMED`
- `usedCapacity` = soma de `guestCount`
- `remainingCapacity` = `capacity - usedCapacity`
- fechar agenda nao exclui a data, apenas muda `status` para `CLOSED`

### Passo 2 - Integracao na pagina admin

- `app/[locale]/admin/trips/[id]/schedules/page.tsx` passou a:
  - carregar agendas com ocupacao
  - exibir status `OPEN/CLOSED`
  - exibir vagas usadas e restantes
  - permitir fechar e reabrir agenda

### Logica do passo 2

- exclusao continua reservada para casos sem bookings ativos
- fechamento operacional e a acao recomendada quando nao se quer vender mais uma data
- reabertura permite recolocar rapidamente uma data em circulacao

### Passo 3 - Validacao final

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o admin agora enxerga ocupacao real por agenda
- passou a existir diferenca clara entre:
  - excluir agenda
  - fechar agenda
  - reabrir agenda
- isso reduz risco operacional de apagar uma data quando a necessidade real era apenas parar de vender

## Etapa 10 - Dashboard admin operacional

### Passo 1 - Redefinicao do objetivo do dashboard

- o dashboard deixou de ser apenas contagem simples de entidades
- passou a priorizar leitura operacional do negocio

### Passo 2 - Blocos de metricas implementados

- KPIs principais:
  - usuarios
  - passeios
  - reservas
  - contatos
- bloco financeiro:
  - receita paga
  - receita pendente
- bloco de operacao:
  - agendas abertas futuras

### Passo 3 - Listas de apoio operacional

- reservas recentes dos ultimos 7 dias
- proximas agendas com ocupacao
- contatos recentes

### Logica guardada por bloco

#### KPIs

- servem para leitura rapida de volume
- nao substituem as telas detalhadas

#### Receita paga

- usa `Booking.paymentStatus = PAID`
- soma `totalPriceCents`

#### Receita pendente

- usa `paymentStatus = UNPAID`
- considera reservas ainda ativas

#### Agendas futuras

- considera apenas schedules `OPEN` com `startAt >= now`

#### Reservas recentes

- janela curta de 7 dias para leitura de movimento recente

#### Proximas agendas

- ocupacao e derivada da soma de `guestCount` em bookings `PENDING` e `CONFIRMED`

#### Contatos recentes

- serve como alerta rapido para nao depender de entrar na tela de contatos toda hora

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o dashboard agora virou ponto de leitura real do negocio
- o admin consegue ver rapidamente:
  - se ha dinheiro a receber
  - se ha reservas pendentes
  - se ha datas proximas com ocupacao
  - se ha contatos novos aguardando atendimento

## Etapa 11 - Analytics de funil entre tour, reserva e pagamento

### Passo 1 - Persistencia de eventos no banco

- foi criado o modelo `AnalyticsEvent` em `prisma/schema.prisma`
- foi criada a migration:
  - `prisma/migrations/20260315170000_add_analytics_events/migration.sql`
- o modelo guarda:
  - tipo do evento
  - referencias opcionais para usuario, tour, booking e tentativa de pagamento
  - `sessionId`
  - `path`
  - `metadata`

### Logica do passo 1

- analytics foi tratado como trilha de evento append-only
- o evento nao altera regra de negocio; ele apenas registra comportamento
- as relacoes sao opcionais para permitir capturar evento anonimo no topo do funil
- a opcao por tabela propria evita depender de provider externo agora

### Passo 2 - Service e endpoint interno

- foi criado `lib/services/analytics.service.ts`
- foi criado `app/api/analytics/route.ts`
- foi criado `lib/analytics/events.ts` para padronizar os tipos:
  - `TOUR_VIEWED`
  - `RESERVE_CLICKED`
  - `CHECKOUT_STARTED`
  - `PIX_GENERATED`
  - `PAYMENT_CONFIRMED`

### Logica do passo 2

- o endpoint aceita evento do frontend sem exigir sessao
- se houver sessao autenticada, o backend associa automaticamente `userId`
- a API valida o tipo do evento antes de persistir
- o service tambem expõe resumo de funil para leitura no admin

### Passo 3 - Disparos no frontend

- `components/trips/tour-detail-client.tsx` dispara `TOUR_VIEWED` ao abrir o detalhe
- `components/trips/tour-actions.tsx` dispara `RESERVE_CLICKED` ao clicar em reservar
- `components/my-bookings.tsx` dispara `CHECKOUT_STARTED` ao iniciar pagamento
- foi criado `lib/analytics/client.ts` para enviar os eventos com `sendBeacon` ou `fetch`

### Logica do passo 3

- `TOUR_VIEWED` usa `useRef` para evitar duplicidade de tracking no mount
- `sendBeacon` foi priorizado para nao bloquear navegacao do usuario
- um `sessionId` local via `sessionStorage` permite medir funil anonimo na mesma sessao
- os eventos de frontend guardam contexto leve em `metadata`, sem mover regra de negocio para o cliente

### Passo 4 - Disparos no backend de pagamento

- `lib/services/payment.service.ts` passou a registrar:
  - `PIX_GENERATED` quando a tentativa Pix e criada com sucesso
  - `PAYMENT_CONFIRMED` quando o webhook confirma pagamento aprovado

### Logica do passo 4

- `PIX_GENERATED` pertence ao backend porque depende da resposta real do provider
- `PAYMENT_CONFIRMED` pertence ao backend porque a fonte da verdade e o webhook
- isso evita contar pagamento apenas por clique ou por expectativa de UI
- o funil final fica ancorado em eventos reais do sistema

### Passo 5 - Leitura do funil no dashboard

- `app/[locale]/admin/page.tsx` passou a carregar resumo de analytics dos ultimos 30 dias
- o dashboard agora exibe as cinco etapas do funil com conversao entre elas

### Logica do passo 5

- o dashboard usa contagem por tipo de evento
- a conversao e calculada sempre contra a etapa imediatamente anterior
- o periodo de 30 dias foi escolhido para leitura gerencial, nao para auditoria financeira
- isso entrega visao rapida de gargalo entre:
  - interesse no tour
  - intencao de reserva
  - inicio de checkout
  - Pix gerado
  - pagamento efetivamente confirmado

### Validacao executada

- `npx.cmd prisma generate` executado com sucesso
- `npx.cmd prisma migrate deploy` aplicou a migration de analytics no banco local
- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o projeto agora mede o funil principal de conversao ponta a ponta
- o admin consegue identificar onde o usuario abandona o fluxo
- a base foi preparada para evoluir depois para GA4, PostHog ou outra ferramenta, sem perder a trilha interna

## Etapa 12 - Origem de trafego no analytics

### Passo 1 - Captura e persistencia de atribuicao

- foi criado `lib/analytics/attribution.ts`
- `middleware.ts` passou a capturar:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`
  - `referer`
- esses dados agora ficam em cookie `ricktravel_analytics_attribution`

### Logica do passo 1

- a atribuicao foi tratada como contexto de sessao, nao como evento isolado
- o cookie guarda o primeiro `landingPath` e o `firstSeenAt`
- quando chega uma nova UTM, ela atualiza o contexto; quando nao chega, o contexto anterior continua valendo
- isso permite manter leitura de origem sem depender de query string em todas as paginas do fluxo

### Passo 2 - Enriquecimento automatico dos eventos

- `app/api/analytics/route.ts` passou a ler o cookie de atribuicao
- todo evento recebido pela API agora e enriquecido com esse contexto

### Logica do passo 2

- o frontend continua enviando apenas o evento e o contexto local minimo
- o backend injeta origem de trafego de forma centralizada
- isso evita duplicacao de logica de UTM nos componentes
- tambem reduz risco de perder a atribuicao quando o usuario muda de pagina

### Passo 3 - Leitura operacional no dashboard

- `lib/services/analytics.service.ts` ganhou resumo de atribuicao
- `app/[locale]/admin/page.tsx` passou a mostrar:
  - top origens por `utm_source`
  - top campanhas por `utm_campaign`
  - top referrers por dominio

### Logica do passo 3

- o resumo usa `TOUR_VIEWED` como topo do funil para medir aquisicao
- isso evita misturar canal de entrada com comportamento de usuarios ja engajados no checkout
- as contagens foram mantidas simples e gerenciais, focadas em leitura rapida

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o projeto agora diferencia melhor trafego organico, campanha paga, WhatsApp e acessos diretos
- o admin consegue enxergar de onde vem o topo do funil
- a base esta pronta para futuras decisoes de marketing sem depender de ferramenta externa imediatamente

## Pendencias guardadas para proximas etapas

### Pendencia 1 - Fechamento externo do Mercado Pago

- configurar `MP_ACCESS_TOKEN` no ambiente real
- registrar o webhook no painel do Mercado Pago
- validar fluxo ponta a ponta com URL publica

### Logica guardada da pendencia 1

- a integracao tecnica ja esta pronta no codigo
- falta concluir a parte externa de credenciais e notificacao
- sem isso, o ciclo real de Pix fica incompleto fora do ambiente interno

### Pendencia 2 - Recuperacao de abandono de checkout

- identificar reservas com `CHECKOUT_STARTED` ou `PIX_GENERATED` sem `PAYMENT_CONFIRMED`
- destacar esses casos no admin
- preparar base para acao operacional futura, como contato manual ou automacao

### Logica guardada da pendencia 2

- essa etapa fecha a leitura do funil com a camada de recuperacao
- a intencao nao e apenas medir abandono, mas transformar abandono em fila operacional
- a base de analytics ja permite implementar isso depois sem refazer a instrumentacao

## Etapa 13 - Camada de e-mail operacional e reenvio coerente

### Passo 1 - Centralizacao do envio de e-mail

- foi criado `lib/services/email.service.ts`
- o envio deixou de ficar implementado diretamente em `app/actions/email.ts`
- `app/actions/email.ts` passou a ser apenas uma borda de exportacao

### Logica do passo 1

- o sistema agora tem uma camada unica para:
  - montar assunto e HTML
  - criar `EmailLog`
  - enviar via Resend
  - marcar `SENT` ou `FAILED`
- isso reduz duplicacao e prepara o projeto para crescer com novos templates

### Passo 2 - Separacao dos templates de negocio

- `BOOKING_CONFIRMED` passou a continuar existindo para confirmacao manual/admin
- `PAYMENT_CONFIRMED` passou a ser usado quando o pagamento e confirmado no webhook

### Logica do passo 2

- confirmacao operacional de reserva e pagamento confirmado nao sao exatamente a mesma mensagem
- o webhook agora envia o template de pagamento, que conversa melhor com a origem real da confirmacao
- a reserva confirmada manualmente pelo admin continua usando o template de reserva

### Passo 3 - Reenvio admin alinhado ao estado da reserva

- `app/actions/admin.ts` passou a escolher o template recomendado antes do reenvio
- `components/admin/booking-actions.tsx` agora:
  - desabilita reenvio quando a reserva ainda nao tem e-mail aplicavel
  - informa no toast qual template foi reenviado

### Logica do passo 3

- se `paymentStatus = PAID`, o template recomendado e `PAYMENT_CONFIRMED`
- se a reserva esta `CONFIRMED` mas ainda nao paga, o template recomendado e `BOOKING_CONFIRMED`
- se a reserva ainda nao atingiu nenhum desses estados, nao faz sentido operacional reenviar e-mail

### Passo 4 - Melhor leitura do ultimo envio no admin

- `app/[locale]/admin/bookings/page.tsx` passou a mostrar no ultimo log:
  - template
  - status
  - data do ultimo envio ou tentativa

### Logica do passo 4

- isso melhora a leitura operacional sem exigir abrir uma tela detalhada da reserva
- o operador agora entende rapidamente se o ultimo contato foi de reserva ou de pagamento

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o fluxo de e-mail ficou mais coerente com o estado real do negocio
- o admin consegue reenviar a mensagem correta sem decidir manualmente o template
- a base ficou pronta para crescer depois com mais templates e historico de comunicacao

## Etapa 14 - i18n confiavel com fallback e log de traducao

### Passo 1 - Endurecimento do translation service

- `lib/translation-service.ts` foi reestruturado
- o service agora diferencia:
  - traducao completa
  - fallback parcial
  - fallback total
- foram adicionadas versoes com metadata:
  - `translateTextWithMeta()`
  - `translateArrayWithMeta()`

### Logica do passo 1

- o texto fonte em `pt` continua sendo a verdade principal
- quando uma traducao falha, o sistema nao quebra o cadastro
- a lingua alvo com falha recebe fallback para o texto original em portugues
- o status final depende da quantidade de falhas:
  - `SUCCESS`
  - `PARTIAL_FALLBACK`
  - `FULL_FALLBACK`

### Passo 2 - Persistencia de log de traducao

- foi criado `TranslationJobLog` em `prisma/schema.prisma`
- foi criada a migration:
  - `prisma/migrations/20260315183000_add_translation_job_logs/migration.sql`

### Logica do passo 2

- cada criacao ou atualizacao de viagem passa a gerar um log de traducao
- o log guarda:
  - operacao (`CREATE` ou `UPDATE`)
  - provider
  - status final
  - detalhes das falhas em `metadata`
- isso tira a dependencia exclusiva de `console.error` para rastrear problema de traducao

### Passo 3 - Integracao com o dominio de trips

- `lib/services/trip.service.ts` passou a:
  - usar as traducoes com metadata
  - persistir a viagem mesmo com fallback
  - registrar o `TranslationJobLog` logo apos criar ou atualizar o tour
- `app/api/trips/[id]/route.ts` passou a delegar a atualizacao ao `trip.service`

### Logica do passo 3

- a viagem nao deve falhar por indisponibilidade momentanea do tradutor externo
- a regra nova prioriza continuidade operacional do cadastro
- o risco e absorvido pelo fallback e visibilidade do log

### Passo 4 - Visibilidade no admin

- `app/[locale]/admin/trips/page.tsx` passou a mostrar o ultimo status de traducao por viagem

### Logica do passo 4

- o admin consegue ver rapidamente se a ultima traducao saiu:
  - correta
  - parcialmente em fallback
  - totalmente em fallback
- isso transforma problema tecnico de i18n em sinal operacional visivel

### Validacao executada

- `npx.cmd prisma generate` executado com sucesso
- `npx.cmd prisma migrate deploy` aplicou a migration de log de traducao
- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- falha de traducao nao bloqueia mais cadastro ou edicao de passeio
- o projeto passou a ter rastreabilidade do estado da traducao
- o admin ganhou leitura minima para identificar tours que precisam revisao manual de idioma

## Etapa 15 - Formulario admin com conteudo multilÃ­ngue explicito

### Passo 1 - Novo contrato de input para trips

- `lib/schemas.ts` passou a aceitar:
  - `titleTranslations`
  - `descriptionTranslations`
  - `highlightsTranslations`
- o campo em portugues continua obrigatorio como base editorial

### Logica do passo 1

- o admin agora pode informar manualmente conteudo por idioma
- o sistema deixou de depender apenas do campo simples em PT
- PT continua sendo a fonte principal para validacao e fallback

### Passo 2 - Combinacao entre traducao manual e automatica

- `lib/services/trip.service.ts` passou a combinar:
  - traducao manual quando o idioma foi preenchido
  - traducao automatica somente para idiomas vazios

### Logica do passo 2

- se EN, ES ou SV vierem preenchidos, esses valores sao preservados
- se vierem vazios, o sistema tenta completar automaticamente a partir do PT
- se a traducao automatica falhar, o fallback continua sendo o texto em portugues
- isso reduz dependencia de tradutor externo sem perder agilidade operacional

### Passo 3 - Formulario admin refeito

- `components/admin/trip-form.tsx` foi refeito para expor:
  - bloco de dados gerais da viagem
  - bloco de conteudo por idioma com PT, EN, ES e SV
- o formulario agora permite editar:
  - titulo
  - descricao
  - highlights
  por idioma

### Logica do passo 3

- o operador pode escrever manualmente apenas os idiomas prioritarios
- o restante continua podendo ser completado pelo sistema
- isso cria um modelo hibrido:
  - curadoria manual onde importa
  - traducao automatica como apoio

### Passo 4 - Edicao carregando todas as traducoes

- `app/[locale]/admin/trips/[id]/page.tsx` passou a enviar ao formulario os objetos localizados completos

### Logica do passo 4

- editar um passeio nao mostra mais so o PT
- o admin agora consegue revisar e ajustar traducoes existentes diretamente no form
- isso fecha a governanca minima de conteudo multilÃ­ngue dentro do proprio painel

### Validacao executada

- `npx.cmd tsc --noEmit` passou
- `npm.cmd run lint` passou

### Resultado pratico

- o admin ganhou controle real sobre o conteudo por idioma
- a traducao automatica virou suporte, nao dependencia total
- a base editorial do projeto ficou mais previsivel para evolucao internacional
