'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Maximize2, X } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  slides_html: string;
  lesson_number: number;
}

export default function LessonPreviewPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const response = await fetch(`/api/admin/courses/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch lesson');
      
      const data = await response.json();
      setLesson(data.lesson);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Lesson not found</h1>
          <Link href={`/admin/courses/${courseId}/edit`} className="text-bloompink hover:text-bloom-pink-dark">
            ← Back to Course Editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      {!fullscreen && (
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href={`/admin/courses/${courseId}/edit`}
                  className="flex items-center gap-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Editor
                </Link>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-bloom-dark">
                  Preview: Lesson {lesson.lesson_number} - {lesson.title}
                </h1>
              </div>
              
              <button
                onClick={() => setFullscreen(true)}
                className="flex items-center gap-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Close Button */}
      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Content */}
      <div className={`${fullscreen ? 'h-screen overflow-auto' : 'container mx-auto px-6 py-8'}`}>
        <div className={`${fullscreen ? 'max-w-6xl mx-auto p-8' : 'max-w-4xl mx-auto'}`}>
          {lesson.slides_html ? (
            <div className="bg-white rounded-lg shadow-soft p-8">
              <div 
                className="prose prose-lg max-w-none slide-content"
                dangerouslySetInnerHTML={{ __html: lesson.slides_html }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-soft p-12 text-center">
              <p className="text-gray-500 text-lg">No slides content available for this lesson yet.</p>
              <Link 
                href={`/admin/courses/${courseId}/edit`}
                className="inline-block mt-4 text-bloompink hover:text-bloom-pink-dark"
              >
                Add slides in the editor →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Custom styles for slides */}
      <style jsx global>{`
        .slide-content h1 {
          color: #2d3748;
          margin-bottom: 1.5rem;
        }
        
        .slide-content h2 {
          color: #4a5568;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .slide-content h3 {
          color: #718096;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .slide-content ul {
          list-style-type: disc;
          margin-left: 2rem;
        }
        
        .slide-content ol {
          list-style-type: decimal;
          margin-left: 2rem;
        }
        
        .slide-content blockquote {
          border-left: 4px solid #e2348d;
          padding-left: 1rem;
          font-style: italic;
          color: #718096;
        }
        
        .slide-content pre {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
        }
        
        .slide-content code {
          background-color: #f7fafc;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        
        .slide-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem auto;
        }
        
        .slide-content hr {
          border-color: #e2e8f0;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}