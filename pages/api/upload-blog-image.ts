import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ 
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });
    
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read file buffer
    const buffer = await fs.readFile(file.filepath);
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'image.jpg';
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const fileName = `${cleanName}-${timestamp}${extension}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(fileName, buffer, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    // Clean up temp file
    await fs.unlink(file.filepath).catch(console.error);

    return res.status(200).json({ 
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.mimetype,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}