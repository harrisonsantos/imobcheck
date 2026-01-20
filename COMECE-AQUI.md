# 🚀 COMECE AQUI - ImobCheck

## ✅ Projeto Preparado para Deploy!

Seu projeto **ImobCheck** está completamente configurado e pronto para fazer deploy. Todos os guias e scripts necessários foram criados.

---

## 📋 O Que Foi Feito

✅ Projeto Supabase criado e configurado  
✅ Banco de dados com todas as tabelas  
✅ Usuário admin criado para o dashboard  
✅ Código corrigido e testado (build funcionando)  
✅ Guias completos de configuração criados  
✅ Scripts de automação de deploy criados  
✅ Arquivos de checklist e templates criados  

---

## 🎯 Próximos Passos (Para Você)

### 1️⃣ Ler o Guia Rápido (5 min)

Abra o arquivo **`GUIA-RAPIDO.md`** que contém:
- ✅ Checklist resumido
- ✅ Comandos prontos para copiar e colar
- ✅ URLs importantes
- ✅ Instruções passo a passo

### 2️⃣ Obter Credenciais (10-15 min)

Você precisa obter manualmente 3 credenciais:

#### A) Supabase Service Role Key
```
URL: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
Ação: Copiar a chave "service_role" (secret)
```

#### B) Resend API Key
```
URL: https://resend.com
Ações:
1. Criar conta (gratuita)
2. Ir em "API Keys"
3. Criar nova key
4. Copiar (começa com re_...)
```

#### C) Vista API Key (Opcional)
```
URL: https://portal.vistahost.com.br
Ação: Copiar API key do painel
(Se não tiver acesso, deixe como placeholder por enquanto)
```

### 3️⃣ Atualizar .env.local (2 min)

Abra o arquivo `.env.local` e preencha as 3 credenciais obtidas acima.

Use o arquivo `.env.example` como referência.

### 4️⃣ Fazer Deploy (5-10 min)

**Opção A: Automático (Recomendado)**
```powershell
.\deploy.ps1
```

**Opção B: Manual**
```powershell
npm install -g vercel
vercel login
npm run build
vercel --prod
```

### 5️⃣ Configurar Variáveis no Vercel (5 min)

O script `deploy.ps1` faz isso automaticamente.

Se preferir manual, veja instruções em **`GUIA-RAPIDO.md`**.

### 6️⃣ Configurar Webhook Vista (3 min)

Depois do deploy, configure o webhook no painel do Vista com a URL:
```
https://SEU-PROJETO.vercel.app/api/webhooks/vista
```

Instruções detalhadas em **`WEBHOOK-VISTA.md`**.

---

## 📚 Documentação Disponível

### 🏃 Para Deploy Rápido
- **[⚡ GUIA-RAPIDO.md](./GUIA-RAPIDO.md)** ← **COMECE AQUI!**
- **[✅ CHECKLIST.md](./CHECKLIST.md)** - Checklist detalhado com checkboxes

### 📖 Para Configuração Detalhada
- **[📖 SETUP-COMPLETO.md](./SETUP-COMPLETO.md)** - Guia completo com explicações
- **[📧 CONFIGURACAO-RESEND.md](./CONFIGURACAO-RESEND.md)** - Como configurar email
- **[🪝 WEBHOOK-VISTA.md](./WEBHOOK-VISTA.md)** - Como configurar webhook Vista

### 📋 Para Referência
- **[✅ CONFIGURACAO.md](./CONFIGURACAO.md)** - O que já foi configurado
- **[📘 README.md](./README.md)** - Visão geral do projeto
- **[.env.example](./.env.example)** - Template de variáveis

---

## 🔑 Informações Importantes

### Projeto Supabase
```
ID: icpdejhjsgvhbecagcxd
URL: https://icpdejhjsgvhbecagcxd.supabase.co
Região: São Paulo (sa-east-1)
Dashboard: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
```

### Usuário Dashboard
```
Email: hrrsnp@hotmail.com
Senha: 10qp10qp
```

### Custo
```
Supabase: $0/mês (Free Tier)
Vercel: $0/mês (Hobby Plan)
Resend: $0/mês (3.000 emails grátis)
Total: $0/mês ✅
```

---

## 🎯 Fluxo Recomendado

```
1. Leia GUIA-RAPIDO.md (5 min)
   ↓
2. Obtenha as 3 credenciais (10 min)
   ↓
3. Preencha .env.local (2 min)
   ↓
4. Execute .\deploy.ps1 (5 min)
   ↓
5. Configure webhook Vista (3 min)
   ↓
6. Teste tudo (5 min)
   ↓
✅ PRONTO! (Total: ~30 min)
```

---

## 🛠️ Scripts Disponíveis

### deploy.ps1
Script automatizado que:
- ✅ Verifica .env.local
- ✅ Instala Vercel CLI se necessário
- ✅ Faz login no Vercel
- ✅ Testa build local
- ✅ Faz deploy de produção
- ✅ Configura todas as variáveis de ambiente
- ✅ Faz redeploy para aplicar variáveis

**Uso:**
```powershell
.\deploy.ps1
```

---

## 🧪 Como Testar Após Deploy

### 1. Dashboard
```
URL: https://SEU-PROJETO.vercel.app/dashboard
Login: hrrsnp@hotmail.com / 10qp10qp
```

### 2. Webhook
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/webhooks/vista `
  -H "Content-Type: application/json" `
  -d '{"event_type":"imovel.criado","data":{"Codigo":"123"}}'
```

### 3. Cron Job (Email)
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"
```

---

## ❓ Precisa de Ajuda?

### Documentação por Tarefa

**Configurar Email:**
→ Leia `CONFIGURACAO-RESEND.md`

**Configurar Webhook:**
→ Leia `WEBHOOK-VISTA.md`

**Problemas no Deploy:**
→ Veja seção "Troubleshooting" em `GUIA-RAPIDO.md`

**Dúvidas sobre o Projeto:**
→ Leia `README.md` e `CONFIGURACAO.md`

### Links Úteis

- **Supabase:** https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- **Vercel:** https://vercel.com/dashboard
- **Resend:** https://resend.com/emails
- **Vista:** https://portal.vistahost.com.br

---

## 🎉 Está Pronto!

Seu projeto está **100% preparado** para deploy. Todos os arquivos estão corretos e o build está funcionando perfeitamente.

**Basta seguir o GUIA-RAPIDO.md e em 30 minutos estará no ar!**

---

## 📊 Resumo de Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `GUIA-RAPIDO.md` | Guia de deploy rápido (20-30 min) |
| `SETUP-COMPLETO.md` | Guia completo com detalhes |
| `CONFIGURACAO-RESEND.md` | Como configurar email Resend |
| `WEBHOOK-VISTA.md` | Como configurar webhook Vista |
| `CHECKLIST.md` | Checklist detalhado com checkboxes |
| `CONFIGURACAO.md` | O que já foi configurado |
| `deploy.ps1` | Script de deploy automatizado |
| `.env.example` | Template de variáveis de ambiente |
| `COMECE-AQUI.md` | Este arquivo (ponto de partida) |

---

**Última atualização:** 2026-01-20  
**Build status:** ✅ Funcionando  
**Deploy status:** ⏳ Aguardando deploy  

**👉 Próximo passo:** Abra `GUIA-RAPIDO.md` e comece o deploy!
