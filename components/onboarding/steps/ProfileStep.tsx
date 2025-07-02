'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';

interface ProfileStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function ProfileStep({ 
  data, 
  updateData, 
  nextStep, 
  prevStep, 
  isLoading, 
  setIsLoading, 
  error, 
  setError 
}: ProfileStepProps) {
  const supabase = useSupabaseClient();
  const user = useUser();

  // Initialize form data
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    phone: data.phone || '',
    postpartumDate: data.postpartumDate || '',
    babyDueDate: data.babyDueDate || '',
    numberOfChildren: data.numberOfChildren || 1,
    emergencyContactName: data.emergencyContactName || '',
    emergencyContactPhone: data.emergencyContactPhone || '',
    emergencyContactRelationship: data.emergencyContactRelationship || '',
    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Update form data when user metadata becomes available
  useEffect(() => {
    if (user?.user_metadata?.full_name && !formData.firstName && !formData.lastName) {
      const fullName = user.user_metadata.full_name;
      const nameParts = fullName.trim().split(' ');
      const extractedFirstName = nameParts[0] || '';
      const extractedLastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName: extractedFirstName,
        lastName: extractedLastName
      }));
    }
  }, [user]);

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Emergency contact validation (if one field filled, require others)
    const hasEmergencyContact = formData.emergencyContactName || formData.emergencyContactPhone || formData.emergencyContactRelationship;
    if (hasEmergencyContact) {
      if (!formData.emergencyContactName.trim()) {
        setError('Emergency contact name is required');
        return false;
      }
      if (!formData.emergencyContactPhone.trim()) {
        setError('Emergency contact phone is required');
        return false;
      }
      if (!formData.emergencyContactRelationship.trim()) {
        setError('Emergency contact relationship is required');
        return false;
      }
    }

    return true;
  };

  const handleSaveProfile = async () => {
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!user) {
        setError('Please sign in first');
        setIsLoading(false);
        return;
      }

      // Create or update user profile
      const profileData = {
        id: user.id,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        postpartum_date: formData.postpartumDate || null,
        baby_due_date: formData.babyDueDate || null,
        number_of_children: formData.numberOfChildren,
        emergency_contact_name: formData.emergencyContactName.trim() || null,
        emergency_contact_phone: formData.emergencyContactPhone.trim() || null,
        emergency_contact_relationship: formData.emergencyContactRelationship.trim() || null,
        timezone: formData.timezone,
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        setError('Failed to save profile. Please try again.');
        return;
      }

      // Track profile completion
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'profile_completed',
            data: {
              user_id: user.id,
              has_emergency_contact: !!(formData.emergencyContactName && formData.emergencyContactPhone),
              has_maternal_dates: !!(formData.postpartumDate || formData.babyDueDate),
              number_of_children: formData.numberOfChildren
            }
          })
        });
      } catch (analyticsError) {
        console.error('Analytics tracking failed:', analyticsError);
      }

      // Update onboarding data
      updateData(formData);
      
      // Move to next step
      nextStep();
    } catch (err: any) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user starts typing
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-4">
            Complete Your Profile
          </h2>
          <p className="text-bloom-dark/70">
            {formData.firstName ? `Welcome ${formData.firstName}! Let's add some additional information to personalize your experience.` : 'This helps us personalize your experience and provide better support'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-bloom-sage-50/20 rounded-lg p-6">
            <h3 className="font-semibold text-bloom-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {formData.firstName && formData.lastName ? 'Your Information' : 'Basic Information'}
            </h3>
            
            {formData.firstName && formData.lastName && (
              <div className="mb-4 p-3 bg-bloom-sage-50/50 rounded-lg">
                <p className="text-sm text-bloom-dark/70 flex items-center gap-2">
                  <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  We already have your name from signup
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-bloom-dark mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                    user?.user_metadata?.full_name ? 'bg-bloom-sage-50/20 border-bloom-sage/30' : 'border-bloom-sage/20'
                  }`}
                  placeholder="Your first name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-bloom-dark mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                    user?.user_metadata?.full_name ? 'bg-bloom-sage-50/20 border-bloom-sage/30' : 'border-bloom-sage/20'
                  }`}
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-bloom-dark mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-bloom-dark/50 mt-1">
                For appointment reminders and urgent communications
              </p>
            </div>
          </div>

          {/* Maternal Health Information */}
          <div className="bg-bloompink/5 rounded-lg p-6">
            <h3 className="font-semibold text-bloom-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Maternal Health (Optional)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postpartumDate" className="block text-sm font-medium text-bloom-dark mb-2">
                  Baby's Birth Date
                </label>
                <input
                  type="date"
                  id="postpartumDate"
                  value={formData.postpartumDate}
                  onChange={(e) => updateFormData('postpartumDate', e.target.value)}
                  className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="babyDueDate" className="block text-sm font-medium text-bloom-dark mb-2">
                  Due Date (if expecting)
                </label>
                <input
                  type="date"
                  id="babyDueDate"
                  value={formData.babyDueDate}
                  onChange={(e) => updateFormData('babyDueDate', e.target.value)}
                  className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="numberOfChildren" className="block text-sm font-medium text-bloom-dark mb-2">
                Number of Children
              </label>
              <select
                id="numberOfChildren"
                value={formData.numberOfChildren}
                onChange={(e) => updateFormData('numberOfChildren', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'child' : 'children'}
                  </option>
                ))}
                <option value={7}>7+ children</option>
              </select>
            </div>

            <p className="text-xs text-bloom-dark/50 mt-2">
              This helps us tailor content and recommendations to your specific situation
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-bloom-accent/5 rounded-lg p-6">
            <h3 className="font-semibold text-bloom-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Emergency Contact (Optional)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="emergencyContactName" className="block text-sm font-medium text-bloom-dark mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                  className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                  placeholder="Full name"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-bloom-dark mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-bloom-dark mb-2">
                    Relationship
                  </label>
                  <select
                    id="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => updateFormData('emergencyContactRelationship', e.target.value)}
                    className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="partner">Partner</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="text-xs text-bloom-dark/50 mt-2">
              Someone we can contact if needed during your care
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSaveProfile}
              variant="pink"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Profile...
                </div>
              ) : (
                'Continue'
              )}
            </Button>

            <Button
              onClick={prevStep}
              variant="outline"
              size="md"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Back
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-bloom-sage-50/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-bloom-dark">Your Privacy is Protected</p>
                <p className="text-xs text-bloom-dark/60 mt-1">
                  All information is encrypted and stored securely in compliance with HIPAA regulations. 
                  We will never share your personal information without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}