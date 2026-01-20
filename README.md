# 🏢 ImobCheck - Sistema de Auditoria de Vendas

Sistema serverless para monitorar vendas imobiliárias via API Vista/Loft, detectar anomalias e enviar alertas por email, com dashboard opcional.

## 🚀 Status do Projeto

- ✅ **Supabase configurado** - Banco de dados criado e migrations executadas
- ✅ **Schema implementado** - Tabelas e relacionamentos prontos
- ✅ **Usuário admin criado** - Acesso ao dashboard disponível
- ⚠️ **Variáveis de ambiente pendentes** - Requer configuração manual
- ⚠️ **Deploy pendente** - Pronto para deploy no Vercel

## 📚 Guias de Configuração

- **[⚡ GUIA-RAPIDO.md](./GUIA-RAPIDO.md)** - Comece aqui! Deploy em 20-30 min
- **[📖 SETUP-COMPLETO.md](./SETUP-COMPLETO.md)** - Instruções detalhadas passo a passo
- **[📧 CONFIGURACAO-RESEND.md](./CONFIGURACAO-RESEND.md)** - Como configurar email
- **[🪝 WEBHOOK-VISTA.md](./WEBHOOK-VISTA.md)** - Como configurar webhook Vista/Loft
- **[✅ CONFIGURACAO.md](./CONFIGURACAO.md)** - Visão geral do que foi feito

## 🎯 Quick Start

```powershell
# 1. Preencher variáveis de ambiente
# Edite .env.local com suas keys

# 2. Testar localmente
npm install
npm run dev

# 3. Deploy no Vercel (use o script)
.\deploy.ps1
```

## 🛠️ Tecnologias

- **Runtime**: Node.js 20+ com TypeScript
- **Framework**: Next.js 16+ (App Router)
- **Database**: Supabase PostgreSQL (São Paulo)
- **Auth**: Supabase Auth (dashboard)
- **Email**: Resend (3.000 emails/mês grátis)
- **Deploy**: Vercel (serverless)
- **Validação**: Zod
- **HTTP Client**: Fetch API nativa

## ✨ Funcionalidades

- ✅ Webhook do Vista/Loft para sincronização automática de dados
- ✅ Detecção automática de 5 tipos de anomalias
- ✅ Relatório diário por email via Resend (8h UTC / 5h BRT)
- ✅ Dashboard read-only com autenticação Supabase
- ✅ API para verificação de matrículas (estrutura pronta)
- ✅ Cron job diário via Vercel Cron
- ✅ Logs e monitoramento completo

## 🔐 Credenciais do Dashboard

**URL (após deploy):** `https://seu-projeto.vercel.app/dashboard`

**Login:**
- Email: `hrrsnp@hotmail.com`
- Senha: `10qp10qp`

## 📊 Configuração do Projeto Supabase

- **ID:** icpdejhjsgvhbecagcxd
- **URL:** https://icpdejhjsgvhbecagcxd.supabase.co
- **Região:** sa-east-1 (São Paulo)
- **Status:** ✅ ATIVO
- **Plano:** Free Tier ($0/mês)

## ⚙️ Configuração Rápida

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=alertas@suaempresa.com.br
EMAIL_TO=gestao@suaempresa.com.br

# Vista API
VISTA_API_KEY=your-vista-api-key
VISTA_API_URL=http://sandbox-rest.vistahost.com.br
VISTA_WEBHOOK_SECRET=your-webhook-secret

# Vercel Cron
CRON_SECRET=random-secret-for-cron

# App URL
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### 2. Banco de Dados (Supabase)

Execute as migrations no seu projeto Supabase:

```bash
# No Supabase Dashboard, vá em SQL Editor e execute:
# supabase/migrations/001_initial_schema.sql
```

Ou use o CLI do Supabase:

```bash
supabase db push
```

### 3. Configurar Webhook Vista/Loft

No painel do Vista/Loft, configure o webhook para apontar para:
```
https://seu-app.vercel.app/api/webhooks/vista
```

Eventos suportados:
- `imovel.criado` / `imovel.atualizado`
- `lead.criado` / `lead.atualizado` / `cliente.criado` / `cliente.atualizado`
- `negocio.criado` / `negocio.atualizado`

### 4. Configurar Vercel Cron

O arquivo `vercel.json` já está configurado. O cron job executa diariamente às 8h UTC.

### 5. Resend (Email)

