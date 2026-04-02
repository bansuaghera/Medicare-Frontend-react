import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'styles');
const filesToProcess = ['forgotPassword.css', 'verifyOTP.css'];

const replacements = [
    { target: /background:\s*(#fff|white|#ffffff);/gi, replacement: 'background: var(--bg-secondary, white);' },
    { target: /background:\s*#f8fafc;/gi, replacement: 'background: var(--bg-primary, #f8fafc);' },
    { target: /background:\s*#f1f5f9;/gi, replacement: 'background: var(--bg-primary, #f1f5f9);' },
    { target: /color:\s*#1a1a1a;/gi, replacement: 'color: var(--text-primary, #1a1a1a);' },
    { target: /color:\s*#1e293b;/gi, replacement: 'color: var(--text-primary, #1e293b);' },
    { target: /color:\s*#64748b;/gi, replacement: 'color: var(--text-secondary, #64748b);' },
    { target: /color:\s*#94a3b8;/gi, replacement: 'color: var(--text-tertiary, #94a3b8);' },
    { target: /border:\s*1px solid transparent;/gi, replacement: 'border: 1px solid var(--border-color, transparent);' },
    { target: /border:\s*1px solid rgba\(0, 0, 0, 0\.02\);/g, replacement: 'border: 1px solid var(--border-color, rgba(0, 0, 0, 0.02));' },
    { target: /box-shadow: 0 20px 40px rgba\(0, 0, 0, 0\.04\);/g, replacement: 'box-shadow: 0 4px 6px -1px var(--shadow-sm, rgba(0, 0, 0, 0.05)), 0 20px 25px -5px var(--shadow-lg, rgba(0, 0, 0, 0.05));' }
];

filesToProcess.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(r => {
        content = content.replace(r.target, r.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("CSS files updated successfully.");
