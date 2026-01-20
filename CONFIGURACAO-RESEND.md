# 📧 Configuração Completa do Resend

## 🎯 Visão Geral

O Resend é o serviço de email usado para enviar alertas diários de anomalias detectadas no sistema.

**Plano Gratuito:**
- ✅ 3.000 emails/mês grátis
- ✅ 100 emails/dia grátis
- ✅ API completa
- ⚠️ Domínio verificado necessário para produção

---

## 🚀 Passo 1: Criar Conta

1. Acesse: https://resend.com
2. Clique em **"Sign Up"**
3. Escolha método de login:
   - GitHub
   - Google
   - Email
4. Confirme seu email
5. Complete o cadastro

---

## 🔑 Passo 2: Obter API Key

1. Faça login: https://resend.com/dashboard
2. No menu lateral, clique em **"API Keys"**
3. Clique em **"Create API Key"**
4. Preencha:
   - **Name:** `ImobCheck Production`
   - **Permission:** `Sending access`
   - **Domain:** (deixe em branco por enquanto, ou selecione se já configurou)
5. Clique em **"Add"**
6. **Copie a API Key** (começa com `re_...`)
   - ⚠️ Guarde em local seguro - só aparece uma vez!

**Exemplo de API Key:**
```
re_123456789_abcdefghijklmnopqrstuvwxyz
```

---

## 🌐 Passo 3: Configurar Domínio (Recomendado)

### Por que configurar domínio?

**Sem domínio verificado:**
- ✅ Pode enviar emails de teste
- ✅ Usa domínio `onboarding@resend.dev`
- ❌ Limite de 100 emails/dia
- ❌ Pode ir para spam
- ❌ Não recomendado para produção

**Com domínio verificado:**
- ✅ Envio ilimitado (dentro do plano)
- ✅ Melhor deliverability
- ✅ Email profissional (`alertas@suaempresa.com.br`)
- ✅ Menos chance de ir para spam

### Adicionar Domínio

1. No dashboard do Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `suaempresa.com.br`
4. Clique em **"Add"**

### Registros DNS Necessários

O Resend vai gerar 3 registros DNS que você precisa adicionar:

#### 1️⃣ SPF (Sender Policy Framework)
**Tipo:** TXT  
**Host:** `@` ou `suaempresa.com.br`  
**Valor:** `v=spf1 include:resend.com ~all`  
**TTL:** 3600 ou Auto

**Finalidade:** Autoriza o Resend a enviar emails em nome do seu domínio

#### 2️⃣ DKIM (DomainKeys Identified Mail)
**Tipo:** TXT  
**Host:** `resend._domainkey` ou `resend._domainkey.suaempresa.com.br`  
**Valor:** `k=rsa; p=MIGfMA0GCSq...` (fornecido pelo Resend)  
**TTL:** 3600 ou Auto

**Finalidade:** Assinatura digital para verificar autenticidade

#### 3️⃣ DMARC (Domain-based Message Authentication)
**Tipo:** TXT  
**Host:** `_dmarc` ou `_dmarc.suaempresa.com.br`  
**Valor:** `v=DMARC1; p=none; rua=mailto:dmarc@suaempresa.com.br`  
**TTL:** 3600 ou Auto

**Finalidade:** Política de autenticação e relatórios

---

## 🔧 Passo 4: Adicionar Registros no seu Provedor DNS

### Provedores Comuns

<details>
<summary>📘 Registro.br</summary>

1. Acesse: https://registro.br
2. Faça login
3. Vá em **"Servidores DNS"**
4. Clique no domínio
5. Adicione cada registro TXT:
   - **Nome:** (conforme indicado acima)
   - **Tipo:** TXT
   - **Dados:** (valor fornecido pelo Resend)
   - **TTL:** 3600
6. Clique em **"Salvar"**
7. Aguarde propagação (até 48h, geralmente 1-2h)

</details>

<details>
<summary>📗 GoDaddy</summary>

1. Acesse: https://dcc.godaddy.com/manage/dns
2. Selecione seu domínio
3. Clique em **"Add"** > **"TXT"**
4. Preencha:
   - **Name:** (host fornecido)
   - **Value:** (valor fornecido)
   - **TTL:** 3600
