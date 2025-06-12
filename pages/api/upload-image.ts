import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Defer path resolution to avoid initialization errors
const getUploadDir = () => path.join(process.cwd(), 'public', 'images', 'blog');

async function ensureUploadDir() {
  const uploadDir = getUploadDir();
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authentication is handled by middleware
  // User info is available in headers from middleware
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];
  
  if (!userEmail || userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureUploadDir();

    const form = formidable({
      uploadDir: getUploadDir(),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const ext = path.extname(file.originalFilename || '');
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `blog-${timestamp}-${randomString}${ext}`;
    const newPath = path.join(getUploadDir(), filename);

    // Move file to final location
    await fs.rename(file.filepath, newPath);

    // Return the public URL
    const publicUrl = `/images/blog/${filename}`;

    return res.status(200).json({
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}