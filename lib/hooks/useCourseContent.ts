import { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Module {
  id: string;
  week_number: number;
  title: string;
  description: string;
  objectives: string[];
  course_lessons?: Lesson[];
}

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  description: string;
  video_url?: string;
  video_duration_minutes?: number;
  slides_html?: string;
  transcript?: string;
  is_published: boolean;
  is_preview: boolean;
}

interface CourseContentResult {
  course: Course | null;
  module: Module | null;
  modules: Module[] | null;
  lesson: Lesson | null;
  loading: boolean;
  error: string | null;
}

export function useCourseContent(
  courseSlug: string,
  weekNumber?: number,
  lessonNumber?: number
): CourseContentResult {
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[] | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams({ courseSlug });
        if (weekNumber) params.append('weekNumber', weekNumber.toString());
        if (lessonNumber) params.append('lessonNumber', lessonNumber.toString());

        const response = await fetch(`/api/course/content?${params}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch content');
        }

        const data = await response.json();
        
        setCourse(data.course);
        
        if (data.module) {
          setModule(data.module);
        }
        
        if (data.modules) {
          setModules(data.modules);
        }
        
        if (data.lesson) {
          setLesson(data.lesson);
        }

      } catch (err) {
        console.error('Error fetching course content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      fetchContent();
    }
  }, [courseSlug, weekNumber, lessonNumber]);

  return { course, module, modules, lesson, loading, error };
}