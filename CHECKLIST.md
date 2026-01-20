# ✅ Checklist de Deploy - ImobCheck

Use este checklist para acompanhar seu progresso no deploy do ImobCheck.

---

## 🔐 1. Obter Credenciais

### Supabase Service Role Key
- [ ] Acessar: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
- [ ] Localizar seção "Project API keys"
- [ ] Clicar em "Reveal" na chave **"service_role"** (secret)
- [ ] Copiar chave completa (começa com `eyJ...`)
- [ ] Guardar em local seguro

---

### Resend (Email)

#### Criar conta e API Key
- [ ] Acessar: https://resend.com
- [ ] Criar conta (GitHub/Google/Email)
- [ ] Fazer login no dashboard
- [ ] Ir em **"API Keys"**
- [ ] Criar nova API Key:
  - Nome: `ImobCheck Production`
  - Permissão: `Sending access`
- [ ] Copiar API Key (começa com `re_...`)

#### Configurar Email (Escolha uma opção)

**Opção A: Teste rápido (sem domínio)**
- [ ] Usar `EMAIL_FROM=onboarding@resend.dev`
- [ ] Usar `EMAIL_TO=seu.email@gmail.com`

**Opção B: Produção (com domínio próprio)**
- [ ] Adicionar domínio no Resend
- [ ] Configurar registros DNS (SPF, DKIM, DMARC)
- [ ] Aguardar verificação (até 48h)
- [ ] Usar `EMAIL_FROM=alertas@seudominio.com.br`

---

### Vista/Loft API

**Se você tem acesso:**
- [ ] Acessar: https://portal.vistahost.com.br
- [ ] Login no portal
- [ ] Ir em Configurações > Integrações > API
- [ ] Copiar API Key
- [ ] Escolher ambiente:
  - [ ] Sandbox: `http://sandbox-rest.vistahost.com.br`
  - [ ] Produção: `https://api.vistahost.com.br`

**Se não tem acesso ainda:**
- [ ] Deixar como placeholder
- [ ] Configurar depois quando tiver acesso
- [ ] Sistema funcionará parcialmente sem o Vista

**Gerar Webhook Secret:**
- [ ] Executar no PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```
- [ ] Copiar resultado

---

## 📝 2. Configurar .env.local

- [ ] Abrir arquivo `.env.local` na raiz do projeto
- [ ] Preencher `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Preencher `RESEND_API_KEY`
- [ ] Preencher `EMAIL_FROM`
- [ ] Preencher `EMAIL_TO`
- [ ] Preencher `VISTA_API_KEY` (ou deixar placeholder)
- [ ] Preencher `VISTA_API_URL`
- [ ] Preencher `VISTA_WEBHOOK_SECRET`
- [ ] Salvar arquivo
- [ ] **IMPORTANTE:** Confirmar que `.env.local` está no `.gitignore`

---

## 🧪 3. Testar Localmente (Opcional mas Recomendado)

- [ ] Executar: `npm install`
- [ ] Executar: `npm run dev`
- [ ] Abrir: http://localhost:3000/dashboard
- [ ] Fazer login:
  - Email: `hrrsnp@hotmail.com`
  - Senha: `10qp10qp`
- [ ] Verificar se dashboard carrega
- [ ] Verificar console do navegador (F12) - não deve ter erros
- [ ] Parar servidor (Ctrl+C)

---

## 🚀 4. Deploy no Vercel

### Instalar Vercel CLI
- [ ] Executar: `npm install -g vercel`
- [ ] Verificar instalação: `vercel --version`

### Fazer Login
- [ ] Executar: `vercel login`
- [ ] Seguir instruções no navegador
- [ ] Confirmar autenticação

### Build de Teste
- [ ] Executar: `npm run build`
- [ ] Aguardar conclusão sem erros
- [ ] Verificar mensagem de sucesso

### Deploy de Produção

**Opção A: Script Automático (Recomendado)**
- [ ] Executar: `.\deploy.ps1`
- [ ] Seguir instruções do script
- [ ] Anotar URL do projeto

**Opção B: Manual**
- [ ] Executar: `vercel --prod`
- [ ] Responder perguntas:
  - Scope: (sua conta/organização)
  - Link to existing project: N
  - Project name: imobcheck
- [ ] Aguardar deploy
- [ ] Anotar URL do projeto

---

## ⚙️ 5. Configurar Variáveis no Vercel

### Opção A: Via CLI (Mais rápido)

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://icpdejhjsgvhbecagcxd.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcGRlamhqc2d2aGJlY2FnY3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Njg0OTcsImV4cCI6MjA4NDQ0NDQ5N30.0-nla1OtKo4mnJqb9MF_LLgdUk_NmYMZ_3TXYQnkQf4

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Cole sua service role key

vercel env add RESEND_API_KEY production
# Cole sua resend API key

vercel env add EMAIL_FROM production
# Cole: onboarding@resend.dev (ou seu domínio)

vercel env add EMAIL_TO production
# Cole: seu.email@example.com

vercel env add VISTA_API_KEY production
# Cole sua vista API key (ou placeholder)

vercel env add VISTA_API_URL production
# Cole: http://sandbox-rest.vistahost.com.br

vercel env add VISTA_WEBHOOK_SECRET production
# Cole seu webhook secret

vercel env add CRON_SECRET production
# Cole: cron-secret-imobcheck-2026

