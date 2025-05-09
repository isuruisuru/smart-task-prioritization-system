import nodeMailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "node:url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from multiple possible locations
const envPaths = [
    '.env',
    '../.env',
    '../../.env',
    path.join(__dirname, '.env'),
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../../.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        envLoaded = true;
        console.log(`Loaded .env from: ${envPath}`);
        break;
    }
}

if (!envLoaded) {
    console.error('Could not find .env file!');
    process.exit(1);
}

const sendEmail = async (
    subject,
    send_to,
    send_from,
    reply_to,
    template,
    name,
    task // Add task parameter
) => {
    // Create transporter with Gmail service
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true
    });

    const handlebarsOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve(__dirname, "../views"),
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, "../views"),
        extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarsOptions));

    // Prepare template data
    const templateData = {
        name: name,
        taskTitle: task.title,
        taskDescription: task.description,
        taskPriority: task.priority,
        taskStartDate: new Date(task.startDate).toLocaleDateString(),
        taskDueDate: new Date(task.dueDate).toLocaleDateString()
    };

    const mailOptions = {
        from: {
            name: "Smart Task Prioritization System",
            address: process.env.EMAIL_FROM
        },
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        template: template,
        context: templateData
    };

    try {
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