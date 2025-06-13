'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function WhenFamilyWantsToHelpPage() {
  const [activeTab, setActiveTab] = useState('helpful');

  const helpfulActions = [
    {
      category: 'Practical Support',
      icon: '🏠',
      actions: [
        'Bring prepared meals (ask about dietary restrictions first)',
        'Offer to do specific household tasks (laundry, dishes, cleaning)',
        'Run errands (grocery shopping, pharmacy trips)',
        'Take care of older siblings for a few hours',
        'Walk the dog or care for pets',
        'Help with yard work or home maintenance'
      ]
    },
    {
      category: 'Emotional Support',
      icon: '💝',
      actions: [
        'Listen without offering unsolicited advice',
        'Validate their feelings and experiences',
        'Send encouraging texts without expecting immediate replies',
        'Respect their parenting choices',
        'Share positive memories of them as a person (not just as a parent)',
        'Be patient with their emotional ups and downs'
      ]
    },
    {
      category: 'Respecting Boundaries',
      icon: '🚪',
      actions: [
        'Always call or text before visiting',
        'Keep visits short unless invited to stay longer',
        'Ask before posting photos on social media',
        'Follow their lead on holding the baby',
        'Respect their feeding choices (breast, bottle, or both)',
        'Leave when they seem tired or overwhelmed'
      ]
    },
    {
      category: 'Gift Ideas That Actually Help',
      icon: '🎁',
      actions: [
        'Gift cards for food delivery or meal services',
        'Subscription to a house cleaning service',
        'Comfortable nursing/feeding supplies',
        'Self-care items for the parents',
        'Books or audiobooks for quiet moments',
        'Contributions to a college fund instead of more baby clothes'
      ]
    }
  ];

  const harmfulActions = [
    {
      category: 'Comments to Avoid',
      icon: '🚫',
      actions: [
        '"You look tired" (they know!)',
        '"Sleep when the baby sleeps" (often impossible)',
        '"Enjoy every moment" (dismisses real struggles)',
        '"I did it differently and my kids turned out fine"',
        '"Are you sure you have enough milk?"',
        '"When I was a parent..." (unless specifically asked)'
      ]
    },
    {
      category: 'Behaviors That Don\'t Help',
      icon: '⚠️',
      actions: [
        'Showing up unannounced',
        'Staying too long during visits',
        'Expecting to be entertained or fed',
        'Giving unsolicited parenting advice',
        'Comparing their baby to others',
        'Taking over without asking'
      ]
    },
    {
      category: 'Boundary Violations',
      icon: '🛑',
      actions: [
        'Posting photos without permission',
        'Kissing the baby (especially when sick)',
        'Ignoring their parenting preferences',
        'Rearranging their home without asking',
        'Inviting others to visit without checking first',
        'Dismissing their concerns or feelings'
      ]
    },
    {
      category: 'Well-Meaning But Unhelpful',
      icon: '😔',
      actions: [
        'Buying clothes in only newborn sizes',
        'Giving parenting books implying they need help',
        'Offering to "give them a break" then needing detailed instructions',
        'Saying "just relax" about breastfeeding struggles',
        'Minimizing their challenges',
        'Making everything about your own experiences'
      ]
    }
  ];

  const communicationTips = [
    {
      title: 'Ask First, Act Second',
      description: 'Always ask what they need rather than assuming'
    },
    {
      title: 'Be Specific with Offers',
      description: 'Instead of "Let me know if you need anything," try "I\'m going to the store, what can I pick up for you?"'
    },
    {
      title: 'Respect Their Schedule',
      description: 'New parents are juggling feeding, sleeping, and recovery schedules'
    },
    {
      title: 'Follow Their Lead',
      description: 'If they want to talk about the baby, great. If not, that\'s okay too'
    }
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
              When Family <span className="text-bloompink">Wants to Help</span>
            </h1>
            
            <div className="w-24 h-0.5 bg-[#f8b5c4] mx-auto mb-6"></div>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              A guide for extended family and friends on how to truly support new parents
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#guide" variant="pink" size="lg">
                View Support Guide
              </Button>
              <Button href="/resources/helpful-vs-harmful-checklist" variant="outline" size="lg">
                Download Checklist
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
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
              Your Heart is in the <span className="text-bloompink">Right Place</span>
            </h2>
            
            <p className="text-lg text-bloom-dark/80 mb-6">
              We know you want to help. Watching someone you love navigate new parenthood 
              can make you eager to jump in and support them. This guide will help you 
              channel that love into actions that truly make a difference.
            </p>
            
            <p className="text-lg text-bloom-dark/80">
              Remember: what helped when you had children (or what you think would help) 
              might not be what they need right now. Every family is different, and that's okay.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section id="guide" className="py-8 bg-gradient-to-b from-white to-bloom-sage-50/10 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('helpful')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'helpful' 
                  ? 'bg-gradient-to-r from-bloom-sage to-bloom-sage/80 text-white shadow-md' 
                  : 'bg-white text-bloom-dark hover:bg-bloom-sage-50 border border-bloom-sage/20'
              }`}
            >
              <span className="mr-2">✓</span> Helpful Actions
            </button>
            <button 
              onClick={() => setActiveTab('harmful')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'harmful' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' 
                  : 'bg-white text-bloom-dark hover:bg-red-50 border border-red-200'
              }`}
            >
              <span className="mr-2">✗</span> Things to Avoid
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-gradient-to-b from-bloom-sage-50/10 to-white">
        <div className="container mx-auto px-6">
          {activeTab === 'helpful' ? (
            <motion.div
              key="helpful"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-playfair text-center mb-12">
                Ways to <span className="text-bloompink">Truly Help</span>
              </h2>
              
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {helpfulActions.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="text-xl font-semibold">{category.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-bloom-dark/80">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="harmful"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-playfair text-center mb-12">
                Things to <span className="text-red-600">Avoid</span>
              </h2>
              
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {harmfulActions.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="text-xl font-semibold">{category.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-bloom-dark/80">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Communication Tips */}
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
              Communication <span className="text-bloompink">Best Practices</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {communicationTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-bloom-sage-50/30 to-white p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                  <p className="text-bloom-dark/70">{tip.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sample Messages */}
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
              Sample <span className="text-bloompink">Supportive Messages</span>
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Try These Instead:</h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-1">Instead of: "Let me know if you need anything"</p>
                  <p className="text-bloom-dark">Try: "I'm going to the grocery store Tuesday. Can I pick up milk, eggs, or anything else for you?"</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-1">Instead of: "I'd love to see the baby!"</p>
                  <p className="text-bloom-dark">Try: "When you're ready for visitors, I'd love to meet the baby. No rush - your recovery comes first!"</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-1">Instead of: "You should try..."</p>
                  <p className="text-bloom-dark">Try: "You're doing an amazing job. Is there anything specific that would make your days easier?"</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-1">Instead of: "My baby never did that"</p>
                  <p className="text-bloom-dark">Try: "Every baby is so different. You really know your little one best."</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Be Concerned */}
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
              When to Be <span className="text-bloompink">Gently Concerned</span>
            </h2>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
              <p className="text-lg text-bloom-dark mb-6">
                While respecting boundaries is important, true support sometimes means 
                noticing when professional help might be needed. If you observe several 
                of these signs, gently express your concern:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Persistent sadness or crying (more than 2 weeks postpartum)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Extreme anxiety or panic about the baby's wellbeing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Disconnection from the baby or family</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Mentions of self-harm or not wanting to be here</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Significant changes in behavior or personality</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="font-medium mb-2">How to express concern:</p>
                <p className="text-bloom-dark/80 italic">
                  "I've noticed you've been having a tough time, and that's completely 
                  understandable. Have you thought about talking to your doctor about how 
                  you're feeling? I'm happy to help you find resources or go with you if 
                  that would help."
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
              Be the Support <span className="text-bloompink">They Remember</span>
            </h2>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              Your support during this vulnerable time can make a lasting difference. 
              Download our resources to share with your family.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/resources/helpful-vs-harmful-checklist" variant="pink" size="lg">
                Download Family Guide
              </Button>
              <Button href="/resources/family-boundaries-guide" variant="outline" size="lg">
                Boundaries Guide
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
            source="family_support_page"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}