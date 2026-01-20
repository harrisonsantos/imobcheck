# ⚡ Guia Rápido - Deploy ImobCheck

**Tempo estimado: 20-30 minutos** (+ tempo de espera para DNS)

---

## 📋 Checklist Rápido

```
[ ] 1. Obter Service Role Key do Supabase (2 min)
[ ] 2. Criar conta Resend + API Key (5 min)
[ ] 3. Obter API Key do Vista (5 min)
[ ] 4. Atualizar .env.local (2 min)
[ ] 5. Fazer deploy no Vercel (5 min)
[ ] 6. Configurar variáveis no Vercel (5 min)
[ ] 7. Configurar webhook no Vista (3 min)
[ ] 8. Testar tudo (5 min)
```

---

## 🚀 Comandos Rápidos

### 1️⃣ Obter Service Role Key

**Acesse:**
```
https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
```

Copie a **"service_role" key** (secret)

---

### 2️⃣ Criar Conta Resend

**Acesse:**
```
https://resend.com
```

1. Sign up com GitHub/Google
2. Vá em "API Keys" > "Create API Key"
3. Nome: `ImobCheck Production`
4. Copie a key (começa com `re_...`)

**Para testes rápidos**, use:
- `EMAIL_FROM=onboarding@resend.dev`
- `EMAIL_TO=seu.email@gmail.com`

---

### 3️⃣ Vista API (Opcional)

Se você ainda não tem acesso ao Vista, deixe como placeholder por enquanto:
- `VISTA_API_KEY=SEU_VISTA_API_KEY_AQUI`
- `VISTA_API_URL=http://sandbox-rest.vistahost.com.br`

**Gerar Webhook Secret:**
```powershell
# Cole no PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

### 4️⃣ Atualizar .env.local

Abra `.env.local` e preencha:

```env
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=https://icpdejhjsgvhbecagcxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcGRlamhqc2d2aGJlY2FnY3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Njg0OTcsImV4cCI6MjA4NDQ0NDQ5N30.0-nla1OtKo4mnJqb9MF_LLgdUk_NmYMZ_3TXYQnkQf4

# COLE AQUI 👇
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Resend - COLE AQUI 👇
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=seu.email@gmail.com

# Vista - pode deixar assim por enquanto
VISTA_API_KEY=SEU_VISTA_API_KEY_AQUI
VISTA_API_URL=http://sandbox-rest.vistahost.com.br
VISTA_WEBHOOK_SECRET=sua_chave_gerada_acima

# Já configurado
CRON_SECRET=cron-secret-imobcheck-2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 5️⃣ Testar Local (Opcional mas Recomendado)

```powershell
# Instalar dependências (se ainda não fez)
npm install

# Rodar localmente
npm run dev

# Abrir navegador
start http://localhost:3000/dashboard
```

**Login:**
- Email: `hrrsnp@hotmail.com`
- Senha: `10qp10qp`

---

### 6️⃣ Deploy no Vercel

```powershell
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login
vercel login

# Build de teste
npm run build

# Deploy de produção
vercel --prod
```

**Anote a URL do deploy!**  
Exemplo: `https://imobcheck-xyz.vercel.app`

---

### 7️⃣ Configurar Variáveis no Vercel

**Opção A: Script Automático (Recomendado)**

```powershell
# Executar script de deploy
.\deploy.ps1
```

O script vai:
- ✅ Verificar .env.local
- ✅ Fazer build
- ✅ Fazer deploy
- ✅ Configurar todas as variáveis
- ✅ Fazer redeploy

---

**Opção B: Manual via CLI**

```powershell
# Adicionar cada variável
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://icpdejhjsgvhbecagcxd.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: eyJhbGc...

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Cole: eyJhbG... (service role key)

vercel env add RESEND_API_KEY production
# Cole: re_...

vercel env add EMAIL_FROM production
# Cole: onboarding@resend.dev

vercel env add EMAIL_TO production
# Cole: seu.email@gmail.com

vercel env add VISTA_API_KEY production
# Cole: SEU_VISTA_API_KEY_AQUI

vercel env add VISTA_API_URL production
# Cole: http://sandbox-rest.vistahost.com.br

vercel env add VISTA_WEBHOOK_SECRET production
# Cole: seu_secret_gerado

vercel env add CRON_SECRET production
# Cole: cron-secret-imobcheck-2026

vercel env add NEXT_PUBLIC_APP_URL production
# Cole: https://SEU-PROJETO.vercel.app

# Redeploy para aplicar
vercel --prod
```

