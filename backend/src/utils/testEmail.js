import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname,  '../../.env') });

const sendTestEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    authMethod: 'PLAIN',
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'shahadiyashaa123@gmail.com',
      subject: 'Test Email',
      text: 'Hello world!',
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
};

sendTestEmail();
