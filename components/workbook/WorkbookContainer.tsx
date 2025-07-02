'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Send, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import QuestionRenderer from './QuestionRenderer';
import { WorkbookProgress } from './WorkbookProgress';
import { debounce } from 'lodash';
import { supabase } from '@/lib/supabase';

interface WorkbookQuestion {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'multiple_choice' | 'yes_no' | 'reflection';
  required?: boolean;
  placeholder?: string;
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
  options?: string[];
  maxWords?: number;
  clinicalNote?: string;
}

interface WorkbookSection {
  id: string;
  type: string;
  title: string;
  instructions?: string;
  questions: WorkbookQuestion[];
}

interface WorkbookData {
  id: string;
  title: string;
  therapeuticFramework: string;
  estimatedTime: string;
  questions: WorkbookSection[];
}

interface WorkbookResponse {
  questionId: string;
  value: any;
  isDraft: boolean;
  savedAt?: string;
}

interface WorkbookContainerProps {
  weekNumber: number;
  workbookData: WorkbookData;
  courseId: string;
  onComplete?: () => void;
}

export default function WorkbookContainer({
  weekNumber,
  workbookData,
  courseId,
  onComplete
}: WorkbookContainerProps) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<Record<string, WorkbookResponse>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSection = workbookData.questions[currentSectionIndex];
  const totalSections = workbookData.questions.length;

  // Load existing responses on mount
  useEffect(() => {
    loadExistingResponses();
  }, [weekNumber, user]);

  const loadExistingResponses = async () => {
    if (!user) return;

    try {
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/workbook/${weekNumber}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedResponses: Record<string, WorkbookResponse> = {};
        
        data.responses?.forEach((resp: any) => {
          formattedResponses[resp.question_id] = {
            questionId: resp.question_id,
            value: resp.response_data.value,
            isDraft: resp.is_draft,
            savedAt: resp.updated_at
          };
        });

        setResponses(formattedResponses);
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save functionality with debouncing
  const saveResponse = useCallback(
    debounce(async (questionId: string, value: any) => {
      if (!user) return;

      setIsSaving(true);
      
      try {
        // Get session for auth token
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch('/api/workbook/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            courseId,
            weekNumber,
            questionId,
            value,
            responseType: getQuestionType(questionId),
            isDraft: true
          }),
        });

        if (response.ok) {
          setLastSaved(new Date());
          setResponses(prev => ({
            ...prev,
            [questionId]: {
              questionId,
              value,
              isDraft: true,
              savedAt: new Date().toISOString()
            }
          }));
        } else {
          throw new Error('Failed to save response');
        }
      } catch (error) {
        console.error('Error saving response:', error);
        setErrors(prev => ({
          ...prev,
          [questionId]: 'Failed to save. Please try again.'
        }));
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [user, courseId, weekNumber]
  );

  const getQuestionType = (questionId: string): string => {
    for (const section of workbookData.questions) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) return question.type;
    }
    return 'text';
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        value,
        isDraft: true,
        savedAt: prev[questionId]?.savedAt
      }
    }));

    // Clear any errors for this question
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });

    // Auto-save the response
    saveResponse(questionId, value);
  };

  const validateSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentSection.questions.forEach(question => {
      if (question.required && !responses[question.id]?.value) {
        newErrors[question.id] = 'This question is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection() && currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateSection() || !user) return;

    setIsSubmitting(true);
    
    try {
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/workbook/${weekNumber}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          courseId,
          responses: Object.values(responses)
        }),
      });

      if (response.ok) {
        // Mark all responses as submitted (not draft)
        setResponses(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            updated[key].isDraft = false;
          });
          return updated;
        });

        // Call completion callback
        onComplete?.();
      } else {
        throw new Error('Failed to submit workbook');
      }
    } catch (error) {
      console.error('Error submitting workbook:', error);
      setErrors({ submit: 'Failed to submit workbook. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = (): number => {
    const totalQuestions = workbookData.questions.reduce(
      (sum, section) => sum + section.questions.length,
      0
    );
    const answeredQuestions = Object.keys(responses).filter(
      key => responses[key]?.value
    ).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-bloom-sage border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-playfair text-bloom-dark mb-2">
              {workbookData.title}
            </h2>
            <p className="text-bloom-dark/70 text-sm">
              {workbookData.therapeuticFramework}
            </p>
            <p className="text-bloom-dark/50 text-xs mt-1">
              Estimated time: {workbookData.estimatedTime}
            </p>
          </div>
          
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-sm text-bloom-dark/60">
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-bloom-sage border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="w-4 h-4 text-green-600" />
                <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
              </>
            ) : null}
          </div>
        </div>

        <WorkbookProgress 
          currentSection={currentSectionIndex + 1}
          totalSections={totalSections}
          completionPercentage={calculateProgress()}
        />
      </div>

      {/* Current Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSectionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-bloom-dark mb-2">
              {currentSection.title}
            </h3>
            {currentSection.instructions && (
              <p className="text-bloom-dark/70 text-sm">
                {currentSection.instructions}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentSection.questions.map((question) => (
              <div key={question.id}>
                <QuestionRenderer
                  question={question}
                  value={responses[question.id]?.value}
                  onChange={(value) => handleResponseChange(question.id, value)}
                  error={errors[question.id]}
                />
              </div>
            ))}
          </div>

          {/* Section Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-bloom-sage/20">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm text-bloom-dark/60">
              Section {currentSectionIndex + 1} of {totalSections}
            </span>

            {currentSectionIndex < totalSections - 1 ? (
              <Button
                variant="pink"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="pink"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Week {weekNumber}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}