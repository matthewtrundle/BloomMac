'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Save, Eye, Code, Mail, Copy, RotateCcw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailTemplate {
  id: string;
  sequence: string;
  step: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  lastModified?: string;
  modifiedBy?: string;
}

export default function EmailEditorPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Update edited content when template selection changes
  useEffect(() => {
    if (selectedTemplate) {
      setEditedSubject(selectedTemplate.subject);
      setEditedContent(selectedTemplate.content);
    }
  }, [selectedTemplate]);

  const checkAuth = async () => {
    try {
      // Check if the user has a valid admin token by making a request to a protected endpoint
      const response = await fetch('/api/admin/activity-log?limit=1');
      if (response.ok) {
        setIsLoading(false);
        loadTemplates();
      } else {
        // Not authenticated, redirect to admin login
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        if (data.templates.length > 0 && !selectedTemplate) {
          setSelectedTemplate(data.templates[0]);
        }
      }
    } catch (error) {
      setError('Failed to load templates');
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;

    setIsSaving(true);
    setSaveMessage('');
    setError('');

    try {
      const response = await fetch('/api/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedTemplate.id,
          sequence: selectedTemplate.sequence,
          step: selectedTemplate.step,
          subject: editedSubject,
          content: editedContent,
        }),
      });

      const responseData = await response.json().catch(() => null);
      
      if (response.ok) {
        setSaveMessage('Template saved successfully!');
        // Reload templates to get updated data
        await loadTemplates();
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorMessage = responseData?.error || `Failed to save template (${response.status})`;
        console.error('Save error:', errorMessage, responseData);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Save exception:', error);
      setError('Failed to save template: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !selectedTemplate) return;

    setIsSendingTest(true);
    setError('');

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          to: testEmail,
          sequence: selectedTemplate.sequence,
          step: selectedTemplate.step,
          customSubject: editedSubject,
          customContent: editedContent,
        }),
      });

      if (response.ok) {
        setSaveMessage('Test email sent successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      setError('Failed to send test email');
    } finally {
      setIsSendingTest(false);
    }
  };

  const resetChanges = () => {
    if (selectedTemplate) {
      setEditedSubject(selectedTemplate.subject);
      setEditedContent(selectedTemplate.content);
    }
  };

  const insertVariable = (variable: string) => {
    const cursorPos = (document.getElementById('contentEditor') as HTMLTextAreaElement)?.selectionStart || editedContent.length;
    const before = editedContent.slice(0, cursorPos);
    const after = editedContent.slice(cursorPos);
    setEditedContent(before + variable + after);
  };

  const getPreviewHtml = () => {
    let preview = editedContent;
    // Replace variables with sample data
    preview = preview.replace(/\{\{firstName\}\}/g, 'Sarah');
    preview = preview.replace(/\{\{name\}\}/g, 'Sarah');
    preview = preview.replace(/\{\{email\}\}/g, 'sarah@example.com');
    preview = preview.replace(/\{\{resourceName\}\}/g, 'Anxiety Management Guide');
    preview = preview.replace(/\{\{appointmentDetails\.date\}\}/g, 'Tomorrow, February 1st');
    preview = preview.replace(/\{\{appointmentDetails\.time\}\}/g, '2:00 PM CST');
    preview = preview.replace(/\{\{appointmentDetails\.format\}\}/g, 'Video Call');
    return preview;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Email Template Editor</h1>
          <p className="text-gray-600 mt-2">Edit and customize your automated email templates</p>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {saveMessage}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                        selectedTemplate?.id === template.id ? 'bg-bloom-light' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{template.sequence}</div>
                      {template.lastModified && (
                        <div className="text-xs text-gray-500 mt-1">
                          Modified: {new Date(template.lastModified).toLocaleDateString()}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            {selectedTemplate ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedTemplate.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Sequence: {selectedTemplate.sequence} • Step: {selectedTemplate.step}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={resetChanges}
                        variant="secondary"
                        size="sm"
                        disabled={isSaving}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        onClick={() => setShowCode(!showCode)}
                        variant="secondary"
                        size="sm"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        {showCode ? 'Editor' : 'Code'}
                      </Button>
                      <Button
                        onClick={() => setShowPreview(!showPreview)}
                        variant="secondary"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        onClick={saveTemplate}
                        variant="primary"
                        size="sm"
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Subject Line Editor */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-primary focus:border-bloom-primary"
                    />
                  </div>

                  {/* Variable Helper */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Available Variables (click to insert):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable)}
                          className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
                        >
                          {variable}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Content {showCode ? '(HTML)' : ''}
                    </label>
                    <textarea
                      id="contentEditor"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-primary focus:border-bloom-primary font-mono text-sm"
                      rows={20}
                      style={{ whiteSpace: showCode ? 'pre' : 'pre-wrap' }}
                    />
                  </div>

                  {/* Test Email Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Send Test Email</h3>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="test@example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-primary focus:border-bloom-primary"
                      />
                      <Button
                        onClick={sendTestEmail}
                        variant="secondary"
                        disabled={!testEmail || isSendingTest}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {isSendingTest ? 'Sending...' : 'Send Test'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Select a template to edit</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium">Email Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Subject:</p>
                    <p className="font-medium">{editedSubject}</p>
                  </div>
                  <div 
                    className="email-preview"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}