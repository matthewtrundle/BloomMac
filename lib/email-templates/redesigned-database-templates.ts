/**
 * Redesigned Database Email Templates
 * Following EMAIL_DESIGN_AUDIT.md recommendations
 */

export const redesignedDatabaseTemplates = {
  anxietyTips: {
    name: '5 Ways to Manage Daily Anxiety',
    subject: '5 Simple Techniques to Ease Your Anxiety Today 🌿',
    category: 'educational',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>5 Ways to Manage Daily Anxiety</title>
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
      background: linear-gradient(135deg, #A3D8F4 0%, #E6F3FF 100%);
      padding: 40px 30px;
      text-align: center;
      border-radius: 0 0 20px 20px;
    }
    .header h1 {
      color: #2C5F8B;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .emoji-header {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      color: #6B3654;
      margin-bottom: 20px;
    }
    .intro-text {
      font-size: 16px;
      color: #555;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    .technique-card {
      display: flex;
      align-items: start;
      background-color: #F8FCFF;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      border-left: 4px solid #A3D8F4;
      transition: all 0.3s ease;
    }
    .technique-card:hover {
      box-shadow: 0 4px 12px rgba(163, 216, 244, 0.3);
    }
    .number-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: #A3D8F4;
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 18px;
      margin-right: 20px;
      flex-shrink: 0;
    }
    .technique-content {
      flex: 1;
    }
    .technique-content h3 {
      color: #2C5F8B;
      margin: 0 0 10px 0;
      font-size: 20px;
    }
    .technique-content p {
      color: #666;
      margin: 0 0 15px 0;
      line-height: 1.6;
    }
    .try-it-box {
      background-color: #E6F3FF;
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .try-it-box strong {
      color: #2C5F8B;
      display: block;
      margin-bottom: 5px;
    }
    .stat-box {
      background-color: #FFF5F8;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    .stat-box .stat-number {
      font-size: 32px;
      color: #C06B93;
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
    }
    .cta-section {
      background-color: #FDF5F9;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    .cta-section p {
      font-size: 18px;
      color: #6B3654;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 14px 30px;
      background-color: #C06B93;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #B05882;
    }
    .footer {
      background-color: #F8F8F8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #C06B93;
      text-decoration: none;
    }
    .ps-note {
      background-color: #F0F8FF;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      font-style: italic;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji-header">🧘‍♀️✨</div>
      <h1>5 Simple Ways to Ease Your Daily Anxiety</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi {{firstName}} 💕,
      </div>
      
      <p class="intro-text">
        Feeling anxious? Take a deep breath - you're not alone, and you've absolutely got this. 
        Today, I'm sharing 5 evidence-based techniques that have helped thousands of women just like you 
        find calm in the chaos. The best part? Each one takes less than 5 minutes! 🌟
      </p>
      
      <div class="technique-card">
        <span class="number-circle">1</span>
        <div class="technique-content">
          <h3>The 4-7-8 Breath 🌬️</h3>
          <p>Your nervous system's reset button! This ancient breathing technique activates your body's relaxation response almost instantly.</p>
          <div class="try-it-box">
            <strong>Try it now:</strong>
            Breathe in for 4 counts... Hold for 7... Exhale slowly for 8... 
            Feel that shift? That's your parasympathetic nervous system saying "thank you!" 💆‍♀️
          </div>
        </div>
      </div>
      
      <div class="technique-card">
        <span class="number-circle">2</span>
        <div class="technique-content">
          <h3>The 5-4-3-2-1 Grounding Game 🌍</h3>
          <p>When anxiety makes you feel disconnected, this technique brings you back to the present moment - fast.</p>
          <div class="try-it-box">
            <strong>How to play:</strong>
            Name 5 things you see 👀, 4 you can touch 🤚, 3 you hear 👂, 2 you smell 👃, and 1 you taste 👅. 
            It's like a mindfulness scavenger hunt!
          </div>
        </div>
      </div>
      
      <div class="technique-card">
        <span class="number-circle">3</span>
        <div class="technique-content">
          <h3>Progressive Muscle Magic 💪</h3>
          <p>Your body holds tension you don't even realize. This technique helps you release it, one muscle group at a time.</p>
          <div class="try-it-box">
            <strong>Quick version:</strong>
            Scrunch your shoulders up to your ears for 5 seconds... then release. 
            Feel that relief? Now imagine that feeling throughout your entire body! 😌
          </div>
        </div>
      </div>
      
      <div class="technique-card">
        <span class="number-circle">4</span>
        <div class="technique-content">
          <h3>Mindful Walking Meditation 🚶‍♀️</h3>
          <p>Transform your daily walk into a moving meditation. No special equipment or apps needed!</p>
          <div class="try-it-box">
            <strong>The secret:</strong>
            Focus on the sensation of your feet touching the ground. Left, right, left, right... 
            Let your breath sync with your steps. It's meditation in motion! 🌸
          </div>
        </div>
      </div>
      
      <div class="technique-card">
        <span class="number-circle">5</span>
        <div class="technique-content">
          <h3>The Worry Window 📝</h3>
          <p>Give your worries a designated time slot, so they stop hijacking your entire day.</p>
          <div class="try-it-box">
            <strong>Tonight's homework:</strong>
            Set a timer for 10 minutes. Write down everything on your mind. 
            When the timer rings, close the journal and leave those worries on the page. 
            They'll still be there tomorrow if you need them (spoiler: you won't!) 📖
          </div>
        </div>
      </div>
      
      <div class="stat-box">
        <span class="stat-number">73%</span>
        <p>of our clients report feeling calmer after just one week of practicing these techniques daily!</p>
      </div>
      
      <div class="cta-section">
        <p><strong>Ready to go deeper?</strong> These techniques are powerful, but sometimes 
        anxiety needs more personalized attention. 💕</p>
        <a href="https://www.bloompsychologynorthaustin.com/services/anxiety-stress-management" class="button">
          Explore Our Anxiety Support →
        </a>
      </div>
      
      <div class="ps-note">
        <strong>Remember:</strong> It's okay if not every technique works for you. We're all beautifully unique! 
        Try each one, keep what serves you, and know that seeking support is always an act of strength, not weakness. 
        You're already taking such good care of yourself by reading this. 🌺
      </div>
      
      <p style="margin-top: 30px;">
        Take care of that beautiful mind of yours,<br>
        <strong style="color: #C06B93;">The Bloom Psychology Team</strong> 🌸
      </p>
    </div>
    
    <div class="footer">
      <p>
        <a href="https://www.instagram.com/bloompsychology.atx/">Instagram</a> | 
        <a href="https://www.linkedin.com/company/bloom-psychology-atx/">LinkedIn</a> | 
        <a href="https://www.bloompsychologynorthaustin.com/blog">Blog</a>
      </p>
      <p style="font-size: 12px; margin-top: 20px;">
        © 2025 Bloom Psychology | North Austin, Texas<br>
        <a href="{{unsubscribeLink}}" style="color: #999;">Unsubscribe</a> | 
        <a href="https://www.bloompsychologynorthaustin.com/privacy-policy" style="color: #999;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  newMomProgram: {
    name: 'New Mom Support Program',
    subject: "You're Not Alone, Mama - Support Designed Just for You 🤱💕",
    category: 'promotional',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Mom Support Program</title>
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
      background: linear-gradient(135deg, #FFE4E1 0%, #F8E1E7 100%);
      padding: 40px 30px;
      text-align: center;
      border-radius: 0 0 20px 20px;
    }
    .header h1 {
      color: #8B4A6B;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .emoji-header {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      color: #6B3654;
      margin-bottom: 20px;
    }
    .normalize-box {
      background-color: #FFF5F8;
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
      border-left: 4px solid #FFB6C1;
    }
    .normalize-box h3 {
      color: #8B4A6B;
      margin-top: 0;
      font-size: 20px;
    }
    .feeling-list {
      list-style: none;
      padding: 0;
      margin: 15px 0;
    }
    .feeling-list li {
      padding: 8px 0;
      font-size: 16px;
      color: #555;
    }
    .feeling-list li:before {
      content: '';
      margin-right: 8px;
    }
    .validation-text {
      background-color: #FDF5F9;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      font-size: 18px;
      color: #6B3654;
      font-weight: 600;
      margin: 20px 0;
    }
    .benefit-card {
      background-color: #F8F0F5;
      padding: 20px;
      border-radius: 12px;
      margin: 15px 0;
      display: flex;
      align-items: start;
    }
    .benefit-icon {
      font-size: 24px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .benefit-content h4 {
      color: #8B4A6B;
      margin: 0 0 8px 0;
      font-size: 18px;
    }
    .benefit-content p {
      color: #666;
      margin: 0;
      line-height: 1.6;
    }
    .testimonial-box {
      background: linear-gradient(135deg, #F0E6FF 0%, #E6E6FA 100%);
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .testimonial-box p {
      font-style: italic;
      font-size: 18px;
      color: #4B0082;
      margin-bottom: 15px;
      line-height: 1.7;
    }
    .testimonial-box cite {
      display: block;
      color: #6B3654;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
    }
    .stats-section {
      display: flex;
      justify-content: space-around;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .stat-item {
      text-align: center;
      padding: 15px;
      flex: 1;
      min-width: 150px;
    }
    .stat-number {
      font-size: 36px;
      color: #C06B93;
      font-weight: bold;
      display: block;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    .cta-section {
      background-color: #FFF0F5;
      padding: 35px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    .cta-section h3 {
      color: #8B4A6B;
      margin-top: 0;
      font-size: 24px;
    }
    .cta-section p {
      font-size: 16px;
      color: #666;
      margin: 15px 0 25px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 35px;
      background-color: #C06B93;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: #B05882;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(192, 107, 147, 0.3);
    }
    .gentle-reminder {
      background-color: #E6F3FF;
      padding: 20px;
      border-radius: 8px;
      margin-top: 25px;
      text-align: center;
      color: #2C5F8B;
    }
    .footer {
      background-color: #F8F8F8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #C06B93;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji-header">🤱💕</div>
      <h1>You're Not Alone, Mama</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear {{firstName}} 💜,
      </div>
      
      <p style="font-size: 16px; line-height: 1.7; color: #555;">
        Becoming a mother is supposed to be magical, right? But what if it feels more overwhelming 
        than wonderful? What if you're loving your baby but losing yourself? 
      </p>
      
      <p style="font-size: 16px; line-height: 1.7; color: #555;">
        <strong>I see you, and I want you to know - there's nothing wrong with you.</strong>
      </p>
      
      <div class="normalize-box">
        <h3>If you're feeling...</h3>
        <ul class="feeling-list">
          <li>😔 Overwhelmed despite "having it all"</li>
          <li>😟 Anxious about being a "good enough" mom</li>
          <li>😢 Disconnected from your pre-baby self</li>
          <li>😴 Exhausted beyond just "normal" tired</li>
          <li>💭 Guilty for not feeling constantly grateful</li>
        </ul>
        <div class="validation-text">
          You're not broken. You're not failing. You're human. 💕
        </div>
      </div>
      
      <div class="testimonial-box">
        <p>"I thought I was the only one who felt like crying at 3am while everyone 
        said I should be 'cherishing every moment.' Jana helped me see that I could 
        love my baby AND struggle. Both were true, and both were okay."</p>
        <cite>- Sarah M., mom of two</cite>
      </div>
      
      <h3 style="color: #8B4A6B; margin-top: 35px; font-size: 22px;">
        Our New Mom Support Program is Different 🌸
      </h3>
      
      <div class="benefit-card">
        <span class="benefit-icon">🫂</span>
        <div class="benefit-content">
          <h4>Zero Judgment, 100% Understanding</h4>
          <p>Share your real feelings - even the scary ones. This is a safe space where 
          "I love my baby but hate being a mom sometimes" is a valid feeling.</p>
        </div>
      </div>
      
      <div class="benefit-card">
        <span class="benefit-icon">🎯</span>
        <div class="benefit-content">
          <h4>Specialized Postpartum Expertise</h4>
          <p>Not generic therapy - specific support for maternal mental health, from baby 
          blues to postpartum anxiety and depression, using evidence-based approaches.</p>
        </div>
      </div>
      
      <div class="benefit-card">
        <span class="benefit-icon">⏰</span>
        <div class="benefit-content">
          <h4>Made for Real Mom Life</h4>
          <p>Flexible scheduling, virtual options, and strategies that work even when 
          you're running on 2 hours of sleep and dry shampoo.</p>
        </div>
      </div>
      
      <div class="benefit-card">
        <span class="benefit-icon">🌟</span>
        <div class="benefit-content">
          <h4>Find Yourself Again</h4>
          <p>Rediscover who you are beyond "mom" - because you still matter, your dreams 
          still count, and your identity didn't disappear with the positive pregnancy test.</p>
        </div>
      </div>
      
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-number">1 in 5</span>
          <span class="stat-label">moms experience postpartum mood disorders</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">94%</span>
          <span class="stat-label">of our moms feel "significantly better" after 6 sessions</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">100%</span>
          <span class="stat-label">judgment-free zone guaranteed</span>
        </div>
      </div>
      
      <div class="cta-section">
        <h3>Take the First Step (It's the Hardest One) 💪</h3>
        <p>Book a free 15-minute consultation. No pressure, no commitment - just a 
        conversation about how you're really doing and how we can help.</p>
        <a href="https://www.bloompsychologynorthaustin.com/new-mom-program" class="button">
          Yes, I Need Support 🌸
        </a>
      </div>
      
      <div class="gentle-reminder">
        <p><strong>Remember:</strong> Asking for help doesn't make you weak. It makes you 
        a mom who's modeling self-care, boundaries, and emotional health for her children. 
        That's pretty amazing. 💙</p>
      </div>
      
      <p style="margin-top: 30px; font-style: italic; color: #666;">
        P.S. Still on the fence? That's okay too. Save this email for when you're ready. 
        We'll be here, with tissues, tea, and zero judgment. Promise. 🤗
      </p>
      
      <p style="margin-top: 20px;">
        With warmth and understanding,<br>
        <strong style="color: #C06B93;">Dr. Jana Rundle</strong><br>
        <span style="font-size: 14px; color: #666;">Mom of two, survivor of postpartum anxiety, 
        believer in your strength</span>
      </p>
    </div>
    
    <div class="footer">
      <p>
        <a href="https://www.instagram.com/bloompsychology.atx/">Instagram</a> | 
        <a href="https://www.facebook.com/bloompsychology">Facebook</a> | 
        <a href="https://www.bloompsychologynorthaustin.com/blog">Blog</a>
      </p>
      <p style="font-size: 12px; margin-top: 20px;">
        If you're in crisis, please call the Postpartum Support International Helpline at 
        1-800-PPD-MOMS (1-800-773-6667)<br><br>
        © 2025 Bloom Psychology | North Austin, Texas<br>
        <a href="{{unsubscribeLink}}" style="color: #999;">Unsubscribe</a> | 
        <a href="https://www.bloompsychologynorthaustin.com/privacy-policy" style="color: #999;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  }
};

// Export function to update database templates
export async function updateDatabaseTemplates(supabase: any) {
  const updates = [
    {
      id: '95f25e78-90cb-439d-97c5-84be86f36993', // 5 Ways to Manage Daily Anxiety
      subject: redesignedDatabaseTemplates.anxietyTips.subject,
      content: redesignedDatabaseTemplates.anxietyTips.content,
      updated_at: new Date().toISOString()
    },
    {
      id: '76a35322-511c-46b0-9b2c-61834d2f9d9e', // New Mom Support Program
      subject: redesignedDatabaseTemplates.newMomProgram.subject,
      content: redesignedDatabaseTemplates.newMomProgram.content,
      updated_at: new Date().toISOString()
    }
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('email_templates')
      .update({
        subject: update.subject,
        content: update.content,
        updated_at: update.updated_at
      })
      .eq('id', update.id);

    if (error) {
      console.error(`Failed to update template ${update.id}:`, error);
    } else {
      console.log(`Successfully updated template ${update.id}`);
    }
  }
}