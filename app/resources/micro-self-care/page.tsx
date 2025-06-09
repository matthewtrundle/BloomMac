'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Clock, Heart, Star, CheckCircle, Moon, Coffee, Sparkles } from 'lucide-react';
import Link from 'next/link';

const microSelfCareRituals = [
  {
    id: 1,
    title: 'Three Deep Breaths',
    time: '30 seconds',
    description: 'Inhale for 4 counts, hold for 4, exhale for 6. Reset your nervous system instantly.',
    category: 'Mindfulness',
    icon: '🫁',
    howTo: 'Place one hand on chest, one on belly. Breathe so only the belly hand moves.'
  },
  {
    id: 2,
    title: 'Gratitude Pause',
    time: '1 minute',
    description: 'Name three things you\'re grateful for right now, however small.',
    category: 'Mental',
    icon: '🙏',
    howTo: 'Look around and find one thing you see, one thing you feel, and one person you appreciate.'
  },
  {
    id: 3,
    title: 'Hand & Face Massage',
    time: '2 minutes',
    description: 'Massage your hands and temples while applying lotion or oil.',
    category: 'Physical',
    icon: '👐',
    howTo: 'Use circular motions on palms, then gently massage temples and forehead.'
  },
  {
    id: 4,
    title: 'Warm Tea Ritual',
    time: '2 minutes',
    description: 'Make tea mindfully, focusing on the warmth, steam, and first sip.',
    category: 'Mindfulness',
    icon: '🍵',
    howTo: 'Hold the warm mug, breathe in the steam, and take three mindful sips.'
  },
  {
    id: 5,
    title: 'Affirmation Mirror Moment',
    time: '1 minute',
    description: 'Look in the mirror and say one kind thing to yourself.',
    category: 'Mental',
    icon: '🪞',
    howTo: 'Make eye contact with yourself and say: "I am doing my best, and that is enough."'
  },
  {
    id: 6,
    title: 'Phone-Free Minutes',
    time: '2 minutes',
    description: 'Put your phone in another room and just be present with yourself.',
    category: 'Mental',
    icon: '📱',
    howTo: 'Set your phone aside and notice what you see, hear, and feel right now.'
  },
  {
    id: 7,
    title: 'Body Scan Check-in',
    time: '90 seconds',
    description: 'Quickly scan from head to toe, noticing any tension and releasing it.',
    category: 'Physical',
    icon: '🧘',
    howTo: 'Start at your forehead, notice and relax each body part down to your toes.'
  },
  {
    id: 8,
    title: 'Fresh Air Moment',
    time: '1 minute',
    description: 'Step outside or open a window and take five deep breaths of fresh air.',
    category: 'Physical',
    icon: '🌿',
    howTo: 'Focus on the air entering your lungs and how it feels on your skin.'
  },
  {
    id: 9,
    title: 'Gentle Stretches',
    time: '2 minutes',
    description: 'Roll your shoulders, stretch your neck, and twist your spine gently.',
    category: 'Physical',
    icon: '🤸',
    howTo: 'Shoulder rolls (5 each way), neck side-to-side, gentle spinal twist both directions.'
  },
  {
    id: 10,
    title: 'Loving Touch',
    time: '1 minute',
    description: 'Give yourself a gentle hug or place your hand on your heart.',
    category: 'Emotional',
    icon: '💗',
    howTo: 'Wrap your arms around yourself or place hand on heart and say "I am loved."'
  }
];

const categories = [
  { name: 'All', color: 'bg-gray-100 text-gray-700' },
  { name: 'Mindfulness', color: 'bg-purple-100 text-purple-700' },
  { name: 'Physical', color: 'bg-green-100 text-green-700' },
  { name: 'Mental', color: 'bg-blue-100 text-blue-700' },
  { name: 'Emotional', color: 'bg-pink-100 text-pink-700' }
];

