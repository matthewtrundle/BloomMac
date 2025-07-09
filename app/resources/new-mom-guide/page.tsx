'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Heart, Coffee, Moon, Users, Clock, Sparkles } from 'lucide-react';

export default function NewMomGuidePage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-bloom-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            New Mom's Survival Guide 💜
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Real talk, practical tips, and gentle reminders for the wild ride of new motherhood
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              Hey mama, first things first: <strong>You're doing an amazing job.</strong> Yes, even if the baby 
              just had a blowout, you haven't showered in days, and you cried over spilled breast milk. 
              This guide is your no-judgment zone filled with real advice from someone who gets it.
            </p>
            
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 my-8">
              <p className="text-gray-700 mb-0 font-medium">
                Remember: There's no "perfect" way to be a mom. There's only YOUR way, and that's exactly 
                what your baby needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The First 6 Weeks */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            The First 6 Weeks: Survival Mode
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Coffee className="w-8 h-8 text-bloom-accent mr-3" />
                <h3 className="text-xl font-semibold">Week 1-2: The Blur</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Sleep when the baby sleeps (yes, really)</li>
                <li>• Accept ALL the help offered</li>
                <li>• Eat whatever someone puts in front of you</li>
                <li>• Cry if you need to - hormones are WILD</li>
                <li>• Take photos even if you feel like a mess</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Moon className="w-8 h-8 text-bloom-accent mr-3" />
                <h3 className="text-xl font-semibold">Week 3-4: Finding Rhythm</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Start noticing baby's patterns</li>
                <li>• Try to get outside for 10 minutes</li>
                <li>• Lower your standards for EVERYTHING</li>
                <li>• Connect with one friend each day</li>
                <li>• Celebrate small wins (you brushed your teeth!)</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-bloom-accent mr-3" />
                <h3 className="text-xl font-semibold">Week 5-6: Emerging</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• You might feel more human</li>
                <li>• Start gentle movement when cleared</li>
                <li>• It's okay if you still feel overwhelmed</li>
                <li>• Your body is still healing - be patient</li>
                <li>• Ask for what you need</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🚨 Red Flags to Watch For</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Sadness lasting more than 2 weeks</li>
                <li>• Inability to sleep when baby sleeps</li>
                <li>• Scary or intrusive thoughts</li>
                <li>• Feeling disconnected from baby</li>
                <li>• Extreme anxiety or panic</li>
              </ul>
              <p className="mt-4 font-medium">These could signal PPD/PPA - reach out for help!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Care Survival Kit */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Your Self-Care Survival Kit
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-bloom-light rounded-lg p-6 text-center">
              <Clock className="w-12 h-12 text-bloom-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-3">5-Minute Resets</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li>• Deep breathing (4-7-8 technique)</li>
                <li>• Quick shower or face wash</li>
                <li>• Step outside for fresh air</li>
                <li>• Stretch or gentle movement</li>
                <li>• Text a friend who gets it</li>
              </ul>
            </div>
            
            <div className="bg-purple-100 rounded-lg p-6 text-center">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-3">Daily Non-Negotiables</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li>• Drink water (so much water)</li>
                <li>• Take your vitamins</li>
                <li>• Eat actual meals</li>
                <li>• Move your body gently</li>
                <li>• One thing just for you</li>
              </ul>
            </div>
            
            <div className="bg-pink-100 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-3">Village Building</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li>• Join a mom group</li>
                <li>• Accept help without guilt</li>
                <li>• Be specific about needs</li>
                <li>• Connect virtually if needed</li>
                <li>• Find your "3am friend"</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Real Talk: Things No One Tells You
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">About Your Body:</h3>
              <p className="text-gray-700">
                Your body just did something INCREDIBLE. It might not feel like your own right now, 
                and that's normal. Healing takes time. Be gentle with yourself. Your body is not 
                "bouncing back" - it's moving forward after creating life.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">About Your Emotions:</h3>
              <p className="text-gray-700">
                You might feel overwhelming love one minute and wonder what you've done the next. 
                You might grieve your old life while loving your new one. All of these feelings 
                can coexist, and all are valid.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">About Your Relationship:</h3>
              <p className="text-gray-700">
                If you have a partner, your relationship will change. Communication is key, but 
                it's okay if things feel hard right now. You're both learning new roles while 
                sleep-deprived. Grace and patience go a long way.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">About "Bouncing Back":</h3>
              <p className="text-gray-700">
                There's no timeline for feeling "normal" again because you're becoming a new version 
                of yourself. Some days will be harder than others, and that's not moving backward - 
                it's moving through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mantras Section */}
      <section className="px-4 py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Mantras for Tough Moments
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "I am exactly the mother my baby needs",
              "This is temporary, not forever",
              "I am doing the best I can with what I have",
              "It's okay to not enjoy every moment",
              "My needs matter too",
              "I am learning and growing every day",
              "Good enough is perfect",
              "I can do hard things"
            ].map((mantra, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-lg font-medium text-gray-700 italic">"{mantra}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Essential Resources
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Immediate Support:</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Postpartum Support International:</strong> 1-800-PPD-MOMS</li>
                <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                <li><strong>La Leche League:</strong> Breastfeeding support</li>
                <li><strong>Local Mom Groups:</strong> Search Facebook for "[Your City] Moms"</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Helpful Apps:</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Wonder Weeks:</strong> Understanding baby's development</li>
                <li><strong>Huckleberry:</strong> Sleep tracking and tips</li>
                <li><strong>Headspace:</strong> Meditation for new moms</li>
                <li><strong>Peanut:</strong> Connect with other moms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Get Your Free Guide
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Download this complete guide as a beautiful PDF to keep on your phone or print out. 
            Perfect for those 3am moments when you need a reminder that you're doing great.
          </p>
          
          <button 
            onClick={() => setShowModal(true)}
            className="inline-block bg-bloompink hover:bg-bloom-pink-dark text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Get PDF Guide + Weekly Tips
          </button>
          
          <p className="text-sm text-gray-500 mt-4 italic">
            Join our newsletter for the PDF guide plus weekly motherhood support
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-bloom-light to-purple-100 rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            You Don't Have to Do This Alone
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            If you're struggling, reaching out for professional support is a sign of strength, not weakness. 
            We specialize in supporting moms through all stages of motherhood.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/book" variant="pink" size="lg">
              Book a Free Consultation
            </Button>
            <Button href="/services/postpartum-depression-support" variant="outline" size="lg">
              Learn About Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Download Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Get Your Free PDF Guide
            </h3>
            <p className="text-gray-600 mb-6">
              Plus weekly tips and encouragement for your motherhood journey.
            </p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              
              try {
                await fetch('/api/user/newsletter-subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.name,
                    source: 'new_mom_guide_download',
                    metadata: {
                      resourceRequested: 'New Mom Survival Guide PDF'
                    }
                  })
                });
                
                alert('Success! Check your email for the guide and welcome to our community!');
                setShowModal(false);
                setFormData({ name: '', email: '' });
              } catch (error) {
                alert('Something went wrong. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <input
                type="text"
                placeholder="Your first name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bloompink hover:bg-bloom-pink-dark disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Send Me the Guide'}
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}