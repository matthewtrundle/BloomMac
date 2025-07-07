DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can manage career applications" ON "public"."career_applications"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can manage career applications" ON "public"."career_applications" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can manage courses" ON "public"."courses"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can manage courses" ON "public"."courses" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can view activity logs" ON "public"."admin_activity_log"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can view activity logs" ON "public"."admin_activity_log" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can view all enrollments" ON "public"."course_enrollments"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can view all enrollments" ON "public"."course_enrollments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can view all profiles" ON "public"."user_profiles"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can view all profiles" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can view analytics" ON "public"."analytics_events"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can view analytics" ON "public"."analytics_events" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));

DO $
BEGIN
  EXECUTE 'DROP POLICY "Admins can view contact submissions" ON "public"."contact_submissions"';
EXCEPTION
  WHEN OTHERS THEN
    -- Do nothing
END;
$;
CREATE POLICY "Admins can view contact submissions" ON "public"."contact_submissions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = 'admin')))));
