'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function SupportingYourPartnerPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-bloom-blush/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-bloom-dark mb-6">
            Be the Support She Needs During Her Journey
          </h1>
          <p className="text-lg md:text-xl text-bloom max-w-3xl mx-auto mb-8">
            Understanding how to support your partner through pregnancy, birth, and postpartum 
            can strengthen your relationship and help her thrive during this transformative time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/courses/partner-support-bootcamp" variant="pink">
              Take the Partner Support Bootcamp
            </Button>
            <Button href="#practical-support" variant="outline">
              Get Started with Quick Tips
            </Button>
          </div>
        </div>
      </section>

      {/* Understanding Changes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Understanding Postpartum Changes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Physical Changes */}
            <div className="bg-bloom-blush/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-bloompink/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-3">Physical Recovery</h3>
              <ul className="space-y-2 text-bloom">
                <li>• Recovery takes 6-12 weeks minimum</li>
                <li>• Pain and discomfort are normal</li>
                <li>• Sleep deprivation affects everything</li>
                <li>• Body changes continue for months</li>
                <li>• Healing isn't linear</li>
              </ul>
            </div>

            {/* Hormonal Changes */}
            <div className="bg-bloom-blush/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-bloompink/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-3">Hormonal Shifts</h3>
              <ul className="space-y-2 text-bloom">
                <li>• Massive hormone drops after birth</li>
                <li>• Mood swings are expected</li>
                <li>• "Baby blues" affect 80% of moms</li>
                <li>• Breastfeeding hormones impact mood</li>
                <li>• Takes months to rebalance</li>
              </ul>
            </div>

            {/* Emotional Changes */}
            <div className="bg-bloom-blush/10 rounded-lg p-6">
              <div className="w-12 h-12 bg-bloompink/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-3">Emotional Journey</h3>
              <ul className="space-y-2 text-bloom">
                <li>• Identity shifts are profound</li>
                <li>• Anxiety about baby is normal</li>
                <li>• Grief for pre-baby life happens</li>
                <li>• Perfectionism pressure is real</li>
                <li>• Connection may take time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Support Section */}
      <section id="practical-support" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Practical Ways to Help
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Daily Tasks */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleSection('daily')}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-bloom-dark">Daily Task Support</h3>
                <svg 
                  className={`w-5 h-5 text-bloom transform transition-transform ${expandedSection === 'daily' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'daily' && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-bloom-dark mb-2">Without Being Asked:</h4>
                      <ul className="space-y-1 text-bloom">
                        <li>✓ Handle night feedings (if bottle feeding)</li>
                        <li>✓ Do laundry and put it away</li>
                        <li>✓ Keep kitchen clean</li>
                        <li>✓ Grocery shop with list</li>
                        <li>✓ Take baby for walks</li>
                        <li>✓ Handle diaper changes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-bloom-dark mb-2">Ask First:</h4>
                      <ul className="space-y-1 text-bloom">
                        <li>? Organizing baby items</li>
                        <li>? Scheduling visitors</li>
                        <li>? Changing routines</li>
                        <li>? Making major decisions</li>
                        <li>? Posting photos online</li>
                        <li>? Trying new baby products</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Communication */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleSection('communication')}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-bloom-dark">Communication Tips</h3>
                <svg 
                  className={`w-5 h-5 text-bloom transform transition-transform ${expandedSection === 'communication' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'communication' && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-bloompink pl-4">
                      <h4 className="font-semibold text-bloom-dark">Say This:</h4>
                      <p className="text-bloom italic">"How can I help you today?"</p>
                      <p className="text-bloom italic">"You're doing an amazing job"</p>
                      <p className="text-bloom italic">"It's okay to feel overwhelmed"</p>
                      <p className="text-bloom italic">"What do you need from me?"</p>
                    </div>
                    <div className="border-l-4 border-red-400 pl-4">
                      <h4 className="font-semibold text-bloom-dark">Avoid Saying:</h4>
                      <p className="text-bloom italic line-through">"Just sleep when baby sleeps"</p>
                      <p className="text-bloom italic line-through">"At least..."</p>
                      <p className="text-bloom italic line-through">"You're being too anxious"</p>
                      <p className="text-bloom italic line-through">"In my day..."</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Warning Signs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleSection('warning')}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-bloom-dark">Warning Signs to Watch For</h3>
                <svg 
                  className={`w-5 h-5 text-bloom transform transition-transform ${expandedSection === 'warning' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'warning' && (
                <div className="px-6 pb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">Seek Professional Help If:</h4>
                    <ul className="space-y-1 text-red-700">
                      <li>• Sadness/anxiety lasting over 2 weeks</li>
                      <li>• Thoughts of self-harm or harming baby</li>
                      <li>• Unable to care for baby or self</li>
                      <li>• Extreme mood swings or rage</li>
                      <li>• Disconnection from reality</li>
                      <li>• No improvement after "baby blues" period</li>
                    </ul>
                  </div>
                  <p className="text-bloom">
                    <strong>Remember:</strong> Postpartum depression and anxiety affect 1 in 7 mothers. 
                    Getting help is a sign of strength, not weakness.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Self-Care Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Taking Care of Yourself Too
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-bloom-accent/10 rounded-lg p-8">
              <p className="text-lg text-bloom mb-6">
                Supporting a new mother is emotionally and physically demanding. 
                You can't pour from an empty cup.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-bloom-dark mb-3">Your Mental Health Matters</h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Partners can experience postpartum depression too</li>
                    <li>• Feeling overwhelmed is normal</li>
                    <li>• Seek your own support system</li>
                    <li>• Take breaks when needed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-bloom-dark mb-3">Find Your Support</h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Connect with other partners</li>
                    <li>• Join partner support groups</li>
                    <li>• Consider individual therapy</li>
                    <li>• Maintain friendships</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-bloom-accent/20 to-bloom-blush/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark mb-6">
            Ready to Be the Best Support Partner?
          </h2>
          <p className="text-lg text-bloom max-w-2xl mx-auto mb-8">
            Our Partner Support Bootcamp gives you the tools, knowledge, and confidence 
            to support your partner through pregnancy, birth, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/courses/partner-support-bootcamp" variant="pink" size="lg">
              Enroll in Partner Support Bootcamp
            </Button>
            <Button href="/resources" variant="outline" size="lg">
              Browse Free Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}