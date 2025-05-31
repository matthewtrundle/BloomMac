# Email Spam Prevention Guide

## Why Emails Go to Spam

Your emails might be going to spam due to several factors. Here's a comprehensive guide to fix this:

## 1. Domain Authentication (MOST IMPORTANT)

### SPF Record
Add this to your DNS records:
```
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:sendgrid.net include:_spf.resend.com ~all
```

### DKIM
Resend provides DKIM records. Check your Resend dashboard:
1. Go to Resend Dashboard → Domains
2. Add bloompsychologynorthaustin.com
3. Copy the DKIM records they provide
4. Add them to your DNS

### DMARC
Add this DNS record:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@bloompsychologynorthaustin.com
```

## 2. Email Content Issues

### Current Problems in Your Emails:
1. **Too Many Emojis**: While emojis are good, overuse triggers spam filters
2. **Spam Trigger Words**: "FREE", "Click here", "Limited time"
3. **ALL CAPS**: Avoid using all caps in subject lines

### Quick Fixes:
```javascript
// In your email templates, replace:
"🎁 Get Your FREE Guide NOW! 🎁"
// With:
"Your Mental Wellness Guide is Ready"

// Replace:
"CLICK HERE FOR YOUR FREE GIFT!!!"
// With:
"Access your complimentary wellness guide"
```

## 3. Sender Reputation

### Use a Proper From Address
```javascript
// Current (might be an issue):
from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>'

// Better:
from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>'
```

### Add a Physical Address
All emails must include a physical address (CAN-SPAM requirement):
```html
<p style="font-size: 12px; color: #666; text-align: center;">
  Bloom Psychology | 123 N Highway 183, Austin, TX 78750
</p>
```

## 4. Technical Improvements

### Add List-Unsubscribe Header
```javascript
// In your Resend API calls:
await resend.emails.send({
  from: 'jana@bloompsychologynorthaustin.com',
  to: email,
  subject: subject,
  html: htmlContent,
  headers: {
    'List-Unsubscribe': '<mailto:unsubscribe@bloompsychologynorthaustin.com>',
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
  }
});
```

### Implement One-Click Unsubscribe
Add to all emails:
```html
<p style="text-align: center; font-size: 12px;">
  <a href="https://bloompsychologynorthaustin.com/api/unsubscribe?email={{email}}&token={{token}}">
    Unsubscribe instantly
  </a>
</p>
```

## 5. Email Warm-Up Strategy

### Start Slow
1. Send to engaged subscribers first
2. Gradually increase volume
3. Monitor open rates

### Ask Recipients to Whitelist
Add this to your first email:
```html
<p>To ensure you receive our wellness tips, please add 
jana@bloompsychologynorthaustin.com to your contacts or 
move this email to your primary inbox.</p>
```

## 6. Quick Implementation

Here's updated code for your email API to reduce spam likelihood:

```javascript
// pages/api/send-email.ts
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = 'jana@bloompsychologynorthaustin.com'
}) {
  // Remove excessive emojis from subject
  const cleanSubject = subject
    .replace(/[🎁🎉✨💝]{2,}/g, '') // Remove multiple emojis
    .replace(/FREE/g, 'Complimentary')
    .replace(/!/g, '');

  return await resend.emails.send({
    from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
    to,
    subject: cleanSubject,
    html: html + getFooter(),
    replyTo,
    headers: {
      'List-Unsubscribe': `<https://bloompsychologynorthaustin.com/unsubscribe?email=${to}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'X-Entity-Ref-ID': generateUniqueId() // Helps with threading
    }
  });
}

function getFooter() {
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
      <p>
        Bloom Psychology for Women<br>
        123 N Highway 183, Austin, TX 78750<br>
        <a href="tel:512-555-0123" style="color: #666;">512-555-0123</a>
      </p>
      <p>
        <a href="https://bloompsychologynorthaustin.com/unsubscribe" style="color: #666;">
          Unsubscribe from these emails
        </a>
      </p>
    </div>
  `;
}
```

## 7. Testing Tools

Use these to check your email spam score:
1. **Mail-Tester**: https://www.mail-tester.com/
2. **GlockApps**: https://glockapps.com/spam-testing
3. **Postmark Spamcheck**: https://spamcheck.postmarkapp.com/

## 8. Immediate Actions

1. **Today**: 
   - Update email templates to remove spam triggers
   - Add physical address to all emails
   - Reduce emoji usage to 1-2 per email

2. **This Week**:
   - Set up SPF, DKIM, DMARC records
   - Implement unsubscribe functionality
   - Test emails with Mail-Tester

3. **Ongoing**:
   - Monitor open rates
   - Clean your email list regularly
   - Ask engaged users to whitelist

## 9. Email Template Updates Needed

I can update your enhanced email templates to be more spam-friendly while keeping them engaging. The key is to:
- Use emojis sparingly (1-2 per email max)
- Avoid spam trigger words
- Include proper footer with address
- Add unsubscribe link
- Use professional from address

Would you like me to update all your email templates with these spam-prevention best practices?