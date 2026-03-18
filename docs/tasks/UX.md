# Rick Travel — Documento de UX (doc.md)

Agência receptiva no Rio de Janeiro • Busca, descoberta e reserva de passeios com guia credenciado

## 1) Objetivo do produto

Permitir que turistas encontrem passeios/experiências no Rio de Janeiro, entendam rapidamente o que está incluso e façam:

- **Reserva direta** (fluxo de checkout)
- **Solicitação de orçamento** (WhatsApp — fluxo conversacional)
- **Gestão de reservas** (Minhas reservas)

## 2) Objetivos de UX

1. Reduzir fricção até “Reservar” (menos cliques e menos dúvidas).
2. Aumentar confiança (prova social, segurança, guia credenciado, política de cancelamento).
3. Tornar a busca global realmente útil (encontrar “qualquer coisa” no site).
4. Cobrir bem estados do sistema: logado/deslogado, sem reservas/com reservas, sem resultados, erro de pagamento (futuro).

## 3) Público-alvo (personas rápidas)

- **Turista de primeira viagem**: quer “pontos clássicos”, segurança, guia e avaliações.
- **Turista em casal/família**: precisa saber duração, nível de esforço, acessibilidade e logística.
- **Turista “última hora”**: quer disponibilidade rápida, WhatsApp e confirmação fácil.

## 4) Arquitetura de informação (IA) e páginas

### Navegação principal

- Home
- Quem somos
- Nossos tours (listagem)
- Contatos
- Minhas reservas (área do cliente)
- Login/Logout + Idioma + Tema

### Páginas-chave (MVP)

1. **Home**
2. **Listagem de passeios** (Nossos tours)
3. **Detalhes do passeio**
4. **Reserva / Checkout**
5. **Login / Criar conta**
6. **Minhas reservas**
7. **Contato**

## 5) Regras de UX e comportamento (importante para sua lógica)

### 5.1 Busca global (na Home e no topo)

Você disse que a barra “Buscar passeios…” é um **atalho para buscar qualquer coisa** no site.
**Recomendação de UX:**

- Trocar placeholder para: **“Buscar passeios, bairros, pontos turísticos…”**
- Exibir **auto-sugestões** ao digitar:
  - Passeios (ex: “Tour Praias”)
  - Categorias (ex: “Praias”, “Cristo”, “Pão de Açúcar”)
  - Bairros (ex: “Copacabana”, “Gávea”)
  - Páginas (ex: “Contatos”, “Quem somos”)
- Enter leva para uma página de resultados unificada:
  - Abas/segmentos: “Passeios”, “Pontos”, “Páginas”
- Se não houver resultados:
  - Mensagem + CTA: “Falar no WhatsApp para indicar um passeio”

### 5.2 CTA primário x secundário

Na Home existem 2 CTAs:

- **Primário**: “Reserve agora seu passeio”
- **Secundário**: “Solicitar orçamento” (WhatsApp)
  **Regras:**
- Primário sempre mais destacado (cor, tamanho, posição).
- Secundário com microcopy: “Respondo rápido no WhatsApp”.

### 5.3 “Minhas reservas” (estado vazio vs preenchido)

- Se **deslogado** e clicar em “Minhas reservas”:
  - Redireciona para Login, com mensagem: “Faça login para ver suas reservas.”
- Se **logado** e **sem reservas**:
  - Empty state com:
    - Texto: “Você ainda não tem reservas.”
    - CTA primário: “Encontrar passeios”
    - CTA secundário: “Solicitar orçamento no WhatsApp”
- Se **logado** e **com reservas**:
  - Lista de reservas com:
    - Status (Confirmada / Pendente / Cancelada)
    - Data e horário
    - Ponto de encontro
    - Botões: “Ver detalhes”, “Reagendar” (futuro), “Cancelar” (se aplicável), “Falar no WhatsApp”

## 6) Jornada do usuário (passo a passo)

### 6.1 Jornada A — Descobrir e reservar (usuário deslogado)

1. Usuário entra na **Home**
2. Vê headline + prova social (ex: “4,9 • 143 avaliações”, “Viagens seguras”)
3. Usa a **Busca global** OU clica em **“Reserve agora…”**
4. Vai para **Listagem de passeios**
5. Clica em um card (“Reservar agora” ou no card)
6. Vai para **Detalhes do passeio**
7. Clica em **“Reservar”**
8. Sistema abre a **Reserva/Checkout** (etapa 1) com dados do passeio
9. Ao tentar **confirmar** (ou ao preencher dados pessoais), o sistema pede:
   - “Entrar” ou “Criar conta” (login leve)
10. Após login, retorna automaticamente ao checkout onde parou
11. Confirma reserva → vê “Reserva confirmada” + link para “Minhas reservas”

**Por que pedir login mais tarde?**

- Menos abandono no começo do funil. O usuário só cria conta quando já decidiu reservar.

### 6.2 Jornada B — Reservar (usuário já logado)

1. Home/Listagem → Detalhes
2. Clica “Reservar”
3. Checkout abre já preenchendo nome/e-mail (se existir)
4. Confirma → sucesso
5. “Minhas reservas” mostra a nova reserva

