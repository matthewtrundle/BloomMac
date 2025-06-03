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
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="virtual-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#virtual-grid)" />
          </svg>
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
            
            <p className="text-xl text-center text-bloom-dark/80 mb-12 max-w-3xl mx-auto">
              Get the support you need from the comfort of your home. 
              Licensed therapy for postpartum depression, anxiety, and maternal mental health across all of Texas.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold mb-4">Why Texas Moms Choose Virtual Therapy</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong>No commute needed</strong> - Save time and stress
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong>Baby-friendly</strong> - Nurse or hold baby during sessions
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong>Flexible scheduling</strong> - Evening and weekend options
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <strong>Same expert care</strong> - Dr. Jana Rundle, Certified Perinatal Mental Health Specialist
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair mb-6">Serving All Texas Communities</h2>
            <p className="text-lg text-bloom-dark/70 mb-8">
              Whether you're in a major city or a small town, we're here for you. 
              Licensed to provide therapy throughout the state of Texas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {texasCities.map((city) => (
                <motion.button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-bloompink text-white'
                      : 'bg-bloom-sage-50 text-bloom-dark hover:bg-bloom-sage-100'
                  }`}
                >
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

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-bloom-pink-50 to-white">
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
              <div className="w-16 h-16 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Book Online</h3>
              <p className="text-sm text-bloom-dark/70">
                Schedule your free consultation through our simple online booking
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Your Link</h3>
              <p className="text-sm text-bloom-dark/70">
                Receive a secure video link via email before your appointment
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect from Home</h3>
              <p className="text-sm text-bloom-dark/70">
                Join from any private space where you feel comfortable
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Start Healing</h3>
              <p className="text-sm text-bloom-dark/70">
                Get the same quality care as in-person therapy
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-center mb-12">
            Virtual Therapy Benefits for <span className="text-bloompink">Texas Moms</span>
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

      {/* FAQ Section */}
      <section className="py-20 bg-bloom-sage-50">
        <div className="container mx-auto px-6">
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

      {/* Self-Assessment CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-bloompink to-pink-400 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-playfair mb-4">Not Sure If Virtual Therapy Is Right for You?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take our quick self-assessment to see if virtual therapy could help with your specific needs
            </p>
            <Button href="/virtual-therapy/is-virtual-right-for-you" variant="outline" size="lg" className="bg-white text-bloompink border-white hover:bg-gray-50">
              Take 2-Minute Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50 to-bloom-pink-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-playfair mb-6">
            Ready to Start Healing from Home?
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

      {/* Newsletter */}
      <section className="py-16 bg-white">
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