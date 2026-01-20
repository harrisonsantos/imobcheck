# 🪝 Configuração do Webhook Vista/Loft

## 📧 Email Template para Suporte Vista

**Para:** suporte@vistahost.com.br  
**Assunto:** Configuração de Webhook - ImobCheck

---

Prezado time Vista/Loft,

Gostaria de configurar um webhook para receber notificações de eventos do sistema em tempo real.

**Dados do Webhook:**

- **URL do Webhook:** `https://SEU-PROJETO.vercel.app/api/webhooks/vista`
- **Método HTTP:** POST
- **Content-Type:** application/json
- **Secret (opcional):** [seu webhook secret]

**Eventos desejados:**

- ✅ Imóveis:
  - `imovel.criado`
  - `imovel.atualizado`
  
- ✅ Leads:
  - `lead.criado`
  - `lead.atualizado`
  
- ✅ Clientes:
  - `cliente.criado`
  - `cliente.atualizado`
  
- ✅ Negócios:
  - `negocio.criado`
  - `negocio.atualizado`

**Formato esperado do payload:**

```json
{
  "event": "imovel.criado",
  "timestamp": "2026-01-20T10:30:00Z",
  "data": {
    "id": "123456",
    "matricula": "12345",
    "endereco": "Rua Exemplo, 123",
    ...
  }
}
```

Por favor, me informem se:
1. Existe algum formato específico de payload que vocês utilizam
2. Há algum header especial de autenticação
3. Qual o timeout máximo para resposta do webhook

Agradeço a atenção!

---

## 🔧 Configuração Manual (Se disponível no painel)

### Passo 1: Acessar Painel
1. Login: https://portal.vistahost.com.br
2. Navegue até **Configurações** ou **Integrações**

### Passo 2: Adicionar Webhook
Procure por:
- "Webhooks"
- "Notificações Push"
- "API Callbacks"
- "Event Notifications"

### Passo 3: Configurar
Campos comuns:

| Campo | Valor |
|-------|-------|
| Nome | ImobCheck Webhook |
| URL | `https://SEU-PROJETO.vercel.app/api/webhooks/vista` |
| Método | POST |
| Content-Type | application/json |
| Secret/Token | [seu VISTA_WEBHOOK_SECRET] |

### Passo 4: Selecionar Eventos
Marque todos os eventos relacionados a:
- Imóveis (criação e atualização)
- Leads (criação e atualização)
- Clientes (criação e atualização)
- Negócios (criação e atualização)

### Passo 5: Testar
Use o botão "Test" ou "Send Test Event" se disponível.

---

## 🧪 Testar o Webhook

### Teste 1: Health Check
```powershell
curl https://SEU-PROJETO.vercel.app/api/webhooks/vista
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Vista Webhook endpoint is ready"
}
```

### Teste 2: Evento de Teste
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/webhooks/vista `
  -H "Content-Type: application/json" `
  -d '{
    "event": "imovel.criado",
    "timestamp": "2026-01-20T10:30:00Z",
    "data": {
      "id": "TEST123",
      "matricula": "99999",
      "endereco": "Rua de Teste, 123",
      "cidade": "São Paulo",
      "estado": "SP",
      "valor": 500000
    }
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Evento processado com sucesso"
}
```

### Verificar Logs
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Logs**
4. Filtre por função: `/api/webhooks/vista`
5. Verifique se o evento foi recebido e processado

---

## 📊 Monitoramento do Webhook

### No Vercel
- **Logs**: https://vercel.com/dashboard > Projeto > Logs
- **Métricas**: https://vercel.com/dashboard > Projeto > Analytics

### No Supabase
Verificar eventos registrados:

```sql
-- Ver últimos eventos recebidos
SELECT 
  id,
  tipo,
  descricao,
  criado_em
