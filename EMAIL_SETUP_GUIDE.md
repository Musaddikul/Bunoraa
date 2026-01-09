# Email Configuration Guide

## Option 1: Gmail SMTP (Recommended - Completely Free)

### Pros:
- ✅ Completely free
- ✅ Easy setup (5 minutes)
- ✅ No credit card needed
- ✅ Reliable delivery

### Cons:
- ⚠️ Limited to 500 emails/day
- ⚠️ Not ideal for high-volume production

### Setup Steps:

#### Step 1: Enable 2FA on Gmail (if not already enabled)
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the steps to enable it

#### Step 2: Create App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Windows Computer" as the device
4. Click "Generate"
5. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - Remove the spaces: `abcdefghijklmnop`

#### Step 3: Set Environment Variables
Add these to your `.env` file or system environment:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=noreply@bunoraa.com
```

#### Step 4: Restart Django
```bash
python manage.py runserver
```

#### Step 5: Test
```bash
python manage.py process_email_queue
```

---

## Option 2: Mailgun (Free - 10,000 emails/month)

### Pros:
- ✅ Completely free
- ✅ 10,000 emails/month
- ✅ Professional email service
- ✅ Great documentation

### Cons:
- ⚠️ Need to add credit card (not charged)
- ⚠️ Slightly more complex setup

### Setup Steps:

1. Go to [mailgun.com](https://mailgun.com)
2. Sign up (free)
3. Create a domain (or use sandbox)
4. Get your SMTP credentials from the Mailgun dashboard
5. Add to `.env`:

```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=postmaster@your-domain.mailgun.org
EMAIL_HOST_PASSWORD=your-mailgun-password
```

---

## Option 3: SendGrid (Free - 100 emails/day)

### Pros:
- ✅ Free tier available
- ✅ Professional service
- ✅ Good for testing

### Cons:
- ⚠️ Limited to 100 emails/day on free tier
- ⚠️ Credit card required

### Setup Steps:

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up
3. Create an API key
4. Add to `.env`:

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.your-api-key
```

---

## Test Commands

### Process Email Queue
```bash
python manage.py process_email_queue
```

### Verify Domain (after DNS setup)
```bash
python manage.py verify_email_domain bunoraa.com
```

### Show DNS Keys
```bash
python manage.py get_dns_keys bunoraa.com
```

### Send Test Email
```bash
python manage.py send_test_email --to test@example.com
```

---

## Troubleshooting

### "Sender refused: noreply@bunoraa.com"
- Make sure you've added the sender email to your Gmail account or SMTP service
- For Gmail: Use your Gmail email address

### "Connection refused"
- Check EMAIL_HOST and EMAIL_PORT are correct
- Make sure TLS is enabled (EMAIL_USE_TLS=True)

### "Authentication failed"
- Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- For Gmail: Use app password, not regular password
- Check there are no spaces in the password

### "SSL/TLS error"
- Make sure EMAIL_USE_TLS=True (port 587)
- Don't use port 465 with TLS (that's SMTPS)

---

## Current Status

Your email system is now:
- ✅ Seeded with templates
- ✅ Domain verified (SPF & DKIM)
- ✅ Sender identity configured
- ✅ Ready for SMTP configuration

All you need to do is set the environment variables and restart Django!
