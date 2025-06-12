// This file handles the configuration for Supabase Auth emails
// Supabase will handle sending these automatically when configured with custom SMTP

export const supabaseEmailConfig = {
  // Email sender configuration (set in Supabase Dashboard)
  sender: {
    email: 'noreply@bloompsychologynorthaustin.com',
    name: 'Bloom Psychology'
  },

  // Email subjects (customize in Supabase Dashboard)
  subjects: {
    confirmation: 'Verify your email - Bloom Psychology 🌸',
    recovery: 'Reset your password - Bloom Psychology 🌸',
    magicLink: 'Your login link - Bloom Psychology 🌸',
    invite: 'You have been invited to Bloom Psychology 🌸',
    emailChange: 'Confirm your email change - Bloom Psychology 🌸'
  },

  // Redirect URLs after email actions
  redirects: {
    // After email confirmation
    emailConfirmation: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com'}/auth/callback?type=signup`,
    
    // After password reset
    passwordRecovery: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com'}/auth/reset-password`,
    
    // After magic link login
    magicLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com'}/auth/callback?type=magiclink`,
    
    // After email change confirmation
    emailChange: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com'}/auth/callback?type=email_change`
  },

  // Custom email templates (HTML)
  // These would be set in Supabase Dashboard under Auth > Email Templates
  templates: {
    confirmation: `
<h2>Welcome to Bloom Psychology!</h2>
<p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">Confirm Email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
`,

    recovery: `
<h2>Reset Your Password</h2>
<p>We received a request to reset your password. Click the button below to create a new password:</p>
<p><a href="{{ .RecoveryURL }}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">Reset Password</a></p>
<p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
`,

    magicLink: `
<h2>Your Login Link</h2>
<p>Click the button below to log in to your Bloom Psychology account:</p>
<p><a href="{{ .MagicLink }}" style="display: inline-block; background-color: #F8B4D9; color: #333333; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: 500; border-radius: 25px;">Log In</a></p>
<p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
`
  }
};

// Helper to check if email is configured
export function isEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY || 
    process.env.SENDGRID_API_KEY ||
    process.env.SMTP_HOST
  );
}

// Instructions for manual configuration in Supabase Dashboard
export const SUPABASE_EMAIL_SETUP_INSTRUCTIONS = `
To complete email setup:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Email Templates
3. Update each template with the HTML from supabaseEmailConfig.templates
4. Go to Settings > Auth
5. Configure Custom SMTP with your email provider credentials
6. Update the Sender email and name
7. Save changes and test each email type
`;