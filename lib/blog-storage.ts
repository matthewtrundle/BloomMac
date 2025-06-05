import { supabaseAdmin } from './supabase';

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

// Transform database row to BlogPost format
function transformDbPost(dbPost: any): BlogPost {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    image: dbPost.image_url,
    imageAlt: dbPost.image_alt,
    category: dbPost.category,
    readTime: dbPost.read_time,
    publishedAt: dbPost.published_at,
    featured: dbPost.featured,
    author: {
      name: dbPost.author_name,
      title: dbPost.author_title,
      image: dbPost.author_image
    },
    metaDescription: dbPost.meta_description,
    keywords: dbPost.keywords || []
  };
}

// Transform BlogPost to database format
function transformToDbFormat(post: Partial<BlogPost>) {
  const dbPost: any = {};
  
  if (post.slug !== undefined) dbPost.slug = post.slug;
  if (post.title !== undefined) dbPost.title = post.title;
  if (post.excerpt !== undefined) dbPost.excerpt = post.excerpt;
  if (post.content !== undefined) dbPost.content = post.content;
  if (post.image !== undefined) dbPost.image_url = post.image;
  if (post.imageAlt !== undefined) dbPost.image_alt = post.imageAlt;
  if (post.category !== undefined) dbPost.category = post.category;
  if (post.readTime !== undefined) dbPost.read_time = post.readTime;
  if (post.publishedAt !== undefined) dbPost.published_at = post.publishedAt;
  if (post.featured !== undefined) dbPost.featured = post.featured;
  if (post.author?.name !== undefined) dbPost.author_name = post.author.name;
  if (post.author?.title !== undefined) dbPost.author_title = post.author.title;
  if (post.author?.image !== undefined) dbPost.author_image = post.author.image;
  if (post.metaDescription !== undefined) dbPost.meta_description = post.metaDescription;
  if (post.keywords !== undefined) dbPost.keywords = post.keywords;
  
  return dbPost;
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error loading blog posts from Supabase:', error);
      throw error;
    }

    return (data || []).map(transformDbPost);
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    throw error;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error getting blog post from Supabase:', error);
      throw error;
    }

    return data ? transformDbPost(data) : null;
  } catch (error) {
    console.error('Failed to get blog post:', error);
    throw error;
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'slug'>): Promise<BlogPost> {
  try {
    // Generate slug from title
    let slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    
    while (true) {
      const existing = await getBlogPost(finalSlug);
      if (!existing) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const newPost: BlogPost = {
      ...post,
      slug: finalSlug,
      publishedAt: post.publishedAt || new Date().toISOString()
    };
    
    const dbPost = transformToDbFormat(newPost);
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert(dbPost)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post in Supabase:', error);
      throw error;
    }

    return transformDbPost(data);
  } catch (error) {
    console.error('Failed to create blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    // If title is being updated, regenerate slug
    if (updates.title) {
      const newSlug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if new slug already exists (excluding current post)
      let finalSlug = newSlug;
      let counter = 1;
      
      while (true) {
        const existing = await getBlogPost(finalSlug);
        if (!existing || existing.slug === slug) break;
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }
      
      updates.slug = finalSlug;
    }
    
    const dbUpdates = transformToDbFormat(updates);
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(dbUpdates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - post not found
        return null;
      }
      console.error('Error updating blog post in Supabase:', error);
      throw error;
    }

    return data ? transformDbPost(data) : null;
  } catch (error) {
    console.error('Failed to update blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting blog post from Supabase:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return false;
  }
}

// Legacy function for compatibility - no longer needed with Supabase
export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  console.warn('saveBlogPosts is deprecated with Supabase. Use individual create/update/delete methods instead.');
  // This function is no longer used as Supabase handles persistence automatically
}

// Initialize with existing blog posts if the table is empty
export async function initializeBlogPosts(initialPosts: BlogPost[]): Promise<void> {
  try {
    const { count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      // Table is empty, insert initial posts
      const dbPosts = initialPosts.map(post => transformToDbFormat(post));
      
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .insert(dbPosts);

      if (error) {
        console.error('Error initializing blog posts in Supabase:', error);
        throw error;
      }
      
      console.log(`Initialized ${initialPosts.length} blog posts in Supabase`);
    } else {
      console.log(`Blog posts table already has ${count} posts`);
    }
  } catch (error) {
    console.error('Failed to initialize blog posts:', error);
    throw error;
  }
}