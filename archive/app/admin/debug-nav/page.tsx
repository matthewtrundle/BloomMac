'use client';

import { BookOpen } from 'lucide-react';

export default function DebugNavPage() {
  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Click Heatmap', href: '/admin/heatmap' },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpen, badge: 'NEW' },
    { name: 'Contact Submissions', href: '/admin/contacts' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Navigation</h1>
      <p className="mb-4">Course Management should be in position 4:</p>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(navigation, null, 2)}
      </pre>
      <div className="mt-4">
        <a href="/admin/courses" className="text-blue-600 hover:underline">
          Go directly to Course Management →
        </a>
      </div>
    </div>
  );
}