/**
 * Firebase Cloud Function for Sending Booking Confirmation Emails
 * 
 * To implement this:
 * 1. Initialize Firebase Functions in your project: firebase init functions
 * 2. Use a service like SendGrid, Mailjet, or Postmark.
 * 3. Deploy this function.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your email provider (Example: Gmail or SendGrid)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});

exports.sendBookingConfirmation = functions.firestore
    .document('bookings/{bookingId}')
    .onCreate(async (snap, context) => {
        const booking = snap.data();
        const userEmail = booking.userEmail;

        const mailOptions = {
            from: 'HQ Sport <no-reply@hqsport.com>',
            to: userEmail,
            subject: 'Booking Confirmed - HQ Sport',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #D4AF37;">Booking Confirmed!</h2>
                    <p>Hello ${booking.userName},</p>
                    <p>Your court reservation at <strong>HQ Sport</strong> has been successfully confirmed.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Date:</strong> ${booking.displayDate || booking.date}</p>
                        <p><strong>Court:</strong> Court ${booking.courtId}</p>
                        <p><strong>Status:</strong> ${booking.status}</p>
                        <p><strong>Amount Paid:</strong> ₹${booking.paidAmount}</p>
                    </div>

                    <p>We look forward to seeing you at the arena!</p>
                    <p>Best regards,<br>The HQ Sport Team</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Confirmation email sent to:', userEmail);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });

/**
 * ALTERNATIVE: Firebase "Trigger Email" Extension
 * 
 * 1. Go to Firebase Console > Extensions.
 * 2. Install "Trigger Email".
 * 3. Configure it to listen to a collection (e.g., "mail").
 * 4. Update createBooking in firebase.js to also create a doc in "mail" 
 *    whenever a booking is made.
 */
