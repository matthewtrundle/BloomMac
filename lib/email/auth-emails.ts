import { Resend } from 'resend';

// Lazy-load Resend client to avoid initialization errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[auth-emails] RESEND_API_KEY not found in environment');
      return null;
    }
    try {
      resend = new Resend(process.env.RESEND_API_KEY);
    } catch (error) {
      console.error('[auth-emails] Error initializing Resend:', error);
      return null;
    }
  }
  return resend;
}

export const emailTemplates = {
  welcomeAfterPurchase: (customerName: string, courseName: string, loginLink: string) => ({
    subject: `Welcome to ${courseName} - Your Access is Ready! 🌸`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Course</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #F8B4D9; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: 300;">Welcome to Bloom Psychology</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333333; font-size: 24px; margin-bottom: 20px;">
        Hi ${customerName || 'there'},
      </h2>
      
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        Thank you for enrolling in <strong>${courseName}</strong>! We're so excited to support you on this journey.
      </p>
      
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        Your course access is ready. Click the button below to access your course materials:
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${loginLink}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">
          Access Your Course
        </a>
      </div>
      
      <div style="background-color: #FFF8F3; border-left: 4px solid #F8B4D9; padding: 20px; margin: 30px 0;">
        <h3 style="color: #333333; font-size: 18px; margin-top: 0;">What's Next?</h3>
        <ul style="color: #555555; font-size: 14px; line-height: 22px; margin: 10px 0; padding-left: 20px;">
          <li>Click the button above to set up your account (if you haven't already)</li>
          <li>Browse through the course materials at your own pace</li>
          <li>Download the workbooks and resources</li>
          <li>Reach out if you need any support</li>
        </ul>
      </div>
      
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        Remember, this is your journey, and we're here to support you every step of the way.
      </p>
      
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        With warmth and support,<br>
        <strong>Dr. Jana Rundle & The Bloom Team</strong>
      </p>
      
      <!-- Support Section -->
      <div style="border-top: 1px solid #eeeeee; padding-top: 30px; margin-top: 40px;">
        <p style="color: #888888; font-size: 14px; line-height: 20px; text-align: center;">
          Need help? Reply to this email or contact us at 
          <a href="mailto:support@bloompsychologynorthaustin.com" style="color: #F8B4D9;">support@bloompsychologynorthaustin.com</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f7f7f7; padding: 30px; text-align: center;">
      <p style="color: #888888; font-size: 12px; line-height: 18px; margin: 0;">
        © ${new Date().getFullYear()} Bloom Psychology. All rights reserved.<br>
        You're receiving this email because you purchased a course from Bloom Psychology.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Welcome to ${courseName}!

Hi ${customerName || 'there'},

Thank you for enrolling in ${courseName}! We're so excited to support you on this journey.

Your course access is ready. Visit the link below to access your course materials:
${loginLink}

What's Next?
- Click the link above to set up your account (if you haven't already)
- Browse through the course materials at your own pace
- Download the workbooks and resources
- Reach out if you need any support

Remember, this is your journey, and we're here to support you every step of the way.

With warmth and support,
Dr. Jana Rundle & The Bloom Team

Need help? Reply to this email or contact us at support@bloompsychologynorthaustin.com

© ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
    `
  }),

  magicLink: (loginLink: string) => ({
    subject: 'Your Bloom Psychology Login Link 🌸',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Login Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #F8B4D9; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: 300;">Your Login Link</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        Click the button below to log in to your Bloom Psychology account:
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${loginLink}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">
          Log In to Your Account
        </a>
      </div>
      
      <p style="color: #888888; font-size: 14px; line-height: 20px; text-align: center; margin-top: 30px;">
        This link will expire in 1 hour for security reasons.<br>
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f7f7f7; padding: 30px; text-align: center;">
      <p style="color: #888888; font-size: 12px; line-height: 18px; margin: 0;">
        © ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Your Login Link for Bloom Psychology

Click the link below to log in to your account:
${loginLink}

This link will expire in 1 hour for security reasons.
If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
    `
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your Bloom Psychology Password 🌸',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #F8B4D9; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: 300;">Reset Your Password</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        We received a request to reset your password. Click the button below to create a new password:
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #888888; font-size: 14px; line-height: 20px; text-align: center; margin-top: 30px;">
        This link will expire in 1 hour for security reasons.<br>
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f7f7f7; padding: 30px; text-align: center;">
      <p style="color: #888888; font-size: 12px; line-height: 18px; margin: 0;">
        © ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Reset Your Password

We received a request to reset your password. Click the link below to create a new password:
${resetLink}

This link will expire in 1 hour for security reasons.
If you didn't request a password reset, you can safely ignore this email.

© ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
    `
  }),

  emailVerification: (verifyLink: string) => ({
    subject: 'Verify Your Email - Bloom Psychology 🌸',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #F8B4D9; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: 300;">Welcome to Bloom Psychology</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        Thank you for creating an account! Please verify your email address by clicking the button below:
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${verifyLink}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">
          Verify Email Address
        </a>
      </div>
      
      <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        Once verified, you'll have full access to your account and any courses you've purchased.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f7f7f7; padding: 30px; text-align: center;">
      <p style="color: #888888; font-size: 12px; line-height: 18px; margin: 0;">
        © ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Welcome to Bloom Psychology!

Thank you for creating an account! Please verify your email address by clicking the link below:
${verifyLink}

Once verified, you'll have full access to your account and any courses you've purchased.

© ${new Date().getFullYear()} Bloom Psychology. All rights reserved.
    `
  })
};

// Email sending functions
export async function sendWelcomeEmail(to: string, customerName: string, courseName: string, loginLink: string) {
  console.log('[sendWelcomeEmail] Called with:', { to, customerName, courseName, loginLink: loginLink ? 'provided' : 'missing' });
  
  if (!to) {
    throw new Error('Email recipient (to) is required');
  }
  
  const template = emailTemplates.welcomeAfterPurchase(customerName, courseName, loginLink);
  
  try {
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await client.emails.send({
      from: 'Bloom Psychology <courses@bloompsychologynorthaustin.com>',
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendMagicLinkEmail(to: string, loginLink: string) {
  const template = emailTemplates.magicLink(loginLink);
  
  try {
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await client.emails.send({
      from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Error sending magic link email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send magic link email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const template = emailTemplates.passwordReset(resetLink);
  
  try {
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await client.emails.send({
      from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

export async function sendEmailVerification(to: string, verifyLink: string) {
  const template = emailTemplates.emailVerification(verifyLink);
  
  try {
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await client.emails.send({
      from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}