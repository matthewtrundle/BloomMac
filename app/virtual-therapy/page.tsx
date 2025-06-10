'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

const texasCities = [
  'Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso',
  'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland',
  'Irving', 'Amarillo', 'Grand Prairie', 'McKinney', 'Frisco', 'Pasadena',
  'Mesquite', 'Killeen', 'McAllen', 'Waco', 'Carrollton', 'Midland',
  'Abilene', 'Beaumont', 'Round Rock', 'The Woodlands', 'Richardson'
];

const faqs = [
  {
    question: 'Is virtual therapy as effective as in-person?',
    answer: 'Research shows that virtual therapy can be just as effective as in-person therapy for many conditions, including postpartum depression and anxiety. Many clients actually prefer the convenience and comfort of attending sessions from home.'
  },
  {
    question: 'What technology do I need?',
    answer: 'You need a device with a camera (smartphone, tablet, or computer) and a stable internet connection. We use a HIPAA-compliant video platform that works on all devices - no special software needed.'
  },
  {
    question: 'How do virtual sessions work?',
    answer: 'Sessions are 50 minutes, just like in-person therapy. You\'ll receive a secure link before your appointment. Find a private, comfortable space where you won\'t be interrupted, and we\'ll connect at your scheduled time.'
  },
  {
    question: 'Is virtual therapy secure and private?',
    answer: 'Absolutely. We use HIPAA-compliant, encrypted video technology to ensure your privacy. Your sessions are just as confidential as in-person therapy.'
  },
  {
    question: 'What if my baby needs me during a session?',
    answer: 'No problem! One of the benefits of virtual therapy for new moms is that you can attend to your baby\'s needs. Feel free to nurse, hold, or comfort your baby during our sessions.'
  },
];

