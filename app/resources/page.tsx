'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
      icon: '🧘',
      link: '/resources/grounding-techniques'
    },
    // For Partners
    {
      category: 'partners',
      title: 'Partner Support Checklist',
      description: 'Daily and weekly ways to support your partner',
      type: 'PDF Guide',
      icon: '💑',
      link: '/resources/partner-support-checklist'
    },
    {
      category: 'partners',
      title: 'Communication Worksheet',
      description: 'Navigate difficult conversations with empathy',
      type: 'Worksheet',
      icon: '💬',
      link: '/resources/communication-worksheet'
    },
    {
      category: 'partners',
      title: 'Warning Signs Guide',
      description: 'Recognize when professional help is needed',
      type: 'PDF Guide',
      icon: '⚠️',
      link: '/resources/warning-signs-guide'
    },
    // For Families
    {
      category: 'families',
      title: 'Family Boundaries Guide',
      description: 'Respect new parent boundaries while staying connected',
      type: 'PDF Guide',
      icon: '🏠',
      link: '/resources/family-boundaries-guide'
    },
    {
      category: 'families',
      title: 'Helpful vs Harmful Checklist',
      description: 'What helps (and what doesn\'t) for new families',
      type: 'Checklist',
      icon: '✅',
      link: '/resources/helpful-vs-harmful-checklist'
    },
    {
      category: 'families',
      title: 'Cultural Sensitivity Guide',
      description: 'Honor diverse parenting traditions and choices',
      type: 'PDF Guide',
      icon: '🌍',
      link: '/resources/cultural-sensitivity-guide'
    },
    // Emergency Resources
    {
      category: 'emergency',
      title: 'When to Seek Help',
      description: 'Know the signs that indicate professional support is needed',
      type: 'Guide',
      icon: '🏥',
      link: '/resources/when-to-seek-help'
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
      <section className="relative py-20 bg-gradient-to-br from-bloom-sage-50/20 via-white to-bloom-pink-50/10 overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative">
          <motion.h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-bloom-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Free <span className="text-bloompink">Resources</span>
          </motion.h1>
          
          {/* Professional divider */}
          <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto mb-6"></div>
          
          <motion.p 
            className="text-lg md:text-xl text-bloom max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Evidence-based tools and guides to support your mental health journey. 
            Download free resources created by licensed mental health professionals.
          </motion.p>
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
      <section className="py-8 bg-gradient-to-b from-white to-gray-50/50 sticky top-[120px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-bloom/60 mb-4">Filter by category:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 group ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-bloom-sage to-bloom-sage/80 text-white shadow-md'
                    : 'bg-white text-bloom hover:bg-bloom-sage-50 border border-bloom-sage/20 hover:border-bloom-sage/40'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
                {activeCategory === cat.id && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-1"
                  >
                    ✓
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section id="resources" className="py-16 bg-white relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Link href={resource.link} className="block h-full">
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-bloom-sage-50 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{resource.icon}</span>
                        </div>
                        <span className="text-sm text-bloom-sage font-medium px-3 py-1 bg-bloom-sage-50 rounded-full">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-bloom flex-grow mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center text-bloom-sage font-medium group">
                        <span>Download</span>
                        <svg 
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gradient-to-br from-bloom-sage-50/10 to-white relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative">
          <motion.h2 
            className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Most Popular <span className="text-bloompink">Resources</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-white to-bloom-pink-50/30 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all border border-bloom-pink-50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Postpartum Checklist
              </h3>
              <p className="text-bloom mb-4">
                Our most popular resource
              </p>
              <Button href="/resources/postpartum-checklist" variant="outline" size="sm">
                Download Free
              </Button>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-white to-bloom-sage-50/30 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all border border-bloom-sage-50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-bloom-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
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
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-white to-red-50/30 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all border border-red-50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Partner Communication
              </h3>
              <p className="text-bloom mb-4">
                Improve connection & support
              </p>
              <Button href="/resources/communication-worksheet" variant="outline" size="sm">
                Get Worksheet
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Support */}
      <section className="py-16 bg-white relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-playfair font-bold text-bloom-dark mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Need More <span className="text-bloompink">Personalized Support?</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-bloom mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              While our free resources are a great starting point, sometimes you need 
              more personalized guidance. Our courses and therapy services provide 
              deeper support for your unique journey.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-gradient-to-br from-bloom-pink-50/50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-bloom-pink-50"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  Self-Paced Courses
                </h3>
                <p className="text-bloom mb-4">
                  Comprehensive programs with video lessons, worksheets, and community support
                </p>
                <Button href="/courses" variant="pink" size="sm">
                  Browse Courses
                </Button>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-bloom-sage-50/50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-bloom-sage-50"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  1-on-1 Therapy
                </h3>
                <p className="text-bloom mb-4">
                  Personalized support from licensed therapists specializing in maternal mental health
                </p>
                <Button href="/book" variant="pink" size="sm">
                  Book Consultation
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <NewsletterSignup 
            variant="banner"
            source="resources_page"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}