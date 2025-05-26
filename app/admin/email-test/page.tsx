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
  const [selectedTest, setSelectedTest] = useState('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const emailTests = [
    { id: 'welcome', name: 'Welcome Email', description: 'Newsletter signup welcome email' },
    { id: 'contact', name: 'Contact Form', description: 'Contact form submission notification' },
    { id: 'newsletter', name: 'Newsletter', description: 'Sample newsletter content' },
    { id: 'appointment', name: 'Appointment Reminder', description: 'Appointment reminder email' },
  ];

  const runEmailTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      addResult('error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          type: selectedTest,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addResult('success', `${selectedTest} email sent successfully to ${testEmail}`);
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
          <CardTitle>Email Preview Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>Available email templates for testing:</p>
            <ul>
              <li><strong>Welcome Email:</strong> Sent to new newsletter subscribers with grounding techniques guide</li>
              <li><strong>Contact Form:</strong> Notification sent when someone submits the contact form</li>
              <li><strong>Newsletter:</strong> Sample newsletter content (coming soon)</li>
              <li><strong>Appointment Reminder:</strong> Reminder sent before appointments (coming soon)</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Note: Test emails will be sent from <code>noreply@bloompsychologynorthaustin.com</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}