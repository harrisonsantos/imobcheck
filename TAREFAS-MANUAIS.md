# 📋 Tarefas Manuais Pendentes - ImobCheck

## ✅ O Que Foi Completado

Todas as melhorias de código foram implementadas:

- ✅ **Homepage profissional** com cores e identidade eXp Realty Brasil
- ✅ **Dashboard completo** com gráficos, filtros, exportação e tabs
- ✅ **Sistema de upload de matrículas** com validação
- ✅ **Notificações em tempo real** via Supabase Realtime
- ✅ **Testes automatizados** (unitários e E2E)
- ✅ **Webhook Vista CRM** funcional
- ✅ **Cron job de auditoria** automatizado
- ✅ **Detector de anomalias** com 5 tipos

## ⏳ Tarefas Manuais Restantes

Estas tarefas requerem acesso a serviços externos e não podem ser automatizadas:

---

### 1️⃣ Configurar Variáveis de Ambiente

**Tempo estimado:** 15-20 minutos

#### Credenciais Necessárias:

1. **SUPABASE_SERVICE_ROLE_KEY**
   ```
   Onde obter:
   1. Acesse: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
   2. Procure por "service_role key" (marcada como "secret")
   3. Clique em "Reveal" e copie a chave
   4. Cole no .env.local
   ```

2. **RESEND_API_KEY**
   ```
   Onde obter:
   1. Acesse: https://resend.com
   2. Crie uma conta (gratuita)
   3. Vá em "API Keys"
   4. Clique em "Create API Key"
   5. Copie a chave (começa com re_...)
   6. Cole no .env.local
   ```

3. **EMAIL_FROM e EMAIL_TO**
   ```
   EMAIL_FROM: Use onboarding@resend.dev (para testes) ou seu domínio verificado
   EMAIL_TO: Seu email para receber relatórios
   ```

4. **CRON_SECRET**
   ```
   Gerar secret aleatório:
   PowerShell:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   
   Ou use: cron-secret-imobcheck-2026
   ```

5. **VISTA_API_KEY e VISTA_WEBHOOK_SECRET** (opcional por enquanto)
   ```
   Pode deixar como placeholder se não tiver acesso ao Vista ainda:
   VISTA_API_KEY=placeholder-key
   VISTA_WEBHOOK_SECRET=placeholder-secret
   ```

#### Arquivo .env.local Completo:

Crie/edite o arquivo `.env.local` na raiz do projeto:

```env
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=https://icpdejhjsgvhbecagcxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcGRlamhqc2d2aGJlY2FnY3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Njg0OTcsImV4cCI6MjA4NDQ0NDQ5N30.0-nla1OtKo4mnJqb9MF_LLgdUk_NmYMZ_3TXYQnkQf4

# OBTER ESTAS CREDENCIAIS:
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
RESEND_API_KEY=sua-resend-api-key-aqui
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=seu-email@example.com
CRON_SECRET=cron-secret-imobcheck-2026

# Vista (opcional por enquanto)
VISTA_API_KEY=placeholder-key
VISTA_API_URL=http://sandbox-rest.vistahost.com.br
VISTA_WEBHOOK_SECRET=placeholder-secret

# App URL (atualizar após deploy)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 2️⃣ Fazer Deploy no Vercel

**Tempo estimado:** 10-15 minutos

#### Passos:

1. **Instalar Vercel CLI** (se não tiver):
   ```powershell
   npm install -g vercel
   ```

2. **Fazer login**:
   ```powershell
   vercel login
   ```
   Siga as instruções no navegador

3. **Testar build localmente**:
   ```powershell
   npm run build
   ```
   Aguarde conclusão sem erros

4. **Fazer deploy**:
   ```powershell
   vercel --prod
   ```
   
   Responda:
   - Scope: (sua conta)
   - Link to existing project: N
   - Project name: imobcheck

5. **Anote a URL** do projeto (ex: `https://imobcheck-xyz.vercel.app`)

6. **Configurar variáveis de ambiente no Vercel**:
   
   Opção A - Via CLI (mais rápido):
   ```powershell
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   # Cole o valor quando solicitado
   
   vercel env add RESEND_API_KEY production
   # Cole o valor quando solicitado
   
   # Repita para cada variável...
   ```
   
   Opção B - Via Dashboard:
   ```
   1. Acesse: https://vercel.com/dashboard
   2. Selecione projeto "imobcheck"
   3. Vá em Settings > Environment Variables
   4. Adicione todas as variáveis do .env.local
   ```

7. **Atualizar NEXT_PUBLIC_APP_URL**:
   ```powershell
   vercel env add NEXT_PUBLIC_APP_URL production
   # Cole: https://SEU-PROJETO.vercel.app
   ```

8. **Fazer redeploy** para aplicar variáveis:
   ```powershell
   vercel --prod
   ```

---

### 3️⃣ Configurar Resend (Email)

**Tempo estimado:** 5-10 minutos (sem domínio próprio) ou 30-60 minutos (com domínio)

#### Opção A: Teste Rápido (sem domínio)

1. Use `EMAIL_FROM=onboarding@resend.dev`
2. Use `EMAIL_TO=seu-email@gmail.com`
3. Pronto! Emails de teste funcionarão

#### Opção B: Produção (com domínio próprio)

