'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Clock, Heart, CheckCircle, Phone, 
  ArrowLeft, ExternalLink, Users, Brain,
  Shield, Lightbulb, MessageCircle
} from 'lucide-react';
import Link from 'next/link';

const immediateHelp = [
  {
    sign: 'Thoughts of hurting yourself or your baby',
    severity: 'emergency',
    action: 'Call 911 or go to emergency room immediately'
  },
  {
    sign: 'Hallucinations or hearing voices',
    severity: 'emergency',
    action: 'Seek immediate medical attention'
  },
  {
    sign: 'Severe confusion or inability to think clearly',
    severity: 'emergency',
    action: 'Have someone take you to emergency room'
  },
  {
    sign: 'Cannot care for yourself or your baby',
    severity: 'emergency',
    action: 'Call for immediate help from family/emergency services'
  },
  {
    sign: 'Feeling completely disconnected from reality',
    severity: 'emergency',
    action: 'Emergency medical evaluation needed'
  }
];

const urgentHelp = [
  {
    sign: 'Persistent thoughts of death or dying',
    severity: 'urgent',
    action: 'Contact therapist or crisis line within 24 hours'
  },
  {
    sign: 'Severe anxiety or daily panic attacks',
    severity: 'urgent',
    action: 'Schedule therapy appointment this week'
  },
  {
    sign: 'Cannot sleep for several days in a row',
    severity: 'urgent',
    action: 'Contact healthcare provider immediately'
  },
  {
    sign: 'Cannot eat or significant weight loss',
    severity: 'urgent',
    action: 'Medical evaluation needed this week'
  },
  {
    sign: 'Extreme mood swings affecting daily life',
    severity: 'urgent',
    action: 'Professional mental health assessment needed'
  },
  {
    sign: 'Obsessive worries about baby\'s safety',
    severity: 'urgent',
    action: 'Specialized maternal mental health support'
  }
];

const weeklyHelp = [
  {
    sign: 'Feeling sad or anxious most days',
    severity: 'moderate',
    action: 'Schedule therapy consultation within 1-2 weeks'
  },
  {
    sign: 'Difficulty bonding with your baby',
    severity: 'moderate',
    action: 'Maternal mental health specialist recommended'
  },
  {
    sign: 'Sleep problems (too much or too little)',
    severity: 'moderate',
    action: 'Discuss with healthcare provider'
  },
  {
    sign: 'Loss of interest in activities you used to enjoy',
    severity: 'moderate',
    action: 'Mental health screening recommended'
  },
  {
    sign: 'Feeling overwhelmed by daily tasks',
    severity: 'moderate',
    action: 'Support services and therapy can help'
  },
  {
    sign: 'Guilt or shame about being a mother',
    severity: 'moderate',
    action: 'Specialized postpartum support groups'
  }
];

const selfCareHelp = [
  {
    sign: 'Occasional stress or feeling tired',
    severity: 'mild',
    action: 'Self-care strategies and peer support'
  },
  {
    sign: 'Adjusting to new routines',
    severity: 'mild',
    action: 'Normal transition - continue monitoring'
  },
  {
    sign: 'Need information about postpartum changes',
    severity: 'mild',
    action: 'Educational resources and support groups'
  },
  {
    sign: 'Wanting to connect with other moms',
    severity: 'mild',
    action: 'Mom groups and community resources'
  }
];

const actionSteps = [
  {
    title: 'Assess Your Situation',
    description: 'Use this guide to identify which category best describes your experience',
    icon: <Brain className="w-8 h-8" />,
    color: 'bg-blue-500'
  },
  {
    title: 'Take Immediate Action',
    description: 'Follow the recommended action for your situation level',
    icon: <AlertTriangle className="w-8 h-8" />,
    color: 'bg-yellow-500'
  },
  {
    title: 'Build Your Support Team',
    description: 'Connect with professionals, family, and peer support',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-green-500'
  },
  {
    title: 'Create a Safety Plan',
    description: 'Have numbers, strategies, and support ready for tough days',
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-purple-500'
  }
];

const myths = [
  {
    myth: "I should be able to handle this on my own",
    truth: "Seeking help is a sign of strength and good parenting"
  },
  {
    myth: "Other moms seem to have it all together",
    truth: "Many mothers struggle - you're not seeing the full picture"
  },
  {
    myth: "This will go away on its own",
    truth: "Professional support can help you feel better faster"
  },
  {
    myth: "I'm a bad mother for feeling this way",
    truth: "Mental health challenges don't reflect your love for your child"
  }
];

export default function WhenToSeekHelpPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');


  const renderHelpLevel = (items: any[], title: string, bgColor: string, textColor: string, icon: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-2xl p-6 mb-8`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${textColor} p-2 bg-white rounded-lg`}>
          {icon}
        </div>
        <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 ${textColor.replace('text', 'bg')} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium mb-2">{item.sign}</p>
                <p className={`text-sm ${textColor} font-semibold`}>
                  → {item.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

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
                When to Seek Help Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Understanding when and how to get support for your mental health. 
                This guide helps you recognize signs and take appropriate action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">

        {/* Action Steps Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">How to Use This Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Help Levels */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">Levels of Support Needed</h2>
          
          {/* Emergency Help */}
          {renderHelpLevel(
            immediateHelp,
            '🚨 EMERGENCY - Get Help Now',
            'bg-red-50',
            'text-red-700',
            <AlertTriangle className="w-6 h-6" />
          )}

          {/* Urgent Help */}
          {renderHelpLevel(
            urgentHelp,
            '⚠️ URGENT - Within 24-48 Hours',
            'bg-orange-50',
            'text-orange-700',
            <Clock className="w-6 h-6" />
          )}

          {/* Weekly Help */}
          {renderHelpLevel(
            weeklyHelp,
            '📅 MODERATE - Within 1-2 Weeks',
            'bg-yellow-50',
            'text-yellow-700',
            <CheckCircle className="w-6 h-6" />
          )}

          {/* Self-Care Help */}
          {renderHelpLevel(
            selfCareHelp,
            '🌱 MILD - Self-Care & Monitoring',
            'bg-green-50',
            'text-green-700',
            <Heart className="w-6 h-6" />
          )}
        </div>

        {/* Myths vs Truth */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">Common Myths About Seeking Help</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {myths.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-red-600 mb-2">❌ Myth:</h4>
                  <p className="text-gray-700 italic">"{item.myth}"</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-2">✅ Truth:</h4>
                  <p className="text-gray-700 font-medium">{item.truth}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-2xl p-8 mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-playfair text-red-800 mb-4">Emergency Resources</h2>
            <p className="text-red-700">Keep these numbers accessible for immediate help</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Emergency</h3>
              <p className="text-2xl font-bold text-red-600">911</p>
              <p className="text-sm text-red-700 mt-2">Life-threatening situations</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <MessageCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Crisis Line</h3>
              <p className="text-2xl font-bold text-red-600">988</p>
              <p className="text-sm text-red-700 mt-2">Suicide prevention lifeline</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Postpartum</h3>
              <p className="text-lg font-bold text-red-600">1-800-944-4773</p>
              <p className="text-sm text-red-700 mt-2">Maternal mental health</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-white rounded-2xl p-8 shadow-soft"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-gray-600 mb-8">
              Seeking help early leads to better outcomes. Don't wait until things feel 
              overwhelming—support is available at every level of need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/resources/crisis-hotlines"
                className="border-2 border-purple-500 text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all"
              >
                Crisis Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
