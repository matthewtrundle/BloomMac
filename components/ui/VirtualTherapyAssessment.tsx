'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    points: number;
    explanation?: string;
  }[];
}

interface AssessmentResult {
  score: number;
  recommendation: string;
  nextSteps: string[];
  ctaText: string;
  ctaLink: string;
}

const assessmentQuestions: Question[] = [
  {
    id: 'privacy',
    question: 'Do you have a private space at home where you won\'t be interrupted?',
    description: 'Virtual therapy requires a confidential environment for effective sessions.',
    options: [
      { text: 'Yes, I have a dedicated private space', points: 3, explanation: 'Perfect for confidential virtual sessions' },
      { text: 'Yes, but it\'s sometimes shared with family', points: 2, explanation: 'We can work with flexible scheduling' },
      { text: 'Limited privacy, but I can arrange it', points: 1, explanation: 'May require some planning ahead' },
      { text: 'No, privacy is a major concern', points: 0, explanation: 'In-person sessions might be better' }
    ]
  },
  {
    id: 'technology',
    question: 'How comfortable are you with video technology?',
    description: 'Virtual therapy uses secure video platforms similar to Zoom or FaceTime.',
    options: [
      { text: 'Very comfortable, I use video calls regularly', points: 3, explanation: 'You\'ll adapt quickly to our platform' },
      { text: 'Somewhat comfortable, I can learn', points: 2, explanation: 'We provide tech support to get you started' },
      { text: 'Not very comfortable, but willing to try', points: 1, explanation: 'We offer practice sessions before your first appointment' },
      { text: 'Not comfortable at all with technology', points: 0, explanation: 'Our Austin office might be a better fit' }
    ]
  },
  {
    id: 'schedule',
    question: 'Would eliminating commute time make therapy more accessible for you?',
    description: 'Consider childcare, travel time, and scheduling flexibility.',
    options: [
      { text: 'Yes, commute time is a major barrier', points: 3, explanation: 'Virtual therapy removes this obstacle completely' },
      { text: 'Yes, it would help with my busy schedule', points: 2, explanation: 'Evening and weekend sessions available' },
      { text: 'Somewhat, but I don\'t mind traveling', points: 1, explanation: 'Hybrid approach might work well' },
      { text: 'No, I prefer the routine of going somewhere', points: 0, explanation: 'Our Austin office provides that structure' }
    ]
  },
  {
    id: 'emotional_comfort',
    question: 'Do you feel you can open up emotionally through video?',
    description: 'This is about your personal comfort with virtual emotional connection.',
    options: [
      { text: 'Yes, I\'m comfortable being vulnerable on video', points: 3, explanation: 'You\'ll likely thrive in virtual therapy' },
      { text: 'I think so, once I get used to it', points: 2, explanation: 'Most clients adapt within 1-2 sessions' },
      { text: 'I\'m unsure, but willing to try', points: 1, explanation: 'We can start with a trial session' },
      { text: 'No, I need face-to-face connection', points: 0, explanation: 'In-person sessions would be more effective' }
    ]
  },
  {
    id: 'location',
    question: 'Where are you located in Texas?',
    description: 'This helps us understand your access to in-person alternatives.',
    options: [
      { text: 'Austin area (within 30 minutes of our office)', points: 1, explanation: 'You have both virtual and in-person options' },
      { text: 'Dallas-Fort Worth area', points: 3, explanation: 'Virtual therapy provides specialized care locally unavailable' },
      { text: 'Houston area', points: 3, explanation: 'Access Austin expertise without the drive' },
      { text: 'Rural Texas or other cities', points: 3, explanation: 'Virtual therapy brings specialized care to you' }
    ]
  },
  {
    id: 'childcare',
    question: 'How challenging is arranging childcare for appointments?',
    description: 'Consider your current childcare situation and flexibility.',
    options: [
      { text: 'Very difficult, major barrier to getting help', points: 3, explanation: 'Virtual therapy eliminates this obstacle' },
      { text: 'Challenging but possible with planning', points: 2, explanation: 'Virtual sessions offer more flexibility' },
      { text: 'Manageable with some effort', points: 1, explanation: 'Both options could work for you' },
      { text: 'Not an issue, I have reliable childcare', points: 0, explanation: 'In-person sessions are easily accessible' }
    ]
  }
];

