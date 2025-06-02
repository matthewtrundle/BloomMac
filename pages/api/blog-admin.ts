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
  // Authentication is handled by middleware
  // User info is available in headers from middleware
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];
  
  console.log('Blog admin API:', {
    method: req.method,
    userEmail,
    userRole,
    query: req.query,
    bodyKeys: req.body ? Object.keys(req.body) : 'no body'
  });
  
  if (!userEmail || userRole !== 'admin') {
    console.error('Blog admin authentication failed:', { userEmail, userRole });
    return res.status(403).json({ error: 'Forbidden' });
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
        console.log('Creating new blog post...');
        const newPost = await createBlogPost(req.body);
        console.log('Blog post created successfully:', newPost.slug);
        return res.status(201).json(newPost);

      case 'PUT':
        // Update existing post
        const { slug } = req.query;
        console.log('Updating blog post:', slug);
        if (!slug || typeof slug !== 'string') {
          console.error('No slug provided for update');
          return res.status(400).json({ error: 'Slug is required' });
        }
        
        const updatedPost = await updateBlogPost(slug, req.body);
        if (!updatedPost) {
          console.error('Blog post not found for update:', slug);
          return res.status(404).json({ error: 'Post not found' });
        }
        
        console.log('Blog post updated successfully:', updatedPost.slug);
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack') : undefined
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