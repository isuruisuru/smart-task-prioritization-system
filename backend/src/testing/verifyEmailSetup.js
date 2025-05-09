import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env from multiple possible locations
const envPaths = [
    '.env',
    '../.env',
    '../../.env',
    join(__dirname, '.env'),
    join(__dirname, '../.env'),
    join(__dirname, '../../.env')
];

let envLoaded = false;
for (const path of envPaths) {
    if (fs.existsSync(path)) {
        config({ path });
        envLoaded = true;
        console.log(`Loaded .env from: ${path}`);
        break;
    }
}

if (!envLoaded) {
    console.error('Could not find .env file!');
    process.exit(1);
}

async function verifyEmailSetup() {
    // First check environment variables
    const envCheck = {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM
    };

    console.log('\nEnvironment Variables Check:');
    Object.entries(envCheck).forEach(([key, value]) => {
        console.log(`${key}: ${value ? 'Present' : 'Missing'}`);
    });

    if (!Object.values(envCheck).every(Boolean)) {
        console.error('\nMissing required environment variables!');
        return;
    }

    // Create test transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true
    });

    try {
        // Verify connection configuration
        await transporter.verify();
        console.log('\nSMTP connection successful!');
        
        // Try to send a test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'If you receive this email, your email configuration is working correctly.'
        });
        
        console.log('Test email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('\nError during email verification:', error);
        if (error.code === 'EAUTH') {
            console.error('\nPossible solutions:');
            console.error('1. Check if your EMAIL_USER and EMAIL_PASSWORD are correct');
            console.error('2. If using Gmail, ensure you\'re using an App Password');
            console.error('3. Verify that 2-Step Verification is enabled in your Google Account');
        }
    }
}

verifyEmailSetup();