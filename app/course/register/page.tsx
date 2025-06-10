'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    postpartumDate: '',
    numberOfChildren: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    hipaaConsent: false,
    termsAccepted: false,
    marketingConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.hipaaConsent) newErrors.hipaaConsent = 'HIPAA consent is required for course participation';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/course/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseId: 'postpartum-wellness-foundations' // Default course
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        router.push('/course/verify-email?email=' + encodeURIComponent(formData.email));
      } else {
        setErrors({ form: data.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-12 px-4 relative overflow-hidden">
      {/* Garden lattice pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="register-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#register-lattice)" />
        </svg>
      </div>
      
      {/* Floating garden elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-bloom-sage/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-300 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-2xl shadow-soft p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair text-bloom-dark mb-4">
              Join Your Wellness Journey
            </h1>
            
            {/* Decorative flower divider */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <svg className="w-5 h-5 text-bloom-sage/50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            
            <p className="text-bloom-dark/70">
              Create your account to access the Postpartum Wellness Foundations course
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{errors.form}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-bloom-sage/10">
              <h2 className="text-lg font-semibold text-bloom-dark border-b border-bloom-sage-200 pb-2">
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-bloom-dark mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-bloom-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-bloom-dark mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-bloom-sage/10">
              <h2 className="text-lg font-semibold text-bloom-dark border-b border-bloom-sage-200 pb-2">
                Create Password
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-bloom-dark mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-bloom-dark mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Maternal Information */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-bloom-sage/10">
              <h2 className="text-lg font-semibold text-bloom-dark border-b border-bloom-sage-200 pb-2">
                Maternal Information (Optional)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postpartumDate" className="block text-sm font-medium text-bloom-dark mb-2">
                    Baby's Birth Date
                  </label>
                  <input
                    type="date"
                    id="postpartumDate"
                    name="postpartumDate"
                    value={formData.postpartumDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="numberOfChildren" className="block text-sm font-medium text-bloom-dark mb-2">
                    Number of Children
                  </label>
                  <select
                    id="numberOfChildren"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="expecting">Currently expecting</option>
                    <option value="0">0 (planning/considering)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5 or more</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-bloom-sage/10">
              <h2 className="text-lg font-semibold text-bloom-dark border-b border-bloom-sage-200 pb-2">
                Emergency Contact (Recommended)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-bloom-dark mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="Partner, family member, or friend"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-bloom-dark mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Consent and Terms */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-bloom-sage/10">
              <h2 className="text-lg font-semibold text-bloom-dark border-b border-bloom-sage-200 pb-2">
                Consent and Terms
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="hipaaConsent"
                    name="hipaaConsent"
                    checked={formData.hipaaConsent}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-bloompink focus:ring-bloompink"
                  />
                  <label htmlFor="hipaaConsent" className="text-sm text-bloom-dark">
                    <span className="font-medium">HIPAA Consent *</span>
                    <br />
                    I consent to the collection and use of my health information for course participation and therapeutic support. 
                    <Link href="/privacy-policy" className="text-bloompink hover:underline ml-1">View our Privacy Policy</Link>.
                  </label>
                </div>
                {errors.hipaaConsent && <p className="text-red-600 text-xs ml-6">{errors.hipaaConsent}</p>}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-bloompink focus:ring-bloompink"
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-bloom-dark">
                    <span className="font-medium">Terms and Conditions *</span>
                    <br />
                    I agree to the <Link href="/terms" className="text-bloompink hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-bloompink hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-red-600 text-xs ml-6">{errors.termsAccepted}</p>}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-bloompink focus:ring-bloompink"
                  />
                  <label htmlFor="marketingConsent" className="text-sm text-bloom-dark">
                    <span className="font-medium">Marketing Communications (Optional)</span>
                    <br />
                    I would like to receive helpful tips, course updates, and wellness resources via email.
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bloompink text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-bloom-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create My Account'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-bloom-dark/60">
              Already have an account?{' '}
              <Link href="/my-courses" className="text-bloompink hover:text-bloom-pink-dark font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}