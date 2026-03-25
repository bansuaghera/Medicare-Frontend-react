import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'layouts');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const rules = [
    { regex: /'#fff'/g, replacement: "'var(--bg-secondary)'" },
    { regex: /"#fff"/g, replacement: '"var(--bg-secondary)"' },
    { regex: /'#111827'/g, replacement: "'var(--text-primary)'" },
    { regex: /"#111827"/g, replacement: '"var(--text-primary)"' },
    { regex: /'#6b7280'/g, replacement: "'var(--text-secondary)'" },
    { regex: /"#6b7280"/g, replacement: '"var(--text-secondary)"' },
    { regex: /'#374151'/g, replacement: "'var(--text-tertiary)'" },
    { regex: /"#374151"/g, replacement: '"var(--text-tertiary)"' },
    { regex: /'#e5e7eb'/g, replacement: "'var(--border-color)'" },
    { regex: /"#e5e7eb"/g, replacement: '"var(--border-color)"' },
    { regex: /'#f9fafb'/g, replacement: "'var(--bg-tertiary)'" },
    { regex: /"#f9fafb"/g, replacement: '"var(--bg-tertiary)"' }
];

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    rules.forEach(rule => {
        content = content.replace(rule.regex, rule.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Layouts checked!");