vercel env add NEXT_PUBLIC_APP_URL production
# Cole: https://SEU-PROJETO.vercel.app
```

**Depois de adicionar todas:**
- [ ] Executar: `vercel --prod` (redeploy)

### Opção B: Via Dashboard

- [ ] Acessar: https://vercel.com/dashboard
- [ ] Selecionar projeto `imobcheck`
- [ ] Ir em **Settings** > **Environment Variables**
- [ ] Adicionar cada variável manualmente
- [ ] Ir em **Deployments** > **Redeploy**

### Verificar Variáveis
- [ ] Executar: `vercel env ls`
- [ ] Confirmar que todas as 11 variáveis estão listadas

---

## 🪝 6. Configurar Webhook no Vista/Loft

### URL do Webhook
```
https://SEU-PROJETO.vercel.app/api/webhooks/vista
```

### No Painel Vista
- [ ] Acessar: https://portal.vistahost.com.br
- [ ] Ir em Configurações > Webhooks
- [ ] Adicionar novo webhook
- [ ] Preencher URL acima
- [ ] Método: POST
- [ ] Content-Type: application/json
- [ ] Secret: (mesmo valor de `VISTA_WEBHOOK_SECRET`)
- [ ] Selecionar eventos:
  - [ ] `imovel.criado`
  - [ ] `imovel.atualizado`
  - [ ] `lead.criado`
  - [ ] `lead.atualizado`
  - [ ] `cliente.criado`
  - [ ] `cliente.atualizado`
  - [ ] `negocio.criado`
  - [ ] `negocio.atualizado`
- [ ] Salvar configuração

### Ou enviar email para suporte
- [ ] Usar template em `WEBHOOK-VISTA.md`
- [ ] Enviar para: suporte@vistahost.com.br
- [ ] Aguardar resposta

---

## 🧪 7. Testes Finais

### Testar Dashboard
- [ ] Acessar: `https://SEU-PROJETO.vercel.app/dashboard`
- [ ] Fazer login:
  - Email: `hrrsnp@hotmail.com`
  - Senha: `10qp10qp`
- [ ] Verificar se dashboard carrega corretamente
- [ ] Verificar se mostra métricas (pode estar vazio ainda)

### Testar API do Webhook
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/webhooks/vista `
  -H "Content-Type: application/json" `
  -d '{
    "event_type": "imovel.criado",
    "data": {
      "Codigo": "TEST123",
      "Endereco": "Rua Teste, 123",
      "Categoria": "Apartamento",
      "ValorVenda": 500000
    }
  }'
```

- [ ] Executar comando acima
- [ ] Verificar resposta: `{"success":true}`
- [ ] Verificar logs no Vercel

### Testar Cron Job (Email)
```powershell
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"
```

- [ ] Executar comando acima
- [ ] Verificar resposta de sucesso
- [ ] Verificar email recebido no `EMAIL_TO`
- [ ] Verificar se não foi para SPAM

### Testar API de Matrícula
```powershell
curl https://SEU-PROJETO.vercel.app/api/matricula/check?matricula=12345
```

- [ ] Executar comando acima
- [ ] Verificar resposta (pode retornar que não encontrou - normal)

---

## 📊 8. Monitoramento

### Vercel
- [ ] Acessar: https://vercel.com/dashboard
- [ ] Verificar projeto está "Ready"
- [ ] Ver últimos deploys (todos com ✅)
- [ ] Verificar Logs (aba "Logs")
- [ ] Verificar Analytics (se disponível)

### Supabase
- [ ] Acessar: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- [ ] Verificar "Database" > "Tables"
- [ ] Confirmar tabelas criadas: corretores, imoveis, leads, negocios, anomalias, eventos
- [ ] Verificar "Authentication" > "Users" (deve ter 1 usuário)
- [ ] Ver "Logs" para verificar atividade

### Resend
- [ ] Acessar: https://resend.com/emails
- [ ] Verificar emails enviados
- [ ] Confirmar status "Delivered"
- [ ] Verificar Analytics (emails/dia)

---

## ✅ 9. Checklist Final

- [ ] Service Role Key configurada
- [ ] Resend API Key configurada
- [ ] Vista API configurada (ou placeholder)
- [ ] Arquivo .env.local completo
- [ ] Build local sem erros
- [ ] Deploy no Vercel concluído
- [ ] Variáveis de ambiente no Vercel configuradas
- [ ] Redeploy realizado
- [ ] Dashboard acessível e funcionando
- [ ] Webhook configurado no Vista
- [ ] Webhook testado (retorna success)
- [ ] Cron job testado (email recebido)
- [ ] Logs verificados (sem erros)
- [ ] URL do projeto anotada

---

## 📱 10. Documentar

- [ ] Anotar URL do projeto: ___________________________________
- [ ] Anotar URL do dashboard: _________________________________
- [ ] Anotar URL do webhook: ___________________________________
- [ ] Salvar credenciais em local seguro
- [ ] Compartilhar URL do dashboard com equipe (se necessário)
- [ ] Adicionar URL aos favoritos

---

## 🎉 Pronto!

**Seu sistema está no ar!**

URLs principais:
- 🌐 App: `https://SEU-PROJETO.vercel.app`
- 📊 Dashboard: `https://SEU-PROJETO.vercel.app/dashboard`
- 🪝 Webhook: `https://SEU-PROJETO.vercel.app/api/webhooks/vista`

**Próximos passos:**
- Aguardar primeiro cron job (5h da manhã, horário de Brasília)
- Monitorar eventos do Vista conforme eles chegam
- Ajustar regras de detecção se necessário
- Configurar domínio próprio no Resend (opcional)

---

**Data de conclusão:** ____/____/______

**Configurado por:** _______________________

---

*Consulte os guias para mais informações:*
- GUIA-RAPIDO.md
- SETUP-COMPLETO.md
- CONFIGURACAO-RESEND.md
- WEBHOOK-VISTA.md