5. Repita para cada registro
6. Clique em **"Save"**

</details>

<details>
<summary>📙 Cloudflare</summary>

1. Acesse: https://dash.cloudflare.com
2. Selecione seu domínio
3. Vá em **"DNS"** > **"Records"**
4. Clique em **"Add record"**
5. Preencha:
   - **Type:** TXT
   - **Name:** (host fornecido)
   - **Content:** (valor fornecido)
   - **TTL:** Auto
   - **Proxy status:** 🔴 DNS only (importante!)
6. Repita para cada registro
7. Clique em **"Save"**

</details>

<details>
<summary>📕 Hostgator / Locaweb</summary>

1. Acesse o cPanel
2. Vá em **"Zone Editor"** ou **"Editor de Zona DNS"**
3. Selecione seu domínio
4. Clique em **"Manage"** ou **"Gerenciar"**
5. Adicione registro TXT:
   - **Name:** (host fornecido)
   - **Type:** TXT
   - **Record:** (valor fornecido)
   - **TTL:** 14400
6. Repita para cada registro
7. Clique em **"Add Record"**

</details>

---

## ✅ Passo 5: Verificar Domínio

1. Volte ao dashboard do Resend
2. Vá em **"Domains"**
3. Clique no seu domínio
4. Aguarde o status mudar:
   - 🟡 **Pending** - Aguardando propagação DNS
   - 🟢 **Verified** - Domínio verificado e pronto!

**Tempo de verificação:**
- Mínimo: 5-10 minutos
- Máximo: 48 horas
- Geralmente: 1-2 horas

**Se não verificar após 24h:**
1. Verifique se os registros estão corretos
2. Use ferramenta de verificação DNS: https://mxtoolbox.com/SuperTool.aspx
3. Confira se não há registros duplicados
4. Entre em contato com suporte do provedor DNS

---

## 📝 Passo 6: Configurar Variáveis no .env.local

### Com Domínio Verificado

```env
RESEND_API_KEY=re_sua_api_key_aqui
EMAIL_FROM=alertas@suaempresa.com.br
EMAIL_TO=gestao@suaempresa.com.br
```

### Sem Domínio (Testes)

```env
RESEND_API_KEY=re_sua_api_key_aqui
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=seu.email@gmail.com
```

**Notas:**
- `EMAIL_FROM` deve usar domínio verificado ou `onboarding@resend.dev`
- `EMAIL_TO` pode ser qualquer email válido
- Você pode usar múltiplos destinatários separados por vírgula

---

## 🧪 Passo 7: Testar Envio

### Teste Local

1. Certifique-se que o servidor está rodando:
```powershell
npm run dev
```

2. Crie um arquivo de teste `test-email.js`:

```javascript
// test-email.js
const { Resend } = require('resend');

const resend = new Resend('re_sua_api_key_aqui');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'alertas@suaempresa.com.br',
      to: 'seu.email@gmail.com',
      subject: '🧪 Teste ImobCheck',
      html: '<h1>Email de Teste</h1><p>Se você recebeu este email, a configuração está correta!</p>'
    });

    console.log('✅ Email enviado com sucesso!');
    console.log('ID:', data.id);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testEmail();
```

3. Execute:
```powershell
node test-email.js
```

### Teste via API do Projeto

```powershell
# Forçar envio de relatório diário (após deploy)
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"
```

---

## 📊 Monitoramento de Emails

### Dashboard do Resend

1. Acesse: https://resend.com/emails
2. Veja todos os emails enviados:
   - ✅ **Delivered** - Entregue com sucesso
   - 🟡 **Queued** - Na fila de envio
   - ❌ **Failed** - Falhou (veja motivo)
   - 📭 **Bounced** - Email não existe
   - 🚫 **Complained** - Marcado como spam

### Filtros Úteis

- **Status:** Delivered, Failed, Bounced
- **To:** Filtrar por destinatário
- **Subject:** Filtrar por assunto
- **Date:** Filtrar por período

### Webhooks (Opcional)

Configure webhooks no Resend para receber notificações em tempo real:

