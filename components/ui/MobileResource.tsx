import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Heart, AlertCircle } from 'lucide-react';

interface ResourceSection {
  id: string;
  title: string;
  items: string[];
  description?: string;
  type?: 'checklist' | 'tips' | 'warning' | 'info';
}

interface MobileResourceProps {
  title: string;
  description: string;
  sections: ResourceSection[];
  downloadTitle?: string;
  onDownload?: () => void;
}

const MobileResource: React.FC<MobileResourceProps> = ({ 
  title, 
  description, 
  sections, 
  downloadTitle = "Save to Phone",
  onDownload 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'tips':
        return <Heart className="w-4 h-4 text-pink-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-bloom-accent rounded-full" />;
    }
  };

  const handleSaveToPhone = () => {
    const content = sections.map(section => 
      `${section.title}\n${section.items.map(item => `• ${item}`).join('\n')}\n`
    ).join('\n');
    
    const blob = new Blob([`${title}\n\n${description}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (onDownload) onDownload();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-bloom-blush to-bloom-accent">
        <h1 className="text-2xl font-playfair text-white mb-2">{title}</h1>
        <p className="text-white/90 text-sm">{description}</p>
      </div>

      {/* Save Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSaveToPhone}
          className="w-full bg-bloom text-white py-3 px-4 rounded-lg font-medium hover:bg-bloom/90 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{downloadTitle}</span>
        </button>
      </div>

      {/* Progress Bar */}
      {sections.some(s => s.type === 'checklist') && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{checkedItems.size} / {sections.reduce((acc, s) => acc + (s.type === 'checklist' ? s.items.length : 0), 0)} completed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(checkedItems.size / sections.reduce((acc, s) => acc + (s.type === 'checklist' ? s.items.length : 0), 0)) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(section.type || 'info')}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
                    )}
                  </div>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has(section.id) && (
              <div className="px-4 pb-4">
                <div className="ml-7 space-y-3">
                  {section.items.map((item, index) => {
                    const itemId = `${section.id}-${index}`;
                    const isChecked = checkedItems.has(itemId);
                    
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        {section.type === 'checklist' ? (
                          <button
                            onClick={() => toggleItem(itemId)}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isChecked 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </button>
                        ) : (
                          <div className="mt-2 w-2 h-2 bg-bloom-accent rounded-full flex-shrink-0" />
                        )}
                        <p className={`text-sm leading-relaxed ${
                          isChecked 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {item}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💚 Remember: Progress, not perfection. Every small step counts.
        </p>
      </div>
    </div>
  );
};

export default MobileResource;