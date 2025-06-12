'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseSettingsPage() {
  const router = useRouter();

  return (
    <div className="bg-bloom-sage-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-bloom-dark hover:text-bloompink transition-colors mb-4"
          >
            ← Back to Courses
          </button>
          
          <h1 className="text-3xl font-bold text-bloom-dark mb-2">Course Settings</h1>
          <p className="text-bloom-dark/60">Configure course delivery and access settings</p>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-2xl font-semibold text-bloom-dark mb-2">Settings Coming Soon</h2>
            <p className="text-bloom-dark/60 mb-6">
              Course configuration settings are under development
            </p>
            <p className="text-sm text-bloom-dark/50">
              Configure enrollment options, access controls, and delivery settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}