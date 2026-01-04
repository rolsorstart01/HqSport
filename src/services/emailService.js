import emailjs from '@emailjs/browser';

/**
 * Service to send free emails using EmailJS
 * No backend or paid plan required.
 */

// REPLACE THESE with your actual IDs from EmailJS
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendBookingEmail = async (bookingData) => {
    if (SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.warn("EmailJS IDs not configured yet.");
        return;
    }

    const templateParams = {
        user_name: bookingData.userName,
        user_email: bookingData.userEmail,
        booking_date: bookingData.displayDate || bookingData.date,
        court_id: bookingData.courtId,
        amount: bookingData.paidAmount,
        payment_id: bookingData.paymentId,
        status: bookingData.status
    };

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        console.log('Email sent successfully!', response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
};
