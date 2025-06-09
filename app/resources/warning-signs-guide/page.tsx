'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Clock, Heart, ArrowLeft, 
  Phone, CheckCircle, Eye, Brain, Users, Calendar,
  Shield, Lightbulb, MessageCircle, Star
} from 'lucide-react';
import Link from 'next/link';

const warningLevels = [
  {
    level: 'Emergency - Call 911',
    color: 'bg-red-500',
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    timeframe: 'IMMEDIATE',
    icon: <AlertTriangle className="w-6 h-6" />,
    signs: [
      'Thoughts of hurting yourself or your baby',
      'Hearing voices or seeing things that aren\'t there',
      'Severe confusion or inability to think clearly',
      'Cannot care for yourself or your baby at all',
      'Feeling completely disconnected from reality',
      'Thoughts that someone wants to harm you or baby'
    ],
    actions: [
      'Call 911 immediately',
      'Go to nearest emergency room',
      'Have someone stay with you',
      'Don\'t leave the person alone',
      'Remove any potentially harmful objects'
    ]
  },
  {
    level: 'Crisis - Call Within Hours',
    color: 'bg-orange-500',
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    timeframe: 'WITHIN 2-24 HOURS',
    icon: <Clock className="w-6 h-6" />,
    signs: [
      'Persistent thoughts of death or dying',
      'Severe anxiety or daily panic attacks',
      'Cannot sleep for several days in a row',
      'Cannot eat or significant weight loss',
      'Extreme mood swings affecting daily life',
      'Obsessive thoughts about baby\'s safety that interfere with functioning'
    ],
    actions: [
      'Call crisis hotline: 988',
      'Contact healthcare provider immediately',
      'Call Postpartum Support International: 1-800-944-4773',
      'Arrange for immediate support person',
      'Schedule emergency therapy appointment'
    ]
  },
  {
    level: 'Urgent - This Week',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    timeframe: 'WITHIN 1-7 DAYS',
    icon: <Calendar className="w-6 h-6" />,
    signs: [
      'Feeling sad, anxious, or empty most days',
      'Difficulty bonding with your baby',
      'Sleep problems (too much or too little)',
      'Loss of interest in activities you used to enjoy',
      'Feeling overwhelmed by daily tasks',
      'Guilt or shame about being a mother',
      'Appetite changes or eating disorders',
      'Difficulty concentrating or making decisions'
    ],
    actions: [
      'Schedule therapy appointment this week',
      'Contact healthcare provider',
      'Join a support group',
      'Arrange for additional help at home',
      'Consider medication evaluation'
    ]
  },
  {
    level: 'Monitor - This Month',
    color: 'bg-blue-500',
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-50',
    timeframe: 'WITHIN 2-4 WEEKS',
    icon: <Eye className="w-6 h-6" />,
    signs: [
      'Occasional stress or feeling tired',
      'Adjusting to new routines and changes',
      'Need information about postpartum changes',
      'Wanting to connect with other parents',
      'Minor mood fluctuations',
      'Concerns about parenting abilities'
    ],
    actions: [
      'Continue monitoring symptoms',
      'Use self-care strategies',
      'Connect with peer support',
      'Access educational resources',
      'Maintain regular check-ins with healthcare provider'
    ]
  }
];

const riskFactors = [
  {
    category: 'Personal History',
    factors: [
      'Previous depression or anxiety',
      'History of trauma or abuse',
      'Previous postpartum depression',
      'Family history of mental illness',
      'Substance abuse history'
    ]
  },
  {
    category: 'Pregnancy & Birth',
    factors: [
      'Difficult or traumatic birth experience',
      'Premature baby or NICU stay',
      'Breastfeeding difficulties',
      'Unplanned pregnancy',
      'Multiple births (twins, triplets)'
    ]
  },
  {
    category: 'Life Circumstances',
    factors: [
      'Lack of support from partner or family',
      'Financial stress',
      'Relationship problems',
      'Major life changes or losses',
      'Social isolation'
    ]
  },
  {
    category: 'Physical Factors',
    factors: [
      'Hormonal changes',
      'Sleep deprivation',
      'Thyroid problems',
      'Chronic pain or illness',
      'Medication side effects'
    ]
  }
];

