'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Course data (same as in course detail page)
const courseData: Record<string, any> = {
  'postpartum-wellness-foundations': {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    price: 197,
    originalPrice: 297,
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp'
  },
  'anxiety-management-new-moms': {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    price: 127,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp'
  },
  'partner-support-bootcamp': {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    price: 97,
    image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp'
  }
};

// Discount codes configuration
const DISCOUNT_CODES: Record<string, { percentage: number; description: string }> = {
  'WELCOME25': { percentage: 25, description: 'Welcome discount' },
  'BLOOM50': { percentage: 50, description: 'Special offer' },
  'BETAACCESS': { percentage: 100, description: 'Beta access' },
  'FRIEND25': { percentage: 25, description: 'Friend referral' },
  'FOUNDER50': { percentage: 50, description: 'Founding member' }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number; description: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  useEffect(() => {
    if (courseId && courseData[courseId]) {
      setCourse(courseData[courseId]);
    }
  }, [courseId]);

  const applyDiscountCode = () => {
    const code = discountCode.trim().toUpperCase();
    setDiscountError('');
    
    if (!code) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount({
        code,
        ...DISCOUNT_CODES[code]
      });
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
      setAppliedDiscount(null);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const calculateTotal = () => {
    if (!course) return 0;
    const basePrice = course.price;
    if (appliedDiscount) {
      return Math.round(basePrice * (1 - appliedDiscount.percentage / 100));
    }
    return basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/course-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          // In production, include Stripe payment token here
          paymentToken: 'demo_token',
          discountCode: appliedDiscount?.code,
          discountPercentage: appliedDiscount?.percentage,
          finalPrice: calculateTotal()
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to success page with the enrollment ID
        window.location.href = `/courses/purchase-success?enrollment=${result.enrollmentId}&course=${course.id}`;
      } else {
        alert(result.error || 'Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">No course selected</h1>
          <Link href="/courses" className="text-bloompink hover:underline">
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-playfair text-center mb-12">Complete Your Enrollment</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="flex gap-4 mb-6 pb-6 border-b">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{course.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-bloompink">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-sm text-bloom-dark/40 line-through">${course.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-bloom-dark/70">Subtotal</span>
                      <span>${course.price}</span>
                    </div>
                    {course.originalPrice && !appliedDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Sale Discount</span>
                        <span>-${course.originalPrice - course.price}</span>
                      </div>
                    )}
                    
                    {/* Discount Code Section */}
                    {!appliedDiscount ? (
                      <div className="border-t pt-3">
                        <label className="block text-sm font-medium mb-2">Discount Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bloompink focus:border-bloompink"
                          />
                          <button
                            type="button"
                            onClick={applyDiscountCode}
                            className="px-4 py-2 bg-bloom-sage text-white rounded-lg text-sm hover:bg-bloom-sage-dark transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {discountError && (
                          <p className="text-red-600 text-xs mt-1">{discountError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center text-green-600">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {appliedDiscount.description}
                          </span>
                          <span>-{appliedDiscount.percentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-bloom-dark/60 mt-1">
                          <span>Code: {appliedDiscount.code}</span>
                          <button
                            type="button"
                            onClick={removeDiscount}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-bloompink">${calculateTotal()}</span>
                      </div>
                      {appliedDiscount && appliedDiscount.percentage === 100 && (
                        <p className="text-xs text-green-600 mt-1">Free Beta Access!</p>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Checkout Form */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-white rounded-xl shadow-soft p-8">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
                      
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-bloompink"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-bloompink"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-bloompink"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <p className="text-xs text-bloom-dark/60 mt-1">
                          You'll use this to access your course
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-bloompink"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
                      
                      {/* Stripe Elements would go here in production */}
                      <div className="bg-bloom-sage-50 rounded-lg p-8 text-center">
                        <svg className="w-16 h-16 text-bloom-sage mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="text-bloom-dark/70">
                          In production, secure payment processing via Stripe would appear here
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          className="mt-1"
                          checked={formData.agreeToTerms}
                          onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                        />
                        <span className="text-sm text-bloom-dark/70">
                          I agree to the <Link href="/terms" className="text-bloompink hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-bloompink hover:underline">Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading || !formData.agreeToTerms}
                      className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                        loading || !formData.agreeToTerms
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-bloompink hover:bg-bloom-pink-dark'
                      }`}
                    >
                      {loading ? 'Processing...' : `Complete Purchase - $${calculateTotal()}`}
                    </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-bloom-dark/60 mb-2">
                      Secure checkout powered by
                    </p>
                    <div className="flex justify-center items-center gap-4">
                      <svg className="h-8 text-bloom-dark/40" viewBox="0 0 60 25" fill="currentColor">
                        <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-3.06 9.64V5.57h-4.12v14.44h4.12v-6.94c0-2.55 1.85-3.5 3.48-3.35v-4.2c-1.48-.2-3.02.47-3.48 1zM13.25 8.89c-.83-.4-1.65-.58-2.7-.58-.97 0-1.44.33-1.44.74 0 1.64 4.53.83 4.53 5.33 0 2.58-2.33 3.92-5.08 3.92a7.63 7.63 0 0 1-3.91-.94v-3.6c1.1.62 2.37 1.01 3.6 1.01 1.17 0 1.64-.4 1.64-.88 0-1.83-4.43-.96-4.43-5.25 0-2.4 2.06-3.84 4.82-3.84 1.48 0 2.68.3 3.74.76v3.33zm-11.7 11.3L6.33 20.1l-4.72-14.53h4.35l.63 3.83 1.41 8.64h.08l1.4-8.65.64-3.82h4.34l-4.72 14.53h-4.79z"/>
                      </svg>
                      <span className="text-bloom-dark/40">•</span>
                      <span className="text-sm text-bloom-dark/40">128-bit SSL Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-4 mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">
                  <div className="bg-white rounded-xl shadow-soft p-8">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}