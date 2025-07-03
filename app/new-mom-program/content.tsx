'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// UI Components
import Button from '@/components/ui/Button';

// SEO Components
import { CourseSchema, FAQSchema } from '@/components/seo/JsonLd';

// Weekly curriculum data
const weeklyBreakdown = [
  {
    week: 1,
    theme: "The Invisible Load",
    description: "Name the emotional and mental weight you're carrying and why it's not just in your head."
  },
  {
    week: 2,
    theme: "Identity After Baby: Who Am I Now?",
    description: "Explore how your identity is shifting — and how to honor both who you were and who you're becoming."
  },
  {
    week: 3,
    theme: "Overwhelm & Anxiety",
    description: "Learn grounding techniques, nervous system tools, and how to reclaim calm in chaotic moments."
  },
  {
    week: 4,
    theme: "Boundaries Without Guilt",
    description: "Practice saying no, asking for help, and protecting your energy without shame."
  },
  {
    week: 5,
    theme: "Mom Guilt & Perfectionism",
    description: "Dismantle guilt, let go of unrealistic standards, and soften your inner critic."
  },
  {
    week: 6,
    theme: "Reconnecting With Your Partner (or Yourself)",
    description: "Nurture connection, intimacy, and self-compassion — whether you're partnered or solo."
  },
  {
    week: 7,
    theme: "Rituals of Rest & Joy",
    description: "Learn how to integrate small, sustainable practices that nourish you daily."
  },
  {
    week: 8,
    theme: "Your Support System & What Comes Next",
    description: "Build your ongoing village — and craft a personalized plan for life after the program."
  }
];

// What's included features
const programIncludes = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Eight Weekly Sessions",
    description: "Private 1:1 sessions via Zoom or in-person"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Personalized Check-ins",
    description: "Customized support between sessions"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Between-Session Support",
    description: "Ongoing support via email when you need it"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Customized Support Plan",
    description: "A personalized emotional support plan to carry forward"
  }
];

// FAQ data for schema
const faqData = [
  {
    question: "What is the Becoming Mom program?",
    answer: "Becoming Mom is an 8-week 1:1 support program designed for pregnant and postpartum women. It provides weekly private sessions with Dr. Jana Rundle, personalized guidance, and practical tools to help you navigate the transition into motherhood with less overwhelm and more grounding."
  },
  {
    question: "How do I learn more about the program?",
    answer: "The best way to learn more is to schedule a free discovery call where we can discuss your specific needs and how the program can support you."
  },
  {
    question: "Can I join if I'm still pregnant?",
    answer: "Yes! The program is designed for both pregnant and postpartum moms. Many women find it helpful to start during pregnancy to prepare for the transition ahead."
  },
  {
    question: "What if I need to miss a session?",
    answer: "We understand that life with a baby is unpredictable. Sessions can be rescheduled with 24-hour notice, and we offer flexible scheduling to accommodate your needs."
  },
  {
    question: "Is this covered by insurance?",
    answer: "The program may be covered by insurance as individual therapy sessions. We can provide documentation for reimbursement if you have out-of-network mental health benefits."
  }
];

