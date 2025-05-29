'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Search,
  Filter,
  Download,
  Archive,
  Reply,
  Eye,
  EyeOff,
  Tag,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  source?: string;
  page?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  replied_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    replied: 0,
    responseRate: 0
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const data = await response.json();
      setContacts(data.contacts);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, status: ContactSubmission['status']) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update contact');
      
      await fetchContacts();
      if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const addNote = async (contactId: string, notes: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) throw new Error('Failed to add note');
      
      await fetchContacts();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const exportContacts = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Service', 'Message', 'Source', 'Status', 'Date'].join(','),
      ...filteredContacts.map(c => [
        c.name,
        c.email,
        c.phone || '',
        c.service || '',
        `"${c.message.replace(/"/g, '""')}"`,
        c.source || '',
        c.status,
        format(new Date(c.created_at), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const filteredContacts = contacts
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => 
      searchTerm === '' || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const getStatusIcon = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'read': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'replied': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'archived': return <Archive className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source?: string) => {
    const sourceMap: Record<string, string> = {
      contact_page: 'Contact Page',
      postpartum_landing_page: 'Postpartum Landing',
      homepage: 'Homepage',
      service_page: 'Service Page',
      blog: 'Blog'
    };
    return sourceMap[source || ''] || source || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
        <p className="text-gray-600">Manage and respond to contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Messages</p>
              <p className="text-2xl font-bold text-red-600">{stats.new}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-blue-600">{stats.responseRate}%</p>
            </div>
            <Reply className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
              />
            </div>
          </div>

          {/* Filter by Status */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* Export */}
          <button
            onClick={exportContacts}
            className="px-4 py-2 bg-bloom-primary text-white rounded-md hover:bg-bloom-primary/90 transition flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${
                    contact.status === 'new' ? 'bg-red-50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(contact.status)}
                      <span className="ml-2 text-sm capitalize">{contact.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && (
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.service || 'General Inquiry'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getSourceLabel(contact.source)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(contact.created_at), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {contact.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateContactStatus(contact.id, 'read');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Mark as Read"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateContactStatus(contact.id, 'replied');
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Replied"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateContactStatus(contact.id, 'archived');
                        }}
                        className="text-gray-600 hover:text-gray-800"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">Contact Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Contact Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedContact.status)}
                    <span className="capitalize">{selectedContact.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{format(new Date(selectedContact.created_at), 'MMMM d, yyyy h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span>Source: {getSourceLabel(selectedContact.source)}</span>
                  </div>
                  {selectedContact.service && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span>Service: {selectedContact.service}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Internal Notes</h4>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
                  rows={3}
                  placeholder="Add internal notes..."
                  defaultValue={selectedContact.notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== selectedContact.notes) {
                      addNote(selectedContact.id, e.target.value);
                    }
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="px-4 py-2 bg-bloom-primary text-white rounded-md hover:bg-bloom-primary/90 transition flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
                
                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
                
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
                >
                  Mark as Replied
                </button>
                
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'archived')}
                  className="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-50 transition"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}