const getAssessmentResult = (score: number, totalPossible: number): AssessmentResult => {
  const percentage = (score / totalPossible) * 100;
  
  if (percentage >= 75) {
    return {
      score: percentage,
      recommendation: "Virtual therapy is an excellent fit for you!",
      nextSteps: [
        "Book a virtual consultation to get started",
        "We'll provide tech setup support before your first session",
        "Evening and weekend appointments available",
        "Same-week scheduling for urgent needs"
      ],
      ctaText: "Book Virtual Session",
      ctaLink: "/book"
    };
  } else if (percentage >= 50) {
    return {
      score: percentage,
      recommendation: "Virtual therapy could work well with some adjustments.",
      nextSteps: [
        "Schedule a free 15-minute consultation to discuss your needs",
        "We can address any concerns about technology or setup",
        "Consider a trial virtual session to see how it feels",
        "Hybrid approach combining virtual and in-person sessions"
      ],
      ctaText: "Schedule Consultation",
      ctaLink: "/book"
    };
  } else if (percentage >= 25) {
    return {
      score: percentage,
      recommendation: "Virtual therapy is possible but may have challenges.",
      nextSteps: [
        "Consider visiting our Austin office for initial sessions",
        "Discuss your specific concerns with our team",
        "We offer technology support and practice sessions",
        "Hybrid model might be the best approach for you"
      ],
      ctaText: "Discuss Options",
      ctaLink: "/contact"
    };
  } else {
    return {
      score: percentage,
      recommendation: "In-person therapy would likely be more effective for you.",
      nextSteps: [
        "Our Austin office provides the personal connection you need",
        "Specialized perinatal mental health care in comfortable setting",
        "Full range of therapeutic approaches available",
        "Consider virtual sessions for follow-up appointments"
      ],
      ctaText: "Visit Austin Office",
      ctaLink: "/texas-service-areas/why-travel-to-austin"
    };
  }
};

export default function VirtualTherapyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const totalQuestions = assessmentQuestions.length;
  const totalPossibleScore = assessmentQuestions.length * 3; // Max 3 points per question
  const currentScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  const handleAnswer = (points: number, optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Delay to show selection animation
    setTimeout(() => {
      const questionId = assessmentQuestions[currentQuestion].id;
      setAnswers(prev => ({ ...prev, [questionId]: points }));
      
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 300);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption(null);
  };

  const result = showResult ? getAssessmentResult(currentScore, totalPossibleScore) : null;
  const progressPercentage = ((currentQuestion + (showResult ? 1 : 0)) / totalQuestions) * 100;

  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft p-8"
        >
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-bloompink to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">{Math.round(result.score)}%</span>
            </div>
            <h3 className="text-2xl font-playfair text-bloom-dark mb-2">Assessment Complete</h3>
            <p className="text-lg text-bloom-dark/80">{result.recommendation}</p>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-bloom-dark mb-4">Recommended Next Steps:</h4>
            <ul className="space-y-3">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-bloom-sage/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-bloom-sage text-sm font-semibold">{index + 1}</span>
                  </div>
                  <span className="text-bloom-dark/70">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={result.ctaLink}
              className="bg-bloompink text-white px-8 py-3 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors text-center"
            >
              {result.ctaText}
            </Link>
            <button
              onClick={restartAssessment}
              className="bg-white text-bloom-dark px-8 py-3 rounded-full font-medium border-2 border-bloom-sage hover:bg-bloom-sage-50 transition-colors"
            >
              Retake Assessment
            </button>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 p-4 bg-bloom-sage-50 rounded-xl">
            <p className="text-sm text-bloom-dark/70 text-center">
              Have questions about your results? 
              <Link href="/contact" className="text-bloompink hover:underline ml-1">
                Contact us
              </Link> for personalized guidance.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = assessmentQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-bloom-dark">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-bloom-dark/60">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-bloom-sage/20 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-bloompink to-pink-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-soft p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-bloom-dark mb-3">
              {question.question}
            </h3>
            {question.description && (
              <p className="text-bloom-dark/60 text-sm">
                {question.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option.points, index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedOption === index
                    ? 'border-bloompink bg-bloom-pink-50'
                    : 'border-bloom-sage/20 hover:border-bloom-sage/40 hover:bg-bloom-sage-50/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                    selectedOption === index
                      ? 'border-bloompink bg-bloompink'
                      : 'border-bloom-sage/40'
                  }`}>
                    {selectedOption === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full rounded-full bg-white scale-50"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-bloom-dark">{option.text}</p>
                    {option.explanation && (
                      <p className="text-sm text-bloom-dark/60 mt-1">{option.explanation}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}