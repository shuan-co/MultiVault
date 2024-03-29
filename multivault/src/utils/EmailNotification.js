import emailjs from '@emailjs/browser';

// Function to send email notification
export const sendEmailNotification = async (recipientEmail, item, type) => {
    const emailServiceId = 'service_kinm5t9'; 
    const expiryTemplate = "template_th9ye6j";
    const lowStockTemplate = "template_yvo1v1c";
    const expirySubject = `[ITEM EXPIRING SOON] ${item.name} - Expires on ${item.expiry}`;
    const lowStockSubject = `[LOW STOCK ALERT] ${item.name} - Current Quantity: ${item.quantityCurr}`
    const publicKey = 'nvU6vuglwckEukEdf';

    let emailTemplate = "";
    let templateParams;

    if (type === "expiry") {
        emailTemplate = expiryTemplate;
        templateParams = {
            to_email: recipientEmail,
            subject: expirySubject,
            item_name: item.name,
            item_expiry: item.expiry
        };
    }
    else if (type === "lowstock") {
        emailTemplate = lowStockTemplate;
        templateParams = {
            to_email: recipientEmail,
            subject: lowStockSubject,
            item_name: item.name,
            quantity_curr: item.quantityCurr,
            quantity_orig: item.quantityOrig
        };
    }

    try {
        await emailjs.send(emailServiceId, emailTemplate, templateParams, publicKey);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
