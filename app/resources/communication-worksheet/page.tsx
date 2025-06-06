'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Heart, ArrowLeft, Download, 
  CheckCircle, AlertTriangle, Lightbulb, Users,
  Clock, Star, Shield, Target
} from 'lucide-react';
import Link from 'next/link';

const communicationScenarios = [
  {
    situation: "Your partner seems overwhelmed and stressed",
    whatToSay: [
      "I notice you seem stressed. How can I help?",
      "What would make things easier for you right now?",
      "You're doing so much - what can I take off your plate?"
    ],
    whatNotToSay: [
      "You're being dramatic",
      "Other moms handle this fine",
      "Just relax"
    ],
    tips: [
      "Listen without trying to immediately fix",
      "Offer specific help rather than general offers",
      "Validate their feelings"
    ]
  },
  {
    situation: "Your partner is crying or emotional",
    whatToSay: [
      "It's okay to feel this way",
      "I'm here with you",
      "Your feelings are completely valid"
    ],
    whatNotToSay: [
      "Don't cry",
      "You're being too emotional",
      "Think positive"
    ],
    tips: [
      "Offer physical comfort if they want it",
      "Don't rush them to feel better",
      "Sometimes just being present is enough"
    ]
  },
  {
    situation: "Your partner expresses doubts about parenting",
    whatToSay: [
      "Learning to parent is hard for everyone",
      "You're a wonderful mother/father",
      "We'll figure this out together"
    ],
    whatNotToSay: [
      "You should know this instinctively",
      "Trust your instincts",
      "Stop worrying so much"
    ],
    tips: [
      "Normalize the learning process",
      "Share your own uncertainties",
      "Focus on their strengths"
    ]
  },
  {
    situation: "Your partner is struggling with body image",
    whatToSay: [
      "Your body did something amazing",
      "You're beautiful to me",
      "Healing takes time"
    ],
    whatNotToSay: [
      "You'll bounce back",
      "You look fine",
      "At least the baby is healthy"
    ],
    tips: [
      "Acknowledge the real changes they're experiencing",
      "Don't minimize their concerns",
      "Focus on function over appearance"
    ]
  },
  {
    situation: "Your partner wants to talk about their birth experience",
    whatToSay: [
      "Tell me about what that was like for you",
      "That sounds really difficult",
      "Thank you for sharing that with me"
    ],
    whatNotToSay: [
      "At least the baby is healthy",
      "It's over now",
      "Don't dwell on it"
    ],
    tips: [
      "Let them process without judgment",
      "Ask follow-up questions to show interest",
      "Validate their experience even if it differs from yours"
    ]
  }
];

const conversationStarters = [
  {
    category: "Daily Check-ins",
    questions: [
      "How are you feeling today, both physically and emotionally?",
      "What was the hardest part of your day?",
      "What was something that went well today?",
      "Is there anything you need help with tomorrow?",
      "How can I best support you right now?"
    ]
  },
  {
    category: "Deeper Connection",
    questions: [
      "What do you need more of from me as your partner?",
      "How has becoming a parent changed how you see yourself?",
      "What are you most worried about right now?",
      "What are you most excited about with our family?",
      "How can we stay connected as a couple during this time?"
    ]
  },
  {
    category: "Support & Needs",
    questions: [
      "What kind of support feels most helpful to you?",
      "When do you feel most overwhelmed?",
      "What would help you feel more confident as a parent?",
      "How can we better divide household responsibilities?",
      "What do you need to feel supported in your recovery?"
    ]
  }
];

const communicationTools = [
  {
    tool: "The Daily Temperature Check",
    description: "A quick way to check in on emotional state",
    howTo: [
      "Ask: 'On a scale of 1-10, how are you feeling today?'",
      "Follow up with: 'What would help move that number up?'",
      "Listen to the response without judgment",
      "Offer specific support based on their answer"
    ],
    icon: <Clock className="w-6 h-6" />
  },
  {
    tool: "The Pause and Reflect",
    description: "When conversations get heated or overwhelming",
    howTo: [
      "Say: 'Let's take a pause so we can both think'",
      "Take 10-15 minutes apart",
      "Come back and share what you each need",
      "Focus on solutions, not blame"
    ],
    icon: <Shield className="w-6 h-6" />
  },
  {
    tool: "The Appreciation Practice",
    description: "Weekly practice to strengthen connection",
    howTo: [
      "Each person shares 3 things they appreciate about the other",
      "Be specific about actions, not just general qualities",
      "Include appreciation for parenting efforts",
      "End with a hug or physical connection"
    ],
    icon: <Heart className="w-6 h-6" />
  },
  {
    tool: "The Need and Request",
    description: "Clear way to ask for what you need",
    howTo: [
      "State the feeling: 'I feel...'",
      "Share the need: 'I need...'",
      "Make a specific request: 'Would you be willing to...'",
      "Be open to alternative solutions"
    ],
    icon: <Target className="w-6 h-6" />
  }
];

const redFlags = [
  "Persistent thoughts of self-harm or harming the baby",
  "Complete inability to function or care for self",
  "Severe mood swings or anger outbursts",
  "Disconnection from reality or hallucinations",
  "Extreme anxiety that interferes with daily life",
  "Inability to sleep even when baby is sleeping"
];

