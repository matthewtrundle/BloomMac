import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  loadBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  getBlogPost,
  BlogPost 
} from '@/lib/blog-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple auth check - in production, use proper authentication
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all posts or single post
        if (req.query.slug) {
          const post = await getBlogPost(req.query.slug as string);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(200).json(post);
        }
        
        const posts = await loadBlogPosts();
        return res.status(200).json(posts);

      case 'POST':
        // Create new post
        const newPost = await createBlogPost(req.body);
        return res.status(201).json(newPost);

      case 'PUT':
        // Update existing post
        const { slug } = req.query;
        if (!slug || typeof slug !== 'string') {
          return res.status(400).json({ error: 'Slug is required' });
        }
        
        const updatedPost = await updateBlogPost(slug, req.body);
        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        return res.status(200).json(updatedPost);

      case 'DELETE':
        // Delete post
        const { slug: deleteSlug } = req.query;
        if (!deleteSlug || typeof deleteSlug !== 'string') {
          return res.status(400).json({ error: 'Slug is required' });
        }
        
        const deleted = await deleteBlogPost(deleteSlug);
        if (!deleted) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        return res.status(200).json({ message: 'Post deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Blog admin API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Allow larger payloads for blog content
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};