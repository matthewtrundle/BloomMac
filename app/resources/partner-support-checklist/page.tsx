'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, CheckCircle, Clock, ArrowLeft, Download, 
  Coffee, Users, MessageCircle, Home, Baby, 
  Calendar, Shield, Lightbulb, Phone
} from 'lucide-react';
import Link from 'next/link';

const dailySupport = [
  {
    category: 'Physical Care',
    icon: <Baby className="w-5 h-5" />,
    items: [
      'Offer to take a feeding shift (if bottle feeding)',
      'Change diapers without being asked',
      'Rock baby to sleep so partner can rest',
      'Take over when partner needs a break',
      'Prep bottles or pumping supplies'
    ]
  },
  {
    category: 'Emotional Support',
    icon: <Heart className="w-5 h-5" />,
    items: [
      'Ask "How are you feeling today?" and listen',
      'Acknowledge the hard work of caring for baby',
      'Offer physical affection (hugs, hand-holding)',
      'Validate feelings without trying to "fix"',
      'Express gratitude for their mothering'
    ]
  },
  {
    category: 'Practical Help',
    icon: <Home className="w-5 h-5" />,
    items: [
      'Handle meal prep or order takeout',
      'Do laundry, especially baby clothes',
      'Keep living spaces tidy',
      'Take care of dishes after meals',
      'Manage household logistics and appointments'
    ]
  },
  {
    category: 'Communication',
    icon: <MessageCircle className="w-5 h-5" />,
    items: [
      'Check in without judgment',
      'Ask what they need rather than assume',
      'Listen to concerns about baby or themselves',
      'Share your own feelings appropriately',
      'Problem-solve together, not for them'
    ]
  }
];

const weeklySupport = [
  {
    category: 'Self-Care Facilitation',
    icon: <Coffee className="w-5 h-5" />,
    items: [
      'Encourage and facilitate shower/bath time',
      'Take baby for a walk so partner can nap',
      'Plan a solo grocery trip or coffee date',
      'Arrange childcare for a few hours',
      'Support partner\'s hobbies or interests'
    ]
  },
  {
    category: 'Social Connection',
    icon: <Users className="w-5 h-5" />,
    items: [
      'Arrange visits with friends (with partner\'s consent)',
      'Join parent groups or classes together',
      'Video call family members for support',
      'Connect with other parent couples',
      'Plan low-key social activities'
    ]
  },
  {
    category: 'Health & Wellness',
    icon: <Shield className="w-5 h-5" />,
    items: [
      'Help schedule and attend doctor appointments',
      'Encourage healthy eating and hydration',
      'Support gentle exercise when ready',
      'Monitor for signs of postpartum depression',
      'Facilitate therapy or counseling if needed'
    ]
  }
];

const monthlySupport = [
  {
    category: 'Relationship Care',
    items: [
      'Plan date nights (even 30 minutes at home)',
      'Have honest conversations about needs',
      'Work together on relationship goals',
      'Celebrate parenting milestones together',
      'Revisit household responsibility sharing'
    ]
  },
  {
    category: 'Future Planning',
    items: [
      'Discuss family planning decisions together',
      'Plan for childcare and work transitions',
      'Set realistic family goals and expectations',
      'Budget for family needs and self-care',
      'Evaluate what\'s working and what needs adjustment'
    ]
  }
];

const redFlags = [
  {
    sign: 'Persistent sadness or crying for more than 2 weeks',
    action: 'Encourage professional evaluation immediately'
  },
  {
    sign: 'Loss of interest in baby or inability to bond',
    action: 'Contact healthcare provider within 48 hours'
  },
  {
    sign: 'Thoughts of hurting self or baby',
    action: 'Call crisis line or go to emergency room'
  },
  {
    sign: 'Severe anxiety or panic attacks',
    action: 'Schedule therapy appointment this week'
  },
  {
    sign: 'Inability to sleep when baby sleeps',
    action: 'Discuss with doctor and consider sleep support'
  },
  {
    sign: 'Complete loss of appetite or overeating',
    action: 'Medical evaluation needed'
  }
];