1. Dashboard > **Webhooks**
2. Add endpoint: `https://SEU-PROJETO.vercel.app/api/webhooks/resend`
3. Eventos:
   - `email.sent`
   - `email.delivered`
   - `email.bounced`
   - `email.complained`

---

## 🔍 Troubleshooting

### ❌ Erro: "Invalid API key"

**Causa:** API key incorreta ou expirada

**Solução:**
1. Verifique se copiou a key completa
2. Confirme que não há espaços no início/fim
3. Gere nova API key se necessário

---

### ❌ Erro: "Domain not verified"

**Causa:** Tentando usar domínio não verificado

**Solução:**
1. Use `onboarding@resend.dev` para testes
2. Ou aguarde verificação do domínio
3. Verifique registros DNS com mxtoolbox.com

---

### ❌ Email indo para SPAM

**Causas possíveis:**
- Domínio não verificado
- SPF/DKIM/DMARC não configurados
- Conteúdo suspeito
- IP do Resend bloqueado (raro)

**Soluções:**
1. ✅ Configure SPF, DKIM e DMARC corretamente
2. ✅ Use domínio verificado
3. ✅ Evite palavras spam: "ganhe", "grátis", "clique aqui"
4. ✅ Inclua texto simples além do HTML
5. ✅ Adicione link de unsubscribe
6. ✅ Aqueça o domínio (envie gradualmente no início)

---

### ❌ Erro: "Rate limit exceeded"

**Causa:** Excedeu limite de envios

**Limites do plano gratuito:**
- 100 emails/dia
- 3.000 emails/mês

**Solução:**
1. Aguarde 24h para reset do limite diário
2. Upgrade para plano pago se necessário
3. Otimize envios (consolidar múltiplos alertas)

---

### 📧 Email não chegou

**Checklist:**
1. ✅ Verifique pasta de SPAM
2. ✅ Confirme email destinatário correto
3. ✅ Veja status no dashboard Resend
4. ✅ Verifique logs do Vercel
5. ✅ Teste com outro email (Gmail, Outlook)

---

## 💰 Planos e Preços

### Free (Gratuito)
- ✅ 3.000 emails/mês
- ✅ 100 emails/dia
- ✅ 1 domínio verificado
- ✅ Suporte comunidade

### Pro ($20/mês)
- ✅ 50.000 emails/mês
- ✅ Envios ilimitados/dia
- ✅ Domínios ilimitados
- ✅ Suporte prioritário
- ✅ Analytics avançado

Para o ImobCheck:
- **Estimativa:** 1 email/dia = 30 emails/mês
- **Recomendação:** Plano Free é suficiente ✅

---

## 📚 Recursos Adicionais

### Documentação
- **Getting Started:** https://resend.com/docs/introduction
- **API Reference:** https://resend.com/docs/api-reference
- **Node.js SDK:** https://resend.com/docs/send-with-nodejs

### Ferramentas
- **DNS Checker:** https://mxtoolbox.com
- **Email Tester:** https://www.mail-tester.com
- **SPF Validator:** https://www.kitterman.com/spf/validate.html

### Suporte
- **Discord:** https://resend.com/discord
- **Email:** support@resend.com
- **Status:** https://status.resend.com

---

## ✅ Checklist Final

- [ ] Conta Resend criada
- [ ] API Key gerada e copiada
- [ ] Domínio adicionado no Resend (opcional)
- [ ] Registros DNS configurados (se domínio próprio)
- [ ] Domínio verificado no Resend (status verde)
- [ ] Variáveis configuradas no .env.local:
  - [ ] `RESEND_API_KEY`
  - [ ] `EMAIL_FROM`
  - [ ] `EMAIL_TO`
- [ ] Teste de envio realizado com sucesso
- [ ] Email recebido (não foi para spam)

---

## 📞 Precisa de Ajuda?

1. **Erro na configuração:** Verifique SETUP-COMPLETO.md
2. **Problemas DNS:** Entre em contato com provedor DNS
3. **Problemas Resend:** Acesse Discord ou suporte
4. **Problemas no código:** Verifique logs do Vercel

---

**Última atualização:** 2026-01-20
**Tempo estimado:** 15-30 minutos (+ espera DNS)
