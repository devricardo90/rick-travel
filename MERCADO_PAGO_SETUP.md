# Setup Mercado Pago

## O que voce precisa fazer na conta

1. Criar ou acessar sua aplicacao no Mercado Pago Developers.
2. Obter o `Access Token` do ambiente desejado:
   - teste para homologacao
   - producao para ambiente real
3. Garantir que a conta tenha Pix habilitado.
4. Configurar a URL de webhook apontando para:
   - `https://SEU_DOMINIO/api/payments/webhook`
5. Copiar o segredo de assinatura do webhook, se voce quiser validar a assinatura no backend.

## Variaveis de ambiente necessarias

Adicione no `.env` ou no provedor de deploy:

```env
MP_ACCESS_TOKEN=APP_USR-OU-TEST-EXAMPLE
MP_WEBHOOK_SECRET=opcional_se_voce_validar_assinatura
BETTER_AUTH_URL=https://seu-dominio.com
```

## Observacoes importantes

- em desenvolvimento local, o webhook do Mercado Pago precisa de uma URL publica
- para isso, use um tunnel como `ngrok` ou `cloudflared`
- sem webhook funcional, o pagamento pode ser criado, mas a reserva nao muda automaticamente para `CONFIRMED`

## Fluxo implementado no projeto

1. usuario cria reserva
2. reserva nasce `PENDING`
3. usuario entra em `Minhas reservas`
4. usuario clica em `Pagar`
5. sistema abre tela interna de Pix do Mercado Pago
6. usuario informa CPF e gera o pagamento
7. Mercado Pago envia webhook
8. backend consulta o pagamento no Mercado Pago
9. backend atualiza:
   - `paymentStatus = PAID`
   - `booking.status = CONFIRMED`
10. email de confirmacao e disparado

## Recomendacao de rollout

1. testar com credenciais de sandbox
2. validar criacao do Pix
3. validar recebimento do webhook
4. validar mudanca de status no booking
5. validar email de confirmacao
6. so depois trocar para credenciais de producao
