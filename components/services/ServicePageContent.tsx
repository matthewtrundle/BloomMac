'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

interface ServicePageContentProps {
  service: any; // Replace with proper type
  primaryQuestions: any[];
  additionalQuestions: any[];
}

export default function ServicePageContent({ service, primaryQuestions, additionalQuestions }: ServicePageContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <OrganicShape 
          variant="blob-1" 
          color="var(--bloom-pink)" 
          size="xl" 
          position="top-right" 
          opacity={0.1}
          parallaxFactor={0.2}
        />
        <OrganicShape 
          variant="wave" 
          color="var(--bloom-sage)" 
          size="lg" 
          position="bottom-left" 
          opacity={0.08}
          rotate={15}
        />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassmorphismPanel variant="prominent" className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-bloom-dark mb-6">
                {service.title}
              </h1>
              
              <p className="text-xl text-bloom/80 mb-8 max-w-3xl">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/book" variant="primary" size="lg">
                  Schedule Free Consultation
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Ask a Question
                </Button>
              </div>
            </GlassmorphismPanel>
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-bloom-pink-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair text-bloom-dark mb-8 text-center">
              Who This Service Helps
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {service.targetAudience.map((audience: string, index: number) => (
                <GlassmorphismPanel key={index} variant="subtle" className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-bloompink/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <p className="text-bloom/80">{audience}</p>
                  </div>
                </GlassmorphismPanel>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="py-16 px-4 bg-gradient-to-b from-bloom-pink-50 to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-8 text-center">
            Common Experiences We Address
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.symptoms.map((symptom: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassmorphismPanel variant="medium" className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-bloom-sage/20 rounded-full flex items-center justify-center">
                      <span className="text-bloom-sage font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-bloom-dark">{symptom}</h3>
                  </div>
                </GlassmorphismPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Approach */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-bloom-sage-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-8 text-center">
            Our Therapeutic Approach
          </h2>
          
          <div className="space-y-6">
            {service.treatmentApproach.map((approach: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassmorphismPanel variant="subtle" className="p-6">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-3">
                    {approach.title}
                  </h3>
                  <p className="text-bloom/80">
                    {approach.description}
                  </p>
                </GlassmorphismPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-bloom-sage-50 to-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-8 text-center">
            Common Questions
          </h2>
          
          {/* Primary Questions */}
          <div className="space-y-4 mb-8">
            {primaryQuestions.map((item, index) => (
              <motion.details 
                key={index}
                className="group bg-white rounded-lg shadow-soft overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <summary className="p-6 cursor-pointer list-none flex items-center justify-between hover:bg-bloom-pink-50 transition-colors">
                  <h3 className="font-semibold text-bloom-dark pr-4">{item.question}</h3>
                  <span className="text-bloompink transform transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-bloom/80">{item.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>

          {/* Additional Questions - Collapsible */}
          {additionalQuestions.length > 0 && (
            <GlassmorphismPanel variant="subtle" className="p-6">
              <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <h3 className="font-semibold text-bloom-dark">More Questions</h3>
                  <span className="text-bloom transform transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 space-y-4">
                  {additionalQuestions.map((item, index) => (
                    <div key={index} className="border-t border-bloom/10 pt-4">
                      <h4 className="font-medium text-bloom-dark mb-2">{item.question}</h4>
                      <p className="text-bloom/80 text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </details>
            </GlassmorphismPanel>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-bloom to-bloom/90 relative overflow-hidden">
        <OrganicShape 
          variant="circle" 
          color="white" 
          size="lg" 
          position="center-right" 
          opacity={0.1}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair text-white mb-6">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Take the first step towards feeling like yourself again. 
              We&apos;re here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/book" variant="pink" size="lg">
                Schedule Free Consultation
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </>
  );
}