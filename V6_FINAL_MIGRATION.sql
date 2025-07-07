-- V6 FINAL MIGRATION SCRIPT
-- This script unifies the user and admin authentication systems, and consolidates the database schema.

-- 1. Migrate admin users to the user_profiles table
INSERT INTO user_profiles (id, first_name, last_name, role, created_at, updated_at)
SELECT id, name, '', 'admin', created_at, updated_at
FROM admin_users
ON CONFLICT (id) DO NOTHING;

-- 2. Update foreign key constraints
ALTER TABLE admin_sessions DROP CONSTRAINT IF EXISTS admin_sessions_admin_user_id_fkey;
ALTER TABLE admin_sessions ADD CONSTRAINT admin_sessions_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE course_discount_codes DROP CONSTRAINT IF EXISTS course_discount_codes_created_by_fkey;
ALTER TABLE course_discount_codes ADD CONSTRAINT course_discount_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE refund_requests DROP CONSTRAINT IF EXISTS refund_requests_processed_by_fkey;
ALTER TABLE refund_requests ADD CONSTRAINT refund_requests_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE course_announcements DROP CONSTRAINT IF EXISTS course_announcements_created_by_fkey;
ALTER TABLE course_announcements ADD CONSTRAINT course_announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- 3. Drop old RLS policies if they exist
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage career applications') THEN
    EXECUTE 'DROP POLICY "Admins can manage career applications" ON public.career_applications';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage courses') THEN
    EXECUTE 'DROP POLICY "Admins can manage courses" ON public.courses';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view activity logs') THEN
    EXECUTE 'DROP POLICY "Admins can view activity logs" ON public.admin_activity_log';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view all enrollments') THEN
    EXECUTE 'DROP POLICY "Admins can view all enrollments" ON public.course_enrollments';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view all profiles') THEN
    EXECUTE 'DROP POLICY "Admins can view all profiles" ON public.user_profiles';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view analytics') THEN
    EXECUTE 'DROP POLICY "Admins can view analytics" ON public.analytics_events';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view contact submissions') THEN
    EXECUTE 'DROP POLICY "Admins can view contact submissions" ON public.contact_submissions';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage course modules') THEN
    EXECUTE 'DROP POLICY "Admins can manage course modules" ON public.course_modules';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage course lessons') THEN
    EXECUTE 'DROP POLICY "Admins can manage course lessons" ON public.course_lessons';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage course resources') THEN
    EXECUTE 'DROP POLICY "Admins can manage course resources" ON public.course_resources';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Only admins can view stripe webhooks') THEN
    EXECUTE 'DROP POLICY "Only admins can view stripe webhooks" ON public.stripe_webhook_events';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Only admins can view calendly webhooks') THEN
    EXECUTE 'DROP POLICY "Only admins can view calendly webhooks" ON public.calendly_webhook_events';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Only admins can view email metrics') THEN
    EXECUTE 'DROP POLICY "Only admins can view email metrics" ON public.email_campaign_metrics';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Only admins can manage discount codes') THEN
    EXECUTE 'DROP POLICY "Only admins can manage discount codes" ON public.course_discount_codes';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view activity log') THEN
    EXECUTE 'DROP POLICY "Admins can view activity log" ON public.admin_activity_log';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view conversion events') THEN
    EXECUTE 'DROP POLICY "Admins can view conversion events" ON public.conversion_events';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage newsletter sends') THEN
    EXECUTE 'DROP POLICY "Admins can manage newsletter sends" ON public.newsletter_sends';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can view chatbot interactions') THEN
    EXECUTE 'DROP POLICY "Admins can view chatbot interactions" ON public.chatbot_interactions';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage email sends') THEN
    EXECUTE 'DROP POLICY "Admins can manage email sends" ON public.email_sends';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all subscribers') THEN
    EXECUTE 'DROP POLICY "Admins view all subscribers" ON public.subscribers';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage all subscribers') THEN
    EXECUTE 'DROP POLICY "Admins manage all subscribers" ON public.subscribers';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view triggers') THEN
    EXECUTE 'DROP POLICY "Admins view triggers" ON public.email_automation_triggers';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all preferences') THEN
    EXECUTE 'DROP POLICY "Admins view all preferences" ON public.user_preferences';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all appointment payments') THEN
    EXECUTE 'DROP POLICY "Admins view all appointment payments" ON public.appointment_payments';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage discount codes') THEN
    EXECUTE 'DROP POLICY "Admins manage discount codes" ON public.course_discount_codes';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all payment intents') THEN
    EXECUTE 'DROP POLICY "Admins view all payment intents" ON public.payment_intents';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage all refund requests') THEN
    EXECUTE 'DROP POLICY "Admins manage all refund requests" ON public.refund_requests';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all audit trails') THEN
    EXECUTE 'DROP POLICY "Admins view all audit trails" ON public.payment_methods_audit';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage modules') THEN
    EXECUTE 'DROP POLICY "Admins manage modules" ON public.course_modules';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage lessons') THEN
    EXECUTE 'DROP POLICY "Admins manage lessons" ON public.course_lessons';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage resources') THEN
    EXECUTE 'DROP POLICY "Admins manage resources" ON public.course_resources';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all progress') THEN
    EXECUTE 'DROP POLICY "Admins view all progress" ON public.course_progress';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage certificates') THEN
    EXECUTE 'DROP POLICY "Admins manage certificates" ON public.course_certificates';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all activity') THEN
    EXECUTE 'DROP POLICY "Admins view all activity" ON public.course_activity_logs';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage announcements') THEN
    EXECUTE 'DROP POLICY "Admins manage announcements" ON public.course_announcements';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage all templates') THEN
    EXECUTE 'DROP POLICY "Admins manage all templates" ON public.email_templates';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view queue') THEN
    EXECUTE 'DROP POLICY "Admins view queue" ON public.email_queue';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all metrics') THEN
    EXECUTE 'DROP POLICY "Admins view all metrics" ON public.email_campaign_metrics';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage sequences') THEN
    EXECUTE 'DROP POLICY "Admins manage sequences" ON public.email_sequences';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins manage sequence emails') THEN
    EXECUTE 'DROP POLICY "Admins manage sequence emails" ON public.sequence_emails';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view logs') THEN
    EXECUTE 'DROP POLICY "Admins view logs" ON public.email_automation_logs';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all unsubscribes') THEN
    EXECUTE 'DROP POLICY "Admins view all unsubscribes" ON public.email_unsubscribes';
