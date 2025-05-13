'use client';

import React, { useState, FormEvent } from 'react';
import Image from 'next/image';

// UI Components
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import Button from '@/components/ui/Button';

// Metadata is now in a separate file: metadata.ts

export default function ContactPage() {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Form submission handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          service,
          message
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Form submission error:', result);
        throw new Error(result.error || 'Form submission failed');
      }

      console.log('Form submission successful:', result);

      setStatus('success');
      // Clear form fields on success
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setService('');
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-10 bg-white relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="bottom-left"
          opacity={0.05}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
          rotate={45}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <KineticTypography as="h1" animation="letter-by-letter" className="font-playfair text-bloom text-4xl md:text-5xl lg:text-6xl mb-6">
              Contact Us
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-8"></div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Schedule your free 15-minute consultation or reach out with any questions. We're here to help you take the first step on your journey to healing and growth.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form and Info Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <GlassmorphismPanel variant="medium" className="p-8 md:p-10 h-full">
                <h2 className="font-playfair text-2xl text-bloom mb-6">Get in Touch</h2>
                
                {/* Form submission status messages */}
                {status === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                    <p className="font-medium">Thank you for your message!</p>
                    <p>We'll get back to you as soon as possible.</p>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                    <p className="font-medium">Oops! Something went wrong.</p>
                    <p>{errorMessage || 'Please try again or contact us directly by phone.'}</p>
                  </div>
                )}
                
                <form id="contactForm" className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-bloom mb-2 text-sm">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-bloom mb-2 text-sm">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-bloom mb-2 text-sm">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-bloom mb-2 text-sm">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-bloom mb-2 text-sm">Service Interested In</label>
                    <select
                      id="service"
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                    >
                      <option value="">Select a service</option>
                      <option value="women">Therapy for Women</option>
                      <option value="moms">Therapy for Moms</option>
                      <option value="parent">Parent Support</option>
                      <option value="anxiety">Anxiety & Stress Management</option>
                      {/* Telehealth option removed as this service is no longer offered */}
                      <option value="postpartum">Postpartum Depression Support</option>
                      <option value="other">Other (Please specify)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-bloom mb-2 text-sm">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloom-accent/50"
                      placeholder="Please share any specific concerns or questions you have..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-bloom/60 text-center mt-4">
                    Your information is secure and confidential. We'll respond within 1-2 business days.
                  </p>
                </form>
              </GlassmorphismPanel>
            </div>
            
            {/* Contact Information */}
            <div className="flex flex-col gap-8">
              {/* Office Location */}
              <GlassmorphismPanel variant="subtle" className="p-8">
                <h2 className="font-playfair text-2xl text-bloom mb-6">Our Location</h2>
                
                <div className="flex items-start mb-6">
                  <div className="text-bloom-accent mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-bloom">Bloom Psychology North Austin</h3>
                    <p className="text-bloom/70">
                      13706 N Highway 183, Suite 114<br />
                      Austin, Texas 78750
                    </p>
                  </div>
                </div>
                
                {/* Google Maps iframe */}
                <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.1076133481174!2d-97.8045424!3d30.452954299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cc6c16a6abf7%3A0xb7770fa5438d1f6a!2s13706%20N%20Hwy%20183%2C%20Austin%2C%20TX%2078750!5e0!3m2!1sen!2sus!4v1654345789012!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bloom Psychology North Austin office location"
                  ></iframe>
                </div>
              </GlassmorphismPanel>
              
              {/* Contact Details */}
              <GlassmorphismPanel variant="subtle" className="p-8">
                <h2 className="font-playfair text-2xl text-bloom mb-6">Contact Details</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-bloom-accent mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom">Phone</h3>
                      <a href="tel:+15128989510" className="text-bloom hover:text-bloom-accent transition-colors">
                        (512) 898-9510
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-bloom-accent mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom">Email</h3>
                      <a href="mailto:jana@bloompsychologynorthaustin.com" className="text-bloom hover:text-bloom-accent transition-colors break-words">
                        jana@bloompsychologynorthaustin.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-bloom-accent mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom">Office Hours</h3>
                      <p className="text-bloom/70">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Weekend appointments upon request
                      </p>
                    </div>
                  </div>
                </div>
              </GlassmorphismPanel>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <OrganicShape
          variant="circle"
          color="var(--bloom-accent)"
          size="md"
          position="top-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl text-bloom mb-6">
            Ready for a Consultation?
          </h2>
          
          <p className="text-bloom/70 max-w-2xl mx-auto mb-10">
            We offer free 15-minute phone consultations to discuss your needs and determine if we're the right fit for your mental health journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="tel:+15128989510" variant="primary" icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }>
              Call Now
            </Button>
            
            <Button variant="outline" onClick={() => document.getElementById('contactForm')?.scrollIntoView({ behavior: 'smooth' })}>
              Send a Message
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
