// Course-related email templates

export const courseEmailTemplates = {
  // Course purchase confirmation
  coursePurchaseConfirmation: {
    subject: 'Welcome to {{courseName}}! 🎉',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Course</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); }
    .logo { width: 150px; margin-bottom: 20px; }
    .content { padding: 30px; background: white; }
    .button { display: inline-block; padding: 12px 30px; background: #c63780; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
    .course-info { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #c63780; margin: 0;">Welcome to Your Journey!</h1>
    </div>
    
    <div class="content">
      <p>Hi {{firstName}},</p>
      
      <p><strong>Congratulations on taking this important step!</strong> 🌸</p>
      
      <p>You're now enrolled in <strong>{{courseName}}</strong>, and I'm so excited to support you on this journey.</p>
      
      <div class="course-info">
        <h3 style="margin-top: 0;">What happens next?</h3>
        <ul>
          <li><strong>Access your course:</strong> You can start learning immediately by clicking the button below</li>
          <li><strong>Join the community:</strong> Connect with other moms in our private Facebook group</li>
          <li><strong>Weekly emails:</strong> You'll receive guidance and reminders as you progress</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="{{courseUrl}}" class="button">Start Your Course</a>
      </div>
      
      <h3>Your login details:</h3>
      <p>
        <strong>Email:</strong> {{email}}<br>
        <strong>Password:</strong> {{password}}
      </p>
      
      <p><em>Pro tip:</em> Bookmark the course page and save these login details somewhere safe!</p>
      
      <h3>Need help?</h3>
      <p>I'm here for you! If you have any questions or need support, just reply to this email.</p>
      
      <p>Remember, this is YOUR journey. Take it at your own pace, be kind to yourself, and celebrate every small win.</p>
      
      <p>With warmth and support,<br>
      Dr. Jana Rundle</p>
    </div>
    
    <div class="footer">
      <p>Bloom Psychology | Austin, TX<br>
      <a href="{{unsubscribeUrl}}" style="color: #c63780;">Manage email preferences</a></p>
    </div>
  </div>
</body>
</html>
    `
  },

  // Course week 1 kickoff
  courseWeek1: {
    subject: 'Week 1: Let's Begin Your {{courseName}} Journey 🌱',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #fce4ec; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { padding: 30px; background: white; }
    .week-overview { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .tip-box { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #c63780; color: white; text-decoration: none; border-radius: 25px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #c63780; margin: 0;">Week 1: Understanding Your Experience</h1>
    </div>
    
    <div class="content">
      <p>Hi {{firstName}},</p>
      
      <p>Welcome to Week 1! I'm so proud of you for starting this journey. 💕</p>
      
      <div class="week-overview">
        <h3 style="margin-top: 0;">This week we'll explore:</h3>
        <ul>
          <li>The reality of postpartum emotions</li>
          <li>Differentiating baby blues, anxiety, and depression</li>
          <li>Creating your emotional baseline</li>
          <li>Building your support network map</li>
        </ul>
      </div>
      
      <div class="tip-box">
        <strong>🌟 Week 1 Success Tip:</strong><br>
        Set aside just 15 minutes each day for your course work. Even small steps count! Many moms find naptime or after bedtime works best.
      </div>
      
      <h3>Your action items for this week:</h3>
      <ol>
        <li>Watch the Week 1 introduction video (10 minutes)</li>
        <li>Complete your emotional baseline assessment</li>
        <li>Start mapping your support network</li>
        <li>Join our private Facebook group and introduce yourself</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{courseUrl}}/week-1" class="button">Go to Week 1 Lessons</a>
      </div>
      
      <p><strong>Remember:</strong> There's no "behind" in this course. If you need to take breaks or spread the content over more time, that's perfectly okay. This is about progress, not perfection.</p>
      
      <p>You've got this, mama! I'm cheering you on.</p>
      
      <p>With support,<br>
      Dr. Jana</p>
    </div>
  </div>
</body>
</html>
    `
  },

  // Course midpoint check-in
  courseMidpoint: {
    subject: 'How are you doing, {{firstName}}? 💭',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { padding: 30px; background: white; }
    .progress-box { background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .reflection-questions { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #c63780; color: white; text-decoration: none; border-radius: 25px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi {{firstName}},</p>
      
      <p>Can you believe you're halfway through {{courseName}}? 🎉</p>
      
      <p>I wanted to check in and see how you're doing. By now, you've covered some significant ground, and I'm curious about your experience.</p>
      
      <div class="progress-box">
        <h3 style="margin-top: 0;">🌱 Celebrate Your Progress!</h3>
        <p>You've already learned:</p>
        <ul>
          <li>How to identify and understand your emotions</li>
          <li>Techniques for managing overwhelming feelings</li>
          <li>Ways to prioritize self-care (even in small doses)</li>
        </ul>
        <p><strong>That's huge!</strong> Give yourself credit for showing up.</p>
      </div>
      
      <div class="reflection-questions">
        <h3 style="margin-top: 0;">Quick Reflection:</h3>
        <p>Take a moment to consider:</p>
        <ul>
          <li>What's been the most helpful lesson so far?</li>
          <li>Have you noticed any small shifts in how you feel?</li>
          <li>What's been challenging?</li>
        </ul>
        <p><em>Hit reply and share if you'd like - I read every email!</em></p>
      </div>
      
      <h3>Need extra support?</h3>
      <p>Remember, the course is self-paced, but you're not alone. Here are your support options:</p>
      <ul>
        <li>Post in our Facebook group for peer support</li>
        <li>Attend our monthly live Q&A (next one: {{nextQADate}})</li>
        <li>Consider booking a 1-on-1 session for personalized guidance</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{courseUrl}}" class="button">Continue Your Course</a>
      </div>
      
      <p>Keep going, {{firstName}}. The second half of the course builds beautifully on what you've already learned. You're doing important work!</p>
      
      <p>Cheering you on,<br>
      Dr. Jana</p>
    </div>
  </div>
</body>
</html>
    `
  },

  // Course completion
  courseCompletion: {
    subject: '🎊 You Did It, {{firstName}}! Certificate Inside',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .celebration-header { background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); padding: 40px; text-align: center; border-radius: 10px; }
    .content { padding: 30px; background: white; }
    .achievement-box { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
    .next-steps { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #c63780; color: white; text-decoration: none; border-radius: 25px; margin: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="celebration-header">
      <h1 style="color: #c63780; margin: 0; font-size: 32px;">Congratulations, {{firstName}}! 🎉</h1>
      <p style="font-size: 18px; margin-top: 10px;">You've completed {{courseName}}</p>
    </div>
    
    <div class="content">
      <p>Wow, {{firstName}}!</p>
      
      <p>I am SO incredibly proud of you! Completing this course while managing all the demands of motherhood is no small feat. You've shown dedication, courage, and commitment to your wellbeing.</p>
      
      <div class="achievement-box">
        <h2 style="color: #c63780;">🏆 Your Achievement</h2>
        <p>You've successfully completed all modules and lessons in {{courseName}}!</p>
        <a href="{{certificateUrl}}" class="button">Download Your Certificate</a>
      </div>
      
      <h3>Look how far you've come:</h3>
      <ul>
        <li>You understand your postpartum experience with clarity and compassion</li>
        <li>You have a toolkit of coping strategies that actually work</li>
        <li>You've prioritized your mental health (and that's HUGE!)</li>
        <li>You're modeling self-care for your little one</li>
      </ul>
      
      <div class="next-steps">
        <h3 style="margin-top: 0;">What's Next?</h3>
        <p>Your journey doesn't end here! Here are some ways to continue growing:</p>
        <ul>
          <li><strong>Stay connected:</strong> Remain active in our Facebook community</li>
          <li><strong>Practice daily:</strong> Keep using the techniques you've learned</li>
          <li><strong>Monthly check-ins:</strong> Join our graduate Q&A sessions</li>
          <li><strong>Deeper work:</strong> Consider 1-on-1 therapy for personalized support</li>
        </ul>
      </div>
      
      <h3>A special graduate offer:</h3>
      <p>As a course graduate, you receive <strong>20% off your first therapy session</strong>. Use code: <strong>BLOOM20</strong></p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{bookingUrl}}" class="button">Book a Session</a>
        <a href="{{courseUrl}}" class="button" style="background: #666;">Review Course Materials</a>
      </div>
      
      <p>Remember, all your course materials remain available to you forever. Revisit them whenever you need a refresher or encouragement.</p>
      
      <p>Thank you for trusting me with your journey. It's been an honor to guide you.</p>
      
      <p>With deep admiration and continued support,<br>
      Dr. Jana Rundle</p>
      
      <p>P.S. I'd love to hear about your experience! If you have a moment, please share your story. Your words might be exactly what another mom needs to hear. 💕</p>
    </div>
  </div>
</body>
</html>
    `
  },

  // Course abandonment recovery (sent after 2 weeks of inactivity)
  courseRecovery: {
    subject: 'Missing you in {{courseName}}, {{firstName}} 💭',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { padding: 30px; background: white; }
    .empathy-box { background: #fce4ec; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .options-box { background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #c63780; color: white; text-decoration: none; border-radius: 25px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi {{firstName}},</p>
      
      <p>I noticed you haven't logged into {{courseName}} for a little while, and I wanted to check in. 💕</p>
      
      <div class="empathy-box">
        <p><strong>First, let me say: there's no judgment here.</strong></p>
        <p>Life with little ones is unpredictable. Some days just getting everyone fed and relatively clean is a victory! If the course has taken a backseat, that's completely understandable.</p>
      </div>
      
      <p>I wanted to remind you that:</p>
      <ul>
        <li>Your course access never expires</li>
        <li>There's no "behind" - you set the pace</li>
        <li>Even 5 minutes of learning counts</li>
        <li>You can restart or continue anytime</li>
      </ul>
      
      <div class="options-box">
        <h3 style="margin-top: 0;">Would it help if you could:</h3>
        <ul>
          <li>Start fresh from where you left off?</li>
          <li>Get a quick recap of what you've learned?</li>
          <li>Join a "restart buddy" group with other moms?</li>
          <li>Have a brief call to discuss what's blocking you?</li>
        </ul>
        <p><em>Just reply and let me know - I'm here to support you!</em></p>
      </div>
      
      <p>Remember why you started this journey. That mom who signed up? She deserves this support, even if she can only manage tiny steps.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{courseUrl}}" class="button">Jump Back In</a>
      </div>
      
      <p>Whether you continue today, next week, or next month - your course will be waiting for you. And so will I.</p>
      
      <p>No pressure, just support,<br>
      Dr. Jana</p>
      
      <p>P.S. If you're struggling beyond what the course can address, I'm also available for one-on-one sessions. Sometimes we need that extra personalized support, and that's okay too.</p>
    </div>
  </div>
</body>
</html>
    `
  }
};

export const courseEmailSequences = [
  {
    id: 'course-participant',
    name: 'Course Participant Journey',
    trigger: 'course_purchase',
    emails: [
      {
        template: 'coursePurchaseConfirmation',
        delayDays: 0,
        delayHours: 0
      },
      {
        template: 'courseWeek1',
        delayDays: 1,
        delayHours: 0
      },
      {
        template: 'courseMidpoint',
        delayDays: 21,
        delayHours: 0
      },
      {
        template: 'courseCompletion',
        trigger: 'course_completed',
        delayDays: 0,
        delayHours: 0
      }
    ]
  },
  {
    id: 'course-recovery',
    name: 'Course Recovery Sequence',
    trigger: 'course_inactive_14_days',
    emails: [
      {
        template: 'courseRecovery',
        delayDays: 0,
        delayHours: 0
      }
    ]
  }
];