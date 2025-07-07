import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient();
    
    const { data, error } = await supabase.storage.from('blog-images').list();

    if (error) {
      console.error('Error listing images:', error);
      throw error;
    }

    const images = data.map(file => {
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(file.name);
      return publicUrl;
    });

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
