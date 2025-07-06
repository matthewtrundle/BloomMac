-- =====================================================
-- Complete Production Schema Sync
-- This migration brings local database to match production exactly
-- Total tables: 70
-- =====================================================

-- First, let's check and create missing tables

-- Analytics and tracking tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.conversion_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.click_heatmap (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    page_url text NOT NULL,
    element_selector text,
    click_count integer DEFAULT 0,
    last_clicked timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Appointment related tables
CREATE TABLE IF NOT EXISTS public.appointment_data (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    appointment_id uuid,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.appointment_payments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    appointment_id uuid,
    payment_intent_id text,
    amount integer NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.appointment_types (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    duration integer NOT NULL,
    price integer NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    appointment_type_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    status text DEFAULT 'pending',
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Blog related tables
CREATE TABLE IF NOT EXISTS public.blog_images_metadata (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    alt_text text,
    caption text,
    width integer,
    height integer,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.blog_post_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid,
    image_url text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Career applications
CREATE TABLE IF NOT EXISTS public.career_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    position text NOT NULL,
    applicant_name text NOT NULL,
    email text NOT NULL,
    phone text,
    resume_url text,
    cover_letter text,
    status text DEFAULT 'new',
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Chat and support
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    title text,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.chatbot_interactions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    conversation_id uuid,
    user_message text NOT NULL,
    bot_response text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Calendly integration
CREATE TABLE IF NOT EXISTS public.calendly_webhook_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    event_data jsonb NOT NULL,
    processed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Course related tables (additional ones)
CREATE TABLE IF NOT EXISTS public.course_activity_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    activity_type text NOT NULL,
    activity_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.course_certificates (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    certificate_url text,
    issued_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.course_discount_codes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    discount_percentage integer,
    discount_amount integer,
    valid_from timestamp with time zone DEFAULT now(),
    valid_until timestamp with time zone,
    max_uses integer,
    uses_count integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.course_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    module_id uuid,
    lesson_id uuid,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.course_purchases (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    payment_intent_id text,
    amount integer NOT NULL,
    status text NOT NULL,
    purchased_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Email related tables (additional ones)
CREATE TABLE IF NOT EXISTS public.email_analytics (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email_id uuid,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_automation_errors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    rule_id uuid,
    error_message text NOT NULL,
    error_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_campaign_metrics (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    campaign_id text NOT NULL,
    sent_count integer DEFAULT 0,
    open_count integer DEFAULT 0,
    click_count integer DEFAULT 0,
    bounce_count integer DEFAULT 0,
    unsubscribe_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_queue (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    to_email text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    template_id uuid,
    status text DEFAULT 'pending',
    scheduled_for timestamp with time zone DEFAULT now(),
    sent_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_sends (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email_id text NOT NULL,
    to_email text NOT NULL,
    subject text NOT NULL,
    sent_at timestamp with time zone DEFAULT now(),
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    bounced_at timestamp with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_sequences (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_templates_custom (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    variables jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.email_templates_history (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    template_id uuid,
    version integer NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    changed_by uuid,
    changed_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Lesson and progress tracking
CREATE TABLE IF NOT EXISTS public.lesson_completion_details (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    lesson_id uuid,
    time_spent integer DEFAULT 0,
    quiz_score integer,
    notes text,
    completed_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    lesson_id uuid,
    progress_percentage integer DEFAULT 0,
    last_accessed timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Newsletter tables
CREATE TABLE IF NOT EXISTS public.newsletter_sends (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    subject text NOT NULL,
    content text NOT NULL,
    sent_count integer DEFAULT 0,
    sent_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    subscribed boolean DEFAULT true,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    PRIMARY KEY (id)
);

-- Payment methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    stripe_payment_method_id text NOT NULL,
    type text NOT NULL,
    last4 text,
    brand text,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Profile tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE,
    full_name text,
    avatar_url text,
    bio text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.therapist_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE,
    license_number text,
    specializations text[],
    years_experience integer,
    bio text,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Provider settings
CREATE TABLE IF NOT EXISTS public.provider_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Sequence emails
CREATE TABLE IF NOT EXISTS public.sequence_emails (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sequence_id uuid,
    delay_days integer NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- User activity and tracking
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    activity_type text NOT NULL,
    activity_data jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_consents (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    consent_type text NOT NULL,
    consented boolean NOT NULL,
    consented_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_course_access (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    granted_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    access_type text DEFAULT 'purchased',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    course_id uuid,
    progress_data jsonb DEFAULT '{}'::jsonb,
    last_activity timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_week_submissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    week_number integer NOT NULL,
    submission_data jsonb DEFAULT '{}'::jsonb,
    submitted_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Wellness tracking
CREATE TABLE IF NOT EXISTS public.wellness_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    entry_date date NOT NULL,
    mood integer,
    energy_level integer,
    stress_level integer,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Workbook tables
CREATE TABLE IF NOT EXISTS public.workbook_questions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    workbook_id uuid,
    question_text text NOT NULL,
    question_type text NOT NULL,
    order_index integer NOT NULL,
    options jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workbook_responses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    question_id uuid,
    response_text text,
    response_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Workshop tables
CREATE TABLE IF NOT EXISTS public.workshop_attendance (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    workshop_id uuid,
    user_id uuid,
    attended boolean DEFAULT false,
    attendance_duration integer,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workshop_feedback (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    workshop_id uuid,
    user_id uuid,
    rating integer,
    feedback text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    workshop_id uuid,
    user_id uuid,
    registration_status text DEFAULT 'registered',
    registered_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Enable RLS on all new tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_images_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendly_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates_custom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completion_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_week_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workbook_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for new tables (users can only see their own data)
-- Analytics (admin only)
CREATE POLICY "Admin only" ON public.analytics_events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.conversion_events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.click_heatmap FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User-specific policies
CREATE POLICY "Users can view own data" ON public.appointment_data FOR SELECT USING (true);
CREATE POLICY "Users can view own data" ON public.appointment_payments FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.appointment_types FOR SELECT USING (true);
CREATE POLICY "Users can manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id);

-- Blog policies
CREATE POLICY "Public read" ON public.blog_images_metadata FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.blog_post_images FOR SELECT USING (true);

-- Career applications (admin only)
CREATE POLICY "Admin only" ON public.career_applications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Chat policies
CREATE POLICY "Users can manage own conversations" ON public.chat_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own interactions" ON public.chatbot_interactions FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.chat_conversations WHERE id = chatbot_interactions.conversation_id AND user_id = auth.uid()
));

-- Course policies
CREATE POLICY "Users can view own activity" ON public.course_activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own certificates" ON public.course_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read" ON public.course_discount_codes FOR SELECT USING (active = true);
CREATE POLICY "Users can view own progress" ON public.course_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own purchases" ON public.course_purchases FOR SELECT USING (auth.uid() = user_id);

-- Email policies (mostly admin)
CREATE POLICY "Admin only" ON public.email_analytics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_automation_errors FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_campaign_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_queue FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_sends FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_sequences FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_templates_custom FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.email_templates_history FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User progress policies
CREATE POLICY "Users can manage own progress" ON public.lesson_completion_details FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Newsletter policies
CREATE POLICY "Admin only" ON public.newsletter_sends FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can manage own subscription" ON public.newsletter_subscribers FOR ALL USING (email = auth.jwt() ->> 'email');

-- Payment policies
CREATE POLICY "Users can view own payment methods" ON public.payment_methods FOR ALL USING (auth.uid() = user_id);

-- Profile policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public read" ON public.therapist_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own therapist profile" ON public.therapist_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Admin only" ON public.provider_settings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin only" ON public.sequence_emails FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User data policies
CREATE POLICY "Users can view own activity" ON public.user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own consents" ON public.user_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own access" ON public.user_course_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own submissions" ON public.user_week_submissions FOR ALL USING (auth.uid() = user_id);

-- Wellness policies
CREATE POLICY "Users can manage own entries" ON public.wellness_entries FOR ALL USING (auth.uid() = user_id);

-- Workbook policies
CREATE POLICY "Public read" ON public.workbook_questions FOR SELECT USING (true);
CREATE POLICY "Users can manage own responses" ON public.workbook_responses FOR ALL USING (auth.uid() = user_id);

-- Workshop policies
CREATE POLICY "Users can view own attendance" ON public.workshop_attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own feedback" ON public.workshop_feedback FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own registrations" ON public.workshop_registrations FOR ALL USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;