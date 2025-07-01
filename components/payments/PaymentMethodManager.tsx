'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@supabase/auth-helpers-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { getUserPaymentMethods, saveUserPaymentMethod, PaymentMethod } from '@/lib/payment-management';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethodManagerProps {
  onPaymentMethodAdded?: () => void;
  showAddForm?: boolean;
}

export default function PaymentMethodManager({ 
  onPaymentMethodAdded,
  showAddForm = false 
}: PaymentMethodManagerProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodContent 
        onPaymentMethodAdded={onPaymentMethodAdded}
        showAddForm={showAddForm}
      />
    </Elements>
  );
}

function PaymentMethodContent({ 
  onPaymentMethodAdded,
  showAddForm 
}: PaymentMethodManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(showAddForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useUser();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const methods = await getUserPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !user) {
      setError('Payment system not ready');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Save to our database
      const isFirstMethod = paymentMethods.length === 0;
      const result = await saveUserPaymentMethod(
        user.id, 
        paymentMethod.id, 
        isFirstMethod // Set as default if it's the first method
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh the list
      await fetchPaymentMethods();
      setShowForm(false);
      
      if (onPaymentMethodAdded) {
        onPaymentMethodAdded();
      }

    } catch (error) {
      console.error('Error adding payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
        <p className="mt-2 text-bloom-dark/60">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Existing Payment Methods */}
      {paymentMethods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-bloom-dark mb-4">
            Your Payment Methods
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        </div>
      )}

      {/* Add New Payment Method */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 px-4 border-2 border-dashed border-bloom-sage/30 rounded-lg text-bloom-sage hover:border-bloom-sage/60 hover:bg-bloom-sage/5 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Payment Method
          </div>
        </button>
      )}

      {/* Add Payment Method Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-bloom-sage-50/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-bloom-dark mb-4">
                Add New Payment Method
              </h3>
              
              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Card Information
                  </label>
                  <div className="p-3 border border-bloom-sage/20 rounded-lg bg-white">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#374151',
                            '::placeholder': {
                              color: '#9CA3AF',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving || !stripe}
                    className="flex-1 py-3 px-4 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Adding...' : 'Add Payment Method'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-3 text-bloom-dark/60 hover:text-bloom-dark transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-4 text-xs text-bloom-dark/60">
                <p className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your payment information is securely encrypted and processed by Stripe.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Payment Method Card Component
function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  return (
    <div className={`p-4 border rounded-lg ${
      method.isDefault 
        ? 'border-bloom-sage bg-bloom-sage-50/30' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Card Icon */}
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            {method.card && (
              <span className="text-xs font-medium uppercase">
                {method.card.brand}
              </span>
            )}
          </div>
          
          {/* Card Details */}
          <div>
            <p className="font-medium text-bloom-dark">
              {method.card && `•••• •••• •••• ${method.card.last4}`}
            </p>
            <p className="text-sm text-bloom-dark/60">
              {method.card && `Expires ${method.card.expMonth}/${method.card.expYear}`}
            </p>
          </div>
        </div>

        {/* Default Badge */}
        {method.isDefault && (
          <span className="px-2 py-1 bg-bloom-sage text-white text-xs rounded-full">
            Default
          </span>
        )}
      </div>
    </div>
  );
}