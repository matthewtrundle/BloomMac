'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseTemplatesPage() {
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
          
          <h1 className="text-3xl font-bold text-bloom-dark mb-2">Course Templates</h1>
          <p className="text-bloom-dark/60">Manage reusable course templates and content blocks</p>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-bloom-dark mb-2">Coming Soon</h2>
            <p className="text-bloom-dark/60 mb-6">
              Course templates feature is under development
            </p>
            <p className="text-sm text-bloom-dark/50">
              This will allow you to create reusable course structures and content blocks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}