'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';

// Scroll effect utilities
import setupScrollGreyscale from '@/lib/hooks/useScrollGreyscale';
import setupScrollReveal from '@/lib/hooks/useScrollReveal';

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
  const heroImage = '/images/Hero/hero15.png';
  
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
        name="Bloom Psychology North Austin"
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
      <section className="relative h-[80vh] bg-white overflow-hidden">
        {/* Hero background image with parallax */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <Image
              src={heroImage}
              alt="Bloom Psychology hero"
              fill
              className="object-cover object-top relative z-10"
              priority
              quality={85}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-100 via-transparent to-white opacity-40 pointer-events-none"></div>
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
        
        <div className="container mx-auto px-4 relative z-10 h-screen">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl ml-4 md:ml-8 lg:ml-16 mr-auto pt-32 lg:pt-40"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8">
              <h1 className="font-raleway text-center text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] mb-6 tracking-tight leading-tight text-shadow">
                <span className="font-light text-bloompink">Bloom</span>
                <span className="font-extralight text-bloom-darkGrey">Psychology</span>
              </h1>
              
              <p className="font-raleway font-normal text-lg sm:text-xl md:text-[1.25rem] mb-8 text-bloom-darkGrey text-center max-w-[600px] mx-auto text-shadow-sm">
                Specialized mental health care for women and moms in North Austin.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <motion.a 
                href="#consult" 
                whileHover={{ scale: 1.03, y: -2 }} 
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-bloompink hover:bg-[#B03979] text-white font-bold font-inter px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center"
              >
                Book a FREE Consult Call →
              </motion.a>
              
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
      
      {/* Introduction Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="var(--bloom-accent)"
          size="full"
          position="bottom-left"
          opacity={0.03}
        />
        
        <OrganicShape
          variant="blob-2"
          color="var(--bloom-blush)"
          size="sm"
          position="top-right"
          opacity={0.04}
          rotate={30}
        />
        
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-8">
            <div ref={welcomeTitleRef}>
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-5xl mb-6">
                Welcome to Bloom Psychology North Austin
              </KineticTypography>
              
              <div className="w-32 h-1 bg-[#C63780] mx-auto mb-12"></div>
            </div>
          </div>
          
          <div className="space-y-8 text-bloom/80 text-center md:text-lg max-w-3xl mx-auto">
            <p ref={paragraph1Ref} className="font-medium">
              At Bloom Psychology, we believe in providing compassionate, evidence-based therapy tailored to the unique needs of women, mothers, parents, and families.
            </p>
            
            <p ref={paragraph2Ref}>
              Led by Dr. Jana Rundle, our practice specializes in addressing anxiety, stress, parenting challenges, and postpartum mental health in a warm, non-judgmental environment.
            </p>
            
            <p ref={paragraph3Ref}>
              Whether you're seeking individual therapy, parent support, or help with specific challenges, we're here to support your journey toward healing and growth.
            </p>
            
            <div className="pt-8 flex justify-center">
              <Button href="/about" variant="outline" size="md">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
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
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
                Our Services
              </KineticTypography>
              
              <div className="w-32 h-1 bg-[#C63780] mx-auto mb-8 rounded-full"></div>
            </div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto" ref={serviceDescRef}>
              We offer a range of specialized mental health services designed to support women, mothers, and families at every stage of life.
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
                  <h3 className="font-playfair text-xl text-bloom mb-4">{service.title}</h3>
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
      
      {/* Sections removed as requested */}
      
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
          <div ref={ctaTitleRef}>
            <KineticTypography as="h2" animation="fade-in" className="font-playfair text-white text-3xl md:text-4xl mb-6">
              Begin Your Healing Journey Today
            </KineticTypography>
          </div>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10" ref={ctaTextRef}>
            Take the first step toward healing and growth with a free 15-minute consultation.
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