export default function VirtualTherapyPage() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section - Digital Greenhouse */}
      <section className="relative py-20 bg-gradient-to-br from-bloom-sage-50/30 via-white to-bloom-pink-50/20 overflow-hidden">
        {/* Greenhouse glass effect */}
        <div className="absolute inset-0">
          {/* Glass panels pattern */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="greenhouse-glass" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage/20"/>
                <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="0.3" className="text-bloom-sage/10"/>
                <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="0.3" className="text-bloom-sage/10"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#greenhouse-glass)" />
          </svg>
          
          {/* Condensation effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
        </div>
        
        {/* Floating digital seeds */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -100], x: [0, 50], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-3 h-3 bg-green-300 rounded-full opacity-30"
          />
          <motion.div
            animate={{ y: [0, -150], x: [0, -30], rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute top-40 right-40 w-2 h-2 bg-bloom-sage/30 rounded-full"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-playfair text-center mb-6">
              <span className="text-bloom-dark">Virtual Therapy for </span>
              <span className="text-bloompink">Texas Moms</span>
            </h1>
            
            {/* Garden divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🌿
              </motion.span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-xl text-center text-bloom-dark/80 mb-12 max-w-3xl mx-auto">
              Get professional mental health support from the comfort of your home. 
              Licensed therapy for postpartum depression, anxiety, and maternal wellness across Texas.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    Why Choose Virtual Therapy
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">🌱</span>
                      <div>
                        <strong>No commute needed</strong> - Save time and energy
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">🌱</span>
                      <div>
                        <strong>Baby-friendly</strong> - Nurse or hold baby during sessions
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">🌱</span>
                      <div>
                        <strong>Flexible scheduling</strong> - Evening and weekend options
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">🌱</span>
                      <div>
                        <strong>Expert care</strong> - Dr. Jana Rundle, Perinatal Mental Health Certified
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-8 text-center">
                    <Button href="/book" variant="pink" size="lg" className="w-full">
                      Schedule Virtual Consultation
                    </Button>
                    <p className="text-sm text-bloom-dark/60 mt-2">Free 15-minute consultation</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="/images/optimized/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.webp"
                  alt="Woman having virtual therapy session from home"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-bloom-sage/20 w-32 h-32 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 bg-bloompink/20 w-24 h-24 rounded-full blur-xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Texas Cities Section */}
      <section className="py-16 bg-gradient-to-b from-white to-bloom-sage-50/10 relative overflow-hidden">
        {/* Decorative map texture */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
            <pattern id="garden-zones" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#7A8B7F" />
            </pattern>
            <rect width="200" height="200" fill="url(#garden-zones)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair mb-6">Serving All <span className="text-bloompink">Texas Communities</span></h2>
            <p className="text-lg text-bloom-dark/70 mb-8">
              Whether you're in a major city or small town, we're licensed to provide 
              therapy throughout the state of Texas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {texasCities.map((city) => (
                <motion.button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    selectedCity === city
                      ? 'bg-gradient-to-r from-bloom-sage to-bloom-sage/80 text-white shadow-md'
                      : 'bg-white border border-bloom-sage/20 text-bloom-dark hover:bg-bloom-sage-50 hover:border-bloom-sage/40'
                  }`}
                >
                  <span className="text-xs">🌱</span>
                  {city}
                </motion.button>
              ))}
            </div>
            
            <p className="text-sm text-bloom-dark/60">
              Don't see your city? No problem! We serve all Texas residents.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section - Planting Process */}
      <section className="py-20 bg-gradient-to-br from-bloom-pink-50/20 to-white relative overflow-hidden">
        {/* Decorative vine pattern */}
        <svg className="absolute left-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
          <path d="M50,0 Q30,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
        </svg>
        
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-center mb-12">How Virtual Therapy Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-bloom-sage to-bloom-sage/80 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl">🌱</span>
              </motion.div>
              <h3 className="font-semibold mb-2">Book Online</h3>
              <p className="text-sm text-bloom-dark/70">
                Schedule your free consultation
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-bloom-sage to-bloom-sage/80 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl">💧</span>
              </motion.div>
              <h3 className="font-semibold mb-2">Get Your Link</h3>
              <p className="text-sm text-bloom-dark/70">
                Receive secure video link via email
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-bloom-sage to-bloom-sage/80 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl">☀️</span>
              </motion.div>
              <h3 className="font-semibold mb-2">Connect from Home</h3>
              <p className="text-sm text-bloom-dark/70">
                Join from any private, comfortable space
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-bloompink to-bloompink/80 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl">🌸</span>
              </motion.div>
              <h3 className="font-semibold mb-2">Start Healing</h3>
              <p className="text-sm text-bloom-dark/70">
                Begin your therapeutic journey
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid - Garden Features */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -50], rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-20 text-4xl opacity-20"
          >
            🌿
          </motion.div>
          <motion.div
            animate={{ y: [0, -30], rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 10 }}
            className="absolute bottom-20 left-40 text-3xl opacity-20"
          >
            🌱
          </motion.div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl font-playfair text-center mb-12">
            Benefits of Virtual Therapy for <span className="text-bloompink">Texas Moms</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-sage-50 to-bloom-sage-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">No Childcare Needed</h3>
              <p className="text-bloom-dark/70">
                Keep baby with you during sessions. Nurse, rock, or play - whatever your little one needs.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-pink-50 to-bloom-pink-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">Texas Heat? No Problem</h3>
              <p className="text-bloom-dark/70">
                Stay cool at home instead of loading everyone in a hot car for appointments.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-accent-50 to-bloom-accent-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">Rural Access</h3>
              <p className="text-bloom-dark/70">
                Live far from major cities? Get specialized maternal mental health care wherever you are.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-pink-50 to-bloom-pink-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">Postpartum Recovery</h3>
              <p className="text-bloom-dark/70">
                Still healing physically? No need to leave home while your body recovers.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-sage-50 to-bloom-sage-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">Partner Involvement</h3>
              <p className="text-bloom-dark/70">
                Easier for partners to join sessions when needed, without work disruption.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-bloom-accent-50 to-bloom-accent-100 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3">Consistent Care</h3>
              <p className="text-bloom-dark/70">
                Moving? Traveling? Keep the same therapist no matter where you are in Texas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Gardening Q&A */}
      <section className="py-20 bg-bloom-sage-50/30 relative overflow-hidden">
        {/* Garden soil texture */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="soil-texture" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#8B7355" />
              <circle cx="3" cy="3" r="0.3" fill="#7A8B7F" />
            </pattern>
            <rect width="100" height="100" fill="url(#soil-texture)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl font-playfair text-center mb-12">Common Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-soft group"
              >
                <summary className="font-semibold cursor-pointer flex justify-between items-center">
                  {faq.question}
                  <svg className="w-5 h-5 text-bloom-dark/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-bloom-dark/70">{faq.answer}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Assessment CTA - Soil Test */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative roots */}
        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-5" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,100 Q300,50 600,70 T1200,60 L1200,100 L0,100" fill="#8B7355" />
        </svg>
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-br from-bloom-sage to-bloom-sage/90 rounded-2xl p-12 text-white text-center shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🌱
            </motion.div>
            <h2 className="text-3xl font-playfair mb-4">Not Sure If Virtual Therapy Is Right for You?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take our quick self-assessment to see if virtual therapy could help with your specific needs
            </p>
            <Button href="/virtual-therapy/is-virtual-right-for-you" variant="outline" size="lg" className="bg-white text-bloom-sage border-white hover:bg-gray-50">
              Take 2-Minute Assessment
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Plant Your First Seed */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/20 to-bloom-pink-50/20 relative overflow-hidden">
        {/* Animated garden elements */}
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
        
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-playfair mb-6">
            Ready to Start <span className="text-bloompink">Healing from Home?</span>
          </h2>
          <p className="text-xl text-bloom-dark/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of Texas moms who have found support through virtual therapy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/book" variant="pink" size="lg">
              Book Free Consultation
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Have Questions? Contact Us
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-bloom-dark/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Licensed in Texas</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Garden Updates */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bloom-sage/20 to-transparent"></div>
        
        <div className="container mx-auto px-6">
          <NewsletterSignup 
            variant="banner"
            source="virtual_therapy_page"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}