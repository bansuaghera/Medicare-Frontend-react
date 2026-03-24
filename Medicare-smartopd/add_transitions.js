import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'styles');
const filesToProcess = ['forgotPassword.css', 'verifyOTP.css'];

const replacements = [
    { target: /\.right-section {[^}]*}/gs, replacement: match => {
        if (!match.includes('transition:')) {
            return match.replace('}', '  transition: background-color 0.4s ease;\n}');
        }
        return match;
    }},
    { target: /(\.forgot-card|\.otp-card) {[^}]*}/gs, replacement: match => {
        if (!match.includes('transition:')) {
            return match.replace('}', '  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;\n}');
        }
        return match;
    }}
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

console.log("CSS transitions added.");
