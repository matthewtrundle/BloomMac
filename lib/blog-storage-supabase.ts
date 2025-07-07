import { supabaseAdmin } from '@/lib/supabase';

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  category: string;
  read_time: number;
  published_at: string;
  featured: boolean;
  author_name: string;
  author_title: string;
  author_image?: string;
  meta_description?: string;
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}

// Transform database row to BlogPost format
function transformFromDb(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image_url: row.image_url,
    image_alt: row.image_alt,
    category: row.category,
    read_time: row.read_time,
    published_at: row.published_at,
    featured: row.featured,
    author_name: row.author_name,
    author_title: row.author_title,
    author_image: row.author_image,
    meta_description: row.meta_description,
    keywords: row.keywords,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Transform BlogPost to database format
function transformToDb(post: BlogPost): any {
  const dbPost: any = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image_url: post.image_url,
    image_alt: post.image_alt,
    category: post.category,
    read_time: post.read_time,
    featured: post.featured,
    author_name: post.author_name,
    author_title: post.author_title,
    author_image: post.author_image,
    meta_description: post.meta_description,
    keywords: post.keywords,
    published_at: post.published_at || new Date().toISOString()
  };
  
  // Don't include id if creating new post
  if (post.id) {
    dbPost.id = post.id;
  }
  
  return dbPost;
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error loading blog posts:', error);
      throw error;
    }
    
    return (data || []).map(transformFromDb);
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
      console.error('Error getting blog post:', error);
      throw error;
    }
    
    return data ? transformFromDb(data) : null;
  } catch (error) {
    console.error('Failed to get blog post:', error);
    throw error;
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
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
      published_at: post.published_at || new Date().toISOString()
    };
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([transformToDb(newPost)])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    
    return transformFromDb(data);
  } catch (error) {
    console.error('Failed to create blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    // Get the existing post first
    const existingPost = await getBlogPost(slug);
    if (!existingPost) {
      return null;
    }
    
    // If title is being updated, regenerate slug
    if (updates.title && updates.title !== existingPost.title) {
      const newSlug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if new slug already exists (excluding current post)
      let finalSlug = newSlug;
      let counter = 1;
      
      while (true) {
        const existing = await getBlogPost(finalSlug);
        if (!existing || existing.id === existingPost.id) break;
        
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }
      
      updates.slug = finalSlug;
    }
    
    // Create a new object for the update data, excluding fields that shouldn't be updated
    const updateData: Partial<BlogPost> = { ...updates };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    
    return transformFromDb(data);
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
      console.error('Error deleting blog post:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return false;
  }
}

// Batch operations for efficiency
export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  try {
    // This is a batch upsert operation
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .upsert(posts.map(transformToDb), {
        onConflict: 'slug'
      });
    
    if (error) {
      console.error('Error saving blog posts:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save blog posts:', error);
    throw error;
  }
}

// Initialize with existing blog posts if the table is empty
export async function initializeBlogPosts(initialPosts: BlogPost[]): Promise<void> {
  try {
    const { count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    // Only initialize if table is empty
    if (count === 0) {
      await saveBlogPosts(initialPosts);
      console.log(`Initialized ${initialPosts.length} blog posts in Supabase`);
    } else {
      console.log(`Blog posts table already has ${count} posts, skipping initialization`);
    }
  } catch (error) {
    console.error('Failed to initialize blog posts:', error);
    throw error;
  }
}

// Search functionality
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
    
    return (data || []).map(transformFromDb);
  } catch (error) {
    console.error('Failed to search blog posts:', error);
    throw error;
  }
}

// Get posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error getting posts by category:', error);
      throw error;
    }
    
    return (data || []).map(transformFromDb);
  } catch (error) {
    console.error('Failed to get posts by category:', error);
    throw error;
  }
}

// Get featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error getting featured posts:', error);
      throw error;
    }
    
    return (data || []).map(transformFromDb);
  } catch (error) {
    console.error('Failed to get featured posts:', error);
    throw error;
  }
}