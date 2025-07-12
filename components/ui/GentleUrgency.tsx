'use client';

import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';

interface UrgencyItem {
  type: 'cohort' | 'availability' | 'queue' | 'inventory';
  message: string;
  detail?: string;
}

interface GentleUrgencyProps {
  items: UrgencyItem[];
  variant?: 'banner' | 'inline';
  className?: string;
}

export default function GentleUrgency({ 
  items, 
  variant = 'inline',
  className = '' 
}: GentleUrgencyProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'cohort':
        return <Calendar className="w-4 h-4" />;
      case 'availability':
        return <Users className="w-4 h-4" />;
      case 'queue':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 ${className}`}>
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-amber-800">
              {getIcon(item.type)}
              <span className="font-medium">{item.message}</span>
              {item.detail && (
                <span className="text-amber-600">• {item.detail}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="p-2 bg-white rounded-lg text-gray-600">
            {getIcon(item.type)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{item.message}</p>
            {item.detail && (
              <p className="text-sm text-gray-600 mt-0.5">{item.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}