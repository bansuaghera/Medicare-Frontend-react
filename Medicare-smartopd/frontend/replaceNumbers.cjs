const fs = require('fs');
const path = require('path');

const fileNames = [
    'src/pages/staff/RegisterPatient.jsx',
    'src/pages/staff/Profile.jsx',
    'src/pages/doctor/Profile.jsx',
    'src/pages/Contact.jsx',
    'src/pages/admin/PrescriptionDetail.jsx',
    'src/pages/admin/AddStaff.jsx',
    'src/pages/admin/AddPatient.jsx',
    'src/pages/admin/AddDoctor.jsx',
    'src/pages/user/Profile.jsx'
];

fileNames.forEach(relativePath => {
    const file = path.join('d:/React-Medicare/Frontend/Medicare-smartopd', relativePath);
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;
        
        const replacements = [
            ['+1 (234) 567-8900', '+91 98765 43210'],
            ['+1 234 567 8900', '+91 98765 43210'],
            ['+1 234-567-8900', '+91 98765-43210'],
            ['New York, NY 10001', 'Mumbai, MH 40001'],
            ['123 Healthcare Ave, Medical District, NY 10001', '123 Swasthya Marg, Medical District, Mumbai 400001'],
            ['123 Medical Center, Healthcare City', '123 Swasthya Kendra, New Delhi'],
            ['New York', 'Mumbai']
        ];
        
        for (const [oldVal, newVal] of replacements) {
            if (content.includes(oldVal)) {
                content = content.split(oldVal).join(newVal);
                changed = true;
            }
        }
        
        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated: ' + file);
        }
    }
});
