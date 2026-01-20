# 🚀 Guia Completo de Deploy - ImobCheck

## ✅ Status do Projeto
- ✅ Supabase configurado e ativo
- ✅ Database criado com todas as tabelas
- ✅ Usuário admin criado
- ⚠️ Variáveis de ambiente pendentes
- ⚠️ Deploy no Vercel pendente

---

## 📋 Checklist de Configuração

### 1️⃣ Obter SUPABASE_SERVICE_ROLE_KEY

**Passos:**
1. Acesse: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
2. Na seção "Project API keys", localize **"service_role" (secret)**
3. Clique em "Reveal" e copie a chave
4. Essa chave começa com `eyJ...` e é bem longa

**⚠️ IMPORTANTE:** Esta chave dá acesso total ao banco de dados. Nunca a compartilhe ou commite no git!

---

### 2️⃣ Configurar Resend (Email)

**Passos:**

#### A) Criar conta e obter API Key
1. Acesse: https://resend.com
2. Crie uma conta gratuita (até 3.000 emails/mês grátis)
3. Faça login no dashboard: https://resend.com/dashboard
4. Vá em **"API Keys"**
5. Clique em **"Create API Key"**
   - Nome: `ImobCheck Production`
   - Permissões: `Sending access`
6. Copie a API key (começa com `re_...`)

#### B) Configurar Domínio (Opcional mas Recomendado)
1. No dashboard do Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `suaempresa.com.br`)
4. Copie os registros DNS fornecidos:
   - **SPF** (TXT)
   - **DKIM** (TXT)
   - **DMARC** (TXT)
5. Adicione esses registros no seu provedor de DNS
6. Aguarde verificação (pode levar até 48h)

#### C) Definir Emails
Se você tem domínio próprio verificado:
- `EMAIL_FROM=alertas@suaempresa.com.br`
- `EMAIL_TO=gestao@suaempresa.com.br`

Se não tiver domínio verificado (para testes):
- `EMAIL_FROM=onboarding@resend.dev` (email de teste do Resend)
- `EMAIL_TO=seu-email@hotmail.com` (seu email pessoal)

---

### 3️⃣ Configurar Vista API

**Opção 1: Usar Sandbox (Testes)**
```
VISTA_API_KEY=SEU_API_KEY_DE_TESTE
VISTA_API_URL=http://sandbox-rest.vistahost.com.br
```

**Opção 2: Usar Produção**
```
VISTA_API_KEY=SEU_API_KEY_DE_PRODUCAO
VISTA_API_URL=https://api.vistahost.com.br
```

**Para obter a API Key:**
1. Acesse o portal do Vista/Loft: https://portal.vistahost.com.br
2. Faça login com suas credenciais
3. Vá em **Configurações** > **Integrações** > **API**
4. Copie sua API Key

**Se você não tem acesso ao Vista ainda:**
- Deixe temporariamente como placeholder
- O webhook não funcionará até configurar

---

### 4️⃣ Gerar Webhook Secret

Execute este comando no PowerShell para gerar um secret seguro:

```powershell
# Gerar um secret aleatório
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Ou use este exemplo seguro:
```
VISTA_WEBHOOK_SECRET=imobcheck_2026_vista_webhook_K7mP9nQ2xR5tY8wA
```

---

## 🔧 Passo a Passo: Atualizar .env.local

1. Abra o arquivo `.env.local` no editor
2. Substitua os placeholders pelas chaves reais obtidas acima:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://icpdejhjsgvhbecagcxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcGRlamhqc2d2aGJlY2FnY3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Njg0OTcsImV4cCI6MjA4NDQ0NDQ5N30.0-nla1OtKo4mnJqb9MF_LLgdUk_NmYMZ_3TXYQnkQf4
SUPABASE_SERVICE_ROLE_KEY=COLE_AQUI_A_SERVICE_ROLE_KEY

# Resend
RESEND_API_KEY=COLE_AQUI_SUA_API_KEY_DO_RESEND
EMAIL_FROM=alertas@suaempresa.com.br
EMAIL_TO=gestao@suaempresa.com.br

# Vista API
VISTA_API_KEY=COLE_AQUI_SUA_API_KEY_DO_VISTA
VISTA_API_URL=http://sandbox-rest.vistahost.com.br
VISTA_WEBHOOK_SECRET=COLE_AQUI_O_SECRET_GERADO

# Vercel Cron
CRON_SECRET=cron-secret-imobcheck-2026

# App URL (atualizar após deploy)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Salve o arquivo

---

## 🚀 Deploy no Vercel

### Passo 1: Instalar Vercel CLI (se ainda não tiver)

```powershell
npm install -g vercel
```

### Passo 2: Login no Vercel

```powershell
vercel login
```

Siga as instruções no navegador para fazer login.

### Passo 3: Deploy

```powershell
# Deploy de produção
vercel --prod
```

O comando vai:
1. Fazer build do projeto
2. Fazer deploy
3. Retornar a URL do projeto (ex: `https://imobcheck.vercel.app`)

**Anote a URL do deploy!**

---

## ⚙️ Configurar Variáveis de Ambiente no Vercel

### Opção 1: Via CLI (Mais Rápido)

Execute estes comandos após o deploy:

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole o valor: https://icpdejhjsgvhbecagcxd.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole o valor: eyJhbGc...

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Cole o valor da service role key

vercel env add RESEND_API_KEY production
# Cole o valor da API key do Resend

