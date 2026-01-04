import emailjs from '@emailjs/browser';

/**
 * Service to send free emails using EmailJS
 * No backend or paid plan required.
 */

// REPLACE THESE with your actual IDs from EmailJS
const SERVICE_ID = 'service_tqmjdek';
const PUBLIC_KEY = '1zzt1HtxIH31ysWGi';

// Template IDs
const BOOKING_TEMPLATE_ID = 'template_rqt4y64';
const BOOK_AGAIN_TEMPLATE_ID = 'template_fbxd0ht';

export const sendBookingEmail = async (bookingData) => {
    if (SERVICE_ID === 'service_tqmjdek' && !PUBLIC_KEY) {
        console.warn("EmailJS not fully configured.");
        return;
    }

    const templateParams = {
        user_name: bookingData.userName,
        user_email: bookingData.userEmail,
        booking_date: bookingData.displayDate || bookingData.date,
        court_id: bookingData.courtId,
        amount: bookingData.paidAmount,
        payment_id: bookingData.paymentId,
        status: bookingData.status,
        subject: 'Booking Confirmed - HQ Sport'
    };

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            BOOKING_TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        console.log('Booking email sent successfully!', response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error('Failed to send booking email:', error);
        return { success: false, error };
    }
};

/**
 * Send 'Book Again' invitation email
 */
export const sendBookAgainEmail = async (userData) => {
    const templateParams = {
        user_name: userData.displayName || userData.email,
        user_email: userData.email,
        subject: 'Ready for another game? Book your court at HQ Sport!'
    };

    try {
        await emailjs.send(SERVICE_ID, BOOK_AGAIN_TEMPLATE_ID, templateParams, PUBLIC_KEY);
        return { success: true };
    } catch (error) {
        console.error('Failed to send re-booking email:', error);
        return { success: false, error };
    }
};


