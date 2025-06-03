'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Headphones, Users } from 'lucide-react';

const lessons = [
  {
    id: 1,
    title: 'Understanding the Mood-Action Connection',
    description: 'Breaking the cycle of depression and inactivity',
    duration: '12 minutes',
    slides: 18,
    status: 'ready',
    path: '/course/week3/lesson1'
  },
  {
    id: 2,
    title: 'Values Exploration & Clarification',
    description: 'Rediscovering what matters most to you',
    duration: '14 minutes',
    slides: 20,
    status: 'ready',
    path: '/course/week3/lesson2'
  },
  {
    id: 3,
    title: 'Joy & Meaning Reconstruction',
    description: 'Rebuilding pleasure and purpose in daily life',
    duration: '13 minutes',
    slides: 19,
    status: 'ready',
    path: '/course/week3/lesson3'
  },
  {
    id: 4,
    title: 'Building Momentum',
    description: 'Creating sustainable habits and energy',
    duration: '12 minutes',
    slides: 17,
    status: 'ready',
    path: '/course/week3/lesson4'
  }
];

const resources = [
  {
    icon: FileText,
    title: 'Week 3 Workbook',
    description: 'Activity planning & values worksheets',
    link: '/resources/week3-workbook.pdf'
  },
  {
    icon: Headphones,
    title: 'Guided Meditation',
    description: '15-minute joy cultivation practice',
    link: '/resources/week3-meditation.mp3'
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Share your wins and challenges',
    link: '/community/week3'
  }
];

export default function Week3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/learn/postpartum-wellness-foundations"
                className="text-bloom-dark/70 hover:text-bloom-dark mb-2 inline-block"
              >
                ← Back to Course Overview
              </Link>
              <h1 className="text-3xl font-playfair text-bloom-dark">Week 3: Behavioral Activation & Joy</h1>
              <p className="text-bloom-dark/60 mt-2">From Surviving to Thriving</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
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
                    className={`block bg-white rounded-xl shadow-soft p-6 transition-all ${
                      lesson.status === 'ready' 
                        ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' 
                        : 'opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        lesson.status === 'ready' 
                          ? 'bg-amber-100' 
                          : 'bg-gray-100'
                      }`}>
                        <PlayCircle className={`w-6 h-6 ${
                          lesson.status === 'ready' 
                            ? 'text-amber-600' 
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
            <h2 className="text-2xl font-semibold mb-6">Week 3 Resources</h2>
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
                    className="block bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-full">
                        <resource.icon className="w-6 h-6 text-amber-600" />
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
              className="mt-8 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
              <div className="mb-4">
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div className="bg-white rounded-full h-3 w-full transition-all"></div>
                </div>
                <p className="text-sm opacity-90">4 of 4 lessons available</p>
              </div>
              <p className="text-sm opacity-80">
                Rebuild joy and meaning in your daily life!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}