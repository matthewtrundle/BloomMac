import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // For now, skip authentication to test
  // TODO: Add proper admin authentication

  if (req.method === 'GET') {
    try {
      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;

      // Fetch course modules with lessons
      const { data: modules, error: modulesError } = await supabase
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
            video_thumbnail_url,
            slides_html,
            transcript,
            video_script_formatted,
            script_notes,
            script_status,
            script_duration_estimate,
            talking_points,
            is_published,
            is_preview,
            resources,
            order_index
          )
        `)
        .eq('course_id', id)
        .order('week_number');

      if (modulesError) throw modulesError;

      // Fetch course resources/assets
      const { data: resources, error: resourcesError } = await supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;

      return res.status(200).json({
        course,
        weeks: modules,
        assets: resources || []
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      return res.status(500).json({ error: 'Failed to fetch course data' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const courseData = req.body;

      const { data, error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          slug: courseData.slug,
          description: courseData.description,
          subtitle: courseData.subtitle,
          is_active: courseData.status === 'published',
          duration: courseData.duration || courseData.duration_weeks ? `${courseData.duration_weeks} weeks` : courseData.duration,
          total_lessons: courseData.total_lessons,
          price: courseData.price,
          original_price: courseData.original_price,
          learning_outcomes: courseData.learning_outcomes,
          features: courseData.course_features || courseData.features,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ course: data });
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ error: 'Failed to update course' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}