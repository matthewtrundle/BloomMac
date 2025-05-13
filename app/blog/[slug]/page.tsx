import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import KineticTypography from '@/components/ui/KineticTypography';

// Blog posts data
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/data/blog-posts';

// Generate static paths for all blog posts
export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }
  
  return {
    title: `${post.title} | Bloom Psychology Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);
  
  // Handle 404
  if (!post) {
    notFound();
  }
  
  return (
    <>
      {/* Hero Section */}
      <section className="pt-28 pb-8 bg-white relative overflow-hidden">
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
        
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Link href="/blog" className="text-bloom/60 hover:text-bloompink transition-colors text-sm inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
          
          <KineticTypography as="h1" animation="fade-in" className="font-playfair text-bloom text-3xl md:text-4xl lg:text-5xl mb-4">
            {post.title}
          </KineticTypography>
          
          <p className="text-bloom/60 mb-6">{post.date} • {post.readingTime} min read</p>
        </div>
      </section>
      
      {/* Featured Image */}
      <section className="pb-10 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative h-[40vh] md:h-[50vh] rounded-lg overflow-hidden shadow-md">
            <Image 
              src={post.image} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <article className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-bloom prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {/* Author Section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image 
                    src="/images/Team/Jana Rundle.jpg" 
                    alt="Dr. Jana Rundle"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium text-bloom">Dr. Jana Rundle</p>
                <p className="text-sm text-bloom/60">Licensed Clinical Psychologist</p>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-2xl text-bloom mb-8 text-center">Related Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {post.relatedPosts.map((relatedPost, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100 relative">
                  <Image 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-bloom">{relatedPost.title}</h3>
                  <p className="text-sm text-bloom/50 mt-1">{relatedPost.date}</p>
                  <Link href={`/blog/${relatedPost.slug}`} className="text-bloompink text-sm mt-2 inline-block hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-bloom relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="#FFFFFF"
          size="full"
          position="bottom-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6 text-center">
          <KineticTypography as="h2" animation="fade-in" className="font-playfair text-white text-3xl md:text-4xl mb-6">
            Ready to Begin Your Healing Journey?
          </KineticTypography>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10">
            Take the first step with a free 15-minute consultation.
          </p>
          
          <Button 
            href="/contact" 
            variant="accent" 
            size="lg" 
            className="inline-block"
            pulseOnView
          >
            Schedule Your Consultation
          </Button>
        </div>
      </section>
    </>
  );
}