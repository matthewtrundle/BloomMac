import React from 'react';
import { Metadata } from 'next';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: '"Am I Okay?" Mental Health Self-Assessment | Bloom Psychology',
  description: 'A gentle self-assessment checklist to help you check in with your mental health and recognize when professional support might be helpful.',
  keywords: ['mental health assessment', 'self assessment', 'mental health checklist', 'therapy assessment', 'am I okay'],
  openGraph: {
    title: '"Am I Okay?" Mental Health Self-Assessment',
    description: 'Check in with yourself using our gentle mental health self-assessment guide.',
    images: ['/images/Hero/Hero3.png'],
  },
};

export default function SelfAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bloom-light via-white to-bloom-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            The "Am I Okay?" Checklist
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            A gentle way to check in with yourself and your mental health
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Sometimes it's hard to know when what we're experiencing is "normal stress" or when it might be time 
              to reach out for support. This gentle self-assessment is designed to help you check in with yourself 
              and recognize patterns that might benefit from professional care.
            </p>
            
            <div className="bg-bloom-light rounded-lg p-6 my-8">
              <p className="text-gray-700 mb-0">
                <strong>Remember:</strong> This is not a diagnostic tool. It's simply a way to reflect on your 
                experiences and feelings. Trust your instincts—if something feels off, it's worth exploring with 
                a professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Sections */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Emotional Wellbeing */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Heart className="w-6 h-6 text-bloom-accent mr-3" />
              Emotional Wellbeing
            </h2>
            
            <p className="text-gray-600 mb-6">Check any that apply to you most days:</p>
            
            <div className="space-y-4">
              {[
                'I feel sad, empty, or hopeless more often than not',
                'I've lost interest in activities I used to enjoy',
                'I feel anxious, worried, or on edge frequently',
                'My emotions feel out of control or overwhelming',
                'I feel numb or disconnected from my feelings',
                'I experience intense mood swings that affect my daily life',
                'I feel irritable or angry more than usual',
                'I have thoughts of self-harm or that life isn't worth living'
              ].map((item, index) => (
                <label key={index} className="flex items-start cursor-pointer group">
                  <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                  <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Physical Symptoms */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-bloom-accent mr-3" />
              Physical Symptoms
            </h2>
            
            <p className="text-gray-600 mb-6">Notice any of these physical experiences:</p>
            
            <div className="space-y-4">
              {[
                'Significant changes in sleep (too much or too little)',
                'Changes in appetite or weight',
                'Persistent fatigue or low energy',
                'Unexplained aches, pains, or physical discomfort',
                'Racing heart or shortness of breath when anxious',
                'Difficulty concentrating or making decisions',
                'Restlessness or feeling slowed down',
                'Frequent headaches or tension'
              ].map((item, index) => (
                <label key={index} className="flex items-start cursor-pointer group">
                  <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                  <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Daily Life Impact */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 text-bloom-accent mr-3" />
              Daily Life Impact
            </h2>
            
            <p className="text-gray-600 mb-6">Consider how your feelings affect your daily life:</p>
            
            <div className="space-y-4">
              {[
                'Difficulty maintaining relationships with family or friends',
                'Challenges at work or school due to how I'm feeling',
                'Avoiding social situations or activities',
                'Difficulty keeping up with daily responsibilities',
                'Using alcohol, drugs, or other behaviors to cope',
                'Feeling isolated or withdrawing from others',
                'Experiencing conflicts more frequently',
                'Finding it hard to care for myself or others'
              ].map((item, index) => (
                <label key={index} className="flex items-start cursor-pointer group">
                  <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                  <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Life Changes */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Life Changes & Stressors</h2>
            
            <p className="text-gray-600 mb-6">Recent or ongoing life situations that might be affecting you:</p>
            
            <div className="space-y-4">
              {[
                'Major life transitions (job, relationship, moving)',
                'Loss of a loved one or pet',
                'Pregnancy or postpartum',
                'Health issues or chronic illness',
                'Financial stress or job loss',
                'Relationship difficulties or breakup',
                'Family conflicts or caregiving stress',
                'Trauma or difficult past experiences resurfacing'
              ].map((item, index) => (
                <label key={index} className="flex items-start cursor-pointer group">
                  <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                  <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Your Responses Mean */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-bloom-light to-purple-100 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">What Your Responses Mean</h2>
          
          <div className="space-y-6 text-gray-700">
            <div className="bg-white/80 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">If you checked a few boxes:</h3>
              <p>You might be experiencing normal life stress. Consider incorporating self-care practices, 
              reaching out to friends, or trying stress-reduction techniques.</p>
            </div>
            
            <div className="bg-white/80 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">If you checked several boxes:</h3>
              <p>You may be going through a challenging time that could benefit from professional support. 
              Therapy can provide tools and strategies to help you navigate these difficulties.</p>
            </div>
            
            <div className="bg-white/80 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">If you checked many boxes or any concerning items:</h3>
              <p>It's important to reach out for professional help soon. You don't have to go through this alone, 
              and support is available.</p>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-lg mb-3 text-red-800">
                If you're having thoughts of self-harm:
              </h3>
              <p className="text-red-700">Please reach out for help immediately:</p>
              <ul className="mt-3 space-y-2 text-red-700">
                <li>• National Suicide Prevention Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
                <li>• Emergency: 911</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Take the Next Step?</h2>
          <p className="text-lg text-gray-600 mb-8">
            You've taken an important step by checking in with yourself. If you're ready to explore 
            professional support, we're here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/book" variant="pink" size="lg">
              Schedule a Consultation
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>

      {/* Download Version */}
      <section className="px-4 py-12 pb-24">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Want a printable version?
          </h3>
          <p className="text-gray-600 mb-6">
            Download this checklist as a PDF to use anytime you need to check in with yourself.
          </p>
          <Button variant="secondary">
            Download PDF Version
          </Button>
        </div>
      </section>
    </div>
  );
}