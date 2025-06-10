'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function SupportingYourPartnerPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 relative overflow-hidden">
      {/* Garden lattice pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="partner-support-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#partner-support-lattice)" />
        </svg>
      </div>
      
      {/* Content sections would go here */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-playfair text-center mb-8">Supporting Your Partner</h1>
          <p className="text-center text-lg">Content coming soon...</p>
        </div>
      </div>
    </div>
  );
}