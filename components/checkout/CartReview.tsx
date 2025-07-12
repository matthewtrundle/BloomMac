'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Edit3 } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useRouter } from 'next/navigation';

interface CartReviewProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  checkoutData: any;
  updateCheckoutData: (data: any) => void;
}

export default function CartReview({ onNext, isFirstStep }: CartReviewProps) {
  const { state, toggleCart } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const handleEditCart = () => {
    toggleCart();
  };

  const handleContinueShopping = () => {
    router.push('/courses');
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Review Your Order
          </h2>
          <p className="text-gray-600">
            Make sure everything looks correct before proceeding
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {state.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
            >
              {/* Image or Icon */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-purple-100 rounded text-purple-600 flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {item.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.type === 'physical' && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Physical Item
                    </span>
                  )}
                  {item.metadata?.duration && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {item.metadata.duration}
                    </span>
                  )}
                  {item.metadata?.sessionType && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {item.metadata.sessionType.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(state.subtotal)}</span>
            </div>
            
            {state.discounts.map((discount) => (
              <div key={discount.id} className="flex justify-between text-green-600">
                <span>{discount.description}</span>
                <span>
                  -{formatPrice(
                    discount.type === 'fixed' 
                      ? discount.amount 
                      : (state.subtotal * discount.amount / 100)
                  )}
                </span>
              </div>
            ))}

            {state.hasPhysicalItems && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-600">Calculated next step</span>
              </div>
            )}

            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-purple-600">{formatPrice(state.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Special Messages */}
        {state.hasPhysicalItems && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-1">Shipping Information</h4>
            <p className="text-sm text-blue-700">
              Your physical items will be shipped to the address you provide in the next step.
              Estimated delivery: 5-7 business days.
            </p>
          </div>
        )}

        {state.hasServiceItems && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-900 mb-1">Service Booking</h4>
            <p className="text-sm text-green-700">
              After purchase, you'll receive an email with instructions to book your sessions.
              Our team will contact you within 1 business day.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <button
              onClick={handleEditCart}
              className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Cart
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}