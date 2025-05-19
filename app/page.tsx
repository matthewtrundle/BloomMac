'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';

// Scroll effect utilities
import setupScrollGreyscale from '@/lib/hooks/useScrollGreyscale';
import setupScrollReveal from '@/lib/hooks/useScrollReveal';
import useParallaxHero from '@/lib/hooks/useParallaxHero';

// UI Components
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import SimpleParallaxContainer from '@/components/ui/SimpleParallaxContainer';
import ScrollingTicker from '@/components/ui/ScrollingTicker';
import CardAccent from '@/components/ui/CardAccent';

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
  
  // Use the specified hero image
  const heroImage = '/images/Hero/herooptimzed.png';
  
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
        description="Specialized therapy for women, moms, and parents in North Austin."
        address={{
          streetAddress: "13706 N Highway 183, Suite 114",
          addressLocality: "Austin",
          addressRegion: "TX",
          postalCode: "78750",
          addressCountry: "US"
        }}
        telephone="+15128989510"
        email="jana@bloompsychologynorthaustin.com"
        sameAs={["https://www.instagram.com/bloompsychology.atx/", "https://www.linkedin.com/company/bloom-psychology-atx/"]}
      />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] hero-section">
        {/* Fixed hero background image */}
        <div className="fixed inset-x-0 top-0 h-[75vh] w-full" style={{ zIndex: -1 }}>
          <div className="relative w-full h-full">
            <Image
              src={heroImage}
              alt="Bloom Psychology hero"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 20%' }}
              quality={85}
              sizes="100vw"
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
        
        <div className="container mx-auto px-4 relative z-10 h-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl ml-4 md:ml-8 lg:ml-16 mr-auto pt-24 lg:pt-32"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <h1 className="font-raleway text-center text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] mb-6 tracking-tight leading-tight text-shadow">
                <span className="font-light text-bloompink">Bloom</span>
                <span className="font-extralight text-bloom-darkGrey">Psychology</span>
              </h1>
              
              <p className="font-raleway font-normal text-lg sm:text-xl md:text-[1.25rem] mb-6 text-bloom-darkGrey text-center max-w-[600px] mx-auto text-shadow-sm">
                Specialized mental health care for women and moms in North Austin.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                href="/contact" 
                variant="pink" 
                size="md" 
                className="z-10"
              >
                Book Now →
              </Button>
              
              <motion.a 
                href="#services" 
                whileHover={{ scale: 1.03, y: -2 }} 
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-bloompink hover:bg-[#B03979] text-white font-bold font-inter px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center"
              >
                Explore Our Services
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
              <h2 className="font-playfair text-bloom text-3xl md:text-5xl mb-6 animate-fade-in">
                Welcome to <span className="font-semibold bg-gradient-to-r from-bloompink to-pink-400 bg-clip-text text-transparent animate-gradient-text hover:from-pink-400 hover:to-bloompink transition-all duration-300">Bloom Psychology</span>
              </h2>
              
              <div className="w-40 h-1 bg-gradient-to-r from-[#C63780] to-[#FF9CB9] mx-auto mb-12 rounded-full animate-width hover:w-48 transition-all duration-300"></div>
            </motion.div>
          </div>
          
          <div className="space-y-6 text-bloom max-w-3xl mx-auto">
            <p ref={paragraph1Ref} className="text-lg md:text-xl font-medium text-center leading-relaxed text-gray-700">
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
                <p className="text-lg text-bloom group-hover:text-bloompink transition-colors duration-300">Are you struggling with keeping up with it all?</p>
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
                <p className="text-lg text-bloom group-hover:text-bloompink transition-colors duration-300">Are you starting to feel like you may be failing at everything?</p>
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
                <p className="text-lg text-bloom group-hover:text-bloompink transition-colors duration-300">Are you feeling burned out?</p>
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
                href="/contact" 
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
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 relative overflow-hidden z-10">
        <OrganicShape
          variant="blob-2"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.08}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-accent)"
          size="md"
          position="bottom-left"
          opacity={0.05}
          rotate={120}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div ref={serviceTitleRef}>
              <h2 className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
                Our Services
              </h2>
              
              <div className="w-32 h-1 bg-[#C63780] mx-auto mb-8 rounded-full"></div>
            </div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto" ref={serviceDescRef}>
              We offer a range of specialized mental health services designed to support women, mothers, and parents at every stage of life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} 
                ref={el => {
                  servicePanelRefs.current[index] = el;
                }}>
                <GlassmorphismPanel
                  variant={index % 2 === 0 ? "medium" : "pink"}
                  shape="rounded-lg"
                  className="h-full p-6 flex flex-col relative"
                  hoverEffect="lift"
                >
                  {/* Free accent removed as requested */}
                  <h3 className="font-playfair text-xl text-bloom mb-4 min-h-[4rem] flex flex-col justify-center">
                    {service.title.split('\n').map((line, i) => (
                      <div key={i}>
                        {line}
                      </div>
                    ))}
                  </h3>
                  <p className="text-bloom/70 mb-6 flex-grow">{service.shortDescription}</p>
                  <Button 
                    href={`/services/${service.slug}`} 
                    variant={index % 2 === 0 ? "outline" : "pink-outline"} 
                    className="mt-auto"
                  >
                    Learn More
                  </Button>
                </GlassmorphismPanel>
              </div>
            ))}
          </div>
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
                      src="/images/Team/Jana Rundle.jpg"
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
                <h2 className="font-playfair text-4xl md:text-5xl mb-6 text-bloom">
                  Why Choose <span className="text-bloompink font-semibold">Bloom Psychology</span>
                </h2>
                
                {/* Simple divider */}
                <div className="w-20 h-1 bg-bloompink rounded-full mb-8"></div>
                
                {/* First paragraph with drop cap */}
                <p className="text-lg text-gray-700 mb-6 leading-relaxed first-letter:text-6xl first-letter:font-playfair first-letter:text-bloompink first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                  When life feels overwhelming and you're struggling to keep up, we understand. At Bloom Psychology, we specialize in helping women and mothers transform from feeling burned out and exhausted to finding renewed energy and purpose.
                </p>
                
                {/* Second paragraph */}
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Our evidence-based approach combines compassionate support with proven therapeutic techniques. We create a safe, judgment-free space where you can explore your challenges and develop practical strategies for lasting change.
                </p>
                
                {/* Pink accent text */}
                <p className="text-bloompink text-xl md:text-2xl font-semibold mb-8 italic">
                  "We help you find meaning and purpose in the chaos of modern motherhood."
                </p>
                
                {/* Simple button */}
                <Link href="/about">
                  <button className="bg-bloompink hover:bg-[#B03979] text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center group">
                    Learn More
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-bloom relative overflow-hidden z-10">
        
        <div className="container mx-auto px-6 text-center">
          <div ref={ctaTitleRef}>
            <h2 className="font-playfair text-white text-3xl md:text-4xl mb-6">
              Begin Your Healing Journey Today
            </h2>
          </div>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10" ref={ctaTextRef}>
            Take the first step toward healing and growth with a free 15-minute consultation.
          </p>
          
          <Button 
            href="/contact" 
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
