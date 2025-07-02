'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { services } from '@/lib/data/services';

// Scroll effect utilities
import setupScrollGreyscale from '@/lib/hooks/useScrollGreyscale';
import setupScrollReveal from '@/lib/hooks/useScrollReveal';
import useParallaxHero from '@/lib/hooks/useParallaxHero';

// UI Components - Dynamically import non-critical components
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import AnimatedTagline from '@/components/ui/AnimatedTagline';
import TeamImageCarousel from '@/components/ui/TeamImageCarousel';

// Dynamic imports for components not immediately visible
const GlassmorphismPanel = dynamic(() => import('@/components/ui/GlassmorphismPanel'));
const SimpleParallaxContainer = dynamic(() => import('@/components/ui/SimpleParallaxContainer'));
const CardAccent = dynamic(() => import('@/components/ui/CardAccent'));
const NewsletterSignup = dynamic(() => import('@/components/ui/NewsletterSignup'));

// SEO Components
import { OrganizationSchema } from '@/components/seo/JsonLd';

// Client components can't use the revalidate export
// Use route handlers for data revalidation instead

export default function Home() {
  // Video modal state
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Refs for scroll effects
  const teamImageRef = useRef<HTMLDivElement>(null);
  const welcomeTitleRef = useRef<HTMLDivElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const paragraph3Ref = useRef<HTMLParagraphElement>(null);
  const ctaTitleRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLParagraphElement>(null);
  
  // Use the optimized hero image
  const heroImage = '/images/optimized/Hero/herooptimzed.webp';
  
  // Use parallax effect for hero with more subtle movement
  const parallaxOffset = useParallaxHero({ speedFactor: 0.3, maxOffset: 150 });
  
  // Optional parallax for welcome section background - more pronounced
  const welcomeParallaxOffset = useParallaxHero({ speedFactor: 0.4, maxOffset: 200 });
  
  // Apply scroll effects
  useEffect(() => {
    // Store cleanup functions
    const cleanupFunctions: Array<() => void> = [];
    
    // Apply grayscale effect to team image
    if (teamImageRef.current) {
      const cleanup = setupScrollGreyscale(teamImageRef.current, { grayscaleOnEnter: true });
      cleanupFunctions.push(cleanup);
    }
    
    // Apply reveal effects to text elements
    if (welcomeTitleRef.current) {
      const cleanup = setupScrollReveal(welcomeTitleRef.current);
      cleanupFunctions.push(cleanup);
    }
    
    if (paragraph1Ref.current) {
      const cleanup = setupScrollReveal(paragraph1Ref.current, { delay: 200 });
      cleanupFunctions.push(cleanup);
    }
    
    if (paragraph2Ref.current) {
      const cleanup = setupScrollReveal(paragraph2Ref.current, { delay: 400 });
      cleanupFunctions.push(cleanup);
    }
    
    if (paragraph3Ref.current) {
      const cleanup = setupScrollReveal(paragraph3Ref.current, { delay: 600 });
      cleanupFunctions.push(cleanup);
    }
    
    
    if (ctaTitleRef.current) {
      const cleanup = setupScrollReveal(ctaTitleRef.current);
      cleanupFunctions.push(cleanup);
    }
    
    if (ctaTextRef.current) {
      const cleanup = setupScrollReveal(ctaTextRef.current, { delay: 200 });
      cleanupFunctions.push(cleanup);
    }
    
    
    // Clean up all observers when component unmounts
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);
  
  return (
    <div>
      {/* SEO Schema */}
      <OrganizationSchema
        name="Bloom Psychology"
        url="https://bloompsychologynorthaustin.com"
        logo="https://bloompsychologynorthaustin.com/images/Logo/logo.jpg"
        description="Specialized therapy for women, moms, and parents in Texas."
        address={{
          streetAddress: "13706 N Highway 183, Suite 114",
          addressLocality: "Austin",
          addressRegion: "TX",
          postalCode: "78750",
          addressCountry: "US"
        }}
        telephone="+15128989510"
        email="jana@bloompsychologynorthaustin.com"
        sameAs={["https://www.instagram.com/bloompsychology.atx/"]}
      />
      
      {/* Hero Section - Modern Maternal Design */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] bg-white overflow-hidden">
        {/* Geometric background elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#f8b5c4]/10 rounded-full"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-[#1e3a5f]/5 rounded-full"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh] md:min-h-[80vh] py-12">
            {/* Left column - Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="xl:pl-12 pt-4"
            >
              {/* Small accent */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#f8b5c4]"></div>
                <span className="text-sm font-medium text-[#f8b5c4] uppercase tracking-wide">Austin & All of Texas</span>
              </div>
              
              {/* New animated tagline */}
              <AnimatedTagline />
              
              {/* Removed all experimental typography options */}
            
              <div className="flex flex-col sm:flex-row gap-4 mb-12 mt-8">
                <Link href="/new-mom-program">
                  <button className="bg-[#1e3a5f] text-white px-8 py-4 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                    Learn About New Mom Program
                  </button>
                </Link>
                <Link href="/book">
                  <button className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Book Now
                  </button>
                </Link>
              </div>
              
              {/* Modern trust badges */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">New Mom Program Available</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">Evidence-Based Therapy</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">Virtual & In-Person</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Modern image treatment */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Geometric frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#f8b5c4]/20 to-[#1e3a5f]/10 rounded-2xl transform rotate-3"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/optimized/Team/img_1602.webp"
                    alt="Dr. Jana Rundle"
                    width={500}
                    height={600}
                    className="object-cover"
                  />
                  {/* Modern overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="font-bold text-xl">Dr. Jana Rundle</p>
                      <p className="text-sm opacity-90">Licensed Clinical Psychologist</p>
                      <p className="text-xs opacity-80">Perinatal Mental Health Specialist</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Team Showcase Section - Professional Photography */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-bold text-[#1e3a5f] text-4xl md:text-5xl mb-6">
                Expert Mental Health Care for Women
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Dr. Jana Rundle brings warmth, expertise, and understanding to every interaction. 
                With years of experience supporting women through life's most challenging moments—from motherhood 
                to career transitions—she creates a safe space where healing and growth can flourish.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Professional Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-lg mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f8b5c4]/10 to-[#1e3a5f]/5 z-10" />
                  <Image
                    src="/images/optimized/Team/img_1623.webp"
                    alt="Dr. Jana Rundle - Professional Portrait"
                    width={500}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 z-20" />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-[#1e3a5f]">
                    A Personal Approach to Professional Care
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every women's journey is unique. That's why Dr. Rundle takes the time to understand 
                    your specific circumstances, challenges, and goals. Whether you're struggling with burn 
                    out, navigating new motherhood, or struggling with identity changes, you'll find 
                    compassionate, evidence-based care tailored to your needs.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Specialized Training</h4>
                    <p className="text-gray-600 text-sm">
                      Doctoral-level care and advanced certifications in perinatal mental health
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Clinician & Mother</h4>
                    <p className="text-gray-600 text-sm">
                      Personal experience combined with clinical expertise creates deep understanding
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Evidence-Based Methods</h4>
                    <p className="text-gray-600 text-sm">
                      Integrating the latest research with proven therapeutic approaches
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Holistic Approach</h4>
                    <p className="text-gray-600 text-sm">
                      Addressing emotional, physical, and relational aspects of women's wellness
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/about">
                    <button className="bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                      Read Full Bio
                    </button>
                  </Link>
                  <Link href="/consultation">
                    <button className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-lg hover:bg-[#1e3a5f] hover:text-white transition-all font-medium">
                      Book Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Digital Programs Section - Modern Maternal Design */}
      <section className="py-20 bg-gray-50">
        
        <div className="container mx-auto px-6 relative">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-bold text-[#1e3a5f] text-4xl md:text-5xl mb-4">
              Digital Programs for Women & Mothers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Evidence-based online courses designed to fit your life, not the other way around.
            </p>
          </motion.div>
          
          {/* Modern trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-700">100% Online</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-700">Self-Paced Learning</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-700">Expert-Led Content</span>
            </div>
          </div>
          
          {/* Modern Course Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-3 bg-gradient-to-r from-[#f8b5c4] to-[#f472b6]"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">🌸 Postpartum Wellness</h3>
                <p className="text-sm text-gray-500 mb-4">6-week program</p>
                <p className="text-gray-600 mb-6">Build emotional regulation skills and develop lasting confidence in your new role</p>
                
                {/* Watch Lesson 1 Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="w-full bg-gradient-to-r from-[#f8b5c4]/10 to-[#f8b5c4]/5 hover:from-[#f8b5c4]/20 hover:to-[#f8b5c4]/10 border border-[#f8b5c4]/20 rounded-xl p-4 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow">
                          <svg className="w-6 h-6 text-[#f8b5c4]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#1e3a5f]">Watch First Lesson</p>
                          <p className="text-xs text-gray-600">Get a preview of the course content</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-[#f8b5c4]/40 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Daily coping strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Strong self-care foundation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Sustainable inner peace</span>
                  </li>
                </ul>
                <a href="/courses/postpartum-wellness-foundations" className="block text-center bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Learn More
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-3 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6]"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">🧘‍♀️ Anxiety Management</h3>
                <p className="text-sm text-gray-500 mb-4">4-week program</p>
                <p className="text-gray-600 mb-6">Learn evidence-based techniques to manage anxiety and calm your mind</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Immediate symptom relief</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Proven coping strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Long-term emotional stability</span>
                  </li>
                </ul>
                <a href="/courses" className="block text-center bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Learn More
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-3 bg-gradient-to-r from-[#d4a574] to-[#f59e0b]"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">💑 Partner Support</h3>
                <p className="text-sm text-gray-500 mb-4">3-week program</p>
                <p className="text-gray-600 mb-6">Strengthen your relationship with communication tools and mutual support strategies</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Enhanced communication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Deeper understanding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f8b5c4] rounded-full"></div>
                    <span className="text-sm text-gray-700">Unified partnership</span>
                  </li>
                </ul>
                <a href="/courses" className="block text-center bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-white relative overflow-hidden z-10">
        <div className="container mx-auto px-4">
          <NewsletterSignup 
            variant="banner"
            source="homepage_banner"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
      
      {/* Why Choose Bloom Psychology Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-bloom-blush/5 relative overflow-hidden z-10">
        {/* Background pattern with simple wave */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,50 Q250,0 500,50 T1000,50 L1000,100 L0,100 Z" 
                  fill="currentColor" 
                  className="text-bloom-blush" 
                  opacity="0.5"/>
          </svg>
        </div>
        
        {/* Organic shapes */}
        <div className="absolute inset-0">
          <OrganicShape
            variant="blob-2"
            color="var(--bloom-blush)"
            size="md"
            position="top-right"
            opacity={0.03}
          />
          <OrganicShape
            variant="wave"
            color="var(--bloom-blush)"
            size="sm"
            position="bottom-left"
            opacity={0.02}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image column with overlap effect */}
            <div className="relative lg:-mr-16 z-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Multi-card background effect */}
                <div className="relative">
                  {/* Background cards */}
                  <div className="absolute inset-0 transform rotate-6 bg-[#f8b5c4]/20 rounded-2xl"></div>
                  <div className="absolute inset-0 transform rotate-3 bg-[#1e3a5f]/10 rounded-2xl"></div>
                  
                  {/* Main image container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8b5c4]/10 to-[#1e3a5f]/5 z-10" />
                    <Image
                      src="/images/optimized/Team/Jana Rundle.webp"
                      alt="Dr. Jana Rundle"
                      width={500}
                      height={600}
                      className="object-cover w-full h-full"
                      priority
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 z-20" />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Content column with glass card */}
            <div className="lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 lg:p-10"
              >
                {/* Headline */}
                <h2 className="font-bold text-[#1e3a5f] text-3xl md:text-4xl mb-6">
                  Why Choose <span className="text-[#f8b5c4]">Bloom Psychology</span>
                </h2>
                
                {/* First paragraph - no drop cap */}
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  When life feels overwhelming and you're struggling to keep up, we understand. At Bloom Psychology, we specialize in helping women—whether you're navigating motherhood, career challenges, or life transitions—transform from feeling burned out and exhausted to finding renewed energy and purpose.
                </p>
                
                {/* Second paragraph */}
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Our evidence-based approach combines compassionate support with proven therapeutic techniques. We create a safe, judgment-free space where you can explore your challenges and develop practical strategies for lasting change.
                </p>
                
                {/* Modern accent text */}
                <p className="text-[#1e3a5f] text-xl font-semibold mb-8">
                  We help you find meaning and purpose in the complexities of modern life.
                </p>
                
                {/* Modern button */}
                <Link href="/about">
                  <button className="bg-[#1e3a5f] text-white px-8 py-4 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                    Learn More About Us
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Texas Coverage Section - Modern Maternal */}
      <section className="py-20 bg-white">
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-6">
                  Now Serving <span className="text-[#f8b5c4]">All of Texas</span>
                </h2>
                
                <p className="text-lg text-gray-700 mb-8">
                  Licensed to provide virtual therapy throughout Texas, we bring 
                  specialized mental health care directly to you. Quality therapy 
                  from the comfort of your own home.
                </p>
                
                {/* Service Coverage Cards */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-[#1e3a5f] mb-2">Statewide Coverage</h3>
                    <p className="text-sm text-gray-600 mb-1">Licensed across all of Texas</p>
                    <p className="text-xs text-gray-500">From El Paso to Houston, we're here for you</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-[#1e3a5f] mb-2">100% Virtual Therapy</h3>
                    <p className="text-sm text-gray-600 mb-1">Online video sessions from home</p>
                    <p className="text-xs text-gray-500">Secure, HIPAA-compliant platform</p>
                  </div>
                </div>
                
                {/* How It Works */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl mb-8">
                  <h3 className="font-semibold text-[#1e3a5f] mb-4">How Virtual Therapy Works</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#f8b5c4]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1e3a5f]">1</span>
                      <span className="text-sm text-gray-700">Book your free consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#f8b5c4]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1e3a5f]">2</span>
                      <span className="text-sm text-gray-700">Complete personalized assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#f8b5c4]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1e3a5f]">3</span>
                      <span className="text-sm text-gray-700">Begin weekly therapy sessions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#f8b5c4]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1e3a5f]">4</span>
                      <span className="text-sm text-gray-700">Experience lasting transformation</span>
                    </div>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/virtual-therapy">
                    <button className="bg-[#1e3a5f] text-white px-8 py-4 rounded-lg hover:bg-[#152a47] transition-colors font-medium w-full sm:w-auto">
                      Learn About Virtual Therapy
                    </button>
                  </Link>
                  <Link href="/texas-service-areas">
                    <button className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto">
                      View Service Areas
                    </button>
                  </Link>
                </div>
                
              </motion.div>
              
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Background accent */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#f8b5c4]/20 to-[#1e3a5f]/10 rounded-2xl"></div>
                  
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png"
                      alt="Virtual therapy session"
                      width={600}
                      height={500}
                      className="object-cover"
                    />
                    
                    {/* Overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e3a5f]/90 to-transparent p-8">
                      <p className="text-white text-lg font-medium mb-2">
                        Connect from Anywhere in Texas
                      </p>
                      <p className="text-white/80 text-sm">
                        Professional therapy in your safe space
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - Modern Maternal Design */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-8">
            <motion.div 
              ref={welcomeTitleRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-bold text-[#1e3a5f] text-3xl md:text-4xl lg:text-5xl mb-6">
                Welcome to <span className="text-[#f8b5c4]">Bloom Psychology</span>
              </h2>
              
              <div className="w-24 h-0.5 bg-[#f8b5c4] mx-auto mb-12"></div>
            </motion.div>
          </div>
          
          <div className="space-y-6 text-bloom max-w-3xl mx-auto">
            <p ref={paragraph1Ref} className="text-lg md:text-xl text-center leading-relaxed text-gray-700">
              Led by Dr. Jana Rundle, our practice specializes in addressing anxiety, stress, parenting challenges, and postpartum mental health in a warm, non-judgmental environment.
            </p>
            
            <div className="space-y-4 text-left mt-12 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#f8b5c4] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-700">Are you struggling with keeping up with it all?</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#f8b5c4] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-700">Are you starting to feel like you may be failing at everything?</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#f8b5c4] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-700">Are you feeling burned out?</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[#f8b5c4] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-700">Are you wondering if you may be a good mom?</p>
              </div>
            </div>
            
            <p ref={paragraph2Ref} className="font-medium text-center text-lg md:text-xl pt-8 text-[#1e3a5f] leading-relaxed">
              Are you ready to stop feeling overwhelmed and start feeling more in control of your life?
            </p>
            
            <p ref={paragraph3Ref} className="text-xl md:text-2xl font-bold text-center pt-6 text-[#1e3a5f]">
              Your life could look <span className="text-[#f8b5c4]">very different</span> six months from now!
            </p>
            
            <div className="pt-8 flex justify-center">
              <Link href="/new-mom-program">
                <button className="bg-[#1e3a5f] text-white px-8 py-4 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Explore New Mom Program
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* CTA Section - Modern Maternal */}
      <section className="py-20 bg-[#1e3a5f]">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            ref={ctaTitleRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-bold text-white text-4xl md:text-5xl mb-6">
              Begin Your Healing Journey Today
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-white/90 max-w-2xl mx-auto mb-10 text-lg" 
            ref={ctaTextRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Take the first step toward healing and growth with a free 15-minute consultation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a href="/book" className="inline-block bg-[#f8b5c4] text-[#1e3a5f] px-8 py-4 rounded-lg hover:bg-[#f4a0b5] transition-colors font-medium text-lg">
              Book Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                aria-label="Close video"
              >
                <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Header */}
              <div className="bg-gradient-to-r from-[#f8b5c4] to-[#f472b6] text-white p-6 pb-4">
                <h3 className="text-2xl font-bold mb-2">Course Preview: Postpartum Wellness Foundations</h3>
                <p className="text-white/90 text-sm">Get a glimpse of Dr. Jana's warm, evidence-based approach</p>
              </div>

              {/* Video Container */}
              <div className="aspect-video bg-black">
                <iframe 
                  src="https://player.vimeo.com/video/1097724383?autoplay=1&title=0&byline=0&portrait=0"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Postpartum Wellness Course Preview"
                />
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-gray-50/30 to-white p-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-[#1e3a5f] mb-3">Ready to Start Your Journey?</h4>
                  <p className="text-gray-600 mb-4">Join 500+ moms who are transforming their postpartum experience</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link href="/courses/postpartum-wellness-foundations">
                      <button 
                        onClick={() => setShowVideoModal(false)}
                        className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium"
                      >
                        Learn More About This Course
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Continue browsing
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Self-Paced Learning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Evidence-Based Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
