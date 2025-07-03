# Email Setup Documentation - Bloom Psychology

## Overview
The Bloom Psychology website uses **Resend** as the email service provider for all transactional and notification emails.

## Contact Form Email Flow

### ✅ FIXED: Issue Resolution
**Problem**: Contact form submissions were not sending notification emails to the business owner.

**Solution**: Added immediate email notifications in the contact form API route (`/app/api/contact/submit/route.ts`).

### Current Email Flow (After Fix)

1. **Customer submits contact form**
2. **Data saved to database** (`contact_submissions` table)
3. **🆕 Immediate notification email sent to Jana** (`jana@bloompsychologynorthaustin.com`)
4. **🆕 Confirmation email sent to customer**
5. **Email automation sequence triggered** (for follow-up emails)

## Email Types

### 1. Business Notification Email
- **Recipient**: `jana@bloompsychologynorthaustin.com`
- **Subject**: `🌸 New Contact: [Name] - [Service]`
- **Contains**: Name, email, phone, service, message, timestamp, admin dashboard link
- **Purpose**: Alert Jana about new contact form submissions

### 2. Customer Confirmation Email
- **Recipient**: Customer's email address
- **Subject**: `Thank you for contacting Bloom Psychology, [Name]`
- **Contains**: Confirmation message, next steps, resources, contact info, crisis support
- **Purpose**: Confirm receipt and set expectations

### 3. Email Automation Sequences
- **Newsletter welcome sequences**
- **Course enrollment emails**
- **Follow-up campaigns**
- **Managed by**: `/lib/email-automation.ts`

## Configuration

### Environment Variables
```bash
RESEND_API_KEY=re_VZWWPpP2_QApkX8qQnA86PDZPrYyVRce3
```

### Email From Address
- **Primary**: `Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>`
- **Website**: `Bloom Psychology Website <jana@bloompsychologynorthaustin.com>`

### Resend Client
- **Location**: `/lib/resend-client.ts`
- **Features**: Centralized client, error handling, email validation

## API Endpoints

### Contact Form Submission
- **Endpoint**: `POST /api/contact/submit`
- **File**: `/app/api/contact/submit/route.ts`
- **Features**:
  - Rate limiting
  - Validation
  - Database storage
  - ✅ Immediate notification emails
  - Email automation trigger
  - Analytics tracking

### Email Testing
- **Endpoint**: `GET /api/test/contact-email`
- **File**: `/app/api/test/contact-email/route.ts`
- **Purpose**: Test contact form notification emails

### Email Automation
- **Endpoint**: `GET /api/process-email-automation`
- **File**: `/pages/api/process-email-automation.ts`
- **Purpose**: Process scheduled email sequences (runs via cron)

## Database Tables

### contact_submissions
- Stores all contact form submissions
- Fields: name, email, phone, service, message, status, metadata

### subscribers
- Manages newsletter subscribers and email automation
- Auto-updated when contact form is submitted

### email_automation_logs
- Tracks sent emails for automation sequences
- Prevents duplicate emails

## Email Templates

### Location
- `/lib/email-templates/enhanced-emails.ts` - Newsletter templates
- `/lib/email-templates/course-emails.ts` - Course templates
- Contact form templates are inline in the API route

### Styling
- Responsive HTML design
- Bloom Psychology branding (colors: #1e3a5f, #f8b5c4)
- Professional layout with CTAs

## Rate Limiting

### Contact Form
- **Limit**: Configured in `/lib/rate-limit.ts`
- **Headers**: Returns rate limit info in response
- **Protection**: Prevents spam submissions

## Error Handling

### Email Failures
- **Strategy**: Fail gracefully - form submission succeeds even if emails fail
- **Logging**: Errors logged to console
- **Fallback**: Database still saves submission

### Invalid Emails
- **Validation**: Regex validation for email format
- **Handling**: Invalid emails are logged and skipped

## Monitoring

### Success Tracking
- Email IDs returned from Resend
- Console logging for successful sends
- Database logs for automation emails

### Analytics
- Contact form submissions tracked
- Email opens/clicks (for automation)
- GA4 events for form submissions

## Testing

### Manual Testing
```bash
# Test notification email
curl -X GET http://localhost:3001/api/test/contact-email

# Test complete contact form
curl -X POST http://localhost:3001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "message": "Test message"}'
```

### Production Testing
- Use `/admin/email-test` page for testing
- Monitor Resend dashboard for delivery status
- Check spam folders for initial emails

## Security

### API Keys
- Resend API key stored in environment variables
- Never exposed to client-side code

### Rate Limiting
- IP-based limiting prevents abuse
- Different limits for different endpoints

### Data Protection
- All form data stored securely in Supabase
- Sensitive data not logged to console

## Crisis Support

### Emergency Resources
- All customer-facing emails include crisis support info
- Phone: 911 for emergencies
- Text/Call: 988 for Suicide & Crisis Lifeline

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check RESEND_API_KEY in environment
   - Verify API key is active in Resend dashboard
   - Check console logs for errors

2. **Emails going to spam**
   - Verify sender domain authentication in Resend
   - Check email content for spam triggers
   - Ask recipients to whitelist sender

3. **Rate limiting errors**
   - Increase rate limits in `/lib/rate-limit.ts`
   - Check for automated attacks
   - Review IP whitelist if needed

### Health Checks
- Monitor email delivery rates in Resend dashboard
- Track contact form submission success rates
- Review error logs regularly

## Recent Changes (July 2025)

### Fixed Contact Form Email Issue
- **Before**: Contact forms only saved to database
- **After**: Contact forms send immediate notification + confirmation emails
- **Files Modified**: 
  - `/app/api/contact/submit/route.ts` - Added email notifications
  - `/app/api/test/contact-email/route.ts` - Added test endpoint

### Email Flow Now Working
1. ✅ Business notifications to Jana
2. ✅ Customer confirmations
3. ✅ Email automation sequences
4. ✅ Newsletter signups
5. ✅ Course enrollment emails

The contact form email system is now fully functional and tested.