FROM eventos
ORDER BY criado_em DESC
LIMIT 10;
```

---

## 🔐 Segurança do Webhook

### Validação de Assinatura (Se Vista suportar)

O webhook está preparado para validar assinaturas HMAC no header `X-Vista-Signature`.

**Como funciona:**
1. Vista gera HMAC-SHA256 do payload usando o secret
2. Envia hash no header `X-Vista-Signature`
3. Nosso webhook valida se o hash confere

**Exemplo de validação:**
```javascript
const crypto = require('crypto');
const signature = req.headers['x-vista-signature'];
const payload = JSON.stringify(req.body);
const hash = crypto
  .createHmac('sha256', process.env.VISTA_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (hash !== signature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### IP Whitelist (Opcional)
Se o Vista fornecer IPs fixos, você pode adicionar validação no webhook.

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado
- [ ] Confirme que salvou a configuração no painel Vista
- [ ] Verifique se a URL está correta (sem erros de digitação)
- [ ] Teste a URL manualmente com curl
- [ ] Verifique se o projeto Vercel está online

### Retornando erro 500
- [ ] Verifique os logs no Vercel
- [ ] Confirme que todas as variáveis de ambiente estão configuradas
- [ ] Teste o endpoint com payload de exemplo

### Retornando erro 401 (Unauthorized)
- [ ] Verifique se o `VISTA_WEBHOOK_SECRET` está configurado
- [ ] Confirme que o secret no Vista é o mesmo do .env
- [ ] Verifique o header `X-Vista-Signature`

### Eventos não estão sendo salvos no banco
- [ ] Verifique conexão com Supabase
- [ ] Confirme que `SUPABASE_SERVICE_ROLE_KEY` está correto
- [ ] Verifique logs do Supabase
- [ ] Execute query SQL para verificar tabela `eventos`

---

## 📝 Payload Examples (Referência)

### Evento: imovel.criado
```json
{
  "event": "imovel.criado",
  "timestamp": "2026-01-20T10:30:00Z",
  "data": {
    "id": "123456",
    "matricula": "12345",
    "codigo": "AP-001",
    "tipo": "Apartamento",
    "endereco": "Rua das Flores, 123",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Jardins",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "valor_venda": 850000.00,
    "valor_locacao": 4500.00,
    "area_util": 85.5,
    "quartos": 3,
    "suites": 1,
    "vagas": 2,
    "status": "Disponível",
    "proprietario_id": "789",
    "corretor_id": "456"
  }
}
```

### Evento: lead.criado
```json
{
  "event": "lead.criado",
  "timestamp": "2026-01-20T11:15:00Z",
  "data": {
    "id": "789012",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 98765-4321",
    "origem": "Site",
    "interesse": "Compra",
    "tipo_imovel": "Apartamento",
    "bairro_interesse": "Jardins",
    "valor_maximo": 900000.00,
    "corretor_id": "456",
    "status": "Novo"
  }
}
```

### Evento: negocio.atualizado
```json
{
  "event": "negocio.atualizado",
  "timestamp": "2026-01-20T14:45:00Z",
  "data": {
    "id": "345678",
    "imovel_id": "123456",
    "cliente_id": "789012",
    "corretor_id": "456",
    "tipo": "Venda",
    "valor_proposta": 820000.00,
    "valor_aprovado": 850000.00,
    "status_anterior": "Proposta Enviada",
    "status_atual": "Proposta Aceita",
    "observacoes": "Cliente aceitou proposta"
  }
}
```

---

## 🎯 Status Codes

Nosso webhook retorna:

| Status | Significado |
|--------|-------------|
| 200 | Evento processado com sucesso |
| 400 | Payload inválido ou malformado |
| 401 | Assinatura inválida (se aplicável) |
| 405 | Método HTTP não permitido (use POST) |
| 500 | Erro interno ao processar evento |

---

## 📞 Contatos

**Suporte Vista/Loft:**
- Email: suporte@vistahost.com.br
- Portal: https://portal.vistahost.com.br
- Documentação: https://api.vistahost.com.br/docs

**Em caso de problemas:**
1. Verifique logs do Vercel
2. Teste endpoint manualmente
3. Consulte SETUP-COMPLETO.md
4. Entre em contato com suporte Vista

---

**Última atualização:** 2026-01-20