1. Crie uma conta no [Resend](https://resend.com)
2. Configure seu domínio e verifique o DNS
3. Adicione a chave API nas variáveis de ambiente

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção local
npm start
```

## Estrutura do Projeto

```
/
├── app/
│   ├── api/
│   │   ├── webhooks/vista/route.ts       # Recebe webhooks do Vista
│   │   ├── cron/daily-audit/route.ts     # Análise diária (Vercel Cron)
│   │   └── matricula/check/route.ts      # Verificação de matrícula
│   ├── dashboard/                         # Dashboard com auth
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── components/
│   └── layout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Cliente browser
│   │   ├── server.ts                     # Cliente server
│   │   └── schema.sql                    # Schema de referência
│   ├── vista/
│   │   ├── client.ts                     # Cliente API Vista/Loft
│   │   └── types.ts                      # Tipos e schemas Zod
│   ├── detectors/
│   │   ├── anomaly-detector.ts           # Lógica de detecção
│   │   └── patterns.ts                   # Padrões e cálculos
│   ├── email/
│   │   ├── resend-client.ts              # Cliente Resend
│   │   └── templates/
│   │       ├── daily-report.tsx          # Template relatório diário
│   │       └── anomaly-alert.tsx         # Template alerta de anomalia
│   └── env.ts                            # Validação de variáveis de ambiente
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Schema inicial do banco
└── vercel.json                           # Configuração Vercel Cron
```

## Detecção de Anomalias

O sistema detecta automaticamente:

1. **Leads perdidos rapidamente** - Leads marcados como "perdido" em menos de 24h
2. **Taxa de conversão baixa** - Corretores com taxa muito abaixo da média
3. **Vendas não registradas** - Imóveis vendidos sem negócio registrado
4. **Leads inativos** - Leads sem atualizações há mais de 30 dias
5. **Negócios com data futura** - Negócios com data de fechamento futura

## Dashboard

Acesse `/dashboard` após fazer login. O dashboard exibe:

- Métricas do dia (leads, negócios, taxa de conversão)
- Anomalias pendentes
- Lista de corretores ativos
- Leads recentes
- Negócios recentes

## Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Variáveis de Ambiente no Vercel

Configure todas as variáveis de ambiente no painel do Vercel:

1. Vá em Settings > Environment Variables
2. Adicione todas as variáveis do `.env.local`

## Custo Estimado

- **Fase 1 (0-100 vendas/mês)**: $0 (free tiers)
- **Fase 2 (100-500 vendas/mês)**: ~$20/mês (Supabase Pro)
- **Fase 3 (500+ vendas/mês)**: ~$50-100/mês (Vercel Pro + Supabase Pro)

## 📋 Próximas Etapas

### Imediatas (Requerido para produção)
- [ ] Obter `SUPABASE_SERVICE_ROLE_KEY` do dashboard
- [ ] Criar conta Resend e obter API key
- [ ] Obter API key do Vista/Loft
- [ ] Completar variáveis no `.env.local`
- [ ] Fazer deploy no Vercel
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Configurar webhook no Vista/Loft

### Recomendadas
- [ ] Configurar domínio próprio no Resend para emails
- [ ] Testar webhook com dados reais do Vista
- [ ] Ajustar regras de detecção conforme necessário
- [ ] Configurar alertas customizados

### Futuras (Opcional)
- [ ] Implementar verificação de matrícula com OCR
- [ ] Adicionar mais tipos de anomalias
- [ ] Dashboard com gráficos e analytics
- [ ] API para integração com outros sistemas

## 💰 Custo Estimado

| Serviço | Free Tier | Uso Estimado | Custo |
|---------|-----------|--------------|-------|
| **Vercel** | 100GB bandwidth | ~5GB/mês | $0 |
| **Supabase** | 500MB DB, 1GB transfer | ~100MB, ~500MB | $0 |
| **Resend** | 3.000 emails/mês | ~30/mês (1/dia) | $0 |
| **Total** | - | - | **$0/mês** |

**Escalabilidade:**
- 0-100 vendas/mês: $0 (free tiers)
- 100-500 vendas/mês: ~$20/mês (Supabase Pro)
- 500+ vendas/mês: ~$50-100/mês (Vercel Pro + Supabase Pro)

## ⚠️ Notas Importantes

- **Segurança:** Nunca commite `.env.local` no git (já está no `.gitignore`)
- **Service Role Key:** Tem acesso total ao banco - mantenha seguro
- **Webhook:** O schema está pronto mas pode precisar ajustes com payload real do Vista
- **Dashboard:** É read-only - não permite edição de dados
- **Cron:** Executa diariamente às 8h UTC (5h horário de Brasília)
- **Email:** Use domínio verificado no Resend para produção

## 🆘 Troubleshooting

### Build falhou
```powershell
rm -r .next, node_modules
npm install
npm run build
```

### Variável de ambiente não encontrada
```powershell
vercel env ls
vercel env pull
```

### Email não chegou
1. Verifique pasta de SPAM
2. Veja status no dashboard Resend
3. Verifique logs do Vercel
4. Confirme `RESEND_API_KEY` está correto

### Webhook retorna erro
1. Veja logs no Vercel
2. Teste com curl (veja WEBHOOK-VISTA.md)
3. Confirme `SUPABASE_SERVICE_ROLE_KEY` está correto

## 📞 Suporte

- **Supabase:** https://supabase.com/dashboard/project/icpdejhjsgvhbecagcxd
- **Vercel:** https://vercel.com/dashboard
- **Resend:** https://resend.com/emails
- **Vista/Loft:** https://portal.vistahost.com.br

## 📄 Licença

Private - Uso interno
