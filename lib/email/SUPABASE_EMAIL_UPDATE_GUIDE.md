# Updating the Email Confirmation Template in Supabase

## Overview
The current email confirmation template is generic and doesn't reflect the Bloom Psychology brand. This guide shows how to update it with our improved, warm, and welcoming template.

## Steps to Update

1. **Log into Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Email Templates**

2. **Update the Confirmation Email Template**
   - Find the "Confirm signup" template
   - Update the following fields:

### Subject Line
```
Welcome to Bloom Psychology - Please Confirm Your Email 🌸
```

### HTML Template
Copy the entire contents of `/lib/email/improved-confirmation-template.html`

Key improvements in this template:
- Warm, personal greeting from Dr. Jana
- Beautiful gradient header with Bloom branding
- Clear explanation of what happens next
- Inspirational quote from Dr. Jana
- Professional footer with social links
- Mobile-responsive design
- Fallback text for email clients that don't support HTML

### Text Template (for plain text emails)
Copy the contents of `/lib/email/improved-confirmation-template.txt`

## Variables Used
The template uses Supabase's built-in variables:
- `{{ .ConfirmationURL }}` - The confirmation link

## Testing
1. Create a test account to trigger the email
2. Check both HTML and plain text versions
3. Test on mobile devices
4. Verify the confirmation link works

## Brand Guidelines
- Primary color: #1e3a5f (Navy)
- Accent color: #f8b5c4 (Pink)
- Font: Georgia for headings, Helvetica Neue for body
- Tone: Warm, supportive, professional

## Support
If users have issues with confirmation emails:
- Check spam folders
- Resend option available in auth system
- Support email: support@bloompsychologynorthaustin.com