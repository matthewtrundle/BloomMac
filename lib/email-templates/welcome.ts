export const welcomeEmailTemplate = (firstName: string) => ({
  subject: "Welcome to Your Journey of Growth with Bloom Psychology 🌸",
  html: `
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Bloom Psychology</h1>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear ${firstName || 'Friend'},
            </div>
            
            <p>
              Thank you for joining our community! We're honored that you've taken this important step 
              in prioritizing your mental health and well-being. At Bloom Psychology, we believe every 
              woman deserves support, understanding, and the tools to thrive.
            </p>
            
            <div class="section">
              <h2>What You Can Expect From Us</h2>
              <ul class="tips-list">
                <li><strong>Monthly Insights:</strong> Evidence-based tips for managing anxiety, stress, and life transitions</li>
                <li><strong>Resource Spotlights:</strong> Helpful tools, exercises, and techniques you can use right away</li>
                <li><strong>Community Stories:</strong> Inspiring journeys from women just like you (anonymously shared)</li>
                <li><strong>Exclusive Content:</strong> First access to workshops, group sessions, and special offers</li>
              </ul>
            </div>
            
            <div class="resource-box">
              <h3>🎁 Your Welcome Gift</h3>
              <p>
                As a thank you for joining us, here's a free resource to get you started:
              </p>
              <p>
                <strong>"5 Grounding Techniques for Anxious Moments"</strong> - 
                Simple, science-backed exercises you can use anywhere, anytime.
              </p>
              <a href="https://www.bloompsychologynorthaustin.com/resources/grounding-techniques" class="button">
                Download Your Free Guide
              </a>
            </div>
            
            <div class="section">
              <h2>Quick Tips to Start Your Journey</h2>
              <ul class="tips-list">
                <li><strong>Be Patient with Yourself:</strong> Growth takes time, and every small step matters</li>
                <li><strong>Practice Self-Compassion:</strong> Treat yourself with the same kindness you'd show a friend</li>
                <li><strong>Stay Curious:</strong> Explore what works for you - everyone's journey is unique</li>
                <li><strong>Reach Out:</strong> Whether to us or someone you trust, connection is healing</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <div class="section" style="text-align: center;">
              <h2>Ready to Take the Next Step?</h2>
              <p>
                If you're considering therapy, we offer a free 15-minute consultation to see if we're 
                the right fit for your needs. No pressure, just a friendly conversation about how we can support you.
              </p>
              <a href="https://www.bloompsychologynorthaustin.com/book" class="button">
                Book Your Free Consultation
              </a>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>A Personal Note from Jana:</strong><br>
              "Thank you for trusting us with your inbox and, more importantly, with being part of your 
              wellness journey. Remember, seeking support is a sign of strength, not weakness. You're 
              already taking steps toward the life you deserve. We're here whenever you're ready."
            </p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="#">Facebook</a> | 
              <a href="#">Instagram</a> | 
              <a href="#">LinkedIn</a>
            </div>
            
            <p>
              Bloom Psychology<br>
              North Austin, Texas<br>
              <a href="mailto:jana@bloompsychologynorthaustin.com" style="color: #C06B93;">
                jana@bloompsychologynorthaustin.com
              </a>
            </p>
            
            <p style="font-size: 12px; margin-top: 20px;">
              You're receiving this email because you signed up for our newsletter at bloompsychologynorthaustin.com. 
              We respect your privacy and will never share your information.
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
  `,
  text: `
Welcome to Bloom Psychology!

Dear ${firstName || 'Friend'},

Thank you for joining our community! We're honored that you've taken this important step in prioritizing your mental health and well-being. At Bloom Psychology, we believe every woman deserves support, understanding, and the tools to thrive.

What You Can Expect From Us:
- Weekly Insights: Evidence-based tips for managing anxiety, stress, and life transitions
- Resource Spotlights: Helpful tools, exercises, and techniques you can use right away
- Community Stories: Inspiring journeys from women just like you (anonymously shared)
- Exclusive Content: First access to workshops, group sessions, and special offers

🎁 Your Welcome Gift
As a thank you for joining us, here's a free resource to get you started:
"5 Grounding Techniques for Anxious Moments" - Simple, science-backed exercises you can use anywhere, anytime.
Download at: https://www.bloompsychologynorthaustin.com/resources/grounding-techniques

Quick Tips to Start Your Journey:
- Be Patient with Yourself: Growth takes time, and every small step matters
- Practice Self-Compassion: Treat yourself with the same kindness you'd show a friend
- Stay Curious: Explore what works for you - everyone's journey is unique
- Reach Out: Whether to us or someone you trust, connection is healing

Ready to Take the Next Step?
If you're considering therapy, we offer a free 15-minute consultation to see if we're the right fit for your needs. No pressure, just a friendly conversation about how we can support you.
Book at: https://www.bloompsychologynorthaustin.com/book

A Personal Note from Jana:
"Thank you for trusting us with your inbox and, more importantly, with being part of your wellness journey. Remember, seeking support is a sign of strength, not weakness. You're already taking steps toward the life you deserve. We're here whenever you're ready."

Best wishes,
The Bloom Psychology Team

---
Bloom Psychology
North Austin, Texas
jana@bloompsychologynorthaustin.com

You're receiving this email because you signed up for our newsletter at bloompsychologynorthaustin.com.
Unsubscribe: https://www.bloompsychologynorthaustin.com/unsubscribe
Privacy Policy: https://www.bloompsychologynorthaustin.com/privacy-policy
  `
});