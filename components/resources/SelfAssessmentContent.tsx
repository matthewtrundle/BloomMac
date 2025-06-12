'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import OrganicShape from '@/components/ui/OrganicShape';
import { Heart, CircleCheck, CircleAlert } from 'lucide-react';

export default function SelfAssessmentContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-bloom-sage-50/20 via-white to-bloom-pink-50/10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="assessment-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#assessment-lattice)" />
          </svg>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-30"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute top-40 left-40 w-2 h-2 bg-bloom-sage/30 rounded-full"
          />
        </div>

        <OrganicShape 
          variant="blob-1" 
          color="var(--bloom-blush)" 
          size="md" 
          position="top-right" 
          opacity={0.08}
        />
        <OrganicShape 
          variant="wave" 
          color="var(--bloom-sage)" 
          size="sm" 
          position="bottom-left" 
          opacity={0.06}
          rotate={15}
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-bloom-dark mb-6">
              Mental Health <span className="text-bloompink">Self-Assessment</span>
            </h1>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <Image 
                src="/images/flower no stem.svg" 
                alt="" 
                width={24} 
                height={24} 
                className="opacity-50"
              />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-xl text-bloom/80 mb-8 max-w-3xl mx-auto">
              A gentle, evidence-based way to check in with yourself and understand when professional support might be helpful.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-bloom/80 shadow-sm">
                💚 Non-diagnostic tool
              </span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-bloom/80 shadow-sm">
                🔒 Private & confidential
              </span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-bloom/80 shadow-sm">
                ⏱️ Takes 5 minutes
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="px-4 py-16 bg-white relative">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="intro-garden" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#7A8B7F" />
              <circle cx="3" cy="3" r="0.3" fill="#8B7355" />
            </pattern>
            <rect width="100" height="100" fill="url(#intro-garden)" />
          </svg>
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassmorphismPanel variant="medium" className="p-8 bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10">
              <div className="prose prose-lg max-w-none">
                <p className="text-bloom/80 leading-relaxed text-lg">
                  Sometimes it&apos;s challenging to distinguish between normal life stress and when it might be time to seek professional support. This gentle self-assessment is designed to help you check in with yourself and recognize patterns that might benefit from mental health care.
                </p>
                
                <motion.div
                  className="bg-gradient-to-r from-bloom-pink-50/50 to-bloom-sage-50/50 rounded-xl p-6 my-8 border border-bloom-sage/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💚</span>
                    <div>
                      <p className="text-bloom/90 mb-0 font-medium">
                        <strong>Important Note:</strong> This is not a diagnostic tool. It&apos;s simply a way to reflect on your experiences and feelings. Trust your instincts—if something feels concerning, it&apos;s always worth exploring with a mental health professional.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </GlassmorphismPanel>
          </motion.div>
        </div>
      </section>

      {/* Assessment Sections */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-bloom-sage-50/10 relative">
        <svg className="absolute left-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
          <path d="M50,0 Q30,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
        </svg>
        
        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          {/* Emotional Wellbeing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassmorphismPanel variant="medium" className="p-8 bg-gradient-to-br from-white to-bloom-pink-50/20 border border-bloom-pink/10">
              <h2 className="text-3xl font-playfair font-semibold text-bloom-dark mb-6 flex items-center">
                <Heart className="w-8 h-8 text-bloompink mr-4" />
                Emotional Wellbeing
              </h2>
              
              <p className="text-bloom/70 mb-8 text-lg">
                Check any that apply to you most days:
              </p>
              
              <div className="space-y-5">
                {[
                  "I feel sad, empty, or hopeless more often than not",
                  "I have lost interest in activities I used to enjoy",
                  "I feel anxious, worried, or on edge frequently",
                  "My emotions feel out of control or overwhelming",
                  "I feel numb or disconnected from my feelings"
                ].map((item, index) => (
                  <motion.label
                    key={index}
                    className="flex items-start cursor-pointer group p-3 rounded-lg hover:bg-bloom-pink-50/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <input
                      type="checkbox"
                      className="mt-1.5 mr-4 w-5 h-5 text-bloompink border-bloom-sage/30 rounded focus:ring-bloompink"
                    />
                    <span className="text-bloom/80 group-hover:text-bloom-dark transition-colors">
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>
            </GlassmorphismPanel>
          </motion.div>

          {/* Physical Symptoms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <GlassmorphismPanel variant="medium" className="p-8 bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10">
              <h2 className="text-3xl font-playfair font-semibold text-bloom-dark mb-6 flex items-center">
                <CircleCheck className="w-8 h-8 text-bloom-sage mr-4" />
                Physical Symptoms
              </h2>
              
              <p className="text-bloom/70 mb-8 text-lg">
                Notice any of these physical experiences:
              </p>
              
              <div className="space-y-5">
                {[
                  "Significant changes in sleep (too much or too little)",
                  "Changes in appetite or weight",
                  "Persistent fatigue or low energy",
                  "Difficulty concentrating or making decisions"
                ].map((item, index) => (
                  <motion.label
                    key={index}
                    className="flex items-start cursor-pointer group p-3 rounded-lg hover:bg-bloom-sage-50/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <input
                      type="checkbox"
                      className="mt-1.5 mr-4 w-5 h-5 text-bloom-sage border-bloom-sage/30 rounded focus:ring-bloom-sage"
                    />
                    <span className="text-bloom/80 group-hover:text-bloom-dark transition-colors">
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>
            </GlassmorphismPanel>
          </motion.div>
        </div>
      </section>

      {/* Understanding Your Responses */}
      <section className="px-4 py-16 bg-gradient-to-br from-bloom-pink-50/30 to-bloom-sage-50/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-3 h-3 bg-pink-300 rounded-full opacity-30"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 right-40 w-2 h-2 bg-bloom-sage/30 rounded-full"
          />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassmorphismPanel variant="medium" className="p-8 bg-gradient-to-br from-white to-bloom-sage-50/30 border border-bloom-sage/20">
              <h2 className="text-3xl font-playfair font-semibold text-bloom-dark mb-8 text-center">
                Understanding Your Responses
              </h2>
              
              <div className="space-y-6">
                {/* Few boxes checked */}
                <motion.div
                  className="bg-gradient-to-r from-green-50 to-bloom-sage-50/50 rounded-xl p-6 border border-green-200/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg mb-3 text-green-800 flex items-center gap-2">
                    <span>🌱</span>
                    If you checked a few boxes:
                  </h3>
                  <p className="text-green-700">
                    You might be experiencing normal life stress. Consider incorporating self-care practices, reaching out to friends, or trying stress-reduction techniques. These are healthy ways to manage everyday challenges.
                  </p>
                </motion.div>

                {/* Several boxes checked */}
                <motion.div
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg mb-3 text-orange-800 flex items-center gap-2">
                    <span>🌻</span>
                    If you checked several boxes:
                  </h3>
                  <p className="text-orange-700">
                    You may be going through a challenging time that could benefit from professional support. Therapy can provide evidence-based tools and strategies to help you navigate these difficulties and build resilience.
                  </p>
                </motion.div>

                {/* Crisis warning */}
                <motion.div
                  className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg mb-3 text-red-800 flex items-center gap-2">
                    <CircleAlert className="w-5 h-5" />
                    If you are having thoughts of self-harm:
                  </h3>
                  <p className="text-red-700 mb-4">
                    Please reach out for help immediately. You don&apos;t have to go through this alone:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-semibold text-red-800">Crisis Lifeline</div>
                      <div className="text-red-700">988</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-semibold text-red-800">Crisis Text</div>
                      <div className="text-red-700">Text HOME to 741741</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-semibold text-red-800">Emergency</div>
                      <div className="text-red-700">911</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </GlassmorphismPanel>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-bloom to-bloom/90 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
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
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair font-semibold text-white mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              You&apos;ve taken an important step by checking in with yourself. If you&apos;re ready to explore professional support, we&apos;re here to help you on your healing journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                href="/book" 
                variant="pink" 
                size="lg"
                className="shadow-lg hover:shadow-xl"
              >
                Schedule Free Consultation
              </Button>
              <Button 
                href="/contact" 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Ask a Question
              </Button>
            </div>
            <motion.p
              className="mt-8 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              Free 15-minute consultation • Licensed therapist • Confidential
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}