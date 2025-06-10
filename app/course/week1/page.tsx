'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Headphones, Users } from 'lucide-react';

const lessons = [
  {
    id: 1,
    title: 'Welcome to Your Fourth Trimester',
    description: 'Understanding your new reality and creating a foundation for healing',
    duration: '8 minutes',
    slides: 13,
    status: 'ready',
    path: '/course/week1/lesson1'
  },
  {
    id: 2,
    title: 'Your Body\'s Wisdom - Recovery Reimagined',
    description: 'Understanding physical recovery with compassion and realistic expectations',
    duration: '12 minutes',
    slides: 9,
    status: 'ready',
    path: '/course/week1/lesson2'
  },
  {
    id: 3,
    title: 'Emotional Alchemy - Transforming Difficult Feelings',
    description: 'Navigate the full spectrum of motherhood emotions with wisdom and tools',
    duration: '14 minutes',
    slides: 10,
    status: 'ready',
    path: '/course/week1/lesson3'
  },
  {
    id: 4,
    title: 'Building Your Foundation',
    description: 'Creating your personal support system for wellness',
    duration: '11 minutes',
    slides: 9,
    status: 'ready',
    path: '/course/week1/lesson4'
  }
];

const resources = [
  {
    icon: FileText,
    title: 'Week 1 Workbook',
    description: 'Printable exercises and reflections',
    link: '/resources/week1-workbook.pdf'
  },
  {
    icon: Headphones,
    title: 'Guided Meditation',
    description: '10-minute grounding practice',
    link: '/resources/week1-meditation.mp3'
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with other moms',
    link: '/community/week1'
  }
];

export default function Week1Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 relative overflow-hidden">
      {/* Garden lattice pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="week-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#week-lattice)" />
        </svg>
      </div>
      
      {/* Floating garden elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-32 w-2 h-2 bg-bloom-sage/30 rounded-full animate-bounce"></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/learn/postpartum-wellness-foundations"
                className="text-bloom-dark/70 hover:text-bloom-dark mb-2 inline-block"
              >
                ← Back to Course Overview
              </Link>
              <h1 className="text-3xl font-playfair text-bloom-dark">Week 1: Understanding Your Fourth Trimester</h1>
              
              {/* Decorative flower divider */}
              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
                <svg className="w-4 h-4 text-bloom-sage/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={lesson.status === 'ready' ? lesson.path : '#'}
                    className={`block bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-xl shadow-soft p-6 transition-all group ${
                      lesson.status === 'ready' 
                        ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
                        : 'opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full transition-colors ${
                        lesson.status === 'ready' 
                          ? 'bg-bloom-sage-100 group-hover:bg-bloom-sage-200' 
                          : 'bg-gray-100'
                      }`}>
                        <PlayCircle className={`w-6 h-6 ${
                          lesson.status === 'ready' 
                            ? 'text-bloom-sage' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              Lesson {lesson.id}: {lesson.title}
                            </h3>
                            <p className="text-bloom-dark/70 mb-3">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-bloom-dark/60">
                              <span>{lesson.duration}</span>
                              <span>•</span>
                              <span>{lesson.slides} slides</span>
                              {lesson.status === 'ready' && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Ready to View
                                </span>
                              )}
                            </div>
                          </div>
                          {lesson.status === 'coming-soon' && (
                            <span className="bg-bloom-pink-light text-bloom-pink px-3 py-1 rounded-full text-sm">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Week 1 Resources</h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={resource.link}
                    className="block bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-xl shadow-soft p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-bloom-sage-50 rounded-full group-hover:bg-bloom-sage-100 transition-colors">
                        <resource.icon className="w-6 h-6 text-bloom-sage group-hover:text-bloom-sage-dark transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-bloom-dark/70">{resource.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-br from-bloom-sage to-bloom-sage-dark text-white rounded-xl p-6 shadow-lg border border-bloom-sage/20"
            >
              <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
              <div className="mb-4">
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div className="bg-white rounded-full h-3 w-full transition-all"></div>
                </div>
                <p className="text-sm opacity-90">4 of 4 lessons available</p>
              </div>
              <p className="text-sm opacity-80">
                Complete all lessons to unlock your Week 1 certificate!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}