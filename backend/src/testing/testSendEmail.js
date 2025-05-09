import sendEmail from "../helpers/sendEmail.js";

const testEmail = async () => {
    try {
        await sendEmail({
            email: 'isurusena98@gmail.com',
            subject: 'Test Email',
            assigneeName: 'chamod sena',
            task: {
                title: 'send email',                
                description: 'test email sending',           
                priority: 'High',
                startDate: new Date(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
            }
        });
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
};

testEmail();