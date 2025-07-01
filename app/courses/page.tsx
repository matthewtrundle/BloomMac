'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import CourseWaitlist from '@/components/ui/CourseWaitlist';
import CoursePurchaseButton from '@/components/ui/CoursePurchaseButton';

// Course purchases are currently disabled - coming soon
const COURSES_ENABLED = false;
const LAUNCH_DATE = 'July 2025';

const courses = [
  {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    subtitle: 'Your 6-Week Journey to Emotional Balance',
    description: 'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life with confidence and clarity.',
    duration: '6 weeks',
    modules: 6,
    price: 197,
    originalPrice: 297,
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
    features: [
      'Weekly video lessons with Dr. Jana',
      'Downloadable workbooks and exercises',
      'Audio meditations for busy moms',
      'Lifetime access to materials',
      'Certificate of completion'
    ],
    outcomes: [
      'Understand postpartum emotions',
      'Build coping strategies',
      'Create self-care routines',
      'Strengthen mother-baby bond'
    ],
    highlighted: true
  },
  {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    subtitle: 'Practical Tools for Peace of Mind',
    description: 'Learn evidence-based techniques to manage postpartum anxiety and worry, specifically designed for the unique challenges of new motherhood.',
    duration: '4 weeks',
    modules: 4,
    price: 127,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
    features: [
      'Weekly technique tutorials',
      'Anxiety tracking tools',
      'Quick relief exercises',
      'Emergency coping cards',
      'Progress tracking journal'
    ],
    outcomes: [
      'Reduce anxiety symptoms',
      'Master calming techniques',
      'Build confidence',
      'Sleep better'
    ]
  },
  {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    subtitle: 'For Partners Who Want to Help',
    description: 'Equip partners with the knowledge and skills to provide meaningful support during the postpartum period.',
    duration: '2 weeks',
    modules: 4,
    price: 97,
    image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp',
    features: [
      'Short, practical video lessons',
      'Communication scripts',
      'Warning signs checklist',
      'Support action plans',
      'Partner discussion guides'
    ],
    outcomes: [
      'Recognize postpartum symptoms',
      'Communicate effectively',
      'Provide practical support',
      'Know when to seek help'
    ]
  }
];

