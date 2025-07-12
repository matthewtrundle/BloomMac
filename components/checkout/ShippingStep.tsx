'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Truck, Package } from 'lucide-react';

interface ShippingStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  checkoutData: any;
  updateCheckoutData: (data: any) => void;
}

export default function ShippingStep({ 
  onNext, 
  onPrevious, 
  isFirstStep, 
  checkoutData, 
  updateCheckoutData 
}: ShippingStepProps) {
  const [formData, setFormData] = useState({
    address: checkoutData.shippingAddress?.address || '',
    city: checkoutData.shippingAddress?.city || '',
    state: checkoutData.shippingAddress?.state || '',
    zipCode: checkoutData.shippingAddress?.zipCode || '',
    country: checkoutData.shippingAddress?.country || 'US',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateCheckoutData({
        shippingAddress: formData,
      });
      onNext();
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shipping Information
          </h2>
          <p className="text-gray-600">
            Where should we send your physical items?
          </p>
        </div>

        {/* Shipping Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Free Shipping Included
              </h3>
              <p className="text-sm text-blue-700">
                We offer free shipping on all orders within the US. 
                Your items will arrive in 5-7 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                ${errors.address ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="123 Main Street"
            />
            {errors.address && (
              <p className="text-red-600 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  ${errors.city ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Austin"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  ${errors.state ? 'border-red-500' : 'border-gray-300'}
                `}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateField('zipCode', e.target.value)}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="78701"
              />
              {errors.zipCode && (
                <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
              {formData.country === 'CA' && (
                <p className="text-xs text-gray-500 mt-1">
                  Additional shipping charges may apply for international orders
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Package Preview */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                What You'll Receive
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Beautifully printed workbook collection</li>
                <li>• Affirmation card deck with Dr. Jana's guidance</li>
                <li>• Self-care journal and tracking sheets</li>
                <li>• Aromatherapy wellness items</li>
                <li>• Everything packaged in a keepsake gift box</li>
              </ul>
            </div>
          </div>
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
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}