### 6.3 Jornada C — Solicitar orçamento via WhatsApp

1. Home/Detalhes → CTA “Solicitar orçamento”
2. Abre WhatsApp com mensagem pré-preenchida:
   - “Olá! Quero orçamento para [Nome do passeio] em [data]. Somos [qtd pessoas].”
3. Internamente, você responde e fecha a venda manualmente (MVP)
4. (Futuro) Registrar lead no painel/CRM

### 6.4 Jornada D — “Minhas reservas” sem reserva

1. Usuário logado entra em Minhas reservas
2. Vê empty state com CTA “Encontrar passeios”
3. Vai para Listagem e segue a jornada A/B

## 7) Requisitos por tela (UX)

### 7.1 Home

**Conteúdo essencial**

- Headline objetiva + subheadline (confiança): “Passeios no Rio com guia credenciado”
- Busca global com label visível (não depender só de placeholder)
- CTA primário: “Ver passeios”
- CTA secundário: “Solicitar orçamento (WhatsApp)”
- Prova social: avaliações, número de tours, selos de segurança

**Melhorias recomendadas**

- Tornar claro que a busca é “global”
- Reduzir competição visual entre botões (um primário, outro secundário)
- Acessibilidade: contraste do texto no hero e tamanho mínimo do texto

### 7.2 Listagem de passeios (Nossos tours / Passeios disponíveis)

**Conteúdo por card**

- Nome do passeio (sem erros de digitação)
- Local/Região (copacabana, gávea etc.)
- Duração (ex: 1 dia)
- Nível (leve, moderado…)
- Capacidade máxima
- Datas (se forem fixas) OU “Disponibilidade” (se for flexível)
- Preço por pessoa
- CTA: “Reservar agora”
- Link secundário: “Ver detalhes”

**Padrões de UX**

- Adicionar filtros/ordenar (mesmo simples no MVP):
  - Ordenar: “Mais populares”, “Menor preço”, “Melhor avaliação”
  - Filtros: Bairro/Região, Duração, Nível, Faixa de preço
- Estado “Sem resultados” com sugestões e CTA WhatsApp

### 7.3 Detalhes do passeio

**Objetivo:** tirar dúvidas e aumentar confiança.
Seções recomendadas:

- Galeria de fotos
- Resumo (3 bullets): “Duração • Inclui • Ponto de encontro”
- O que está incluso / não incluso
- Itinerário
- O que levar / dicas
- Política de cancelamento
- Avaliações
- CTA fixo (desktop: lateral; mobile: sticky bottom):
  - “Reservar”
  - “Solicitar orçamento”

### 7.4 Reserva / Checkout (MVP)

**Etapas (simples e claras)**

1. **Selecionar data e quantidade**

- Data (calendário)
- Nº de pessoas
- Pickup? (se existir)
- Idioma do guia (se houver opção)

2. **Se identificar**

- Se logado: mostrar dados e permitir editar
- Se deslogado: modal/página com:
  - Entrar
  - Criar conta
  - (Opcional futuro) continuar como convidado + confirmar via e-mail

3. **Revisão e confirmação**

- Resumo do pedido
- Total
- Botão “Confirmar reserva”
- Mensagem de segurança/confiança

**Estados e mensagens**

- Erro de validação (ex: data inválida)
- Sem disponibilidade (mostrar alternativas)
- Sucesso: “Reserva confirmada” + CTA “Ver em Minhas reservas”

### 7.5 Login / Criar conta

**MVP**

- Email + senha
- Link “Esqueci minha senha”
- Login social (futuro)
- Após login, voltar para a página anterior (principalmente checkout)

### 7.6 Minhas reservas

**Lista**

- Cards com status e detalhes principais
- CTA “Ver detalhes”
- CTA “Falar no WhatsApp” (suporte, dúvidas, reagendamento)

**Empty state**

- Texto amigável
- CTA “Explorar passeios”
- CTA WhatsApp

## 8) Conteúdo e UX Writing (microcopy sugerido)

- Busca: “Buscar passeios, pontos turísticos ou páginas…”
- CTA primário: “Ver passeios”
- CTA reserva: “Reservar agora”
- WhatsApp: “Solicitar orçamento no WhatsApp”
- Minhas reservas vazio: “Você ainda não tem reservas. Que tal explorar os passeios do Rio?”

## 9) Acessibilidade e consistência

- Campos de formulário com **label visível** (não só placeholder).
- Foco visível (teclado) e estados de hover/pressed.
- Contraste adequado em botões e textos no hero.
- Tamanhos mínimos: 16px para texto base, alvos de toque confortáveis no mobile.

## 10) Métricas (para guiar melhorias)

Eventos recomendados:

- search_started / search_submitted
- tour_card_clicked
- tour_detail_viewed
- reserve_clicked
- checkout_started
- login_prompt_shown
- login_success
- reservation_confirmed
- whatsapp_quote_clicked

## 11) Backlog (próximas melhorias)

- Filtros avançados + ordenação
- Disponibilidade em calendário por passeio
- Favoritos (ícone coração) conectado a uma lista “Salvos”
- Multi-idioma real (PT/EN/ES)
- Área do cliente com cancelamento/reagendamento
