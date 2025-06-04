const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createResourceDownloadSequence() {
  console.log('🎯 Creating Resource Download Follow-Up Sequence...\n');

  try {
    // Step 1: Create the sequence
    console.log('1️⃣ Creating Resource Download sequence...');
    const { data: sequence, error: createError } = await supabase
      .from('email_sequences')
      .insert({
        name: 'Resource Download Follow-Up',
        description: 'Nurture sequence for users who download free resources, providing value and gentle conversion opportunities',
        trigger: 'resource_download',
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating sequence:', createError);
      return;
    }

    const sequenceId = sequence.id;
    console.log('✅ Sequence created with ID:', sequenceId);

    // Step 2: Add the emails
    console.log('\n2️⃣ Adding email templates to the sequence...');
    
    const emails = [
      {
        sequence_id: sequenceId,
        subject: 'Your Resource is Here! Plus a Little Extra 🎁',
        content: getThankYouEmailContent(),
        delay_days: 0,
        delay_hours: 0,
        position: 1
      },
      {
        sequence_id: sequenceId,
        subject: 'Quick Check: Is Your Resource Helping? 🤔',
        content: getDay3CheckInContent(),
        delay_days: 3,
        delay_hours: 0,
        position: 2
      },
      {
        sequence_id: sequenceId,
        subject: 'From Struggling to Thriving: Sarah\'s Story 🌟',
        content: getDay7SuccessStoryContent(),
        delay_days: 7,
        delay_hours: 0,
        position: 3
      },
      {
        sequence_id: sequenceId,
        subject: 'No Rush - Your Timeline is the Right Timeline ⏰💕',
        content: getDay14GentleFollowUpContent(),
        delay_days: 14,
        delay_hours: 0,
        position: 4
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

    // Step 3: Verify the setup
    console.log('\n3️⃣ Verifying the sequence setup...');
    const { data: finalCheck } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_emails (*)
      `)
      .eq('id', sequenceId)
      .single();

    if (finalCheck) {
      console.log('\n✨ SUCCESS! Resource Download Follow-Up sequence is now active with:');
      console.log(`- ${finalCheck.sequence_emails.length} emails configured`);
      console.log('- Status:', finalCheck.status);
      console.log('- Trigger:', finalCheck.trigger);
      console.log('\n📧 Email Schedule:');
      
      const sortedEmails = finalCheck.sequence_emails.sort((a, b) => a.position - b.position);
      sortedEmails.forEach(email => {
        const timing = email.delay_days === 0 ? 'Immediate' : 
                      `After ${email.delay_days} days`;
        console.log(`  ${timing}: ${email.subject}`);
      });
    }

    console.log('\n✅ Resource Download sequence creation complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Update your resource download forms to trigger this sequence');
    console.log('2. The sequence will automatically nurture leads who download resources');
    console.log('3. Track conversion rates from resource downloads to consultations');

  } catch (error) {
    console.error('Error creating resource download sequence:', error);
  }
}

// Email content functions
function getThankYouEmailContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .download-box { background-color: #E0F8FF; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .bonus-tip { background-color: #FFF9E6; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .button { display: inline-block; background-color: #C06B93; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4682B4; margin: 0;">Your Resource Has Arrived! 📬</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 🌟,</p>
      <p>Great choice downloading our {{resource_name}}! You're taking action for your mental health, and that's something to celebrate. 🎉</p>
      
      <div class="download-box">
        <h3 style="color: #4682B4; margin-top: 0;">📥 Access Your Resource</h3>
        <p>Click below to download your guide:</p>
        <a href="{{download_link}}" class="button">Download Now 📄</a>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
          Tip: Save it to your phone for easy access anytime!
        </p>
      </div>
      
      <h3 style="color: #6B3654;">🎁 Your Bonus Quick-Start Tips:</h3>
      
      <div class="bonus-tip">
        <strong>💡 Tip 1: Small Steps Win</strong><br>
        Pick ONE technique from the guide and practice it for a week. Master that, then add another!
      </div>
      
      <div class="bonus-tip">
        <strong>🔔 Tip 2: Set a Reminder</strong><br>
        Use your phone to set a daily reminder to practice. Even 2 minutes counts!
      </div>
      
      <div class="bonus-tip">
        <strong>📱 Tip 3: Track Your Progress</strong><br>
        Note how you feel before and after using the techniques. You might be surprised!
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px;">
        <strong>Did you know?</strong> Research shows that people who use mental health resources + professional support see 3x better results than resources alone. 🤔
      </p>
      
      <p>If you find this resource helpful and want to dive deeper:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bloompsychologynorthaustin.com/book" class="button">
          Explore Therapy Options 🌸
        </a>
      </div>
      
      <p>Happy reading!<br>
      The Bloom Psychology Team 💕</p>
    </div>
  </div>
</body>
</html>`;
}

function getDay3CheckInContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #F0E68C 0%, #FFD700 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .reflection-box { background-color: #FFFACD; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-story { background-color: #E6F3FF; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; }
    .button { display: inline-block; background-color: #C06B93; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #DAA520; margin: 0;">How's It Going? 🌻</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 👋,</p>
      <p>It's been a few days since you downloaded our {{resource_name}}. We're curious - have you had a chance to try any of the techniques?</p>
      
      <div class="reflection-box">
        <h3 style="color: #DAA520; margin-top: 0;">Quick Self-Check 📊</h3>
        <p>Take a moment to notice:</p>
        <ul>
          <li>Have you tried any techniques from the guide?</li>
          <li>If yes, did anything surprise you?</li>
          <li>What support would help you most right now?</li>
        </ul>
      </div>
      
      <div class="success-story">
        <p>"I was skeptical about the breathing exercises, but tried them during a stressful work call. Game changer! Now I use them daily." - Maria, Bloom client 🌟</p>
      </div>
      
      <h3 style="color: #6B3654;">Common Roadblocks (We Get It!):</h3>
      <ul style="line-height: 1.8;">
        <li>😴 "I keep forgetting" → Try linking it to something you already do daily</li>
        <li>🤷‍♀️ "It feels weird" → Totally normal! New habits always feel strange at first</li>
        <li>⏰ "No time!" → Even 30 seconds counts. Seriously!</li>
      </ul>
      
      <p style="background-color: #FFF5F8; padding: 15px; border-radius: 8px;">
        <strong>Here's the thing:</strong> Self-help resources are amazing tools, but sometimes we need a guide to help us use them effectively. That's where therapy comes in! 🧠💪
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        Want to accelerate your progress?<br><br>
        <a href="https://bloompsychologynorthaustin.com/book" class="button">
          Let's Create Your Personal Plan 📋
        </a>
      </p>
      
      <p>Keep going - tiny steps forward are still progress!</p>
      
      <p>In your corner,<br>
      The Bloom Team 🌸</p>
    </div>
  </div>
</body>
</html>`;
}

function getDay7SuccessStoryContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .story-section { background-color: #F5F0FF; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .quote-box { background-color: #FFF; padding: 20px; border-left: 4px solid #C06B93; margin: 15px 0; font-style: italic; }
    .button { display: inline-block; background-color: #C06B93; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4B0082; margin: 0;">Real Stories, Real Hope 💜</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 💕,</p>
      <p>Sometimes the best inspiration comes from someone who's walked the path before us. Today, we're sharing Sarah's story (with her permission!).</p>
      
      <div class="story-section">
        <h3 style="color: #4B0082; margin-top: 0;">Meet Sarah: Mom of 2, Marketing Manager, Anxiety Warrior</h3>
        
        <div class="quote-box">
          "Six months ago, I was drowning. Between work deadlines, mom guilt, and constant anxiety, I felt like I was failing at everything."
        </div>
        
        <p><strong>The Turning Point:</strong></p>
        <p>Sarah downloaded our anxiety guide (just like you did!). She tried the techniques but felt overwhelmed doing it alone. That's when she booked a consultation.</p>
        
        <div class="quote-box">
          "I was terrified of being judged. Instead, I found someone who said 'This is hard, and you're not broken.' That changed everything."
        </div>
        
        <p><strong>The Journey:</strong></p>
        <ul>
          <li>🌱 Week 1-2: Learning to identify anxiety triggers</li>
          <li>🌿 Month 1: Developing personalized coping strategies</li>
          <li>🌳 Month 2-3: Working through underlying patterns</li>
          <li>🌸 Month 4-6: Building sustainable wellness habits</li>
        </ul>
        
        <div class="quote-box">
          "I'm not 'cured' - I'm human. But now I have tools. I sleep better, enjoy my kids, and actually like myself."
        </div>
      </div>
      
      <h3 style="color: #6B3654;">Sarah's Top 3 Game-Changers:</h3>
      <ol>
        <li><strong>Having a safe space to be messy</strong></li>
        <li><strong>Practical tools that actually work</strong></li>
        <li><strong>Someone who believed in me</strong></li>
      </ol>
      
      <p style="background-color: #FFF5F8; padding: 20px; border-radius: 8px; text-align: center;">
        <strong>Sarah's Message to You:</strong><br>
        <em>"If you're thinking 'that's nice but my situation is different' - that's exactly what I thought. Give yourself a chance."</em>
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p>Ready to write your own success story?</p>
        <a href="https://bloompsychologynorthaustin.com/book" class="button">
          Start Your Journey Today 🌟
        </a>
      </div>
      
      <p>Every journey starts with a single step.</p>
      
      <p>With hope and belief in you,<br>
      Jana & The Bloom Team 🌸</p>
    </div>
  </div>
</body>
</html>`;
}

function getDay14GentleFollowUpContent() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #98FB98 0%, #00FA9A 100%); padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .gentle-reminder { background-color: #F0FFF0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .option-card { background-color: #FFF5F8; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .button { display: inline-block; background-color: #C06B93; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #228B22; margin: 0;">Still Here, Still Caring 🌱</h1>
    </div>
    <div class="content">
      <p>Hi {{first_name}} 🌟,</p>
      <p>It's been two weeks since you downloaded our resource. No sales pitch, no pressure - just a gentle reminder that we're here. 💚</p>
      
      <div class="gentle-reminder">
        <h3 style="color: #228B22; margin-top: 0;">Your Wellness Journey is Unique 🦋</h3>
        <p>Maybe you're:</p>
        <ul>
          <li>Still working through the resource (great!)</li>
          <li>Thinking about therapy (totally fine!)</li>
          <li>Waiting for the "right time" (spoiler: there isn't one 😊)</li>
          <li>Feeling better and don't need support right now (amazing!)</li>
        </ul>
        <p><strong>All of these are valid!</strong></p>
      </div>
      
      <h3 style="color: #6B3654;">Ways We Can Support You:</h3>
      
      <div class="option-card">
        <strong>📚 Keep Learning</strong><br>
        Our blog is full of practical tips and real stories.
        <p><a href="https://bloompsychologynorthaustin.com/blog" style="color: #C06B93;">Browse Recent Posts →</a></p>
      </div>
      
      <div class="option-card">
        <strong>👥 Community Connection</strong><br>
        Join our free monthly virtual support circles!
        <p><a href="https://bloompsychologynorthaustin.com/support-circles" style="color: #C06B93;">See Upcoming Dates →</a></p>
      </div>
      
      <div class="option-card">
        <strong>💬 Ready to Talk</strong><br>
        When/if you're ready for 1-on-1 support, we're here.
        <p style="text-align: center; margin-top: 10px;">
          <a href="https://bloompsychologynorthaustin.com/book" class="button">Book When Ready 🌸</a>
        </p>
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px; font-style: italic;">
        "The curious paradox is that when I accept myself just as I am, then I can change." - Carl Rogers 💜
      </p>
      
      <p>Whether you're our client or just our email friend, we're glad you're here. Take care of yourself in whatever way feels right today.</p>
      
      <p>Always in your corner,<br>
      The Bloom Psychology Team 🌸</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. This is the last email in this series, but we'll keep sending our monthly newsletter with tips and resources. You can unsubscribe anytime if you'd prefer. 💕
      </p>
    </div>
  </div>
</body>
</html>`;
}

// Run the creation
createResourceDownloadSequence();