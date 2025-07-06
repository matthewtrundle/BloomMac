import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const fileName = `${cleanName}-${timestamp}${extension}`;
    
    // Get Supabase client
    const supabase = getServiceSupabase();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image', details: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    // Log the upload activity
    try {
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'blog_image_upload',
          entity_type: 'blog_image',
          entity_id: fileName,
          details: {
            fileName: file.name,
            size: file.size,
            type: file.type
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log activity:', logError);
    }

    return NextResponse.json({ 
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}