import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient();
    let images: string[] = [];
    
    // Get all images from Supabase storage (now the primary source)
    try {
      const { data, error } = await supabase.storage.from('blog-images').list('', {
        limit: 1000,
        offset: 0
      });

      if (!error && data) {
        // List files recursively in subdirectories
        const getAllFiles = async (path: string = '') => {
          const { data: files, error } = await supabase.storage
            .from('blog-images')
            .list(path, {
              limit: 1000,
              offset: 0
            });

          if (error || !files) return [];

          const allFiles: string[] = [];

          for (const file of files) {
            if (file.id) {
              // It's a file
              const fullPath = path ? `${path}/${file.name}` : file.name;
              const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fullPath);
              allFiles.push(publicUrl);
            } else {
              // It's a folder, recurse into it
              const subPath = path ? `${path}/${file.name}` : file.name;
              const subFiles = await getAllFiles(subPath);
              allFiles.push(...subFiles);
            }
          }

          return allFiles;
        };

        images = await getAllFiles();
        
        // Sort images by filename for consistent ordering
        images.sort((a, b) => {
          const fileNameA = a.split('/').pop() || '';
          const fileNameB = b.split('/').pop() || '';
          return fileNameA.localeCompare(fileNameB);
        });
      }
    } catch (storageError) {
      console.error('Error accessing Supabase storage:', storageError);
      return NextResponse.json({ 
        error: 'Failed to access image storage', 
        details: storageError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list images', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient();
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const fileExtension = image.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
  }
}
