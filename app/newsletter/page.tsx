import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

// UI Components
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Newsletter | Mental Health Insights',
  description: 'Join 500+ women, mothers, and parents receiving monthly evidence-based mental health insights, wellness tips, and resources from Bloom Psychology.',
  keywords: [
    'mental health newsletter',
    'women\'s wellness tips',
    'postpartum mental health',
    'parenting resources',
    'anxiety management',
    'mental health blog',
    'therapy insights austin'
  ],
  openGraph: {
    title: 'Monthly Mental Health Insights | Bloom Psychology Newsletter',
    description: 'Evidence-based wellness tips and resources for women, mothers, and parents. Join our community today.',
    url: 'https://bloompsychologynorthaustin.com/newsletter',
    siteName: 'Bloom Psychology',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monthly Mental Health Insights | Bloom Psychology Newsletter',
    description: 'Evidence-based wellness tips and resources for women, mothers, and parents. Join our community today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewsletterPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5 relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-right"
          opacity={0.03}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-bloom-accent/10 text-bloom-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Free Monthly Newsletter
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-bloom mb-6">
              Mental Health Insights
              <span className="text-bloom-accent block mt-2">
                Delivered Monthly
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of women, mothers, and parents receiving evidence-based wellness strategies, 
              mental health resources, and expert insights from Dr. Jana Rundle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                500+ subscribers
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Evidence-based content
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No spam, ever
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup 
              variant="inline" 
              source="landing_page"
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                What You'll Receive Every Week
              </h2>
              <p className="text-gray-600 text-lg">
                Carefully curated content to support your mental wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Expert Articles</h3>
                <p className="text-gray-600">
                  In-depth blog posts on topics like postpartum depression, anxiety management, and parenting challenges written by licensed professionals.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Practical Tips</h3>
                <p className="text-gray-600">
                  Evidence-based strategies you can implement immediately to improve your mental wellness and daily coping skills.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Community Resources</h3>
                <p className="text-gray-600">
                  Access to exclusive resources, downloadable guides, and information about support groups and workshops.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Self-Care Focus</h3>
                <p className="text-gray-600">
                  Gentle reminders and practical self-care strategies designed specifically for busy women, mothers, and parents.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Event Updates</h3>
                <p className="text-gray-600">
                  First access to workshops, support groups, and special events happening at Bloom Psychology.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-bloom-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom mb-3">Myth Busting</h3>
                <p className="text-gray-600">
                  Clear, science-backed information that debunks common mental health myths and misconceptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Dr. Rundle Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-bloom mb-6">
                  Expert Insights from Dr. Jana Rundle
                </h2>
                <p className="text-gray-600 mb-4">
                  Dr. Jana Rundle is a licensed psychologist specializing in perinatal mental health, women's therapy, 
                  and parent support. With years of experience helping families navigate mental health challenges, 
                  she brings evidence-based insights directly to your inbox.
                </p>
                <p className="text-gray-600 mb-6">
                  Her newsletter content is based on the latest research in psychology and her real-world experience 
                  supporting hundreds of women, mothers, and parents through their wellness journeys.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    href="/about" 
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    Learn More About Dr. Rundle
                  </Button>
                  <Button 
                    href="/book" 
                    variant="pink"
                    className="inline-flex items-center"
                  >
                    Book a Consultation
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-bloom-blush/20 to-bloom-accent/20">
                  <Image
                    src="/images/optimized/Team/Jana Rundle.webp"
                    alt="Dr. Jana Rundle"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-bloom text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-bloom mb-2">How often will I receive emails?</h3>
                <p className="text-gray-600">
                  You'll receive one thoughtfully crafted email per week, typically sent on Tuesday mornings. 
                  We respect your time and inbox space.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-bloom mb-2">Can I unsubscribe at any time?</h3>
                <p className="text-gray-600">
                  Absolutely! Every email includes an easy unsubscribe link. We want you to stay because 
                  you find value in our content, not because it's difficult to leave.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-bloom mb-2">Is this newsletter appropriate for my situation?</h3>
                <p className="text-gray-600">
                  Our content is designed for women, mothers, and parents at all stages of their mental health journey. 
                  However, this newsletter is for educational purposes and doesn't replace professional therapy or medical advice.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-bloom mb-2">Will my information be shared?</h3>
                <p className="text-gray-600">
                  Never. Your email address and personal information are kept completely private and secure. 
                  We hate spam as much as you do and will never share or sell your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-bloom to-bloom-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Prioritize Your Mental Wellness?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join hundreds of women, mothers, and parents who are taking charge of their mental health 
            with our monthly evidence-based insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="#signup" 
              variant="white"
              size="lg"
              className="inline-flex items-center"
            >
              Subscribe to Newsletter
            </Button>
            <Button 
              href="/blog" 
              variant="outline-white"
              size="lg" 
              className="inline-flex items-center"
            >
              Read Latest Articles
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}