# Phase 1: Day 3-4 Progress - Fix Service Role Usage

## Overview
Systematically fixing all 40 API routes that inappropriately use service role keys.

## Progress: 7/46 Completed (15%)

### ✅ Completed Routes (7)
1. `/app/api/profile/update/route.ts` - Already has secure version
2. `/app/api/contact/submit/route.ts` - Public contact form
3. `/app/api/admin/contacts/route.ts` - Admin contact management
4. `/app/api/webhooks/calendly/route.ts` - Webhook with signature validation
5. `/app/api/auth/signup/route.ts` - User registration
6. `/app/api/payments/charge-no-show/route.ts` - Payment processing
7. `/app/api/careers/apply/route.ts` - Career applications

### 🔄 In Progress - Priority Routes

#### Admin Auth Routes (Critical - Day 3)
- [ ] `/app/api/admin/auth/login/route.ts`
- [ ] `/app/api/admin/auth/logout/route.ts`
- [ ] `/app/api/admin/auth/session/route.ts`

#### User Profile Routes (High Priority - Day 3)
- [ ] `/app/api/profile/save/route.ts`
- [ ] `/app/api/user/newsletter-preferences/route.ts`
- [ ] `/app/api/user/newsletter-unsubscribe/route.ts`
- [ ] `/app/api/unsubscribe/route.ts`

#### Admin Management Routes (Day 3-4)
- [ ] `/app/api/admin/careers/route.ts`
- [ ] `/app/api/admin/careers/[id]/route.ts`
- [ ] `/app/api/admin/contacts/[id]/route.ts`

#### Analytics & Tracking Routes (Day 4)
- [ ] `/pages/api/analytics.ts`
- [ ] `/pages/api/track-event.ts`
- [ ] `/pages/api/track-clicks.ts`
- [ ] `/pages/api/track-email-open.ts`
- [ ] `/pages/api/track-email-click.ts`
- [ ] `/pages/api/heatmap-data.ts`

#### Email & Newsletter Routes (Day 4)
- [ ] `/pages/api/newsletter-signup.ts`
- [ ] `/pages/api/newsletter-admin.ts`
- [ ] `/pages/api/email-analytics.ts`
- [ ] `/pages/api/email-automations.ts`
- [ ] `/pages/api/email-templates.ts`

#### Other API Routes (Day 4)
- [ ] `/pages/api/calendly-webhook.ts`
- [ ] `/pages/api/chat-capture.ts`
- [ ] `/pages/api/chatbot.ts`
- [ ] `/pages/api/course/content.ts`
- [ ] `/pages/api/images-v2.ts`
- [ ] `/pages/api/upload-blog-image.ts`
- [ ] `/pages/api/trigger-resource-download.ts`
- [ ] `/pages/api/stripe/webhook-with-auth.ts`

#### Library Files (Day 4)
- [ ] `/lib/auth.ts` - Replace with secure version
- [ ] `/lib/supabase.ts`
- [ ] `/lib/blog-storage-supabase.ts`
- [ ] `/lib/email-automation.ts`

#### Archive/Debug Routes (Low Priority)
- [ ] `/archive/pages/api/backup.ts`
- [ ] `/archive/pages/api/debug/debug-email-save.ts`
- [ ] `/archive/pages/api/debug/test-registration.ts`
- [ ] `/archive/pages/api/test/test-env.ts`

#### Edge Functions
- [ ] `/supabase/functions/process-email-automation/index.ts`

## Key Patterns Applied

### 1. Public Endpoints (No Auth)
- Use anonymous Supabase client
- Add rate limiting
- Validate all inputs with Zod
- Rely on RLS policies for data access

### 2. Authenticated Endpoints
- Use `getAuthenticatedUser()` helper
- Verify user owns the resource
- Apply user context to queries
- Return 401 for unauthenticated requests

### 3. Admin Endpoints
- Check user role with `checkUserRole()`
- Log all admin actions
- Return 403 for unauthorized access
- Track IP and user agent

### 4. Webhook Endpoints
- Validate webhook signatures FIRST
- Only use service role after validation
- Log all webhook events
- Return success to prevent retries

## Testing Checklist for Each Route

- [ ] Test with valid authentication
- [ ] Test without authentication (should fail)
- [ ] Test with wrong user context (should fail)
- [ ] Verify RLS policies are working
- [ ] Check rate limiting is applied
- [ ] Validate error messages are secure
- [ ] Ensure no sensitive data leakage

## Next Steps

1. Continue with admin auth routes (critical path)
2. Fix user profile management routes
3. Update analytics and tracking endpoints
4. Migrate email/newsletter functionality
5. Update library files to use secure patterns
6. Test all endpoints thoroughly

## Notes

- Archive/debug routes are low priority as they're not in production use
- Some routes may need RLS policy updates or database functions
- Keep track of any new SQL migrations needed
- Document any breaking changes for frontend updates