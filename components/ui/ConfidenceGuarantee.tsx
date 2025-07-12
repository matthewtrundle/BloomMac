'use client';

import React from 'react';
import { Shield, Heart } from 'lucide-react';

interface ConfidenceGuaranteeProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export default function ConfidenceGuarantee({ 
  variant = 'full',
  className = '' 
}: ConfidenceGuaranteeProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-sage-50 rounded-lg border border-sage-100 ${className}`}>
        <Shield className="w-8 h-8 text-sage-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-900">14-Day Confidence Commitment</h4>
          <p className="text-sm text-gray-600">
            Full refund if the program isn't right for you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-sage-50 to-green-50 rounded-xl p-6 border border-sage-100 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <Shield className="w-8 h-8 text-sage-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Our Confidence Commitment
          </h3>
          
          <p className="text-gray-700 mb-4">
            We're confident in the value of our programs. If within 14 days you feel 
            the program isn't the right fit, we'll provide a full refund and help you 
            find resources that better meet your needs.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>No questions asked refund process</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Keep all downloaded materials</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Personalized resource recommendations</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 italic">
            *Over 97% of mothers complete our programs, but we understand that 
            every journey is unique.
          </p>
        </div>
      </div>
    </div>
  );
}