import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
    path.join(__dirname, 'src', 'pages', 'user'),
    path.join(__dirname, 'src', 'layouts'),
];

const rules = [
    { regex: /#fff(?=[^A-Za-z0-9])/g, replacement: 'var(--bg-secondary)' },
    { regex: /#111827/g, replacement: 'var(--text-primary)' },
    { regex: /#6b7280/g, replacement: 'var(--text-secondary)' },
    { regex: /#374151/g, replacement: 'var(--text-tertiary)' },
    { regex: /#e5e7eb/g, replacement: 'var(--border-color)' },
    { regex: /#f9fafb/g, replacement: 'var(--bg-tertiary)' },
    { regex: /#f3f4f6/g, replacement: 'var(--bg-quaternary)' },
    { regex: /#d1d5db/g, replacement: 'var(--border-input)' },
    { regex: /#d1fae5/g, replacement: 'var(--pill-success-bg)' },
    { regex: /#10b981/g, replacement: 'var(--pill-success-text)' },
    { regex: /#f3e8ff/g, replacement: 'var(--pill-purple-bg)' },
    { regex: /#a855f7/g, replacement: 'var(--pill-purple-text)' },
    { regex: /#fef2f2/g, replacement: 'rgba(239, 68, 68, 0.1)' },
    { regex: /#fef9c3/g, replacement: 'rgba(234, 179, 8, 0.1)' }
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        rules.forEach(rule => {
            content = content.replace(rule.regex, rule.replacement);
        });
        fs.writeFileSync(filePath, content, 'utf8');
    });
});

console.log("Deep replacements complete!");
