const fs = require('fs');
const path = require('path');

// KONFIGURASI
const outputFileName = 'project-context.txt';
const allowedExtensions = ['.ts', '.tsx', '.prisma', '.css', '.json']; // File yang mau diambil
const ignoredFolders = ['node_modules', '.next', '.git', 'dist', 'build', 'coverage'];
const ignoredFiles = ['package-lock.json', 'yarn.lock', 'scan-project.js', 'project-context.txt'];

// Fungsi untuk mengecek apakah file harus diproses
function shouldProcess(filePath) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    
    // Cek file security (JANGAN UPLOAD .ENV)
    if (fileName.startsWith('.env')) return false;
    
    // Cek ignored files
    if (ignoredFiles.includes(fileName)) return false;

    // Cek ekstensi
    return allowedExtensions.includes(ext) || fileName === 'package.json';
}

// Fungsi rekursif untuk scan folder
function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!ignoredFolders.includes(file)) {
                scanDirectory(filePath, fileList);
            }
        } else {
            if (shouldProcess(filePath)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

// Eksekusi Utama
console.log('🔄 Sedang menscan project...');
const rootDir = process.cwd();
const allFiles = scanDirectory(rootDir);

let outputContent = `# RINGKASAN PROJECT NEXT.JS\n`;
outputContent += `Total Files: ${allFiles.length}\n\n`;

allFiles.forEach(file => {
    // Buat relative path agar lebih rapi
    const relativePath = path.relative(rootDir, file);
    
    // Baca isi file
    const content = fs.readFileSync(file, 'utf8');

    // Format output ala Markdown agar Gemini mudah baca
    outputContent += `================================================\n`;
    outputContent += `FILE: ${relativePath}\n`;
    outputContent += `================================================\n`;
    outputContent += `${content}\n\n`;
});

// Simpan ke file
fs.writeFileSync(outputFileName, outputContent);
console.log(`✅ Selesai! Data tersimpan di: ${outputFileName}`);
console.log(`📁 Silakan upload file ini ke Gemini.`);