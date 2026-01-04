# HQ Sport - EmailJS Setup Guide

I have refined the email integration per your latest request. Only **Booking Confirmation** and **Book Again** emails are active, each using its own template.

## 1. Credentials
- **Service ID**: `service_tqmjdek`
- **Public Key**: `1zzt1HtxIH31ysWGi`

## 2. Template Configuration
You need to set up these two templates on your [EmailJS Dashboard](https://dashboard.emailjs.com/):

### Template 1: Booking Confirmation
- **Template ID**: `template_rqt4y64`
- **Variables**:
  - `{{user_name}}`: Player Name
  - `{{user_email}}`: Player Email
  - `{{booking_date}}`: Date of booking
  - `{{court_id}}`: Court number
  - `{{amount}}`: Amount paid
  - `{{subject}}`: "Booking Confirmed - HQ Sport"

### Template 2: Book Again invitation
- **Template ID**: `template_fbxd0ht`
- **Variables**:
  - `{{user_name}}`: User Name
  - `{{user_email}}`: User Email
  - `{{subject}}`: "Ready for another game? Book your court at HQ Sport!"

## 3. Active Triggers
- **Booking**: Sent automatically after a successful payment/booking.
- **Book Again**: Logic added to the service for future admin/re-engagement use.

> [!NOTE]
> Account creation and cancellation emails have been removed as requested.
