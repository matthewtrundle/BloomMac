import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Blog | Bloom Psychology',
  description: 'Insights and articles for women, moms, and families from Bloom Psychology.',
};

export default function BlogPage() {
  // Blog post data 
  const placeholderPosts = [
    {
      id: 1,
      title: 'New Research on Postpartum Depression Treatment Options',
      date: 'May 12, 2025', // Updated date
      excerpt: 'A groundbreaking study from Harvard Medical School reveals promising new treatment approaches for postpartum depression, combining traditional therapy with innovative mindfulness techniques...',
      image: '/images/Home/new-mom.png',
      slug: 'postpartum-depression-treatments',
    },
    {
      id: 2,
      title: 'Understanding the Maternal Mental Health Crisis',
      date: 'May 9, 2025', // Thursday
      excerpt: 'Recent CDC data shows a concerning rise in maternal mental health issues following the pandemic, emphasizing the need for expanded access to specialized care for new mothers...',
      image: '/images/Services/AnxietyManagement1.png',
      slug: 'maternal-mental-health-crisis',
    },
    {
      id: 3,
      title: 'The Connection Between Sleep Deprivation and Postpartum Anxiety',
      date: 'May 2, 2025', // Thursday
      excerpt: 'New research published in the Journal of Women\'s Health explores how sleep disruption affects anxiety levels in new mothers and provides practical strategies for improving sleep quality...',
      image: '/images/Services/New Mothers.png',
      slug: 'sleep-postpartum-anxiety',
    },
    {
      id: 4,
      title: 'Supporting Partners of Women with Postpartum Depression',
      date: 'April 25, 2025', // Thursday
      excerpt: 'Partners play a crucial role in recovery from postpartum depression, yet often receive little guidance. Learn effective support strategies based on recent clinical findings...',
      image: '/images/Services/Hopeful Hands.png',
      slug: 'supporting-partners-ppd',
    },
    {
      id: 5,
      title: 'The Hidden Symptoms of Perinatal Anxiety Disorders',
      date: 'April 18, 2025', // Thursday
      excerpt: 'Beyond excessive worry: recognizing the less-discussed physical symptoms of perinatal anxiety disorders that are frequently overlooked by healthcare providers...',
      image: '/images/Services/AnxietyManagement2.png',
      slug: 'hidden-perinatal-anxiety',
    },
    {
      id: 6,
      title: 'Breaking the Stigma: Maternal Mental Health Among Diverse Communities',
      date: 'April 11, 2025', // Thursday
      excerpt: 'Cultural factors significantly impact how women experience and seek help for maternal mental health issues. Recent research highlights the importance of culturally-sensitive approaches...',
      image: '/images/Services/Walking through fields.png',
      slug: 'diverse-maternal-mental-health',
    },
    {
      id: 7,
      title: 'Digital Therapeutics: New Apps for Maternal Mental Health',
      date: 'April 4, 2025', // Thursday
      excerpt: 'Evaluation of emerging digital tools designed to support women experiencing postpartum depression and anxiety, with insights on effectiveness and accessibility...',
      image: '/images/Services/Empty Armchair.png',
      slug: 'digital-maternal-mental-health',
    },
    {
      id: 8,
      title: 'Hormonal Fluctuations and Anxiety: What Women Need to Know',
      date: 'March 28, 2025', // Thursday
      excerpt: 'New research explores the complex relationship between hormonal changes throughout women\'s lives and the development or exacerbation of anxiety symptoms...',
      image: '/images/Home/Confident Women.png',
      slug: 'hormones-anxiety-women',
    },
    {
      id: 9,
      title: 'Preventative Approaches to Postpartum Depression',
      date: 'March 21, 2025', // Thursday
      excerpt: 'Early intervention strategies shown to reduce the risk of developing postpartum depression, based on a new longitudinal study following women from pregnancy through the first year postpartum...',
      image: '/images/Services/Symbolic Shoes.png',
      slug: 'preventing-postpartum-depression',
    },
    {
      id: 10,
      title: 'Postpartum Rage: The Anger No One Talks About',
      date: 'March 14, 2025', // Thursday
      excerpt: 'Understanding the phenomenon of postpartum rage as a symptom of postpartum depression and anxiety, with therapeutic approaches for managing these intense emotions...',
      image: '/images/Services/Experienced Parents.png',
      slug: 'postpartum-rage',
    },
    {
      id: 11,
      title: 'Managing Anxiety in Uncertain Times',
      date: 'March 7, 2025', // Thursday
      excerpt: 'Practical techniques and mindfulness practices to help manage anxiety symptoms and build resilience during periods of stress or uncertainty...',
      image: '/images/Services/AnxietyManagement1.png',
      slug: 'managing-anxiety',
    },
    {
      id: 12,
      title: 'Building Healthy Parent-Child Relationships',
      date: 'February 28, 2025', // Thursday
      excerpt: 'Explore attachment-based strategies for creating secure, nurturing connections with your children that support their emotional development...',
      image: '/images/Services/Experienced Parents.png',
      slug: 'parent-child-relationships',
    },
    {
      id: 13,
      title: 'Self-Care Practices for Busy Parents',
      date: 'February 21, 2025', // Thursday
      excerpt: 'Finding time for self-care can seem impossible for busy parents. Discover practical, brief self-care routines that can fit into your daily life...',
      image: '/images/Services/Symbolic Shoes.png',
      slug: 'self-care-for-parents',
    },
    {
      id: 14,
      title: 'Understanding Therapy: What to Expect',
      date: 'February 14, 2025', // Thursday
      excerpt: 'Starting therapy can feel intimidating if you\'ve never experienced it before. Learn about the process, what to expect, and how to get the most from your sessions...',
      image: '/images/Services/Empty Armchair.png',
      slug: 'understanding-therapy',
    },
    {
      id: 15,
      title: 'Navigating Major Life Transitions',
      date: 'February 7, 2025', // Thursday
      excerpt: 'Whether it\'s becoming a parent, changing careers, or moving to a new city, major life transitions can trigger stress and anxiety. Here\'s how to cope...',
      image: '/images/Services/Walking through fields.png',
      slug: 'navigating-transitions',
    },
    {
      id: 16,
      title: 'Supporting New Mothers Through Postpartum Challenges',
      date: 'January 31, 2025', // Thursday
      excerpt: 'Navigating the challenging early days of motherhood can be overwhelming. Here are evidence-based strategies to support mental wellbeing during postpartum...',
      image: '/images/Home/new-mom.png',
      slug: 'supporting-new-mothers',
    },
  ];

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
          {placeholderPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden glass-panel">
              {/* TODO: Replace with actual post images */}
              <div className="h-48 bg-gray-100 relative">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-bloom">{post.title}</h3>
                <p className="text-sm text-bloom/50 mt-1">{post.date}</p>
                <p className="mt-4 text-bloom/70">{post.excerpt}</p>
                {/* TODO: Link to actual blog post pages once created */}
                <Button 
                  href={`/blog/${post.slug}`} 
                  variant="outline"
                  className="mt-4"
                >
                  Read More →
                </Button>
              </div>
            </article>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          {/* TODO: Implement pagination or load more functionality */}
          <Button 
            variant="pink" 
            size="md"
            className="mt-8 inline-block"
          >
            Load More Posts
          </Button>
        </div>
      </section>
      
      {/* Newsletter Sign Up (Optional) */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center">
            <h2 className="font-playfair text-3xl text-bloom mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-bloom/70 mb-8 mx-auto max-w-2xl">
              Receive monthly insights, resources, and special offers directly to your inbox.
            </p>
            
            {/* TODO: Implement actual newsletter signup form */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bloompink/30 focus:border-bloompink"
              />
              <Button variant="pink">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-bloom/50 mt-4">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
