import fs from 'fs/promises';
import path from 'path';

const BLOG_DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  featured: boolean;
  author: {
    name: string;
    title: string;
    image?: string;
  };
  metaDescription?: string;
  keywords?: string[];
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  await ensureDataDirectory();
  
  try {
    const data = await fs.readFile(BLOG_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as any).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(BLOG_DATA_FILE, JSON.stringify(posts, null, 2));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function createBlogPost(post: Omit<BlogPost, 'slug'>): Promise<BlogPost> {
  const posts = await loadBlogPosts();
  
  // Generate slug from title
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Check if slug already exists
  let finalSlug = slug;
  let counter = 1;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const newPost: BlogPost = {
    ...post,
    slug: finalSlug,
    publishedAt: post.publishedAt || new Date().toISOString()
  };
  
  posts.push(newPost);
  await saveBlogPosts(posts);
  
  return newPost;
}

export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  const index = posts.findIndex(post => post.slug === slug);
  
  if (index === -1) {
    return null;
  }
  
  // If title is being updated, regenerate slug
  if (updates.title && updates.title !== posts[index].title) {
    const newSlug = updates.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if new slug already exists (excluding current post)
    let finalSlug = newSlug;
    let counter = 1;
    while (posts.some((p, i) => i !== index && p.slug === finalSlug)) {
      finalSlug = `${newSlug}-${counter}`;
      counter++;
    }
    
    updates.slug = finalSlug;
  }
  
  posts[index] = { ...posts[index], ...updates };
  await saveBlogPosts(posts);
  
  return posts[index];
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const posts = await loadBlogPosts();
  const filteredPosts = posts.filter(post => post.slug !== slug);
  
  if (filteredPosts.length === posts.length) {
    return false; // Post not found
  }
  
  await saveBlogPosts(filteredPosts);
  return true;
}

// Initialize with existing blog posts if the file doesn't exist
export async function initializeBlogPosts(initialPosts: BlogPost[]): Promise<void> {
  try {
    await fs.access(BLOG_DATA_FILE);
    // File exists, don't overwrite
  } catch {
    // File doesn't exist, create it with initial posts
    await saveBlogPosts(initialPosts);
  }
}