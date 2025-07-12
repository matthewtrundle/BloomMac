'use client';

import React from 'react';
import { Award, Users, Shield, Clock } from 'lucide-react';

interface TrustBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export default function TrustBadge({ 
  variant = 'compact',
  className = '' 
}: TrustBadgeProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-6 text-sm text-gray-600 ${className}`}>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>Dr. Jana Rundle, Psy.D.</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>500+ mothers helped</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-sage-50 rounded-lg">
          <Award className="w-5 h-5 text-sage-600" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">Dr. Jana Rundle</p>
            <p className="text-gray-600">Psy.D., PMH-C</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-sage-50 rounded-lg">
          <Users className="w-5 h-5 text-sage-600" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">500+ Mothers</p>
            <p className="text-gray-600">Supported since 2019</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-sage-50 rounded-lg">
          <Shield className="w-5 h-5 text-sage-600" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">Evidence-Based</p>
            <p className="text-gray-600">Proven methods</p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-gradient-to-br from-sage-50 to-white rounded-xl p-6 border border-sage-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Why Mothers Trust Us
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Award className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Expert Leadership</h4>
            <p className="text-sm text-gray-600 mt-1">
              Dr. Jana Rundle, Psy.D., PMH-C<br />
              Licensed Psychologist & Perinatal Specialist
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Users className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Proven Impact</h4>
            <p className="text-sm text-gray-600 mt-1">
              500+ mothers supported<br />
              97% program completion rate
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Shield className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Evidence-Based Care</h4>
            <p className="text-sm text-gray-600 mt-1">
              Research-backed approaches<br />
              Continuously updated content
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Clock className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Established Practice</h4>
            <p className="text-sm text-gray-600 mt-1">
              Serving families since 2019<br />
              Austin's trusted resource
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-sage-100">
        <p className="text-xs text-gray-500 text-center">
          All programs are secure, confidential, and designed with your privacy in mind
        </p>
      </div>
    </div>
  );
}