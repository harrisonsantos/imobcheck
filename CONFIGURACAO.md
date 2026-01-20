# ✅ Configuração Concluída - ImobCheck

## 📊 Projeto Supabase Criado

- **Nome**: imobcheck
- **ID**: icpdejhjsgvhbecagcxd
- **URL**: https://icpdejhjsgvhbecagcxd.supabase.co
- **Região**: sa-east-1 (São Paulo)
- **Status**: ATIVO ✅
- **Custo**: $0/mês (Free Tier)

## ✅ Migrations Executadas

- ✅ `001_initial_schema.sql` - Tabelas criadas:
  - `corretores`
  - `imoveis`
  - `leads`
  - `negocios`
  - `anomalias`
  - `eventos`

## 🔐 Usuário Dashboard Criado

- **Email**: hrrsnp@hotmail.com
- **Senha**: 10qp10qp
- **ID**: ad7f25d4-f727-4ef6-a6cb-5e9bd1269b82
- **Acesso**: https://seu-app.vercel.app/dashboard/login

## 📁 Arquivo .env.local Criado

O arquivo `.env.local` foi criado na raiz do projeto com as seguintes variáveis configuradas:

### ✅ Configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL` (localhost)

### ⚠️ Pendentes (você precisa preencher):

1. **SUPABASE_SERVICE_ROLE_KEY**
   - Obter em: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd/settings/api
   - Buscar por "service_role key" (secret)

2. **RESEND_API_KEY**
   - Criar conta: https://resend.com
   - Configurar domínio e verificar DNS
   - Gerar API key no dashboard

3. **EMAIL_FROM**
   - Usar o domínio verificado no Resend
   - Exemplo: `alertas@seudominio.com.br`

4. **EMAIL_TO**
   - Email para receber os alertas
   - Exemplo: `gestao@seudominio.com.br`

5. **VISTA_API_KEY**
   - Obter no painel do Vista/Loft
   - Documentação: https://portal.vistahost.com.br

6. **VISTA_API_URL**
   - Sandbox: `http://sandbox-rest.vistahost.com.br`
   - Produção: `https://api.vistahost.com.br`

7. **VISTA_WEBHOOK_SECRET**
   - Criar um secret aleatório seguro
   - Exemplo: `vista_webhook_secret_2026_imobcheck_xyz123`

## 🪝 Webhook do Vista/Loft

### URL do Webhook:
```
https://seu-app.vercel.app/api/webhooks/vista
```

### Configuração no Vista/Loft:

1. Acesse o painel do Vista/Loft
2. Vá em Configurações > Webhooks
3. Adicione a URL acima
4. Selecione os eventos:
   - ✅ `imovel.criado`
   - ✅ `imovel.atualizado`
   - ✅ `lead.criado`
   - ✅ `lead.atualizado`
   - ✅ `cliente.criado`
   - ✅ `cliente.atualizado`
   - ✅ `negocio.criado`
   - ✅ `negocio.atualizado`
5. Configure o secret (mesmo valor do `.env.local`)

### Método HTTP:
- **POST**

### Headers esperados:
- `Content-Type: application/json`
- `X-Vista-Signature: <assinatura-hmac>` (opcional)

## 🚀 Próximos Passos

### 1. Completar .env.local
Edite o arquivo `.env.local` e preencha as variáveis pendentes listadas acima.

### 2. Testar Localmente
```bash
npm install
npm run dev
```

Acesse:
- Dashboard: http://localhost:3000/dashboard
- API Health: http://localhost:3000/api/webhooks/vista (GET)

### 3. Deploy no Vercel

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Deploy
vercel

# Após o deploy, configurar variáveis de ambiente
# Vá em: https://vercel.com/dashboard > Seu Projeto > Settings > Environment Variables
# Adicione TODAS as variáveis do .env.local
```

### 4. Atualizar URLs
Após o deploy, atualize:

1. **No .env.local e Vercel**:
   ```
   NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
   ```

2. **No Vista/Loft**:
   - Webhook URL: `https://seu-app.vercel.app/api/webhooks/vista`

### 5. Configurar Resend
1. Adicionar e verificar domínio no Resend
2. Configurar registros DNS (SPF, DKIM, DMARC)
3. Testar envio de email

### 6. Testar Webhook
Envie um POST de teste para o webhook:

```bash
curl -X POST https://seu-app.vercel.app/api/webhooks/vista \
  -H "Content-Type: application/json" \
  -d '{"event":"imovel.criado","data":{"id":"123","endereco":"Teste"}}'
```

## 📝 Notas Importantes

- ⚠️ **NUNCA** commite o arquivo `.env.local` no git (já está no `.gitignore`)
- ⚠️ O `SUPABASE_SERVICE_ROLE_KEY` tem acesso total ao banco - mantenha seguro
- ✅ O Vercel Cron está configurado para executar às 8h UTC (5h BRT) diariamente
- ✅ O dashboard é read-only - não permite edição de dados

## 🆘 Suporte

- Supabase Dashboard: https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- Documentação Vista: https://portal.vistahost.com.br
- Resend Docs: https://resend.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Data da configuração**: 2026-01-20
**Configurado por**: Cursor AI Assistant
