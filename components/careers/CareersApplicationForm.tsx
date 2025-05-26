'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

const openPositions = [
  {
    title: "Licensed Clinical Social Worker (LCSW)",
    type: "Full-time",
    location: "Austin, TX (Hybrid)",
  },
  {
    title: "Licensed Professional Counselor (LPC)",
    type: "Part-time", 
    location: "Austin, TX (Hybrid)",
  }
];

const CareersApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    availability: '',
    motivation: '',
    additionalInfo: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setSubmitMessage('Please upload a PDF, DOC, or DOCX file.');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage('File size must be less than 5MB.');
        return;
      }
      
      setResume(file);
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position) {
      setSubmitMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      if (resume) {
        submitData.append('resume', resume);
      }

      const response = await fetch('/api/careers-application', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Application submission failed');
      }

      setIsSuccess(true);
      setSubmitMessage(result.message);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        availability: '',
        motivation: '',
        additionalInfo: ''
      });
      setResume(null);

      // Fire analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'career_application', {
          event_category: 'engagement',
          event_label: formData.position,
          value: 1
        });
      }

    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">Application Submitted! 🎉</h3>
        <p className="text-green-700 mb-4">{submitMessage}</p>
        <p className="text-sm text-green-600">
          You should receive a confirmation email shortly. We'll be in touch within 5-7 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
            Position of Interest *
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select a position</option>
            {openPositions.map((pos, index) => (
              <option key={index} value={pos.title}>{pos.title}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
          Relevant Experience & Background
        </label>
        <textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          rows={4}
          disabled={isSubmitting}
          placeholder="Please describe your relevant experience, education, and qualifications..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
          Why are you interested in working at Bloom Psychology?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleInputChange}
          rows={4}
          disabled={isSubmitting}
          placeholder="Tell us what draws you to our practice and mission..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information (Optional)
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleInputChange}
          rows={3}
          disabled={isSubmitting}
          placeholder="Any additional information you'd like to share..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
          Resume/CV
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            disabled={isSubmitting}
            className="hidden"
          />
          <label
            htmlFor="resume"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Choose File
          </label>
          <p className="text-sm text-gray-500 mt-2">
            {resume ? resume.name : 'PDF, DOC, or DOCX files only (Max 5MB)'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          * Required fields
        </p>
        <Button
          type="submit"
          variant="pink"
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>

      {submitMessage && (
        <div className={`mt-6 p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitMessage}
        </div>
      )}
    </form>
  );
};

export default CareersApplicationForm;