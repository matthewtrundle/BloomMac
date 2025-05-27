'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// UI Components
import Button from '@/components/ui/Button';
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';

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
    icon: "💬",
    title: "Eight Weekly Sessions",
    description: "Private 1:1 sessions via Zoom or in-person"
  },
  {
    icon: "📝",
    title: "Personalized Check-ins",
    description: "Custom journaling prompts and worksheets"
  },
  {
    icon: "✉️",
    title: "Between-Session Support",
    description: "Ongoing support via email when you need it"
  },
  {
    icon: "🎯",
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
    question: "How much does the program cost?",
    answer: "The investment is $960 for the full 8-week program, or you can choose weekly payments of $120. This is priced below our standard hourly rate to make comprehensive support more accessible."
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
  const [showJournalingPrompts, setShowJournalingPrompts] = useState(false);

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
          price: "960",
          priceCurrency: "USD",
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5 relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-right"
          opacity={0.03}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-playfair text-bloom mb-4">
                <span className="text-bloompink">🌸</span> Becoming Mom
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
                A private 1:1 support program for women navigating the transition into motherhood — with less overwhelm and more grounding.
              </p>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-bloom mb-4">👋 Welcome</h2>
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

              <div className="bg-bloom-blush/10 rounded-2xl p-8 mb-8">
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
                  <span className="font-semibold">Becoming Mom</span> is here to help you feel seen, supported, and reconnected to yourself — 
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
              <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-4">💡 What's Included</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Becoming Mom is an 8-week 1:1 experience designed for both pregnant and postpartum moms. You'll receive:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {programIncludes.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassmorphismPanel 
                    variant="medium"
                    className="h-full p-6"
                    hoverEffect="lift"
                  >
                    <div className="flex items-start">
                      <span className="text-3xl mr-4">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold text-bloom text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </GlassmorphismPanel>
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
              <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-4">🗓️ Weekly Breakdown</h2>
              <p className="text-lg text-gray-600">
                Each week builds on the last — gently guiding you from emotional overload to grounded clarity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200 table-auto">
                <thead>
                  <tr className="bg-bloom-blush/10 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom whitespace-nowrap w-24">Week</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom">Theme</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-bloom">What You'll Explore</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyBreakdown.map((week, index) => (
                    <motion.tr
                      key={week.week}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
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
      <section className="py-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-bloom mb-6">💸 Investment</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6">
                I know what this season feels like — emotionally, logistically, and financially.
              </p>
              <p className="text-gray-600 mb-8">
                That's why <span className="font-semibold">Becoming Mom</span> is priced below my standard hourly rate of $175, 
                but gives you so much more than just 8 sessions.
              </p>
              <p className="text-gray-700 mb-8">
                It's a container of support, healing, and space to just be you again — with 1:1 guidance, 
                in-between session support, and a path that meets you wherever you are.
              </p>
              
              <div className="bg-bloom-blush/10 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-semibold text-bloom mb-4">Your Investment:</h3>
                <p className="text-3xl font-bold text-bloompink mb-2">💳 $960</p>
                <p className="text-gray-600">(or weekly payments of $120)</p>
              </div>

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

      {/* Journaling Prompts Toggle Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-bloom mb-4">📝 Journaling Support</h2>
              <p className="text-gray-600 mb-6">
                Each week includes custom journaling prompts and worksheets to deepen your self-discovery
              </p>
              <Button
                variant="outline"
                onClick={() => setShowJournalingPrompts(!showJournalingPrompts)}
                className="inline-flex items-center"
              >
                {showJournalingPrompts ? 'Hide' : 'View'} Weekly Prompts & Worksheets
                <svg 
                  className={`ml-2 w-4 h-4 transition-transform ${showJournalingPrompts ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>

            {showJournalingPrompts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 mt-8"
              >
                {weeklyBreakdown.map((week) => (
                  <div key={week.week} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-bloom mb-4">
                      Week {week.week}: {week.theme}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-bloompink mb-2">Journaling Prompts:</h4>
                        <ul className="space-y-2 text-gray-700">
                          {getJournalingPrompts(week.week).map((prompt, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-bloom-accent mr-2">•</span>
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-bloompink mb-2">Worksheet Ideas:</h4>
                        <ul className="space-y-2 text-gray-700">
                          {getWorksheetIdeas(week.week).map((worksheet, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-bloom-accent mr-2">•</span>
                              <span>{worksheet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
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
                <h2 className="text-3xl font-bold text-bloom mb-4">👩‍⚕️ About Me</h2>
                <p className="text-gray-700 mb-6">
                  I'm a licensed clinical psychologist (Psy.D.) and perinatal mental health specialist (PMH-C) based in Austin. 
                  I've walked with hundreds of moms through anxiety, burnout, grief, and identity shifts — and I created 
                  <span className="font-semibold text-bloompink"> Becoming Mom</span> to offer the support I wish every woman had when entering motherhood.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Licensed Clinical Psychologist (Psy.D.)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Perinatal Mental Health Specialist (PMH-C)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-bloom-accent" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-16 bg-gradient-to-r from-bloom to-bloom-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            📥 How to Get Started
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
              👉 Book a Free 15-Minute Discovery Call
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

// Helper functions for journaling prompts and worksheets
function getJournalingPrompts(week: number): string[] {
  const prompts: { [key: number]: string[] } = {
    1: [
      "What are five things you're carrying right now that no one sees?",
      "When do you feel most mentally overloaded?",
      "What would it feel like to put something down, even temporarily?"
    ],
    2: [
      "What parts of 'you' feel the same since becoming a mom? What feels different?",
      "If your life was a timeline, how would you describe the 'before' and 'after'?",
      "What do you miss? What do you not miss?"
    ],
    3: [
      "What does overwhelm feel like in your body?",
      "What helps you feel grounded — even for a moment?",
      "What stories do you tell yourself when anxiety shows up?"
    ],
    4: [
      "Where in your life do you feel resentful? What might that be telling you?",
      "What would it feel like to say no without guilt?",
      "Who are you afraid of disappointing?"
    ],
    5: [
      "What's something you know doesn't matter — but still makes you feel guilty?",
      "Whose expectations are you trying to meet?",
      "What would it look like to be a 'good enough' mom?"
    ],
    6: [
      "What kind of connection are you craving right now?",
      "What do you wish your partner (or support person) understood about you?",
      "When was the last time you felt truly like yourself?"
    ],
    7: [
      "What small moments of joy have you experienced this week?",
      "When do you feel most like yourself?",
      "What would a restful day look like — even in 15-minute pockets?"
    ],
    8: [
      "Who are the people who really see you? Who might you reach out to more?",
      "What do you want to carry forward from this program?",
      "What does support look like for the version of you you're becoming?"
    ]
  };
  return prompts[week] || [];
}

function getWorksheetIdeas(week: number): string[] {
  const worksheets: { [key: number]: string[] } = {
    1: [
      "'What I Carry' Exercise: List tasks you do daily (seen + unseen)",
      "Invisible Load Audit: Break down tasks into Mental, Emotional, Logistical categories"
    ],
    2: [
      "Then vs. Now Reflection: Who I was before / Who I am now / Who I'm becoming",
      "Identity Mapping: Draw circles showing roles and how full each feels"
    ],
    3: [
      "What's in My Control?: I can control / I can't control / I can influence",
      "My Soothing Toolkit: List calming activities and add 3 new ones to try"
    ],
    4: [
      "Boundary Script Builder: Situation / My need / How to express it / Support needed",
      "Ask for Help Tracker: Track one small ask this week and how it felt"
    ],
    5: [
      "Guilt Reframe Exercise: What I felt guilty about / Why / A gentler truth",
      "Perfection Check: List 5 ways perfection shows up and how it helps vs. hurts"
    ],
    6: [
      "Love Languages in Motherhood: Identify your current love language and changes",
      "Check-In Template: What's been hard / What's been good / What I need more of"
    ],
    7: [
      "Joy Menu: Build a list of micro-moments that bring you joy",
      "Rest Ritual Plan: Create one 10-minute daily ritual for rest or peace"
    ],
    8: [
      "Support Map: List emotional, practical, and emergency support contacts",
      "Life After This Planner: Choose 3 habits or insights to carry forward"
    ]
  };
  return worksheets[week] || [];
}