---

**Opção C: Manual via Dashboard**

1. Acesse: https://vercel.com/dashboard
2. Selecione projeto **imobcheck**
3. Settings > Environment Variables
4. Adicione todas as variáveis do .env.local
5. Deployments > Redeploy

---

### 8️⃣ Atualizar APP_URL

Após o deploy, atualize:

```powershell
# Atualizar no Vercel
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Cole: https://SEU-PROJETO.vercel.app

# Redeploy
vercel --prod
```

---

### 9️⃣ Configurar Webhook Vista

**URL do Webhook:**
```
https://SEU-PROJETO.vercel.app/api/webhooks/vista
```

**No painel Vista:**
1. Acesse: https://portal.vistahost.com.br
2. Configurações > Webhooks
3. Adicionar Webhook com a URL acima
4. Selecione eventos: imovel.*, lead.*, cliente.*, negocio.*
5. Secret: use o mesmo de `VISTA_WEBHOOK_SECRET`

**Se não tiver acesso ao painel, envie email para:**
- suporte@vistahost.com.br
- Veja template em: `WEBHOOK-VISTA.md`

---

## 🧪 Testes

### Testar Dashboard

```
https://SEU-PROJETO.vercel.app/dashboard
```

**Login:**
- Email: `hrrsnp@hotmail.com`
- Senha: `10qp10qp`

---

### Testar Webhook

```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/webhooks/vista `
  -H "Content-Type: application/json" `
  -d '{
    "event_type": "imovel.criado",
    "data": {
      "Codigo": "123",
      "Endereco": "Rua Teste, 123",
      "Categoria": "Apartamento",
      "ValorVenda": 500000
    }
  }'
```

**Resposta esperada:**
```json
{"success":true}
```

---

### Testar Cron Job (Email)

```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"
```

**Deve enviar email para o `EMAIL_TO` configurado.**

---

## 📊 Monitoramento

### Ver Logs do Vercel
```
https://vercel.com/dashboard > Projeto > Logs
```

### Ver Dados no Supabase
```
https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/editor
```

### Ver Emails Enviados
```
https://resend.com/emails
```

---

## ❌ Problemas Comuns

### Build Falhou
```powershell
# Limpar cache
rm -r .next
rm -r node_modules
npm install
npm run build
```

### Variável não encontrada
```powershell
# Listar variáveis configuradas
vercel env ls

# Verificar específica
vercel env pull
```

### 401 Unauthorized no Cron
- Verifique se `CRON_SECRET` está correto no Vercel
- Use `Bearer` no Authorization header

### Webhook retorna 500
- Verifique logs no Vercel
- Confirme `SUPABASE_SERVICE_ROLE_KEY` está correto

---

## 📚 Documentação Completa

Consulte estes arquivos para detalhes:

- **SETUP-COMPLETO.md** - Guia completo passo a passo
- **CONFIGURACAO-RESEND.md** - Como configurar email
- **WEBHOOK-VISTA.md** - Como configurar webhook Vista
- **CONFIGURACAO.md** - Visão geral do projeto

---

## ✅ Checklist Final

- [ ] Service Role Key obtida e configurada
- [ ] Resend API Key obtida e configurada
- [ ] .env.local preenchido
- [ ] Build local funcionando
- [ ] Deploy no Vercel concluído
- [ ] Variáveis configuradas no Vercel
- [ ] Redeploy realizado
- [ ] Dashboard acessível e funcionando
- [ ] Webhook testado (se Vista configurado)
- [ ] Cron job testado (email recebido)

---

## 🎉 Pronto!

**URLs Importantes:**

- 🌐 **Seu App:** `https://SEU-PROJETO.vercel.app`
- 📊 **Dashboard:** `https://SEU-PROJETO.vercel.app/dashboard`
- 🪝 **Webhook:** `https://SEU-PROJETO.vercel.app/api/webhooks/vista`
- ⚙️ **Vercel:** https://vercel.com/dashboard
- 🗄️ **Supabase:** https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- 📧 **Resend:** https://resend.com/emails

**Credenciais Dashboard:**
- Email: `hrrsnp@hotmail.com`
- Senha: `10qp10qp`

---

**Tempo total:** ~20-30 minutos  
**Próximo passo:** Configurar domínio próprio no Resend (opcional)

---

*Última atualização: 2026-01-20*