export default function NewMomProgramContent() {
  return (
    <>
      {/* SEO Schema */}
      <CourseSchema
        name="Becoming Mom - 8-Week Postpartum Support Program"
        description="Private 1:1 support program for women navigating the transition into motherhood with weekly sessions, personalized guidance, and practical tools."
        provider={{
          name: "Bloom Psychology",
          url: "https://bloompsychologynorthaustin.com"
        }}
        offers={{
          availability: "https://schema.org/InStock",
          url: "https://bloompsychologynorthaustin.com/new-mom-program"
        }}
        courseMode="Blended"
        duration="P8W"
        instructor={{
          name: "Dr. Jana Rundle",
          description: "Licensed Clinical Psychologist (Psy.D.) and Perinatal Mental Health Specialist (PMH-C)"
        }}
      />
      
      <FAQSchema faqs={faqData} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloompink/5 relative">
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-playfair text-bloom mb-4 flex items-center justify-center gap-4">
                <svg className="w-12 h-12 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm0 0v18m8-10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
                Becoming Mom
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
                A private 1:1 support program for women navigating the transition into motherhood — with less overwhelm and more grounding.
              </p>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-bloom mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
                  </svg>
                  Welcome
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  You're working hard to care for your baby — but who's helping you care for <span className="font-semibold text-bloompink">you</span>?
                </p>
                <p className="text-gray-600 italic">
                  Everyone asks how the baby is doing. This is for you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  href="/book" 
                  variant="pink" 
                  size="lg"
                  className="inline-flex items-center"
                >
                  Book Free 15-Min Discovery Call
                </Button>
                <Button 
                  href="#program-details" 
                  variant="outline" 
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Reality Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-700 mb-8 text-center">
                Becoming a mom is one of the most powerful transformations we go through — physically, emotionally, and spiritually. 
                But it's also one of the most <span className="font-semibold text-bloompink">invisible</span>.
              </p>

              <div className="bg-gradient-to-r from-bloom-blush/10 to-bloompink/5 border-l-4 border-bloompink rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-semibold text-bloom mb-6">You might feel:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-bloompink mr-3 text-xl">•</span>
                    <span className="text-gray-700">Like you've lost yourself in the process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-bloompink mr-3 text-xl">•</span>
                    <span className="text-gray-700">Emotionally drained and constantly "on"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-bloompink mr-3 text-xl">•</span>
                    <span className="text-gray-700">Caught between exhaustion, guilt, and pressure to hold it all together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-bloompink mr-3 text-xl">•</span>
                    <span className="text-gray-700">Unsure how to ask for help — or even what you need</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-semibold text-bloom mb-4">You are not alone.</p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-bloompink">Becoming Mom</span> is here to help you feel seen, supported, and reconnected to yourself — 
                  with weekly 1:1 sessions, personalized guidance, and practical tools designed just for this season.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section id="program-details" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-4 flex items-center justify-center gap-3">
                <svg className="w-8 h-8 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                What's Included
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Becoming Mom is an 8-week 1:1 experience designed for both pregnant and postpartum moms. You'll receive:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {programIncludes.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <div className="text-bloompink mr-4 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-bloom text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Breakdown Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-4 flex items-center justify-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Weekly Breakdown
              </h2>
              <p className="text-lg text-gray-600">
                Each week builds on the last — gently guiding you from emotional overload to grounded clarity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200 table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-bloom-blush/10 to-bloompink/5 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom whitespace-nowrap w-24">Week</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom">Theme</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom">What You'll Explore</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyBreakdown.map((week, index) => (
                    <motion.tr
                      key={week.week}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-bloompink font-semibold whitespace-nowrap">Week {week.week}</td>
                      <td className="px-6 py-4 font-medium text-bloom">{week.theme}</td>
                      <td className="px-6 py-4 text-gray-600">{week.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-16 bg-gradient-to-br from-bloom-blush/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-6 flex items-center justify-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Investment
            </h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6">
                I know what this season feels like — emotionally, logistically, and financially.
              </p>
              <p className="text-gray-600 mb-8">
                That's why <span className="font-semibold">Becoming Mom</span> gives you so much more than just 8 sessions.
              </p>
              <p className="text-gray-700 mb-8">
                It's a container of support, healing, and space to just be you again — with 1:1 guidance, 
                in-between session support, and a path that meets you wherever you are.
              </p>

              <Button 
                href="/book" 
                variant="pink" 
                size="lg"
                className="inline-flex items-center"
              >
                Book Free Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-bloom-blush/20 to-bloom-accent/20">
                  <Image
                    src="/images/optimized/Team/Jana Rundle.webp"
                    alt="Dr. Jana Rundle - Licensed Clinical Psychologist and Perinatal Mental Health Specialist"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-bloom mb-4 flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About Me
                </h2>
                <p className="text-gray-700 mb-6">
                  I'm a licensed clinical psychologist (Psy.D.) and perinatal mental health specialist (PMH-C) based in Austin. 
                  I've walked with hundreds of moms through anxiety, burnout, grief, and identity shifts — and I created 
                  <span className="font-semibold text-bloompink"> Becoming Mom</span> to offer the support I wish every woman had when entering motherhood.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Licensed Clinical Psychologist (Psy.D.)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Perinatal Mental Health Specialist (PMH-C)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Mother of two with personal postpartum experience
                  </div>
                </div>
                <Button 
                  href="/about" 
                  variant="outline"
                  className="inline-flex items-center"
                >
                  Learn More About Dr. Rundle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-bloom text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            How to Get Started
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Ready to feel seen, supported, and a little more like yourself again?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/book" 
              variant="white"
              size="lg"
              className="inline-flex items-center"
            >
              Book a Free 15-Minute Discovery Call
            </Button>
            <Button 
              href="/contact?subject=Becoming Mom Program" 
              variant="outline-white"
              size="lg" 
              className="inline-flex items-center"
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}