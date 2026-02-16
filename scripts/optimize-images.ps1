# Script PowerShell para otimizar imagens no projeto
# Este script converte JPG para WebP para melhor performance

Write-Host "=== Rick Travel - Otimizador de Imagens ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se sharp-cli está instalado
$sharpInstalled = Get-Command sharp -ErrorAction SilentlyContinue

if (-not $sharpInstalled) {
    Write-Host "sharp-cli não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g sharp-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao instalar sharp-cli. Tentando com npx..." -ForegroundColor Red
        $useNpx = $true
    } else {
        Write-Host "sharp-cli instalado com sucesso!" -ForegroundColor Green
        $useNpx = $false
    }
} else {
    Write-Host "sharp-cli já está instalado!" -ForegroundColor Green
    $useNpx = $false
}

Write-Host ""
Write-Host "Convertendo imagens para WebP..." -ForegroundColor Cyan
Write-Host ""

# Diretórios de imagens
$imagesDirs = @(
    "public/images/trips",
    "public/videos"
)

$totalConverted = 0
$totalSkipped = 0

foreach ($dir in $imagesDirs) {
    if (Test-Path $dir) {
        Write-Host "Processando: $dir" -ForegroundColor Yellow
        
        # Encontrar todos os arquivos JPG
        $jpgFiles = Get-ChildItem -Path $dir -Filter "*.jpg" -File
        
        foreach ($file in $jpgFiles) {
            $webpPath = $file.FullName -replace '\.jpg$', '.webp'
            
            # Verificar se já existe versão WebP
            if (Test-Path $webpPath) {
                Write-Host "  ⏭️  Pulando $($file.Name) (WebP já existe)" -ForegroundColor Gray
                $totalSkipped++
            } else {
                Write-Host "  🔄 Convertendo $($file.Name)..." -ForegroundColor White
                
                if ($useNpx) {
                    npx sharp-cli -i $file.FullName -o $webpPath --webp "{quality:80}"
                } else {
                    sharp -i $file.FullName -o $webpPath --webp "{quality:80}"
                }
                
                if ($LASTEXITCODE -eq 0) {
                    $originalSize = [math]::Round($file.Length / 1KB, 2)
                    $newSize = [math]::Round((Get-Item $webpPath).Length / 1KB, 2)
                    $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
                    
                    Write-Host "  ✅ Convertido! ${originalSize}KB → ${newSize}KB (economia: ${savings}%)" -ForegroundColor Green
                    $totalConverted++
                } else {
                    Write-Host "  ❌ Erro ao converter $($file.Name)" -ForegroundColor Red
                }
            }
        }
        
        Write-Host ""
    }
}

Write-Host "=== Resumo ===" -ForegroundColor Cyan
Write-Host "Total convertido: $totalConverted" -ForegroundColor Green
Write-Host "Total pulado: $totalSkipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Após a conversão, atualize os imports no código para usar .webp" -ForegroundColor Yellow
Write-Host "Exemplo: 'imagem.jpg' → 'imagem.webp'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Concluído! ✨" -ForegroundColor Green
