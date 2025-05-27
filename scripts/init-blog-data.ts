import { blogPosts as existingPosts } from '../lib/data/blog-posts';
import { initializeBlogPosts, BlogPost } from '../lib/blog-storage';

// Map the existing blog posts to the new format
const convertedPosts: BlogPost[] = existingPosts.map(post => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
  imageAlt: post.title, // Use title as alt text for now
  category: 'Mental Health', // Default category
  readTime: post.readingTime,
  publishedAt: new Date(post.date).toISOString(),
  featured: post.id <= 3, // Feature the first 3 posts
  author: {
    name: 'Jana Rundle',
    title: 'Licensed Clinical Social Worker',
    image: '/images/Team/Jana Rundle.jpg'
  },
  metaDescription: post.excerpt.substring(0, 160),
  keywords: ['postpartum', 'mental health', 'therapy', 'wellness', 'motherhood']
}));

// Initialize the blog posts
async function init() {
  try {
    await initializeBlogPosts(convertedPosts);
    console.log(`Successfully initialized ${convertedPosts.length} blog posts`);
  } catch (error) {
    console.error('Error initializing blog posts:', error);
  }
}

init();