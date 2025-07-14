'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Loader2, CreditCard, Lock, 
  Check, Star, Clock 
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

interface CoursePurchaseButtonProps {
  courseId: string;
  courseName: string;
  price: number;
  originalPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function CoursePurchaseButton({
  courseId,
  courseName,
  price,
  originalPrice,
  className = '',
  size = 'md',
  variant = 'primary'
}: CoursePurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, toggleCart } = useCart();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600',
    secondary: 'bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
  };

  const handlePurchase = async () => {
    if (!customerEmail.trim()) {
      setShowForm(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Sorry, there was an error processing your purchase. Please try again.');
      setIsLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  if (showForm && !customerEmail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Purchase {courseName}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-pink-600">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Enter your email to proceed to secure checkout
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Your Name"
            />
          </div>

          <button
            onClick={handlePurchase}
            disabled={!customerEmail.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Back
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Lifetime Access</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
        font-semibold rounded-lg transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2 w-full
        shadow-lg hover:shadow-xl
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Buy Now - {formatPrice(price)}
          {originalPrice && (
            <span className="text-sm opacity-75 line-through ml-1">
              {formatPrice(originalPrice)}
            </span>
          )}
        </>
      )}
    </button>
  );
}