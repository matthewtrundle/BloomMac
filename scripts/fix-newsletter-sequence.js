const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixNewsletterSequence() {
  console.log('🔧 Fixing Newsletter Email Sequence...\n');

  try {
    // Step 1: Deactivate the old Welcome Series
    console.log('1️⃣ Deactivating legacy "Welcome Series" sequence...');
    const { error: deactivateError } = await supabase
      .from('email_sequences')
      .update({ status: 'inactive' })
      .eq('name', 'Welcome Series')
      .eq('trigger', 'newsletter_signup');

    if (deactivateError) {
      console.error('Error deactivating old sequence:', deactivateError);
    } else {
      console.log('✅ Legacy sequence deactivated\n');
    }

    // Step 2: Check if new sequence already exists
    const { data: existingSeq } = await supabase
      .from('email_sequences')
      .select('id')
      .eq('name', 'Newsletter Signup Sequence')
      .single();

    let sequenceId;

    if (existingSeq) {
      console.log('📌 Newsletter Signup Sequence already exists, updating it...');
      sequenceId = existingSeq.id;
      
      // Update to ensure it's active
      await supabase
        .from('email_sequences')
        .update({ status: 'active' })
        .eq('id', sequenceId);
    } else {
      // Step 3: Create new Newsletter Signup Sequence
      console.log('2️⃣ Creating new "Newsletter Signup Sequence"...');
      const { data: newSeq, error: createError } = await supabase
        .from('email_sequences')
        .insert({
          name: 'Newsletter Signup Sequence',
          description: 'Modern email sequence for newsletter subscribers with valuable content and gentle CTAs',
          trigger: 'newsletter_signup',
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating sequence:', createError);
        return;
      }

      sequenceId = newSeq.id;
      console.log('✅ New sequence created with ID:', sequenceId);
    }

    // Step 4: Delete old emails from this sequence
    console.log('\n3️⃣ Removing any existing emails from the sequence...');
    await supabase
      .from('sequence_emails')
      .delete()
      .eq('sequence_id', sequenceId);

    // Step 5: Add the new emails
    console.log('\n4️⃣ Adding new email templates to the sequence...');
    
    const emails = [
      {
        sequence_id: sequenceId,
        subject: 'Welcome to Your Journey of Growth with Bloom Psychology 🌸',
        content: getWelcomeEmailContent(),
        delay_days: 0,
        delay_hours: 0,
        position: 1
      },
      {
        sequence_id: sequenceId,
        subject: '3 Quick Wins for Your Mental Wellness Journey 🌟',
        content: getDay3EmailContent(),
        delay_days: 3,
        delay_hours: 0,
        position: 2
      },
      {
        sequence_id: sequenceId,
        subject: 'Is This Normal? (Spoiler: You\'re Not Alone) 🤗',
        content: getDay7EmailContent(),
        delay_days: 7,
        delay_hours: 0,
        position: 3
      },
      {
        sequence_id: sequenceId,
        subject: 'Your Self-Care Isn\'t Selfish (Here\'s Why) 💅✨',
        content: getDay14EmailContent(),
        delay_days: 14,
        delay_hours: 0,
        position: 4
      },
      {
        sequence_id: sequenceId,
        subject: 'One Month Later: How Are You Really? 💭',
        content: getDay30EmailContent(),
        delay_days: 30,
        delay_hours: 0,
        position: 5
      }
    ];

    for (const email of emails) {
      const { error: emailError } = await supabase
        .from('sequence_emails')
        .insert(email);

      if (emailError) {
        console.error(`Error adding email "${email.subject}":`, emailError);
      } else {
        console.log(`✅ Added: ${email.subject}`);
      }
    }

    // Step 6: Verify the setup
    console.log('\n5️⃣ Verifying the new sequence setup...');
    const { data: finalCheck } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_emails (*)
      `)
      .eq('name', 'Newsletter Signup Sequence')
      .single();

    if (finalCheck) {
      console.log('\n✨ SUCCESS! Newsletter Signup Sequence is now active with:');
      console.log(`- ${finalCheck.sequence_emails.length} emails configured`);
      console.log('- Status:', finalCheck.status);
      console.log('- Trigger:', finalCheck.trigger);
      console.log('\n📧 Email Schedule:');
      finalCheck.sequence_emails.forEach(email => {
        const timing = email.delay_days === 0 ? 'Immediate' : 
                      `After ${email.delay_days} days`;
        console.log(`  ${timing}: ${email.subject}`);
      });
    }

    // Step 7: Check and clean up any other active newsletter sequences
    console.log('\n6️⃣ Checking for any other active newsletter sequences...');
    const { data: allNewsletterSeqs } = await supabase
      .from('email_sequences')
      .select('id, name, status')
      .eq('trigger', 'newsletter_signup')
      .eq('status', 'active');

    if (allNewsletterSeqs && allNewsletterSeqs.length > 1) {
      console.log('⚠️  Found multiple active newsletter sequences:');
      allNewsletterSeqs.forEach(seq => {
        console.log(`  - ${seq.name} (${seq.id})`);
      });
      console.log('Only "Newsletter Signup Sequence" should be active.');
    }

    console.log('\n✅ Newsletter sequence fix complete!');
    console.log('\n⏰ The 48-hour limited offer in Email 5 will be included automatically.');

  } catch (error) {
    console.error('Error fixing newsletter sequence:', error);
  }
}

// Email content functions
function getWelcomeEmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Bloom Psychology</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #C06B93 0%, #D4A5BD 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; padding: 14px 30px; background-color: #C06B93; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 10px 0; }
    .resource-box { background-color: #FDF5F9; border-left: 4px solid #C06B93; padding: 20px; margin: 20px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Your Bloom Journey</h1>
    </div>
    <div class="content">
      <p>Dear {{first_name}},</p>
      <p>Welcome to our garden of growth! 🌱 We're absolutely thrilled that you've taken this courageous step in prioritizing your mental wellness.</p>
      
      <div class="resource-box">
        <h3>🎁 Your Welcome Gift Is Here!</h3>
        <p><strong>"5 Grounding Techniques for Anxious Moments"</strong> 🌿<br>
        Simple, science-backed exercises that fit in your pocket (and your busy life!)</p>
        <a href="https://www.bloompsychologynorthaustin.com/resources/grounding-techniques" class="button">
          Claim Your Free Guide 🎉
        </a>
      </div>
      
      <p>Ready to explore how we can support your unique journey?</p>
      <p style="text-align: center;">
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Schedule Your Free Chat ☕
        </a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getDay3EmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #F4C2C2 0%, #FFE4E1 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .quick-win { background-color: #FFF5F8; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 3px solid #C06B93; }
    .button { display: inline-block; padding: 12px 24px; background-color: #C06B93; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #6B3654; margin: 0;">Your 3-Day Check-In 💝</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 👋,</p>
      <p>How's your week going? We wanted to share 3 simple practices that our clients absolutely love - they take less than 5 minutes but can shift your entire day! ✨</p>
      
      <div class="quick-win">
        <h3 style="margin-top: 0; color: #6B3654;">1. The Morning Bloom Ritual 🌅</h3>
        <p>Before checking your phone, place your hand on your heart and take 3 deep breaths. Ask yourself: "What do I need today?"</p>
      </div>
      
      <div class="quick-win">
        <h3 style="margin-top: 0; color: #6B3654;">2. The 5-4-3-2-1 Grounding Game 🌿</h3>
        <p>Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. It's like a reset button for your nervous system!</p>
      </div>
      
      <div class="quick-win">
        <h3 style="margin-top: 0; color: #6B3654;">3. The Gratitude Glow-Up 🌙</h3>
        <p>Tonight before bed, think of 3 tiny things that made you smile today. Small joys count!</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Want more personalized strategies?</strong></p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Let's Chat (It's Free!) 💬
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getDay7EmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #A3D8F4 0%, #E6F3FF 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .story-box { background-color: #F0F8FF; border-radius: 12px; padding: 25px; margin: 20px 0; }
    .stat-box { background-color: #FFF5F8; padding: 15px; border-radius: 8px; text-align: center; margin: 10px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #C06B93; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #2C3E50; margin: 0;">Real Talk About Mental Health 💙</h1>
    </div>
    <div class="content">
      <p>Hey {{first_name}} 💕,</p>
      <p>Can we get real for a moment? If you've been wondering whether what you're feeling is "normal," we want you to know something important...</p>
      
      <div class="story-box">
        <h3 style="color: #2C3E50; margin-top: 0;">Sarah's Story (shared with permission) 🌟</h3>
        <p><em>"I thought I was the only mom who felt like crying in the Target parking lot. Turns out, I wasn't broken - I was human. Therapy helped me see that."</em></p>
      </div>
      
      <h3 style="color: #6B3654;">You're in Good Company:</h3>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">1 in 5</strong><br>
        Women experience anxiety or depression each year 🤝
      </div>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">84%</strong><br>
        Of people say therapy helped them feel "significantly better" 💗
      </div>
      
      <div style="background-color: #FDF5F9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin-bottom: 15px;"><strong>Ready to talk to someone who gets it?</strong></p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Book Your Free Consultation 🌸
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getDay14EmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .myth-buster { background-color: #FFF0F5; border-radius: 12px; padding: 20px; margin: 15px 0; }
    .self-care-idea { background-color: #F8F8FF; padding: 15px; border-left: 3px solid #C06B93; margin: 10px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #C06B93; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #6B3654; margin: 0;">Time for Some Truth Bombs 💣💕</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 🌟,</p>
      <p>Quick question: When was the last time you did something just for YOU without feeling guilty?</p>
      
      <h3 style="color: #6B3654;">Let's Bust Some Self-Care Myths:</h3>
      
      <div class="myth-buster">
        <h4 style="color: #C06B93; margin-top: 0;">Myth: "Self-care is selfish" 🚫</h4>
        <p><strong>Truth:</strong> You can't pour from an empty cup. Taking care of yourself IS taking care of everyone who depends on you. 💯</p>
      </div>
      
      <h3 style="color: #6B3654; margin-top: 30px;">5-Minute Self-Care Ideas:</h3>
      
      <div class="self-care-idea">
        ☕ <strong>The Sacred Sip:</strong> Make your coffee/tea and actually drink it hot.
      </div>
      
      <div class="self-care-idea">
        🌸 <strong>Ask for Help:</strong> Text a friend, call your mom, or... book that therapy session you've been thinking about.
      </div>
      
      <div style="background-color: #E6F3FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #6B3654; margin-top: 0;">🎁 Bonus Gift: Your Self-Care Toolkit</h3>
        <p><strong>"10 Tiny Self-Care Rituals That Take Less Than 2 Minutes"</strong> ✨</p>
        <p style="text-align: center;">
          <a href="https://www.bloompsychologynorthaustin.com/resources/micro-self-care" style="color: #C06B93; font-weight: bold;">
            Download Your Bonus Guide 📱
          </a>
        </p>
      </div>
      
      <div style="background-color: #FDF5F9; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p>Ready to make yourself a priority?</p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Yes, I'm Worth It! 🌟
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getDay30EmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .reflection-box { background-color: #F5F5FF; border-radius: 12px; padding: 25px; margin: 20px 0; }
    .offer-box { background: linear-gradient(135deg, #FFF5F8 0%, #FFE4F1 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
    .button { display: inline-block; padding: 14px 28px; background-color: #C06B93; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4B0082; margin: 0;">Your One-Month Check-In 🌙✨</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 💜,</p>
      <p>Can you believe it's been a month since you joined our Bloom family? We've been thinking about you and wanted to check in - how are you REALLY doing?</p>
      
      <div class="reflection-box">
        <h3 style="color: #6B3654; margin-top: 0;">Take a Moment to Reflect 🪞</h3>
        <p>• Energy Level: Are you running on empty or finding moments of spark? ⚡<br>
        • Sleep Quality: Getting rest or having 3am worry parties? 😴<br>
        • Support System: Feeling connected or a bit isolated? 🤝</p>
      </div>
      
      <div class="offer-box">
        <h3 style="color: #C06B93; margin-top: 0;">Special One-Month Offer (48 Hours Only!) 🎁⏰</h3>
        <p>As a thank you for being part of our community for a whole month:</p>
        <p style="font-size: 20px; color: #6B3654; font-weight: bold; margin: 15px 0;">
          $25 off your first therapy session
        </p>
        <p style="color: #C06B93; font-weight: bold;">⏰ This offer expires in 48 hours</p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Claim My $25 Discount Now 🌸
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
          Use code: <strong>BLOOM30</strong> when booking • Expires in 48 hours
        </p>
      </div>
      
      <p>Whether you book a session or just keep reading our emails, we're honored to be part of your journey. You matter, your mental health matters, and we're here when you need us.</p>
      
      <p>With so much warmth,<br>
      Jana & The Bloom Psychology Team 🌸</p>
    </div>
  </div>
</body>
</html>`;
}

// Run the fix
fixNewsletterSequence();