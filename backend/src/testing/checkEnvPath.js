import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log current directory and file existence
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

const possiblePaths = [
    '.env',
    '../.env',
    '../../.env',
    join(__dirname, '.env'),
    join(__dirname, '../.env'),
    join(__dirname, '../../.env')
];

console.log('\nChecking .env file in possible locations:');
possiblePaths.forEach(path => {
    console.log(`${path}: ${fs.existsSync(path) ? 'EXISTS' : 'NOT FOUND'}`);
});

// Try to load the .env file
config({ path: join(__dirname, '../../.env') });

// Check if variables are loaded
console.log('\nEnvironment Variables after loading:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not loaded');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[PRESENT]' : 'Not loaded');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not loaded');