const supportResources = [
  {
    type: 'Emergency',
    resources: [
      { name: 'Emergency Services', contact: '911', description: 'Life-threatening situations' },
      { name: 'National Suicide Prevention Lifeline', contact: '988', description: '24/7 crisis support' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', description: 'Text-based crisis support' }
    ]
  },
  {
    type: 'Maternal Mental Health',
    resources: [
      { name: 'Postpartum Support International', contact: '1-800-944-4773', description: 'Specialized maternal mental health support' },
      { name: 'PSI Online Support Groups', contact: 'postpartum.net', description: 'Peer support groups' },
      { name: 'Local Maternal Mental Health Specialists', contact: 'Your healthcare provider', description: 'Professional treatment' }
    ]
  },
  {
    type: 'General Support',
    resources: [
      { name: 'SAMHSA National Helpline', contact: '1-800-662-4357', description: 'Mental health treatment referrals' },
      { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233', description: 'If safety is a concern' },
      { name: 'La Leche League', contact: 'llli.org', description: 'Breastfeeding support' }
    ]
  }
];

export default function WarningSignsGuidePage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
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
                Warning Signs Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Recognize when professional help is needed. Understanding warning signs 
                helps you get support at the right time for the best outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">

        {/* Warning Levels Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {warningLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => setSelectedLevel(index)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedLevel === index
                  ? `${level.color} text-white shadow-lg`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {level.icon}
              <div className="text-left">
                <div className="text-sm font-bold">{level.timeframe}</div>
                <div className="text-xs">{level.level}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Warning Level Details */}
        <motion.div
          key={selectedLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${warningLevels[selectedLevel].bgColor} rounded-2xl p-8 mb-12`}
        >
          <div className="text-center mb-8">
            <div className={`w-20 h-20 ${warningLevels[selectedLevel].color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
              {warningLevels[selectedLevel].icon}
            </div>
            <h2 className={`text-3xl font-bold ${warningLevels[selectedLevel].textColor} mb-2`}>
              {warningLevels[selectedLevel].level}
            </h2>
            <p className={`text-lg ${warningLevels[selectedLevel].textColor} font-medium`}>
              {warningLevels[selectedLevel].timeframe}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Warning Signs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold ${warningLevels[selectedLevel].textColor} mb-4 flex items-center gap-2`}>
                <Eye className="w-5 h-5" />
                Warning Signs
              </h3>
              <div className="space-y-3">
                {warningLevels[selectedLevel].signs.map((sign, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-3 h-3 ${warningLevels[selectedLevel].color} rounded-full mt-2 flex-shrink-0`}></div>
                    <p className="text-gray-700">{sign}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold ${warningLevels[selectedLevel].textColor} mb-4 flex items-center gap-2`}>
                <CheckCircle className="w-5 h-5" />
                Recommended Actions
              </h3>
              <div className="space-y-3">
                {warningLevels[selectedLevel].actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className={`w-4 h-4 ${warningLevels[selectedLevel].textColor} mt-1 flex-shrink-0`} />
                    <p className="text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Factors */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Risk Factors to Be Aware Of</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Having risk factors doesn't mean you will develop postpartum depression, but awareness helps with early detection and prevention.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {riskFactors.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-2">
                  {category.factors.map((factor, factorIndex) => (
                    <div key={factorIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{factor}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Support Resources</h2>
          <div className="space-y-6">
            {supportResources.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  {category.type}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{resource.name}</h4>
                      <p className="text-red-600 font-bold mb-2">{resource.contact}</p>
                      <p className="text-gray-600 text-sm">{resource.description}</p>
                    </div>
                  ))}
                </div>
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
              Trust Your Instincts
            </h2>
            <p className="text-gray-600 mb-8">
              If something feels wrong, don't wait. Early intervention leads to better outcomes. 
              You know yourself and your body best—trust those feelings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/resources/crisis-hotlines"
                className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Emergency Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
