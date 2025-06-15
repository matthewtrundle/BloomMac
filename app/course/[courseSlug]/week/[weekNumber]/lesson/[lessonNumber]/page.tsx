'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, FileText, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useCourseContent } from '@/lib/hooks/useCourseContent';
import { motion } from 'framer-motion';
import EnhancedSlideViewer from '@/components/course/EnhancedSlideViewer';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.courseSlug as string;
  const weekNumber = parseInt(params.weekNumber as string);
  const lessonNumber = parseInt(params.lessonNumber as string);
  
  const { lesson, loading, error } = useCourseContent(courseSlug, weekNumber, lessonNumber);

  // Parse HTML slides content
  let slides: string[] = [];
  let extractedStyles = '';
  
  if (lesson?.slides_html) {
    const html = lesson.slides_html;
    
    // Check if it's a full HTML document or just slide fragments
    if (html.includes('<!DOCTYPE')) {
      // Extract styles from head
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      if (styleMatch) {
        extractedStyles = `<style>${styleMatch[1]}</style>`;
      }
      
      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;
      
      // Split by slide separator and clean up
      slides = bodyContent
        .split('<!-- SLIDE -->')
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0);
      
      // Prepend styles to each slide to ensure consistent styling
      if (extractedStyles) {
        slides = slides.map(slide => extractedStyles + '\n' + slide);
      }
    } else {
      // Direct slide format (no HTML wrapper)
      slides = html
        .split('<!-- SLIDE -->')
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Failed to load lesson content</p>
            <Link href={`/course/${courseSlug}/week/${weekNumber}`} className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Week {weekNumber}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/course/${courseSlug}/week/${weekNumber}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Week {weekNumber}
            </Link>
            
            <h1 className="text-xl font-semibold text-gray-800">
              Lesson {lessonNumber}: {lesson.title}
            </h1>
            
            <div className="text-sm text-gray-600">
              {slides.length} slides
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Video Section */}
          {lesson.video_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <Video className="w-5 h-5 text-pink-600 mr-2" />
                <h2 className="text-lg font-semibold">Video Lesson</h2>
              </div>
              
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {lesson.video_url.includes('loom.com') ? (
                  <iframe
                    src={lesson.video_url.replace('share', 'embed')}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <a 
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Slides Section */}
          {slides.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-pink-600 mr-2" />
                <h2 className="text-lg font-semibold">Lesson Slides</h2>
              </div>
              
              {/* Enhanced Slide Viewer */}
              <EnhancedSlideViewer
                slides={slides}
                lessonTitle={lesson.title}
                lessonNumber={lessonNumber}
                weekNumber={weekNumber}
              />
            </motion.div>
          )}

          {/* Resources Section */}
          {lesson.resources && lesson.resources.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 text-pink-600 mr-2" />
                <h2 className="text-lg font-semibold">Additional Resources</h2>
              </div>
              
              <ul className="space-y-2">
                {lesson.resources.map((resource: any, index: number) => (
                  <li key={index}>
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 underline"
                    >
                      {resource.title || resource.url}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Next Lesson Button */}
          <div className="mt-12 text-center">
            {lessonNumber < 4 ? (
              <Link
                href={`/course/${courseSlug}/week/${weekNumber}/lesson/${lessonNumber + 1}`}
                className="btn-primary"
              >
                Continue to Lesson {lessonNumber + 1}
              </Link>
            ) : weekNumber < 6 ? (
              <Link
                href={`/course/${courseSlug}/week/${weekNumber + 1}/lesson/1`}
                className="btn-primary"
              >
                Continue to Week {weekNumber + 1}
              </Link>
            ) : (
              <Link
                href="/my-courses"
                className="btn-primary"
              >
                Complete Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}