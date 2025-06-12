'use client';

import { useState } from 'react';
import QuietBloomConcept from '@/components/theme-concepts/QuietBloomConcept';
import GroundedGrowthConcept from '@/components/theme-concepts/GroundedGrowthConcept';
import ModernMaternalConcept from '@/components/theme-concepts/ModernMaternalConcept';

export default function ThemeConceptsPage() {
  const [selectedTheme, setSelectedTheme] = useState<'quiet' | 'grounded' | 'modern'>('quiet');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Theme Selector */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Theme Concepts Preview</h1>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTheme('quiet')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedTheme === 'quiet'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quiet Bloom
              </button>
              
              <button
                onClick={() => setSelectedTheme('grounded')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedTheme === 'grounded'
                    ? 'bg-[#8b6b47] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grounded Growth
              </button>
              
              <button
                onClick={() => setSelectedTheme('modern')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedTheme === 'modern'
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Modern Maternal
              </button>
            </div>
            
            <div className="flex gap-4">
              <a
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Admin
              </a>
            </div>
          </div>
          
          {/* Theme Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {selectedTheme === 'quiet' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quiet Bloom</h3>
                <p className="text-sm text-gray-600">
                  Minimal design with abundant whitespace, sage/dusty rose palette, and subtle line art. 
                  Focus on calm and sophistication with minimal animations.
                </p>
              </div>
            )}
            
            {selectedTheme === 'grounded' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Grounded Growth</h3>
                <p className="text-sm text-gray-600">
                  Earth-inspired with organic shapes, terracotta/moss palette, and nature metaphors. 
                  Warm and nurturing with textured backgrounds.
                </p>
              </div>
            )}
            
            {selectedTheme === 'modern' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Modern Maternal</h3>
                <p className="text-sm text-gray-600">
                  Contemporary design with clean geometry, navy/blush/gold palette, and bold typography. 
                  Professional and empowering with structured layouts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Theme Preview */}
      <div className="relative">
        {selectedTheme === 'quiet' && <QuietBloomConcept />}
        {selectedTheme === 'grounded' && <GroundedGrowthConcept />}
        {selectedTheme === 'modern' && <ModernMaternalConcept />}
      </div>
    </div>
  );
}