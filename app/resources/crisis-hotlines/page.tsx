'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, MessageCircle, Heart, AlertTriangle, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const emergencyServices = [
  {
    id: 1,
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 free and confidential support for people in distress',
    type: 'National',
    languages: ['English', 'Spanish'],
    textOption: 'Text "HELLO" to 741741',
    website: 'suicidepreventionlifeline.org',
    icon: '🆘',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Postpartum Support International Helpline',
    number: '1-800-944-4773',
    description: 'Specialized support for maternal mental health crises',
    type: 'Maternal Mental Health',
    languages: ['English', 'Spanish'],
    textOption: 'Text "PSI" to 944-773',
    website: 'postpartum.net',
    icon: '🤱',
    priority: 'high'
  },
  {
    id: 3,
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: '24/7 crisis support via text message',
    type: 'Text Support',
    languages: ['English', 'Spanish'],
    textOption: 'Primary service is text-based',
    website: 'crisistextline.org',
    icon: '💬',
    priority: 'high'
  },
  {
    id: 4,
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: '24/7 support for domestic violence situations',
    type: 'Domestic Violence',
    languages: ['English', 'Spanish', '200+ languages via interpretation'],
    textOption: 'Text START to 88788',
    website: 'thehotline.org',
    icon: '🛡️',
    priority: 'high'
  },
  {
    id: 5,
    name: 'National Sexual Assault Hotline',
    number: '1-800-656-4673',
    description: '24/7 support for sexual assault survivors',
    type: 'Sexual Assault',
    languages: ['English', 'Spanish'],
    textOption: 'Chat available on website',
    website: 'rainn.org',
    icon: '🤝',
    priority: 'high'
  },
  {
    id: 6,
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Mental health and substance abuse treatment referrals',
    type: 'Mental Health & Substance Abuse',
    languages: ['English', 'Spanish'],
    textOption: 'Online treatment locator available',
    website: 'samhsa.gov',
    icon: '🧠',
    priority: 'medium'
  }
];

const localTexasResources = [
  {
    name: 'Texas Crisis Text Line',
    number: 'Text TALK to 741741',
    description: 'State-specific crisis support',
    coverage: 'Statewide',
    icon: '🏰'
  },
  {
    name: 'Austin Travis County MHMR',
    number: '512-472-4357',
    description: 'Local mental health crisis services',
    coverage: 'Austin/Travis County',
    icon: '🏛️'
  },
  {
    name: 'Dallas County Crisis Line',
    number: '214-743-1340',
    description: '24/7 crisis intervention',
    coverage: 'Dallas County',
    icon: '🏙️'
  },
  {
    name: 'Harris County Crisis Line',
    number: '713-970-7000',
    description: 'Mental health emergency services',
    coverage: 'Houston/Harris County',
    icon: '🌆'
  }
];

const warningSignsImmediate = [
  'Thoughts of hurting yourself or your baby',
  'Hallucinations or hearing voices',
  'Severe confusion or disorientation',
  'Unable to care for yourself or baby',
  'Thoughts that someone wants to harm you or baby',
  'Feeling completely disconnected from reality'
];

const warningSignsUrgent = [
  'Persistent thoughts of death or dying',
  'Severe anxiety or panic attacks',
  'Complete inability to sleep for several days',
  'Inability to eat or drink',
  'Extreme mood swings',
  'Obsessive thoughts about baby\'s safety'
];

