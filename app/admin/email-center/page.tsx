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
  const [automationData, setAutomationData] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resendConfigured, setResendConfigured] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

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
        // Extract templates from the enhanced structure
        const allTemplates = [];
        if (templatesData.sequences) {
          templatesData.sequences.forEach(sequence => {
            sequence.emails.forEach((email, index) => {
              allTemplates.push({
                id: `${sequence.id}-${index}`,
                name: email.name,
                subject: email.subject,
                content: email.content,
                category: sequence.name,
                sequence: sequence.id,
                step: index
              });
            });
          });
        }
        console.log('Extracted templates:', allTemplates);
        setTemplates(allTemplates);
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
          sequence: selectedTemplate.sequence,
          step: selectedTemplate.step,
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
        message: result.message
      }]);
      
      if (result.success) {
        setTestEmailSent(true);
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
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeTab === 'subscribers' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Subscribers
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

        {activeTab === 'subscribers' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subscriber Management</CardTitle>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Source</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{subscriber.email}</td>
                        <td className="py-2 px-4">{subscriber.firstName} {subscriber.lastName}</td>
                        <td className="py-2 px-4">
                          <span className="text-sm capitalize">{(subscriber.signupSource || 'unknown').replace('_', ' ')}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`text-sm ${subscriber.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-600">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTemplate?.id === template.id 
                          ? 'bg-bloom-primary/10 border-bloom-primary' 
                          : 'hover:bg-gray-50'
                      } border`}
                    >
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedTemplate ? `Edit: ${selectedTemplate.name}` : 'Select a template'}
                  </CardTitle>
                  {selectedTemplate && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSendTestEmail(selectedTemplate.id)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Test
                      </button>
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
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject Line</label>
                      <input
                        type="text"
                        value={selectedTemplate.subject}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={selectedTemplate.content}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Available Variables</h4>
                      <div className="flex flex-wrap gap-2">
                        {['{firstName}', '{lastName}', '{email}', '{unsubscribeLink}'].map((variable) => (
                          <code key={variable} className="bg-white px-2 py-1 rounded text-sm">
                            {variable}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select a template to edit
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <h5 className="font-medium">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{template.category}</p>
                        <button 
                          onClick={() => handleSendTestEmail(template.id)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Send Test
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4">Test Results</h4>
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{result.template}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
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