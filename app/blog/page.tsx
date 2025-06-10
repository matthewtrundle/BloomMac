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

// Disable static generation to ensure updates reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  // Load blog posts from storage
  const blogPosts = await loadBlogPosts();
  
  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  return (
    <>
      {/* Page Header with Garden Theme */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-bloom-sage-50/20 via-white to-bloom-pink-50/10 text-center relative overflow-hidden">
        {/* Garden lattice pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="blog-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#blog-lattice)" />
          </svg>
        </div>
        
        {/* Floating garden elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 left-40 w-2 h-2 bg-bloom-sage/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="md"
          position="top-right"
          opacity={0.08}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="sm"
          position="bottom-left"
          opacity={0.1}
          rotate={45}
        />
        
        <div className="relative z-10">
          <h1 className="font-playfair text-5xl md:text-6xl text-bloom-dark mb-6">
            Mental Health <span className="text-bloompink">Insights</span>
          </h1>
          
          {/* Decorative flower divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
            <Image 
              src="/images/flower no stem.svg" 
              alt="" 
              width={24} 
              height={24} 
              className="opacity-50"
            />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
          </div>
          
          <p className="text-xl text-bloom/80 max-w-2xl mx-auto mb-8">
            Evidence-based articles and practical guidance for women, mothers, and families navigating mental health and wellness.
          </p>
          
          {/* Topic tags */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-bloom/80 shadow-sm">
              🤱 Postpartum Wellness
            </span>
            <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-bloom/80 shadow-sm">
              😌 Anxiety Management
            </span>
            <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-bloom/80 shadow-sm">
              💕 Relationships
            </span>
            <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-bloom/80 shadow-sm">
              👨‍👩‍👧‍👦 Family Support
            </span>
          </div>
        </div>
      </section>
      
      {/* Posts Grid with Garden Theme */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative">
        {/* Subtle garden bed texture */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="garden-bed" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#7A8B7F" />
              <circle cx="3" cy="3" r="0.3" fill="#8B7355" />
            </pattern>
            <rect width="100" height="100" fill="url(#garden-bed)" />
          </svg>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {sortedPosts.map((post, index) => (
            <article 
              key={post.slug} 
              className="group bg-gradient-to-br from-white to-bloom-sage-50/20 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-bloom-sage/10 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image with overlay effects */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <Image 
                  src={post.image_url} 
                  alt={post.image_alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                  placeholder={index < 3 ? undefined : "blur"}
                  blurDataURL={index < 3 ? undefined : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating flower accent */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                  <Image
                    src="/images/flower no stem.svg"
                    alt=""
                    width={32}
                    height={32}
                    className="opacity-80"
                  />
                </div>
              </div>
              
              <div className="p-6">
                {/* Category and Featured badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-bloom-sage bg-bloom-sage/10 px-3 py-1.5 rounded-full border border-bloom-sage/20">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-xs font-medium text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 flex items-center gap-1">
                      <span>⭐</span>
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Title with better typography */}
                <h3 className="text-xl font-playfair font-semibold text-bloom-dark mb-2 group-hover:text-bloompink transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                
                {/* Date and reading time */}
                <div className="flex items-center text-sm text-bloom/60 mb-4">
                  <time className="flex items-center gap-1">
                    <span className="text-bloom-sage">📅</span>
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span className="mx-2 text-bloom-sage/30">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-bloom-sage">⏱️</span>
                    {post.read_time} min read
                  </span>
                </div>
                
                {/* Excerpt */}
                <p className="text-bloom/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Enhanced CTA */}
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-flex items-center gap-2 text-bloompink hover:text-bloom-dark font-medium transition-all duration-300 group/link"
                >
                  <span>Read Full Article</span>
                  <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
              
              {/* Decorative border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bloom-sage/20 to-transparent"></div>
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
      
      {/* Newsletter Sign Up with Garden Theme */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/30 to-bloom-pink-50/20 relative overflow-hidden">
        {/* Garden elements background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating seeds animation */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-40 w-2 h-2 bg-bloom-sage/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Decorative vine pattern */}
          <svg className="absolute left-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
            <path d="M50,0 Q30,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                  stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
          </svg>
          <svg className="absolute right-0 top-0 h-full w-32 opacity-5 scale-x-[-1]" viewBox="0 0 100 500" preserveAspectRatio="none">
            <path d="M50,0 Q30,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                  stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Enhanced header */}
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl text-bloom-dark mb-4">
              Stay Connected with Our <span className="text-bloompink">Mental Health Community</span>
            </h2>
            
            {/* Decorative flower divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <Image 
                src="/images/flower no stem.svg" 
                alt="" 
                width={24} 
                height={24} 
                className="opacity-50"
              />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-lg text-bloom/80 max-w-2xl mx-auto">
              Get weekly insights, practical tips, and early access to new articles delivered to your inbox.
            </p>
          </div>
          
          <NewsletterSignup 
            source="blog-page"
            className="text-center"
          />
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-bloom/60">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Evidence-based content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Weekly mental health tips</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
