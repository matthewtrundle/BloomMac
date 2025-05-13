import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import AdPageLayout from '@/components/layout/AdPageLayout';

export default function PostpartumPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Send email via API
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name || 'Postpartum Form Lead', 
          email, 
          message: message || 'Interested in postpartum services' 
        }),
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      // Fire GA4 event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lead_form_submit', {
          event_category: 'lead',
          event_label: 'postpartum_landing_page'
        });
      }
      
      // Extract keyword from URL if present or use default
      const urlParams = typeof window !== 'undefined' ? 
        new URLSearchParams(window.location.search) : 
        new URLSearchParams();
      const keyword = urlParams.get('keyword') || '[keyword]';
      
      // Redirect to thank-you page with UTM parameters
      window.location.href = `/ads/thank-you?utm_source=google&utm_medium=cpc&utm_campaign=postpartum&utm_term=${keyword}`;
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to submit form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AdPageLayout
      title="Postpartum Therapy in North Austin | Bloom Psychology"
      description="Get same-week virtual or in-person support from licensed perinatal specialists at Bloom Psychology North Austin."
    >
      {/* Page Container */}
      <div className="flex flex-col">
        
        {/* Hero Section */}
        <section className="bg-bloom-pink-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-6xl mx-auto">
              {/* Logo (Left Side) */}
              <div className="md:w-2/5 mb-8 md:mb-0">
                <div className="relative mx-auto md:mx-0 w-64 h-64 md:w-full md:h-96">
                  <Image
                    src="/images/Logo/BLOOM-LOGO.png"
                    alt="Bloom Psychology Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Content (Right Side) */}
              <div className="md:w-3/5 md:pl-8 text-center md:text-left">
                <h1 className="font-playfair text-4xl md:text-5xl text-bloom mb-6">
                  Specialized mental health care for women and moms in North Austin.
                </h1>
                
                <p className="text-xl text-bloom/80 mb-8">
                  Get same-week virtual or in-person support from licensed perinatal specialists.
                </p>
                
                {/* Lead Form */}
                <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto md:mx-0">
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                      {submitError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="sr-only">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="sr-only">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Additional message (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="pink"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Book a Free Consult'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-bloom-pink-100 rounded-full">
                  {/* Icon placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Same-Week Appointments</h3>
                <p className="text-bloom/70">Get the help you need without waiting weeks or months.</p>
              </div>
              
              {/* Benefit 2 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-bloom-pink-100 rounded-full">
                  {/* Icon placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Perinatal Experts</h3>
                <p className="text-bloom/70">Specialized care from therapists trained in maternal mental health.</p>
              </div>
              
              {/* Benefit 3 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-bloom-pink-100 rounded-full">
                  {/* Icon placeholder */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Virtual & In-Person</h3>
                <p className="text-bloom/70">Flexible options to fit your schedule and comfort level.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-4xl text-bloompink mb-6">"</div>
              <p className="text-xl md:text-2xl text-bloom italic mb-6">
                When I was struggling after my baby was born, Bloom Psychology was the lifeline I needed. 
                Their specialized postpartum care helped me feel like myself again and find joy in motherhood.
              </p>
              <p className="text-bloompink font-medium">– Sarah, Austin mom</p>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-playfair text-center text-bloom mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-10 h-10 flex items-center justify-center bg-bloompink rounded-full text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Choose a Therapist</h3>
                <p className="text-bloom/70">Browse profiles of our specialized perinatal mental health experts.</p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-10 h-10 flex items-center justify-center bg-bloompink rounded-full text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Schedule within 24hrs</h3>
                <p className="text-bloom/70">Book your appointment quickly and easily online.</p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="mb-4 mx-auto w-10 h-10 flex items-center justify-center bg-bloompink rounded-full text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-bloom mb-2">Feel Supported</h3>
                <p className="text-bloom/70">Get the specialized care you deserve during this important time.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust Section */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <p className="text-sm text-bloom/60 flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your information is secure. HIPAA compliant.
              </p>
              <Link href="/privacy-policy" className="text-xs text-bloom/50 hover:text-bloompink mt-2 inline-block">
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
        
        {/* Minimal Footer */}
        <footer className="py-4 bg-bloom text-white text-sm mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/70 text-xs">
              Bloom Psychology North Austin • 13706 N Highway 183, Suite 114, Austin, TX 78750 • (512) 898-9510
            </p>
          </div>
        </footer>
      </div>
    </AdPageLayout>
  );
}

// Add global gtag type definition
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}
