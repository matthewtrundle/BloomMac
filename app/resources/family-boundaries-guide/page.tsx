'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Heart, ArrowLeft, Download, 
  CheckCircle, Clock, Users, Shield,
  MessageCircle, Phone, Star, Gift,
  Calendar, Baby, Utensils, Camera
} from 'lucide-react';
import Link from 'next/link';

const boundaryCategories = [
  {
    category: 'Visiting Guidelines',
    icon: <Home className="w-6 h-6" />,
    color: 'bg-blue-500',
    boundaries: [
      {
        boundary: 'Call or text before visiting',
        reason: 'New parents need predictability and may be sleeping, feeding, or bonding',
        respectful: 'Ask: "When would be a good time to visit this week?"',
        disrespectful: 'Showing up unannounced at any time'
      },
      {
        boundary: 'Keep visits short (30-60 minutes)',
        reason: 'Long visits can be exhausting when you\'re already sleep-deprived',
        respectful: 'Set expectations: "We\'d love to visit for about an hour"',
        disrespectful: 'Staying for hours without checking in'
      },
      {
        boundary: 'Don\'t expect to be entertained',
        reason: 'New parents don\'t have energy to host traditional gatherings',
        respectful: 'Bring your own drinks, clean up after yourself',
        disrespectful: 'Expecting meals, entertainment, or hosting'
      },
      {
        boundary: 'Respect "no visitors" periods',
        reason: 'Some days are harder than others, and recovery takes time',
        respectful: 'Say: "No problem, let us know when you\'re ready"',
        disrespectful: 'Pressuring or making them feel guilty'
      }
    ]
  },
  {
    category: 'Baby Care Boundaries',
    icon: <Baby className="w-6 h-6" />,
    color: 'bg-pink-500',
    boundaries: [
      {
        boundary: 'Ask before holding the baby',
        reason: 'Parents are learning cues and may be working on feeding/sleep schedules',
        respectful: 'Wait to be offered or ask: "Would it be okay if I held them?"',
        disrespectful: 'Reaching for or demanding to hold the baby'
      },
      {
        boundary: 'Respect feeding choices',
        reason: 'Feeding decisions are personal and often complex',
        respectful: 'Support whatever feeding method they choose',
        disrespectful: 'Commenting on breastfeeding, formula, or pumping choices'
      },
      {
        boundary: 'Follow parents\' sleep routines',
        reason: 'Sleep training and routines are crucial for the whole family',
        respectful: 'Ask about nap times and respect them',
        disrespectful: 'Waking the baby or dismissing sleep schedules'
      },
      {
        boundary: 'Let parents make the decisions',
        reason: 'They\'re learning to trust their instincts and build confidence',
        respectful: 'Offer advice only when asked',
        disrespectful: 'Taking over or criticizing their parenting choices'
      }
    ]
  },
  {
    category: 'Emotional Support Boundaries',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-green-500',
    boundaries: [
      {
        boundary: 'Validate their feelings',
        reason: 'New parents experience a wide range of emotions that are all normal',
        respectful: 'Say: "This is really hard" or "You\'re doing great"',
        disrespectful: 'Minimizing feelings or saying "enjoy every moment"'
      },
      {
        boundary: 'Don\'t compare experiences',
        reason: 'Every pregnancy, birth, and parenting experience is unique',
        respectful: 'Listen without immediately sharing your own story',
        disrespectful: 'Starting sentences with "When I had kids..." or "At least..."'
      },
      {
        boundary: 'Respect their parenting style',
        reason: 'Confidence comes from making their own decisions and learning',
        respectful: 'Ask: "How can I best support what you\'re doing?"',
        disrespectful: 'Criticizing or constantly offering unsolicited advice'
      },
      {
        boundary: 'Give them space to struggle',
        reason: 'Learning and growth happen through working through challenges',
        respectful: 'Be available but don\'t immediately jump in to "fix" everything',
        disrespectful: 'Taking over tasks they\'re trying to learn'
      }
    ]
  },
  {
    category: 'Practical Help Boundaries',
    icon: <Gift className="w-6 h-6" />,
    color: 'bg-purple-500',
    boundaries: [
      {
        boundary: 'Ask what they actually need',
        reason: 'What\'s helpful varies greatly between families and situations',
        respectful: 'Ask: "What would be most helpful right now?"',
        disrespectful: 'Assuming you know what they need or giving unwanted help'
      },
      {
        boundary: 'Respect their systems',
        reason: 'New parents often develop specific ways of doing things',
        respectful: 'Ask how they like things done before jumping in',
        disrespectful: 'Reorganizing their space or changing their systems'
      },
      {
        boundary: 'Help without expectations',
        reason: 'True support comes without strings attached',
        respectful: 'Offer help and accept "no" gracefully',
        disrespectful: 'Expecting gratitude, reciprocation, or credit'
      },
      {
        boundary: 'Be reliable with commitments',
        reason: 'New parents rely on promised help and can\'t handle last-minute changes easily',
        respectful: 'Only offer what you can consistently provide',
        disrespectful: 'Making promises you can\'t keep or canceling frequently'
      }
    ]
  }
];

