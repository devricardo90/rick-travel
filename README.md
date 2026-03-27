# Rick Travel

Plataforma de turismo para passeios no Rio de Janeiro. Site para reserva de city tours com guia credenciado Cadastur.

## Sobre o Projeto

Rick Travel é uma plataforma web para reserva de passeios turísticos no Rio de Janeiro. O sistema permite que turistas conheçam os passeios disponíveis, façam reservas e pagamentos online. Inclui um painel administrativo para gerenciamento de passeios, reservas e contato com clientes.

### Funcionalidades Principais

- **Listagem de Passeios**: Exibição de tours com filtros e busca
- **Reserva Online**: Sistema completo de reserva com seleção de datas/horários
- **Pagamento via PIX**: Integração com MercadoPago para pagamentos
- **Multilíngue**: Suporte a 4 idiomas (PT, EN, ES, SV)
- **Autenticação**: Sistema de login/registro com better-auth
- **Painel Admin**: Gerenciamento de passeios, reservas e contatos
- **Analytics**: Rastreamento de eventos para análise de funil
- **SEO**: Sitemap dinâmico e metadados otimizados

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Next.js | 16.0.1 | Framework React com App Router |
| React | 19.2.0 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Framework CSS utility-first |
| Radix UI | - | Componentes primitivos acessíveis |
| Motion | 11.x | Animações (antigo Framer Motion) |
| GSAP | 3.12.x | Animações avançadas |
| Lucide React | 0.460.x | Ícones |
| next-intl | 4.x | Internacionalização |
| Sonner | 1.5.x | Notificações toast |

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Prisma | 7.5.x | ORM para PostgreSQL |
| PostgreSQL | - | Banco de dados relacional |
| better-auth | 1.2.x | Autenticação |
| Zod | - | Validação de schemas |

### Serviços Externos

| Serviço | Propósito |
|---------|-----------|
| MercadoPago | Processamento de pagamentos (PIX) |
| Resend | Envio de emails transacionais |
| MyMemory API | Tradução automática de conteúdo |

## Arquitetura do Projeto

```
rick-travel/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação (better-auth)
│   │   ├── bookings/             # CRUD de reservas
│   │   ├── trips/                # Listagem de passeios
│   │   ├── payments/             # Checkout e webhook MercadoPago
│   │   ├── analytics/            # Tracking de eventos
│   │   └── users/                # Gerenciamento de usuários
│   ├── [locale]/                 # Rotas internacionalizadas
│   │   ├── (public)/            # Páginas públicas
│   │   │   ├── page.tsx         # Home
│   │   │   ├── tours/           # Detalhes de passeios
│   │   │   ├── reservas/        # Reservas do usuário
│   │   │   ├── quem-somos/      # Sobre nós
│   │   │   └── contato/         # Formulário de contato
│   │   ├── admin/                # Painel administrativo (protegido)
│   │   ├── login/                # Login
│   │   └── register/            # Registro
│   └── actions/                  # Server Actions
├── components/                   # Componentes React
│   ├── ui/                       # Primitivos UI (Radix + Tailwind)
│   ├── trips/                    # Componentes de passeios
│   └── admin/                     # Componentes do admin
├── lib/                          # Lógica de negócio
│   ├── services/                 # Serviços (trip, booking, payment, etc.)
│   ├── auth.ts                   # Configuração better-auth
│   ├── prisma.ts                 # Cliente PostgreSQL
│   ├── schemas.ts                # Validação Zod
│   └── types.ts                  # Tipos TypeScript
├── i18n/                         # Configuração de i18n
│   ├── routing.ts               # Configuração de rotas
│   └── request.ts               # Handler de locale
├── messages/                     # Traduções estáticas
│   ├── pt.json                  # Português (default)
│   ├── en.json                  # Inglês
│   ├── es.json                  # Espanhol
│   └── sv.json                  # Sueco
├── prisma/                       # Schema e migrações
│   ├── schema.prisma            # Modelos do banco
│   └── migrations/              # Histórico de migrações
└── public/                       # Assets estáticos
```

## Banco de Dados

### Modelos Principais

| Modelo | Descrição |
|--------|-----------|
| `User` | Usuários com roles (USER/ADMIN) |
| `Session` | Sessões de autenticação |
| `Trip` | Passeios com campos multilíngues |
| `TripSchedule` | Horários disponíveis por passeio |
| `Booking` | Reservas dos usuários |
| `PaymentAttempt` | Tentativas de pagamento |
| `AnalyticsEvent` | Eventos de analytics |
| `ContactSubmission` | Formulários de contato |

### Fluxo de Reserva

1. Usuário seleciona passeio e opcionalmente horário
2. Booking criado com status `PENDING`
3. Pagamento iniciado via MercadoPago PIX
4. Webhook confirma pagamento
5. Status do booking atualizado para `CONFIRMED`
6. Email de confirmação enviado via Resend

## Internacionalização

O sistema suporta 4 idiomas:
- **PT** - Português (padrão)
- **EN** - English
- **ES** - Español
- **SV** - Svenska

### Estratégia de Tradução

1. **UI Estática**: Traduções em `messages/*.json`
2. **Conteúdo Dinâmico**: Campos JSON no banco com chaves de locale
3. **Auto-tradução**: API MyMemory para traduzir conteúdo de passeios
4. **Fallback**: Português quando tradução falha

## Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5433/ricktravel"

# Autenticação
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="sua-chave-secreta"

# MercadoPago
MP_ACCESS_TOKEN="seu-token-mercadopago"
MP_WEBHOOK_SECRET="webhook-secret"

# Resend (Email)
RESEND_API_KEY="sua-api-key-resend"

# API Externa (opcional)
BETTER_AUTH_URL="http://localhost:3000"
```

## Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

## Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting
```

## Fluxo de Pagamento

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Booking   │───▶│   Checkout   │───▶│ MercadoPago │
│  (PENDING)  │    │    API       │    │    PIX      │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                                │
                      ┌──────────────┐          │
                      │   Webhook    │◀─────────┘
                      │  Handler     │
                      └──────┬───────┘
                             │
                      ┌──────▼───────┐
                      │   Booking    │
                      │ (CONFIRMED)  │
                      └──────┬───────┘
                             │
                      ┌──────▼───────┐
                      │    Email     │
                      │   (Resend)   │
                      └──────────────┘
```

## API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/[...all]` | GET/POST | Handlers de autenticação |
| `/api/trips` | GET | Lista passeios publicados |
| `/api/trips/[id]` | GET | Detalhes do passeio |
| `/api/bookings` | GET/POST | Reservas do usuário |
| `/api/bookings/[id]` | DELETE | Cancelar reserva |
| `/api/payments/checkout` | POST | Iniciar pagamento |
| `/api/payments/webhook` | POST | Webhook MercadoPago |
| `/api/analytics` | POST | Registrar evento |

## Segurança

- **Autenticação**: better-auth com sessões (24h, refresh 30min)
- **Autorização**: Middleware para rotas admin
- **Validação**: Zod schemas em todas as entradas
- **CSRF**: Proteção nativa do better-auth

## Licença

Privado - Todos os direitos reservados.