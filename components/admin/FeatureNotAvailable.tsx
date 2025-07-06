import React from 'react';
import { AlertCircle, Wrench } from 'lucide-react';

interface FeatureNotAvailableProps {
  featureName: string;
  description?: string;
  plannedDate?: string;
  showIcon?: boolean;
}

export default function FeatureNotAvailable({
  featureName,
  description,
  plannedDate,
  showIcon = true
}: FeatureNotAvailableProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-start space-x-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <Wrench className="w-5 h-5 text-yellow-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-yellow-800">
            {featureName} - Coming Soon
          </h3>
          {description && (
            <p className="mt-2 text-sm text-yellow-700">
              {description}
            </p>
          )}
          {plannedDate && (
            <p className="mt-2 text-sm text-yellow-600">
              Planned for: {plannedDate}
            </p>
          )}
          <div className="mt-4 text-xs text-yellow-600 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>This feature is under development</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureComingSoon({ feature }: { feature: string }) {
  return (
    <div className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
      <Wrench className="w-3 h-3" />
      <span>{feature}</span>
    </div>
  );
}