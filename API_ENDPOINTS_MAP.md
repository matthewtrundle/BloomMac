# API Endpoints Map

This document tracks which API endpoints are active and which have been archived.
Last updated: January 2025

## 🟢 Active Endpoints

### App Router (`/app/api/`)
- **Admin**
  - `/api/admin/auth/*` - Admin authentication
  - `/api/admin/analytics` - Analytics dashboard data
  - `/api/admin/activity-log` - Activity tracking
  - `/api/admin/careers` - Career postings management
  - `/api/admin/contacts` - Contact submissions

- **Email**
  - `/api/email-templates` - Email template management
  - `/api/email-analytics` - Email metrics and tracking
  - `/api/email-automations` - Email automation (placeholder)
  - `/api/test-email` - Test email sending
  - `/api/emails/send` - Main email sending
  - `/api/newsletter-admin` - Newsletter management

- **User**
  - `/api/user/newsletter-subscribe` - Newsletter subscription
  - `/api/user/newsletter-preferences` - Newsletter preferences
  - `/api/user/newsletter-unsubscribe` - Unsubscribe handling

- **Other**
  - `/api/recent-activity` - Dashboard activity feed
  - `/api/upload-blog-image` - Blog image uploads
  - `/api/generate-blog-image` - AI image generation (placeholder)
  - `/api/blog-admin-supabase` - Blog post management
  - `/api/contact/submit` - Contact form submission
  - `/api/careers/apply` - Career application submission

### Pages Router (`/pages/api/`) - Still Active

- **Course & Learning**
  - `/api/course/*` - All course-related endpoints
  - `/api/workbook/*` - Workbook functionality
  - `/api/course-access` - Course access management
  - `/api/course-purchase` - Course purchases
  - `/api/user-courses` - User course listings

- **Payments**
  - `/api/stripe/*` - All Stripe endpoints

- **Authentication**
  - `/api/auth/send-welcome-email` - Welcome emails

- **Chat & AI**
  - `/api/chatbot` - Chatbot functionality
  - `/api/chat-capture` - Chat data capture
  - `/api/chat-analytics` - Chat analytics

- **Utilities**
  - `/api/calendly-webhook` - Calendly integration
  - `/api/clear-cache` - Cache management
  - `/api/health/database` - Health checks
  - `/api/upload-image` - General image upload
  - `/api/images-v2` - Enhanced image handling
  - `/api/heatmap-data` - Heatmap analytics

- **Email (Legacy)**
  - `/api/email-automation` - Legacy automation
  - `/api/process-email-automation` - Automation processing

## 🔴 Archived Endpoints

These endpoints have been moved to `/archived_routes/pages/api/`:

### Replaced by App Router versions:
- `achievements.ts` → Use `/api/achievements/get`
- `analytics.ts` → Use `/api/admin/analytics`
- `recent-activity.ts` → Use `/api/recent-activity`
- `newsletter-signup.ts` → Use `/api/user/newsletter-subscribe`
- `track-email-click.ts` → Use `/api/email-analytics`
- `track-email-open.ts` → Use `/api/email-analytics`

### Obsolete/Unused:
- `send-postpartum-email.ts` - Legacy email functionality
- `track-event.ts` - Generic tracking (replaced)
- `track-clicks.ts` - Generic click tracking
- `generate-micro-self-care-pdf.ts` - PDF generation
- `trigger-resource-download.ts` - Resource downloads
- `analytics/track.ts` - Old analytics tracking

## 📋 Migration Notes

1. **Webhook Endpoints**: Keep in pages/api due to special body parsing requirements
2. **Course Endpoints**: Keep in pages/api until full migration strategy is planned
3. **Email Endpoints**: Gradually migrating to app/api with new implementations
4. **File Upload Endpoints**: Some use special configs (formidable), handle carefully

## 🎯 Next Steps

1. Gradually migrate remaining pages/api endpoints to app/api
2. Update all frontend references to use new endpoints
3. Remove legacy email automation after new system is fully tested
4. Consider consolidating course endpoints into app router