export default function CommunicationWorksheetPage() {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(section)) {
      newCompleted.delete(section);
    } else {
      newCompleted.add(section);
    }
    setCompletedSections(newCompleted);
  };

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;
      const maxWidth = pageWidth - (margin * 2);
      
      // Brand colors
      const brandPink = '#C06B93';
      const brandDark = '#4A3842';
      
      // Header
      pdf.setFillColor(200, 107, 147);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Communication Worksheet', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Navigate Difficult Conversations with Empathy', pageWidth / 2, 28, { align: 'center' });
      
      let yPosition = 50;
      
      // Daily temperature check
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🌡️ Daily Temperature Check', margin, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const tempCheck = [
        'Ask: "On a scale of 1-10, how are you feeling today?"',
        'Follow up: "What would help move that number up?"',
        'Listen without judgment',
        'Offer specific support based on their answer'
      ];
      
      tempCheck.forEach((step) => {
        pdf.text('• ', margin, yPosition);
        const splitStep = pdf.splitTextToSize(step, maxWidth - 10);
        pdf.text(splitStep, margin + 5, yPosition);
        yPosition += splitStep.length * lineHeight + 3;
      });
      
      yPosition += 10;
      
      // Conversation starters
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('💬 Daily Check-in Questions', margin, yPosition);
      yPosition += 12;
      
      const dailyQuestions = conversationStarters[0].questions.slice(0, 4);
      dailyQuestions.forEach((question) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitQ = pdf.splitTextToSize(question, maxWidth - 10);
        pdf.text(splitQ, margin + 5, yPosition);
        yPosition += splitQ.length * lineHeight + 4;
      });
      
      yPosition += 10;
      
      // Communication scenario
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🗣️ Sample Scenario: Partner Seems Stressed', margin, yPosition);
      yPosition += 15;
      
      // What TO say
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✅ What TO Say:', margin, yPosition);
      yPosition += 8;
      
      communicationScenarios[0].whatToSay.forEach((phrase) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitPhrase = pdf.splitTextToSize(`"${phrase}"`, maxWidth - 10);
        pdf.text(splitPhrase, margin + 5, yPosition);
        yPosition += splitPhrase.length * lineHeight + 3;
      });
      
      yPosition += 8;
      
      // What NOT to say
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('❌ What NOT to Say:', margin, yPosition);
      yPosition += 8;
      
      communicationScenarios[0].whatNotToSay.forEach((phrase) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitPhrase = pdf.splitTextToSize(`"${phrase}"`, maxWidth - 10);
        pdf.text(splitPhrase, margin + 5, yPosition);
        yPosition += splitPhrase.length * lineHeight + 3;
      });
      
      yPosition += 15;
      
      // Red flags section
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🚨 When to Seek Professional Help', margin, yPosition);
      yPosition += 12;
      
      redFlags.slice(0, 4).forEach((flag) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin, yPosition);
        const splitFlag = pdf.splitTextToSize(flag, maxWidth - 10);
        pdf.text(splitFlag, margin + 5, yPosition);
        yPosition += splitFlag.length * lineHeight + 4;
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
      pdf.text('Good communication strengthens your relationship', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Practice these tools regularly to build connection and trust.', pageWidth / 2, yPosition + 16, { align: 'center' });
      
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
      
      pdf.save('communication-worksheet-bloom-psychology.pdf');
      
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
                Communication Worksheet
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Navigate difficult conversations with empathy and understanding. 
                Tools to strengthen your relationship during challenging times.
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
              <h2 className="text-2xl font-semibold mb-4">Download Your Communication Toolkit</h2>
              <p className="text-blue-100 mb-6">
                Get this practical worksheet with conversation starters, response guides, and warning signs to watch for.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversation starters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Response examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Warning signs guide</span>
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

        {/* Communication Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Essential Communication Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {communicationTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{tool.tool}</h3>
                </div>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">How to use it:</h4>
                  <ol className="space-y-1">
                    {tool.howTo.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 font-semibold mt-0.5">{stepIndex + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scenario Practice */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Practice Scenarios</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Practice these common situations with guided examples of supportive responses
          </p>

          {/* Scenario Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {communicationScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setSelectedScenario(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedScenario === index
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                Scenario {index + 1}
              </button>
            ))}
          </div>

          {/* Selected Scenario */}
          <motion.div
            key={selectedScenario}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Situation: {communicationScenarios[selectedScenario].situation}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* What TO Say */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-800">What TO Say</h4>
                </div>
                <div className="space-y-3">
                  {communicationScenarios[selectedScenario].whatToSay.map((phrase, index) => (
                    <div key={index} className="bg-white rounded p-3 shadow-sm">
                      <p className="text-gray-800 italic">"{phrase}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What NOT to Say */}
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-red-800">What NOT to Say</h4>
                </div>
                <div className="space-y-3">
                  {communicationScenarios[selectedScenario].whatNotToSay.map((phrase, index) => (
                    <div key={index} className="bg-white rounded p-3 shadow-sm">
                      <p className="text-gray-800 italic">"{phrase}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-800">Additional Tips</h4>
              </div>
              <ul className="space-y-2">
                {communicationScenarios[selectedScenario].tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <Star className="w-4 h-4 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Conversation Starters */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8 text-center">Conversation Starters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {conversationStarters.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSection(`${index}-${qIndex}`)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={completedSections.has(`${index}-${qIndex}`)}
                          readOnly
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <p className="text-sm text-gray-700">{question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-2xl p-8 mb-12"
        >
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-playfair text-red-800 mb-4">When Communication Isn't Enough</h2>
            <p className="text-red-700 max-w-2xl mx-auto">
              If you notice these warning signs, encourage professional help immediately
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {redFlags.map((flag, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-800">{flag}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-red-100 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-red-800 mb-3">Emergency Resources</h4>
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
              Building Better Communication Takes Practice
            </h2>
            <p className="text-gray-600 mb-8">
              Remember that improving communication is a skill that develops over time. 
              Be patient with yourself and your partner as you learn together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all"
              >
                Get Professional Guidance
              </Link>
              <Link
                href="/resources/partner-support-checklist"
                className="border-2 border-blue-500 text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all"
              >
                Partner Support Guide
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}