const helpfulActions = [
  {
    category: 'Meal Support',
    actions: [
      'Bring ready-to-eat meals that can be frozen',
      'Include heating instructions with any food',
      'Ask about dietary restrictions or preferences',
      'Bring disposable containers so they don\'t have to return dishes',
      'Offer to pick up groceries or takeout'
    ]
  },
  {
    category: 'Household Help',
    actions: [
      'Offer to do a load of laundry or dishes',
      'Bring toilet paper, paper towels, or other essentials',
      'Take out trash or recycling',
      'Help with pet care if they have animals',
      'Offer to run errands or make phone calls'
    ]
  },
  {
    category: 'Emotional Support',
    actions: [
      'Listen without trying to fix everything',
      'Validate their feelings and experiences',
      'Share encouragement and positive observations',
      'Check in via text without expecting immediate responses',
      'Remind them they\'re doing a good job'
    ]
  },
  {
    category: 'Sibling Support',
    actions: [
      'Offer to take older children for a few hours',
      'Bring activities or small gifts for older siblings',
      'Include older children in age-appropriate ways',
      'Help maintain older children\'s routines',
      'Give older siblings special attention'
    ]
  }
];

const communicationTips = [
  {
    tip: 'Use "I" statements',
    example: '"I\'d love to help with..." instead of "You should let me..."',
    why: 'Removes pressure and gives them choice'
  },
  {
    tip: 'Ask before giving advice',
    example: '"Would you like suggestions or just someone to listen?"',
    why: 'Respects their autonomy and current needs'
  },
  {
    tip: 'Be specific with offers',
    example: '"Can I bring dinner Tuesday?" instead of "Let me know if you need anything"',
    why: 'Makes it easier for them to accept help'
  },
  {
    tip: 'Follow their lead',
    example: 'If they\'re talking about challenges, don\'t immediately pivot to solutions',
    why: 'Sometimes they just need to be heard'
  },
  {
    tip: 'Respect their communication style',
    example: 'If they\'re not responding to texts quickly, don\'t take it personally',
    why: 'They have limited energy and bandwidth'
  }
];

