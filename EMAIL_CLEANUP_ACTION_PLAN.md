# Email Template Cleanup - Key Findings & Action Plan

## 📊 CURRENT STATE ANALYSIS

### Database Overview
- **Total Email Templates**: 31 across 3 tables
  - `email_templates`: 6 templates
  - `email_templates_custom`: 10 templates  
  - `sequence_emails`: 15 templates
- **Actively Used**: Only 11 templates (35%)
- **Orphaned/Unused**: 20 templates (65%)

### Active Email Flows
1. **Newsletter Signup** (`newsletter_signup` trigger)
   - Status: ✅ ACTIVE & WORKING
   - Sequence ID: `c8f5fb8f-dad1-46c4-84e4-3464310354e6`
   - Sends 5 emails over 30 days
   - Triggered from: profile settings, public newsletter forms

2. **Contact Form** (`contact_form` trigger)
   - Status: ✅ ACTIVE & WORKING
   - Sequence ID: `9f454fab-a3e2-4af4-a680-f65bceadf3a9`
   - Immediate emails: notifications to admins + customer confirmation
   - Follow-up: 3 emails over 7 days (just implemented)
   - Triggered from: contact form submissions

### Disabled/Archived Flows
1. **Resource Download** (`resource_download` trigger)
   - Status: 🗃️ ARCHIVED
   - Reason: All resources are free content, no gated downloads
   - Decision: Business model change - resources openly accessible

2. **New Mom Program** (`new_mom_program` trigger)
   - Status: 🚫 DISABLED BY DESIGN
   - Reason: Bookings handled via Calendly
   - Decision: No email automation needed for 1:1 support

## 🎯 ACTION PLAN

### Phase 1: Database Cleanup

#### 1.1 Delete Orphaned Templates from `email_templates`
```sql
-- Delete duplicate newsletter welcomes and orphaned templates
DELETE FROM email_templates 
WHERE name IN (
  'Newsletter Welcome',
  'Newsletter Welcome Back',
  'New Mom Support Program',
  '5 Ways to Manage Daily Anxiety'
);
```

#### 1.2 Delete Unused Custom Templates from `email_templates_custom`
```sql
-- Delete all orphaned custom templates
DELETE FROM email_templates_custom 
WHERE sequence IN (
  'bookingConfirmation',
  'leadNurture',
  'contactFollowup',  -- old version
  'newsletter'        -- old version
);
```

#### 1.3 Archive Unused Sequences
```sql
-- Set unused sequences to archived status
UPDATE email_sequences 
SET status = 'archived'
WHERE trigger IN ('resource_download', 'new_mom_program');

-- Set old newsletter sequence to archived
UPDATE email_sequences 
SET status = 'archived'
WHERE id = '655f6a5e-483c-4a39-85a3-0674ca0d0758';
```

#### 1.4 Delete Emails from Archived Sequences
```sql
-- Delete emails from archived sequences
DELETE FROM sequence_emails 
WHERE sequence_id IN (
  SELECT id FROM email_sequences 
  WHERE status = 'archived'
);
```

### Phase 2: Code Cleanup

#### 2.1 Remove Unused Trigger Code
- Remove any references to `resource_download` trigger
- Remove any references to `new_mom_program` trigger
- Clean up enrollment manager to only handle active triggers

#### 2.2 Update Email Center UI
- Filter out archived sequences from display
- Show only active templates
- Add clear labels for template sources
- Update counts to reflect actual active templates

### Phase 3: Documentation Update

#### 3.1 Update CLAUDE.md
- Document the final email automation structure
- List only active triggers and sequences
- Remove references to archived features

#### 3.2 Create Email System Documentation
- Document each active email flow
- Include trigger points and timing
- Add template customization guide

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Create database backup before cleanup
- [ ] Run Phase 1 SQL scripts to clean database
- [ ] Test email flows still work after cleanup
- [ ] Update Email Center UI to hide archived content
- [ ] Remove unused trigger code
- [ ] Update documentation
- [ ] Test all email triggers in staging
- [ ] Deploy to production

## 🔄 EXPECTED OUTCOME

### Before Cleanup:
- 31 total templates (confusing mix)
- 5 email sequences (3 unused)
- Unclear which templates are active

### After Cleanup:
- 11 active templates only
- 2 active sequences (newsletter + contact)
- Clear, manageable email system
- No orphaned templates

## ⚠️ IMPORTANT NOTES

1. **Always backup database** before running cleanup scripts
2. **Test in staging first** - ensure active flows still work
3. **Keep archive record** of deleted templates (export first)
4. **Update any hardcoded** template references in code
5. **Monitor email sending** after cleanup to ensure no disruption

## 🚀 NEXT STEPS

1. Review and approve this action plan
2. Schedule maintenance window for cleanup
3. Create database backup
4. Execute cleanup in staging environment
5. Verify functionality
6. Deploy to production
7. Monitor for 48 hours post-deployment

---

This cleanup will reduce email template complexity by 65% and make the system much more maintainable.