# 🔐 RLS Implementation Operational Plan - Bloom Psychology

## Executive Summary

This plan provides a comprehensive strategy for implementing Row Level Security (RLS) policies across the Bloom Psychology database. Based on the current state analysis, we have identified tables requiring RLS implementation, grouped them by functionality, and created a phased rollout plan to minimize risk.

## 📊 Current RLS Status Overview

### Tables WITH RLS Enabled (From current-local-schema.sql)
- ✅ admin_activity_log
- ✅ analytics_events
- ✅ appointment_data
- ✅ career_applications
- ✅ contact_submissions
- ✅ course_enrollments
- ✅ courses
- ✅ posts
- ✅ user_profiles

### Tables WITHOUT RLS Enabled
- ❌ admin_users (Correct - admin tables shouldn't have RLS)
- ❌ email_automation_triggers
- ❌ subscribers

### Missing Tables Requiring RLS (From audit reports)
- ❌ stripe_webhook_events
- ❌ calendly_webhook_events
- ❌ user_notifications
- ❌ email_campaign_metrics
- ❌ course_discount_codes
- ❌ therapist_profiles
- ❌ payment_intents
- ❌ refund_requests

## 🗂️ Table Grouping by Functionality

### Group 1: User Data & Privacy (CRITICAL)
**Priority: HIGHEST**
```sql
- user_profiles ✅
- user_preferences (missing)
- user_achievements (missing)
- user_notifications (missing)
- wellness_entries (missing)
- user_payment_methods (missing)
```

### Group 2: Course & Learning Management
**Priority: HIGH**
```sql
- courses ✅
- course_enrollments ✅
- course_progress (missing)
- course_modules (missing)
- course_lessons (missing)
- course_resources (missing)
- course_certificates (missing)
- course_discount_codes (missing)
```

### Group 3: Payment & Financial
**Priority: HIGH**
```sql
- appointment_payments (missing)
- payment_intents (missing)
- refund_requests (missing)
- stripe_webhook_events (missing)
```

### Group 4: Appointments & Scheduling
**Priority: HIGH**
```sql
- appointment_data ✅
- calendly_webhook_events (missing)
- therapist_profiles (missing)
- therapist_availability (missing)
```

### Group 5: Communication & Marketing
**Priority: MEDIUM**
```sql
- subscribers ❌
- email_automation_triggers ❌
- email_campaign_metrics (missing)
- email_templates (missing)
- email_queue (missing)
- user_notifications (missing)
```

### Group 6: Content Management
**Priority: MEDIUM**
```sql
- posts ✅
- blog_images (missing)
- blog_comments (missing)
- resources (missing)
```

### Group 7: Analytics & Logging
**Priority: LOW**
```sql
- analytics_events ✅
- admin_activity_log ✅
- user_activity_log (missing)
- audit_trail (missing)
```

### Group 8: Support & Operations
**Priority: LOW**
```sql
- contact_submissions ✅
- career_applications ✅
- support_tickets (missing)
- chat_conversations (missing)
```

## 🎯 Security Implementation Strategy

### Phase 1: Critical User Data (Week 1-2)
**Focus: Protect sensitive user information**

1. **Create Missing User Tables with RLS**
```sql
-- Example: user_notifications
CREATE TABLE user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users view own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System creates notifications" ON user_notifications
    FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id);
```

2. **Fix Missing RLS on Existing Tables**
```sql
-- Enable RLS on subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe
CREATE POLICY "Anyone can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Only admins can view all subscribers
CREATE POLICY "Admins view all subscribers" ON subscribers
    FOR SELECT USING (is_admin());

-- Users can update their own subscription
CREATE POLICY "Users manage own subscription" ON subscribers
    FOR UPDATE USING (auth.uid()::text = metadata->>'user_id');
```

### Phase 2: Financial Security (Week 3-4)
**Focus: Protect payment and financial data**

1. **Payment Tables RLS**
```sql
-- Example: payment_intents
CREATE POLICY "Users view own payments" ON payment_intents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System manages payments" ON payment_intents
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all payments" ON payment_intents
    FOR SELECT USING (is_admin());
```

2. **Webhook Security**
```sql
-- Webhook tables should only be accessible by service role
CREATE POLICY "Service role only" ON stripe_webhook_events
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### Phase 3: Course Access Control (Week 5-6)
**Focus: Ensure proper course access**

1. **Course Content RLS**
```sql
-- Users can only view lessons for enrolled courses
CREATE POLICY "View enrolled course lessons" ON course_lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN course_modules cm ON cm.course_id = ce.course_id
            WHERE ce.user_id = auth.uid()
            AND ce.status = 'active'
            AND cm.id = course_lessons.module_id
        )
    );
