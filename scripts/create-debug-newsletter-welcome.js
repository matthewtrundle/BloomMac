const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDebugNewsletterWelcome() {
  try {
    console.log('Creating debug newsletter welcome email...');
    
    const debugTemplate = {
      sequence: 'newsletter',
      step: 'welcome',
      subject: 'debug',
      content: `Test - Welcome to Bloom Psychology! 🌸

<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%); border-radius: 12px; overflow: hidden;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      Welcome to Bloom Psychology 💜
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
      Your journey to wellness starts here
    </p>
  </div>
  
  <!-- Main Content -->
  <div style="padding: 30px 25px;">
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Hi {{firstName}},
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Test - I'm so glad you're here! Welcome to our supportive community of women who are prioritizing their mental health and wellbeing. You've taken an important step, and I want you to know how proud I am of you for choosing yourself.
    </p>
    
    <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #ec4899;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic;">
        "You are not a problem to be solved, but a person to be understood." 
      </p>
    </div>
    
    <h2 style="color: #1f2937; font-size: 20px; margin: 25px 0 15px 0; font-weight: 600;">
      What to expect in your inbox:
    </h2>
    
    <ul style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Weekly mental health tips and gentle reminders</li>
      <li style="margin-bottom: 8px;">Practical strategies for managing anxiety and stress</li>
      <li style="margin-bottom: 8px;">Resources specifically designed for busy women</li>
      <li style="margin-bottom: 8px;">Updates about our services and special offerings</li>
    </ul>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7af 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #92400e; font-size: 18px; margin: 0 0 10px 0; font-weight: 600;">
        🎁 Your Welcome Gift
      </h3>
      <p style="color: #92400e; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        As a thank you for joining us, here's your free "Am I Okay?" self-assessment checklist to help you check in with your mental health.
      </p>
      <div style="text-align: center;">
        <a href="https://www.bloompsychology.org/resources/self-assessment" 
           style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Get Your Free Checklist
        </a>
      </div>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
      Remember, seeking support is a sign of strength, not weakness. Whether you're dealing with anxiety, navigating motherhood, or simply feeling overwhelmed by life's demands, you don't have to face it alone.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.bloompsychology.org/book" 
         style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);">
        Schedule Your Free 15-Minute Consultation
      </a>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
      With warmth and support,<br>
      <span style="color: #ec4899; font-weight: 600;">Jana Rundle, LCP</span><br>
      <span style="color: #6b7280; font-size: 14px;">Licensed Clinical Psychologist</span>
    </p>
  </div>
  
  <!-- Footer -->
  <div style="background: #f9fafb; padding: 20px 25px; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0; text-align: center;">
      Bloom Psychology | Licensed Clinical Psychology Practice<br>
      Specializing in Women's Mental Health & Maternal Support
    </p>
    <div style="text-align: center; margin-top: 15px;">
      <a href="https://www.bloompsychology.org" style="color: #ec4899; text-decoration: none; margin: 0 10px;">Website</a>
      <a href="https://www.bloompsychology.org/contact" style="color: #ec4899; text-decoration: none; margin: 0 10px;">Contact</a>
      <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
    </div>
  </div>
  
</div>

<!-- Tracking pixel -->
<img src="{{trackingPixelUrl}}" width="1" height="1" style="display:none;" />`,
      modified_by: 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Use upsert to create or update the template
    const { data, error } = await supabase
      .from('email_templates_custom')
      .upsert(debugTemplate, {
        onConflict: 'sequence,step'
      })
      .select();
    
    if (error) {
      console.error('Error creating debug newsletter welcome:', error);
      return;
    }
    
    console.log('Debug newsletter welcome email created successfully!');
    console.log('Template details:', {
      sequence: debugTemplate.sequence,
      step: debugTemplate.step,
      subject: debugTemplate.subject,
      contentLength: debugTemplate.content.length
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createDebugNewsletterWelcome();