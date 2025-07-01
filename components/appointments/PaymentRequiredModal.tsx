'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethodManager from '@/components/payments/PaymentMethodManager';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded: () => void;
  appointmentType: string;
}

export default function PaymentRequiredModal({
  isOpen,
  onClose,
  onPaymentAdded,
  appointmentType
}: PaymentRequiredModalProps) {
  const [step, setStep] = useState<'explanation' | 'payment'>('explanation');

  const handleContinueToPayment = () => {
    setStep('payment');
  };

  const handlePaymentMethodAdded = () => {
    setStep('explanation');
    onPaymentAdded();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {step === 'explanation' && (
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-bloompink to-bloom-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h2 className="text-xl font-semibold text-bloom-dark mb-2">
                  Payment Method Required
                </h2>
                <p className="text-bloom-dark/70">
                  To book your {appointmentType}, we need a payment method on file
                </p>
              </div>

              {/* Explanation */}
              <div className="space-y-4 mb-6">
                <div className="bg-bloom-sage-50/30 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">How it works:</h3>
                  <ul className="space-y-2 text-sm text-bloom-dark/70">
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-0.5">1.</span>
                      <span>Add your payment method securely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-0.5">2.</span>
                      <span>We'll authorize (not charge) $150 when you book</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-0.5">3.</span>
                      <span>Payment is captured 24 hours before your appointment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-0.5">4.</span>
                      <span>Cancel with 24+ hours notice for full refund</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-bloompink/5 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2 flex items-center gap-2">
                    <span>🔒</span>
                    Secure & Private
                  </h3>
                  <p className="text-sm text-bloom-dark/70">
                    Your payment information is encrypted and processed by Stripe. 
                    We never see or store your actual card details.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-bloom-dark/60 hover:text-bloom-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueToPayment}
                  className="flex-1 py-3 px-4 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-bloom-dark">
                  Add Payment Method
                </h2>
                <button
                  onClick={() => setStep('explanation')}
                  className="text-bloom-dark/60 hover:text-bloom-dark"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Payment Form */}
              <Elements stripe={stripePromise}>
                <PaymentMethodManager 
                  showAddForm={true}
                  onPaymentMethodAdded={handlePaymentMethodAdded}
                />
              </Elements>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}