'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Mail, Phone, Download, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  experience_years: number;
  current_role?: string;
  cover_letter?: string;
  resume_url?: string;
  availability_date?: string;
  status: 'new' | 'reviewing' | 'interviewing' | 'offer_made' | 'hired' | 'rejected' | 'withdrawn';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export default function CareersAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/careers', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Application['status']) => {
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update application');
      
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Career Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(a => a.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'reviewing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'hired').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No applications yet</div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-medium text-lg">{application.first_name} {application.last_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          application.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'interviewing' ? 'bg-purple-100 text-purple-800' :
                          application.status === 'hired' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{application.email}</span>
                        </div>
                        {application.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{application.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Position: {application.position}</p>
                        <p className="text-sm text-gray-600 mt-1">{application.experience_years} years - {application.current_role}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {application.resume_url && (
                        <Button variant="secondary" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(application.id, 'reviewed')}
                      disabled={application.status !== 'new'}
                    >
                      Mark Reviewed
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(application.id, 'contacted')}
                      disabled={application.status === 'archived'}
                    >
                      Mark Contacted
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(application.id, 'archived')}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedApplication.name}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Contact Information</h3>
                  <p className="text-sm">{selectedApplication.email}</p>
                  {selectedApplication.phone && <p className="text-sm">{selectedApplication.phone}</p>}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Position</h3>
                  <p className="text-sm">{selectedApplication.position}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Experience</h3>
                  <p className="text-sm">{selectedApplication.experience}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Message</h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.message}</p>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setSelectedApplication(null)}>
                    Close
                  </Button>
                  <Button variant="primary">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}