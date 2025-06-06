import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

// Server-side data fetching
import { loadBlogPosts } from '@/lib/blog-storage-supabase';

export const metadata: Metadata = {
  title: 'Blog | Bloom Psychology',
  description: 'Insights and articles for women, moms, and families from Bloom Psychology.',
};

export default async function BlogPage() {
  // Load blog posts from storage
  const blogPosts = await loadBlogPosts();
  
  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  return (
    <>
      {/* Page Header */}
      <section className="pt-28 pb-12 bg-white text-center relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="md"
          position="top-right"
          opacity={0.05}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="sm"
          position="bottom-left"
          opacity={0.07}
          rotate={45}
        />
        
        <h1 className="font-playfair text-4xl text-bloom mb-4">Blog</h1>
        <p className="mt-2 text-lg text-bloom/60">Insights for women, moms & families</p>
        <div className="w-24 h-1 bg-[#C63780] mx-auto mt-6 rounded-full"></div>
      </section>
      
      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden glass-panel">
              <div className="h-48 bg-gray-100 relative">
                <Image 
                  src={post.image_url} 
                  alt={post.image_alt}
                  fill
                  className="object-cover"
                  loading={index < 3 ? "eager" : "lazy"}
                  placeholder={index < 3 ? undefined : "blur"}
                  blurDataURL={index < 3 ? undefined : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-bloom-accent bg-bloom-accent/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-playfair font-semibold text-bloom">{post.title}</h3>
                <p className="text-sm text-bloom/50 mt-1">
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  <span className="mx-2">•</span>
                  {post.read_time} min read
                </p>
                <p className="mt-4 text-bloom/70">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-block mt-4 text-bloompink hover:text-[#B03979] font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {/* Show message if there are many posts */}
        {sortedPosts.length > 12 && (
          <div className="text-center mt-12">
            <p className="text-bloom/60">
              Showing {sortedPosts.length} of {sortedPosts.length} posts
            </p>
          </div>
        )}
      </section>
      
      {/* Newsletter Sign Up */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <NewsletterSignup 
            source="blog-page"
            className="text-center"
          />
        </div>
      </section>
    </>
  );
}
