'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  steps: {
    step: number;
    subject: string;
    delay_hours: number;
    active: boolean;
  }[];
}

const defaultSequences: EmailSequence[] = [
  {
    id: 'contact_followup',
    name: 'Contact Form Follow-up',
    description: 'Automated sequence for contact form submissions',
    steps: [
      { step: 1, subject: 'Thank you for reaching out', delay_hours: 0, active: true },
      { step: 2, subject: 'Following up on your consultation request', delay_hours: 72, active: true },
      { step: 3, subject: 'Resources while you decide', delay_hours: 168, active: false }
    ]
  },
  {
    id: 'booking_confirmation',
    name: 'Booking Confirmation',
    description: 'Sequence for confirmed consultations',
    steps: [
      { step: 1, subject: 'Your consultation is confirmed', delay_hours: 0, active: true },
      { step: 2, subject: 'Reminder: Your consultation is tomorrow', delay_hours: 24, active: true },
      { step: 3, subject: 'How was your consultation?', delay_hours: 48, active: true }
    ]
  },
  {
    id: 'lead_nurture',
    name: 'Lead Nurture',
    description: 'Long-term nurture sequence for resource downloads',
    steps: [
      { step: 1, subject: 'Thanks for downloading our resource', delay_hours: 0, active: true },
      { step: 2, subject: 'More helpful resources for you', delay_hours: 72, active: true },
      { step: 3, subject: 'Success story: How therapy helped Sarah', delay_hours: 168, active: true },
      { step: 4, subject: 'Ready to take the next step?', delay_hours: 336, active: true }
    ]
  }
];

export default function EmailSequencesAdmin() {
  const [sequences, setSequences] = useState<EmailSequence[]>(defaultSequences);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bloom2024admin') {
      setAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  const toggleStep = (sequenceId: string, stepNumber: number) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId 
          ? {
              ...seq,
              steps: seq.steps.map(step => 
                step.step === stepNumber 
                  ? { ...step, active: !step.active }
                  : step
              )
            }
          : seq
      )
    );
    setSuccessMessage('Sequence updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateDelay = (sequenceId: string, stepNumber: number, newDelay: number) => {
    setSequences(prev => 
      prev.map(seq => 
        seq.id === sequenceId 
          ? {
              ...seq,
              steps: seq.steps.map(step => 
                step.step === stepNumber 
                  ? { ...step, delay_hours: newDelay }
                  : step
              )
            }
          : seq
      )
    );
  };

  const sendTestEmail = async (sequenceId: string, stepNumber: number) => {
    if (!testEmail) {
      setError('Please enter a test email address');
      return;
    }

    try {
      // Find the sequence and step
      const sequence = sequences.find(s => s.id === sequenceId);
      const email = sequence?.emails[stepNumber];
      
      if (!email) {
        throw new Error('Email template not found');
      }

      // Use the test-email endpoint
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          subject: email.subject,
          html: email.content,
          text: email.content.replace(/<[^>]*>/g, '')
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setSuccessMessage(`Test email sent to ${testEmail}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send test email');
      setTimeout(() => setError(''), 5000);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Email Sequences Admin</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-bloompink hover:bg-[#B03979] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Sequences Management</h1>
          <p className="text-gray-600">Configure automated email sequences for lead nurturing and follow-up.</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
          >
            {successMessage}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Test Email Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Email Sequences</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email Sequences */}
        <div className="space-y-8">
          {sequences.map((sequence) => (
            <motion.div
              key={sequence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                <p className="text-gray-600 text-sm">{sequence.description}</p>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Step</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Delay (hours)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sequence.steps.map((step) => (
                        <tr key={step.step} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{step.step}</td>
                          <td className="py-3 px-4 text-gray-900">{step.subject}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={step.delay_hours}
                              onChange={(e) => updateDelay(sequence.id, step.step, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              min="0"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStep(sequence.id, step.step)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                step.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {step.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => sendTestEmail(sequence.id, step.step)}
                              disabled={!testEmail}
                              className="bg-bloompink hover:bg-[#B03979] disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Test
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Sequence Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-bloompink">3</p>
              <p className="text-gray-600">Active Sequences</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">8</p>
              <p className="text-gray-600">Active Steps</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">Emails Sent Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}