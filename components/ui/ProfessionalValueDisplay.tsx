'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ValueItem {
  name: string;
  value: number;
  description?: string;
}

interface ProfessionalValueDisplayProps {
  items: ValueItem[];
  yourPrice: number;
  showPaymentPlans?: boolean;
  className?: string;
}

export default function ProfessionalValueDisplay({
  items,
  yourPrice,
  showPaymentPlans = true,
  className = '',
}: ProfessionalValueDisplayProps) {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const savings = totalValue - yourPrice;
  const savingsPercentage = Math.round((savings / totalValue) * 100);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className={`bg-gradient-to-br from-sage-50 to-white rounded-xl p-6 border border-sage-100 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-1">
        What's Included in Your Investment
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Everything you need for your wellness journey
      </p>
      
      <div className="space-y-3 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-800">{item.name}</span>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500 ml-4">
              {formatPrice(item.value)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-sage-100 pt-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600">Program Value:</span>
          <span className="text-gray-600">{formatPrice(totalValue)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold text-gray-900">Your Investment:</span>
          <div className="text-right">
            <span className="text-2xl font-semibold text-sage-700">
              {formatPrice(yourPrice)}
            </span>
            <div className="text-sm text-green-600 font-medium">
              Save {formatPrice(savings)} ({savingsPercentage}%)
            </div>
          </div>
        </div>
        
        {showPaymentPlans && (
          <div className="bg-sage-50 rounded-lg px-4 py-3 mt-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Flexible payment plans available</span>
              <br />
              Start your journey for as little as ${Math.ceil(yourPrice / 3 / 100)}/month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}