'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Heart, 
  Clock, 
  Baby, 
  Users, 
  MessageCircle, 
  AlertTriangle,
  Home,
  CheckCircle,
  Globe,
  Phone,
  BookOpen,
  UserCheck,
  HeartHandshake,
  Family,
  AlertCircle,
  Download,
  ChevronRight,
  Star,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

interface Resource {
  category: string;
  title: string;
  description: string;
  type: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  link: string;
}

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const resources: Resource[] = [
    // For New Moms
    {
      category: 'moms',
      title: 'Postpartum Recovery Checklist',
      description: 'Week-by-week guide for physical and emotional recovery',
      type: 'PDF Guide',
      icon: FileText,
      iconColor: 'text-bloom-sage',
      bgColor: 'bg-bloom-sage-50',
      link: '/resources/postpartum-checklist'
    },
    {
      category: 'moms',
      title: 'Self-Care Assessment Tool',
      description: 'Evaluate your wellness across 8 key areas',
      type: 'Interactive',
      icon: Sparkles,
      iconColor: 'text-bloompink',
      bgColor: 'bg-bloom-pink-50',
      link: '/resources/self-assessment'
    },
    {
      category: 'moms',
      title: 'Micro Self-Care Guide',
      description: '50 self-care activities that take 5 minutes or less',
      type: 'PDF Guide',
      icon: Clock,
      iconColor: 'text-bloom-cream-dark',
      bgColor: 'bg-bloom-cream-50',
      link: '/resources/micro-self-care'
    },
    {
      category: 'moms',
      title: 'New Mom Survival Guide',
      description: 'Essential tips for the first 3 months',
      type: 'PDF Guide',
      icon: Baby,
      iconColor: 'text-bloom-sage',
      bgColor: 'bg-bloom-sage-50',
      link: '/resources/new-mom-guide'
    },
    {
      category: 'moms',
      title: 'Grounding Techniques',
      description: 'Manage anxiety with proven grounding exercises',
      type: 'Video Series',
      icon: Heart,
      iconColor: 'text-bloompink',
      bgColor: 'bg-bloom-pink-50',
      link: '/resources/grounding-techniques'
    },
    // For Partners
    {
      category: 'partners',
      title: 'Partner Support Checklist',
      description: 'Daily and weekly ways to support your partner',
      type: 'PDF Guide',
      icon: HeartHandshake,
      iconColor: 'text-bloom-sage',
      bgColor: 'bg-bloom-sage-50',
      link: '/resources/partner-support-checklist'
    },
    {
      category: 'partners',
      title: 'Communication Worksheet',
      description: 'Navigate difficult conversations with empathy',
      type: 'Worksheet',
      icon: MessageCircle,
      iconColor: 'text-bloompink',
      bgColor: 'bg-bloom-pink-50',
      link: '/resources/communication-worksheet'
    },
    {
      category: 'partners',
      title: 'Warning Signs Guide',
      description: 'Recognize when professional help is needed',
      type: 'PDF Guide',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      link: '/resources/warning-signs-guide'
    },
    // For Families
    {
      category: 'families',
      title: 'Family Boundaries Guide',
      description: 'Respect new parent boundaries while staying connected',
      type: 'PDF Guide',
      icon: Home,
      iconColor: 'text-bloom-sage',
      bgColor: 'bg-bloom-sage-50',
      link: '/resources/family-boundaries-guide'
    },
    {
      category: 'families',
      title: 'Helpful vs Harmful Checklist',
      description: 'What helps (and what doesn\'t) for new families',
      type: 'Checklist',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      link: '/resources/helpful-vs-harmful-checklist'
    },
    {
      category: 'families',
      title: 'Cultural Sensitivity Guide',
      description: 'Honor diverse parenting traditions and choices',
      type: 'PDF Guide',
      icon: Globe,
      iconColor: 'text-bloom-cream-dark',
      bgColor: 'bg-bloom-cream-50',
      link: '/resources/cultural-sensitivity-guide'
    },
    // Emergency Resources
    {
      category: 'emergency',
      title: 'When to Seek Help',
      description: 'Know the signs that indicate professional support is needed',
      type: 'Guide',
      icon: Phone,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      link: '/resources/when-to-seek-help'
    }
  ];

  const categories: Category[] = [
    { id: 'all', label: 'All Resources', icon: BookOpen, iconColor: 'text-bloom-dark' },
    { id: 'moms', label: 'For New Moms', icon: Baby, iconColor: 'text-bloompink' },
    { id: 'partners', label: 'For Partners', icon: HeartHandshake, iconColor: 'text-bloom-sage' },
    { id: 'families', label: 'For Families', icon: Family, iconColor: 'text-bloom-cream-dark' },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle, iconColor: 'text-red-500' }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Free <span className="text-bloompink">Resources</span>
            </motion.h1>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto mb-6"></div>
            
            <motion.p 
              className="text-xl text-bloom-dark/80 max-w-3xl mx-auto mb-8"
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
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-bloom-dark/60 mb-4">Filter by category:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 group ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-bloompink to-bloom-pink-dark text-white shadow-md'
                      : 'bg-white text-bloom-dark hover:bg-bloom-sage-50 border border-bloom-sage/20 hover:border-bloom-sage/40'
                  }`}
                >
                  {IconComponent ? (
                    <IconComponent className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : cat.iconColor || 'text-bloom-dark'}`} />
                  ) : (
                    <BookOpen className="w-4 h-4 text-bloom-dark" />
                  )}
                  {cat.label}
                  {activeCategory === cat.id && (
                    <CheckCircle className="w-4 h-4 text-white ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section id="resources" className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {filteredResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Link href={resource.link} className="block h-full">
                      <div className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-2xl shadow-soft p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 ${resource.bgColor || 'bg-bloom-sage-50'} rounded-xl flex items-center justify-center`}>
                            {IconComponent ? (
                              <IconComponent className={`w-6 h-6 ${resource.iconColor || 'text-bloom-sage'}`} />
                            ) : (
                              <FileText className="w-6 h-6 text-bloom-sage" />
                            )}
                          </div>
                          <span className="text-sm text-bloom-sage font-medium px-3 py-1 bg-bloom-sage-50 rounded-full">
                            {resource.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-bloom-dark/70 flex-grow mb-4">
                          {resource.description}
                        </p>
                        <div className="flex items-center text-bloom-sage font-medium group">
                          <Download className="w-4 h-4 mr-2" />
                          <span>Download</span>
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 px-4 bg-gradient-to-br from-bloom-sage-50/30 to-white">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-playfair text-center text-bloom-dark mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Most Popular <span className="text-bloompink">Resources</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-white to-bloom-pink-50/30 rounded-xl p-6 text-center shadow-soft hover:shadow-lg transition-all border border-bloom-pink-50/50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-bloompink" />
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Postpartum Checklist
              </h3>
              <p className="text-bloom-dark/70 mb-4">
                Our most popular resource
              </p>
              <Button href="/resources/postpartum-checklist" variant="outline" size="sm">
                Download Free
              </Button>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-white to-bloom-sage-50/30 rounded-xl p-6 text-center shadow-soft hover:shadow-lg transition-all border border-bloom-sage-50/50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-bloom-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-bloom-sage" />
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Self-Care Assessment
              </h3>
              <p className="text-bloom-dark/70 mb-4">
                Take the 5-minute assessment
              </p>
              <Button href="/resources/self-assessment" variant="outline" size="sm">
                Start Assessment
              </Button>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-white to-bloom-cream-50/30 rounded-xl p-6 text-center shadow-soft hover:shadow-lg transition-all border border-bloom-cream-50/50"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-bloom-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-bloom-cream-dark" />
              </div>
              <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                Partner Communication
              </h3>
              <p className="text-bloom-dark/70 mb-4">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-playfair text-bloom-dark mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Need More <span className="text-bloompink">Personalized Support?</span>
            </motion.h2>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto mb-8"></div>
            
            <motion.p 
              className="text-lg text-bloom-dark/70 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              While our free resources are a great starting point, sometimes you need 
              more personalized guidance. Our courses and therapy services provide 
              deeper support for your unique journey.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gradient-to-br from-white to-bloom-pink-50/20 border border-bloom-pink-50/50 rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-bloom-pink-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-bloompink" />
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  Self-Paced Courses
                </h3>
                <p className="text-bloom-dark/70 mb-6">
                  Comprehensive programs with video lessons, worksheets, and community support
                </p>
                <Button href="/courses" variant="pink" size="sm">
                  Browse Courses
                </Button>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage-50/50 rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-bloom-sage-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-8 h-8 text-bloom-sage" />
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                  1-on-1 Therapy
                </h3>
                <p className="text-bloom-dark/70 mb-6">
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
      <section className="py-20 px-4 bg-gradient-to-r from-bloom-pink-50 to-bloom-sage-50">
        <div className="container mx-auto">
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