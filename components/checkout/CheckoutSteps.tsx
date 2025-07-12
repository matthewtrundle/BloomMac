'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  component?: React.ComponentType<any>;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function CheckoutSteps({ steps, currentStep, className = '' }: CheckoutStepsProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{step.number}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }
                    `}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 w-12 transition-colors duration-300
                    ${
                      currentStep > step.number
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}