import React from 'react';
import { Metadata } from 'next';
import Button from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Am I Okay? Mental Health Self-Assessment | Bloom Psychology',
  description: 'A gentle self-assessment checklist to help you check in with your mental health and recognize when professional support might be helpful.',
  keywords: ['mental health assessment', 'self assessment', 'mental health checklist', 'therapy assessment', 'am I okay'],
  openGraph: {
    title: 'Am I Okay? Mental Health Self-Assessment',
    description: 'Check in with yourself using our gentle mental health self-assessment guide.',
    images: ['/images/Hero/Hero3.png'],
  },
};

export default function SelfAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bloom-light via-white to-bloom-background">
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Am I Okay? Self-Assessment Checklist
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            A gentle way to check in with yourself and your mental health
          </p>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Sometimes it is hard to know when what we are experiencing is normal stress or when it might be time 
              to reach out for support. This gentle self-assessment is designed to help you check in with yourself 
              and recognize patterns that might benefit from professional care.
            </p>
            
            <div className="bg-bloom-light rounded-lg p-6 my-8">
              <p className="text-gray-700 mb-0">
                <strong>Remember:</strong> This is not a diagnostic tool. It is simply a way to reflect on your 
                experiences and feelings. Trust your instincts—if something feels off, it is worth exploring with 
                a professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Heart className="w-6 h-6 text-bloom-accent mr-3" />
              Emotional Wellbeing
            </h2>
            
            <p className="text-gray-600 mb-6">Check any that apply to you most days:</p>
            
            <div className="space-y-4">
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">I feel sad, empty, or hopeless more often than not</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">I have lost interest in activities I used to enjoy</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">I feel anxious, worried, or on edge frequently</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">My emotions feel out of control or overwhelming</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">I feel numb or disconnected from my feelings</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-bloom-accent mr-3" />
              Physical Symptoms
            </h2>
            
            <p className="text-gray-600 mb-6">Notice any of these physical experiences:</p>
            
            <div className="space-y-4">
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">Significant changes in sleep (too much or too little)</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">Changes in appetite or weight</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">Persistent fatigue or low energy</span>
              </label>
              <label className="flex items-start cursor-pointer group">
                <input type="checkbox" className="mt-1 mr-3 w-5 h-5 text-bloom-accent" />
                <span className="text-gray-700 group-hover:text-gray-900">Difficulty concentrating or making decisions</span>
              </label>
            </div>
          </div>
        </div>
      </section>

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
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-lg mb-3 text-red-800">
                If you are having thoughts of self-harm:
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

      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Take the Next Step?</h2>
          <p className="text-lg text-gray-600 mb-8">
            You have taken an important step by checking in with yourself. If you are ready to explore 
            professional support, we are here to help.
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
    </div>
  );
}