const supportivePhrases = [
  "You're doing an amazing job",
  "This is really hard, and you're handling it so well",
  "What can I do to help you right now?",
  "I see how much you love our baby",
  "You're not alone in this",
  "It's okay to feel overwhelmed",
  "Thank you for taking such good care of our family",
  "I believe in you",
  "Your feelings are valid",
  "We'll figure this out together"
];

const avoidSaying = [
  "At least the baby is healthy",
  "You should sleep when the baby sleeps",
  "Other moms seem to handle this fine",
  "You're being too emotional",
  "Just enjoy this time",
  "It could be worse",
  "You asked for this",
  "Maybe you should try harder",
  "I'm tired too",
  "The baby needs you to be strong"
];

export default function PartnerSupportChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('daily');

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const handleDownload = async () => {
    try {
      const { generateResourcePDF, PDFDocument } = await import('@/lib/pdf-generator');
      
      // Create comprehensive PDF document
      const pdfDocument: PDFDocument = {
        title: 'Partner Support Checklist',
        subtitle: 'Daily, Weekly & Monthly Ways to Support Your Partner',
        author: 'Bloom Psychology North Austin',
        description: 'A comprehensive guide for partners to provide meaningful support during the postpartum period. Check off actions as you complete them to track your support efforts.',
        sections: [
          {
            title: 'Daily Support Actions',
            type: 'normal',
            content: 'Small, consistent actions you can take every day to show support and care.',
            items: []
          },
          ...dailySupport.map(category => ({
            title: category.category,
            type: 'checklist' as const,
            items: category.items
          })),
          {
            title: 'Weekly Support Actions',
            type: 'normal',
            content: 'Planned activities and support efforts to do each week.',
            items: []
          },
          ...weeklySupport.map(category => ({
            title: category.category,
            type: 'checklist' as const,
            items: category.items
          })),
          {
            title: 'Monthly Support Actions',
            type: 'normal',
            content: 'Bigger picture support and planning activities.',
            items: []
          },
          ...monthlySupport.map(category => ({
            title: category.category,
            type: 'checklist' as const,
            items: category.items
          })),
          {
            title: 'When to Seek Help Immediately',
            type: 'warning',
            content: 'These signs require immediate professional attention. Do not wait.',
            items: redFlags.map(flag => `${flag.sign} → ${flag.action}`)
          },
          {
            title: 'Supportive Communication',
            type: 'tips',
            content: 'What TO say to show love and support:',
            items: supportivePhrases.map(phrase => `"${phrase}"`)
          },
          {
            title: 'Avoid These Phrases',
            type: 'warning',
            content: 'Well-meaning but unhelpful things to avoid saying:',
            items: avoidSaying.map(phrase => `"${phrase}"`)
          },
          {
            title: 'Remember',
            type: 'highlight',
            content: 'Your partner needs your support, not your solutions. Listen more than you speak. Be present more than you fix. Love more than you judge.'
          }
        ]
      };
      
      generateResourcePDF(pdfDocument, 'partner-support-checklist-bloom.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
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
                Partner Support Checklist
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Practical, daily ways to support your partner through pregnancy, postpartum, 
                and beyond. Small actions that make a big difference.
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
          className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Download Your Checklist</h2>
              <p className="text-pink-100 mb-6">
                Get this comprehensive guide as a PDF to reference anytime and share with your support network.
              </p>
              <div className="flex items-center gap-4 text-sm text-pink-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Daily & weekly actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Communication tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Warning signs guide</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'daily', label: 'Daily Support', icon: <Clock className="w-4 h-4" /> },
            { id: 'weekly', label: 'Weekly Support', icon: <Calendar className="w-4 h-4" /> },
            { id: 'warning', label: 'Warning Signs', icon: <Shield className="w-4 h-4" /> },
            { id: 'communication', label: 'Communication', icon: <MessageCircle className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Support Tab */}
        {activeTab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-gray-800 mb-4">Daily Support Actions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Small, consistent actions you can take every day to show support and care. 
                Check off items as you complete them!
              </p>
            </div>

            {dailySupport.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <label
                      key={itemIndex}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item)}
                        onChange={() => toggleItem(item)}
                        className="mt-1 h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <span className={`text-gray-700 group-hover:text-gray-900 transition-colors ${
                        checkedItems.has(item) ? 'line-through text-gray-500' : ''
                      }`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Weekly Support Tab */}
        {activeTab === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-gray-800 mb-4">Weekly Support Actions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bigger picture support that helps build resilience and long-term wellbeing.
              </p>
            </div>

            {weeklySupport.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <label
                      key={itemIndex}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item)}
                        onChange={() => toggleItem(item)}
                        className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className={`text-gray-700 group-hover:text-gray-900 transition-colors ${
                        checkedItems.has(item) ? 'line-through text-gray-500' : ''
                      }`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Monthly Support */}
            <div className="space-y-6">
              <h3 className="text-2xl font-playfair text-gray-800 text-center">Monthly Support Actions</h3>
              {monthlySupport.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">{category.category}</h4>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <label
                        key={itemIndex}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(item)}
                          onChange={() => toggleItem(item)}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className={`text-gray-700 group-hover:text-gray-900 transition-colors ${
                          checkedItems.has(item) ? 'line-through text-gray-500' : ''
                        }`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Warning Signs Tab */}
        {activeTab === 'warning' && (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-gray-800 mb-4">When to Seek Professional Help</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Recognize these warning signs and know when to encourage professional support.
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-red-800 mb-2">Important Warning Signs</h3>
                <p className="text-red-700">If you notice these signs, encourage professional help immediately</p>
              </div>

              <div className="space-y-6">
                {redFlags.map((flag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-red-600 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium mb-2">{flag.sign}</p>
                        <p className="text-red-700 font-semibold">
                          → {flag.action}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-red-100 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-red-700" />
                  <h4 className="text-lg font-semibold text-red-800">Emergency Resources</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-red-800">Emergency: 911</p>
                    <p className="text-red-700">Life-threatening situations</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Crisis Line: 988</p>
                    <p className="text-red-700">Suicide prevention lifeline</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Postpartum: 1-800-944-4773</p>
                    <p className="text-red-700">Maternal mental health support</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <motion.div
            key="communication"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-gray-800 mb-4">Communication Guide</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                What to say (and what not to say) to provide meaningful emotional support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* What TO Say */}
              <div className="bg-green-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800">What TO Say</h3>
                  <p className="text-green-700">Supportive phrases that help</p>
                </div>

                <div className="space-y-4">
                  {supportivePhrases.map((phrase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <p className="text-gray-800 italic">"{phrase}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* What NOT to Say */}
              <div className="bg-red-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">❌</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-red-800">What NOT to Say</h3>
                  <p className="text-red-700">Phrases that can hurt (even when well-intentioned)</p>
                </div>

                <div className="space-y-4">
                  {avoidSaying.map((phrase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <p className="text-gray-800 italic">"{phrase}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Communication Tips */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Communication Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue-800">Listen More Than You Speak</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Ask open-ended questions</li>
                    <li>• Avoid immediately trying to "fix" things</li>
                    <li>• Validate their feelings</li>
                    <li>• Give them space to express emotions</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue-800">Show Support Through Actions</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Follow through on what you say you'll do</li>
                    <li>• Anticipate needs when possible</li>
                    <li>• Be patient with mood changes</li>
                    <li>• Celebrate small victories together</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-white rounded-2xl p-8 shadow-soft mt-12"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              Supporting Your Partner Supports Your Family
            </h2>
            <p className="text-gray-600 mb-8">
              Remember: taking care of your partner's mental health benefits everyone. 
              Don't hesitate to seek additional support when needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Get Professional Support
              </Link>
              <Link
                href="/resources"
                className="border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-pink-500 hover:text-white transition-all"
              >
                Browse More Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}