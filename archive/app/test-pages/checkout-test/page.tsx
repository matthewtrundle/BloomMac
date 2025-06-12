'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CreditCard, CheckCircle, AlertCircle, Loader2, 
  Lock, ArrowRight, X 
} from 'lucide-react';
import { TEST_CARDS, TEST_PRODUCTS } from '@/lib/stripe-test-mode';

export default function TestCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionId = searchParams.get('session_id');
  const courseId = searchParams.get('course');
  const email = searchParams.get('email');
  const amount = searchParams.get('amount');
  
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState(TEST_CARDS.success.number);
  const [selectedCard, setSelectedCard] = useState('success');
  
  const course = courseId ? TEST_PRODUCTS[courseId as keyof typeof TEST_PRODUCTS] : null;

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (selectedCard === 'success') {
      // Simulate successful payment
      try {
        const response = await fetch('/api/stripe/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': 'test_signature'
          },
          body: JSON.stringify({
            type: 'checkout.session.completed',
            data: {
              object: {
                id: sessionId,
                metadata: { courseId, customerEmail: email },
                customer_details: { email },
                payment_intent: `pi_test_${Date.now()}`,
                customer: `cus_test_${Date.now()}`
              }
            }
          })
        });
        
        // Redirect to success page
        router.push(`/courses/purchase-success?session_id=${sessionId}&course_id=${courseId}`);
      } catch (error) {
        console.error('Test payment error:', error);
        alert('Test payment failed. Check console for details.');
        setProcessing(false);
      }
    } else {
      // Simulate failed payment
      alert('Payment declined. Please try a different card.');
      setProcessing(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800">Invalid Checkout Session</h1>
          <p className="text-gray-600 mt-2">This checkout session is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Test Mode Banner */}
      <div className="bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium">
        🧪 TEST MODE - No real payments will be processed
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h1>
            
            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Purchasing as:</p>
              <p className="font-medium text-gray-800">{email}</p>
            </div>

            {/* Test Card Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Test Card
              </label>
              <div className="space-y-3">
                {Object.entries(TEST_CARDS).map(([key, card]) => (
                  <label 
                    key={key}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCard === key 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="testCard"
                      value={key}
                      checked={selectedCard === key}
                      onChange={(e) => {
                        setSelectedCard(e.target.value);
                        setCardNumber(card.number);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedCard === key ? 'border-pink-500' : 'border-gray-300'
                      }`}>
                        {selectedCard === key && (
                          <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-sm">{card.number}</p>
                        <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value="12/34"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value="123"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Test Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ${(parseInt(amount || '0') / 100).toFixed(2)}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a test transaction. No real payment will be processed.
            </p>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                </div>

                {/* Features */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-3">What's included:</p>
                  <ul className="space-y-2">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${(course.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-pink-600">
                      ${(course.amount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Secure test checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}