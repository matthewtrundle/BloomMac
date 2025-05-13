import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import AdPageLayout from '@/components/layout/AdPageLayout';

export default function PostpartumPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Added phone field
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send email via dedicated postpartum API endpoint
      const res = await fetch('/api/send-postpartum-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Postpartum Form Lead',
          email,
          phone,
          message: message || 'Interested in postpartum services'
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Form submission error:', result);
        throw new Error(result.error || 'Form submission failed');
      }

      console.log('Form submission successful:', result);
      setSubmitSuccess(true);

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

      // Redirect to thank-you page with UTM parameters after a brief delay to show success message
      setTimeout(() => {
        window.location.href = `/ads/thank-you?utm_source=google&utm_medium=cpc&utm_campaign=postpartum&utm_term=${keyword}`;
      }, 1500);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to submit form. Please try again or call us directly at (512) 898-9510.');
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
        
        {/* Hero Section - New Design with Gradient Background */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-white via-bloom-pink-50 to-bloom-pink-100">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-bloom-pink-100 rounded-full filter blur-3xl opacity-30 -z-10 transform translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-bloom-pink-200 rounded-full filter blur-2xl opacity-20 -z-10 transform -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-6xl mx-auto">
              {/* Left Column - Content */}
              <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
                <Link href="/" className="relative mb-6 inline-block transition-opacity hover:opacity-80">
                  <Image
                    src="/images/Logo/BLOOM-LOGO.png"
                    alt="Bloom Psychology Logo"
                    width={180}
                    height={80}
                    className="object-contain"
                  />
                </Link>
                
                <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-bloom mb-6 leading-tight">
                  Find Relief from Postpartum Anxiety
                </h1>
                
                <p className="text-xl md:text-2xl text-bloom/80 mb-6">
                  You're not alone, and you don't have to suffer in silence.
                </p>
                
                <p className="text-lg text-bloom/70 mb-8 max-w-xl">
                  Get same-week virtual or in-person support from North Austin's specialized perinatal mental health experts.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center">
                    <div className="text-bloompink mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Licensed Specialists</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-bloompink mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Same-Week Appointments</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-bloompink mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>In-Person & Virtual Options</span>
                  </div>
                </div>
                
                {/* Testimonial Highlight */}
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-lg border-l-4 border-bloompink shadow-sm mb-4 md:hidden">
                  <p className="text-bloom/80 italic text-sm">
                    "Bloom Psychology was the lifeline I needed after my baby was born. Their specialized care helped me feel like myself again."
                  </p>
                  <p className="text-bloompink text-sm font-medium mt-2">– Sarah, Austin mom</p>
                </div>
              </div>
              
              {/* Right Column - Form Card */}
              <div className="lg:w-1/2 lg:pl-6">
                <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden transform transition-all hover:shadow-2xl">
                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-bloom-pink-100 rounded-bl-full opacity-30"></div>
                  
                  <h2 className="font-playfair text-2xl text-bloom mb-2">Book Your Free Consultation</h2>
                  <p className="text-bloom/60 mb-6">Complete this form for a same-week appointment</p>
                  
                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md text-sm">
                      <p className="font-medium">There was a problem with your submission:</p>
                      <p>{submitError}</p>
                    </div>
                  )}
                  
                  {submitSuccess ? (
                    <div className="mb-6 p-6 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-md text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium text-lg">Thank you!</p>
                      <p>Your consultation request has been received. We'll contact you shortly to schedule your appointment.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-bloom/70 mb-1">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-bloom/70 mb-1">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-bloom/70 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-bloom/70 mb-1">Message (Optional)</label>
                        <textarea
                          id="message"
                          name="message"
                          placeholder="Tell us briefly about your situation"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bloompink focus:border-transparent transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="pink"
                        size="lg"
                        fullWidth
                        disabled={isSubmitting}
                        className="mt-4 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? 'Processing...' : 'Book My Free Consultation →'}
                      </Button>
                      <p className="text-xs text-center text-bloom/50 mt-4">
                        By submitting this form, you agree to our{' '}
                        <Link href="/privacy-policy" className="text-bloompink hover:underline">
                          privacy policy
                        </Link>
                        . Your information is secure and confidential.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="hidden md:block p-6 bg-bloom-pink-50 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="text-4xl text-bloompink mr-4">"</div>
                  <div>
                    <p className="text-xl text-bloom/80 italic">
                      When I was struggling after my baby was born, Bloom Psychology was the lifeline I needed. 
                      Their specialized postpartum care helped me feel like myself again and find joy in motherhood.
                    </p>
                    <p className="text-bloompink font-medium mt-3">– Sarah, Austin mom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section - Redesigned */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-playfair text-center text-bloom mb-3">How We Can Help</h2>
            <p className="text-bloom/70 text-center max-w-3xl mx-auto mb-12">
              Our specialized approach to postpartum anxiety and depression addresses your unique needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
                <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair text-bloom mb-3 text-center">Same-Week Support</h3>
                <p className="text-bloom/70 text-center">
                  We understand that when you're struggling, waiting weeks for help isn't an option. We prioritize quick access to care.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
                <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair text-bloom mb-3 text-center">Specialized Expertise</h3>
                <p className="text-bloom/70 text-center">
                  Our therapists have advanced training in perinatal mental health and understand the unique challenges of new motherhood.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
                <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair text-bloom mb-3 text-center">Comfort & Convenience</h3>
                <p className="text-bloom/70 text-center">
                  Choose the setting that works best for you—whether that's virtual sessions from home or in-person care at our North Austin office.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Process Section - Redesigned */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-playfair text-center text-bloom mb-3">Your Path to Healing</h2>
            <p className="text-bloom/70 text-center max-w-3xl mx-auto mb-12">
              A simple, supportive process to help you start feeling better
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-8 relative">
                {/* Connection Line */}
                <div className="hidden md:block absolute top-10 bottom-10 left-[43px] w-1 bg-bloom-pink-100 rounded-full z-0"></div>
                
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-shrink-0 w-20 h-20 bg-bloom-pink-100 rounded-full flex items-center justify-center text-bloompink font-bold text-2xl border-4 border-white shadow-md mx-auto md:mx-0">
                    1
                  </div>
                  <div className="flex-grow bg-gray-50 p-6 rounded-lg shadow-sm md:mt-4">
                    <h3 className="text-xl font-bold text-bloom mb-2">Free Consultation</h3>
                    <p className="text-bloom/70">
                      Complete the form on this page to request your free 15-minute phone consultation. We'll get to know your needs and answer your questions.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-shrink-0 w-20 h-20 bg-bloom-pink-100 rounded-full flex items-center justify-center text-bloompink font-bold text-2xl border-4 border-white shadow-md mx-auto md:mx-0">
                    2
                  </div>
                  <div className="flex-grow bg-gray-50 p-6 rounded-lg shadow-sm md:mt-4">
                    <h3 className="text-xl font-bold text-bloom mb-2">Personalized Plan</h3>
                    <p className="text-bloom/70">
                      During your first session, we'll develop a customized treatment approach that addresses your specific concerns and goals.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-shrink-0 w-20 h-20 bg-bloom-pink-100 rounded-full flex items-center justify-center text-bloompink font-bold text-2xl border-4 border-white shadow-md mx-auto md:mx-0">
                    3
                  </div>
                  <div className="flex-grow bg-gray-50 p-6 rounded-lg shadow-sm md:mt-4">
                    <h3 className="text-xl font-bold text-bloom mb-2">Begin Healing</h3>
                    <p className="text-bloom/70">
                      Start your journey with flexible in-person or virtual sessions. Our evidence-based approaches help you find relief and reconnect with joy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section - New Addition */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-playfair text-center text-bloom mb-3">Commonly Asked Questions</h2>
            <p className="text-bloom/70 text-center max-w-3xl mx-auto mb-12">
              Answers to questions you may have about postpartum mental health care
            </p>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-5">
                <h3 className="text-xl font-medium text-bloom">How do I know if I need therapy for postpartum anxiety?</h3>
                <p className="mt-2 text-bloom/70">
                  If you're experiencing persistent worry, racing thoughts, physical symptoms like tension or heart racing, or if anxiety is interfering with your daily life or enjoyment of your baby, it may be time to seek support. Many new moms benefit from therapy even with milder symptoms.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-xl font-medium text-bloom">Can I bring my baby to therapy sessions?</h3>
                <p className="mt-2 text-bloom/70">
                  Yes! Our practice is baby-friendly. You're welcome to bring your baby to in-person sessions, and virtual sessions make it easy to fit therapy into your day without arranging childcare.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-xl font-medium text-bloom">How long will therapy last?</h3>
                <p className="mt-2 text-bloom/70">
                  Every mother's journey is unique. Many women experience significant improvement within 8-12 sessions, while others benefit from longer-term support. We'll work together to determine what's best for your specific situation.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button
                href="#top"
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
        
        {/* Trust Badges - New Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-6 md:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-bloom-pink-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-bloom/60 text-sm">HIPAA Compliant</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bloom-pink-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-bloom/60 text-sm">Secure & Confidential</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bloom-pink-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-bloom/60 text-sm">Licensed Professionals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bloom-pink-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-bloom/60 text-sm">Insurance Accepted</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer with CTA */}
        <footer className="py-8 bg-bloom text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-playfair text-2xl mb-4">Ready to feel like yourself again?</h2>
            <p className="mb-6 text-white/80 max-w-2xl mx-auto">
              You don't have to navigate this journey alone. Take the first step toward healing today.
            </p>
            <Button
              href="#top"
              variant="pink"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mb-8"
            >
              Book Your Free Consultation Now
            </Button>
            <p className="text-white/70 text-xs">
              Bloom Psychology North Austin • 13706 N Highway 183, Suite 114, Austin, TX 78750 • (512) 898-9510
            </p>
            <p className="text-white/50 text-xs mt-2">
              <Link href="/" className="hover:text-white/80 mr-4">
                Home
              </Link>
              <Link href="/privacy-policy" className="hover:text-white/80">
                Privacy Policy
              </Link>
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