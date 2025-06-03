'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { enhancedCourseData } from '@/lib/data/enhanced-course-content';
import weeks3to6Content from '@/lib/data/weeks-3-6-content';

// Enhanced course data with expert consultation from e-learning specialists and postpartum psychologists  
const coursesData: Record<string, any> = {
  'postpartum-wellness-foundations': {
    ...enhancedCourseData['postpartum-wellness-foundations'],
    curriculum: [
      ...enhancedCourseData['postpartum-wellness-foundations'].curriculum,
      ...weeks3to6Content
    ]
  }
};

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const course = coursesData[courseId];
  
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [workbookResponses, setWorkbookResponses] = useState<Record<string, any>>({});
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('course_auth_token');
    if (!token) {
      router.push('/my-courses');
      return;
    }
    setIsAuthenticated(true);

    // Set first lesson as current if none selected
    if (course && !currentLesson) {
      setCurrentLesson(course.curriculum[0].lessons[0]);
    }

    // Load saved progress from localStorage (in production, this would come from the database)
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    if (savedProgress) {
      setLessonProgress(JSON.parse(savedProgress));
    }

    // Load saved workbook responses
    const savedResponses = localStorage.getItem(`workbook_responses_${courseId}`);
    if (savedResponses) {
      setWorkbookResponses(JSON.parse(savedResponses));
    }
  }, [courseId, course, currentLesson, router]);

  // Auto-save functionality with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const autoSave = () => {
      localStorage.setItem(`workbook_responses_${courseId}`, JSON.stringify(workbookResponses));
    };

    // Debounce auto-save by 2 seconds
    clearTimeout(timeoutId);
    timeoutId = setTimeout(autoSave, 2000);

    return () => clearTimeout(timeoutId);
  }, [workbookResponses, courseId]);

  const markLessonComplete = (lessonId: string) => {
    const newProgress = { ...lessonProgress, [lessonId]: true };
    setLessonProgress(newProgress);
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newProgress));
  };

  const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

  const saveWorkbookResponse = async (questionId: string, response: any) => {
    setSaveStatus(prev => ({ ...prev, [questionId]: 'saving' }));
    
    try {
      const newResponses = { ...workbookResponses, [questionId]: response };
      setWorkbookResponses(newResponses);
      
      // Save to localStorage immediately
      localStorage.setItem(`workbook_responses_${courseId}`, JSON.stringify(newResponses));
      
      // In production, also save to database
      // await fetch('/api/save-workbook-response', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ courseId, questionId, response })
      // });
      
      setSaveStatus(prev => ({ ...prev, [questionId]: 'saved' }));
      
      // Clear saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[questionId];
          return newStatus;
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error saving workbook response:', error);
      setSaveStatus(prev => ({ ...prev, [questionId]: 'error' }));
    }
  };

  const getCompletionPercentage = () => {
    if (!course) return 0;
    const totalLessons = course.curriculum.reduce((acc: number, week: any) => acc + week.lessons.length, 0);
    const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const isWeekComplete = (weekData: any) => {
    return weekData.lessons.every((lesson: any) => lessonProgress[lesson.id]);
  };

  const hasAnsweredAllWorkbookQuestions = (weekData: any) => {
    if (!weekData.workbook) return true;
    return weekData.workbook.questions.every((question: any) => {
      if (question.type === 'support_mapping') {
        return question.categories.some((_: any, catIndex: number) => 
          workbookResponses[`${question.id}_${catIndex}`]
        );
      }
      return workbookResponses[question.id];
    });
  };

  const submitWeekWorkbook = () => {
    const weekData = currentWeekData;
    if (!weekData) return;

    // In production, this would send to backend
    console.log('Submitting week workbook:', {
      courseId,
      week: weekData.week,
      responses: workbookResponses,
      completedAt: new Date().toISOString()
    });

    // Show success message
    alert(`Week ${weekData.week} workbook submitted! Great work on completing this week's reflections.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink mx-auto mb-4"></div>
          <p className="text-bloom-dark/60">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Course not found</h1>
          <Link href="/my-courses" className="text-bloompink hover:underline">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentWeekData = course.curriculum[currentWeek];

  return (
    <div className="min-h-screen bg-bloom-offwhite flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 z-50 ${
        sidebarOpen 
          ? 'w-80 fixed lg:relative inset-y-0 left-0 lg:translate-x-0' 
          : 'w-16 lg:w-16 -translate-x-full lg:translate-x-0 fixed lg:relative'
      } flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex-1 min-w-0 mr-3">
                <h1 className="font-semibold text-bloom-dark truncate text-sm leading-tight">{course.title}</h1>
                <div className="text-xs text-bloom-dark/60 mt-1">
                  {getCompletionPercentage()}% Complete
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-bloompink h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-bloom-sage-50 transition-colors flex-shrink-0 group"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {sidebarOpen && (
          <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 100px)' }}>
            {course.curriculum.map((week: any, weekIndex: number) => (
              <div key={week.week} className="space-y-2">
                <button
                  onClick={() => setCurrentWeek(weekIndex)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentWeek === weekIndex ? 'bg-bloompink text-white' : 'bg-bloom-sage-50 hover:bg-bloom-sage-100'
                  }`}
                >
                  <div className="font-medium text-sm leading-tight truncate">Week {week.week}: {week.title}</div>
                  <div className={`text-xs mt-1 ${currentWeek === weekIndex ? 'text-white/80' : 'text-bloom-dark/60'}`}>
                    {week.lessons.length} lessons
                  </div>
                </button>
                
                {currentWeek === weekIndex && (
                  <div className="ml-4 space-y-1">
                    {week.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors flex items-start gap-2 ${
                          currentLesson?.id === lesson.id ? 'bg-bloom-pink-50 text-bloompink' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          lessonProgress[lesson.id] ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {lessonProgress[lesson.id] && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs leading-tight truncate">{lesson.title}</div>
                          <div className="text-xs text-bloom-dark/60 mt-0.5">{lesson.duration}</div>
                        </div>
                      </button>
                    ))}
                    
                    {/* Week Materials */}
                    <div className="mt-3 space-y-1">
                      <div className="w-full text-left p-2 rounded text-sm bg-bloom-cream-50 flex items-center gap-2">
                        <svg className="w-3 h-3 text-bloom-cream-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-bloom-dark/70 truncate">Workbook</span>
                      </div>
                      <div className="w-full text-left p-2 rounded text-sm bg-bloom-sage-50 flex items-center gap-2">
                        <svg className="w-3 h-3 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span className="text-xs text-bloom-dark/70 truncate">Meditation</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/my-courses"
                className="w-full text-center bg-bloom-sage text-white py-2 px-4 rounded-lg hover:bg-bloom-sage-dark transition-colors block text-sm"
              >
                📚 My Courses
              </Link>
              <Link
                href="/"
                className="w-full text-center bg-bloompink text-white py-2 px-4 rounded-lg hover:bg-bloom-pink-dark transition-colors block text-sm"
              >
                🏠 Main Site
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('course_auth_token');
                  window.location.href = '/my-courses';
                }}
                className="w-full text-center bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-bloom-sage-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl lg:text-2xl font-semibold text-bloom-dark">{currentLesson?.title}</h1>
              </div>
              <p className="text-sm lg:text-base text-bloom-dark/60">{currentLesson?.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-bloom-dark/60 bg-bloom-sage-50 px-3 py-1 rounded-full">
                {currentLesson?.duration}
              </span>
              {!lessonProgress[currentLesson?.id] && (
                <button
                  onClick={() => currentLesson && markLessonComplete(currentLesson.id)}
                  className="bg-bloompink text-white px-4 py-2 rounded-lg text-sm hover:bg-bloom-pink-dark transition-colors whitespace-nowrap"
                >
                  Mark Complete
                </button>
              )}
              {lessonProgress[currentLesson?.id] && (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="flex-1 p-6">
          {currentLesson?.type === 'video' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M9 7l3 3 3-3" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">{currentLesson.title}</p>
                  <p className="text-white/80">Video content will be embedded here</p>
                  <p className="text-sm text-white/60 mt-2">Duration: {currentLesson.duration}</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-2 text-bloom-dark hover:text-bloompink transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                </button>
              </div>

              {/* Transcript */}
              {showTranscript && (
                <div className="bg-white rounded-lg p-6 mb-6 shadow-soft">
                  <h3 className="font-semibold text-bloom-dark mb-4">Video Transcript</h3>
                  <p className="text-bloom-dark/80 leading-relaxed">
                    {currentLesson.transcript}
                  </p>
                </div>
              )}

              {/* Enhanced Workbook Section */}
              {currentWeekData?.workbook && (
                <div className="bg-white rounded-lg p-6 shadow-soft">
                  <div className="mb-6">
                    <h3 className="font-semibold text-bloom-dark mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {currentWeekData.workbook.title}
                    </h3>
                    {currentWeekData.workbook.therapeuticFocus && (
                      <p className="text-sm text-bloom-dark/60 italic">
                        Focus: {currentWeekData.workbook.therapeuticFocus}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    {currentWeekData.workbook.questions.map((question: any, index: number) => (
                      <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-bloom-dark">
                              {index + 1}. {question.question}
                            </h4>
                            {saveStatus[question.id] && (
                              <div className="flex items-center gap-1 text-xs">
                                {saveStatus[question.id] === 'saving' && (
                                  <>
                                    <div className="animate-spin w-3 h-3 border border-gray-300 border-t-bloompink rounded-full"></div>
                                    <span className="text-gray-500">Saving...</span>
                                  </>
                                )}
                                {saveStatus[question.id] === 'saved' && (
                                  <>
                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-600">Saved</span>
                                  </>
                                )}
                                {saveStatus[question.id] === 'error' && (
                                  <>
                                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-red-600">Error</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {question.instructions && (
                            <p className="text-sm text-bloom-dark/70 mb-3">
                              {question.instructions}
                            </p>
                          )}
                          
                          {question.therapeuticPurpose && (
                            <div className="bg-bloom-sage-50 px-3 py-2 rounded-lg mb-3">
                              <p className="text-xs text-bloom-sage font-medium">
                                💡 Therapeutic purpose: {question.therapeuticPurpose}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Enhanced Question Types */}
                        {(question.type === 'text' || question.type === 'reflection_journal' || question.type === 'attachment_moment') && (
                          <div className="space-y-3">
                            <textarea
                              placeholder={question.placeholder}
                              value={workbookResponses[question.id] || ''}
                              onChange={(e) => saveWorkbookResponse(question.id, e.target.value)}
                              rows={question.type === 'text' ? 2 : 4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent resize-none"
                            />
                            {question.followUp && workbookResponses[question.id] && (
                              <div className="ml-4 border-l-2 border-bloom-sage-200 pl-4">
                                <label className="block text-sm font-medium text-bloom-dark mb-2">
                                  {question.followUp}
                                </label>
                                <textarea
                                  placeholder="Your reflection..."
                                  value={workbookResponses[`${question.id}_followup`] || ''}
                                  onChange={(e) => saveWorkbookResponse(`${question.id}_followup`, e.target.value)}
                                  rows={2}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent resize-none"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {question.type === 'scale' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-bloom-dark/60 min-w-[80px]">
                                {question.labels?.[question.min] || question.min}
                              </span>
                              <input
                                type="range"
                                min={question.min}
                                max={question.max}
                                value={workbookResponses[question.id] || question.min}
                                onChange={(e) => saveWorkbookResponse(question.id, parseInt(e.target.value))}
                                className="flex-1"
                              />
                              <span className="text-sm text-bloom-dark/60 min-w-[80px] text-right">
                                {question.labels?.[question.max] || question.max}
                              </span>
                              <span className="text-lg font-medium text-bloompink min-w-[2rem] text-center">
                                {workbookResponses[question.id] || question.min}
                              </span>
                            </div>
                            {question.followUp && workbookResponses[question.id] && (
                              <div className="ml-4 border-l-2 border-bloom-sage-200 pl-4">
                                <label className="block text-sm font-medium text-bloom-dark mb-2">
                                  {question.followUp}
                                </label>
                                <textarea
                                  placeholder="What would help you feel more supported?"
                                  value={workbookResponses[`${question.id}_followup`] || ''}
                                  onChange={(e) => saveWorkbookResponse(`${question.id}_followup`, e.target.value)}
                                  rows={2}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent resize-none"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {question.type === 'support_mapping' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            {question.categories.map((category: any, catIndex: number) => (
                              <div key={catIndex} className="space-y-2">
                                <label className="block text-sm font-medium text-bloom-dark">
                                  {category.name}
                                </label>
                                <textarea
                                  placeholder={category.placeholder}
                                  value={workbookResponses[`${question.id}_${catIndex}`] || ''}
                                  onChange={(e) => saveWorkbookResponse(`${question.id}_${catIndex}`, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent resize-none text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
                      <div className="bg-bloom-sage-50 p-4 rounded-lg">
                        <p className="text-sm text-bloom-dark/70">
                          <span className="font-medium">💾 Auto-save:</span> Your responses are automatically saved as you type.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href={currentWeekData.workbook.downloadUrl}
                          download
                          className="bg-bloom-sage text-white px-6 py-3 rounded-lg hover:bg-bloom-sage-dark transition-colors text-center"
                        >
                          Download PDF
                        </a>
                        
                        {/* Smart Submit Button */}
                        {isWeekComplete(currentWeekData) && hasAnsweredAllWorkbookQuestions(currentWeekData) ? (
                          <button
                            onClick={submitWeekWorkbook}
                            className="bg-bloompink text-white px-8 py-4 rounded-lg hover:bg-bloom-pink-dark transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 min-w-[280px]"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submit Week {currentWeekData.week} Workbook
                          </button>
                        ) : (
                          <div className="bg-gray-100 px-6 py-3 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-2">
                              Complete all lessons and workbook questions to submit
                            </p>
                            <div className="text-xs text-gray-500">
                              {!isWeekComplete(currentWeekData) && "• Finish all video lessons"}
                              {!isWeekComplete(currentWeekData) && !hasAnsweredAllWorkbookQuestions(currentWeekData) && " • "}
                              {!hasAnsweredAllWorkbookQuestions(currentWeekData) && "Answer all workbook questions"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}