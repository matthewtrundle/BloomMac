'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface WorkbookProgressProps {
  currentSection: number;
  totalSections: number;
  completionPercentage: number;
}

export function WorkbookProgress({ 
  currentSection, 
  totalSections, 
  completionPercentage 
}: WorkbookProgressProps) {
  return (
    <div className="space-y-4">
      {/* Percentage Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-bloom-dark">
            Overall Progress
          </span>
          <span className="text-sm text-bloom-dark/70">
            {completionPercentage}% Complete
          </span>
        </div>
        <div className="w-full h-3 bg-bloom-sage/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-bloom-sage to-bloompink rounded-full"
          />
        </div>
      </div>

      {/* Section Indicators */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSections }, (_, i) => {
          const sectionNumber = i + 1;
          const isCompleted = sectionNumber < currentSection;
          const isCurrent = sectionNumber === currentSection;

          return (
            <div
              key={i}
              className="flex items-center"
            >
              {i > 0 && (
                <div
                  className={`w-8 h-0.5 transition-colors ${
                    isCompleted ? 'bg-bloom-sage' : 'bg-bloom-sage/20'
                  }`}
                />
              )}
              
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isCompleted
                    ? 'bg-bloom-sage text-white'
                    : isCurrent
                    ? 'bg-bloompink text-white'
                    : 'bg-bloom-sage/20 text-bloom-dark/50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-medium">{sectionNumber}</span>
                )}
                
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-bloompink"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}