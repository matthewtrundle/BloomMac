'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import KineticTypography from '@/components/ui/KineticTypography';
import Button from '@/components/ui/Button';

// Icons for categories
const PaymentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProcessIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const PostpartumIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  questions: {
    question: string;
    answer: string | React.ReactNode;
  }[];
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: FAQCategory[] = [
    {
      id: 'insurance',
      title: 'Insurance and Payment',
      description: 'Understanding costs and payment options',
      icon: <PaymentIcon />,
      color: 'from-pink-400 to-pink-600',
      questions: [
        {
          question: 'Do you accept insurance for therapy?',
          answer: 'We are an "out-of-network provider." We can help you apply for out-of-network benefits and provide a "Super Bill" for insurance reimbursement.'
        },
        {
          question: 'What are your therapy fees and payment options?',
          answer: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Individual Session: $175 for 50 minutes</li>
              <li>Parent Coaching: $200 for 60 minutes</li>
              <li>Payment is due at the end of each session</li>
              <li>We accept all major credit cards, including FSA and HSA cards</li>
            </ul>
          )
        },
        {
          question: 'Why don\'t all therapists accept insurance?',
          answer: 'We are concerned about insurance companies gathering detailed personal information, uploading it to accessible databases, and dictating treatment parameters. This approach allows us to provide more personalized care without insurance company constraints.'
        }
      ]
    },
    {
      id: 'location',
      title: 'Location and Sessions',
      description: 'Where and how we meet',
      icon: <LocationIcon />,
      color: 'from-purple-400 to-purple-600',
      questions: [
        {
          question: 'Where is your office located?',
          answer: 'We are located at 13706 N Hwy 183 in Northwest Austin. We offer in-office, in-home, and teletherapy sessions.'
        },
        {
          question: 'Do you offer in-home sessions?',
          answer: 'Yes, we offer in-home sessions to reduce stress for new mothers by bringing therapy directly to their home, accommodating challenges like childcare and transportation.'
        }
      ]
    },
    {
      id: 'process',
      title: 'Therapy Process',
      description: 'What to expect from therapy',
      icon: <ProcessIcon />,
      color: 'from-blue-400 to-blue-600',
      questions: [
        {
          question: 'What should I expect in my first therapy session?',
          answer: (
            <div>
              <p>
                Your first session will begin with a warm introduction and an overview of confidentiality and what you can expect moving forward. Dr. Rundle will ask questions about your background, current challenges, and goals to get a clearer picture of what brought you in. You'll spend time discussing what feels most pressing—whether it's emotional support, coping strategies, or navigating new stressors—and Dr. Rundle will outline how she can help. You may be asked to complete some brief intake forms or questionnaires to provide additional context. By the end of the session, you'll have a sense of next steps and a tentative plan for future sessions.
              </p>
            </div>
          )
        }
      ]
    },
    {
      id: 'postpartum',
      title: 'Postpartum Support',
      description: 'Support for new mothers',
      icon: <PostpartumIcon />,
      color: 'from-rose-400 to-rose-600',
      questions: [
        {
          question: 'How do I know if I should see a therapist?',
          answer: (
            <>
              If you're not sure, it does not hurt to <Link href="/book" className="text-blue-600 hover:underline">schedule a free consultation call</Link> to see if you may benefit from individualized treatment.
            </>
          )
        },
        {
          question: 'What if I\'m nervous to make an appointment?',
          answer: 'We also know that symptoms can get in the way of doing what you need to do to feel better and that waiting can make symptoms worse. Often, making the first step of reaching out to a therapist is the beginning of your recovery.'
        },
        {
          question: 'Can I bring my baby to sessions?',
          answer: 'Yes—feel free to bring your baby along to any session.'
        },
        {
          question: 'What if I\'m having scary thoughts?',
          answer: 'Scary thoughts are a common symptom for those experiencing perinatal mood and anxiety disorders. Perinatal mood and anxiety disorders are the most common complication following childbirth. If you are having scary thoughts, you are not alone. At Bloom, we specialize in helping you get control over your thoughts, improve your wellbeing, and start to feel like yourself again.'
        }
      ]
    }
  ];

  const filteredCategories = categories.filter(category => {
    if (activeCategory !== 'all' && category.id !== activeCategory) return false;
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchLower) ||
        (typeof q.answer === 'string' && q.answer.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-bloom-pink-50 to-white overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-right"
          opacity={0.05}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="bottom-left"
          opacity={0.07}
          rotate={45}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <KineticTypography as="h1" animation="fade-in" className="font-playfair text-bloom text-4xl md:text-5xl mb-6">
              Frequently Asked Questions
            </KineticTypography>
            
            <p className="text-bloom/70 text-lg mb-8">
              Find answers to common questions about our therapy services, insurance, and treatment process.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Search for a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bloompink/30 focus:border-bloompink transition-all"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-bloompink text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-bloompink text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12 last:mb-0"
            >
              {/* Category Header */}
              <div className="mb-8">
                <GlassmorphismPanel
                  variant="subtle"
                  className="p-6 md:p-8"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white mr-4`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="font-playfair text-2xl text-bloom">{category.title}</h2>
                      <p className="text-bloom/60">{category.description}</p>
                    </div>
                  </div>
                </GlassmorphismPanel>
              </div>
              
              {/* Questions */}
              <div className="space-y-4 max-w-3xl mx-auto">
                {category.questions.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer list-none p-6 rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="text-lg font-medium text-bloom pr-6">{faq.question}</h3>
                        <span className="text-bloom transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-bloom/80">
                        <div className="pt-2">{faq.answer}</div>
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-bloom-pink-50 relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="var(--bloom-accent)"
          size="full"
          position="bottom-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <GlassmorphismPanel variant="pink" className="py-12 px-8 max-w-2xl mx-auto">
            <KineticTypography as="h2" animation="fade-in" className="font-playfair text-2xl text-bloom mb-4">
              Still have questions?
            </KineticTypography>
            
            <p className="text-bloom/80 mb-8">
              We're here to help. Schedule a free consultation call to discuss your specific needs.
            </p>
            
            <Button 
              href="/book" 
              variant="pink" 
              size="lg"
              className="inline-block"
            >
              Book Now
            </Button>
          </GlassmorphismPanel>
        </div>
      </section>
    </>
  );
}