vercel env add EMAIL_FROM production
# Cole: alertas@suaempresa.com.br

vercel env add EMAIL_TO production
# Cole: gestao@suaempresa.com.br

vercel env add VISTA_API_KEY production
# Cole o valor da API key do Vista

vercel env add VISTA_API_URL production
# Cole: http://sandbox-rest.vistahost.com.br

vercel env add VISTA_WEBHOOK_SECRET production
# Cole o secret gerado

vercel env add CRON_SECRET production
# Cole: cron-secret-imobcheck-2026

vercel env add NEXT_PUBLIC_APP_URL production
# Cole a URL do seu deploy (ex: https://imobcheck.vercel.app)
```

Após adicionar todas as variáveis:
```powershell
# Refazer o deploy para aplicar as variáveis
vercel --prod
```

### Opção 2: Via Dashboard (Manual)

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **imobcheck**
3. Vá em **Settings** > **Environment Variables**
4. Para cada variável, clique em **Add New**:
   - Nome: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://icpdejhjsgvhbecagcxd.supabase.co`
   - Environment: `Production`
5. Repita para todas as variáveis listadas acima
6. Após adicionar todas, vá em **Deployments** > **Redeploy**

---

## 🪝 Configurar Webhook no Vista/Loft

### URL do Webhook
Após o deploy, sua URL do webhook será:
```
https://SEU-PROJETO.vercel.app/api/webhooks/vista
```

### Configuração no Painel Vista

1. Acesse: https://portal.vistahost.com.br
2. Vá em **Configurações** > **Webhooks** ou **Integrações**
3. Clique em **Adicionar Webhook** ou **Novo Webhook**
4. Preencha:
   - **URL**: `https://SEU-PROJETO.vercel.app/api/webhooks/vista`
   - **Método**: `POST`
   - **Secret** (se disponível): Use o mesmo valor de `VISTA_WEBHOOK_SECRET`
5. Selecione os eventos:
   - ✅ `imovel.criado`
   - ✅ `imovel.atualizado`
   - ✅ `lead.criado`
   - ✅ `lead.atualizado`
   - ✅ `cliente.criado`
   - ✅ `cliente.atualizado`
   - ✅ `negocio.criado`
   - ✅ `negocio.atualizado`
6. Salve a configuração

### Testar o Webhook

```powershell
# Teste básico
curl -X POST https://SEU-PROJETO.vercel.app/api/webhooks/vista `
  -H "Content-Type: application/json" `
  -d '{"event":"imovel.criado","data":{"id":"123","endereco":"Rua Teste, 123"}}'
```

Você deve receber uma resposta `200 OK`.

---

## 🧪 Testes Finais

### 1. Testar Dashboard
1. Acesse: `https://SEU-PROJETO.vercel.app/dashboard`
2. Faça login com:
   - Email: `hrrsnp@hotmail.com`
   - Senha: `10qp10qp`
3. Verifique se o dashboard carrega corretamente

### 2. Testar Cron Job
O cron está configurado para rodar às 8h UTC (5h horário de Brasília).

Para testar manualmente:
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"
```

Você deve receber um email com o relatório de auditoria (se houver dados).

### 3. Testar API de Matrícula
```powershell
curl https://SEU-PROJETO.vercel.app/api/matricula/check?matricula=12345
```

---

## 📝 Checklist Final

- [ ] Service Role Key obtida do Supabase
- [ ] Conta Resend criada e API key obtida
- [ ] Domínio configurado no Resend (opcional)
- [ ] Vista API key obtida
- [ ] Webhook secret gerado
- [ ] Arquivo `.env.local` atualizado
- [ ] Teste local funcionando (`npm run dev`)
- [ ] Deploy no Vercel realizado
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Webhook configurado no Vista/Loft
- [ ] Dashboard acessível e funcionando
- [ ] Cron job testado
- [ ] Webhook testado

---

## 🆘 Troubleshooting

### Erro: "Invalid API key" no Supabase
- Verifique se copiou a service role key completa
- Confirme que não há espaços extras no início/fim

### Erro: "Failed to send email" no Resend
- Verifique se a API key está correta
- Se usar domínio próprio, confirme que está verificado
- Use `onboarding@resend.dev` para testes se necessário

### Webhook não está recebendo eventos
- Confirme que a URL está correta no painel Vista
- Verifique os logs no Vercel: https://vercel.com/dashboard > Projeto > Logs
- Teste manualmente com curl primeiro

### Cron job não está executando
- Confirme que está em plano Vercel Pro ou superior (Hobby plans não têm cron)
- Verifique se o `CRON_SECRET` está configurado corretamente
- Veja logs de execução no Vercel

---

## 📊 Monitoramento

### Logs do Vercel
- Acesse: https://vercel.com/dashboard > Seu Projeto > Logs
- Filtre por função: `api/webhooks/vista` ou `api/cron/daily-audit`

### Logs do Supabase
- Acesse: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/logs/explorer

### Dashboard do Resend
- Acesse: https://resend.com/emails
- Veja status de emails enviados

---

## 🎉 Pronto!

Após completar todos os passos, seu sistema estará:
- ✅ Hospedado no Vercel
- ✅ Recebendo webhooks do Vista/Loft
- ✅ Enviando emails de alerta diários
- ✅ Com dashboard funcional

**URL do Dashboard**: https://SEU-PROJETO.vercel.app/dashboard

---

**Última atualização**: 2026-01-20
