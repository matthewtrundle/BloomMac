'use client';

import { useCart } from '@/lib/cart/cart-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CartSummary from '@/components/cart/CartSummary';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const items = state?.items || [];
  const total = state?.total || 0;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl font-playfair mb-4">Your cart is empty</h1>
          <p className="text-bloom-dark/70 mb-8">Add some courses to get started!</p>
          <Link
            href="/courses"
            className="inline-flex items-center px-6 py-3 bg-bloom-pink text-white rounded-lg hover:bg-bloom-pink-dark transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!customerEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with Stripe checkout
      // For now, just show a success message
      alert('Checkout functionality coming soon! Your cart has been saved.');
      
      // In production, you would:
      // 1. Create a Stripe checkout session
      // 2. Include all cart items
      // 3. Redirect to Stripe
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center text-bloom-dark/70 hover:text-bloom-dark mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          <h1 className="text-4xl font-playfair text-bloom-dark">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                Secure Checkout
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-pink focus:border-bloom-pink"
                          placeholder="your@email.com"
                          required
                        />
                        <p className="text-xs text-bloom-dark/60 mt-1">
                          We'll send your course access to this email
                        </p>
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-bloom-dark mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-pink focus:border-bloom-pink"
                          placeholder="Jane Smith"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-bloom-dark/70">
                        Secure payment processing powered by Stripe
                      </p>
                      <p className="text-sm text-bloom-dark/60 mt-2">
                        You'll be redirected to complete payment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !customerEmail}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-bloom-pink to-bloom-pink-dark text-white rounded-lg font-medium text-lg hover:from-bloom-pink-dark hover:to-bloom-pink transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Complete Purchase
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-bloom-dark/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SSL Encrypted
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CartSummary showCheckoutButton={false} />
              
              {/* Guarantee */}
              <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">
                  30-Day Money Back Guarantee
                </h4>
                <p className="text-sm text-green-700">
                  If you're not completely satisfied with your purchase, we'll refund your money. No questions asked.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}