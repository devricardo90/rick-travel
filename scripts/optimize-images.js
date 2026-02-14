const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configurações
const PUBLIC_DIR = path.join(__dirname, '../public');
const MAX_WIDTH = 1920; // Largura máxima Full HD
const QUALITY = 80; // Qualidade de compressão
const MAX_SIZE_BYTES = 500 * 1024; // Otimizar apenas imagens acima de 500KB

// Formatos suportados para otimização
const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImage(filePath) {
    try {
        const stats = fs.statSync(filePath);

        // Pula arquivos pequenos
        if (stats.size <= MAX_SIZE_BYTES) return;

        console.log(`\n🔧 Otimizando: ${path.basename(filePath)}`);
        console.log(`   Tamanho original: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Redimensiona se for muito largo
        if (metadata.width > MAX_WIDTH) {
            console.log(`   Redimensionando de ${metadata.width}px para ${MAX_WIDTH}px`);
            image.resize(MAX_WIDTH);
        }

        // Define configurações de compressão baseadas na extensão
        const ext = path.extname(filePath).toLowerCase();

        // Salva em um arquivo temporário
        const tempPath = filePath + '.tmp';

        if (ext === '.png') {
            await image.png({ quality: QUALITY, compressionLevel: 9 }).toFile(tempPath);
        } else if (ext === '.webp') {
            await image.webp({ quality: QUALITY }).toFile(tempPath);
        } else {
            // JPG/JPEG
            await image.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tempPath);
        }

        // Verifica se a otimização valeu a pena
        const newStats = fs.statSync(tempPath);
        const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);

        if (newStats.size < stats.size) {
            // Substitui o original
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            console.log(`   ✅ Sucesso! Novo tamanho: ${(newStats.size / 1024 / 1024).toFixed(2)} MB (-${savings}%)`);
        } else {
            // Descarta o temporário se não houve ganho (raro, mas possível em arquivos já otimizados)
            fs.unlinkSync(tempPath);
            console.log(`   ⚠️  Arquivo original já estava otimizado. Mantendo original.`);
        }

    } catch (error) {
        console.error(`   ❌ Erro ao otimizar ${path.basename(filePath)}:`, error.message);
        // Tenta limpar temp file em caso de erro
        if (fs.existsSync(filePath + '.tmp')) {
            fs.unlinkSync(filePath + '.tmp');
        }
    }
}

async function scanAndOptimize(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await scanAndOptimize(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (SUPPORTED_EXTS.includes(ext)) {
                await optimizeImage(filePath);
            }
        }
    }
}

console.log('🚀 Iniciando otimização de imagens...');
console.log(`📂 Diretório: ${PUBLIC_DIR}`);
console.log(`📏 Max Width: ${MAX_WIDTH}px`);
console.log(`💾 Max Size Threshold: ${(MAX_SIZE_BYTES / 1024).toFixed(0)}KB`);

scanAndOptimize(PUBLIC_DIR).then(() => {
    console.log('\n✨ Processo de otimização concluído!');
});
