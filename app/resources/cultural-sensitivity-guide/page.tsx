'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, Globe, Users, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const culturalConsiderations = [
  {
    id: 1,
    culture: 'Latino/Hispanic',
    tradition: 'La Cuarentena (The 40 Days)',
    description: 'A period of rest and recovery where new mothers are cared for by female relatives.',
    considerations: [
      'Respect the importance of family involvement in care',
      'Understand that refusing help may conflict with cultural expectations',
      'Support traditional foods and remedies when safe',
      'Honor the role of elder women in guiding new mothers'
    ],
    icon: '🌮',
    supportTips: [
      'Ask what traditional practices are important to them',
      'Learn basic phrases in Spanish if relevant',
      'Respect dietary preferences and restrictions',
      'Understand extended family decision-making roles'
    ]
  },
  {
    id: 2,
    culture: 'Asian',
    tradition: 'Confinement Period (Zuoyuezi)',
    description: 'Traditional month-long period focusing on warming foods, rest, and minimal physical activity.',
    considerations: [
      'Understand restrictions on cold foods and activities',
      'Respect beliefs about energy balance and recovery',
      'Honor the role of mother-in-law in postpartum care',
      'Be sensitive to indirect communication styles'
    ],
    icon: '🥢',
    supportTips: [
      'Offer warm beverages instead of cold drinks',
      'Respect preferences for cooked vs. raw foods',
      'Understand hierarchical family structures',
      'Be patient with different communication styles'
    ]
  },
  {
    id: 3,
    culture: 'Middle Eastern/Arab',
    tradition: 'Extended Family Support',
    description: 'Strong emphasis on community care, modesty considerations, and traditional remedies.',
    considerations: [
      'Respect modesty requirements during visits',
      'Understand the importance of community involvement',
      'Be sensitive to religious practices and prayer times',
      'Honor traditional herbs and remedies when safe'
    ],
    icon: '🕌',
    supportTips: [
      'Ask about appropriate visiting times around prayers',
      'Respect modest dress codes in their home',
      'Understand fasting periods and dietary restrictions',
      'Offer gender-appropriate support when requested'
    ]
  },
  {
    id: 4,
    culture: 'African/African American',
    tradition: 'Village Support System',
    description: 'Community-based care with emphasis on spiritual support and shared wisdom.',
    considerations: [
      'Honor the role of elder women in guidance',
      'Respect spiritual and religious practices',
      'Understand historical trauma affecting healthcare trust',
      'Support traditional foods and remedies'
    ],
    icon: '🌍',
    supportTips: [
      'Build trust through consistent, respectful actions',
      'Ask about preferred spiritual or religious support',
      'Respect traditional foods and cooking methods',
      'Understand the importance of community connections'
    ]
  },
  {
    id: 5,
    culture: 'Indigenous',
    tradition: 'Sacred Motherhood Practices',
    description: 'Ceremonial practices, connection to nature, and tribal community support.',
    considerations: [
      'Respect sacred practices and ceremonies',
      'Understand connection to land and nature',
      'Honor tribal-specific traditions and protocols',
      'Be sensitive to historical healthcare trauma'
    ],
    icon: '🦅',
    supportTips: [
      'Ask permission before participating in cultural practices',
      'Respect sacred objects and spaces',
      'Support connection to tribal community',
      'Learn about specific tribal traditions'
    ]
  },
  {
    id: 6,
    culture: 'European',
    tradition: 'Varied Regional Practices',
    description: 'Diverse traditions from formal visiting protocols to specific postpartum foods.',
    considerations: [
      'Understand formal vs. informal cultural approaches',
      'Respect regional food traditions',
      'Honor different concepts of privacy and family time',
      'Be aware of varied religious practices'
    ],
    icon: '🏰',
    supportTips: [
      'Ask about their specific family traditions',
      'Respect preferences for formal or casual support',
      'Understand different concepts of personal space',
      'Support traditional foods and celebrations'
    ]
  }
];

const universalPrinciples = [
  {
    title: 'Ask, Don\'t Assume',
    description: 'Every family is unique. Ask what traditions and practices are important to them.',
    icon: '❓'
  },
  {
    title: 'Respect Boundaries',
    description: 'Honor their comfort levels with different types of support and interaction.',
    icon: '🚧'
  },
  {
    title: 'Stay Curious',
    description: 'Approach cultural differences with genuine interest and respect.',
    icon: '🤔'
  },
  {
    title: 'Adapt Your Support',
    description: 'Modify your help to align with their cultural values and needs.',
    icon: '🔄'
  },
  {
    title: 'Build Trust',
    description: 'Acknowledge that trust may take time, especially with healthcare providers.',
    icon: '🤝'
  },
  {
    title: 'Honor Wisdom',
    description: 'Recognize that traditional practices often have deep meaning and value.',
    icon: '🧠'
  }
];