const testimonials = [
  {
    name: 'Sarah M.',
    course: 'Postpartum Wellness Foundations',
    text: 'This course gave me the tools I desperately needed. I went from feeling overwhelmed every day to actually enjoying motherhood.',
    rating: 5
  },
  {
    name: 'Jessica L.',
    course: 'Anxiety Management',
    text: 'The techniques are so practical! I can use them while nursing, during night wakings, whenever I need them.',
    rating: 5
  },
  {
    name: 'Mike T.',
    course: 'Partner Support Bootcamp',
    text: 'I finally understood what my wife was going through and how to actually help instead of just asking "what can I do?"',
    rating: 5
  }
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Coming Soon Banner */}
      {!COURSES_ENABLED && (
        <div className="bg-bloompink text-white py-3 text-center">
          <p className="text-sm font-medium">
            🎉 Courses launching {LAUNCH_DATE}! Join the waitlist for early access and special pricing.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-playfair mb-6">
              <span className="text-bloom-dark">Digital Courses for </span>
              <span className="text-bloompink">Postpartum Wellness</span>
            </h1>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto mb-8"></div>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              Self-paced, evidence-based programs designed by Dr. Jana Rundle to support your journey through motherhood
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button href="#courses" variant="pink" size="lg">
                Explore Courses
              </Button>
              <Button href="/book" variant="outline" size="lg">
                Prefer 1-on-1 Support?
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-bloom-dark/60">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Evidence-Based Content</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Created by Licensed Psychologist</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert-Led Content</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Preview Video */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-playfair text-bloom-dark mb-4">
              A Personal Message from Dr. Jana
            </h2>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto mb-6"></div>
            
            {/* Emotional Context */}
            <div className="bg-bloom-sage-50/20 p-4 rounded-lg mb-8">
              <p className="text-bloom-dark/70">
                You're not alone in feeling overwhelmed. Watch Dr. Jana share her warm, evidence-based approach to helping new moms find their footing.
              </p>
            </div>

            {/* Video Container */}
            <div className="relative max-w-4xl mx-auto">
              {/* Video Controls Info */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-bloom-dark/60">Duration: 3 min</span>
                  <span className="bg-bloom-sage/10 px-2 py-1 rounded text-xs">CC Available</span>
                  <span className="text-bloom-pink/70">Licensed Clinical Psychologist</span>
                </div>
                <button className="text-bloom-pink hover:underline">
                  Read Transcript
                </button>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    src="https://player.vimeo.com/video/1097658900?badge=0&autopause=0&player_id=0&app_id=58479"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    title="Dr. Jana Rundle - A Personal Message About Postpartum Wellness"
                  ></iframe>
                </div>
              </div>
              
              {/* Post-Video CTA */}
              <div className="mt-8 bg-gradient-to-r from-bloompink/10 to-bloom-sage/10 p-6 rounded-xl text-center">
                <h3 className="text-2xl font-semibold mb-4">Ready to Experience This Transformation?</h3>
                <p className="text-bloom-dark/70 mb-6">
                  Join 500+ moms getting early access + 30% launch discount
                </p>
                <Button href="#courses" variant="pink" size="lg" className="mb-4">
                  Secure My Spot Now
                </Button>
                <p className="text-sm text-bloom-dark/60">
                  ⏰ Limited time: First 100 members get special pricing
                </p>
              </div>
              
              {/* Enhanced Feature Cards with Social Proof */}
              <div className="mt-8 grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-bloom-sage-50/30 p-6 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloom-sage/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-bloom-dark mb-2">Evidence-Based Results</h4>
                      <p className="text-sm text-bloom-dark/70">95% of mothers report reduced anxiety within 2 weeks of starting our program</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-bloompink/10 p-6 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloompink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-bloom-dark mb-2">Real Mom Stories</h4>
                      <p className="text-sm text-bloom-dark/70">"I went from panic attacks to peaceful nights in just 3 weeks" - Sarah M.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-bloom-accent/10 p-6 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloom-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-bloom-dark mb-2">Immediate Impact</h4>
                      <p className="text-sm text-bloom-dark/70">Use tonight: 5-minute technique that stops overwhelm instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
              <p className="text-bloom-dark/70">Access lessons anytime, perfect for unpredictable baby schedules</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloompink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Designed for Moms</h3>
              <p className="text-bloom-dark/70">Short, practical lessons you can complete while baby naps</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Tools for Real Life</h3>
              <p className="text-bloom-dark/70">Backed by science with strategies you can actually use</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-center mb-12">Choose Your Path to Wellness</h2>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${course.highlighted ? 'lg:-mt-8' : ''}`}
              >
                {course.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-bloompink text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`bg-gradient-to-br from-white to-bloom-sage-50/20 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 group ${
                  course.highlighted ? 'ring-2 ring-bloompink' : 'border border-bloom-sage/10'
                }`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90 flex items-center gap-2">
                        <span>⏱️</span>
                        {course.duration} • {course.modules} modules
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-bloom-dark/60 mb-4">{course.subtitle}</p>
                    <p className="text-bloom-dark/80 mb-6">{course.description}</p>
                    
                    <div className="mb-6">
                      <p className="font-semibold mb-2">You'll learn to:</p>
                      <ul className="space-y-1">
                        {course.outcomes.map((outcome, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-bloom-dark/70">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-bloompink">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-lg text-bloom-dark/40 line-through">${course.originalPrice}</span>
                        )}
                      </div>
                      
                      {COURSES_ENABLED ? (
                        <div className="space-y-3">
                          <CoursePurchaseButton
                            courseId={course.id}
                            courseName={course.title}
                            price={course.price * 100}
                            originalPrice={course.originalPrice ? course.originalPrice * 100 : undefined}
                            size="md"
                            variant={course.highlighted ? 'primary' : 'secondary'}
                          />
                          <Link
                            href={`/courses/${course.id}`}
                            className="block text-center py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <button
                            disabled
                            className="w-full py-3 rounded-lg font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                          <p className="text-xs text-center mt-2 text-bloom-dark/60">
                            Launching {LAUNCH_DATE}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section - Only show when courses are disabled */}
      {!COURSES_ENABLED && (
        <section className="py-20 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 max-w-2xl">
            <CourseWaitlist 
              courseId="all"
              courseName="our digital wellness courses"
            />
          </div>
        </section>
      )}


      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/20 to-white relative overflow-hidden">
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair text-bloom-dark mb-6">Common Questions</h2>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mx-auto"></div>
          </motion.div>
          
          <div className="space-y-6">
            <motion.details 
              className="bg-gradient-to-br from-white to-bloom-sage-50/20 p-6 rounded-xl shadow-lg border border-bloom-sage/10 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-bloom-dark group-hover:text-bloompink transition-colors">
                How long do I have access to the course?
                <svg className="w-5 h-5 text-bloom-dark/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-bloom-dark/70">
                You have lifetime access to all course materials. Complete them at your own pace and revisit anytime you need a refresher.
              </p>
            </motion.details>

            <motion.details 
              className="bg-gradient-to-br from-white to-bloom-sage-50/20 p-6 rounded-xl shadow-lg border border-bloom-sage/10 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-bloom-dark group-hover:text-bloompink transition-colors">
                What if I need more personalized support?
                <svg className="w-5 h-5 text-bloom-dark/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-bloom-dark/70">
                If you need more support, we're here for you. We always offer a free 15-minute consultation to see how we can help you. <Link href="/book" className="text-bloompink hover:underline">Book now</Link>.
              </p>
            </motion.details>

            <motion.details 
              className="bg-gradient-to-br from-white to-bloom-sage-50/20 p-6 rounded-xl shadow-lg border border-bloom-sage/10 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-bloom-dark group-hover:text-bloompink transition-colors">
                Can I access the course on my phone?
                <svg className="w-5 h-5 text-bloom-dark/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-bloom-dark/70">
                Yes! All courses are mobile-friendly. Watch videos, complete exercises, and track your progress from any device.
              </p>
            </motion.details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-bloompink to-bloom/90 text-white relative overflow-hidden">
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair mb-6">Ready to Start Your Healing Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Take the first step with our evidence-based courses, designed with professional expertise and maternal understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button href="#courses" variant="outline" size="lg" className="bg-white text-bloompink border-white hover:bg-gray-50 shadow-lg">
                Choose Your Course
              </Button>
              <Button href="/book" variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg">
                Book a Free Consultation
              </Button>
            </div>
            
            <motion.p 
              className="mt-8 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              Lifetime access • Self-paced learning • Expert-created content
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}