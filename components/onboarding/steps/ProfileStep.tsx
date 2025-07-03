'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createClientComponentClient();
  const { user, loading: authLoading } = useAuth();
  
  // Enhanced session monitoring
  useEffect(() => {
    console.log('🔍 ProfileStep - Auth state changed:', { 
      user: !!user, 
      authLoading, 
      userId: user?.id,
      email: user?.email 
    });
    
    // Check session every time auth state changes
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 ProfileStep - Direct Supabase session:', { 
        hasSession: !!session, 
        sessionUserId: session?.user?.id,
        sessionEmail: session?.user?.email,
        sessionError: error?.message,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
      });
      
      if (session && !user && !authLoading) {
        console.log('⚠️ Session exists but user context missing - potential auth issue');
        setSessionStatus('invalid');
      } else if (session && user) {
        setSessionStatus('valid');
      } else {
        setSessionStatus('invalid');
      }
    };
    checkSession();
    
    // Set up session monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', { event, hasSession: !!session });
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log(`🔄 Auth event: ${event}`);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, authLoading, supabase]);

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
  
  // Real-time validation state
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

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

  // Real-time field validation
  const validateField = (field: string, value: any) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'firstName':
        if (!value?.trim()) {
          errors.firstName = 'First name is required';
        } else {
          delete errors.firstName;
        }
        break;
        
      case 'lastName':
        if (!value?.trim()) {
          errors.lastName = 'Last name is required';
        } else {
          delete errors.lastName;
        }
        break;
        
      case 'phone':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          errors.phone = 'Invalid phone format (e.g., (555) 123-4567)';
        } else {
          delete errors.phone;
        }
        break;
        
      case 'emergencyContactName':
      case 'emergencyContactPhone':
      case 'emergencyContactRelationship':
        // Check if any emergency contact field has been filled
        const updatedFormData = { ...formData, [field]: value };
        const hasAnyEmergency = updatedFormData.emergencyContactName || updatedFormData.emergencyContactPhone || updatedFormData.emergencyContactRelationship;
        
        if (hasAnyEmergency) {
          // If any field is filled, all fields become required
          if (!updatedFormData.emergencyContactName?.trim()) {
            errors.emergencyContactName = 'Name required if adding emergency contact';
          } else {
            delete errors.emergencyContactName;
          }
          
          if (!updatedFormData.emergencyContactPhone?.trim()) {
            errors.emergencyContactPhone = 'Phone required if adding emergency contact';
          } else {
            delete errors.emergencyContactPhone;
          }
          
          if (!updatedFormData.emergencyContactRelationship?.trim()) {
            errors.emergencyContactRelationship = 'Relationship required if adding emergency contact';
          } else {
            delete errors.emergencyContactRelationship;
          }
        } else {
          // If all fields are empty, no errors
          delete errors.emergencyContactName;
          delete errors.emergencyContactPhone;
          delete errors.emergencyContactRelationship;
        }
        break;
    }
    
    setFieldErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && formData.firstName?.trim() && formData.lastName?.trim());
  };
  
  // Run validation when form data changes
  useEffect(() => {
    validateField('firstName', formData.firstName);
    validateField('lastName', formData.lastName);
    validateField('phone', formData.phone);
    validateField('emergencyContactName', formData.emergencyContactName);
  }, [formData]);
  
  const validateForm = () => {
    console.log('Final form validation:', { formData, fieldErrors, isFormValid });
    
    // Run all validations one more time to ensure everything is caught
    validateField('firstName', formData.firstName);
    validateField('lastName', formData.lastName);
    validateField('phone', formData.phone);
    validateField('emergencyContactName', formData.emergencyContactName);
    validateField('emergencyContactPhone', formData.emergencyContactPhone);
    validateField('emergencyContactRelationship', formData.emergencyContactRelationship);
    
    if (!isFormValid) {
      const firstError = Object.values(fieldErrors)[0];
      setError(firstError || 'Please fix the errors highlighted in red above');
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    setError(null);
    console.log('🚀 Starting profile save...');
    console.log('🔍 Browser info:', {
      isIncognito: navigator.cookieEnabled && !window.localStorage.getItem('test'),
      cookiesEnabled: navigator.cookieEnabled,
      userAgent: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'
    });
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsLoading(true);

    try {
      // Force session refresh first in incognito mode
      console.log('🔍 Getting fresh session...');
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('🔍 Fresh session check:', { 
        hasSession: !!freshSession, 
        sessionUserId: freshSession?.user?.id,
        sessionError,
        expiresAt: freshSession?.expires_at ? new Date(freshSession.expires_at * 1000).toISOString() : 'N/A',
        accessToken: freshSession?.access_token ? 'Present' : 'Missing'
      });
      
      if (!freshSession || sessionError) {
        console.error('❌ No fresh session available');
        
        // Try to refresh the session
        console.log('🔄 Attempting session refresh...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshData.session) {
          console.log('✅ Session refreshed successfully');
          setError('✅ Session refreshed, continuing...');
        } else {
          console.error('❌ Session refresh failed:', refreshError);
          setError('Session expired. Please log in again.');
          setIsLoading(false);
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
          return;
        }
      }
      
      // Use the fresh session user or fallback to context user
      const currentUser = freshSession?.user || user;
      
      if (!currentUser) {
        console.error('❌ No user available after session checks');
        setError('Unable to authenticate. Please log in again.');
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
        return;
      }
      
      console.log('✅ Using user:', { id: currentUser.id, email: currentUser.email });

      // Create or update user profile
      const profileData = {
        id: currentUser.id,
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

      console.log('Attempting to save profile data:', profileData);
      
      // Double-check session before API call
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session lost before API call');
      }
      
      console.log('📤 Making API call with data:', profileData);
      
      // Use API endpoint to bypass RLS issues
      const response = await fetch('/api/profile/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`, // Explicit auth header
        },
        credentials: 'include', // Important: include cookies for auth
        body: JSON.stringify(profileData),
      });
      
      console.log('📥 API response status:', response.status);

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Profile creation error:', {
          status: response.status,
          statusText: response.statusText,
          result
        });
        
        if (result.code === 'AUTH_REQUIRED' || result.error?.includes('Session expired') || response.status === 401) {
          console.error('❌ Auth error, attempting session refresh...');
          
          try {
            const { data, error } = await supabase.auth.refreshSession();
            if (data.session) {
              console.log('✅ Session refreshed, retrying save...');
              setError('Session refreshed, retrying...');
              // Retry the save operation
              setTimeout(() => handleSaveProfile(), 1000);
              return;
            }
          } catch (refreshError) {
            console.error('❌ Session refresh failed:', refreshError);
          }
          
          setError('Your session has expired. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else if (response.status === 400 && result.validationErrors) {
          // Show detailed validation errors
          setError(result.error || 'Please fix the validation errors');
          
          // Update field errors based on server response
          if (result.fields) {
            const newFieldErrors: {[key: string]: string} = {};
            
            if (result.fields.first_name === 'Required') {
              newFieldErrors.firstName = 'First name is required';
            }
            if (result.fields.last_name === 'Required') {
              newFieldErrors.lastName = 'Last name is required';
            }
            if (result.fields.phone === 'Invalid format') {
              newFieldErrors.phone = 'Invalid phone number format';
            }
            if (result.fields.emergency_contact && typeof result.fields.emergency_contact === 'object') {
              if (result.fields.emergency_contact.name === 'Required') {
                newFieldErrors.emergencyContactName = 'Emergency contact name is required';
              }
              if (result.fields.emergency_contact.phone === 'Required') {
                newFieldErrors.emergencyContactPhone = 'Emergency contact phone is required';
              }
              if (result.fields.emergency_contact.relationship === 'Required') {
                newFieldErrors.emergencyContactRelationship = 'Emergency contact relationship is required';
              }
            }
            
            setFieldErrors(newFieldErrors);
          }
        } else if (response.status === 400) {
          setError(result.error || 'Please check your information');
        } else if (response.status === 500) {
          setError(result.error || 'Server error - please try again');
        } else {
          setError(result.error || 'Something went wrong');
        }
        
        // If there are additional details, log them
        if (result.details) {
          console.error('🔍 Additional error details:', result.details);
        }
        
        return;
      }
      
      console.log('✅ Profile saved successfully:', result);
      // Don't show success as error - just move to next step
      
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
      console.error('Profile save network error:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network connection failed. Please check your internet and try again.');
      } else if (err.name === 'AbortError') {
        setError('Request was cancelled. Please try again.');
      } else {
        setError(`Network Error: ${err.message || 'Unable to reach server'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user starts typing
    validateField(field, value); // Real-time validation
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-bloom-sage border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-bloom-dark/70">Loading your session...</p>
        </div>
      </div>
    );
  }

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
          
          {/* Error Display - Show server error or validation summary */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-semibold mb-1">Something went wrong</p>
                  <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                  {Object.keys(fieldErrors).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-red-700 text-xs font-medium mb-2">Please fix these fields:</p>
                      <ul className="text-red-600 text-xs space-y-1">
                        {Object.entries(fieldErrors).map(([field, error]) => (
                          <li key={field} className="flex items-start gap-1">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Session status indicator */}
          <div className={`mt-4 p-3 rounded-lg border ${
            sessionStatus === 'valid' 
              ? 'bg-green-50 border-green-200' 
              : sessionStatus === 'invalid'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm font-medium flex items-center gap-2 ${
              sessionStatus === 'valid' 
                ? 'text-green-700' 
                : sessionStatus === 'invalid'
                  ? 'text-red-700'
                  : 'text-yellow-700'
            }`}>
              {sessionStatus === 'valid' && (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Session active - Ready to save
                </>
              )}
              {sessionStatus === 'invalid' && (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Session issue - May need to login again
                </>
              )}
              {sessionStatus === 'checking' && (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking session...
                </>
              )}
            </p>
          </div>
          
          {/* Success indicator */}
          {isFormValid && formData.firstName && formData.lastName && sessionStatus === 'valid' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                All systems go! Ready to continue.
              </p>
            </div>
          )}
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
                  Name captured from signup (you can update if needed)
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-bloom-dark mb-2">
                  First Name {user?.user_metadata?.full_name && <span className="text-bloom-sage text-xs font-normal">(from signup)</span>}
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                    fieldErrors.firstName 
                      ? 'border-red-500 bg-red-50/30' 
                      : user?.user_metadata?.full_name 
                        ? 'bg-bloom-sage-50/30 border-bloom-sage/40 font-medium' 
                        : 'border-bloom-sage/20'
                  }`}
                  placeholder="Your first name"
                  required
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-bloom-dark mb-2">
                  Last Name {user?.user_metadata?.full_name && <span className="text-bloom-sage text-xs font-normal">(from signup)</span>}
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                    fieldErrors.lastName 
                      ? 'border-red-500 bg-red-50/30' 
                      : user?.user_metadata?.full_name 
                        ? 'bg-bloom-sage-50/30 border-bloom-sage/40 font-medium' 
                        : 'border-bloom-sage/20'
                  }`}
                  placeholder="Your last name"
                  required
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.lastName}
                  </p>
                )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                  fieldErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-bloom-sage/20'
                }`}
                placeholder="(555) 123-4567"
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.phone}
                </p>
              )}
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
                <option value={0}>Expecting first child</option>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                    fieldErrors.emergencyContactName ? 'border-red-500 bg-red-50/30' : 'border-bloom-sage/20'
                  }`}
                  placeholder="Full name"
                />
                {fieldErrors.emergencyContactName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.emergencyContactName}
                  </p>
                )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                      fieldErrors.emergencyContactPhone ? 'border-red-500 bg-red-50/30' : 'border-bloom-sage/20'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {fieldErrors.emergencyContactPhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.emergencyContactPhone}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-bloom-dark mb-2">
                    Relationship
                  </label>
                  <select
                    id="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => updateFormData('emergencyContactRelationship', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
                      fieldErrors.emergencyContactRelationship ? 'border-red-500 bg-red-50/30' : 'border-bloom-sage/20'
                    }`}
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="partner">Partner</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.emergencyContactRelationship && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.emergencyContactRelationship}
                    </p>
                  )}
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
              className={`w-full ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || authLoading || !isFormValid}
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