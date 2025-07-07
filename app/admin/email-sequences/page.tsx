'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Define a more accurate interface based on what the API will likely return
interface SequenceEmail {
  id: string;
  position: number;
  subject: string;
  delay_hours: number;
  delay_days: number;
  status: 'active' | 'inactive';
  template_name: string;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'inactive';
  emails: SequenceEmail[];
}

export default function EmailSequencesAdmin() {
  const router = useRouter();
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    setIsLoading(true);
    try {
      // Check auth by hitting a protected endpoint
      const authRes = await fetch('/api/admin/activity-log?limit=1');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      
      // Fetch sequence data
      const sequencesRes = await fetch('/api/email-automations');
      if (!sequencesRes.ok) {
        throw new Error('Failed to fetch email sequences');
      }
      const data = await sequencesRes.json();
      setSequences(data.sequences || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = async (sequenceId: string, emailId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
        const res = await fetch('/api/email-automations/emails', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId, status: newStatus }),
        });
        if (!res.ok) throw new Error('Failed to update email status');
        
        setSuccessMessage('Email status updated successfully');
        checkAuthAndLoadData(); // Refresh data
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status');
    }
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateDelay = async (sequenceId: string, emailId: string, delay_days: number, delay_hours: number) => {
    try {
        const res = await fetch('/api/email-automations/emails', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId, delay_days, delay_hours }),
        });
        if (!res.ok) throw new Error('Failed to update delay');
        
        setSuccessMessage('Delay updated successfully');
        // No need to full-reload for this, can update state locally for better UX
        setSequences(prev => 
          prev.map(seq => 
            seq.id === sequenceId 
              ? {
                  ...seq,
                  emails: seq.emails.map(email => 
                    email.id === emailId
                      ? { ...email, delay_days, delay_hours }
                      : email
                  )
                }
              : seq
          )
        );
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update delay');
    }
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const sendTestEmail = async (sequenceId: string, emailId: string) => {
    if (!testEmail) {
      setError('Please enter a test email address');
      return;
    }

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          emailId: emailId, // Send emailId to let backend find the template
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setSuccessMessage(`Test email sent to ${testEmail}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test email');
    }
    setTimeout(() => {
        setSuccessMessage('');
        setError('');
    }, 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
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
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Delay</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sequence.emails.map((email) => (
                        <tr key={email.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{email.position}</td>
                          <td className="py-3 px-4 text-gray-900">{email.subject}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                                <input
                                type="number"
                                value={email.delay_days}
                                onChange={(e) => updateDelay(sequence.id, email.id, parseInt(e.target.value), email.delay_hours)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent"
                                min="0"
                                /> days
                                <input
                                type="number"
                                value={email.delay_hours}
                                onChange={(e) => updateDelay(sequence.id, email.id, email.delay_days, parseInt(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent"
                                min="0"
                                /> hours
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStep(sequence.id, email.id, email.status)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                email.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {email.status}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => sendTestEmail(sequence.id, email.id)}
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
              <p className="text-3xl font-bold text-bloompink">{sequences.length}</p>
              <p className="text-gray-600">Active Sequences</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{sequences.reduce((acc, seq) => acc + seq.emails.length, 0)}</p>
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
