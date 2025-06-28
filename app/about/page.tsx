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
      {/* Hero Section - Professional */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <KineticTypography as="h1" animation="fade-in" className="font-playfair text-[#1e3a5f] text-4xl md:text-5xl lg:text-6xl mb-6 text-shadow-lg">
              Meet Jana Rundle
            </KineticTypography>
            
            {/* Professional divider */}
            <div className="w-24 h-0.5 bg-[#f8b5c4] mx-auto mb-8"></div>
            
            <p className="text-[#1e3a5f]/90 max-w-2xl mx-auto font-medium text-shadow">
              Dedicated to providing compassionate, evidence-based mental health care for women, mothers, and parents throughout Texas.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* About text is in the hero section above */}
      
      {/* Meet Dr. Rundle Section - Professional */}
      <section className="py-16 bg-white relative overflow-hidden">
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-[#1e3a5f] text-3xl md:text-4xl mb-6">
                  Meet Dr. Jana Rundle
                </KineticTypography>
                
                {/* Professional divider */}
                <div className="w-16 h-0.5 bg-[#f8b5c4]/40 mb-8"></div>
              
              <GlassmorphismPanel variant="medium" className="p-8 space-y-6">
                <p className="text-[#1e3a5f]/80">
                  Hi! I'm glad you're here! I am a licensed clinical psychologist with over 10 years of experience specializing in women's mental health, maternal wellness, and parent support.
                </p>

                <p className="text-[#1e3a5f]/80">
                  Being a woman—and a mom—today can feel like an impossible juggling act. If you're exhausted by expectations, weighed down by the mental load, or just wondering "Is it supposed to be this hard?"... you're not alone. And you're in the right place.
                </p>

                <p className="text-[#1e3a5f]/80">
                  After having my own children and seeing just how little support moms receive, I developed a passion for supporting women through life transitions, particularly those related to motherhood and family dynamics. I am certified in perinatal mental health, and I bring both professional expertise and personal understanding to my work with clients navigating the complex terrain of modern womanhood and parenthood.
                </p>

                <p className="text-[#1e3a5f]/80">
                  I help women reduce stress, build meaningful connections, and strengthen their family dynamics—so they can feel more like themselves again. I'm trained in Interpersonal Psychotherapy (IPT), an evidence-based approach for perinatal mood disorders, and I also draw from Cognitive Behavioral Therapy (CBT) and psychodynamic principles to support real, lasting growth.
                </p>

                <p className="text-[#1e3a5f]/80">
                  In my spare time, I enjoy traveling, hiking, a good cup of coffee, and volunteering for local non-profits.
                </p>
              </GlassmorphismPanel>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-[#f8b5c4]/10 px-4 py-2 rounded-md text-[#1e3a5f]">
                  <span className="font-medium">PsyD, Clinical Psychology</span>
                </div>
                <div className="bg-[#f8b5c4]/10 px-4 py-2 rounded-md text-[#1e3a5f]">
                  <span className="font-medium">Licensed Psychologist</span>
                </div>
                <div className="bg-[#f8b5c4]/10 px-4 py-2 rounded-md text-[#1e3a5f]">
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
                    
                  </motion.div>
                </div>
                
              </ParallaxContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-[#1e3a5f] text-3xl md:text-4xl mb-4">
              Our Approach
            </KineticTypography>
            
            {/* Professional divider */}
            <div className="w-32 h-0.5 bg-[#f8b5c4]/40 mx-auto mb-8"></div>
            
            <p className="text-[#1e3a5f]/70 max-w-2xl mx-auto">
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
              <p className="text-bloom/80">
                At Bloom Psychology, lasting growth happens when clinical expertise meets genuine understanding. I blend evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT), Interpersonal Psychotherapy (IPT), and psychodynamic interventions with warmth, humor, and the wisdom that comes from my own experiences as a mother. Together, we'll create the perfect conditions for your unique healing journey.
              </p>
              
              {/* Therapeutic wisdom quote */}
              <motion.p 
                className="text-center mt-8 text-[#1e3a5f]/60 italic text-sm"
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
      
      {/* Our Values Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-[#1e3a5f] text-3xl md:text-4xl mb-8">
                <KineticTypography as="span" animation="word-by-word">
                  Our Core
                </KineticTypography>
                <span className="text-[#f8b5c4] mx-2">Values</span>
              </h2>
              
              {/* Professional divider */}
              <div className="w-32 h-0.5 bg-[#f8b5c4]/40 mx-auto"></div>
            </motion.div>
            
            <div className="space-y-12">
              <GlassmorphismPanel variant="medium" className="p-8 space-y-12">
                <motion.div 
                  className="border-l-4 border-[#f8b5c4] pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-playfair text-xl text-[#1e3a5f] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f8b5c4] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-[#f8b5c4]">Connection</span>
                  </h3>
                  <p className="text-[#1e3a5f]/80">
                    We build authentic therapeutic relationships founded on trust, where your voice is heard and valued without judgment.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="border-l-4 border-[#f8b5c4] pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-playfair text-xl text-[#1e3a5f] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f8b5c4] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-[#f8b5c4]">Compassion</span>
                  </h3>
                  <p className="text-[#1e3a5f]/80">
                    We provide a warm, non-judgmental space where healing can happen, meeting you with empathy and understanding wherever you are in your journey.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="border-l-4 border-[#f8b5c4] pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-playfair text-xl text-[#1e3a5f] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f8b5c4] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-[#f8b5c4]">Authenticity</span>
                  </h3>
                  <p className="text-[#1e3a5f]/80">
                    We honor your unique story and experiences, helping you discover and embrace your authentic self while letting go of what no longer serves you.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="border-l-4 border-[#f8b5c4] pl-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-playfair text-xl text-[#1e3a5f] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f8b5c4] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-[#f8b5c4]">Empowerment</span>
                  </h3>
                  <p className="text-[#1e3a5f]/80">
                    We help you build lasting skills and resilience that continue serving you long after our work together, empowering you to thrive independently.
                  </p>
                </motion.div>
              </GlassmorphismPanel>
            </div>
          </div>
        </div>
      </section>
      
      {/* Office Environment Section removed as requested */}

      {/* Professional Gallery Section */}
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
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
                Professional Roots, Personalized Care
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Single Image Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f8b5c4]/10 to-[#1e3a5f]/5 z-10" />
                  <Image
                    src="/images/optimized/Team/img_1627.webp"
                    alt="Dr. Jana Rundle - Professional Portrait"
                    width={600}
                    height={750}
                    className="object-cover w-full h-full"
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 z-20" />
                </div>
              </motion.div>

              {/* Credentials Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 space-y-6"
              >
                <div className="bg-white p-8 rounded-2xl shadow-soft">
                  <h3 className="font-playfair text-2xl text-[#1e3a5f] mb-6">Education & Training</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-[#f8b5c4] mr-3">✓</span>
                      <span className="text-bloom/80">Doctorate in Clinical Psychology (Psy.D.)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f8b5c4] mr-3">✓</span>
                      <span className="text-bloom/80">Advanced Certification in Perinatal Mental Health (PMH-C)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f8b5c4] mr-3">✓</span>
                      <span className="text-bloom/80">Interpersonal Therapy (IPT) Trained for Perinatal Mood Disorders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f8b5c4] mr-3">✓</span>
                      <span className="text-bloom/80">ERP and I-CBT Trained for Intrusive Thoughts</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-soft">
                  <h3 className="font-playfair text-2xl text-[#1e3a5f] mb-6">Areas of Expertise</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-[#1e3a5f]/80 text-sm">• Postpartum Depression</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Birth Trauma Recovery</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Perinatal Anxiety</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Identity Transitions</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Relationship Changes</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Fertility Challenges</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Pregnancy Loss</div>
                    <div className="text-[#1e3a5f]/80 text-sm">• Partner Support</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#1e3a5f]/90 relative overflow-hidden">
        
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
            
          </motion.div>
        </div>
      </section>
    </>
  );
}
