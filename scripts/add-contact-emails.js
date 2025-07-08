#!/usr/bin/env node

/**
 * Add the 3 contact form follow-up emails to the sequence
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addContactFormEmails() {
  console.log('=== ADDING CONTACT FORM EMAILS ===\n');

  const sequenceId = '9f454fab-a3e2-4af4-a680-f65bceadf3a9';

  // Check current emails in sequence
  const { data: currentEmails } = await supabase
    .from('sequence_emails')
    .select('position, subject')
    .eq('sequence_id', sequenceId);

  console.log('Current emails in sequence:', currentEmails ? currentEmails.length : 0);
  
  if (currentEmails && currentEmails.length > 0) {
    console.log('Existing emails found - this will add new emails with higher positions');
    currentEmails.forEach(email => {
      console.log(`- Position ${email.position}: ${email.subject}`);
    });
    console.log();
  }

  try {
    // Email 1: Immediate Response
    console.log('Adding Email 1: Immediate Response...');
    const { error: error1 } = await supabase
      .from('sequence_emails')
      .insert({
        sequence_id: sequenceId,
        position: 1,
        subject: 'Thank you for reaching out - We\'ll be in touch soon! 🌸',
        content: getEmail1Content(),
        delay_hours: 0,
        delay_days: 0
      });

    if (error1) {
      console.log('Error adding email 1:', error1.message);
    } else {
      console.log('✅ Email 1 added successfully');
    }

    // Email 2: 72 Hour Follow-up
    console.log('Adding Email 2: 72 Hour Follow-up...');
    const { error: error2 } = await supabase
      .from('sequence_emails')
      .insert({
        sequence_id: sequenceId,
        position: 2,
        subject: 'Thinking of you - Resources while you wait 💕',
        content: getEmail2Content(),
        delay_hours: 72,
        delay_days: 3
      });

    if (error2) {
      console.log('Error adding email 2:', error2.message);
    } else {
      console.log('✅ Email 2 added successfully');
    }

    // Email 3: Week 1 Resources
    console.log('Adding Email 3: Week 1 Resources...');
    const { error: error3 } = await supabase
      .from('sequence_emails')
      .insert({
        sequence_id: sequenceId,
        position: 3,
        subject: 'Your weekly wellness toolkit 🧰',
        content: getEmail3Content(),
        delay_hours: 168,
        delay_days: 7
      });

    if (error3) {
      console.log('Error adding email 3:', error3.message);
    } else {
      console.log('✅ Email 3 added successfully');
    }

    // Verify all emails were added
    console.log('\n=== VERIFICATION ===');
    const { data: finalEmails } = await supabase
      .from('sequence_emails')
      .select('position, subject, delay_hours, delay_days')
      .eq('sequence_id', sequenceId)
      .order('position');

    if (finalEmails) {
      console.log(`Total emails in contact_form sequence: ${finalEmails.length}`);
      finalEmails.forEach(email => {
        const timing = email.delay_hours === 0 && email.delay_days === 0 ? 'Immediate' : 
                     email.delay_days > 0 ? `${email.delay_days} days` : `${email.delay_hours} hours`;
        console.log(`- Position ${email.position}: ${email.subject} (${timing})`);
      });
    }

    console.log('\n✅ Contact form email sequence is now complete!');
    console.log('Users who submit the contact form will now receive:');
    console.log('1. Immediate thank you email');
    console.log('2. Follow-up with resources after 3 days');
    console.log('3. Weekly wellness toolkit after 7 days');

  } catch (error) {
    console.error('Error adding emails:', error);
  }
}

function getEmail1Content() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Bloom Psychology</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .highlight-box { background: #f8f9fa; border-left: 4px solid #f8b5c4; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Reaching Out! 🌸</h1>
      <p style="color: white; margin: 5px 0 0 0;">Bloom Psychology North Austin</p>
    </div>
    
    <div class="content">
      <p>Dear {{first_name}},</p>
      
      <p>Thank you so much for taking the brave step to reach out to Bloom Psychology. We truly appreciate your trust in us during what might be a vulnerable time.</p>
      
      <div class="highlight-box">
        <h3 style="margin-top: 0; color: #1e3a5f;">📅 What happens next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>Within 24-48 hours:</strong> Dr. Jana Rundle will personally review your message</li>
          <li><strong>Personal response:</strong> We'll email you back to discuss how we can best support you</li>
          <li><strong>Free consultation:</strong> We offer a complimentary 15-minute call to see if we're the right fit</li>
        </ul>
      </div>
      
      <p>While you wait, please know that reaching out for support takes incredible courage. You've already taken an important step toward healing and growth.</p>
      
      <p>If you have any urgent questions, feel free to call or text us at <strong>(512) 898-9510</strong>.</p>
      
      <p>With warmth and support,<br>
      <strong>Dr. Jana Rundle</strong><br>
      Licensed Clinical Psychologist<br>
      Bloom Psychology</p>
    </div>
    
    <div class="footer">
      <p><strong>Bloom Psychology</strong><br>
      📧 jana@bloompsychologynorthaustin.com<br>
      📞 (512) 898-9510<br>
      🌐 bloompsychologynorthaustin.com</p>
      
      <p style="font-size: 12px; margin-top: 15px;">
        <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
        please call 911 or text/call 988 for the Suicide & Crisis Lifeline.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getEmail2Content() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resources for Your Journey</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .resource-card { background: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; margin: 15px 0; border-radius: 6px; }
    .resource-card h3 { color: #1e3a5f; margin-top: 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    .button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We're Still Here for You 💕</h1>
      <p style="color: white; margin: 5px 0 0 0;">Helpful resources while you wait</p>
    </div>
    
    <div class="content">
      <p>Hi {{first_name}},</p>
      
      <p>I wanted to check in and let you know that we haven't forgotten about you. Your message is important to us, and Dr. Jana will be responding personally soon.</p>
      
      <p>In the meantime, I wanted to share some helpful resources that might support you while you wait:</p>
      
      <div class="resource-card">
        <h3>🌿 Grounding Techniques for Anxious Moments</h3>
        <p>Simple, science-backed exercises to help when anxiety feels overwhelming.</p>
        <a href="https://bloompsychologynorthaustin.com/resources/grounding-techniques" class="button" style="color: white;">Get Free Guide</a>
      </div>
      
      <div class="resource-card">
        <h3>🤱 New Mom Support Guide</h3>
        <p>Navigating the challenges of motherhood with practical tips and emotional support.</p>
        <a href="https://bloompsychologynorthaustin.com/resources/new-mom-guide" class="button" style="color: white;">Read Guide</a>
      </div>
      
      <div class="resource-card">
        <h3>🧠 Understanding Your Mental Health</h3>
        <p>Learn about common mental health challenges and when to seek professional support.</p>
        <a href="https://bloompsychologynorthaustin.com/resources" class="button" style="color: white;">Explore Resources</a>
      </div>
      
      <p>Remember, seeking help is a sign of strength, not weakness. You're taking an important step toward your wellbeing.</p>
      
      <p>Warmly,<br>
      <strong>The Bloom Psychology Team</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>Questions?</strong> Call or text us at (512) 898-9510</p>
      <p style="font-size: 12px; margin-top: 15px;">
        <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
        please call 911 or text/call 988 for the Suicide & Crisis Lifeline.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getEmail3Content() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Wellness Toolkit</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .tip-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    .button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .weekly-tip { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Weekly Wellness Toolkit 🧰</h1>
      <p style="color: white; margin: 5px 0 0 0;">Simple practices for mental wellness</p>
    </div>
    
    <div class="content">
      <p>Hi {{first_name}},</p>
      
      <p>It's been a week since you reached out to us. Whether you're still considering therapy or already moving forward with support, I wanted to share some practical tools you can use this week.</p>
      
      <div class="tip-box">
        <h3 style="margin-top: 0; color: #2e7d32;">🧘‍♀️ This Week's Mental Health Practices</h3>
        
        <div class="weekly-tip">
          <strong>Monday Mindfulness:</strong> Start your week with 5 minutes of deep breathing. Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8.
        </div>
        
        <div class="weekly-tip">
          <strong>Wednesday Check-in:</strong> Ask yourself: "What do I need today?" Sometimes it's rest, sometimes it's movement, sometimes it's connection.
        </div>
        
        <div class="weekly-tip">
          <strong>Friday Reflection:</strong> Write down three things that went well this week, no matter how small.
        </div>
      </div>
      
      <p><strong>Remember:</strong> Small, consistent actions create lasting change. You don't have to do everything perfectly - just start where you are.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Ready to take the next step?</strong></p>
        <a href="https://bloompsychologynorthaustin.com/book" class="button" style="color: white;">Schedule Your Free Consultation</a>
      </div>
      
      <p>You're not alone in this journey. Whether through our resources, our therapy services, or other support systems, there are people who care about your wellbeing.</p>
      
      <p>Take care of yourself,<br>
      <strong>Dr. Jana Rundle & The Bloom Team</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>Bloom Psychology</strong><br>
      📧 jana@bloompsychologynorthaustin.com | 📞 (512) 898-9510</p>
      
      <p style="font-size: 12px; margin-top: 15px;">
        <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
        please call 911 or text/call 988 for the Suicide & Crisis Lifeline.
      </p>
      
      <p style="font-size: 12px; margin-top: 10px;">
        Don't want to receive these emails? <a href="{{unsubscribe_url}}" style="color: #666;">Unsubscribe here</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

addContactFormEmails().catch(console.error);