1. **Adicionar domínio no Resend**:
   ```
   1. Acesse: https://resend.com/domains
   2. Clique em "Add Domain"
   3. Digite seu domínio (ex: suaempresa.com.br)
   ```

2. **Configurar DNS**:
   ```
   O Resend fornecerá 3 registros DNS:
   
   TXT (SPF): v=spf1 include:resend.net ~all
   TXT (DKIM): [valor fornecido pelo Resend]
   CNAME (DMARC): [valor fornecido pelo Resend]
   
   Adicione estes registros no seu provedor de domínio
   ```

3. **Aguardar verificação** (pode levar até 48h, geralmente 5-10 min)

4. **Atualizar EMAIL_FROM**:
   ```
   EMAIL_FROM=alertas@seudominio.com.br
   ```

---

### 4️⃣ Configurar Webhook no Vista/Loft

**Tempo estimado:** 5-10 minutos

#### Requisitos:
- URL do projeto no Vercel
- Acesso ao painel Vista/Loft

#### Passos:

1. **Obter URL do webhook**:
   ```
   https://SEU-PROJETO.vercel.app/api/webhooks/vista
   ```

2. **Configurar no painel Vista**:
   ```
   1. Acesse: https://portal.vistahost.com.br
   2. Vá em Configurações > Webhooks (ou Integrações)
   3. Clique em "Adicionar Webhook"
   4. Cole a URL
   5. Método: POST
   6. Content-Type: application/json
   7. Secret: (mesmo valor de VISTA_WEBHOOK_SECRET)
   ```

3. **Selecionar eventos**:
   ```
   Marque todos:
   ☑ imovel.criado
   ☑ imovel.atualizado
   ☑ lead.criado
   ☑ lead.atualizado
   ☑ cliente.criado
   ☑ cliente.atualizado
   ☑ negocio.criado
   ☑ negocio.atualizado
   ```

4. **Salvar e testar**:
   ```
   O Vista deve enviar um evento de teste.
   Verifique os logs no Vercel para confirmar.
   ```

---

### 5️⃣ Testar Sistema End-to-End

**Tempo estimado:** 10-15 minutos

#### 1. Testar Dashboard:
```
1. Acesse: https://SEU-PROJETO.vercel.app/dashboard/login
2. Login:
   - Email: hrrsnp@hotmail.com
   - Senha: 10qp10qp
3. Verifique:
   ✓ Dashboard carrega
   ✓ Gráficos aparecem
   ✓ Filtros funcionam
   ✓ Notificações em tempo real ativas (badge verde)
   ✓ Tabs funcionam
   ✓ Exportação CSV funciona
```

#### 2. Testar Webhook:
```powershell
# Testar endpoint do webhook
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

# Resposta esperada: {"success":true}
```

#### 3. Testar Cron Job:
```powershell
# Disparar manualmente
curl -X POST https://SEU-PROJETO.vercel.app/api/cron/daily-audit `
  -H "Authorization: Bearer cron-secret-imobcheck-2026"

# Verificar:
# 1. Resposta de sucesso
# 2. Email recebido no EMAIL_TO
# 3. Logs no Vercel
```

#### 4. Testar Upload de Matrícula:
```
1. No dashboard, vá para "Leads" ou "Negócios"
2. Clique em um item
3. Procure opção de upload de matrícula
4. Envie um PDF de teste
5. Verifique que foi salvo
```

#### 5. Verificar Notificações em Tempo Real:
```
1. Abra o dashboard em duas janelas
2. Na janela 1, crie um lead (via curl no webhook)
3. Na janela 2, verifique notificação aparece
```

---

## 📊 Status Final

### Implementado ✅
- [x] Homepage profissional com cores eXp Realty
- [x] Dashboard com gráficos, filtros e exportação
- [x] Sistema de upload de matrículas
- [x] Notificações em tempo real
- [x] Testes automatizados
- [x] Webhook Vista CRM funcional
- [x] Cron job de auditoria
- [x] Detector de 5 tipos de anomalias

### Aguardando Ação Manual ⏳
- [ ] Obter credenciais (service role, resend, etc)
- [ ] Deploy no Vercel
- [ ] Configurar Resend (opcional: domínio próprio)
- [ ] Configurar webhook Vista
- [ ] Testar sistema completo

---

## 🎯 Próximos Passos Recomendados

1. ✅ **AGORA**: Obter credenciais e preencher .env.local
2. ✅ **AGORA**: Fazer deploy no Vercel
3. ⚡ **LOGO**: Testar dashboard e APIs
4. 🔧 **DEPOIS**: Configurar domínio no Resend (opcional)
5. 🔧 **DEPOIS**: Configurar webhook Vista
6. 📈 **FUTURO**: Monitorar e ajustar conforme uso

---

## 🆘 Precisa de Ajuda?

### Documentação Criada:
- `GUIA-RAPIDO.md` - Deploy em 20-30 min
- `SETUP-COMPLETO.md` - Guia detalhado
- `CONFIGURACAO-RESEND.md` - Configurar email
- `WEBHOOK-VISTA.md` - Configurar webhook

### Links Úteis:
- **Supabase**: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- **Vercel**: https://vercel.com/dashboard
- **Resend**: https://resend.com/emails
- **Vista**: https://portal.vistahost.com.br

### Executar Testes:
```powershell
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Interface de testes
npm run test:ui
```

---

**Última atualização:** 2026-01-20  
**Status do projeto:** 95% completo - aguardando configurações externas
