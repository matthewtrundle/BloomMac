const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addWelcomeBackTemplate() {
  const template = {
    name: 'Newsletter Welcome Back',
    subject: "Welcome Back to Bloom Psychology! We've Missed You 🌸",
    category: 'newsletter',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Back to Bloom Psychology</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #C06B93 0%, #D4A5BD 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      color: #6B3654;
      margin-bottom: 20px;
    }
    .highlight-box {
      background-color: #FCF4F9;
      border-left: 4px solid #C06B93;
      padding: 20px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #C06B93;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome Back, {{firstName}}! 🌸</h1>
    </div>
    
    <div class="content">
      <p class="greeting">We're so happy to have you back!</p>
      
      <p>It's wonderful to see you rejoin our community. We've missed sharing insights and resources with you.</p>
      
      <div class="highlight-box">
        <h3 style="margin-top: 0;">What You Can Expect:</h3>
        <ul>
          <li>✨ Monthly insights on mental health and wellness</li>
          <li>🌱 Practical tips for personal growth</li>
          <li>💗 Exclusive resources from Dr. Jana Rundle</li>
          <li>🎯 Evidence-based strategies you can use right away</li>
        </ul>
      </div>
      
      <p>Since you've been away, we've added some exciting new resources to our site. When you have a moment, check out:</p>
      
      <ul>
        <li>Our latest blog posts on managing stress and anxiety</li>
        <li>New therapy programs designed for busy professionals</li>
        <li>Resources specifically for new mothers</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="https://www.bloompsychologynorthaustin.com/blog" class="button">
          Explore Our Resources
        </a>
      </p>
      
      <p>Thank you for giving us another chance to support your wellness journey. We promise to make it worth your while!</p>
      
      <p>With warmth and gratitude,<br>
      <strong>Dr. Jana Rundle & The Bloom Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Bloom Psychology of Austin<br>
        North Austin, TX<br>
        <a href="https://www.bloompsychologynorthaustin.com" style="color: #C06B93;">
          www.bloompsychologynorthaustin.com
        </a>
      </p>
      
      <p style="font-size: 12px; margin-top: 20px;">
        You're receiving this because you resubscribed to our newsletter.
        <br><br>
        <a href="https://www.bloompsychologynorthaustin.com/unsubscribe" style="color: #999;">
          Unsubscribe
        </a> | 
        <a href="https://www.bloompsychologynorthaustin.com/privacy-policy" style="color: #999;">
          Privacy Policy
        </a>
      </p>
    </div>
  </div>
</body>
</html>`,
    variables: ['firstName'],
    is_public: true
  };

  console.log('Adding welcome back template to database...');
  
  const { data, error } = await supabase
    .from('email_templates')
    .insert(template)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding template:', error);
    return;
  }
  
  console.log('✅ Welcome back template added successfully!');
  console.log('Template ID:', data.id);
  console.log('Template name:', data.name);
}

addWelcomeBackTemplate();