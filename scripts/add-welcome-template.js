const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addWelcomeTemplate() {
  // First check if it already exists
  const { data: existing } = await supabase
    .from('email_templates')
    .select('id')
    .eq('name', 'Newsletter Welcome')
    .single();
    
  if (existing) {
    console.log('Welcome template already exists');
    return;
  }

  const template = {
    name: 'Newsletter Welcome',
    subject: "Welcome to Your Journey of Growth with Bloom Psychology 🌸",
    category: 'newsletter',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Bloom Psychology</title>
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
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #6B3654;
      font-size: 22px;
      margin-bottom: 15px;
    }
    .benefit-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .benefit-emoji {
      font-size: 24px;
      margin-right: 15px;
    }
    .next-steps {
      background-color: #FCF4F9;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #C06B93;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 10px 0;
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
      <h1>Welcome to Bloom Psychology! 🌸</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hi {{firstName}}!</p>
      
      <p>Thank you for joining our community! We're honored to be part of your mental health and wellness journey.</p>
      
      <div class="section">
        <h2>What You'll Receive 📬</h2>
        <div class="benefit-item">
          <span class="benefit-emoji">🧠</span>
          <div>
            <strong>Monthly Insights:</strong> Evidence-based tips and strategies for mental wellness
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-emoji">💝</span>
          <div>
            <strong>Exclusive Resources:</strong> Tools and guides created by Dr. Jana Rundle
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-emoji">🌟</span>
          <div>
            <strong>Community Updates:</strong> New programs, workshops, and special offers
          </div>
        </div>
      </div>
      
      <div class="next-steps">
        <h3 style="margin-top: 0;">Your Next Steps 🚀</h3>
        <ol>
          <li><strong>Save our email:</strong> Add jana@bloompsychologynorthaustin.com to your contacts</li>
          <li><strong>Explore our blog:</strong> Find helpful articles on anxiety, relationships, and more</li>
          <li><strong>Follow us:</strong> Connect on social media for daily wellness tips</li>
        </ol>
      </div>
      
      <p>We believe in making mental health support accessible and approachable. Whether you're dealing with anxiety, navigating life transitions, or simply want to grow, we're here for you.</p>
      
      <p style="text-align: center;">
        <a href="https://www.bloompsychologynorthaustin.com/blog" class="button">
          Read Our Latest Articles
        </a>
      </p>
      
      <p>With so much warmth,<br>
      <strong>Dr. Jana Rundle & The Bloom Psychology Team</strong> 🌸</p>
      
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        P.S. Hit reply and tell us one thing that's been on your mind. We read every email 
        and would love to hear from you! 💌
      </p>
    </div>
    
    <div class="footer">
      <p>Bloom Psychology of Austin<br>
        North Austin, TX<br>
        <a href="https://www.bloompsychologynorthaustin.com" style="color: #C06B93;">
          www.bloompsychologynorthaustin.com
        </a>
      </p>
      
      <p style="font-size: 12px; margin-top: 20px;">
        You're receiving this because you joined our community at bloompsychologynorthaustin.com. 
        We promise to respect your inbox and your privacy. 💕
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

  console.log('Adding welcome template to database...');
  
  const { data, error } = await supabase
    .from('email_templates')
    .insert(template)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding template:', error);
    return;
  }
  
  console.log('✅ Welcome template added successfully!');
  console.log('Template ID:', data.id);
  console.log('Template name:', data.name);
}

addWelcomeTemplate();