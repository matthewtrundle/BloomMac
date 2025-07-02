'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Play, CheckCircle } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';
import WorkbookContainer from '@/components/workbook/WorkbookContainer';
import { enhancedCourseData } from '@/lib/data/enhanced-course-content';

// We'll render the video content inline instead of importing the page directly

function LessonWithWorkbook() {
  const [activeTab, setActiveTab] = useState<'video' | 'workbook'>('video');
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [workbookCompleted, setWorkbookCompleted] = useState(false);

  // Get workbook data for Week 1
  const courseData = enhancedCourseData['postpartum-wellness-foundations'];
  const week1Data = courseData.curriculum[0]; // Week 1
  const workbookData = week1Data.workbook;

  const handleWorkbookComplete = () => {
    setWorkbookCompleted(true);
    // Track completion
    // Could trigger achievement, update progress, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/course/week1"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Week 1
              </Link>
              
              <div className="text-gray-400">|</div>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Lesson 1: Welcome to Your Fourth Trimester
                </h1>
                <p className="text-sm text-gray-600">
                  Week 1 - Understanding Your Postpartum Journey
                </p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  videoCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {videoCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600">Video</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  workbookCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {workbookCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600">Workbook</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 border-t border-gray-200 -mb-px">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('video')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'video'
                    ? 'border-bloom-sage text-bloom-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Video Lesson
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('workbook')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'workbook'
                    ? 'border-bloom-sage text-bloom-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${!videoCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!videoCompleted}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Workbook
                  {!videoCompleted && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      Complete video first
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'video' ? (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video Content */}
            <div className="relative">
              {/* For now, show a placeholder - in production, you'd import the actual video component */}
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bloom-sage-50 to-bloom-pink-50">
                <div className="text-center">
                  <h2 className="text-4xl font-playfair text-bloom-dark mb-4">Video Lesson Content</h2>
                  <p className="text-xl text-bloom-dark/70 mb-8">The video slides would appear here</p>
                  <p className="text-sm text-bloom-dark/50">In production, this would show the actual lesson content</p>
                </div>
              </div>
              
              {/* Completion Button */}
              {!videoCompleted && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
                  <button
                    onClick={() => {
                      setVideoCompleted(true);
                      setActiveTab('workbook');
                    }}
                    className="bg-bloom-sage text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-bloom-sage/90 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Video Complete & Continue to Workbook
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workbook"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-8"
          >
            {/* Workbook Content */}
            <div className="container mx-auto px-4">
              <WorkbookContainer
                weekNumber={1}
                workbookData={workbookData}
                courseId="postpartum-wellness-foundations"
                onComplete={handleWorkbookComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LessonWithWorkbookPage() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <LessonWithWorkbook />
    </CourseAuthWrapper>
  );
}