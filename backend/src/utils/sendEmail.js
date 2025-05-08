import nodemailer from "nodemailer";
import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config();

// Debug: Log environment variables and paths
console.log('Current working directory:', process.cwd());
console.log('Environment file path:', join(process.cwd(), '.env'));
console.log('Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Password is set' : 'Password is not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Create transporter with Gmail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP connection error:", error);
    } else {
        console.log("SMTP server is ready to take our messages");
    }
});

const sendEmail = async ({ email, subject, assigneeName, task }) => {
    try {
        // Read email template
        const templatePath = join(__dirname, '../../templates/emailTemplate.html');
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        // Prepare template data
        const templateData = {
            assigneeName,
            taskTitle: task.title,
            taskDescription: task.description,
            taskPriority: task.priority,
            taskStartDate: new Date(task.startDate).toLocaleDateString(),
            taskDueDate: new Date(task.dueDate).toLocaleDateString()
        };

        // Generate HTML
        const html = template(templateData);

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export default sendEmail;
