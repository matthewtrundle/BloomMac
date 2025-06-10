import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to verify admin access
async function verifyAdminAccess(req: NextApiRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user?.email) return false;
    
    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .single();
      
    return !!adminUser;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify admin access
    const isAdmin = await verifyAdminAccess(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id);
      case 'PATCH':
        return await handlePatch(req, res, id);
      case 'DELETE':
        return await handleDelete(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, courseId: string) {
  try {
    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('course_content')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) {
      if (courseError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Course not found' });
      }
      throw courseError;
    }

    // Get course weeks with lessons
    const { data: weeks, error: weeksError } = await supabase
      .from('course_weeks')
      .select(`
        *,
        course_lessons(*)
      `)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('week_number');

    if (weeksError) throw weeksError;

    // Get course assets
    const { data: assets, error: assetsError } = await supabase
      .from('course_assets')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (assetsError) throw assetsError;

    return res.status(200).json({
      course,
      weeks: weeks || [],
      assets: assets || []
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse, courseId: string) {
  try {
    const updateData = req.body;
    
    // Remove read-only fields
    delete updateData.id;
    delete updateData.created_at;
    
    // Update course
    const { data: updatedCourse, error: updateError } = await supabase
      .from('course_content')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Course not found' });
      }
      throw updateError;
    }

    return res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: 'Failed to update course' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, courseId: string) {
  try {
    // Delete course (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('course_content')
      .delete()
      .eq('id', courseId);

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Course not found' });
      }
      throw deleteError;
    }

    return res.status(200).json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
}