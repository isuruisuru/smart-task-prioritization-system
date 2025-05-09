import nodemailer from "nodemailer";
import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
});

console.log('Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[PRESENT]' : '[MISSING]');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');

// Verify required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_FROM) {
    throw new Error('Missing required email environment variables');
}

// Create transporter with Gmail service
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


transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP connection error:", error);
    } else {
        console.log("SMTP server is ready to take our messages");
    }
});

const sendEmail = async ({ email, subject, assigneeName, task }) => {
    try {
        if (!email || !subject || !assigneeName || !task) {
            throw new Error('Missing required parameters for sending email');
        }

        console.log('Sending email with data:', {
            to: email,
            subject,
            assigneeName,
            task: {
                ...task,
                startDate: new Date(task.startDate).toISOString(),
                dueDate: new Date(task.dueDate).toISOString()
            }
        });

        const templatePath = join(__dirname, '../views/emailTemplate.handlebars');
        console.log('Template path:', templatePath);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Email template not found at path: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const templateData = {
            assigneeName,
            taskTitle: task.title,
            taskDescription: task.description,
            taskPriority: task.priority,
            taskStartDate: new Date(task.startDate).toLocaleDateString(),
            taskDueDate: new Date(task.dueDate).toLocaleDateString()
        };

        const html = template(templateData);

        const mailOptions = {
            from: {
                name: "Smart Task Prioritization System",
                address: process.env.EMAIL_FROM
            },
            to: email,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        if (error.response) {
            console.error("SMTP Response:", error.response);
        }
        throw error;
    }
};

export default sendEmail;