END IF; END $$;

DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins view all SMS') THEN
    EXECUTE 'DROP POLICY "Admins view all SMS" ON public.sms_messages';
END IF; END $$;

-- 4. Create the new, correct RLS policies
CREATE POLICY "Admins can manage career applications" ON "public"."career_applications" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage courses" ON "public"."courses" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view activity logs" ON "public"."admin_activity_log" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view all enrollments" ON "public"."course_enrollments" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view all profiles" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view analytics" ON "public"."analytics_events" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view contact submissions" ON "public"."contact_submissions" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage course modules" ON "public"."course_modules" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage course lessons" ON "public"."course_lessons" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage course resources" ON "public"."course_resources" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Only admins can view stripe webhooks" ON "public"."stripe_webhook_events" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Only admins can view calendly webhooks" ON "public"."calendly_webhook_events" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Only admins can view email metrics" ON "public"."email_campaign_metrics" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Only admins can manage discount codes" ON "public"."course_discount_codes" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view conversion events" ON "public"."conversion_events" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage newsletter sends" ON "public"."newsletter_sends" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can view chatbot interactions" ON "public"."chatbot_interactions" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins can manage email sends" ON "public"."email_sends" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all subscribers" ON "public"."subscribers" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage all subscribers" ON "public"."subscribers" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view triggers" ON "public"."email_automation_triggers" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all preferences" ON "public"."user_preferences" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all appointment payments" ON "public"."appointment_payments" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all payment intents" ON "public"."payment_intents" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage all refund requests" ON "public"."refund_requests" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all audit trails" ON "public"."payment_methods_audit" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all progress" ON "public"."course_progress" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage certificates" ON "public"."course_certificates" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage announcements" ON "public"."course_announcements" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage all templates" ON "public"."email_templates" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view queue" ON "public"."email_queue" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage sequences" ON "public"."email_sequences" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins manage sequence emails" ON "public"."sequence_emails" FOR ALL TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view logs" ON "public"."email_automation_logs" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all unsubscribes" ON "public"."email_unsubscribes" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

CREATE POLICY "Admins view all SMS" ON "public"."sms_messages" FOR SELECT TO "authenticated" USING (
  (EXISTS ( SELECT 1 FROM "public"."user_profiles" WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin'))))
);

-- 5. Drop the unified_users view
DROP VIEW IF EXISTS unified_users;

-- 6. Drop the old admin_users table
DROP TABLE IF EXISTS admin_users;

-- 7. Migrate and drop the old newsletter_subscribers table
INSERT INTO subscribers (email, first_name, last_name, status, source, created_at, updated_at)
SELECT email, first_name, last_name, status, source, subscribed_at, updated_at
FROM newsletter_subscribers
ON CONFLICT (email) DO NOTHING;

DROP TABLE IF EXISTS newsletter_subscribers;
