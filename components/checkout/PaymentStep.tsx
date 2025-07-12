'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CreditCard, Calendar, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

interface PaymentStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  checkoutData: any;
  updateCheckoutData: (data: any) => void;
}

export default function PaymentStep({ 
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
      // Here you would integrate with Stripe
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
            Payment Information
          </h2>
          <p className="text-gray-600">
            Choose your payment method and complete your order
          </p>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              You'll use this email to access your purchases
            </p>
          </div>
        </div>

        {/* Payment Plan Options */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Options</h3>
          
          <div className="space-y-3">
            {/* Pay in Full */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
              <input
                type="radio"
                name="paymentPlan"
                value="full"
                checked={checkoutData.paymentPlan === 'full'}
                onChange={(e) => handlePaymentPlanChange(e.target.value)}
                className="text-purple-600"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Pay in Full</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Save 5%
                    </span>
                  </div>
                  <span className="font-bold text-lg">
                    {formatPrice(Math.round(state.total * 0.95))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  One-time payment with 5% discount
                </p>
              </div>
            </label>

            {/* 2-Payment Plan */}
            {state.total >= 20000 && (
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="paymentPlan"
                  value="2-pay"
                  checked={checkoutData.paymentPlan === '2-pay'}
                  onChange={(e) => handlePaymentPlanChange(e.target.value)}
                  className="text-purple-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">2 Monthly Payments</span>
                    </div>
                    <span className="font-bold text-lg">
                      {formatPrice(calculateMonthlyPayment(state.total, 2))}/month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Split into 2 payments, no interest
                  </p>
                </div>
              </label>
            )}

            {/* 3-Payment Plan */}
            {state.total >= 30000 && (
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="paymentPlan"
                  value="3-pay"
                  checked={checkoutData.paymentPlan === '3-pay'}
                  onChange={(e) => handlePaymentPlanChange(e.target.value)}
                  className="text-purple-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">3 Monthly Payments</span>
                    </div>
                    <span className="font-bold text-lg">
                      {formatPrice(calculateMonthlyPayment(state.total, 3))}/month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Split into 3 payments, no interest
                  </p>
                </div>
              </label>
            )}

            {/* Affirm Option for high-ticket items */}
            {state.total >= 50000 && (
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="paymentPlan"
                  value="affirm"
                  checked={checkoutData.paymentPlan === 'affirm'}
                  onChange={(e) => handlePaymentPlanChange(e.target.value)}
                  className="text-purple-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Extended Payment Plan</span>
                    </div>
                    <span className="font-bold text-lg">
                      From {formatPrice(calculateMonthlyPayment(state.total, 12))}/month
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Flexible terms from 3-24 months via Affirm
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* HSA/FSA Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-1">
            HSA/FSA Eligible
          </h4>
          <p className="text-sm text-blue-700">
            Our courses and counseling services may be eligible for HSA/FSA reimbursement. 
            We'll provide documentation to help with your claims.
          </p>
        </div>

        {/* Terms Agreement */}
        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
              className="mt-1 text-purple-600"
            />
            <span className="text-sm text-gray-700">
              I agree to the <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>. 
              I understand that services may be subject to scheduling availability.
            </span>
          </label>
        </div>

        {/* Order Total */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Today:</span>
            <span className="text-purple-600">
              {checkoutData.paymentPlan === 'full' 
                ? formatPrice(Math.round(state.total * 0.95))
                : checkoutData.paymentPlan === '2-pay'
                ? formatPrice(calculateMonthlyPayment(state.total, 2))
                : checkoutData.paymentPlan === '3-pay'
                ? formatPrice(calculateMonthlyPayment(state.total, 3))
                : formatPrice(state.total)
              }
            </span>
          </div>
          {checkoutData.paymentPlan !== 'full' && checkoutData.paymentPlan !== 'affirm' && (
            <p className="text-sm text-gray-600 mt-2">
              Remaining payments will be automatically charged monthly
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <Shield className="w-4 h-4" />
          <span>Secure 256-bit SSL encryption • PCI DSS compliant</span>
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Order
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}