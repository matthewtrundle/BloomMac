import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '5 Grounding Techniques for Anxious Moments',
  description: 'Free guide: Evidence-based grounding techniques to help you manage anxiety and find calm in stressful moments.',
};

export default function GroundingTechniquesPage() {
  return (
    <div className="min-h-screen bg-[#FDF5F9]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-bloom-primary/10 to-bloom-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-bloom-primary mb-6">
              5 Grounding Techniques for Anxious Moments
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Simple, science-backed exercises you can use anywhere, anytime to find calm and center yourself.
            </p>
            <div className="inline-flex items-center space-x-2 text-bloom-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>5 minute read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Anxiety can feel overwhelming, but grounding techniques can help you reconnect with the present moment 
              and find calm. These evidence-based exercises work by engaging your senses and shifting your focus 
              away from anxious thoughts.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Here are 5 powerful grounding techniques that therapists recommend. Practice them regularly, 
              and they'll become even more effective when you need them most.
            </p>
          </div>

          {/* Technique 1 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-bloom-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-bloom-primary">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair text-bloom-primary mb-4">
                  The 5-4-3-2-1 Technique
                </h2>
                <p className="text-gray-700 mb-4">
                  This technique uses your five senses to ground you in the present moment. It's particularly 
                  effective for panic attacks or intense anxiety.
                </p>
                <div className="bg-bloom-secondary/5 border-l-4 border-bloom-secondary p-6 rounded">
                  <p className="font-medium text-bloom-primary mb-3">How to do it:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">5:</span>
                      <span>Name 5 things you can see (a pen, a plant, a picture frame)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">4:</span>
                      <span>Name 4 things you can touch (your chair, your clothes, the table)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3:</span>
                      <span>Name 3 things you can hear (traffic, birds, your breathing)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2:</span>
                      <span>Name 2 things you can smell (coffee, fresh air)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1:</span>
                      <span>Name 1 thing you can taste (mint, coffee, or just your mouth)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Technique 2 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-bloom-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-bloom-primary">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair text-bloom-primary mb-4">
                  Box Breathing (Square Breathing)
                </h2>
                <p className="text-gray-700 mb-4">
                  Used by Navy SEALs and first responders, this breathing technique quickly calms your 
                  nervous system and reduces stress hormones.
                </p>
                <div className="bg-bloom-secondary/5 border-l-4 border-bloom-secondary p-6 rounded">
                  <p className="font-medium text-bloom-primary mb-3">How to do it:</p>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Breathe out completely</li>
                    <li>2. Breathe in through your nose for 4 counts</li>
                    <li>3. Hold your breath for 4 counts</li>
                    <li>4. Breathe out through your mouth for 4 counts</li>
                    <li>5. Hold empty for 4 counts</li>
                    <li>6. Repeat 4-6 times</li>
                  </ol>
                  <p className="mt-4 text-sm italic">
                    Tip: Visualize drawing a square as you breathe - up the left side as you inhale, 
                    across the top as you hold, down the right as you exhale, across the bottom as you hold empty.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technique 3 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-bloom-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-bloom-primary">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair text-bloom-primary mb-4">
                  Progressive Muscle Relaxation
                </h2>
                <p className="text-gray-700 mb-4">
                  This technique helps you recognize and release physical tension that often accompanies anxiety. 
                  It's especially helpful if you carry stress in your body.
                </p>
                <div className="bg-bloom-secondary/5 border-l-4 border-bloom-secondary p-6 rounded">
                  <p className="font-medium text-bloom-primary mb-3">Quick version for anxious moments:</p>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Take a deep breath and clench your fists tight for 5 seconds</li>
                    <li>2. Release and notice the feeling of relaxation for 10 seconds</li>
                    <li>3. Tense your shoulders up to your ears for 5 seconds</li>
                    <li>4. Release and feel the tension melt away for 10 seconds</li>
                    <li>5. Scrunch your face muscles tight for 5 seconds</li>
                    <li>6. Release and enjoy the relaxation for 10 seconds</li>
                  </ol>
                  <p className="mt-4 text-sm italic">
                    For a full-body version when you have more time, work through each muscle group 
                    from toes to head.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technique 4 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-bloom-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-bloom-primary">4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair text-bloom-primary mb-4">
                  The Temperature Technique
                </h2>
                <p className="text-gray-700 mb-4">
                  Sudden temperature changes can quickly shift your nervous system out of panic mode. 
                  This technique is based on the diving reflex that naturally calms the body.
                </p>
                <div className="bg-bloom-secondary/5 border-l-4 border-bloom-secondary p-6 rounded">
                  <p className="font-medium text-bloom-primary mb-3">Options to try:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Hold ice cubes in your hands or on your wrists</li>
                    <li>• Splash cold water on your face</li>
                    <li>• Place a cold compress on your neck or forehead</li>
                    <li>• Step outside if it's cooler than inside</li>
                    <li>• Take a cool (not cold) shower</li>
                  </ul>
                  <p className="mt-4 text-sm italic">
                    Safety note: Avoid extreme temperatures. The goal is to create a noticeable but 
                    safe temperature change.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technique 5 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-bloom-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-bloom-primary">5</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair text-bloom-primary mb-4">
                  The Anchoring Phrase
                </h2>
                <p className="text-gray-700 mb-4">
                  Creating a personal anchoring phrase combines mindfulness with self-compassion. 
                  This technique is discrete and can be used anywhere.
                </p>
                <div className="bg-bloom-secondary/5 border-l-4 border-bloom-secondary p-6 rounded">
                  <p className="font-medium text-bloom-primary mb-3">How to create your anchor:</p>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Choose a calming phrase that resonates with you</li>
                    <li>2. Examples:
                      <ul className="ml-4 mt-2 space-y-1">
                        <li>• "This feeling will pass"</li>
                        <li>• "I am safe in this moment"</li>
                        <li>• "I can handle this"</li>
                        <li>• "Breathe in calm, breathe out tension"</li>
                      </ul>
                    </li>
                    <li>3. Repeat slowly 5-10 times while breathing deeply</li>
                    <li>4. Pair with a physical anchor (touching thumb to fingers, hand on heart)</li>
                  </ol>
                  <p className="mt-4 text-sm italic">
                    Practice your phrase when calm so it becomes more powerful when you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* When to Seek Help */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-playfair text-bloom-primary mb-4">
              When to Seek Professional Support
            </h3>
            <p className="text-gray-700 mb-4">
              While grounding techniques are powerful tools, they work best as part of a comprehensive 
              approach to managing anxiety. Consider reaching out for professional support if:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Anxiety interferes with daily activities or relationships</li>
              <li>• You experience panic attacks regularly</li>
              <li>• Grounding techniques provide only temporary relief</li>
              <li>• You're avoiding important parts of life due to anxiety</li>
              <li>• You'd like to understand and address the root causes of your anxiety</li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-bloom-primary/5 to-bloom-secondary/5 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-playfair text-bloom-primary mb-4">
              Ready for Personalized Support?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              These techniques are just the beginning. In therapy, we can explore what triggers your anxiety 
              and develop a personalized toolkit that works specifically for you.
            </p>
            <div className="space-y-4">
              <Link href="/book">
                <Button variant="primary" size="lg">
                  Book Your Free 15-Minute Consultation
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                No obligation • Safe space to explore • Evidence-based approaches
              </p>
            </div>
          </div>

          {/* Download Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Want to keep these techniques handy?
            </p>
            <Button variant="secondary" size="md">
              Download PDF Version
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}