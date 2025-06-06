'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';

interface BlogPost {
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
  author: {
    name: string;
    title: string;
    image?: string;
  };
  meta_description?: string;
  keywords?: string[];
}

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog-admin-supabase?slug=${slug}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return <BlogEditor post={post} isEditing />;
}