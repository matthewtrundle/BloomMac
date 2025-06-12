import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { courseSlug, weekNumber, lessonNumber } = req.query;

  try {
    // For now, allow public access to test
    // TODO: Add authentication check for enrolled students

    if (!courseSlug) {
      return res.status(400).json({ error: 'Course slug is required' });
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, description')
      .eq('slug', courseSlug)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If specific week requested
    if (weekNumber) {
      const { data: module, error: moduleError } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons (
            id,
            lesson_number,
            title,
            description,
            video_url,
            video_duration_minutes,
            slides_html,
            transcript,
            resources,
            is_published,
            is_preview
          )
        `)
        .eq('course_id', course.id)
        .eq('week_number', parseInt(weekNumber as string))
        .single();

      if (moduleError || !module) {
        return res.status(404).json({ error: 'Week not found' });
      }

      // If specific lesson requested
      if (lessonNumber) {
        const lesson = module.course_lessons.find(
          (l: any) => l.lesson_number === parseInt(lessonNumber as string)
        );

        if (!lesson) {
          return res.status(404).json({ error: 'Lesson not found' });
        }

        // Parse resources if stored as JSON string
        if (lesson.resources && typeof lesson.resources === 'string') {
          try {
            lesson.resources = JSON.parse(lesson.resources);
          } catch (e) {
            lesson.resources = [];
          }
        }

        return res.status(200).json({
          course,
          module: {
            ...module,
            course_lessons: undefined
          },
          lesson
        });
      }

      return res.status(200).json({
        course,
        module
      });
    }

    // Get all modules for course overview
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', course.id)
      .order('week_number');

    if (modulesError) throw modulesError;

    return res.status(200).json({
      course,
      modules
    });

  } catch (error) {
    console.error('Error fetching course content:', error);
    return res.status(500).json({ error: 'Failed to fetch course content' });
  }
}