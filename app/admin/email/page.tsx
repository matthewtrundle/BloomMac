'use client';

import React, { useState } from 'react';
import NewsletterAdmin from '@/components/admin/NewsletterAdmin';

const EmailAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'newsletter' | 'automation' | 'analytics'>('newsletter');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Admin</h1>
              <p className="text-gray-600 mt-1">Manage newsletters, automation, and email analytics</p>
            </div>
            <div className="text-sm text-gray-500">
              Bloom Psychology Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'newsletter' 
                ? 'bg-white text-bloompink shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Newsletter Management
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'automation' 
                ? 'bg-white text-bloompink shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Automation
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-white text-bloompink shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'newsletter' && <NewsletterAdmin />}
        
        {activeTab === 'automation' && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Automation</h3>
              <p className="text-gray-600 mb-4">
                Manage automated email sequences for lead nurturing, welcome series, and follow-up campaigns.
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Coming Soon - Integration with existing automation system
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Analytics</h3>
              <p className="text-gray-600 mb-4">
                Track email performance including open rates, click-through rates, and subscriber engagement metrics.
              </p>
              <p className="text-sm text-green-600 font-medium">
                Coming Soon - Advanced email analytics dashboard
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAdminPage;