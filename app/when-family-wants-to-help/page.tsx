'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function WhenFamilyWantsToHelpPage() {
  const [activeTab, setActiveTab] = useState('helpful');

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-playfair mb-8">When Family Wants to Help</h1>
        
        <div className="mb-8">
          <button 
            onClick={() => setActiveTab('helpful')}
            className={`px-4 py-2 mr-4 ${activeTab === 'helpful' ? 'bg-bloompink text-white' : 'bg-gray-200'}`}
          >
            Helpful Actions
          </button>
          <button 
            onClick={() => setActiveTab('harmful')}
            className={`px-4 py-2 ${activeTab === 'harmful' ? 'bg-bloompink text-white' : 'bg-gray-200'}`}
          >
            Harmful Actions
          </button>
        </div>

        {activeTab === 'helpful' ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Helpful Actions</h2>
            <p>Content about helpful actions family can take...</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Harmful Actions to Avoid</h2>
            <p>Content about harmful actions to avoid...</p>
          </div>
        )}

        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}