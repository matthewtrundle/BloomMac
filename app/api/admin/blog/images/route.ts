import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient();
    let images: string[] = [];
    
    // Try to get images from Supabase storage
    try {
      const { data, error } = await supabase.storage.from('blog-images').list();

      if (!error && data) {
        const supabaseImages = data.map(file => {
          const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(file.name);
          return publicUrl;
        });
        images = [...images, ...supabaseImages];
      }
    } catch (storageError) {
      console.warn('Could not access Supabase storage:', storageError);
    }

    // Add local images from public folder as fallback
    const localImages = [
      '/images/optimized/Home/Confident Women.webp',
      '/images/optimized/Home/herooptimzed.webp',
      '/images/optimized/Services/Experienced Parents.webp',
      '/images/optimized/Services/AnxietyManagement1.webp',
      '/images/optimized/Services/AnxietyManagement2.webp',
      '/images/optimized/Services/Symbolic Shoes.webp',
      '/images/optimized/Services/Hopeful Hands.webp',
      '/images/optimized/Services/Walking through fields.webp',
      '/images/optimized/Hero/hero-bloom.webp',
      '/images/Team/Jana Rundle.jpg',
      '/images/blog/mental-health-awareness.jpg',
      '/images/blog/self-care-tips.jpg',
      '/images/blog/postpartum-support.jpg',
      '/images/blog/parenting-journey.jpg',
      '/images/blog/mindfulness-practice.jpg',
    ];

    images = [...images, ...localImages];

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
