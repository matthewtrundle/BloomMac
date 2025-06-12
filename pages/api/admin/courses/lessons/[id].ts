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
      const { data: lesson, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      return res.status(200).json({ lesson });
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return res.status(500).json({ error: 'Failed to fetch lesson' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const lessonData = req.body;

      const { data, error } = await supabase
        .from('course_lessons')
        .update({
          title: lessonData.title,
          description: lessonData.description,
          video_url: lessonData.video_url,
          video_duration_minutes: lessonData.video_duration_minutes,
          video_thumbnail_url: lessonData.video_thumbnail_url,
          slides_html: lessonData.slides_html,
          transcript: lessonData.transcript,
          video_script_formatted: lessonData.video_script || lessonData.video_script_formatted,
          script_notes: lessonData.script_notes,
          script_status: lessonData.script_status,
          script_duration_estimate: lessonData.script_duration_estimate,
          talking_points: lessonData.talking_points,
          is_published: lessonData.is_published,
          is_preview: lessonData.is_preview,
          resources: lessonData.resources,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ lesson: data });
    } catch (error) {
      console.error('Error updating lesson:', error);
      return res.status(500).json({ error: 'Failed to update lesson' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return res.status(500).json({ error: 'Failed to delete lesson' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}