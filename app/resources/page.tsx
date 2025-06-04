'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const resources = [
    // For New Moms
    {
      category: 'moms',
      title: 'Postpartum Recovery Checklist',
      description: 'Week-by-week guide for physical and emotional recovery',
      type: 'PDF Guide',
      icon: '📋',
      link: '/resources/postpartum-checklist'
    },
    {
      category: 'moms',
      title: 'Self-Care Assessment Tool',
      description: 'Evaluate your wellness across 8 key areas',
      type: 'Interactive',
      icon: '🌟',
      link: '/resources/self-assessment'
    },
    {
      category: 'moms',
      title: 'Micro Self-Care Guide',
      description: '50 self-care activities that take 5 minutes or less',
      type: 'PDF Guide',
      icon: '⏱️',
      link: '/resources/micro-self-care'
    },
    {
      category: 'moms',
      title: 'New Mom Survival Guide',
      description: 'Essential tips for the first 3 months',
      type: 'PDF Guide',
      icon: '🍼',
      link: '/resources/new-mom-guide'
    },
    {
      category: 'moms',
      title: 'Grounding Techniques',
      description: 'Manage anxiety with proven grounding exercises',
      type: 'Video Series',
      icon: '🌱',
      link: '/resources/grounding-techniques'
    },
    // For Partners
    {
      category: 'partners',
      title: 'Partner Support Checklist',
      description: 'Daily and weekly ways to support your partner',
      type: 'PDF Guide',
      icon: '💑',
      link: '#partner-checklist'
    },
    {
      category: 'partners',
      title: 'Communication Worksheet',
      description: 'Navigate difficult conversations with empathy',
      type: 'Worksheet',
      icon: '💬',
      link: '#communication-worksheet'
    },
    {
      category: 'partners',
      title: 'Warning Signs Guide',
      description: 'Recognize when professional help is needed',
      type: 'PDF Guide',
      icon: '⚠️',
      link: '#warning-signs'
    },
    // For Families
    {
      category: 'families',
      title: 'Family Boundaries Guide',
      description: 'Respect new parent boundaries while staying connected',
      type: 'PDF Guide',
      icon: '🏠',
      link: '#boundaries-guide'
    },
    {
      category: 'families',
      title: 'Helpful vs Harmful Checklist',
      description: 'What helps (and what doesn\'t) for new families',
      type: 'Checklist',
      icon: '✅',
      link: '#helpful-harmful'
    },
    {
      category: 'families',
      title: 'Cultural Sensitivity Guide',
      description: 'Honor diverse parenting traditions and choices',
      type: 'PDF Guide',
      icon: '🌍',
      link: '#cultural-guide'
    },
    // Emergency Resources
    {
      category: 'emergency',
      title: 'Crisis Hotline Directory',
      description: '24/7 support lines for immediate help',
      type: 'Resource List',
      icon: '🆘',
      link: '#crisis-hotlines'
    },
    {
      category: 'emergency',
      title: 'When to Seek Help',
      description: 'Know the signs that indicate professional support is needed',
      type: 'Guide',
      icon: '🏥',
      link: '#seek-help'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: '📚' },
    { id: 'moms', label: 'For New Moms', icon: '👶' },
    { id: 'partners', label: 'For Partners', icon: '💑' },
    { id: 'families', label: 'For Families', icon: '👨‍👩‍👧' },
    { id: 'emergency', label: 'Emergency', icon: '🆘' }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-bloom-blush/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-bloom-dark mb-6">
            Free Tools for Your Journey
          </h1>
          <p className="text-lg md:text-xl text-bloom max-w-3xl mx-auto mb-8">
            Evidence-based resources, practical guides, and tools to support you through 
            pregnancy, postpartum, and beyond—all completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#resources" variant="pink">
              Browse Resources
            </Button>
            <Button href="/courses" variant="outline">
              Explore Our Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-[120px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-bloom-accent text-white shadow-md'
                    : 'bg-white text-bloom hover:bg-bloom-blush/20 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section id="resources" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredResources.map((resource, index) => (
              <Link
                key={index}
                href={resource.link}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{resource.icon}</span>
                    <span className="text-xs font-medium text-bloom-accent bg-bloom-accent/10 px-3 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-2 group-hover:text-bloom-accent transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-bloom text-sm">
                    {resource.description}
                  </p>
                  <div className="mt-4 flex items-center text-bloom-accent font-medium">
                    <span className="text-sm">Access Resource</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Most Popular Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Postpartum Checklist
              </h3>
              <p className="text-bloom mb-4">
                Downloaded over 5,000 times
              </p>
              <Button href="/resources/postpartum-checklist" variant="outline" size="sm">
                Download Free
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Self-Care Assessment
              </h3>
              <p className="text-bloom mb-4">
                Take the 5-minute assessment
              </p>
              <Button href="/resources/self-assessment" variant="outline" size="sm">
                Start Assessment
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Partner Communication
              </h3>
              <p className="text-bloom mb-4">
                Improve connection & support
              </p>
              <Button href="#communication-worksheet" variant="outline" size="sm">
                Get Worksheet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold text-bloom-dark mb-6">
              Need More Personalized Support?
            </h2>
            <p className="text-lg text-bloom mb-8">
              While our free resources are a great starting point, sometimes you need 
              more personalized guidance. Our courses and therapy services provide 
              deeper support for your unique journey.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-bloom-blush/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  Self-Paced Courses
                </h3>
                <p className="text-bloom mb-4">
                  Comprehensive programs with video lessons, worksheets, and community support
                </p>
                <Button href="/courses" variant="pink" size="sm">
                  Browse Courses
                </Button>
              </div>
              <div className="bg-bloom-accent/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  1-on-1 Therapy
                </h3>
                <p className="text-bloom mb-4">
                  Personalized support from licensed therapists specializing in maternal mental health
                </p>
                <Button href="/book" variant="pink" size="sm">
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}