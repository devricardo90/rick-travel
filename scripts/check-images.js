const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const MAX_SIZE_MB = 1;

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function scanDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanDir(filePath);
        } else {
            if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                const sizeMB = stat.size / (1024 * 1024);
                if (sizeMB > MAX_SIZE_MB) {
                    console.error(`⚠️  IMAGEM GRANDE: ${filePath.replace(PUBLIC_DIR, '')} (${formatBytes(stat.size)})`);
                }
            }
        }
    });
}

console.log('🔍 Verificando imagens grandes em public/ ...');
scanDir(PUBLIC_DIR);
console.log('✅ Verificação concluída.');
