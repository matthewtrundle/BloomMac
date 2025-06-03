'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Headphones, Users } from 'lucide-react';

const lessons = [
  {
    id: 1,
    title: 'Communicating Needs Without Guilt',
    description: 'Learning to ask for what you need with confidence',
    duration: '14 minutes',
    slides: 18,
    status: 'ready',
    path: '/course/week4/lesson1'
  },
  {
    id: 2,
    title: 'Building Support Systems That Actually Support',
    description: 'Creating networks that truly meet your needs',
    duration: '13 minutes',
    slides: 16,
    status: 'ready',
    path: '/course/week4/lesson2'
  },
  {
    id: 3,
    title: 'Navigating Family Dynamics and Expectations',
    description: 'Setting boundaries with love and clarity',
    duration: '15 minutes',
    slides: 19,
    status: 'ready',
    path: '/course/week4/lesson3'
  },
  {
    id: 4,
    title: 'Creating Authentic Friendships in Motherhood',
    description: 'Building meaningful connections that last',
    duration: '12 minutes',
    slides: 15,
    status: 'ready',
    path: '/course/week4/lesson4'
  }
];

const resources = [
  {
    icon: FileText,
    title: 'Week 4 Workbook',
    description: 'Communication scripts & relationship mapping',
    link: '/resources/week4-workbook.pdf'
  },
  {
    icon: Headphones,
    title: 'Guided Meditation',
    description: '12-minute relationship healing practice',
    link: '/resources/week4-meditation.mp3'
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with other mothers',
    link: '/community/week4'
  }
];

export default function Week4Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
              <h1 className="text-3xl font-playfair text-bloom-dark">Week 4: Relationships & Communication</h1>
              <p className="text-bloom-dark/60 mt-2">Building Your Support Network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-12"
        >
          <h2 className="text-2xl font-playfair mb-4">You Don't Have to Do This Alone</h2>
          <p className="text-lg text-blue-100 max-w-3xl">
            Sustainable wellbeing isn't a solo journey. This week, we focus on the relationships that sustain us - 
            learning to communicate your needs, set boundaries, and create the support system you deserve.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
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
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                      }`}>
                        <PlayCircle className={`w-6 h-6 ${
                          lesson.status === 'ready' 
                            ? 'text-blue-600' 
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
            <h2 className="text-2xl font-semibold mb-6">Week 4 Resources</h2>
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
                      <div className="p-3 bg-blue-50 rounded-full">
                        <resource.icon className="w-6 h-6 text-blue-600" />
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
              className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
              <div className="mb-4">
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div className="bg-white rounded-full h-3 w-full transition-all"></div>
                </div>
                <p className="text-sm opacity-90">4 of 4 lessons available</p>
              </div>
              <p className="text-sm opacity-80">
                Build the support network you deserve!
              </p>
            </motion.div>

            {/* Week Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>How to communicate your needs without guilt or resentment</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Building support systems that actually meet your needs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Setting loving boundaries with family and in-laws</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Creating authentic friendships that survive motherhood</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}