export default function MicroSelfCarePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkedRituals, setCheckedRituals] = useState<number[]>([]);

  const filteredRituals = selectedCategory === 'All' 
    ? microSelfCareRituals 
    : microSelfCareRituals.filter(ritual => ritual.category === selectedCategory);

  const toggleRitual = (id: number) => {
    setCheckedRituals(prev => 
      prev.includes(id) 
        ? prev.filter(ritualId => ritualId !== id)
        : [...prev, id]
    );
  };

  const handleDownload = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { generateResourcePDF, PDFDocument } = await import('@/lib/pdf-generator');
      
      // Transform rituals into PDF sections
      const pdfDocument: PDFDocument = {
        title: '10 Tiny Self-Care Rituals',
        subtitle: 'That Take Less Than 2 Minutes',
        author: 'Bloom Psychology North Austin',
        description: 'Self-care doesn\'t have to be time-consuming or complicated. These micro-moments of care can be woven into your busiest days to help you reset, recharge, and reconnect with yourself.',
        sections: microSelfCareRituals.map((ritual, index) => ({
          title: `${index + 1}. ${ritual.title} (${ritual.time})`,
          content: ritual.description,
          items: [`How to: ${ritual.howTo}`],
          type: 'tips' as const
        }))
      };
      
      // Add a closing section
      pdfDocument.sections.push({
        type: 'highlight',
        title: 'Remember: Self-care isn\'t selfish',
        content: 'It\'s essential for your wellbeing and your family\'s. Start with just one ritual today and notice how even these tiny moments can make a difference.'
      });
      
      generateResourcePDF(pdfDocument, '10-tiny-self-care-rituals-bloom-psychology.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to the old method
      window.open('/api/generate-micro-self-care-pdf', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-800 mb-4 inline-block"
              >
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-playfair text-gray-800 mb-4">
                10 Tiny Self-Care Rituals That Take Less Than 2 Minutes
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Self-care doesn't have to be time-consuming or complicated. These micro-moments of care 
                can be woven into your busiest days to help you reset, recharge, and reconnect with yourself.
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
          className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Download Your Free Guide</h2>
              <p className="text-pink-100 mb-6">
                Get this resource as a downloadable guide you can reference anytime.
              </p>
              <div className="flex items-center gap-4 text-sm text-pink-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>All under 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Science-backed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Mom-tested</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Guide
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.name
                    ? category.color + ' shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Progress Today</h3>
            <span className="text-sm text-gray-600">
              {checkedRituals.length} of {microSelfCareRituals.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(checkedRituals.length / microSelfCareRituals.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Rituals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRituals.map((ritual, index) => (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-soft transition-all duration-200 ${
                checkedRituals.includes(ritual.id) 
                  ? 'ring-2 ring-pink-200 bg-gradient-to-br from-pink-50 to-rose-50' 
                  : 'hover:shadow-md hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ritual.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{ritual.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{ritual.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRitual(ritual.id)}
                  className={`p-2 rounded-full transition-all ${
                    checkedRituals.includes(ritual.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-pink-100 hover:text-pink-500'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{ritual.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">How to:</span> {ritual.howTo}
                </p>
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                ritual.category === 'Mindfulness' ? 'bg-purple-100 text-purple-700' :
                ritual.category === 'Physical' ? 'bg-green-100 text-green-700' :
                ritual.category === 'Mental' ? 'bg-blue-100 text-blue-700' :
                'bg-pink-100 text-pink-700'
              }`}>
                {ritual.category}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-white rounded-2xl p-8 shadow-soft"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair text-gray-800 mb-4">
              Remember: Self-Care Isn't Selfish
            </h2>
            <p className="text-gray-600 mb-8">
              Taking care of yourself isn't just good for you—it's good for everyone who depends on you. 
              These tiny moments of care add up to create a more balanced, peaceful, and joyful life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                Book a Consultation
              </Link>
              <Link
                href="/blog"
                className="border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-pink-500 hover:text-white transition-all"
              >
                Read More Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}