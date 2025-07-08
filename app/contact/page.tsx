'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import LocationMap from '@/components/LocationMap';

// Analytics
import { analytics } from '@/lib/analytics';

// Metadata is now in a separate file: metadata.ts

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Form submission failed');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      
      // Track successful form submission
      analytics.trackContactForm('/contact', formData.service);
      
      // Fire GA4 event if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'lead',
          event_label: 'contact_page'
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to submit form. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFF]">
      {/* Header area with decorative elements */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-bloom-pink-50 to-transparent z-0"></div>
        
        {/* Decorative shapes */}
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-left"
          opacity={0.04}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
          rotate={45}
        />
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 pt-24 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left side - title and contact info */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <h1 className="font-playfair text-bloom text-3xl md:text-4xl mb-6 animate-fade-in">
              Get In <span className="text-bloompink font-semibold bg-gradient-to-r from-bloompink to-pink-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-[#C63780] to-[#FF9CB9] mb-6 rounded-full"></div>
            
            <p className="text-bloom/70 mb-10">
              Send us a message and we'll get back to you within 24 hours. For immediate scheduling, use our booking page.
            </p>

            {/* Contact card */}
            <GlassmorphismPanel variant="subtle" className="p-6 mb-6">
              <h3 className="font-playfair text-lg text-bloom mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {/* Phone number removed */}
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Email</p>
                    <a href="mailto:jana@bloompsychologynorthaustin.com" className="text-bloompink hover:text-[#B03979] transition-colors font-medium break-words">
                      jana@bloompsychologynorthaustin.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Address</p>
                    <p className="text-bloom">
                      13706 N Highway 183, Suite 114<br />
                      Austin, Texas 78750
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Online Therapy</p>
                    <p className="text-bloom">
                      Available for all of Texas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Hours</p>
                    <p className="text-bloom">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Weekend appointments upon request
                    </p>
                  </div>
                </div>
              </div>
            </GlassmorphismPanel>

            {/* Booking Link */}
            <Link href="/book" className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Your Free Consultation
            </Link>

            {/* FAQ Link */}
            <Link href="/faq" className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Frequently Asked Questions
            </Link>
            
            {/* Location Map (smaller on mobile, hidden by default on mobile to prioritize scheduling) */}
            <div className="hidden md:block mt-6">
              <h3 className="font-playfair text-lg text-bloom mb-4">Our Location</h3>
              <LocationMap height="200px" />
            </div>
          </div>
          
          {/* Right side - Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-playfair text-bloom mb-2">Thank you for your message!</h3>
                  <p className="text-bloom/70 mb-6">We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="text-bloompink hover:text-[#B03979] transition-colors font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-playfair text-2xl text-bloom mb-2">Send us a message</h2>
                  <p className="text-bloom/60 mb-6">Fill out the form below and we'll get back to you soon.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-bloom mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-bloom mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-bloom mb-2">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Service Field */}
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-bloom mb-2">
                        Service of Interest (optional)
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option value="Postpartum Depression Support">Postpartum Depression Support</option>
                        <option value="Anxiety & Stress Management">Anxiety & Stress Management</option>
                        <option value="Therapy for Women">Therapy for Women</option>
                        <option value="Therapy for Moms">Therapy for Moms</option>
                        <option value="Parent Support">Parent Support</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-bloom mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors resize-vertical"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{submitError}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-bloompink hover:bg-[#B03979] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-inter"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>

                    <p className="text-xs text-center text-bloom/50 mt-4">
                      By submitting this form, you agree to our{' '}
                      <Link href="/privacy-policy" className="text-bloompink hover:underline">
                        privacy policy
                      </Link>
                      . Your information is secure and confidential.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-only map section at bottom */}
      <div className="md:hidden bg-white py-12">
        <div className="container mx-auto px-4">
          <h3 className="font-playfair text-2xl text-center text-bloom mb-6">Our Location</h3>
          <div className="max-w-lg mx-auto">
            <LocationMap height="300px" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add global gtag type definition
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}