```

### Phase 4: Communication Control (Week 7-8)
**Focus: Email and notification privacy**

1. **Email System RLS**
```sql
-- Email templates visible to admins only
CREATE POLICY "Admins manage templates" ON email_templates
    FOR ALL USING (is_admin());

-- Email queue managed by system
CREATE POLICY "System manages queue" ON email_queue
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

## 🚀 Implementation Checklist

### Pre-Implementation
- [ ] Backup all production data
- [ ] Create rollback scripts for each phase
- [ ] Test RLS policies in staging environment
- [ ] Document all policy decisions
- [ ] Review HIPAA compliance requirements

### Phase 1 Tasks
- [ ] Create user_notifications table with RLS
- [ ] Create user_preferences table with RLS
- [ ] Create user_achievements table with RLS
- [ ] Enable RLS on subscribers table
- [ ] Enable RLS on email_automation_triggers
- [ ] Test user data access patterns

### Phase 2 Tasks
- [ ] Create payment_intents table with RLS
- [ ] Create refund_requests table with RLS
- [ ] Create stripe_webhook_events table with RLS
- [ ] Implement payment view policies
- [ ] Test payment workflows

### Phase 3 Tasks
- [ ] Create course content tables with RLS
- [ ] Implement enrollment-based access
- [ ] Create course_discount_codes with admin-only access
- [ ] Test course access patterns

### Phase 4 Tasks
- [ ] Implement email system RLS
- [ ] Create notification preferences
- [ ] Test email delivery workflows

## 🔍 Monitoring & Validation

### Key Metrics to Track
1. **Query Performance**
   - Monitor query execution times
   - Track slow queries after RLS implementation
   - Optimize policies causing performance issues

2. **Access Patterns**
   - Log policy violations
   - Track successful/failed access attempts
   - Monitor unusual access patterns

3. **User Experience**
   - Track page load times
   - Monitor API response times
   - Collect user feedback on access issues

### Validation Queries
```sql
-- Check tables without RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false
AND tablename NOT LIKE 'admin_%'
ORDER BY tablename;

-- Count policies per table
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY policy_count DESC;

-- Test user access
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'test-user-id';
SELECT * FROM user_profiles; -- Should only see own profile
```

## 🚨 Risk Mitigation

### Potential Risks
1. **Performance Degradation**
   - Mitigation: Add indexes for RLS policy conditions
   - Monitor query plans and execution times

2. **Access Denial**
   - Mitigation: Thoroughly test all user workflows
   - Have rollback scripts ready

3. **Data Leakage**
   - Mitigation: Audit all policies for completeness
   - Regular security reviews

### Rollback Strategy
```sql
-- Example rollback for a table
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

## 📅 Timeline Summary

**Total Duration: 8 weeks**

- **Week 1-2**: Critical user data protection
- **Week 3-4**: Financial security implementation
- **Week 5-6**: Course access control
- **Week 7-8**: Communication and final systems

**Buffer Time**: 2 additional weeks for testing and adjustments

## 🎯 Success Criteria

1. **Security Goals**
   - [ ] All user data tables have appropriate RLS
   - [ ] No unauthorized data access possible
   - [ ] HIPAA compliance maintained
   - [ ] Admin access properly controlled

2. **Performance Goals**
   - [ ] No more than 10% query performance degradation
   - [ ] API response times remain under 200ms
   - [ ] No timeout errors due to RLS

3. **Operational Goals**
   - [ ] Zero data breaches during implementation
   - [ ] All existing features continue working
   - [ ] Clear audit trail of all changes

## 📝 Next Steps

1. **Immediate Actions**
   - Review and approve this plan
   - Assign team members to each phase
   - Set up staging environment for testing
   - Create detailed rollback procedures

2. **Communication**
   - Notify development team of timeline
   - Prepare user communication if needed
   - Schedule regular progress reviews

3. **Documentation**
   - Document all policy decisions
   - Create RLS best practices guide
   - Update security documentation

This comprehensive plan ensures a secure, phased implementation of RLS across the Bloom Psychology platform while minimizing risk and maintaining system performance.