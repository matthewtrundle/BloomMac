'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, X, ArrowLeft, Download, 
  Heart, AlertTriangle, Users, Gift,
  MessageCircle, Home, Baby, Star,
  ThumbsUp, ThumbsDown, Lightbulb
} from 'lucide-react';
import Link from 'next/link';

const helpfulVsHarmful = [
  {
    category: 'Offering Help',
    icon: <Gift className="w-6 h-6" />,
    items: [
      {
        helpful: 'Ask "What would be most helpful right now?"',
        harmful: 'Assume you know what they need',
        explanation: 'Every family\'s needs are different and change daily'
      },
      {
        helpful: 'Offer specific help: "Can I bring dinner Thursday?"',
        harmful: 'Say "Let me know if you need anything"',
        explanation: 'Specific offers are easier to accept than vague ones'
      },
      {
        helpful: 'Follow through on commitments reliably',
        harmful: 'Make promises you can\'t keep',
        explanation: 'New parents rely on promised help and can\'t handle last-minute changes'
      },
      {
        helpful: 'Respect their "no" gracefully',
        harmful: 'Insist on helping when they decline',
        explanation: 'Sometimes they need space more than help'
      }
    ]
  },
  {
    category: 'Visiting',
    icon: <Home className="w-6 h-6" />,
    items: [
      {
        helpful: 'Call or text before visiting',
        harmful: 'Show up unannounced',
        explanation: 'Predictability helps new parents manage their energy'
      },
      {
        helpful: 'Keep visits short and sweet',
        harmful: 'Stay for hours without checking in',
        explanation: 'Even welcome guests can become overwhelming'
      },
      {
        helpful: 'Bring your own refreshments',
        harmful: 'Expect to be fed and entertained',
        explanation: 'New parents don\'t have energy for hosting'
      },
      {
        helpful: 'Help with dishes or tidying while there',
        harmful: 'Create more work by your presence',
        explanation: 'Leave things better than you found them'
      }
    ]
  },
  {
    category: 'Baby Interactions',
    icon: <Baby className="w-6 h-6" />,
    items: [
      {
        helpful: 'Ask before holding the baby',
        harmful: 'Reach for the baby without permission',
        explanation: 'Parents need to feel in control of their baby\'s care'
      },
      {
        helpful: 'Support their feeding choices',
        harmful: 'Comment on breastfeeding or formula decisions',
        explanation: 'Feeding choices are personal and often complex'
      },
      {
        helpful: 'Follow their sleep and routine guidelines',
        harmful: 'Wake the baby or ignore routines',
        explanation: 'Sleep schedules are crucial for the whole family'
      },
      {
        helpful: 'Let parents make parenting decisions',
        harmful: 'Take over or give constant advice',
        explanation: 'Confidence comes from making their own choices'
      }
    ]
  },
  {
    category: 'Emotional Support',
    icon: <Heart className="w-6 h-6" />,
    items: [
      {
        helpful: 'Listen without trying to fix everything',
        harmful: 'Immediately offer solutions to every concern',
        explanation: 'Sometimes they just need to be heard'
      },
      {
        helpful: 'Validate their feelings: "This is really hard"',
        harmful: 'Minimize feelings: "Enjoy every moment"',
        explanation: 'All feelings in new parenthood are valid'
      },
      {
        helpful: 'Share encouragement about what they\'re doing well',
        harmful: 'Focus only on what they could do differently',
        explanation: 'New parents need confidence-building, not criticism'
      },
      {
        helpful: 'Respect their parenting style',
        harmful: 'Compare to how you or others parent',
        explanation: 'Every family finds their own way'
      }
    ]
  },
  {
    category: 'Communication',
    icon: <MessageCircle className="w-6 h-6" />,
    items: [
      {
        helpful: 'Ask advice only when requested',
        harmful: 'Give unsolicited advice constantly',
        explanation: 'Too much advice can undermine confidence'
      },
      {
        helpful: 'Share your experience when asked',
        harmful: 'Start every response with "When I had kids..."',
        explanation: 'Make conversations about them, not you'
      },
      {
        helpful: 'Use encouraging language',
        harmful: 'Use phrases like "You should" or "Why don\'t you"',
        explanation: 'Supportive language builds them up'
      },
      {
        helpful: 'Be patient with slow responses to texts',
        harmful: 'Expect immediate replies and constant updates',
        explanation: 'They have limited bandwidth for communication'
      }
    ]
  },
  {
    category: 'Practical Support',
    icon: <Users className="w-6 h-6" />,
    items: [
      {
        helpful: 'Bring meals in disposable containers',
        harmful: 'Bring food that requires immediate attention or dishes to return',
        explanation: 'Reduce their to-do list, don\'t add to it'
      },
      {
        helpful: 'Offer to run errands or pick up groceries',
        harmful: 'Expect them to entertain you during visits',
        explanation: 'Support should reduce their workload'
      },
      {
        helpful: 'Help with older siblings\' needs',
        harmful: 'Focus only on the new baby',
        explanation: 'Older children need attention during transitions too'
      },
      {
        helpful: 'Ask about household preferences before cleaning',
        harmful: 'Reorganize their space without asking',
        explanation: 'Respect their systems and organization'
      }
    ]
  }
];

