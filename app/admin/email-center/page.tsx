'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Settings, 
  Send,
  Eye,
  Code,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  MousePointerClick,
  Zap,
  FileText,
  TestTube,
  Search,
  Download,
  Loader2,
  X,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import NewsletterAdmin from '@/components/admin/NewsletterAdmin';
import { motion } from 'framer-motion';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  sequence?: string;
  step?: number;
  lastModified?: string;
  modifiedBy?: string;
}

interface EmailStats {
  totalSent: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  signupSource: string;
  status: string;
  created_at: string;
}

export default function EmailCenterPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailStats, setEmailStats] = useState<EmailStats>({
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0
  });
  const [automationData, setAutomationData] = useState<any>({ sequences: [] });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resendConfigured, setResendConfigured] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [templateFilter, setTemplateFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load newsletter data
      const newsletterResponse = await fetch('/api/newsletter-admin', {
        credentials: 'include'
      });
      if (newsletterResponse.ok) {
        const newsletterData = await newsletterResponse.json();
        setSubscribers(newsletterData.subscribers || []);
      }

      // Load email templates
      const templatesResponse = await fetch('/api/email-templates', {
        credentials: 'include'
      });
      console.log('Templates response status:', templatesResponse.status);
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        console.log('Templates data:', templatesData);
        // Use templates directly from the database
        if (templatesData.templates) {
          setTemplates(templatesData.templates);
        }
      } else {
        console.error('Failed to load templates:', templatesResponse.status, templatesResponse.statusText);
      }

      // Load email analytics
      const analyticsResponse = await fetch('/api/email-analytics', {
        credentials: 'include'
      });
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setEmailStats({
          totalSent: analyticsData.overview?.totalSent || 0,
          openRate: analyticsData.overview?.openRate || 0,
          clickRate: analyticsData.overview?.clickRate || 0,
          unsubscribeRate: analyticsData.overview?.unsubscribeRate || 0
        });
      }

      // Load automation data
      const automationResponse = await fetch('/api/email-automations', {
        credentials: 'include'
      });
      if (automationResponse.ok) {
        const autoData = await automationResponse.json();
        setAutomationData(autoData);
      }

      // Check Resend configuration
      const configResponse = await fetch('/api/test-email', {
        credentials: 'include'
      });
      if (configResponse.ok) {
        const configData = await configResponse.json();
        console.log('Resend config:', configData);
        setResendConfigured(configData.configured);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const response = await fetch('/api/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedTemplate.id,
          subject: selectedTemplate.subject,
          content: selectedTemplate.content
        })
      });
      if (response.ok) {
        alert('Template saved successfully!');
        await loadData(); // Reload templates
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;
      
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          to: 'test@bloompsychologynorthaustin.com',
          subject: template.subject,
          html: template.content,
          text: template.content.replace(/<[^>]*>/g, '')
        })
      });
      
      const result = await response.json();
      setTestResults([...testResults, {
        template: template.name,
        status: result.success ? 'success' : 'error',
        timestamp: new Date().toISOString(),
        message: result.message || 'Test email sent to matthewtrundle@gmail.com'
      }]);
      
      if (result.success) {
        setTestEmailSent(true);
        // Show success notification
        setTimeout(() => {
          alert(`Test email sent successfully to ${result.recipient || 'matthewtrundle@gmail.com'}`);
        }, 100);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setTestResults([...testResults, {
        template: templateId,
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Failed to send test email'
      }]);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template => {
    if (templateFilter === 'all') return template.sequenceActive !== false;
    if (templateFilter === 'database') return template.source === 'database';
    if (templateFilter === 'enhanced') return template.source === 'enhanced' && template.sequenceActive !== false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Center</h1>
          <p className="text-gray-600 mt-1">Manage all email communications in one place</p>
        </div>
      </div>

      <div className="w-full">
        <div className="grid w-full grid-cols-5 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'automations' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            Automations
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'campaigns' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send className="w-4 h-4" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'templates' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'testing' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TestTube className="w-4 h-4" />
            Testing
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscribers.length}</div>
                <p className="text-xs text-green-600 mt-1">{subscribers.filter(s => s.status === 'active').length} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailStats.openRate}%</div>
                <p className="text-xs text-gray-600 mt-1">Industry avg: 21.5%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Click Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailStats.clickRate}%</div>
                <p className="text-xs text-gray-600 mt-1">Industry avg: 7.8%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {resendConfigured ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-600">Not Configured</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center py-4">
                  Email tracking data not available yet. Send some campaigns to see activity here.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-6">
            {/* Automated Email Sequences */}
            <Card>
              <CardHeader>
                <CardTitle>Automated Email Sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {automationData?.sequences?.length > 0 ? (
                    automationData.sequences.map((sequence: any) => {
                      const getIconAndColor = (trigger: string) => {
                        switch (trigger) {
                          case 'newsletter_signup':
                            return { icon: Mail, color: 'blue' };
                          case 'contact_form':
                            return { icon: Users, color: 'green' };
                          case 'booking_confirmation':
                            return { icon: Calendar, color: 'purple' };
                          case 'lead_nurture':
                            return { icon: Target, color: 'orange' };
                          default:
                            return { icon: Mail, color: 'gray' };
                        }
                      };
                      
                      const { icon: Icon, color } = getIconAndColor(sequence.trigger);
                      
                      return (
                        <div key={sequence.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icon className={`w-5 h-5 text-${color}-600`} />
                                {sequence.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {sequence.emailCount} emails • {sequence.activeEnrollments} active enrollments
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
                          </div>
                          <div className="space-y-3">
                            {sequence.emails?.map((email: any, index: number) => (
                              <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                                  <span className="text-xs font-semibold">{email.position}</span>
                                </div>
                                <div className="flex-1 ml-3">
                                  <p className="text-sm font-medium">{email.subject}</p>
                                  <p className="text-xs text-gray-500">{email.delay}</p>
                                </div>
                                {index < sequence.emails.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No active email sequences found</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    All sequences are configured and ready to send automatically when triggered
                  </p>
                </div>

                {/* Automation Management Info */}
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">How to Manage Automations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium mb-1">Current Setup</h4>
                        <p className="text-sm text-gray-600">
                          These email sequences are triggered automatically by user actions:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          {automationData?.sequences?.map((seq: any) => (
                            <li key={seq.id}>• {seq.trigger.replace(/_/g, ' ')} → {seq.name} ({seq.emailCount} emails)</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium mb-1">To Edit Templates</h4>
                        <p className="text-sm text-gray-600">
                          Go to the <button 
                            onClick={() => setActiveTab('templates')}
                            className="text-bloom-primary hover:underline"
                          >Templates tab</button> and look for templates marked with "Auto" badge.
                          These are the automated email templates.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium mb-1">To Test Sequences</h4>
                        <p className="text-sm text-gray-600">
                          Use the <button 
                            onClick={() => setActiveTab('testing')}
                            className="text-bloom-primary hover:underline"
                          >Testing tab</button> to send test emails from any template in the sequences.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-medium mb-1">Advanced Management</h4>
                        <p className="text-sm text-gray-600">
                          To modify timing, add/remove emails, or create new sequences, 
                          these changes need to be made in the codebase at:
                        </p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                          Database: email_sequences and sequence_emails tables
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
          <NewsletterAdmin />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Template Categories */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setTemplateFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  templateFilter === 'all' 
                    ? 'bg-bloom-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Templates ({templates.length})
              </button>
              <button
                onClick={() => setTemplateFilter('database')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  templateFilter === 'database' 
                    ? 'bg-bloom-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom ({templates.filter(t => t.source === 'database').length})
              </button>
              <button
                onClick={() => setTemplateFilter('enhanced')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  templateFilter === 'enhanced' 
                    ? 'bg-bloom-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Automated ({templates.filter(t => t.source === 'enhanced').length})
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedTemplate?.id === template.id 
                            ? 'bg-bloom-primary/10 border-bloom-primary' 
                            : 'hover:bg-gray-50'
                        } border`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-gray-600 capitalize">{template.category}</p>
                          </div>
                          {template.source === 'enhanced' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Auto</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Template Editor & Preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedTemplate ? selectedTemplate.name : 'Select a template'}
                    </CardTitle>
                    {selectedTemplate && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className={`px-3 py-1.5 text-sm border rounded-md flex items-center gap-2 transition ${
                            showPreview 
                              ? 'border-bloom-primary bg-bloom-primary/10 text-bloom-primary' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          {showPreview ? 'Edit' : 'Preview'}
                        </button>
                        <button 
                          onClick={() => handleSendTestEmail(selectedTemplate.id)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Test
                        </button>
                        {selectedTemplate.source === 'database' && (
                          <button 
                            onClick={handleSaveTemplate} 
                            disabled={saving}
                            className="px-3 py-1.5 text-sm bg-bloom-primary text-white rounded-md hover:bg-bloom-primary/90 disabled:opacity-50 flex items-center gap-2"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedTemplate ? (
                    showPreview ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                          <p className="text-gray-900">{selectedTemplate.subject}</p>
                        </div>
                        <div className="border rounded-lg p-6 bg-white">
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: selectedTemplate.content.replace(
                                /\{\{firstName\}\}/g, 'Jane'
                              ).replace(
                                /\{\{lastName\}\}/g, 'Doe'
                              ).replace(
                                /\{\{email\}\}/g, 'jane@example.com'
                              ).replace(
                                /\{\{unsubscribeLink\}\}/g, '#'
                              )
                            }}
                          />
                        </div>
                        {selectedTemplate.sequence && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">Part of:</p>
                            <p className="text-sm text-blue-700">{selectedTemplate.sequence} sequence</p>
                            {selectedTemplate.delay && (
                              <p className="text-xs text-blue-600 mt-1">Sent after: {selectedTemplate.delay}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Subject Line</label>
                          <input
                            type="text"
                            value={selectedTemplate.subject}
                            onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                            disabled={selectedTemplate.source !== 'database'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Content</label>
                          <textarea
                            value={selectedTemplate.content}
                            onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent font-mono text-sm"
                            disabled={selectedTemplate.source !== 'database'}
                          />
                        </div>
                        {selectedTemplate.source === 'enhanced' && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              This is an automated template and cannot be edited directly.
                            </p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Available Variables</h4>
                          <div className="flex flex-wrap gap-2">
                            {['{{firstName}}', '{{lastName}}', '{{email}}', '{{unsubscribeLink}}'].map((variable) => (
                              <code key={variable} className="bg-white px-2 py-1 rounded text-sm">
                                {variable}
                              </code>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Select a template to view or edit
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Testing Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Configuration Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Configuration Status</h4>
                  <div className="flex items-center gap-2">
                    {resendConfigured ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600">Resend API configured</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-600">Resend API not configured</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Test Email Sender */}
                <div>
                  <h4 className="font-medium mb-4">Send Test Emails</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Test recipient: <strong>matthewtrundle@gmail.com</strong>
                      <br />
                      <span className="text-xs">To change the test recipient, update the API configuration.</span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      onChange={(e) => setTemplateSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {templates
                      .filter(t => 
                        !templateSearchTerm || 
                        t.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                        t.category.toLowerCase().includes(templateSearchTerm.toLowerCase())
                      )
                      .map((template) => (
                      <div key={template.id} className="border rounded-lg p-4 hover:border-bloom-primary transition">
                        <h5 className="font-medium">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Category: <span className="capitalize">{template.category}</span>
                          {template.sequence && (
                            <span className="text-xs ml-2 text-blue-600">
                              ({template.sequence} sequence)
                            </span>
                          )}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSendTestEmail(template.id)}
                            className="px-3 py-1.5 text-sm bg-bloom-primary text-white rounded-md hover:bg-bloom-primary/90 flex items-center gap-2"
                          >
                            <Send className="w-3 h-3" />
                            Send Test
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setActiveTab('templates');
                              setShowPreview(true);
                            }}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4">Test Results</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <Mail className="w-4 h-4 inline mr-1" />
                        All test emails are sent to: <strong>matthewtrundle@gmail.com</strong>
                      </p>
                    </div>
                    <div className="space-y-2">
                      {testResults.slice(-10).reverse().map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{result.template}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                            {result.message && (
                              <p className="text-xs text-gray-500 mt-1">{result.message}</p>
                            )}
                          </div>
                          {result.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  );
}