# Script de Deploy - ImobCheck
# Execute este script após preencher todas as variáveis no .env.local

Write-Host "🚀 ImobCheck - Script de Deploy" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Verificar se o .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Erro: Arquivo .env.local não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, crie o arquivo .env.local primeiro." -ForegroundColor Yellow
    exit 1
}

# Verificar se ainda há placeholders no .env.local
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "SEU_.*_AQUI" -or $envContent -match "COLE_AQUI") {
    Write-Host "⚠️  Atenção: Encontrei placeholders no .env.local" -ForegroundColor Yellow
    Write-Host "Por favor, preencha todas as variáveis antes de fazer deploy." -ForegroundColor Yellow
    Write-Host "`nVariáveis que precisam ser preenchidas:" -ForegroundColor Yellow
    $envContent -split "`n" | Where-Object { $_ -match "SEU_.*_AQUI|COLE_AQUI" } | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Yellow
    }
    Write-Host "`nDeseja continuar mesmo assim? (s/N): " -NoNewline -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Deploy cancelado." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Arquivo .env.local encontrado" -ForegroundColor Green

# Verificar se Vercel CLI está instalado
Write-Host "`n📦 Verificando Vercel CLI..." -ForegroundColor Cyan
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI instalado (versão: $vercelVersion)" -ForegroundColor Green
    } else {
        throw "Vercel não encontrado"
    }
} catch {
    Write-Host "⚠️  Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI instalado com sucesso" -ForegroundColor Green
}

# Fazer login no Vercel
Write-Host "`n🔐 Verificando autenticação no Vercel..." -ForegroundColor Cyan
vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Por favor, faça login no Vercel:" -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer login no Vercel" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Autenticado no Vercel" -ForegroundColor Green

# Build local para testar
Write-Host "`n🔨 Testando build local..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build local bem-sucedido" -ForegroundColor Green

# Deploy
Write-Host "`n🚀 Iniciando deploy no Vercel..." -ForegroundColor Cyan
Write-Host "Isso pode levar alguns minutos...`n" -ForegroundColor Yellow

vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Erro durante o deploy" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green

# Perguntar se deseja configurar variáveis de ambiente
Write-Host "`n⚙️  Configuração de Variáveis de Ambiente" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deseja configurar as variáveis de ambiente no Vercel agora? (S/n): " -NoNewline -ForegroundColor Yellow
$configEnv = Read-Host
if ($configEnv -eq "n" -or $configEnv -eq "N") {
    Write-Host "`n⚠️  Lembre-se de configurar as variáveis manualmente:" -ForegroundColor Yellow
    Write-Host "https://vercel.com/dashboard > Projeto > Settings > Environment Variables" -ForegroundColor Yellow
    exit 0
}

# Configurar variáveis de ambiente
Write-Host "`n📝 Configurando variáveis de ambiente..." -ForegroundColor Cyan
Write-Host "Lendo arquivo .env.local...`n" -ForegroundColor Yellow

# Ler .env.local e adicionar cada variável
Get-Content ".env.local" | ForEach-Object {
    $line = $_.Trim()
    
    # Ignorar linhas vazias e comentários
    if ($line -and -not $line.StartsWith("#")) {
        # Separar nome e valor
        if ($line -match "^([^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remover aspas se houver
            $value = $value -replace '^["'']|["'']$', ''
            
            Write-Host "Adicionando: $name" -ForegroundColor Cyan
            
            # Adicionar variável (silenciosamente, pois pode já existir)
            $value | vercel env add $name production 2>$null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ $name adicionada" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $name já existe (pulando)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "`n✅ Variáveis de ambiente configuradas!" -ForegroundColor Green

# Perguntar se deseja fazer redeploy
Write-Host "`n🔄 Deseja fazer redeploy para aplicar as variáveis? (S/n): " -NoNewline -ForegroundColor Yellow
$redeploy = Read-Host
if ($redeploy -ne "n" -and $redeploy -ne "N") {
    Write-Host "`nRealizando redeploy...`n" -ForegroundColor Cyan
    vercel --prod
    Write-Host "`n✅ Redeploy concluído!" -ForegroundColor Green
}

# Resumo final
Write-Host "`n🎉 Deploy Finalizado!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse seu projeto no Vercel e anote a URL" -ForegroundColor White
Write-Host "2. Configure o webhook no Vista/Loft com a URL:" -ForegroundColor White
Write-Host "   https://SEU-PROJETO.vercel.app/api/webhooks/vista" -ForegroundColor Yellow
Write-Host "3. Teste o dashboard em:" -ForegroundColor White
Write-Host "   https://SEU-PROJETO.vercel.app/dashboard" -ForegroundColor Yellow
Write-Host "4. Acesse com:" -ForegroundColor White
Write-Host "   Email: hrrsnp@hotmail.com" -ForegroundColor Yellow
Write-Host "   Senha: 10qp10qp" -ForegroundColor Yellow
Write-Host "`nConsulte SETUP-COMPLETO.md para mais detalhes.`n" -ForegroundColor Cyan
