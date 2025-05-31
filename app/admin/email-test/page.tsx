'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  type: 'success' | 'error';
  message: string;
  timestamp: string;
}

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState('');
  const [selectedTest, setSelectedTest] = useState('newsletter-welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const emailTests = [
    // Newsletter sequence
    { id: 'newsletter-welcome', sequence: 'newsletter', step: 'welcome', name: '🌸 Newsletter Welcome', description: 'Enhanced welcome email with Bloom themes' },
    { id: 'newsletter-day3', sequence: 'newsletter', step: 'day3', name: '🌟 3-Day Quick Wins', description: 'Day 3 follow-up with practical tips' },
    { id: 'newsletter-day7', sequence: 'newsletter', step: 'day7', name: '🤗 Week 1 Check-In', description: 'Week 1 normalization email' },
    { id: 'newsletter-day14', sequence: 'newsletter', step: 'day14', name: '💅 Self-Care Reminder', description: '2-week self-care motivation' },
    { id: 'newsletter-day30', sequence: 'newsletter', step: 'day30', name: '💭 Month Check-In', description: '30-day reflection and offer' },
    
    // Contact follow-up sequence
    { id: 'contact-immediate', sequence: 'contactFollowup', step: 'immediate', name: '📧 Contact Confirmation', description: 'Immediate contact form response' },
    { id: 'contact-followup', sequence: 'contactFollowup', step: 'followup72', name: '🤗 Gentle Follow-Up', description: '72-hour follow-up email' },
    { id: 'contact-resources', sequence: 'contactFollowup', step: 'resources7', name: '🎁 Free Resources', description: '7-day resource sharing email' },
    
    // Booking confirmation sequence
    { id: 'booking-confirm', sequence: 'bookingConfirmation', step: 'confirmation', name: '🎉 Booking Confirmed', description: 'Appointment confirmation email' },
    { id: 'booking-reminder', sequence: 'bookingConfirmation', step: 'reminder24', name: '⏰ Tomorrow Reminder', description: '24-hour appointment reminder' },
    { id: 'booking-followup', sequence: 'bookingConfirmation', step: 'followup48', name: '💜 Post-Session Follow-Up', description: '48-hour consultation follow-up' },
    
    // Lead nurture sequence
    { id: 'nurture-thanks', sequence: 'leadNurture', step: 'thankYou', name: '📬 Resource Download', description: 'Thank you for downloading resource' },
    { id: 'nurture-helpful', sequence: 'leadNurture', step: 'helpful72', name: '🤔 Resource Check-In', description: '3-day resource usage follow-up' },
    { id: 'nurture-story', sequence: 'leadNurture', step: 'successStory7', name: '🌟 Success Story', description: '7-day inspiring client story' },
    { id: 'nurture-ready', sequence: 'leadNurture', step: 'readyWhen14', name: '⏰ No Rush Message', description: '14-day gentle nurture email' },
    
    // Legacy options for backward compatibility
    { id: 'welcome', name: 'Legacy Welcome', description: 'Original welcome email (deprecated)' },
    { id: 'contact', name: 'Legacy Contact', description: 'Original contact notification (deprecated)' },
    { id: 'newsletter', name: 'Legacy Newsletter', description: 'Sample newsletter content' },
    { id: 'appointment', name: 'Legacy Appointment', description: 'Appointment reminder email' },
  ];

  const runEmailTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      addResult('error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedEmailTest = emailTests.find(test => test.id === selectedTest);
      
      const requestBody: any = {
        to: testEmail,
        type: selectedTest,
      };

      // Add sequence and step for enhanced templates
      if (selectedEmailTest?.sequence && selectedEmailTest?.step) {
        requestBody.sequence = selectedEmailTest.sequence;
        requestBody.step = selectedEmailTest.step;
      }

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        const testName = selectedEmailTest?.name || selectedTest;
        addResult('success', `${testName} email sent successfully to ${testEmail}`);
      } else {
        addResult('error', data.error || 'Failed to send test email');
      }
    } catch (error) {
      addResult('error', 'Network error: Could not send test email');
    } finally {
      setIsLoading(false);
    }
  };

  const addResult = (type: 'success' | 'error', message: string) => {
    setTestResults(prev => [{
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 10)); // Keep last 10 results
  };

  const checkResendConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.configured) {
        addResult('success', 'Resend API is properly configured');
      } else {
        addResult('error', 'Resend API key is not configured. Please add RESEND_API_KEY to your environment variables.');
      }
    } catch (error) {
      addResult('error', 'Could not check Resend configuration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Testing</h1>
        <p className="text-gray-600 mt-2">Test email functionality and verify Resend configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Check */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Check if Resend API is properly configured with valid API key.
            </p>
            <Button
              onClick={checkResendConfig}
              disabled={isLoading}
              variant="secondary"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Resend Configuration'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Send Test Email */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Test Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-bloom-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <div className="space-y-2">
                  {emailTests.map((test) => (
                    <label
                      key={test.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="radio"
                        name="emailTest"
                        value={test.id}
                        checked={selectedTest === test.id}
                        onChange={(e) => setSelectedTest(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{test.name}</div>
                        <div className="text-sm text-gray-600">{test.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={runEmailTest}
                disabled={isLoading || !testEmail}
                variant="primary"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    result.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {result.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      result.type === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {result.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Enhanced Email Template Library 🌸</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>All email templates have been enhanced with Bloom themes, emojis, and psychological best practices:</p>
            
            <h4 className="font-semibold mt-4 text-bloompink">Newsletter Sequence (5 emails):</h4>
            <ul className="ml-4">
              <li><strong>Welcome:</strong> Warm, encouraging introduction with free gift 🎁</li>
              <li><strong>Day 3:</strong> Practical quick-win strategies for immediate relief 🌟</li>
              <li><strong>Day 7:</strong> Normalization and "you're not alone" messaging 🤗</li>
              <li><strong>Day 14:</strong> Self-care permission and myth-busting 💅</li>
              <li><strong>Day 30:</strong> Gentle check-in with special offer 💭</li>
            </ul>
            
            <h4 className="font-semibold mt-4 text-bloompink">Contact Follow-up Sequence (3 emails):</h4>
            <ul className="ml-4">
              <li><strong>Immediate:</strong> Professional, reassuring confirmation 📧</li>
              <li><strong>72-hour:</strong> Gentle follow-up without pressure 🤗</li>
              <li><strong>7-day:</strong> Valuable free resources and support 🎁</li>
            </ul>
            
            <h4 className="font-semibold mt-4 text-bloompink">Booking Confirmation Sequence (3 emails):</h4>
            <ul className="ml-4">
              <li><strong>Confirmation:</strong> Excited, helpful appointment details 🎉</li>
              <li><strong>24-hour Reminder:</strong> Friendly prep tips and reminders ⏰</li>
              <li><strong>48-hour Follow-up:</strong> Feedback request and next steps 💜</li>
            </ul>
            
            <h4 className="font-semibold mt-4 text-bloompink">Lead Nurture Sequence (4 emails):</h4>
            <ul className="ml-4">
              <li><strong>Download Thanks:</strong> Resource delivery with bonus tips 📬</li>
              <li><strong>3-day Check:</strong> Usage tips and encouragement 🤔</li>
              <li><strong>7-day Story:</strong> Inspiring client success story 🌟</li>
              <li><strong>14-day Patience:</strong> Timeline respect and ongoing support ⏰</li>
            </ul>
            
            <div className="bg-pink-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700 font-medium">✨ All templates feature:</p>
              <ul className="text-sm text-gray-600 ml-4 mt-2">
                <li>• Warm, authentic Bloom Psychology voice</li>
                <li>• Strategic emoji usage for joy and engagement</li>
                <li>• Psychological principles (social proof, urgency, belonging)</li>
                <li>• Mobile-responsive design with brand colors</li>
                <li>• Clear calls-to-action and next steps</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              Test emails sent from: <code>jana@bloompsychologynorthaustin.com</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}