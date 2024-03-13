import emailjs from '@emailjs/browser';

// Function to send email notification
export const sendEmailNotification = async (recipientEmail, item) => {
    const emailServiceId = 'service_kinm5t9'; 
    const emailTemplateId = 'template_th9ye6j'; 

    const emailSubject = `[ITEM EXPIRING SOON] ${item.name} - Expires on ${item.expiry}`;

    const templateParams = {
        to_email: recipientEmail, // Dynamic recipient email
        subject: emailSubject,
        item_name: item.name,
        item_expiry: item.expiry
    };

    try {
        await emailjs.send(emailServiceId, emailTemplateId, templateParams, 'nvU6vuglwckEukEdf');
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
