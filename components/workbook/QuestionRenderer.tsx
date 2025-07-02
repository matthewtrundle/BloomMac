'use client';

import { AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionProps {
  question: {
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
  };
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function QuestionRenderer({ question, value, onChange, error }: QuestionProps) {
  const renderTextInput = () => {
    const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
    const maxWords = question.maxWords || 500;

    return (
      <div className="space-y-2">
        <textarea
          id={question.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Share your thoughts...'}
          className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors ${
            error ? 'border-red-500 bg-red-50/30' : 'border-bloom-sage/20'
          }`}
          rows={question.type === 'reflection' ? 6 : 4}
        />
        
        <div className="flex items-center justify-between text-xs text-bloom-dark/50">
          <span>
            {wordCount} / {maxWords} words
          </span>
          {wordCount > maxWords && (
            <span className="text-red-600">
              Exceeds word limit
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderScale = () => {
    if (!question.scale) return null;
    
    const { min, max, labels } = question.scale;
    const steps = max - min + 1;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-bloom-dark/70">{labels[0]}</span>
          <span className="text-sm text-bloom-dark/70">{labels[labels.length - 1]}</span>
        </div>
        
        <div className="relative">
          {/* Scale track */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-2 bg-bloom-sage/20 rounded-full" />
          </div>
          
          {/* Scale points */}
          <div className="relative flex justify-between">
            {Array.from({ length: steps }, (_, i) => {
              const scaleValue = min + i;
              const isSelected = value === scaleValue;
              
              return (
                <button
                  key={scaleValue}
                  type="button"
                  onClick={() => onChange(scaleValue)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    isSelected 
                      ? 'bg-bloompink border-bloompink scale-125' 
                      : 'bg-white border-bloom-sage/40 hover:border-bloom-sage'
                  }`}
                  aria-label={`${scaleValue} - ${labels[i] || ''}`}
                >
                  <span className="text-xs font-medium">
                    {scaleValue}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Current selection label */}
        {value !== undefined && labels[value - min] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-bloom-dark/70 font-medium"
          >
            Selected: {labels[value - min]}
          </motion.div>
        )}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    if (!question.options) return null;

    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              value === option
                ? 'border-bloompink bg-bloompink/5'
                : 'border-bloom-sage/20 hover:border-bloom-sage/40'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              value === option ? 'border-bloompink' : 'border-bloom-sage/40'
            }`}>
              {value === option && (
                <div className="w-3 h-3 rounded-full bg-bloompink" />
              )}
            </div>
            <span className="text-bloom-dark">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderYesNo = () => {
    return (
      <div className="flex gap-4">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option.toLowerCase())}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              value === option.toLowerCase()
                ? 'bg-bloompink text-white'
                : 'bg-bloom-sage/10 text-bloom-dark hover:bg-bloom-sage/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
      case 'reflection':
        return renderTextInput();
      case 'scale':
        return renderScale();
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'yes_no':
        return renderYesNo();
      default:
        return renderTextInput();
    }
  };

  return (
    <div className="space-y-3">
      {/* Question Text */}
      <label htmlFor={question.id} className="block">
        <span className="text-bloom-dark font-medium">
          {question.text}
          {question.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </span>
      </label>

      {/* Clinical Note (if present) */}
      {question.clinicalNote && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{question.clinicalNote}</span>
        </div>
      )}

      {/* Input Component */}
      {renderInput()}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}