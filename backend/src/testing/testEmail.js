import { sendEmail } from "../utils/sendEmail.js";

const testEmailConfig = async () => {
    try {
        // First verify environment variables
        console.log('Testing Environment Variables:');
        console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
        console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
        console.log('EMAIL_FROM exists:', !!process.env.EMAIL_FROM);

        // Then try to send a test email
        await sendEmail({
            email: 'recipient@example.com',
            subject: 'Test Email',
            assigneeName: 'Test User',
            task: {
                title: 'Test Task',
                description: 'This is a test task',
                priority: 'High',
                startDate: new Date(),
                dueDate: new Date(Date.now() + 86400000) // Tomorrow
            }
        });
        
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Test failed:', error);
        // Print more detailed error information
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your email credentials.');
            console.error('Make sure you are using an App Password if using Gmail.');
        }
    }
};

testEmailConfig();