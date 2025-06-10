'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// UI Components
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import Button from '@/components/ui/Button';
import ParallaxContainer from '@/components/ui/ParallaxContainer';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - Master Gardener's Story */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-bloom-sage-50/20 via-white to-bloom-pink-50/10 relative overflow-hidden">
        {/* Garden greenhouse overlay */}
        <div className="absolute inset-0 z-0 h-[50vh] overflow-hidden">
          <Image
            src="/images/optimized/Hero/ABoutHero.webp"
            alt="Bloom Psychology hero"
            fill
            className="object-cover"
            objectPosition="center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/80"></div>
          
          {/* Garden lattice effect */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="garden-lattice" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0,20 L40,20 M20,0 L20,40" stroke="currentColor" strokeWidth="1" className="text-bloom-sage"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#garden-lattice)" />
          </svg>
        </div>
        
        {/* Floating garden elements */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 text-4xl opacity-20 z-0"
        >
          🌿
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
          className="absolute bottom-20 left-40 text-3xl opacity-20 z-0"
        >
          🌱
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <KineticTypography as="h1" animation="fade-in" className="font-playfair text-bloom-dark text-4xl md:text-5xl lg:text-6xl mb-6 text-shadow-lg">
              About Bloom Psychology
            </KineticTypography>
            
            {/* Garden divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🌻
              </motion.span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-bloom-dark/90 max-w-2xl mx-auto font-medium text-shadow">
              Dedicated to providing compassionate, evidence-based mental health care for women, mothers, and parents throughout Texas.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* About text is in the hero section above */}
      
      {/* Meet Dr. Rundle Section - The Master Gardener */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle vine pattern */}
        <svg className="absolute left-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
          <path d="M50,0 Q30,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
        </svg>
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
                  Meet Dr. Jana Rundle
                </KineticTypography>
                
                {/* Seed divider */}
                <div className="flex items-center gap-3 mb-8">
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
              
              <GlassmorphismPanel variant="medium" className="p-8 space-y-6">
                <p className="text-bloom/80">
                  Hi! I'm glad you're here! I am a licensed clinical psychologist with over 10 years of experience specializing in women's mental health, maternal wellness, and parent support.
                </p>

                <p className="text-bloom/80">
                  Being a woman in today's world is difficult. The demands and expectations that society places on us to be all things to all people can become a huge burden. Perhaps you are someone who is feeling overwhelmed with trying to "do it all." If so, you're in the right place.
                </p>

                <p className="text-bloom/80">
                  After having my own children and seeing just how little support moms receive, I developed a passion for supporting women through life transitions, particularly those related to motherhood and family dynamics. I am certified in perinatal mental health, and I bring both professional expertise and personal understanding to my work with clients navigating the complex terrain of modern womanhood and parenthood.
                </p>

                <p className="text-bloom/80">
                  Typically my work with clients focuses on reducing stress, improving social connection, while also improving family dynamics so they feel like the best version of themselves. I have specialized training in Interpersonal Psychotherapy (IPT), an evidenced-based therapy for women with perinatal mood disorders. I also integrate practices of Cognitive Behavioral Therapy (CBT) and psychodynamically focussed interventions to help clients go from "survive" to "thrive."
                </p>

                <p className="text-bloom/80">
                  In my spare time, I enjoy traveling, hiking, a good cup of coffee, and volunteering for local non-profits. Reach out to see how I might be able to help you!
                </p>
              </GlassmorphismPanel>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">PsyD, Clinical Psychology</span>
                </div>
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">Licensed Psychologist</span>
                </div>
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">Perinatal Mental Health Certified</span>
                </div>
              </div>
              </motion.div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <ParallaxContainer 
                className="relative"
                layers={[
                  {
                    element: <OrganicShape variant="blob-2" color="var(--bloom-blush)" size="lg" position="bottom-right" opacity={0.1} />,
                    speed: 0.2,
                    zIndex: -1
                  }
                ]}
              >
                <div className="h-full w-full">
                  <motion.div 
                    className="relative w-full aspect-[3/4] overflow-hidden shadow-md rounded-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image 
                      src="/images/optimized/Team/Jana Rundle.webp" 
                      alt="Dr. Jana Rundle" 
                      fill
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    
                    {/* Floating flower accent */}
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
                  </motion.div>
                </div>
                
                {/* Garden decorative elements */}
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-24 h-24 bg-bloom-sage/20 rounded-full -z-10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -top-5 -right-5 w-16 h-16 bg-bloom-pink-50 rounded-full -z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </ParallaxContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Approach Section - The Gardening Philosophy */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/10 to-white relative overflow-hidden">
        {/* Garden bed texture */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="garden-soil" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#7A8B7F" />
              <circle cx="3" cy="3" r="0.3" fill="#8B7355" />
            </pattern>
            <rect width="100" height="100" fill="url(#garden-soil)" />
          </svg>
        </div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-20 left-20 text-3xl opacity-20"
        >
          🌿
        </motion.div>
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
              Our Approach
            </KineticTypography>
            
            {/* Flower divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🌻
              </motion.span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              At Bloom Psychology, we believe in providing holistic, compassionate care tailored to each individual's unique needs and circumstances.
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassmorphismPanel variant="medium" className="p-8 bg-gradient-to-br from-white/90 to-bloom-sage-50/20 border border-bloom-sage/10">
              <div className="flex items-start gap-4">
                <motion.span 
                  className="text-3xl flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🌱
                </motion.span>
                <p className="text-bloom/80">
                  At Bloom Psychology, lasting growth happens when clinical expertise meets genuine understanding. I blend evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT), Interpersonal Psychotherapy (IPT), and psychodynamic interventions with warmth, humor, and the wisdom that comes from my own experiences as a mother. Together, we'll create the perfect conditions for your unique healing journey.
                </p>
              </div>
              
              {/* Therapeutic wisdom quote */}
              <motion.p 
                className="text-center mt-8 text-bloom/60 italic text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                "Healing happens in its own time and way — your journey is uniquely yours."
              </motion.p>
            </GlassmorphismPanel>
          </motion.div>
        </div>
      </section>
      
      {/* Our Values Section - Core Therapeutic Values */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative vines on sides */}
        <svg className="absolute right-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
          <path d="M50,0 Q70,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
        </svg>
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
                <KineticTypography as="span" animation="word-by-word">
                  Our Core
                </KineticTypography>
                <span className="text-bloompink mx-2">Values</span>
              </h2>
              
              {/* Values divider */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="text-xl opacity-60">💗</span>
                <span className="text-xl opacity-60">🤝</span>
                <span className="text-xl opacity-60">🌟</span>
                <span className="text-xl opacity-60">💪</span>
              </div>
            </motion.div>
            
            <div className="space-y-12">
              <GlassmorphismPanel variant="medium" className="p-8 space-y-12">
                <motion.div 
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center shadow-sm"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className="text-2xl">💗</span>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">
                      <span className="text-bloompink">Connection</span>
                    </h3>
                    <p className="text-bloom/80">
                      We build authentic therapeutic relationships founded on trust, where your voice is heard and valued without judgment.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center shadow-sm"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className="text-2xl">🤝</span>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">
                      <span className="text-bloompink">Compassion</span>
                    </h3>
                    <p className="text-bloom/80">
                      We provide a warm, non-judgmental space where healing can happen, meeting you with empathy and understanding wherever you are in your journey.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-sm"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className="text-2xl">🌟</span>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">
                      <span className="text-bloompink">Authenticity</span>
                    </h3>
                    <p className="text-bloom/80">
                      We honor your unique story and experiences, helping you discover and embrace your authentic self while letting go of what no longer serves you.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className="text-2xl">💪</span>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">
                      <span className="text-bloompink">Empowerment</span>
                    </h3>
                    <p className="text-bloom/80">
                      We help you build lasting skills and resilience that continue serving you long after our work together, empowering you to thrive independently.
                    </p>
                  </div>
                </motion.div>
              </GlassmorphismPanel>
            </div>
          </div>
        </div>
      </section>
      
      {/* Office Environment Section removed as requested */}
      
      {/* CTA Section - Plant Your First Seed */}
      <section className="py-16 bg-gradient-to-br from-bloom to-bloom/90 relative overflow-hidden">
        {/* Animated garden elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 right-10 text-6xl opacity-10"
        >
          🌻
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
          className="absolute bottom-20 left-20 text-5xl opacity-10"
        >
          🌿
        </motion.div>
        
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <KineticTypography as="h2" animation="fade-in" className="font-playfair text-white text-3xl md:text-4xl mb-6">
              Ready to Begin Your Journey?
            </KineticTypography>
            
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Take the first step toward healing and growth with a free 15-minute consultation.
            </p>
          
            <Button 
              href="/book" 
              variant="pink" 
              size="lg" 
              className="inline-block group"
              pulseOnView
            >
              Book Now
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
            
            <motion.p 
              className="mt-8 text-white/70 text-sm italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              "Take the first step toward healing and growth with a free 15-minute consultation."
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