export default function CrisisHotlinesPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showLocal, setShowLocal] = useState(false);

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
      pdf.setFillColor(220, 38, 38); // Red for emergency
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Crisis Hotline Directory', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('24/7 Support When You Need It Most', pageWidth / 2, 28, { align: 'center' });
      
      // Emergency notice
      pdf.setFillColor(255, 239, 239);
      pdf.rect(0, 35, pageWidth, 20, 'F');
      
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EMERGENCY: Call 911 or go to nearest emergency room', pageWidth / 2, 45, { align: 'center' });
      
      let yPosition = 70;
      
      // Quick reference section
      pdf.setTextColor(74, 56, 66);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Quick Reference', margin, yPosition);
      yPosition += 15;
      
      // Most critical numbers
      const quickRef = [
        { name: 'National Suicide Prevention', number: '988' },
        { name: 'Postpartum Support International', number: '1-800-944-4773' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
        { name: 'National Domestic Violence', number: '1-800-799-7233' }
      ];
      
      quickRef.forEach((service) => {
        pdf.setFillColor(248, 225, 231);
        pdf.rect(margin, yPosition - 3, maxWidth, 12, 'F');
        
        pdf.setTextColor(200, 107, 147);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(service.name, margin + 5, yPosition + 3);
        
        pdf.setTextColor(74, 56, 66);
        pdf.setFont('helvetica', 'bold');
        pdf.text(service.number, pageWidth - margin - 5, yPosition + 3, { align: 'right' });
        
        yPosition += 15;
      });
      
      yPosition += 10;
      
      // Warning signs section
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 38, 38);
      pdf.text('When to Call Immediately', margin, yPosition);
      yPosition += 12;
      
      warningSignsImmediate.forEach((sign) => {
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('• ', margin + 5, yPosition);
        const splitSign = pdf.splitTextToSize(sign, maxWidth - 10);
        pdf.text(splitSign, margin + 10, yPosition);
        yPosition += splitSign.length * lineHeight + 3;
      });
      
      yPosition += 10;
      
      // Complete directory
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(200, 107, 147);
      pdf.text('Complete Directory', margin, yPosition);
      yPosition += 15;
      
      emergencyServices.forEach((service) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Service header
        pdf.setFillColor(248, 225, 231);
        pdf.rect(margin, yPosition - 5, maxWidth, 15, 'F');
        
        pdf.setTextColor(200, 107, 147);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(service.name, margin + 5, yPosition + 2);
        
        pdf.setTextColor(74, 56, 66);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(service.number, pageWidth - margin - 5, yPosition + 2, { align: 'right' });
        
        yPosition += 18;
        
        // Description
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const splitDesc = pdf.splitTextToSize(service.description, maxWidth);
        pdf.text(splitDesc, margin, yPosition);
        yPosition += splitDesc.length * lineHeight + 5;
        
        // Languages
        pdf.setFont('helvetica', 'bold');
        pdf.text('Languages: ', margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(service.languages.join(', '), margin + 25, yPosition);
        yPosition += 8;
        
        // Text option if available
        if (service.textOption && service.textOption !== 'Primary service is text-based') {
          pdf.setFont('helvetica', 'bold');
          pdf.text('Text Option: ', margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(service.textOption, margin + 30, yPosition);
          yPosition += 8;
        }
        
        yPosition += 10;
      });
      
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
      pdf.text('You are not alone. Help is available 24/7.', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Keep this list accessible and share with trusted friends and family.', pageWidth / 2, yPosition + 16, { align: 'center' });
      
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
      
      pdf.save('crisis-hotline-directory-bloom-psychology.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
                Crisis Hotline Directory
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                24/7 support lines for immediate help during mental health emergencies. 
                You are not alone—help is always available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-6 h-6" />
            <p className="text-lg font-semibold">
              EMERGENCY: If you're in immediate danger, call 911 or go to your nearest emergency room
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Save This Directory</h2>
              <p className="text-red-100 mb-6">
                Download and keep this crisis resource list accessible on your phone or printed at home.
              </p>
              <div className="flex items-center gap-4 text-sm text-red-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>All free services</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Confidential support</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Quick Access Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">Quick Access Numbers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergencyServices.filter(service => service.priority === 'high').map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: service.id * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="text-xl font-bold text-red-600">{service.number}</span>
                  </div>
                  {service.textOption && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">{service.textOption}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{service.description}</p>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Languages:</strong> {service.languages.join(', ')}</p>
                  <a 
                    href={`https://${service.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {service.website}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="mb-12">
          <h2 className="text-3xl font-playfair text-gray-800 mb-8">When to Call for Help</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800">Call Immediately</h3>
              </div>
              <ul className="space-y-3">
                {warningSignsImmediate.map((sign, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-800">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-800">Call Soon</h3>
              </div>
              <ul className="space-y-3">
                {warningSignsUrgent.map((sign, index) => (
                  <li key={index} className="flex items-start gap-2 text-orange-800">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Local Texas Resources */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-playfair text-gray-800">Texas-Specific Resources</h2>
            <button
              onClick={() => setShowLocal(!showLocal)}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showLocal ? 'Hide' : 'Show'} Local Resources
            </button>
          </div>
          
          {showLocal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {localTexasResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                      <p className="text-sm text-blue-600">{resource.coverage}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded p-3 mb-3">
                    <span className="font-bold text-blue-800">{resource.number}</span>
                  </div>
                  <p className="text-gray-700">{resource.description}</p>
                </div>
              ))}
            </motion.div>
          )}
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
              You Are Not Alone
            </h2>
            <p className="text-gray-600 mb-8">
              Reaching out for help is a sign of strength, not weakness. These resources are here 
              for you 24/7, and trained professionals are ready to support you through any crisis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
              >
                Schedule Non-Emergency Support
              </Link>
              <Link
                href="/resources"
                className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Browse Other Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}