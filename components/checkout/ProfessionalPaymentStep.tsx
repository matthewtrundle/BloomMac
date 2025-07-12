'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Heart, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import ConfidenceGuarantee from '@/components/ui/ConfidenceGuarantee';
import TrustBadge from '@/components/ui/TrustBadge';

interface PaymentStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  checkoutData: any;
  updateCheckoutData: (data: any) => void;
}

export default function ProfessionalPaymentStep({ 
  onPrevious, 
  isFirstStep, 
  checkoutData, 
  updateCheckoutData 
}: PaymentStepProps) {
  const { state } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: checkoutData.customerInfo?.email || '',
    firstName: checkoutData.customerInfo?.firstName || '',
    lastName: checkoutData.customerInfo?.lastName || '',
    agreeToTerms: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const calculateMonthlyPayment = (total: number, months: number) => {
    return Math.ceil(total / months);
  };

  const handlePaymentPlanChange = (plan: string) => {
    updateCheckoutData({
      paymentMethod: 'card',
      paymentPlan: plan,
    });
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          paymentPlan: checkoutData.paymentPlan,
          shippingAddress: checkoutData.shippingAddress,
        }),
      });

      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateCheckoutData({
      customerInfo: newFormData,
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Wellness Investment
          </h2>
          <p className="text-gray-600">
            Choose the payment option that works best for your family
          </p>
        </div>

        {/* Trust Badge */}
        <TrustBadge variant="compact" className="mb-8" />

        {/* Customer Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Information</h3>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              You'll use this email to access your programs and resources
            </p>
          </div>
        </div>

        {/* Payment Options - Professional Framing */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Payment Flexibility</h3>
          <p className="text-sm text-gray-600 mb-4">
            We believe wellness support should be accessible. Choose what works for you:
          </p>
          
          <div className="space-y-3">
            {/* Pay in Full with Savings */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-sage-300 transition-colors">
              <input
                type="radio"
                name="paymentPlan"
                value="full"
                checked={checkoutData.paymentPlan === 'full'}
                onChange={(e) => handlePaymentPlanChange(e.target.value)}
                className="text-sage-600"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">One-Time Payment</span>
                    <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                  <span className="font-bold text-lg">
                    {formatPrice(Math.round(state.total * 0.95))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Save 5% when you pay in full today
                </p>
              </div>
            </label>

            {/* Payment Plans */}
            {state.total >= 20000 && (
              <>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-sage-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentPlan"
                    value="2-pay"
                    checked={checkoutData.paymentPlan === '2-pay'}
                    onChange={(e) => handlePaymentPlanChange(e.target.value)}
                    className="text-sage-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">2 Monthly Payments</span>
                      <span className="font-bold text-lg">
                        ${Math.ceil(state.total / 2 / 100)}/month
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      No interest or fees - just flexibility
                    </p>
                  </div>
                </label>

                {state.total >= 30000 && (
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-sage-300 transition-colors">
                    <input
                      type="radio"
                      name="paymentPlan"
                      value="3-pay"
                      checked={checkoutData.paymentPlan === '3-pay'}
                      onChange={(e) => handlePaymentPlanChange(e.target.value)}
                      className="text-sage-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">3 Monthly Payments</span>
                        <span className="font-bold text-lg">
                          ${Math.ceil(state.total / 3 / 100)}/month
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Start your journey for less today
                      </p>
                    </div>
                  </label>
                )}
              </>
            )}
          </div>
        </div>

        {/* Confidence Guarantee */}
        <ConfidenceGuarantee variant="compact" className="mb-6" />

        {/* HSA/FSA Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            HSA/FSA Eligible
          </h4>
          <p className="text-sm text-blue-700">
            Our programs may qualify for HSA/FSA reimbursement. We'll provide 
            documentation to support your claims.
          </p>
        </div>

        {/* Professional Close */}
        <div className="bg-sage-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-rose-500 mt-0.5" />
            <div>
              <p className="text-gray-700 mb-3">
                We understand this is an investment in yourself during a challenging time. 
                We're here to support you every step of the way.
              </p>
              <p className="text-gray-700">
                If you have any questions about whether this program is right for you, 
                please don't hesitate to <a href="/contact" className="text-sage-600 underline">reach out to our team</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
              className="mt-1 text-sage-600"
            />
            <span className="text-sm text-gray-700">
              I agree to the <a href="/terms" className="text-sage-600 hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-sage-600 hover:underline">Privacy Policy</a>. 
              I understand that my information will be kept secure and confidential.
            </span>
          </label>
        </div>

        {/* Investment Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Your Investment Today:</span>
            <span className="text-sage-700">
              {checkoutData.paymentPlan === 'full' 
                ? formatPrice(Math.round(state.total * 0.95))
                : checkoutData.paymentPlan === '2-pay'
                ? `$${Math.ceil(state.total / 2 / 100)}`
                : checkoutData.paymentPlan === '3-pay'
                ? `$${Math.ceil(state.total / 3 / 100)}`
                : formatPrice(state.total)
              }
            </span>
          </div>
          {checkoutData.paymentPlan !== 'full' && checkoutData.paymentPlan !== 'affirm' && (
            <p className="text-sm text-gray-600 mt-2">
              Then ${Math.ceil(state.total / (checkoutData.paymentPlan === '2-pay' ? 2 : 3) / 100)}/month 
              (no interest or fees)
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <Shield className="w-4 h-4" />
          <span>Secure checkout • Your information is protected</span>
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
            onClick={handleCompleteOrder}
            disabled={isProcessing || !formData.agreeToTerms || !formData.email || !formData.firstName || !formData.lastName}
            className="inline-flex items-center gap-2 px-8 py-3 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Your Investment
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}