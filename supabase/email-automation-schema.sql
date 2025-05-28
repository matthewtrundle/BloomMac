-- Email Automation Schema for Bloom Psychology
-- Run this in Supabase SQL Editor

-- Create email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger VARCHAR(100) NOT NULL, -- 'newsletter_signup', 'contact_form', 'new_mom_program', 'manual'
  trigger_conditions JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused'
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequence emails table
CREATE TABLE IF NOT EXISTS sequence_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  delay_hours INTEGER DEFAULT 0,
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email automation logs table
CREATE TABLE IF NOT EXISTS email_automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  email_id UUID REFERENCES sequence_emails(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL, -- 'scheduled', 'sent', 'opened', 'clicked', 'failed'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'welcome', 'nurture', 'educational', 'promotional'
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_trigger ON email_sequences(trigger);
CREATE INDEX IF NOT EXISTS idx_sequence_emails_sequence ON sequence_emails(sequence_id);
CREATE INDEX IF NOT EXISTS idx_sequence_emails_position ON sequence_emails(position);
CREATE INDEX IF NOT EXISTS idx_automation_logs_sequence ON email_automation_logs(sequence_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_subscriber ON email_automation_logs(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON email_automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_public ON email_templates(is_public);

-- Insert default email templates
INSERT INTO email_templates (name, category, subject, content, is_public) VALUES
-- Welcome series template
('Welcome to Bloom Psychology', 'welcome', 'Welcome to Your Mental Health Journey with Bloom Psychology', 
'<h2>Welcome to Bloom Psychology!</h2>
<p>Dear {{first_name}},</p>
<p>Thank you for joining our community. We''re honored to be part of your mental health journey.</p>
<p>At Bloom Psychology, we believe everyone deserves compassionate, professional mental health support. Whether you''re dealing with anxiety, depression, life transitions, or simply seeking personal growth, we''re here for you.</p>
<h3>What to expect from us:</h3>
<ul>
  <li>Monthly insights on mental health and wellness</li>
  <li>Practical tips for managing stress and anxiety</li>
  <li>Updates on our services and special programs</li>
  <li>Resources for mothers and families</li>
</ul>
<p>If you''re ready to take the next step, <a href="https://bloompsychologynorthaustin.com/book" class="button">schedule a consultation</a> with one of our caring therapists.</p>
<p>Warmly,<br>Dr. Jana Rundle & The Bloom Team</p>', 
true),

-- Educational content template
('5 Ways to Manage Daily Anxiety', 'educational', '5 Simple Techniques to Manage Daily Anxiety', 
'<h2>5 Ways to Manage Daily Anxiety</h2>
<p>Hi {{first_name}},</p>
<p>Anxiety can feel overwhelming, but small daily practices can make a big difference. Here are five evidence-based techniques you can start using today:</p>
<h3>1. Deep Breathing (4-7-8 Technique)</h3>
<p>Breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system.</p>
<h3>2. Grounding Exercise (5-4-3-2-1)</h3>
<p>Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.</p>
<h3>3. Progressive Muscle Relaxation</h3>
<p>Tense and release each muscle group, starting from your toes up to your head.</p>
<h3>4. Mindful Walking</h3>
<p>Take a 10-minute walk focusing on your breath and surroundings.</p>
<h3>5. Journaling</h3>
<p>Write down your worries for 10 minutes, then close the journal and leave them there.</p>
<p>Remember, it''s okay to need additional support. If anxiety is impacting your daily life, consider reaching out for professional help.</p>
<p><a href="https://bloompsychologynorthaustin.com/services/anxiety-stress-management" class="button">Learn About Our Anxiety Support</a></p>
<p>Take care,<br>The Bloom Psychology Team</p>', 
true),

-- New mom program template
('New Mom Support Program', 'promotional', 'You''re Not Alone: Support for New Mothers', 
'<h2>Motherhood is Beautiful... and Challenging</h2>
<p>Dear {{first_name}},</p>
<p>Becoming a mother is one of life''s most profound transitions. It''s normal to feel overwhelmed, anxious, or even disconnected during this time.</p>
<p>Our specialized New Mom Support Program is designed specifically for mothers like you who are:</p>
<ul>
  <li>Struggling with postpartum anxiety or depression</li>
  <li>Feeling isolated or overwhelmed</li>
  <li>Having difficulty bonding with your baby</li>
  <li>Experiencing relationship changes</li>
  <li>Questioning your identity as a mother</li>
</ul>
<h3>What Our Program Offers:</h3>
<ul>
  <li>Individual therapy tailored for new mothers</li>
  <li>Safe, judgment-free space to process your feelings</li>
  <li>Evidence-based techniques for managing postpartum challenges</li>
  <li>Support in building confidence as a mother</li>
</ul>
<p>You deserve support during this transition. You''re not alone, and asking for help is a sign of strength.</p>
<p><a href="https://bloompsychologynorthaustin.com/new-mom-program" class="button">Learn More About Our Program</a></p>
<p>With warmth and understanding,<br>Dr. Jana Rundle</p>', 
true);

-- Insert pre-built automation sequences
INSERT INTO email_sequences (name, description, trigger, status) VALUES
('Welcome Series', 'Automated welcome emails for new newsletter subscribers', 'newsletter_signup', 'active'),
('New Mom Nurture', 'Support sequence for new mom program inquiries', 'new_mom_program', 'active'),
('Contact Follow-up', 'Follow up with contact form submissions', 'contact_form', 'draft');

-- Get the sequence IDs
WITH sequences AS (
  SELECT id, trigger FROM email_sequences
)
-- Insert emails for Welcome Series
INSERT INTO sequence_emails (sequence_id, position, subject, content, delay_days)
SELECT 
  s.id,
  1,
  'Welcome to Bloom Psychology',
  (SELECT content FROM email_templates WHERE name = 'Welcome to Bloom Psychology'),
  0
FROM sequences s WHERE s.trigger = 'newsletter_signup'
UNION ALL
SELECT 
  s.id,
  2,
  '5 Simple Techniques to Manage Daily Anxiety',
  (SELECT content FROM email_templates WHERE name = '5 Ways to Manage Daily Anxiety'),
  3
FROM sequences s WHERE s.trigger = 'newsletter_signup'
UNION ALL
SELECT 
  s.id,
  3,
  'Your Mental Health Matters - Here to Support You',
  '<h2>Your Mental Health Journey Matters</h2>
<p>Hi {{first_name}},</p>
<p>It''s been a week since you joined us, and we wanted to check in.</p>
<p>Taking care of your mental health is one of the most important investments you can make. Whether you''re dealing with specific challenges or simply want to improve your overall well-being, professional support can make all the difference.</p>
<p>Our therapists specialize in:</p>
<ul>
  <li>Anxiety and stress management</li>
  <li>Depression and mood disorders</li>
  <li>Life transitions and adjustment</li>
  <li>Relationship challenges</li>
  <li>Postpartum support</li>
</ul>
<p>Ready to take the next step? We offer a free 15-minute consultation to help you find the right therapist for your needs.</p>
<p><a href="https://bloompsychologynorthaustin.com/book" class="button">Schedule Your Free Consultation</a></p>
<p>We''re here when you''re ready.</p>
<p>Warmly,<br>The Bloom Psychology Team</p>',
  7
FROM sequences s WHERE s.trigger = 'newsletter_signup';