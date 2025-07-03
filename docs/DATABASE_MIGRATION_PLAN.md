# Database Migration Plan for Bloom Psychology

## Current Status

Based on our audit, here's the current state of the database:

### ✅ Tables That Exist:
- `course_enrollments` (missing columns)
- `appointments` (missing columns)
- `user_achievements` (has basic structure)
- `newsletter_signups` (complete)

### ❌ Tables That Need Creation:
- `profiles`
- `user_progress`
- `workbook_responses`
- `workbook_questions`
- `course_activity_logs`

## Migration Steps

### Step 1: Backup Current Data
Before running any migrations, backup existing data:
```sql
-- Export existing data
pg_dump -h [host] -U [user] -d [database] -t course_enrollments -t appointments -t user_achievements > backup.sql
```

### Step 2: Run Migration Script
Execute the migration script in Supabase:
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `/supabase/migrations/001_complete_schema.sql`
3. Run the migration
4. Verify no errors occurred

### Step 3: Seed Initial Data (Optional)
```sql
-- Add sample workbook questions for Postpartum Wellness course
INSERT INTO workbook_questions (course_id, week_number, question_number, question_text, question_type) VALUES
('postpartum-wellness-foundations', 1, 1, 'What brought you to this course today?', 'textarea'),
('postpartum-wellness-foundations', 1, 2, 'What emotions are you experiencing most often?', 'textarea'),
('postpartum-wellness-foundations', 1, 3, 'What do you hope to gain from this journey?', 'textarea'),
('postpartum-wellness-foundations', 2, 1, 'What physical changes have surprised you most?', 'textarea'),
('postpartum-wellness-foundations', 2, 2, 'How has your thinking or memory changed?', 'textarea'),
('postpartum-wellness-foundations', 2, 3, 'What self-care practice could you commit to this week?', 'textarea'),
('postpartum-wellness-foundations', 3, 1, 'Who are the key people in your support network?', 'textarea'),
('postpartum-wellness-foundations', 3, 2, 'What kind of help is hardest for you to ask for?', 'textarea'),
('postpartum-wellness-foundations', 3, 3, 'What boundaries do you need to set?', 'textarea'),
('postpartum-wellness-foundations', 4, 1, 'What warning signs will you watch for?', 'textarea'),
('postpartum-wellness-foundations', 4, 2, 'What daily practice will you implement?', 'textarea'),
('postpartum-wellness-foundations', 4, 3, 'What additional support might you need?', 'textarea');
```

### Step 4: Update Application Code
After migration, update any hardcoded table references:

1. **Profile API** (`/api/profile/get/route.ts`)
   - ✅ Already uses correct table structure

2. **Workbook APIs** 
   - Update to use `workbook_questions` and `workbook_responses`
   - Currently may be using mock data

3. **Progress Tracking**
   - Update to use `user_progress` table
   - Track time spent and completion timestamps

### Step 5: Test Critical Flows

Test these user flows after migration:
1. ✅ User signup → Profile creation
2. ✅ Course enrollment (free course)
3. ✅ Lesson progress tracking
4. ✅ Workbook submission
5. ✅ Appointment booking
6. ✅ Achievement earning

## Column Mapping Reference

### profiles
| Column | Purpose | Used By |
|--------|---------|---------|
| first_name, last_name | Personalization | Dashboard greeting |
| postpartum_date | Journey tracking | Personalized messages |
| number_of_children | Content customization | Dashboard messages |
| phone | Contact info | Profile completeness |
| emergency_contact_* | Safety | Profile form |

### course_enrollments
| Column | Purpose | Used By |
|--------|---------|---------|
| enrollment_method | Track free vs paid | Analytics |
| amount_paid | Payment tracking | Revenue reports |
| stripe_payment_id | Payment verification | Stripe integration |
| status | Active/completed/cancelled | Course access |

### user_progress
| Column | Purpose | Used By |
|--------|---------|---------|
| lesson_number | Track specific lesson | Progress bar |
| completed | Completion status | Course navigation |
| time_spent_minutes | Engagement tracking | Analytics |
| completed_at | Completion timestamp | Activity logs |

### workbook_responses
| Column | Purpose | Used By |
|--------|---------|---------|
| is_draft | Save progress | Auto-save feature |
| is_submitted | Final submission | Progress tracking |
| response | User's answer | Workbook review |
| submitted_at | Submission time | Timeline tracking |

## Post-Migration Checklist

- [ ] All tables created successfully
- [ ] RLS policies are active
- [ ] Indexes created for performance
- [ ] Triggers functioning (test user signup)
- [ ] API endpoints returning data
- [ ] Dashboard loads without errors
- [ ] Course enrollment works
- [ ] Workbook submission works
- [ ] Profile updates save correctly

## Rollback Plan

If issues occur, rollback:
```sql
-- Restore from backup
psql -h [host] -U [user] -d [database] < backup.sql

-- Or selectively drop new tables
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS workbook_responses CASCADE;
DROP TABLE IF EXISTS workbook_questions CASCADE;
DROP TABLE IF EXISTS course_activity_logs CASCADE;
```

## Future Considerations

1. **Payment Integration**
   - Add `payment_intents` table for Stripe
   - Add `subscription_plans` table

2. **Content Management**
   - Add `courses` table (currently using JSON)
   - Add `lessons` table for dynamic content

3. **Analytics**
   - Add `user_metrics` table for aggregated stats
   - Add `revenue_reports` view

4. **Community Features**
   - Add `forum_posts` table
   - Add `user_messages` table
   - Add `group_sessions` table