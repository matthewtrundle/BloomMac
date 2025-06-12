'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, CheckCircle, AlertCircle, Info } from 'lucide-react';

type EmailType = 'magic_link' | 'password_reset' | 'welcome_course' | 'test_smtp';

export default function AuthEmailTestPage() {
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState<EmailType>('magic_link');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      switch (emailType) {
        case 'magic_link':
          const { error: magicError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            }
          });
          
          if (magicError) throw magicError;
          
          setResult({
            success: true,
            message: 'Magic link email sent! Check your inbox.'
          });
          break;

        case 'password_reset':
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });
          
          if (resetError) throw resetError;
          
          setResult({
            success: true,
            message: 'Password reset email sent! Check your inbox.'
          });
          break;

        case 'welcome_course':
          const response = await fetch('/api/auth/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              customerName: 'Test User',
              courseName: 'Test Course - Postpartum Wellness',
              userId: 'test-user-id'
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Failed to send welcome email');
          }

          setResult({
            success: true,
            message: 'Welcome email sent! Check your inbox.'
          });
          break;

        case 'test_smtp':
          // This would test SMTP directly if configured
          setResult({
            success: false,
            message: 'Direct SMTP test not implemented. Use other email types to test.'
          });
          break;
      }
    } catch (error) {
      console.error('Email test error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Email Testing</h1>
          <p className="text-gray-600 mt-2">Test Supabase Auth and custom authentication emails</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Test Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Test Email</h2>
            
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="test@example.com"
                  required
                />
              </div>

              {/* Email Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="magic_link"
                      checked={emailType === 'magic_link'}
                      onChange={(e) => setEmailType(e.target.value as EmailType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Magic Link</div>
                      <div className="text-sm text-gray-600">Passwordless login via Supabase Auth</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="password_reset"
                      checked={emailType === 'password_reset'}
                      onChange={(e) => setEmailType(e.target.value as EmailType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Password Reset</div>
                      <div className="text-sm text-gray-600">Reset password via Supabase Auth</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="welcome_course"
                      checked={emailType === 'welcome_course'}
                      onChange={(e) => setEmailType(e.target.value as EmailType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Welcome Course Email</div>
                      <div className="text-sm text-gray-600">Custom email after course purchase</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={sendTestEmail}
                disabled={!email || loading}
                className="w-full bg-bloompink text-white py-3 px-6 rounded-lg font-medium hover:bg-bloom-pink-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Test Email
                  </>
                )}
              </button>

              {/* Result */}
              {result && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{result.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Status */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="font-medium">Supabase Connection</div>
                  <div className="text-sm text-gray-600">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${process.env.RESEND_API_KEY ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <div className="font-medium">Email Provider (Resend)</div>
                  <div className="text-sm text-gray-600">
                    {process.env.RESEND_API_KEY ? 'Configured for custom emails' : 'Using Supabase default SMTP'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Email Types:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Magic Link & Password Reset:</strong> Sent by Supabase Auth</li>
                    <li><strong>Welcome Course:</strong> Custom email via Resend API</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Setup Guide */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Setup Guide</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Add <code className="bg-blue-100 px-1 rounded">RESEND_API_KEY</code> to environment</li>
                <li>Configure SMTP in Supabase Dashboard → Auth → SMTP Settings</li>
                <li>Customize email templates in Supabase Dashboard</li>
                <li>Add redirect URLs in URL Configuration</li>
                <li>Test each email type above</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Detailed Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Supabase Email Configuration</h2>
          
          <div className="prose prose-sm max-w-none">
            <h3>1. Configure Custom SMTP (Recommended)</h3>
            <p>In your Supabase Dashboard → Settings → Auth → SMTP Settings:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`Host: smtp.resend.com
Port: 465
Username: resend
Password: [Your RESEND_API_KEY]
Sender email: noreply@bloompsychologynorthaustin.com
Sender name: Bloom Psychology`}
            </pre>

            <h3>2. Customize Email Templates</h3>
            <p>In Supabase Dashboard → Authentication → Email Templates, update each template with your branding.</p>

            <h3>3. Configure Redirect URLs</h3>
            <p>In Auth → URL Configuration:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`Site URL: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bloompsychologynorthaustin.com'}
Redirect URLs:
- ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bloompsychologynorthaustin.com'}/auth/callback
- ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bloompsychologynorthaustin.com'}/my-courses
- ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bloompsychologynorthaustin.com'}/auth/reset-password`}
            </pre>

            <h3>4. Environment Variables</h3>
            <p>Ensure these are set in your <code>.env.local</code>:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bloompsychologynorthaustin.com'}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}