'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Search, Filter, Clock, User, Globe } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface ActivityData {
  activities: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ActivityLogPage() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  useEffect(() => {
    fetchActivityLogs();
  }, [currentPage]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity-log?page=${currentPage}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'admin_login': 'text-green-600',
      'newsletter_sent': 'text-blue-600',
      'subscriber_added': 'text-purple-600',
      'subscriber_removed': 'text-red-600',
      'content_updated': 'text-yellow-600',
      'backup_created': 'text-gray-600',
    };
    return colors[action] || 'text-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      'login': 'Login',
      'logout': 'Logout',
      'admin_login': 'Admin Login',
      'newsletter_sent': 'Newsletter Sent',
      'subscriber_added': 'Subscriber Added',
      'subscriber_removed': 'Subscriber Removed',
      'content_updated': 'Content Updated',
      'backup_created': 'Backup Created',
      'role_change': 'Role Change',
      'create': 'Create',
      'update': 'Update',
      'delete': 'Delete',
      'view': 'View',
    };
    return labels[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
      </div>
    );
  }

  const filteredLogs = data?.activities?.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    
    return matchesSearch && matchesAction;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <div className="text-sm text-gray-500">
          {data?.pagination?.total || 0} total activities
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent appearance-none"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
                <option value="newsletter_sent">Newsletter Sent</option>
                <option value="subscriber_added">Subscriber Added</option>
                <option value="role_change">Role Change</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No activities found</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                        {log.entityType && (
                          <span className="text-sm text-gray-500">
                            on {log.entityType}
                          </span>
                        )}
                      </div>
                      
                      {log.details && (
                        <div className="mt-1 text-sm text-gray-600">
                          {log.details.email && (
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{log.details.email}</span>
                            </span>
                          )}
                          {log.details.subject && (
                            <p>Subject: {log.details.subject}</p>
                          )}
                          {log.details.recipients_count && (
                            <p>Sent to {log.details.recipients_count} recipients</p>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(log.createdAt)}</span>
                        </span>
                        {log.ipAddress && (
                          <span className="flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>{log.ipAddress}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={currentPage === data.pagination.totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}