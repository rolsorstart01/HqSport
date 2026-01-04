# How to Integrate Emails for FREE (No Paid Plans)

Since you want a completely free solution without upgrading to the Firebase Blaze plan, we will use **EmailJS**. This allows you to send emails directly from your website for free (up to 200 emails per month).

## Step 1: Set up EmailJS (5 Minutes)
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account.
2. **Add Service**: Connect your Gmail account (or any email provider). 
   - Note your `Service ID` (e.g., `service_abc123`).
3. **Email Templates**: Create a new template for "Booking Confirmations".
   - Use variables in double brackets like `{{user_name}}`, `{{booking_date}}`, `{{court_id}}`.
   - Note your `Template ID` (e.g., `template_xyz456`).
4. **Integration**: Go to the "Account" section and copy your `Public Key`.

## Step 2: Install the Library
Open your terminal in the project folder and run:
```bash
npm install @emailjs/browser
```

## Step 3: Implement in Code
I have already prepared the code logic. You just need to fill in your IDs in the new service file I've created.

---

### Why this is better for you:
- **0 Cost**: No need for a paid Firebase Blaze plan.
- **Easy Design**: You can design the email layout visually on the EmailJS website.
- **Real-time**: Emails are sent instantly after the payment is successful.
