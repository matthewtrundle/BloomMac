'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, Star, Users, Package } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

interface AddOnStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  checkoutData: any;
  updateCheckoutData: (data: any) => void;
}

// Add-on products data
const addOnProducts = {
  workbookReviews: [
    {
      id: 'express-review',
      name: 'Express Workbook Review',
      description: '20-minute video feedback from certified counselor',
      price: 9700, // $97 in cents
      type: 'service' as const,
      duration: '20 minutes',
      provider: 'Certified Counselor',
      turnaround: '3-5 days',
      features: ['Video review', 'Key insights', 'Action steps'],
    },
    {
      id: 'deep-dive-review',
      name: 'Deep Dive Review',
      description: '45-minute comprehensive review with Dr. Jana',
      price: 19700, // $197 in cents
      type: 'service' as const,
      duration: '45 minutes',
      provider: 'Dr. Jana Rundle',
      turnaround: '5-7 days',
      features: ['Video review', 'Written summary', 'Personalized plan'],
      popular: true,
    },
  ],
  physicalProducts: [
    {
      id: 'wellness-box',
      name: 'Postpartum Wellness Box',
      description: 'Beautiful keepsakes and self-care items',
      price: 12700, // $127 in cents
      type: 'physical' as const,
      features: ['Printed workbooks', 'Affirmation cards', 'Self-care journal', 'Aromatherapy roller'],
      shipping: 'Ships in 5-7 days',
    },
  ],
  sessions: [
    {
      id: 'quick-connect-3pack',
      name: 'Quick Connect Sessions',
      description: '3 brief check-in sessions (15 minutes each)',
      price: 29700, // $297 in cents
      type: 'service' as const,
      duration: '15 minutes each',
      provider: 'Certified Counselor',
      features: ['3 sessions included', 'Scheduled at your convenience', 'Perfect for module transitions'],
    },
  ],
  programs: [
    {
      id: 'fast-track-mini',
      name: 'Fast-Track Mini Program',
      description: 'Try our 1:1 program - 3 sessions with Dr. Jana',
      price: 59700, // $597 in cents
      type: 'program' as const,
      duration: '3 sessions',
      provider: 'Dr. Jana Rundle',
      features: ['3 individual sessions', '100% credit toward full program', 'Valid for 30 days'],
      upgrade: true,
    },
  ],
};

export default function AddOnStep({ onNext, onPrevious, isFirstStep }: AddOnStepProps) {
  const { state, addItem } = useCart();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const handleAddOnToggle = (productId: string) => {
    const isSelected = selectedAddOns.includes(productId);
    
    if (isSelected) {
      // Remove from selection and cart
      setSelectedAddOns(prev => prev.filter(id => id !== productId));
      // Remove from cart
      const cartItem = state.items.find(item => item.productId === productId);
      if (cartItem) {
        // This would need a removeItem function
        console.log('Remove item:', cartItem.id);
      }
    } else {
      // Add to selection and cart
      setSelectedAddOns(prev => [...prev, productId]);
      
      // Find the product and add to cart
      const allProducts = [
        ...addOnProducts.workbookReviews,
        ...addOnProducts.physicalProducts,
        ...addOnProducts.sessions,
        ...addOnProducts.programs,
      ];
      
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        addItem({
          type: product.type,
          productId: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: 1,
          metadata: {
            duration: 'duration' in product ? product.duration : undefined,
            provider: 'provider' in product ? product.provider : undefined,
            shippingRequired: product.type === 'physical',
          },
        });
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Users className="w-5 h-5" />;
      case 'physical':
        return <Package className="w-5 h-5" />;
      case 'program':
        return <Star className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const hasCourseInCart = state.items.some(item => item.type === 'course');

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enhance Your Experience
          </h2>
          <p className="text-gray-600">
            Add personalized support and resources to maximize your journey
          </p>
        </div>

        {/* Workbook Reviews */}
        {hasCourseInCart && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Get Personalized Feedback
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {addOnProducts.workbookReviews.map((product) => (
                <div
                  key={product.id}
                  className={`
                    relative border-2 rounded-lg p-6 transition-all cursor-pointer
                    ${
                      selectedAddOns.includes(product.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                    ${product.popular ? 'ring-2 ring-purple-500' : ''}
                  `}
                  onClick={() => handleAddOnToggle(product.id)}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {getIcon(product.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-purple-600">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{product.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-medium">{product.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Turnaround:</span>
                      <span className="font-medium">{product.turnaround}</span>
                    </div>
                  </div>

                  <ul className="space-y-1 text-sm text-gray-600 mb-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`
                      w-full py-2 px-4 rounded-lg font-medium transition-colors
                      ${
                        selectedAddOns.includes(product.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {selectedAddOns.includes(product.id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Physical Products */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Physical Keepsakes
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {addOnProducts.physicalProducts.map((product) => (
              <div
                key={product.id}
                className={`
                  border-2 rounded-lg p-6 transition-all cursor-pointer
                  ${
                    selectedAddOns.includes(product.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleAddOnToggle(product.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getIcon(product.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-purple-600">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-xs text-gray-500">{product.shipping}</div>
                  </div>
                </div>

                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                    w-full py-2 px-4 rounded-lg font-medium transition-colors
                    ${
                      selectedAddOns.includes(product.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {selectedAddOns.includes(product.id) ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            Not interested in add-ons? That's okay! You can always add them later.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

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