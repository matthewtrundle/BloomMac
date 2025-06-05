import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  loadBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  getBlogPost,
  searchBlogPosts,
  getBlogPostsByCategory,
  getFeaturedPosts,
  BlogPost 
} from '@/lib/blog-storage-supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authentication is handled by middleware
  // User info is available in headers from middleware
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];
  
  console.log('Blog admin API (Supabase):', {
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
        // Handle different GET operations based on query params
        if (req.query.search) {
          // Search posts
          const searchQuery = req.query.search as string;
          const searchResults = await searchBlogPosts(searchQuery);
          return res.status(200).json(searchResults);
        }
        
        if (req.query.category) {
          // Get posts by category
          const category = req.query.category as string;
          const categoryPosts = await getBlogPostsByCategory(category);
          return res.status(200).json(categoryPosts);
        }
        
        if (req.query.featured === 'true') {
          // Get featured posts
          const featuredPosts = await getFeaturedPosts();
          return res.status(200).json(featuredPosts);
        }
        
        if (req.query.slug) {
          // Get single post
          const post = await getBlogPost(req.query.slug as string);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(200).json(post);
        }
        
        // Get all posts
        const posts = await loadBlogPosts();
        return res.status(200).json(posts);

      case 'POST':
        // Create new post
        console.log('Creating new blog post...');
        const { id, slug, created_at, updated_at, ...postData } = req.body;
        const newPost = await createBlogPost(postData);
        console.log('Blog post created successfully:', newPost.slug);
        return res.status(201).json(newPost);

      case 'PUT':
        // Update existing post
        const updateSlug = req.query.slug as string;
        console.log('Updating blog post:', updateSlug);
        if (!updateSlug) {
          console.error('No slug provided for update');
          return res.status(400).json({ error: 'Slug is required' });
        }
        
        const updatedPost = await updateBlogPost(updateSlug, req.body);
        if (!updatedPost) {
          console.error('Blog post not found for update:', updateSlug);
          return res.status(404).json({ error: 'Post not found' });
        }
        
        console.log('Blog post updated successfully:', updatedPost.slug);
        return res.status(200).json(updatedPost);

      case 'DELETE':
        // Delete post
        const deleteSlug = req.query.slug as string;
        if (!deleteSlug) {
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