export default function FamilyBoundariesGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;
      const maxWidth = pageWidth - (margin * 2);
      
      // Header
      pdf.setFillColor(200, 107, 147);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Family Boundaries Guide', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Supporting New Parents While Respecting Boundaries', pageWidth / 2, 28, { align: 'center' });
      
      let yPosition = 50;
      
      // Visiting guidelines
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🏠 Visiting Guidelines', margin, yPosition);
      yPosition += 12;
      
      const visitingTips = [
        'Call or text before visiting',
        'Keep visits short (30-60 minutes)',
        'Don\'t expect to be entertained',
        'Respect "no visitors" periods'
      ];
      
      visitingTips.forEach((tip) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitTip = pdf.splitTextToSize(tip, maxWidth - 10);
        pdf.text(splitTip, margin + 5, yPosition);
        yPosition += splitTip.length * lineHeight + 3;
      });
      
      yPosition += 10;
      
      // Baby care boundaries
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('👶 Baby Care Boundaries', margin, yPosition);
      yPosition += 12;
      
      const babyCare = [
        'Ask before holding the baby',
        'Respect feeding choices',
        'Follow parents\' sleep routines',
        'Let parents make the decisions'
      ];
      
      babyCare.forEach((tip) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitTip = pdf.splitTextToSize(tip, maxWidth - 10);
        pdf.text(splitTip, margin + 5, yPosition);
        yPosition += splitTip.length * lineHeight + 3;
      });
      
      yPosition += 15;
      
      // Helpful actions
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🎁 How to Help', margin, yPosition);
      yPosition += 12;
      
      const helpActions = [
        'Ask: "What would be most helpful right now?"',
        'Bring ready-to-eat meals in disposable containers',
        'Offer specific help: "Can I do a load of laundry?"',
        'Respect their systems and routines',
        'Be reliable with commitments'
      ];
      
      helpActions.forEach((action) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitAction = pdf.splitTextToSize(action, maxWidth - 10);
        pdf.text(splitAction, margin + 5, yPosition);
        yPosition += splitAction.length * lineHeight + 3;
      });
      
      yPosition += 15;
      
      // Communication tips
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('💬 Communication Tips', margin, yPosition);
      yPosition += 12;
      
      communicationTips.slice(0, 4).forEach((tip) => {
        pdf.setTextColor(200, 107, 147);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(tip.tip + ':', margin, yPosition);
        yPosition += 6;
        
        pdf.setTextColor(74, 56, 66);
        pdf.setFont('helvetica', 'normal');
        const splitExample = pdf.splitTextToSize(tip.example, maxWidth - 10);
        pdf.text(splitExample, margin + 5, yPosition);
        yPosition += splitExample.length * lineHeight + 5;
      });
      
      // Footer
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      yPosition += 15;
      pdf.setFillColor(248, 225, 231);
      pdf.rect(margin, yPosition, maxWidth, 25, 'F');
      
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Respecting boundaries shows love and support', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('When in doubt, ask what they need rather than assume.', pageWidth / 2, yPosition + 16, { align: 'center' });
      
      // Website footer
      yPosition += 35;
      pdf.setTextColor(200, 107, 147);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('bloompsychologynorthaustin.com', pageWidth / 2, yPosition, { align: 'center' });
      
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Specializing in Maternal Mental Health & Women\'s Wellness', pageWidth / 2, yPosition + 7, { align: 'center' });
      
      pdf.save('family-boundaries-guide-bloom-psychology.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                Family Boundaries Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Support new parents while respecting their boundaries. Learn how to help 
                in ways that truly serve the family during this sensitive time.
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
          className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Download Your Boundaries Guide</h2>
              <p className="text-blue-100 mb-6">
                Get this essential guide to supporting new families while respecting their needs and boundaries.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Visiting guidelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Communication tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  <span>Helpful actions</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {boundaryCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === index
                  ? `${category.color} text-white shadow-lg`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.icon}
              {category.category}
            </button>
          ))}
        </div>

        {/* Selected Category Details */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${boundaryCategories[selectedCategory].color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
              {boundaryCategories[selectedCategory].icon}
            </div>
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              {boundaryCategories[selectedCategory].category}
            </h2>
          </div>

          <div className="space-y-6">
            {boundaryCategories[selectedCategory].boundaries.map((boundary, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{boundary.boundary}</h3>
                  <p className="text-gray-600 italic">{boundary.reason}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Respectful Approach</h4>
                    </div>
                    <p className="text-green-700">{boundary.respectful}</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 text-red-600 font-bold">✗</span>
                      <h4 className="font-semibold text-red-800">Disrespectful Approach</h4>
                    </div>
                    <p className="text-red-700">{boundary.disrespectful}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">How to Be Genuinely Helpful</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {helpfulActions.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-3">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{action}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Communication Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Communication Guidelines</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communicationTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800">{tip.tip}</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-blue-600 font-medium text-sm mb-2">Example:</p>
                  <p className="text-gray-700 italic text-sm">"{tip.example}"</p>
                </div>
                
                <div>
                  <p className="text-green-600 font-medium text-sm mb-1">Why this works:</p>
                  <p className="text-gray-600 text-sm">{tip.why}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-12"
        >
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">Key Principles to Remember</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-blue-800 mb-2">When in doubt, ask</h4>
                <p className="text-gray-700 text-sm">It's better to ask what they need than to assume you know.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-blue-800 mb-2">Respect "no" gracefully</h4>
                <p className="text-gray-700 text-sm">Accept their boundaries without making them feel guilty.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-blue-800 mb-2">Follow their lead</h4>
                <p className="text-gray-700 text-sm">Let them guide the level of involvement they're comfortable with.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">Every family is different</h4>
                <p className="text-gray-700 text-sm">What worked for one family may not work for another.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">Support without strings</h4>
                <p className="text-gray-700 text-sm">Offer help without expecting gratitude or reciprocation.</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">Be patient</h4>
                <p className="text-gray-700 text-sm">Adjustment takes time, and needs change as families grow.</p>
              </div>
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
              Respecting Boundaries Shows Love
            </h2>
            <p className="text-gray-600 mb-8">
              When you respect a new family's boundaries, you're showing them that you value 
              their autonomy, well-being, and growing confidence as parents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resources/partner-support-checklist"
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all"
              >
                Partner Support Guide
              </Link>
              <Link
                href="/resources/helpful-vs-harmful-checklist"
                className="border-2 border-blue-500 text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all"
              >
                Helpful vs Harmful Guide
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}