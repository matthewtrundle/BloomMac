'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Download, Upload, Archive, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function BackupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backups, setBackups] = useState<any[]>([]);

  const downloadData = async (type: 'subscribers' | 'analytics' | 'all') => {
    try {
      setLoading(true);
      setMessage('Preparing download...');

      const response = await fetch(`/api/backup?type=${type}`);
      
      if (!response.ok) throw new Error('Failed to generate backup');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bloom-${type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage(`✅ ${type} data downloaded successfully!`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      setLoading(true);
      setMessage('Generating CSV export...');

      const response = await fetch('/api/backup?type=csv');
      
      if (!response.ok) throw new Error('Failed to generate CSV');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage('✅ CSV exported successfully!');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Backup & Export</h1>
        <p className="text-gray-600 mt-2">Download and backup your subscriber and analytics data</p>
      </div>

      {/* Warning Card */}
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span>Important Backup Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• Data is currently stored in JSON files on the server</li>
            <li>• Regular backups are recommended to prevent data loss</li>
            <li>• Consider implementing a database solution for better reliability</li>
            <li>• Download backups before major updates or deployments</li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => downloadData('subscribers')}>
          <CardContent className="p-6 text-center">
            <Download className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium mb-1">Download Subscribers</h3>
            <p className="text-sm text-gray-600">JSON format</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => downloadData('analytics')}>
          <CardContent className="p-6 text-center">
            <Download className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium mb-1">Download Analytics</h3>
            <p className="text-sm text-gray-600">JSON format</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportCSV}>
          <CardContent className="p-6 text-center">
            <Archive className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium mb-1">Export Subscribers CSV</h3>
            <p className="text-sm text-gray-600">For spreadsheets</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => downloadData('all')}>
          <CardContent className="p-6 text-center">
            <Archive className="w-8 h-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-medium mb-1">Download All Data</h3>
            <p className="text-sm text-gray-600">Complete backup</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.includes('✅') ? 'bg-green-50 text-green-800' : 
          message.includes('❌') ? 'bg-red-50 text-red-800' : 
          'bg-blue-50 text-blue-800'
        }`}>
          {message.includes('✅') ? <CheckCircle className="w-5 h-5" /> :
           message.includes('❌') ? <AlertCircle className="w-5 h-5" /> :
           <RefreshCw className="w-5 h-5 animate-spin" />}
          <span>{message}</span>
        </div>
      )}

      {/* Backup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Regular Backups</h4>
            <p className="text-sm text-gray-600">Download backups at least weekly, or before any major changes to your site.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Off-site Storage</h4>
            <p className="text-sm text-gray-600">Store backups in multiple locations (Google Drive, Dropbox, external drive) for redundancy.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Test Restores</h4>
            <p className="text-sm text-gray-600">Periodically test that your backups can be restored successfully.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Automation Coming Soon</h4>
            <p className="text-sm text-gray-600">Automated daily backups and cloud storage integration are planned future features.</p>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-bloom-primary" />
            <p className="text-gray-700">Processing backup...</p>
          </div>
        </div>
      )}
    </div>
  );
}