const commonMistakes = [
  {
    mistake: 'Giving advice when they just want to vent',
    betterApproach: 'Ask: "Do you want suggestions or just someone to listen?"',
    icon: <MessageCircle className="w-5 h-5" />
  },
  {
    mistake: 'Comparing their experience to others',
    betterApproach: 'Validate their unique experience without comparisons',
    icon: <Heart className="w-5 h-5" />
  },
  {
    mistake: 'Taking over tasks they\'re trying to learn',
    betterApproach: 'Offer to help while letting them lead',
    icon: <Lightbulb className="w-5 h-5" />
  },
  {
    mistake: 'Making them feel guilty for having boundaries',
    betterApproach: 'Respect their limits and thank them for being honest',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    mistake: 'Overstaying your welcome',
    betterApproach: 'Set expectations for visit length and stick to them',
    icon: <Home className="w-5 h-5" />
  },
  {
    mistake: 'Making everything about the baby',
    betterApproach: 'Ask about the parents\' well-being too',
    icon: <Users className="w-5 h-5" />
  }
];

export default function HelpfulVsHarmfulChecklistPage() {
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
      pdf.text('Helpful vs Harmful Checklist', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('What Really Helps New Families', pageWidth / 2, 28, { align: 'center' });
      
      let yPosition = 50;
      
      // Offering Help section
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🎁 Offering Help', margin, yPosition);
      yPosition += 15;
      
      // Helpful examples
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✅ HELPFUL:', margin, yPosition);
      yPosition += 8;
      
      const helpfulOffers = [
        'Ask "What would be most helpful right now?"',
        'Offer specific help: "Can I bring dinner Thursday?"',
        'Follow through on commitments reliably',
        'Respect their "no" gracefully'
      ];
      
      helpfulOffers.forEach((item) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin + 5, yPosition);
        const splitItem = pdf.splitTextToSize(item, maxWidth - 15);
        pdf.text(splitItem, margin + 10, yPosition);
        yPosition += splitItem.length * lineHeight + 3;
      });
      
      yPosition += 8;
      
      // Harmful examples
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('❌ HARMFUL:', margin, yPosition);
      yPosition += 8;
      
      const harmfulOffers = [
        'Assume you know what they need',
        'Say "Let me know if you need anything"',
        'Make promises you can\'t keep',
        'Insist on helping when they decline'
      ];
      
      harmfulOffers.forEach((item) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin + 5, yPosition);
        const splitItem = pdf.splitTextToSize(item, maxWidth - 15);
        pdf.text(splitItem, margin + 10, yPosition);
        yPosition += splitItem.length * lineHeight + 3;
      });
      
      yPosition += 15;
      
      // Visiting section
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🏠 Visiting', margin, yPosition);
      yPosition += 15;
      
      // Helpful visiting
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✅ HELPFUL:', margin, yPosition);
      yPosition += 8;
      
      const helpfulVisiting = [
        'Call or text before visiting',
        'Keep visits short and sweet',
        'Bring your own refreshments',
        'Help with dishes while there'
      ];
      
      helpfulVisiting.forEach((item) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin + 5, yPosition);
        const splitItem = pdf.splitTextToSize(item, maxWidth - 15);
        pdf.text(splitItem, margin + 10, yPosition);
        yPosition += splitItem.length * lineHeight + 3;
      });
      
      yPosition += 8;
      
      // Harmful visiting
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('❌ HARMFUL:', margin, yPosition);
      yPosition += 8;
      
      const harmfulVisiting = [
        'Show up unannounced',
        'Stay for hours without checking in',
        'Expect to be fed and entertained',
        'Create more work by your presence'
      ];
      
      harmfulVisiting.forEach((item) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin + 5, yPosition);
        const splitItem = pdf.splitTextToSize(item, maxWidth - 15);
        pdf.text(splitItem, margin + 10, yPosition);
        yPosition += splitItem.length * lineHeight + 3;
      });
      
      yPosition += 15;
      
      // Quick tips
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFillColor(248, 225, 231);
      pdf.rect(margin, yPosition, maxWidth, 30, 'F');
      
      pdf.setTextColor(200, 107, 147);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Quick Tips', margin + 5, yPosition + 8);
      
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('• When in doubt, ask what they need', margin + 5, yPosition + 16);
      pdf.text('• Listen more than you speak', margin + 5, yPosition + 22);
      pdf.text('• Respect boundaries without taking it personally', margin + 5, yPosition + 28);
      
      yPosition += 40;
      
      // Footer
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      yPosition += 10;
      pdf.setFillColor(248, 225, 231);
      pdf.rect(margin, yPosition, maxWidth, 25, 'F');
      
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('The best support meets families where they are', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Every family is different - ask rather than assume.', pageWidth / 2, yPosition + 16, { align: 'center' });
      
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
      
      pdf.save('helpful-vs-harmful-checklist-bloom-psychology.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
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
                Helpful vs Harmful Checklist
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Learn what truly helps new families and what can unintentionally make things harder. 
                Well-meaning support can sometimes miss the mark—here's how to get it right.
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
          className="bg-gradient-to-r from-green-500 to-red-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Download Your Quick Reference</h2>
              <p className="text-green-100 mb-6">
                Get this essential checklist to ensure your support truly helps new families thrive.
              </p>
              <div className="flex items-center gap-4 text-sm text-green-100">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful approaches</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Common mistakes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Better alternatives</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {helpfulVsHarmful.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === index
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category.icon}
              {category.category}
            </button>
          ))}
        </div>

        {/* Selected Category Comparison */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              {helpfulVsHarmful[selectedCategory].icon}
            </div>
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              {helpfulVsHarmful[selectedCategory].category}
            </h2>
          </div>

          <div className="space-y-6">
            {helpfulVsHarmful[selectedCategory].items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-green-800">Helpful</h4>
                    </div>
                    <p className="text-green-700 font-medium">{item.helpful}</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <X className="w-6 h-6 text-red-600" />
                      <h4 className="text-lg font-semibold text-red-800">Harmful</h4>
                    </div>
                    <p className="text-red-700 font-medium">{item.harmful}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h5 className="font-semibold text-blue-800">Why this matters:</h5>
                  </div>
                  <p className="text-blue-700">{item.explanation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Common Mistakes */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Common Well-Meaning Mistakes</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Even with the best intentions, these common approaches can sometimes make things harder for new families.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {commonMistakes.map((mistake, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                    {mistake.icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Mistake:</h4>
                      <p className="text-gray-700">{mistake.mistake}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">✅ Better Approach:</h4>
                      <p className="text-gray-700">{mistake.betterApproach}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Reference Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Quick Reference Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Do This */}
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-green-800">Do This</h3>
              </div>

              <div className="space-y-4">
                {[
                  'Ask before offering advice',
                  'Bring specific, practical help',
                  'Respect their parenting choices',
                  'Listen without trying to fix',
                  'Follow their lead on visits',
                  'Validate their feelings',
                  'Be reliable with commitments',
                  'Ask what they actually need'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-green-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoid This */}
            <div className="bg-red-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsDown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-red-800">Avoid This</h3>
              </div>

              <div className="space-y-4">
                {[
                  'Give unsolicited advice',
                  'Compare to other families',
                  'Take over their tasks',
                  'Minimize their struggles',
                  'Overstay your welcome',
                  'Make it about you',
                  'Break promises or cancel last-minute',
                  'Assume what they need'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
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
              The Best Support Meets Families Where They Are
            </h2>
            <p className="text-gray-600 mb-8">
              Remember: every family is different, needs change daily, and what helps one family 
              might not help another. When in doubt, ask rather than assume.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resources/family-boundaries-guide"
                className="bg-gradient-to-r from-green-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-red-600 transition-all"
              >
                Family Boundaries Guide
              </Link>
              <Link
                href="/resources/communication-worksheet"
                className="border-2 border-green-500 text-green-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all"
              >
                Communication Tips
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}