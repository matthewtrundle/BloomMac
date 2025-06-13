'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function SupportingYourPartnerPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const supportSections = [
    {
      id: 'physical',
      title: 'Physical Recovery Support',
      icon: '🏥',
      content: [
        'Take over household tasks without being asked',
        'Prepare nutritious meals and ensure she stays hydrated',
        'Encourage rest whenever possible',
        'Accompany her to medical appointments',
        'Help with wound care or medication reminders'
      ]
    },
    {
      id: 'emotional',
      title: 'Emotional Support',
      icon: '💝',
      content: [
        'Listen without trying to fix everything',
        'Validate her feelings, even if you don\'t understand them',
        'Remind her she\'s doing a great job',
        'Be patient with mood swings',
        'Create a judgment-free zone for her to express herself'
      ]
    },
    {
      id: 'practical',
      title: 'Practical Daily Support',
      icon: '🏠',
      content: [
        'Handle night feedings so she can sleep',
        'Take the baby for walks so she can shower or rest',
        'Keep visitors to a minimum unless she wants them',
        'Stock up on her favorite snacks',
        'Take initiative with baby care tasks'
      ]
    },
    {
      id: 'communication',
      title: 'Communication Tips',
      icon: '💬',
      content: [
        'Ask "What do you need right now?" instead of "How can I help?"',
        'Share your own feelings appropriately',
        'Check in regularly but don\'t hover',
        'Use "I" statements to express concerns',
        'Respect her need for space when requested'
      ]
    }
  ];

  const warningSignsData = [
    {
      category: 'Immediate Help Needed',
      signs: [
        'Thoughts of harming herself or the baby',
        'Hearing or seeing things that aren\'t there',
        'Extreme confusion or memory loss',
        'Unable to sleep for several days',
        'Rapid mood swings or mania'
      ],
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      category: 'Professional Support Recommended',
      signs: [
        'Persistent sadness lasting more than 2 weeks',
        'Extreme anxiety or panic attacks',
        'Loss of interest in the baby',
        'Significant changes in appetite or sleep',
        'Feelings of worthlessness or excessive guilt'
      ],
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const whatToSay = [
    "I'm here for you, no matter what",
    "You're an amazing mother",
    "It's okay to feel this way",
    "What do you need right now?",
    "Let me handle dinner tonight",
    "You're not alone in this",
    "Your feelings are valid",
    "Take all the time you need"
  ];

  const whatNotToSay = [
    "You should be happy",
    "Other moms manage just fine",
    "Just think positive",
    "At least the baby is healthy",
    "You wanted this baby",
    "Snap out of it",
    "You're overreacting",
    "I know how you feel"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50/10 via-white to-bloom-pink-50/10">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-bloom-pink-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-bloom-sage-50/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-playfair mb-6">
              Be the Support <span className="text-bloompink">She Needs</span>
            </h1>
            
            <div className="w-24 h-0.5 bg-[#f8b5c4] mx-auto mb-6"></div>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              Learn how to provide meaningful support during her postpartum journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#support-guide" variant="pink" size="lg">
                View Support Guide
              </Button>
              <Button href="/courses/partner-support-bootcamp" variant="outline" size="lg">
                Take Our Partner Course
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Understanding Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair text-center mb-12">
              Understanding <span className="text-bloompink">Postpartum Changes</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-bloom-sage-50/30 to-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Physical Changes</h3>
                <p className="text-bloom-dark/70">
                  Recovery takes 6-12 weeks minimum. Her body has been through a major event 
                  and needs time, rest, and support to heal properly.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-bloom-pink-50/30 to-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Hormonal Shifts</h3>
                <p className="text-bloom-dark/70">
                  Massive hormone changes can affect mood, energy, and emotions. This is 
                  biology, not a character flaw or weakness.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-bloom-accent-50/30 to-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Emotional Journey</h3>
                <p className="text-bloom-dark/70">
                  It's normal to have mixed feelings about parenthood. Support her through 
                  all emotions without judgment.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Practical Support Guide */}
      <section id="support-guide" className="py-16 bg-gradient-to-b from-white to-bloom-sage-50/10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-playfair text-center mb-12">
            Practical <span className="text-bloompink">Support Guide</span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {supportSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-bloom-sage-50/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-bloom-dark/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-playfair text-center mb-12">
            What to Say <span className="text-bloompink">(and What Not to Say)</span>
          </h2>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-green-800">✓ Helpful Things to Say</h3>
              <ul className="space-y-3">
                {whatToSay.map((phrase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-bloom-dark/80">"{phrase}"</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-red-800">✗ Things to Avoid Saying</h3>
              <ul className="space-y-3">
                {whatNotToSay.map((phrase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-bloom-dark/80">"{phrase}"</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warning Signs Section */}
      <section className="py-16 bg-gradient-to-b from-white to-bloom-sage-50/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair text-center mb-12">
              When to <span className="text-bloompink">Seek Professional Help</span>
            </h2>
            
            <div className="space-y-6">
              {warningSignsData.map((category, index) => (
                <div
                  key={index}
                  className={`${category.bgColor} ${category.borderColor} border-2 rounded-xl p-6`}
                >
                  <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.signs.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-bloom-dark/60">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-bloom-dark/80 mb-4">
                If you notice any of these signs, don't wait. Professional help is available.
              </p>
              <Button href="/contact" variant="pink" size="lg">
                Contact Dr. Jana Rundle
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Self-Care for Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair mb-8">
              Don't Forget About <span className="text-bloompink">Your Own Needs</span>
            </h2>
            
            <p className="text-lg text-bloom-dark/80 mb-8">
              Supporting a partner through postpartum can be emotionally draining. 
              You can't pour from an empty cup.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-bloom-sage-50/30 to-white p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Take Breaks</h3>
                <p className="text-sm text-bloom-dark/70">
                  It's okay to need time for yourself
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-bloom-pink-50/30 to-white p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Seek Support</h3>
                <p className="text-sm text-bloom-dark/70">
                  Talk to friends, family, or a therapist
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-bloom-accent-50/30 to-white p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Stay Active</h3>
                <p className="text-sm text-bloom-dark/70">
                  Exercise helps manage stress
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Be Patient</h3>
                <p className="text-sm text-bloom-dark/70">
                  Recovery takes time for everyone
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/10 to-bloom-pink-50/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-playfair mb-6">
              Learn to Be the <span className="text-bloompink">Partner She Needs</span>
            </h2>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              Our Partner Support Bootcamp gives you practical tools and strategies 
              to provide meaningful support during the postpartum period.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/courses/partner-support-bootcamp" variant="pink" size="lg">
                View Partner Bootcamp
              </Button>
              <Button href="/resources/partner-support-checklist" variant="outline" size="lg">
                Download Free Checklist
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <NewsletterSignup 
            variant="banner"
            source="partner_support_page"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}