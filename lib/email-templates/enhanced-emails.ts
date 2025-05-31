// Enhanced email templates with Bloom themes and emojis
export const enhancedEmailTemplates = {
  // Newsletter signup sequence
  newsletter: {
    welcome: {
      subject: "Welcome to Your Journey of Growth with Bloom Psychology 🌸",
      delay: 0,
      content: (firstName: string) => `
<!DOCTYPE html>
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
      font-size: 20px;
      margin-bottom: 15px;
    }
    .resource-box {
      background-color: #FDF5F9;
      border-left: 4px solid #C06B93;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .resource-box h3 {
      margin-top: 0;
      color: #6B3654;
    }
    .button {
      display: inline-block;
      padding: 14px 30px;
      background-color: #C06B93;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 10px 0;
    }
    .button:hover {
      background-color: #B05882;
    }
    .tips-list {
      padding-left: 20px;
    }
    .tips-list li {
      margin-bottom: 10px;
      color: #555;
    }
    .footer {
      background-color: #F8F8F8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      margin: 0 10px;
      color: #C06B93;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #E0E0E0;
      margin: 30px 0;
    }
    .emoji-header {
      font-size: 48px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji-header">🌸✨</div>
      <h1>Welcome to Your Bloom Journey</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear ${firstName || 'Beautiful Soul'} 💕,
      </div>
      
      <p>
        Welcome to our garden of growth! 🌱 We're absolutely thrilled that you've taken this courageous step 
        in prioritizing your mental wellness. At Bloom Psychology, we believe every woman deserves to flourish, 
        and we're honored to be part of your journey.
      </p>
      
      <div class="section">
        <h2>🎁 What's Blooming in Your Inbox</h2>
        <ul class="tips-list">
          <li>💭 <strong>Monthly Mind Gardens:</strong> Evidence-based tips to cultivate peace and manage life's storms</li>
          <li>🌟 <strong>Sparkle Spotlights:</strong> Practical tools and exercises you can use right away</li>
          <li>👭 <strong>Sister Stories:</strong> Inspiring journeys from our community (shared with love and privacy)</li>
          <li>🎯 <strong>First Bloom Benefits:</strong> Exclusive access to workshops and special offerings</li>
        </ul>
      </div>
      
      <div class="resource-box">
        <h3>🎁 Your Welcome Gift Is Here!</h3>
        <p>
          As our thank you for joining the Bloom family, we've prepared something special just for you:
        </p>
        <p>
          <strong>"5 Grounding Techniques for Anxious Moments"</strong> 🌿<br>
          Simple, science-backed exercises that fit in your pocket (and your busy life!)
        </p>
        <a href="https://www.bloompsychologynorthaustin.com/resources/grounding-techniques" class="button">
          Claim Your Free Guide 🎉
        </a>
      </div>
      
      <div class="section">
        <h2>🌱 Quick Seeds to Plant Today</h2>
        <ul class="tips-list">
          <li>🤗 <strong>Embrace Your Pace:</strong> Growth isn't linear - celebrate every tiny victory</li>
          <li>💝 <strong>Practice Self-Love:</strong> Talk to yourself like you would your dearest friend</li>
          <li>🔍 <strong>Stay Curious:</strong> Your healing journey is uniquely yours to discover</li>
          <li>🤝 <strong>Reach Out:</strong> Connection is medicine - we're here whenever you need us</li>
        </ul>
      </div>
      
      <div class="divider"></div>
      
      <div class="section" style="text-align: center;">
        <h2>Ready to Bloom? 🌸</h2>
        <p>
          If you're considering therapy, we offer a free 15-minute consultation to explore how we can 
          support your unique journey. No pressure, just a warm conversation about your hopes and needs.
        </p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Schedule Your Free Chat ☕
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p style="color: #666; font-size: 14px;">
        <strong>A Personal Note from Jana 💌:</strong><br>
        <em>"Welcome to our community of brave women choosing growth! Remember, seeking support isn't 
        just okay - it's an act of radical self-love. You're already blooming, and we're here to 
        water your garden whenever you're ready. You've got this!"</em>
      </p>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="https://www.instagram.com/bloompsychology.atx/">Instagram 📸</a> | 
        <a href="https://www.linkedin.com/company/bloom-psychology-atx/">LinkedIn 💼</a>
      </div>
      
      <p>
        Bloom Psychology 🌸<br>
        North Austin, Texas<br>
        <a href="mailto:jana@bloompsychologynorthaustin.com" style="color: #C06B93;">
          jana@bloompsychologynorthaustin.com
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
</html>
      `
    },
    day3: {
      subject: "3 Quick Wins for Your Mental Wellness Journey 🌟",
      delay: 72, // 3 days in hours
      content: (firstName: string) => `
<!DOCTYPE html>
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
    .emoji-large { font-size: 36px; display: block; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #6B3654; margin: 0;">Your 3-Day Check-In 💝</h1>
    </div>
    
    <div class="content">
      <p>Hi ${firstName || 'there'} 👋,</p>
      
      <p>How's your week going? We wanted to share 3 simple practices that our clients absolutely love - 
      they take less than 5 minutes but can shift your entire day! ✨</p>
      
      <div class="quick-win">
        <span class="emoji-large">🌅</span>
        <h3 style="margin-top: 0; color: #6B3654;">1. The Morning Bloom Ritual</h3>
        <p>Before checking your phone, place your hand on your heart and take 3 deep breaths. 
        Ask yourself: "What do I need today?" Listen without judgment. This simple check-in 
        helps you start the day connected to YOU. 💕</p>
      </div>
      
      <div class="quick-win">
        <span class="emoji-large">🌿</span>
        <h3 style="margin-top: 0; color: #6B3654;">2. The 5-4-3-2-1 Grounding Game</h3>
        <p>Feeling anxious? Try this: Name 5 things you see, 4 you can touch, 3 you hear, 
        2 you smell, and 1 you taste. It's like a reset button for your nervous system! 
        (P.S. This is from that free guide we sent - did you grab it yet? 😊)</p>
      </div>
      
      <div class="quick-win">
        <span class="emoji-large">🌙</span>
        <h3 style="margin-top: 0; color: #6B3654;">3. The Gratitude Glow-Up</h3>
        <p>Tonight before bed, think of 3 tiny things that made you smile today. Maybe your 
        coffee was perfect, or you caught a glimpse of a cute dog. Small joys count! 
        This rewires your brain to notice more good stuff. 🌟</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Want more personalized strategies?</strong></p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Let's Chat (It's Free!) 💬
        </a>
      </div>
      
      <p style="font-style: italic; color: #666;">
        Remember: You don't have to do this alone. We're here whenever you're ready to bloom. 🌸
      </p>
      
      <p>Sending you warmth and wellness,<br>
      Jana & The Bloom Team 💕</p>
    </div>
  </div>
</body>
</html>
      `
    },
    day7: {
      subject: "Is This Normal? (Spoiler: You're Not Alone) 🤗",
      delay: 168, // 7 days in hours
      content: (firstName: string) => `
<!DOCTYPE html>
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
      <p>Hey ${firstName || 'friend'} 💕,</p>
      
      <p>Can we get real for a moment? If you've been wondering whether what you're feeling is "normal," 
      we want you to know something important...</p>
      
      <div class="story-box">
        <h3 style="color: #2C3E50; margin-top: 0;">Sarah's Story (shared with permission) 🌟</h3>
        <p><em>"I thought I was the only mom who felt like crying in the Target parking lot. Or who 
        loved my kids but sometimes fantasized about running away. Turns out, I wasn't broken - 
        I was human. Therapy helped me see that."</em></p>
        <p style="text-align: right; color: #666;">- Sarah, Bloom client & super mom</p>
      </div>
      
      <h3 style="color: #6B3654;">You're in Good Company:</h3>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">1 in 5</strong><br>
        Women experience anxiety or depression each year 🤝
      </div>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">75%</strong><br>
        Of moms report feeling overwhelmed regularly 😮‍💨
      </div>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">84%</strong><br>
        Of people say therapy helped them feel "significantly better" 💗
      </div>
      
      <div class="stat-box">
        <strong style="font-size: 24px; color: #C06B93;">9 out of 10</strong><br>
        Clients wish they'd started therapy sooner (but started exactly when ready!) 🌟
      </div>
      
      <h3 style="color: #6B3654; margin-top: 30px;">Common "Is This Normal?" Questions We Hear:</h3>
      <ul style="line-height: 1.8;">
        <li>✓ "Why do I feel anxious even when everything is 'fine'?"</li>
        <li>✓ "Is it normal to love being a mom AND miss my old life?"</li>
        <li>✓ "Why can't I just 'snap out of it' like everyone says?"</li>
        <li>✓ "Am I weak for needing help?"</li>
      </ul>
      
      <p><strong>The answer?</strong> These feelings are incredibly common, completely valid, and 
      absolutely worth addressing. You deserve support, not judgment. 💕</p>
      
      <div style="background-color: #FDF5F9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin-bottom: 15px;"><strong>Ready to talk to someone who gets it?</strong></p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Book Your Free Consultation 🌸
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">No pressure, just understanding</p>
      </div>
      
      <p style="font-style: italic;">
        P.S. That crying-in-the-Target-parking-lot thing? More common than you'd think. 
        We've got tissues and zero judgment. 🤗
      </p>
      
      <p>With understanding and support,<br>
      The Bloom Psychology Team 🌸</p>
    </div>
  </div>
</body>
</html>
      `
    },
    day14: {
      subject: "Your Self-Care Isn't Selfish (Here's Why) 💅✨",
      delay: 336, // 14 days in hours
      content: (firstName: string) => `
<!DOCTYPE html>
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
      <p>Hi ${firstName || 'amazing human'} 🌟,</p>
      
      <p>Quick question: When was the last time you did something just for YOU without feeling guilty? 
      If you had to think about it... this email is definitely for you. 😊</p>
      
      <h3 style="color: #6B3654;">Let's Bust Some Self-Care Myths:</h3>
      
      <div class="myth-buster">
        <h4 style="color: #C06B93; margin-top: 0;">Myth #1: "Self-care is selfish" 🚫</h4>
        <p><strong>Truth:</strong> You can't pour from an empty cup. Taking care of yourself 
        IS taking care of everyone who depends on you. Period. 💯</p>
      </div>
      
      <div class="myth-buster">
        <h4 style="color: #C06B93; margin-top: 0;">Myth #2: "I don't have time" ⏰</h4>
        <p><strong>Truth:</strong> Self-care doesn't mean spa days (though those are nice!). 
        It can be 30 seconds of deep breathing or saying "no" to one thing today. ✨</p>
      </div>
      
      <div class="myth-buster">
        <h4 style="color: #C06B93; margin-top: 0;">Myth #3: "Strong women don't need help" 💪</h4>
        <p><strong>Truth:</strong> The strongest women know when to ask for support. 
        Vulnerability is the new superpower! 🦸‍♀️</p>
      </div>
      
      <h3 style="color: #6B3654; margin-top: 30px;">5-Minute Self-Care Ideas That Actually Work:</h3>
      
      <div class="self-care-idea">
        ☕ <strong>The Sacred Sip:</strong> Make your coffee/tea and actually drink it hot. Revolutionary, we know!
      </div>
      
      <div class="self-care-idea">
        🚗 <strong>Car Karaoke Therapy:</strong> Belt out your favorite song. Bonus points for dramatic hand gestures!
      </div>
      
      <div class="self-care-idea">
        📱 <strong>Boundary Boss Move:</strong> Turn off notifications for 1 hour. The world won't end, promise!
      </div>
      
      <div class="self-care-idea">
        💭 <strong>Compliment Yourself:</strong> Look in the mirror and say one nice thing. Yes, it feels weird. Do it anyway!
      </div>
      
      <div class="self-care-idea">
        🌸 <strong>Ask for Help:</strong> Text a friend, call your mom, or... book that therapy session you've been thinking about.
      </div>
      
      <div style="background-color: #E6F3FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #6B3654; margin-top: 0;">🎁 Bonus Gift: Your Self-Care Toolkit</h3>
        <p>Since you're clearly serious about your wellness journey, here's another gift just for you:</p>
        <p><strong>"10 Tiny Self-Care Rituals That Take Less Than 2 Minutes"</strong> ✨</p>
        <p style="text-align: center;">
          <a href="https://www.bloompsychologynorthaustin.com/resources/micro-self-care" style="color: #C06B93; font-weight: bold;">
            Download Your Bonus Guide 📱
          </a>
        </p>
      </div>
      
      <div style="background-color: #FDF5F9; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="font-size: 18px; color: #6B3654; margin-bottom: 15px;">
          <strong>Your mental health is just as important as your physical health 💕</strong>
        </p>
        <p>Ready to make yourself a priority?</p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Yes, I'm Worth It! 🌟
        </a>
      </div>
      
      <p style="font-style: italic; color: #666;">
        Remember: Every time you take care of yourself, you're modeling self-love for everyone 
        watching - your kids, friends, that inner critic. You're changing the game! 🎯
      </p>
      
      <p>Cheering you on,<br>
      Jana & The Bloom Squad 🌸</p>
      
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        P.S. If you made it this far, do one tiny self-care thing RIGHT NOW. We'll wait... 😊
      </p>
    </div>
  </div>
</body>
</html>
      `
    },
    day30: {
      subject: "One Month Later: How Are You Really? 💭",
      delay: 720, // 30 days in hours
      content: (firstName: string) => `
<!DOCTYPE html>
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
    .checkin-item { padding: 10px 0; border-bottom: 1px solid #EEE; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4B0082; margin: 0;">Your One-Month Check-In 🌙✨</h1>
    </div>
    
    <div class="content">
      <p>Hi ${firstName || 'friend'} 💜,</p>
      
      <p>Can you believe it's been a month since you joined our Bloom family? We've been thinking 
      about you and wanted to check in - how are you REALLY doing?</p>
      
      <div class="reflection-box">
        <h3 style="color: #6B3654; margin-top: 0;">Take a Moment to Reflect 🪞</h3>
        
        <div class="checkin-item">
          <strong>Energy Level:</strong> Are you running on empty or finding moments of spark? ⚡
        </div>
        
        <div class="checkin-item">
          <strong>Sleep Quality:</strong> Getting rest or having 3am worry parties? 😴
        </div>
        
        <div class="checkin-item">
          <strong>Mood Waves:</strong> Riding them okay or feeling overwhelmed? 🌊
        </div>
        
        <div class="checkin-item">
          <strong>Support System:</strong> Feeling connected or a bit isolated? 🤝
        </div>
        
        <div class="checkin-item" style="border: none;">
          <strong>Self-Compassion:</strong> Being kind to yourself or your own worst critic? 💕
        </div>
      </div>
      
      <p>Here's the thing - wherever you are on this spectrum is OKAY. Growth isn't linear, 
      and some months are about surviving, not thriving. We get it. 🫂</p>
      
      <h3 style="color: #6B3654;">What We've Noticed from Our Community:</h3>
      <ul style="line-height: 1.8;">
        <li>🌱 Small steps lead to big changes (even when you can't see them yet)</li>
        <li>💡 Awareness is the first step - noticing your patterns is huge!</li>
        <li>🔄 Bad days don't erase your progress</li>
        <li>💪 Asking for help is the bravest thing you can do</li>
      </ul>
      
      <div class="offer-box">
        <h3 style="color: #C06B93; margin-top: 0;">Special One-Month Offer (48 Hours Only!) 🎁⏰</h3>
        <p>As a thank you for being part of our community for a whole month, we're offering you:</p>
        <p style="font-size: 20px; color: #6B3654; font-weight: bold; margin: 15px 0;">
          $25 off your first therapy session
        </p>
        <p style="color: #C06B93; font-weight: bold;">⏰ This offer expires in 48 hours</p>
        <p>Because sometimes the hardest part is just getting started, and you've already shown such courage! 💕</p>
        <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
          Claim My $25 Discount Now 🌸
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
          Use code: <strong>BLOOM30</strong> when booking • Expires in 48 hours
        </p>
      </div>
      
      <p><strong>Not ready yet? That's okay too!</strong> We'll keep sending you resources, 
      inspiration, and reminders that you're not alone. Your timeline is the right timeline. ⏰</p>
      
      <p style="font-style: italic; color: #666; background-color: #F5F5F5; padding: 15px; border-radius: 8px;">
        "The day she let go of the things that were weighing her down was the day she began to shine." 
        - Katrina Mayer 🌟
      </p>
      
      <p>Whether you book a session or just keep reading our emails, we're honored to be part 
      of your journey. You matter, your mental health matters, and we're here when you need us.</p>
      
      <p>With so much warmth,<br>
      Jana & The Bloom Psychology Team 🌸</p>
      
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        P.S. Hit reply and tell us one thing that's been on your mind. We read every email 
        and would love to hear from you! 💌
      </p>
    </div>
  </div>
</body>
</html>
      `
    }
  },
  
  // Contact form follow-up sequence
  contactFollowup: {
    immediate: {
      subject: "We Got Your Message! Here's What Happens Next 💌",
      delay: 0,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFE4E1 0%, #F8E1E7 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .timeline { background-color: #F5F5FF; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .timeline-item { display: flex; align-items: start; margin-bottom: 15px; }
    .timeline-icon { font-size: 24px; margin-right: 15px; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .resource-box { background-color: #FFF5F8; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Your Message Landed Safely! 🎯</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 👋,</p>
      
      <p>First things first - THANK YOU for reaching out! 🙏 We know hitting that "send" button 
      takes courage, and we're genuinely honored that you chose to connect with us.</p>
      
      <div class="timeline">
        <h3 style="color: #6B3654; margin-top: 0;">What Happens Next? 🗓️</h3>
        
        <div class="timeline-item">
          <span class="timeline-icon">📧</span>
          <div>
            <strong>Right Now:</strong> Your message is safely in our inbox (this email confirms it!)
          </div>
        </div>
        
        <div class="timeline-item">
          <span class="timeline-icon">👀</span>
          <div>
            <strong>Within 24 Hours:</strong> Jana or a team member will personally review your message
          </div>
        </div>
        
        <div class="timeline-item">
          <span class="timeline-icon">💬</span>
          <div>
            <strong>Within 48 Hours:</strong> You'll receive a personalized response with next steps
          </div>
        </div>
        
        <div class="timeline-item">
          <span class="timeline-icon">🌸</span>
          <div>
            <strong>Moving Forward:</strong> We'll work with you to find the perfect support solution
          </div>
        </div>
      </div>
      
      <div class="resource-box">
        <h3 style="color: #C06B93; margin-top: 0;">While You Wait... 🎁</h3>
        <p>We've prepared some helpful resources just for you:</p>
        <ul>
          <li>📖 <a href="https://bloompsychologynorthaustin.com/blog" style="color: #C06B93;">Browse our blog</a> for mental health tips</li>
          <li>🧘‍♀️ Try our <a href="https://bloompsychologynorthaustin.com/resources/grounding-techniques" style="color: #C06B93;">free grounding exercises</a></li>
          <li>💭 Learn about our <a href="https://bloompsychologynorthaustin.com/services" style="color: #C06B93;">specialized services</a></li>
        </ul>
      </div>
      
      <p><strong>Need to chat sooner?</strong> We offer same-week appointments! 🗓️</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">
          Book Your Free 15-Min Consultation 📞
        </a>
      </div>
      
      <p style="font-style: italic; color: #666;">
        P.S. If this is urgent or you're in crisis, please don't wait. Call the Crisis Hotline 
        at 988 or text HOME to 741741. Your safety matters most. 💕
      </p>
      
      <p>Warmly,<br>
      The Bloom Psychology Team 🌸</p>
    </div>
  </div>
</body>
</html>
      `
    },
    followup72: {
      subject: "Still Here for You (No Pressure!) 🤗",
      delay: 72,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E6F3FF 0%, #F0E6FF 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .gentle-box { background-color: #FFF9F5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C06B93; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Just Checking In 💜</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 🌟,</p>
      
      <p>We wanted to gently follow up on your message from a few days ago. We hope you received 
      our response and that it was helpful! 😊</p>
      
      <div class="gentle-box">
        <h3 style="color: #6B3654; margin-top: 0;">No Pressure, Just Options 🌈</h3>
        <p>We totally get it - sometimes life gets busy, or maybe you're still thinking things over. 
        That's completely okay! We're here whenever YOU'RE ready.</p>
      </div>
      
      <p><strong>A few things that might help:</strong></p>
      <ul style="line-height: 1.8;">
        <li>💭 Our consultations are free and totally no-pressure</li>
        <li>📱 We offer both in-person and virtual sessions</li>
        <li>🗓️ Evening and weekend appointments available</li>
        <li>💕 We specialize in exactly what you're going through</li>
      </ul>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px;">
        <em>"The best time to plant a tree was 20 years ago. The second best time is now."</em> 
        - Chinese Proverb 🌳
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p>Ready when you are:</p>
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">
          Schedule Your Free Chat ☕
        </a>
      </div>
      
      <p>And if you're not ready? That's okay too. We'll be here, cheering you on from afar 
      and sending good vibes your way. 🌟</p>
      
      <p>Take care of yourself,<br>
      Jana & The Bloom Team 💕</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. Sometimes the bravest thing you can do is ask for help. We see your courage! 💪
      </p>
    </div>
  </div>
</body>
</html>
      `
    },
    resources7: {
      subject: "Free Resources to Support Your Journey 🎁",
      delay: 168,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFE4CC 0%, #FFDAB9 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .resource-card { background-color: #FFF5F8; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Your Mental Wellness Toolkit 🧰✨</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 💕,</p>
      
      <p>We believe everyone deserves access to mental health support, even if you're not quite 
      ready for therapy yet. So we've gathered our most popular free resources just for you! 🎁</p>
      
      <div class="resource-card">
        <h3 style="color: #C06B93; margin-top: 0;">🌿 5-Minute Calm Down Kit</h3>
        <p>Anxiety acting up? This quick guide includes breathing exercises, grounding techniques, 
        and a soothing playlist to help you find your center.</p>
        <a href="https://bloompsychologynorthaustin.com/resources/grounding-techniques" style="color: #C06B93;">
          Get Your Calm Kit →
        </a>
      </div>
      
      <div class="resource-card">
        <h3 style="color: #C06B93; margin-top: 0;">📝 The "Am I Okay?" Checklist</h3>
        <p>Sometimes it's hard to know when to seek help. This gentle self-assessment helps you 
        check in with yourself and recognize when support might be helpful.</p>
        <a href="https://bloompsychologynorthaustin.com/resources/self-assessment" style="color: #C06B93;">
          Take the Checklist →
        </a>
      </div>
      
      <div class="resource-card">
        <h3 style="color: #C06B93; margin-top: 0;">💜 New Mom Survival Guide</h3>
        <p>For all the mamas out there - this guide covers everything from postpartum emotions 
        to finding time for self-care (yes, it's possible!).</p>
        <a href="https://bloompsychologynorthaustin.com/resources/new-mom-guide" style="color: #C06B93;">
          Download the Guide →
        </a>
      </div>
      
      <div class="resource-card">
        <h3 style="color: #C06B93; margin-top: 0;">🎧 Bloom Podcast Episodes</h3>
        <p>Real talk about mental health, motherhood, and everything in between. Perfect for 
        your commute or while folding that never-ending laundry!</p>
        <a href="https://bloompsychologynorthaustin.com/podcast" style="color: #C06B93;">
          Listen Now →
        </a>
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px; text-align: center;">
        <strong>Remember:</strong> Using these resources IS taking care of your mental health! 
        You're already doing the work. 👏
      </p>
      
      <p>Of course, if you ever want to go deeper or need more personalized support, we're just 
      a click away:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">
          Ready to Talk? Book Here 💬
        </a>
      </div>
      
      <p>Keep blooming at your own pace,<br>
      The Bloom Psychology Team 🌸</p>
    </div>
  </div>
</body>
</html>
      `
    }
  },
  
  // Booking confirmation sequence
  bookingConfirmation: {
    confirmation: {
      subject: "Yay! Your Consultation is Confirmed 🎉",
      delay: 0,
      content: (name: string, appointmentDetails?: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #98FB98 0%, #90EE90 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .appointment-box { background-color: #F0FFF0; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #90EE90; }
    .prep-tip { background-color: #FFF5F8; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #2E7D32; margin: 0;">We Can't Wait to Meet You! 🌟</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 🎊,</p>
      
      <p>This is so exciting! Your consultation is officially on the books. We're doing a happy 
      dance over here because you just took a HUGE step toward your wellness journey! 💃</p>
      
      <div class="appointment-box">
        <h3 style="color: #2E7D32; margin-top: 0;">📅 Your Appointment Details:</h3>
        <p><strong>Date:</strong> ${appointmentDetails?.date || '[Date]'}<br>
        <strong>Time:</strong> ${appointmentDetails?.time || '[Time]'}<br>
        <strong>Duration:</strong> 15 minutes (free consultation)<br>
        <strong>Format:</strong> ${appointmentDetails?.format || 'Phone/Video (your choice)'}<br>
        <strong>With:</strong> One of our caring specialists</p>
      </div>
      
      <h3 style="color: #6B3654;">How to Prepare (It's Easy!) 🌸</h3>
      
      <div class="prep-tip">
        <strong>🧘‍♀️ Find Your Zen Zone:</strong> Pick a quiet, private spot where you feel comfortable talking.
      </div>
      
      <div class="prep-tip">
        <strong>📝 Jot Down Your Thoughts:</strong> What's been on your mind? What would you like help with? 
        No need for an essay - bullet points work great!
      </div>
      
      <div class="prep-tip">
        <strong>❓ Bring Your Questions:</strong> Wondering about our approach? Insurance? Schedule? 
        This is your time to ask anything!
      </div>
      
      <div class="prep-tip">
        <strong>☕ Comfort is Key:</strong> Grab your favorite beverage, take a deep breath, and 
        remember - this is just a friendly chat!
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px;">
        <strong>Good to Know:</strong> There's absolutely no pressure to book ongoing sessions. 
        This consultation is about seeing if we're a good fit for each other. Think of it like 
        a mental health coffee date! ☕💕
      </p>
      
      <h3 style="color: #6B3654;">Need to Reschedule? No Problem!</h3>
      <p>Life happens! If you need to change your appointment, just let us know 24 hours in advance:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://bloompsychologynorthaustin.com/reschedule" class="cta-button">
          Manage Your Appointment 📅
        </a>
      </div>
      
      <p>We're truly honored that you chose Bloom Psychology. You're taking a brave step, and 
      we'll be right there with you! 🤝</p>
      
      <p>See you soon!<br>
      The Bloom Team 🌸</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. Feeling nervous? That's totally normal! Remember, we're real people who genuinely 
        care about helping you feel better. No judgment, just support. 💜
      </p>
    </div>
  </div>
</body>
</html>
      `
    },
    reminder24: {
      subject: "See You Tomorrow! Quick Reminder 📅✨",
      delay: 24,
      content: (name: string, appointmentDetails?: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFE5B4 0%, #FFDAB9 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .reminder-box { background-color: #FFF8E7; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #FFB347; }
    .quick-tip { background-color: #F0F8FF; padding: 12px; border-radius: 6px; margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #FF6347; margin: 0;">Tomorrow's the Day! 🌟</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 👋,</p>
      
      <p>Just a friendly reminder that we have our consultation scheduled for tomorrow! 
      We're so looking forward to connecting with you. 😊</p>
      
      <div class="reminder-box">
        <h3 style="color: #FF6347; margin-top: 0;">⏰ Your Appointment:</h3>
        <p style="font-size: 18px;">
        <strong>Tomorrow at ${appointmentDetails?.time || '[Time]'}</strong><br>
        📍 ${appointmentDetails?.format || 'Phone/Video Call'}<br>
        ⏱️ 15 minutes
        </p>
      </div>
      
      <h3 style="color: #6B3654;">Last-Minute Reminders 📝</h3>
      
      <div class="quick-tip">
        💻 <strong>Tech Check:</strong> If video call, test your camera/mic real quick
      </div>
      
      <div class="quick-tip">
        📱 <strong>Phone Ready:</strong> Make sure your phone is charged
      </div>
      
      <div class="quick-tip">
        🤫 <strong>Quiet Space:</strong> Find somewhere private to chat
      </div>
      
      <div class="quick-tip">
        💭 <strong>Your Goals:</strong> Think about what you'd like from therapy
      </div>
      
      <p style="text-align: center; font-style: italic; color: #666; margin: 20px 0;">
        "You don't have to see the whole staircase, just take the first step." - MLK Jr. 🌈
      </p>
      
      <p>Remember, this is just a casual conversation to see how we can help. No pressure, 
      no judgment, just two humans talking about how to help you feel better! 💕</p>
      
      <p>See you tomorrow!<br>
      The Bloom Team 🌸</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. If something comes up and you need to reschedule, no worries! Just give us a 
        heads up as soon as you can. We totally understand that life happens! 🤗
      </p>
    </div>
  </div>
</body>
</html>
      `
    },
    followup48: {
      subject: "How Was Your Consultation? We'd Love to Know! 💭",
      delay: 48,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .feedback-box { background-color: #F5F0FF; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .next-step { background-color: #FFF5F8; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #C06B93; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #8B008B; margin: 0;">Thanks for Chatting With Us! 💜</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 🌟,</p>
      
      <p>We hope you found your consultation helpful! Whether you're ready to dive into therapy 
      or still thinking things over, we wanted to check in and see how you're feeling. 😊</p>
      
      <div class="feedback-box">
        <h3 style="color: #8B008B; margin-top: 0;">How Did It Go? 🤔</h3>
        <p>Your honest feedback helps us improve and ensures everyone gets the support they need. 
        Did we answer your questions? Did you feel heard and understood?</p>
        <p style="text-align: center;">
          <a href="https://bloompsychologynorthaustin.com/feedback" style="color: #C06B93;">
            Share Your Thoughts (2 minutes) →
          </a>
        </p>
      </div>
      
      <h3 style="color: #6B3654;">What's Next? Your Options:</h3>
      
      <div class="next-step">
        <strong>Option 1: Ready to Start? 🚀</strong><br>
        If you felt a good connection and want to begin your therapy journey, we have spots 
        available as soon as this week!
        <p style="text-align: center; margin-top: 10px;">
          <a href="https://bloompsychologynorthaustin.com/book-session" class="cta-button">
            Book Your First Session
          </a>
        </p>
      </div>
      
      <div class="next-step">
        <strong>Option 2: Need More Info? 📚</strong><br>
        Still have questions? Want to know more about our approach or discuss insurance? 
        Just reply to this email - we're happy to help!
      </div>
      
      <div class="next-step">
        <strong>Option 3: Not Right Now? 🌱</strong><br>
        That's totally okay! Timing is everything. We'll keep sending you helpful resources 
        and will be here whenever you're ready.
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px;">
        <strong>Special Offer:</strong> Book within the next 48 hours and get $20 off your 
        first full session! Just mention this email when scheduling. 💕
      </p>
      
      <p>Remember, there's no "right" timeline for healing. Whether you start therapy tomorrow 
      or next year, we're proud of you for exploring your options. That takes courage! 💪</p>
      
      <p>Here if you need us,<br>
      Jana & The Bloom Team 🌸</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. Fun fact: 92% of our clients say they wish they'd started therapy sooner. But 100% 
        say they started at exactly the right time for them. Trust your journey! 🌟
      </p>
    </div>
  </div>
</body>
</html>
      `
    }
  },
  
  // Lead nurture sequence (for resource downloads)
  leadNurture: {
    thankYou: {
      subject: "Your Resource is Here! Plus a Little Extra 🎁",
      delay: 0,
      content: (name: string, resourceName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .download-box { background-color: #E0F8FF; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .bonus-tip { background-color: #FFF9E6; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4682B4; margin: 0;">Your Resource Has Arrived! 📬</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 🌟,</p>
      
      <p>Great choice downloading our ${resourceName || 'resource'}! You're taking action for 
      your mental health, and that's something to celebrate. 🎉</p>
      
      <div class="download-box">
        <h3 style="color: #4682B4; margin-top: 0;">📥 Access Your Resource</h3>
        <p>Click below to download your guide:</p>
        <a href="https://bloompsychologynorthaustin.com/download/${resourceName || 'resource'}" class="cta-button">
          Download Now 📄
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
          Tip: Save it to your phone for easy access anytime!
        </p>
      </div>
      
      <h3 style="color: #6B3654;">🎁 Your Bonus Quick-Start Tips:</h3>
      
      <div class="bonus-tip">
        <strong>💡 Tip 1: Small Steps Win</strong><br>
        Don't try to implement everything at once. Pick ONE technique from the guide and 
        practice it for a week. Master that, then add another!
      </div>
      
      <div class="bonus-tip">
        <strong>🔔 Tip 2: Set a Reminder</strong><br>
        Use your phone to set a daily reminder to practice. Even 2 minutes counts! 
        Consistency beats perfection every time.
      </div>
      
      <div class="bonus-tip">
        <strong>📱 Tip 3: Track Your Progress</strong><br>
        Note how you feel before and after using the techniques. You might be surprised 
        by the patterns you discover!
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px;">
        <strong>Did you know?</strong> Research shows that people who use mental health 
        resources + professional support see 3x better results than resources alone. 
        Just something to think about! 🤔
      </p>
      
      <p>If you find this resource helpful and want to dive deeper, we'd love to support 
      you with personalized strategies:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">
          Explore Therapy Options 🌸
        </a>
      </div>
      
      <p>Happy reading, and remember - you're already on the right path!</p>
      
      <p>Cheering you on,<br>
      The Bloom Psychology Team 💕</p>
    </div>
  </div>
</body>
</html>
      `
    },
    helpful72: {
      subject: "Quick Check: Is Your Resource Helping? 🤔",
      delay: 72,
      content: (name: string, resourceName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #F0E68C 0%, #FFD700 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .reflection-box { background-color: #FFFACD; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-story { background-color: #E6F3FF; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #DAA520; margin: 0;">How's It Going? 🌻</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 👋,</p>
      
      <p>It's been a few days since you downloaded our ${resourceName || 'guide'}. We're curious - 
      have you had a chance to try any of the techniques? No judgment if not - life gets busy! 😊</p>
      
      <div class="reflection-box">
        <h3 style="color: #DAA520; margin-top: 0;">Quick Self-Check 📊</h3>
        <p>Take a moment to notice:</p>
        <ul>
          <li>Have you tried any techniques from the guide?</li>
          <li>If yes, did anything surprise you?</li>
          <li>If no, what's been getting in the way?</li>
          <li>What support would help you most right now?</li>
        </ul>
      </div>
      
      <div class="success-story">
        <p>"I was skeptical about the breathing exercises, but tried them during a stressful 
        work call. Game changer! Now I use them daily." - Maria, Bloom client 🌟</p>
      </div>
      
      <h3 style="color: #6B3654;">Common Roadblocks (We Get It!):</h3>
      <ul style="line-height: 1.8;">
        <li>😴 "I keep forgetting to practice" → Try linking it to something you already do daily</li>
        <li>🤷‍♀️ "It feels weird/silly" → Totally normal! New habits always feel strange at first</li>
        <li>⏰ "No time!" → Even 30 seconds counts. Seriously!</li>
        <li>🤔 "Not sure if it's working" → Change takes time. Give it 2 weeks!</li>
      </ul>
      
      <p style="background-color: #FFF5F8; padding: 15px; border-radius: 8px;">
        <strong>Here's the thing:</strong> Self-help resources are amazing tools, but sometimes 
        we need a guide to help us use them effectively. That's where therapy comes in - 
        think of it as having a personal trainer for your mind! 🧠💪
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        Want to accelerate your progress?<br><br>
        <a href="https://bloompsychologynorthaustin.com/book" style="background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Let's Create Your Personal Plan 📋
        </a>
      </p>
      
      <p>Keep going - even tiny steps forward are still progress!</p>
      
      <p>In your corner,<br>
      The Bloom Team 🌸</p>
    </div>
  </div>
</body>
</html>
      `
    },
    successStory7: {
      subject: "From Struggling to Thriving: Sarah's Story 🌟",
      delay: 168,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .story-section { background-color: #F5F0FF; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .quote-box { background-color: #FFF; padding: 20px; border-left: 4px solid #C06B93; margin: 15px 0; font-style: italic; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4B0082; margin: 0;">Real Stories, Real Hope 💜</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 💕,</p>
      
      <p>Sometimes the best inspiration comes from someone who's walked the path before us. 
      Today, we're sharing Sarah's story (with her enthusiastic permission!).</p>
      
      <div class="story-section">
        <h3 style="color: #4B0082; margin-top: 0;">Meet Sarah: Mom of 2, Marketing Manager, Anxiety Warrior</h3>
        
        <div class="quote-box">
          "Six months ago, I was drowning. Between work deadlines, mom guilt, and constant 
          anxiety, I felt like I was failing at everything. I couldn't sleep, snapped at my 
          kids, and cried in my car daily."
        </div>
        
        <p><strong>The Turning Point:</strong></p>
        <p>Sarah downloaded our anxiety guide (just like you did!). She tried the techniques 
        but felt overwhelmed doing it alone. That's when she booked a consultation.</p>
        
        <div class="quote-box">
          "I was terrified of being judged. Instead, I found someone who said 'This is hard, 
          and you're not broken.' That changed everything."
        </div>
        
        <p><strong>The Journey:</strong></p>
        <ul>
          <li>🌱 Week 1-2: Learning to identify anxiety triggers</li>
          <li>🌿 Month 1: Developing personalized coping strategies</li>
          <li>🌳 Month 2-3: Working through underlying patterns</li>
          <li>🌸 Month 4-6: Building sustainable wellness habits</li>
        </ul>
        
        <div class="quote-box">
          "I'm not 'cured' - I'm human. But now I have tools. I sleep better, enjoy my kids, 
          and actually like myself. My anxiety doesn't run my life anymore."
        </div>
      </div>
      
      <h3 style="color: #6B3654;">Sarah's Top 3 Game-Changers:</h3>
      <ol>
        <li><strong>Having a safe space to be messy</strong> - "No performance required"</li>
        <li><strong>Practical tools that actually work</strong> - "Not just 'think positive'"</li>
        <li><strong>Someone who believed in me</strong> - "When I couldn't believe in myself"</li>
      </ol>
      
      <p style="background-color: #FFF5F8; padding: 20px; border-radius: 8px; text-align: center;">
        <strong>Sarah's Message to You:</strong><br>
        <em>"If you're reading this thinking 'that's nice but my situation is different' - 
        that's exactly what I thought. Give yourself a chance. You deserve to feel better."</em>
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p>Ready to write your own success story?</p>
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">
          Start Your Journey Today 🌟
        </a>
      </div>
      
      <p>Every journey starts with a single step. We'd be honored to walk alongside you.</p>
      
      <p>With hope and belief in you,<br>
      Jana & The Bloom Team 🌸</p>
    </div>
  </div>
</body>
</html>
      `
    },
    readyWhen14: {
      subject: "No Rush - Your Timeline is the Right Timeline ⏰💕",
      delay: 336,
      content: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #98FB98 0%, #00FA9A 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .gentle-reminder { background-color: #F0FFF0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .option-card { background-color: #FFF5F8; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #228B22; margin: 0;">Still Here, Still Caring 🌱</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name} 🌟,</p>
      
      <p>It's been two weeks since you joined our community, and we wanted to send some love 
      your way. No sales pitch, no pressure - just a gentle reminder that we're here. 💚</p>
      
      <div class="gentle-reminder">
        <h3 style="color: #228B22; margin-top: 0;">Your Wellness Journey is Unique 🦋</h3>
        <p>Maybe you're:</p>
        <ul>
          <li>Still thinking about therapy (totally fine!)</li>
          <li>Trying self-help first (we support that!)</li>
          <li>Waiting for the "right time" (spoiler: there isn't one 😊)</li>
          <li>Feeling better and don't need support right now (amazing!)</li>
        </ul>
        <p><strong>All of these are valid!</strong></p>
      </div>
      
      <h3 style="color: #6B3654;">Ways We Can Support You (Therapy or Not!):</h3>
      
      <div class="option-card">
        <strong>📚 Keep Learning</strong><br>
        Our blog is full of practical tips, real stories, and zero judgment. New posts every week!
        <p><a href="https://bloompsychologynorthaustin.com/blog" style="color: #C06B93;">Browse Recent Posts →</a></p>
      </div>
      
      <div class="option-card">
        <strong>🎧 Listen & Grow</strong><br>
        Prefer podcasts? We share 15-minute episodes on everything from mom guilt to managing anxiety.
        <p><a href="https://bloompsychologynorthaustin.com/podcast" style="color: #C06B93;">Latest Episodes →</a></p>
      </div>
      
      <div class="option-card">
        <strong>👥 Community Connection</strong><br>
        Join our free monthly virtual support circles. Meet others on similar journeys!
        <p><a href="https://bloompsychologynorthaustin.com/support-circles" style="color: #C06B93;">See Upcoming Dates →</a></p>
      </div>
      
      <div class="option-card">
        <strong>💬 Ready to Talk</strong><br>
        When/if you're ready for 1-on-1 support, we're here. No expiration date on this invitation!
        <p style="text-align: center; margin-top: 10px;">
          <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">Book When Ready 🌸</a>
        </p>
      </div>
      
      <p style="background-color: #F5F5FF; padding: 15px; border-radius: 8px; font-style: italic;">
        "The curious paradox is that when I accept myself just as I am, then I can change." 
        - Carl Rogers 💜
      </p>
      
      <p>Whether you're our client or just our email friend, we're glad you're here. 
      Take care of yourself in whatever way feels right for you today.</p>
      
      <p>Always in your corner,<br>
      The Bloom Psychology Team 🌸</p>
      
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        P.S. Want less emails? More emails? Different content? Just reply and let us know. 
        This is YOUR journey - we're just here to support it! 💕
      </p>
    </div>
  </div>
</body>
</html>
      `
    }
  }
};

// Helper function to get template by sequence and step
export function getEmailTemplate(sequence: string, step: string | number) {
  const sequenceTemplates = enhancedEmailTemplates[sequence];
  if (!sequenceTemplates) return null;
  
  // Handle numeric steps for backward compatibility
  if (typeof step === 'number') {
    const keys = Object.keys(sequenceTemplates);
    return sequenceTemplates[keys[step - 1]] || null;
  }
  
  return sequenceTemplates[step] || null;
}

// Helper function to personalize email content
export function personalizeEmail(template: any, data: { 
  firstName?: string; 
  name?: string; 
  resourceName?: string;
  appointmentDetails?: any;
}) {
  const firstName = data.firstName || data.name || 'Friend';
  
  return {
    subject: template.subject,
    content: typeof template.content === 'function' 
      ? template.content(firstName, data.resourceName || data.appointmentDetails)
      : template.content,
    delay: template.delay
  };
}