export default function CulturalSensitivityGuidePage() {
  const [selectedCulture, setSelectedCulture] = useState<number | null>(null);
  const [checkedPrinciples, setCheckedPrinciples] = useState<number[]>([]);

  const togglePrinciple = (index: number) => {
    setCheckedPrinciples(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleDownload = async () => {
    try {
      const { generateResourcePDF, PDFDocument } = await import('@/lib/pdf-generator');
      
      const doc: PDFDocument = {
        title: 'Cultural Sensitivity Guide',
        subtitle: 'Supporting Diverse Families in Maternal Care',
        sections: [
          {
            title: 'Introduction',
            content: `Every family brings unique cultural traditions and values to their parenting journey. This guide helps you honor and support diverse cultural practices while providing meaningful care and support.

Understanding cultural differences isn't about memorizing specific practices—it's about approaching each family with curiosity, respect, and openness to learn.`,
            type: 'highlight'
          },
          {
            title: 'Universal Principles',
            content: `These principles apply across all cultures and help create a foundation of respect:`,
            items: universalPrinciples.map(principle => ({
              title: principle.title,
              description: principle.description
            })),
            type: 'tips'
          },
          ...culturalConsiderations.map(culture => ({
            title: culture.culture,
            content: culture.description,
            items: [
              {
                title: 'Common Practices',
                description: culture.commonPractices.join('\n')
              },
              {
                title: 'Communication Style',
                description: culture.communicationStyle.join('\n')
              },
              {
                title: 'Key Considerations',
                description: culture.considerations.join('\n')
              }
            ],
            type: 'normal' as const
          })),
          {
            title: 'Questions to Ask All Families',
            content: `Use these open-ended questions to understand each family's unique needs:`,
            checklistItems: [
              'What traditions or practices are important to you during this time?',
              'How does your family typically celebrate new babies?',
              'Are there any foods, practices, or items that are especially meaningful?',
              'Who in your family/community traditionally provides support?',
              'What would make you feel most comfortable and respected?',
              'Are there any practices you want us to be aware of?',
              'How can we best honor your family\'s values?',
              'What role do extended family members play in your culture?',
              'Are there any religious or spiritual practices we should know about?',
              'How do you prefer to receive information and support?'
            ],
            type: 'checklist'
          },
          {
            title: 'Common Mistakes to Avoid',
            content: `Be mindful of these common pitfalls when supporting diverse families:`,
            items: [
              {
                title: 'Making assumptions',
                description: 'Never assume all families from a culture follow the same practices.'
              },
              {
                title: 'Ignoring individual preferences',
                description: 'Culture influences but doesn\'t determine individual choices.'
              },
              {
                title: 'Overemphasizing differences',
                description: 'Focus on shared human experiences while respecting uniqueness.'
              },
              {
                title: 'Being afraid to ask',
                description: 'Respectful questions show care and interest, not ignorance.'
              },
              {
                title: 'Imposing your values',
                description: 'Support their choices even if different from your own.'
              }
            ],
            type: 'warning'
          },
          {
            title: 'Building Cultural Competence',
            content: `Developing cultural sensitivity is an ongoing journey:`,
            items: [
              {
                title: 'Stay curious',
                description: 'Approach each family as unique individuals with their own story.'
              },
              {
                title: 'Listen actively',
                description: 'Pay attention to what families tell you about their needs and values.'
              },
              {
                title: 'Educate yourself',
                description: 'Learn about different cultures but don\'t assume expertise.'
              },
              {
                title: 'Reflect on your biases',
                description: 'We all have cultural lenses—acknowledge yours.'
              },
              {
                title: 'Seek feedback',
                description: 'Ask families how you can better support them.'
              }
            ],
            type: 'highlight'
          },
          {
            title: 'Remember',
            content: `Cultural sensitivity isn't about being perfect—it's about being respectful, curious, and willing to learn. Every family deserves support that honors their values and traditions.

When you approach families with genuine interest and respect for their cultural background, you create an environment where they feel safe, valued, and truly supported.

The goal is not to be an expert on every culture, but to be an expert at asking, listening, and adapting your support to meet each family where they are.`,
            type: 'normal'
          }
        ]
      };
      
      await generateResourcePDF(doc, 'cultural-sensitivity-guide');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/resources"
                className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
              </Link>
              <h1 className="text-4xl font-playfair text-gray-800 mb-4">
                Cultural Sensitivity Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Honor diverse parenting traditions and provide culturally respectful support 
                to families from all backgrounds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Download Complete Guide</h2>
              <p className="text-purple-100 mb-6">
                Get this comprehensive resource as a PDF you can reference anytime.
              </p>
              <div className="flex items-center gap-4 text-sm text-purple-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>6+ cultural traditions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Evidence-based</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Family-tested</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Universal Principles */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">Universal Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universalPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 shadow-soft transition-all duration-200 ${
                  checkedPrinciples.includes(index) 
                    ? 'ring-2 ring-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' 
                    : 'hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{principle.icon}</span>
                    <h3 className="font-semibold text-gray-800">{principle.title}</h3>
                  </div>
                  <button
                    onClick={() => togglePrinciple(index)}
                    className={`p-2 rounded-full transition-all ${
                      checkedPrinciples.includes(index)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-purple-100 hover:text-purple-500'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-700">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cultural Considerations */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">Cultural Considerations</h2>
          <div className="space-y-6">
            {culturalConsiderations.map((culture) => (
              <motion.div
                key={culture.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: culture.id * 0.1 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setSelectedCulture(selectedCulture === culture.id ? null : culture.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{culture.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{culture.culture}</h3>
                        <p className="text-purple-600 font-medium">{culture.tradition}</p>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${
                      selectedCulture === culture.id ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {selectedCulture === culture.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 border-t border-gray-100"
                  >
                    <div className="pt-6">
                      <p className="text-gray-700 mb-6">{culture.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Key Considerations:</h4>
                          <ul className="space-y-2">
                            {culture.considerations.map((consideration, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                {consideration}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">How to Support:</h4>
                          <ul className="space-y-2">
                            {culture.supportTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-white rounded-2xl p-8 shadow-soft"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              Building Bridges Through Understanding
            </h2>
            <p className="text-gray-600 mb-8">
              Cultural sensitivity isn't about being perfect—it's about being open, respectful, 
              and willing to learn. Every small step toward understanding makes a meaningful difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Learn More About Our Approach
              </Link>
              <Link
                href="/resources"
                className="border-2 border-purple-500 text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all"
              >
                Explore More Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}