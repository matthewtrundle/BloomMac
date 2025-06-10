'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
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
import GardenServiceCard from '@/components/ui/GardenServiceCard';
import SeedPacketCard from '@/components/ui/SeedPacketCard';
import FloatingSeeds from '@/components/ui/FloatingSeeds';
import TexasGardenMap from '@/components/ui/TexasGardenMap';
import GardenZoneCard from '@/components/ui/GardenZoneCard';

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
  // Refs for scroll effects
  const teamImageRef = useRef<HTMLDivElement>(null);
  const welcomeTitleRef = useRef<HTMLDivElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const paragraph3Ref = useRef<HTMLParagraphElement>(null);
  const serviceTitleRef = useRef<HTMLDivElement>(null);
  const serviceDescRef = useRef<HTMLParagraphElement>(null);
  const ctaTitleRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLParagraphElement>(null);
  
  // Service panel refs stored in an array
  const servicePanelRefs = useRef<Array<HTMLDivElement | null>>([]);
  
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
    
    if (serviceTitleRef.current) {
      const cleanup = setupScrollReveal(serviceTitleRef.current);
      cleanupFunctions.push(cleanup);
    }
    
    if (serviceDescRef.current) {
      const cleanup = setupScrollReveal(serviceDescRef.current, { delay: 300 });
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
    
    // Apply reveal effects to service panels
    servicePanelRefs.current.forEach((ref, index) => {
      if (ref) {
        const cleanup = setupScrollReveal(ref, { delay: 100 * (index % 3) });
        cleanupFunctions.push(cleanup);
      }
    });
    
    // Clean up all observers when component unmounts
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);
  
  return (
    <>
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
      
      {/* Hero Section */}
      <section className="relative h-auto md:h-[75vh] min-h-auto md:min-h-[75vh] hero-section contain-layout bg-gradient-to-b from-pink-50/30 to-white md:bg-transparent">
        {/* Fixed hero background image - hidden on mobile */}
        <div className="hidden md:block fixed inset-x-0 top-0 h-[75vh] w-full" style={{ zIndex: -1 }}>
          <div className="relative w-full h-full">
            <Image
              src={heroImage}
              alt="Bloom Psychology hero"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 20%' }}
              quality={85}
              sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 100vw"
              priority
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-transparent to-white/40 pointer-events-none"></div>
          </div>
          
          {/* Add tech grid/network overlay */}
          <div className="absolute inset-0 mix-blend-soft-light opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        {/* Mobile Hero Image - Jana's picture */}
        <div className="md:hidden w-full pt-20 pb-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-[4/5] max-w-sm mx-auto px-4"
          >
            <Image
              src="/images/optimized/Team/Jana Rundle.webp"
              alt="Dr. Jana Rundle"
              fill
              className="object-cover rounded-2xl shadow-xl"
              style={{ objectPosition: '50% 20%' }}
              quality={85}
              sizes="(max-width: 640px) 100vw, 640px"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            {/* Flower accent on mobile image */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 z-10"
            >
              <Image
                src="/images/flower no stem.svg"
                alt="Flower accent"
                width={45}
                height={45}
                className="opacity-80"
              />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 h-full md:flex md:items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl w-full md:ml-8 lg:ml-16 md:mr-auto pb-8 pt-0 md:pt-24 lg:pt-32"
          >
            {/* Hero text - Elegant, impactful typography with sophisticated hierarchy */}
            <div className="text-center md:text-left">
              {/* Main tagline - Elegant and refined, with subtle impact */}
              <h1 className="font-playfair font-semibold text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-normal mb-6">
                <span className="block text-bloom-dark/90 mb-2" style={{ 
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.3)'
                }}>
                  Life changes—
                </span>
                <span className="block text-bloompink/90" style={{ 
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.3)'
                }}>
                  so do you.
                </span>
              </h1>
              
              {/* Subheading - Graceful and understated */}
              <h2 className="font-poppins font-medium text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl text-bloom/80 mb-8 leading-relaxed" style={{ 
                letterSpacing: '0.01em',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)'
              }}>
                We're here for all of it.
              </h2>
              
              {/* Location tagline - Clean and sophisticated */}
              <div className="space-y-2 mt-10">
                <p className="font-inter font-normal text-lg sm:text-xl md:text-xl lg:text-2xl text-bloom-dark/80" 
                   style={{ 
                     letterSpacing: '0.02em',
                     textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)'
                   }}>
                  <span className="text-bloom/90">Bloom Psychology</span>
                </p>
                <p className="font-inter font-light text-sm sm:text-base md:text-lg lg:text-xl text-bloom-dark/60" 
                   style={{ 
                     textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)'
                   }}>
                  In-person in Austin <span className="text-bloompink/70 mx-2">•</span> Online for all of Texas
                </p>
              </div>
            </div>

            {/* Removed all experimental typography options */}
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 mt-8 sm:mt-10">
              <motion.a 
                href="/book" 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-bloompink/90 hover:bg-bloompink text-white font-normal font-inter px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-500 text-center text-sm sm:text-sm tracking-wide"
                style={{
                  boxShadow: '0 4px 12px rgba(198, 71, 138, 0.15), 0 2px 4px rgba(198, 71, 138, 0.1)'
                }}
              >
                Book Now
              </motion.a>
              
              <motion.a 
                href="/new-mom-program" 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-bloom/90 border border-bloom/15 hover:border-bloom/25 font-normal font-inter px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-500 text-center text-sm sm:text-sm"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)'
                }}
              >
                New Mom Program
              </motion.a>
              
              <motion.a 
                href="#services" 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-bloom/90 hover:bg-bloom text-white font-normal font-inter px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-500 text-center text-sm sm:text-sm"
                style={{
                  boxShadow: '0 2px 8px rgba(116, 86, 103, 0.15), 0 1px 3px rgba(116, 86, 103, 0.1)'
                }}
              >
                Explore Services
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Introduction Section with solid background to cover fixed image */}
      <section className="py-20 relative z-10" style={{ background: 'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(254, 240, 241), white)' }}>
        {/* Parallax background layer */}
        <div 
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${welcomeParallaxOffset}px)` }}
        >
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="welcome-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-bloompink" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#welcome-dots)" />
            </svg>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${welcomeParallaxOffset * 0.6}px)` }}
        >
          <OrganicShape
            variant="wave"
            color="var(--bloom-blush)"
            size="full"
            position="bottom-left"
            opacity={0.1}
          />
          
          <OrganicShape
            variant="blob-2"
            color="var(--bloom-blush)"
            size="sm"
            position="top-right"
            opacity={0.04}
            rotate={30}
          />
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-8">
            <motion.div 
              ref={welcomeTitleRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-bloom/90 text-2xl md:text-3xl lg:text-4xl mb-6 font-normal">
                Welcome to <span className="font-medium text-bloompink/90">Bloom Psychology</span>
              </h2>
              
              <div className="w-24 h-0.5 bg-bloompink/50 mx-auto mb-12 rounded-full"></div>
            </motion.div>
          </div>
          
          <div className="space-y-6 text-bloom max-w-3xl mx-auto">
            <p ref={paragraph1Ref} className="text-base md:text-lg font-light text-center leading-loose text-gray-600">
              Led by Dr. Jana Rundle, our practice specializes in addressing anxiety, stress, parenting challenges, and postpartum mental health in a warm, non-judgmental environment.
            </p>
            
            {/* Bullet Points with flower markers */}
            <div className="space-y-4 text-left mt-12">
              <motion.div 
                className="flex items-start group cursor-pointer"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="mr-3 mt-0.5 flex-shrink-0"
                >
                  <Image 
                    src="/images/flower no stem.svg" 
                    alt="Bloom flower" 
                    width={24} 
                    height={24} 
                    className="transition-transform duration-300"
                  />
                </motion.div>
                <p className="text-base text-bloom/80 group-hover:text-bloom transition-colors duration-500">Are you struggling with keeping up with it all?</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start group cursor-pointer"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="mr-3 mt-0.5 flex-shrink-0"
                >
                  <Image 
                    src="/images/flower no stem.svg" 
                    alt="Bloom flower" 
                    width={24} 
                    height={24} 
                    className="transition-transform duration-300"
                  />
                </motion.div>
                <p className="text-base text-bloom/80 group-hover:text-bloom transition-colors duration-500">Are you starting to feel like you may be failing at everything?</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start group cursor-pointer"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="mr-3 mt-0.5 flex-shrink-0"
                >
                  <Image 
                    src="/images/flower no stem.svg" 
                    alt="Bloom flower" 
                    width={24} 
                    height={24} 
                    className="transition-transform duration-300"
                  />
                </motion.div>
                <p className="text-base text-bloom/80 group-hover:text-bloom transition-colors duration-500">Are you feeling burned out?</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start group cursor-pointer"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="mr-3 mt-0.5 flex-shrink-0"
                >
                  <Image 
                    src="/images/flower no stem.svg" 
                    alt="Bloom flower" 
                    width={24} 
                    height={24} 
                    className="transition-transform duration-300"
                  />
                </motion.div>
                <p className="text-lg text-bloom group-hover:text-bloompink transition-colors duration-300">Are you wondering if you may be a good mom?</p>
              </motion.div>
            </div>
            
            <p ref={paragraph2Ref} className="font-medium text-center text-lg md:text-xl pt-4 text-gray-700 leading-relaxed">
              Are you ready to stop feeling overwhelmed and start feeling more in control of your life?
            </p>
            
            <p ref={paragraph3Ref} className="text-xl md:text-2xl font-semibold text-center pt-6 text-bloom">
              Your life could look <span className="underline text-bloompink">very different</span> six months from now!
            </p>
            
            <div className="pt-8 flex justify-center relative z-10">
              <Button 
                href="/book" 
                variant="pink" 
                size="lg" 
                className="shadow-lg hover:shadow-xl"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section - Garden Theme */}
      <section id="services" className="py-20 bg-gradient-to-b from-bloom-sage-50/20 to-white relative overflow-hidden z-10">
        {/* Garden background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative garden path */}
          <svg className="absolute bottom-0 left-0 w-full h-full opacity-5" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path
              d="M0,800 Q300,700 600,750 T1200,700 L1200,800 L0,800"
              fill="#7A8B7F"
            />
          </svg>
          
          {/* Floating seeds/petals animation */}
          <motion.div
            animate={{ y: [0, -100], x: [0, 50], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-3 h-3 bg-pink-300 rounded-full opacity-30"
          />
          <motion.div
            animate={{ y: [0, -150], x: [0, -30], rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute top-40 right-40 w-2 h-2 bg-bloom-sage/30 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -120], x: [0, 40], rotate: 180 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 10 }}
            className="absolute top-60 left-1/2 w-4 h-4 bg-yellow-300 rounded-full opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          {/* Section header with garden metaphor */}
          <div className="text-center mb-16">
            <motion.div 
              ref={serviceTitleRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-bloom/90 text-3xl md:text-4xl mb-4 font-normal">
                Our <span className="text-bloompink/90 font-medium">Services</span>
              </h2>
              
              {/* Decorative flower divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloompink/30 rounded-full"></div>
                <Image 
                  src="/images/flower no stem.svg" 
                  alt="" 
                  width={24} 
                  height={24} 
                  className="opacity-50"
                />
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloompink/30 rounded-full"></div>
              </div>
            </motion.div>
            
            <motion.p 
              ref={serviceDescRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-bloom/70 max-w-3xl mx-auto text-lg font-light"
            >
              Specialized therapy services designed to support you through life's transitions, 
              with expertise in women's mental health and maternal wellness.
            </motion.p>
          </div>
          
          {/* Garden layout grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              // Create a ref for each card to track if it's in view
              const cardRef = useRef(null);
              const isInView = useInView(cardRef, { once: true, margin: "-100px" });
              
              return (
                <div 
                  key={service.id} 
                  ref={cardRef}
                  className={service.featured ? 'md:col-span-2 lg:col-span-1' : ''}
                >
                  <GardenServiceCard 
                    service={service} 
                    index={index} 
                    isInView={isInView}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Garden wisdom quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-bloom/60 text-lg italic font-light">
              "Healing happens when expertise meets empathy. Your journey is uniquely yours."
            </p>
            <p className="text-bloompink/70 text-sm mt-2">— Dr. Jana Rundle</p>
          </motion.div>
        </div>
      </section>
      
      {/* Digital Garden - Seeds for Home Section */}
      <section className="py-20 bg-gradient-to-b from-white via-bloom-sage-50/10 to-bloom-sage-50/20 relative overflow-hidden z-10">
        {/* Floating seed animation background */}
        <FloatingSeeds />
        
        {/* Greenhouse glass effect overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft glass texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
          
          {/* Condensation effect */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <defs>
              <pattern id="condensation" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" className="text-blue-300" />
                <circle cx="30" cy="25" r="0.5" fill="currentColor" className="text-blue-300" />
                <circle cx="45" cy="40" r="1.5" fill="currentColor" className="text-blue-300" />
                <circle cx="15" cy="50" r="0.8" fill="currentColor" className="text-blue-300" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#condensation)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-bloom/90 text-3xl md:text-4xl mb-2 font-normal">
              Digital Courses for <span className="text-bloompink/90 font-medium">Postpartum Wellness</span>
            </h2>
            <p className="text-bloom/80 text-lg mb-6">Self-paced online programs designed by mental health professionals</p>
            
            {/* Seed packet divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Image 
                  src="/images/flower no stem.svg" 
                  alt="" 
                  width={24} 
                  height={24} 
                  className="opacity-50"
                />
              </motion.div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-bloom/70 max-w-3xl mx-auto text-lg font-light">
              Can't make it to in-person therapy? Access evidence-based mental health 
              resources from home — learn and heal at your own pace, in your own space.
            </p>
          </motion.div>
          
          {/* Digital courses indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
              <span className="text-lg sm:text-2xl">💻</span>
              <span className="text-xs sm:text-sm font-medium text-bloom/80">100% Online</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
              <span className="text-lg sm:text-2xl">📱</span>
              <span className="text-xs sm:text-sm font-medium text-bloom/80">Mobile Friendly</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm">
              <span className="text-lg sm:text-2xl">⏰</span>
              <span className="text-xs sm:text-sm font-medium text-bloom/80">Start Anytime</span>
            </div>
          </motion.div>
          
          {/* Seed Packet Grid - Option 1: All cards uniform width */}
          <div className="w-full px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-12 max-w-5xl mx-auto">
              <SeedPacketCard 
                title="Postpartum Wellness"
                seedType="Sunflower"
                icon="🌻"
                growthTime="6 weeks"
                description="Build emotional regulation skills and develop lasting confidence in your new role"
                benefits={[
                  "Daily coping strategies",
                  "Strong self-care foundation",
                  "Sustainable inner peace"
                ]}
                color="yellow"
                href="/courses/postpartum-wellness-foundations"
                featured={false}
                index={0}
              />
              
              <SeedPacketCard 
                title="Anxiety Management"
                seedType="Lavender"
                icon="💜"
                growthTime="4 weeks"
                description="Learn evidence-based techniques to manage anxiety and calm your mind"
                benefits={[
                  "Immediate symptom relief",
                  "Proven coping strategies",
                  "Long-term emotional stability"
                ]}
                color="purple"
                href="/courses"
                index={1}
              />
              
              <SeedPacketCard 
                title="Partner Support"
                seedType="Twin Roses"
                icon="🌹"
                growthTime="3 weeks"
                description="Strengthen your relationship with communication tools and mutual support strategies"
                benefits={[
                  "Enhanced communication",
                  "Deeper understanding",
                  "Unified partnership"
                ]}
                color="pink"
                href="/courses"
                index={2}
              />
            </div>
          </div>
          
          {/* Garden wisdom footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-bloom/60 text-base italic font-light mb-2">
              "Small steps lead to lasting change. Start your wellness journey today."
            </p>
            <p className="text-bloompink/70 text-sm">— Dr. Jana Rundle</p>
            
            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link href="/courses">
                <button className="inline-flex items-center gap-2 text-bloom/80 hover:text-bloompink transition-colors group">
                  <span className="text-sm font-medium">View All Courses</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg"
                  >
                    →
                  </motion.span>
                </button>
              </Link>
            </motion.div>
          </motion.div>
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
                {/* Image container with enhanced styling */}
                <div className="relative group">
                  {/* Subtle border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-bloompink to-pink-300 rounded-2xl opacity-50 group-hover:opacity-70 transition duration-300"></div>
                  
                  <div className="relative">
                    <Image
                      src="/images/optimized/Team/Jana Rundle.webp"
                      alt="Dr. Jana Rundle"
                      width={500}
                      height={600}
                      className="rounded-2xl shadow-xl object-cover relative z-10 transition-all duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    
                    {/* Flower accent with gentle float */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-4 -right-4 z-20"
                    >
                      <Image
                        src="/images/flower no stem.svg"
                        alt="Flower accent"
                        width={60}
                        height={60}
                        className="opacity-70"
                      />
                    </motion.div>
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
                <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl mb-6 text-bloom/90 font-normal">
                  Why Choose <span className="text-bloompink/90 font-medium">Bloom Psychology</span>
                </h2>
                
                {/* Simple divider */}
                <div className="w-16 h-0.5 bg-bloompink/40 rounded-full mb-8"></div>
                
                {/* First paragraph with subtle drop cap */}
                <p className="text-base text-gray-600 mb-6 leading-loose first-letter:text-5xl first-letter:font-playfair first-letter:text-bloompink/70 first-letter:float-left first-letter:mr-3 first-letter:leading-none font-light">
                  When life feels overwhelming and you're struggling to keep up, we understand. At Bloom Psychology, we specialize in helping women and mothers transform from feeling burned out and exhausted to finding renewed energy and purpose.
                </p>
                
                {/* Second paragraph */}
                <p className="text-base text-gray-600 mb-8 leading-loose font-light">
                  Our evidence-based approach combines compassionate support with proven therapeutic techniques. We create a safe, judgment-free space where you can explore your challenges and develop practical strategies for lasting change.
                </p>
                
                {/* Pink accent text */}
                <p className="text-bloompink/80 text-lg md:text-xl font-light mb-8 italic">
                  "We help you find meaning and purpose in the chaos of modern motherhood."
                </p>
                
                {/* Simple button */}
                <Link href="/about">
                  <button className="bg-bloompink/90 hover:bg-bloompink text-white font-normal px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-500 flex items-center group text-sm tracking-wide">
                    Learn More
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-500 opacity-70">
                      →
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Texas Virtual Garden Section */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/30 via-white to-bloom-blush/10 relative overflow-hidden">
        {/* Garden texture background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="texas-garden" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#7A8B7F" />
              <circle cx="7" cy="7" r="0.5" fill="#8B7355" />
            </pattern>
            <rect width="100" height="100" fill="url(#texas-garden)" />
          </svg>
        </div>
        
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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-bloom-dark/90 mb-6 font-normal">
                  Now Serving <span className="text-bloompink/90 font-medium">All of Texas</span>
                </h2>
                
                {/* Seed divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-bloom-sage/30 to-transparent"></div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🌱
                  </motion.span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-bloom-sage/30 to-transparent"></div>
                </div>
                
                <p className="text-lg text-bloom-dark/70 mb-4 font-light">
                  Licensed to provide virtual therapy throughout Texas, we bring 
                  specialized mental health care directly to you. Whether you're in a major 
                  city or rural community, quality therapy is just a video call away.
                </p>
                
                {/* Virtual Therapy Highlight */}
                <motion.div 
                  className="bg-gradient-to-r from-bloompink/10 to-bloom-sage/10 p-4 rounded-xl mb-6 border border-bloompink/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-base font-medium text-bloom/90 flex items-center gap-2">
                    <span className="text-2xl">🖥️</span>
                    All sessions conducted online via secure video chat - no travel required!
                  </p>
                </motion.div>
                
                {/* Service Coverage Cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <GardenZoneCard 
                    icon="🏙️"
                    title="Cities We Serve"
                    subtitle="Houston • Dallas • San Antonio • Austin"
                    description="Major Texas metropolitan areas"
                  />
                  <GardenZoneCard 
                    icon="💻"
                    title="100% Virtual Therapy"
                    subtitle="Online video sessions from home"
                    description="Secure, HIPAA-compliant platform"
                  />
                </div>
                
                {/* How It Works */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft mb-6 border border-bloom-sage/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-bloom-dark/90 mb-4 flex items-center gap-2">
                    <span className="text-xl">💻</span>
                    How Virtual Therapy Works
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-bloom-sage/10 rounded-full flex items-center justify-center text-sm font-medium text-bloom-sage">1</span>
                      <span className="text-sm text-bloom-dark/70">Schedule your free consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-bloom-sage/10 rounded-full flex items-center justify-center text-sm font-medium text-bloom-sage">2</span>
                      <span className="text-sm text-bloom-dark/70">Complete personalized assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-bloom-sage/10 rounded-full flex items-center justify-center text-sm font-medium text-bloom-sage">3</span>
                      <span className="text-sm text-bloom-dark/70">Begin weekly therapy sessions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-bloom-sage/10 rounded-full flex items-center justify-center text-sm font-medium text-bloom-sage">4</span>
                      <span className="text-sm text-bloom-dark/70">Experience lasting transformation</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* CTA Buttons styled as seed packets */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="/virtual-therapy">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-bloompink/90 hover:bg-bloompink text-white px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      <span>💻</span>
                      Learn About Virtual Therapy
                    </motion.button>
                  </Link>
                  <Link href="/texas-service-areas">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-sage hover:bg-bloom-sage-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span>📍</span>
                      View Service Areas
                    </motion.button>
                  </Link>
                </div>
                
                {/* Self-Assessment Card */}
                <motion.div 
                  className="bg-gradient-to-br from-white to-bloom-blush/10 p-5 rounded-xl shadow-soft border border-bloom-sage/20"
                  whileHover={{ y: -2 }}
                >
                  <p className="text-sm text-bloom-dark/70 mb-3 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    <span><span className="font-semibold text-bloom-sage">New:</span> Not sure if virtual therapy is right for you?</span>
                  </p>
                  <Link
                    href="/virtual-therapy/is-virtual-right-for-you"
                    className="text-sm bg-gradient-to-r from-bloom-sage to-bloom-sage/80 text-white px-4 py-2 rounded-full font-medium hover:shadow-md transition-all inline-flex items-center gap-2"
                  >
                    Take Self-Assessment (2 min)
                    <span>→</span>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Visual Column - Texas Garden Map */}
              <motion.div 
                className="relative lg:pl-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <TexasGardenMap />
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-bloom-sage/20 rounded-full blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-bloom relative overflow-hidden z-10">
        
        <div className="container mx-auto px-6 text-center">
          <div ref={ctaTitleRef}>
            <h2 className="font-playfair text-white/95 text-2xl md:text-3xl mb-6 font-normal">
              Begin Your Healing Journey Today
            </h2>
          </div>
          
          <p className="text-white/80 max-w-2xl mx-auto mb-10 font-light text-base" ref={ctaTextRef}>
            Take the first step toward healing and growth with a free 15-minute consultation.
          </p>
          
          <Button 
            href="/book" 
            variant="pink" 
            size="lg" 
            className="inline-block"
            pulseOnView
          >
            Book Now
          </Button>
        </div>
      </section>
    </>
  );
}
