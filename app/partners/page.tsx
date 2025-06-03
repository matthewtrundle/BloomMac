import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// UI Components
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import ParallaxContainer from '@/components/ui/ParallaxContainer';

export const metadata: Metadata = {
  title: 'Support for Partners & Family | Bloom Psychology',
  description: 'Resources and support for partners and family members supporting someone through postpartum depression, anxiety, or motherhood challenges.',
  keywords: 'partner support, family support, postpartum depression help, supporting new mom, husband support, maternal mental health',
};

export default function PartnersPage() {
  return (
    <>
      {/* Hero Section */}
      <ParallaxContainer
        className="min-h-[70vh] bg-white relative flex items-center"
        layers={[
          {
            element: <OrganicShape variant="blob-1" color="var(--bloom-accent)" size="xl" position="bottom-left" opacity={0.1} />,
            speed: 0.2,
            zIndex: 1
          },
          {
            element: <OrganicShape variant="blob-2" color="var(--bloom-blush)" size="lg" position="top-right" opacity={0.1} rotate={45} />,
            speed: -0.3,
            zIndex: 1
          }
        ]}
      >
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="font-playfair text-bloom text-4xl lg:text-5xl xl:text-6xl mb-6">
                <KineticTypography animation="letter-by-letter">
                  Supporting Your Partner
                </KineticTypography>
                <br />
                <KineticTypography animation="letter-by-letter" className="text-bloompink">
                  Through Motherhood
                </KineticTypography>
              </h1>
              
              <KineticTypography as="p" animation="fade-in" className="text-xl text-bloom/80 mb-8">
                When your partner is struggling with postpartum depression, anxiety, or the challenges of new motherhood, you want to help—but you might not know how. You're not alone in this journey.
              </KineticTypography>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button href="#how-to-help" variant="pink" pulseOnView>
                  How to Help
                </Button>
                <Button href="/book" variant="outline">
                  Book Support Session
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/optimized/Services/Experienced Parents.webp"
                  alt="Supportive partner and new mother"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-bloom-blush/20 rounded-full -z-10"></div>
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-bloom-accent/30 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </ParallaxContainer>

      {/* Understanding Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="var(--bloom-accent)"
          size="full"
          position="bottom-left"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Understanding What She's Going Through
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-3xl mx-auto">
              Postpartum mental health challenges affect 1 in 5 mothers. It's not her fault, and it's not something she can just "snap out of."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Postpartum Depression",
                symptoms: [
                  "Persistent sadness or emptiness",
                  "Loss of interest in activities",
                  "Difficulty bonding with baby",
                  "Feelings of guilt or inadequacy",
                  "Changes in sleep/appetite"
                ]
              },
              {
                title: "Postpartum Anxiety",
                symptoms: [
                  "Excessive worry about baby",
                  "Intrusive, scary thoughts",
                  "Physical symptoms (racing heart)",
                  "Difficulty sleeping when baby sleeps",
                  "Constant need to check on baby"
                ]
              },
              {
                title: "General Overwhelm",
                symptoms: [
                  "Feeling exhausted beyond normal",
                  "Identity confusion",
                  "Relationship stress",
                  "Difficulty making decisions",
                  "Feeling isolated or alone"
                ]
              }
            ].map((condition, index) => (
              <GlassmorphismPanel 
                key={index}
                variant="medium"
                className="p-6 h-full"
                hoverEffect="lift"
              >
                <h3 className="font-playfair text-xl text-bloom mb-4">{condition.title}</h3>
                <ul className="space-y-2">
                  {condition.symptoms.map((symptom, idx) => (
                    <li key={idx} className="text-bloom/70 text-sm flex items-start">
                      <span className="w-2 h-2 bg-bloom-accent rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </GlassmorphismPanel>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help Section */}
      <section id="how-to-help" className="py-20 bg-white relative overflow-hidden">
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.07}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              How You Can Help
            </KineticTypography>
            
            <div className="w-32 h-1 bg-gradient-to-r from-bloom-blush to-bloom-accent mx-auto rounded-full mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Your support can make a tremendous difference in her recovery. Here's how to help effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* DO's */}
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">✓</span>
                What TO Do
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    action: "Listen without trying to fix",
                    description: "Sometimes she just needs to be heard and validated, not offered solutions."
                  },
                  {
                    action: "Take initiative with baby care",
                    description: "Don't wait to be asked. Jump in with diaper changes, feedings, and soothing."
                  },
                  {
                    action: "Handle household tasks",
                    description: "Cook, clean, do laundry, grocery shop—reduce her mental load."
                  },
                  {
                    action: "Encourage professional help",
                    description: "Gently suggest therapy or medical support without judgment."
                  },
                  {
                    action: "Give her breaks",
                    description: "Take the baby for walks, encourage naps, create space for her to shower or rest."
                  },
                  {
                    action: "Validate her feelings",
                    description: "Tell her she's a good mom and that her feelings are normal and temporary."
                  }
                ].map((item, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-medium text-bloom mb-1">{item.action}</h4>
                    <p className="text-bloom/70 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* DON'Ts */}
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">✗</span>
                What NOT to Do
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    action: "Don't say \"just think positive\"",
                    description: "This minimizes her experience and implies she's choosing to feel this way."
                  },
                  {
                    action: "Don't compare her to other moms",
                    description: "Every mother's experience is different. Comparisons create more pressure."
                  },
                  {
                    action: "Don't take her mood personally",
                    description: "Her irritability or withdrawal is about her mental health, not you."
                  },
                  {
                    action: "Don't tell her to \"just rest\"",
                    description: "Without actual help, this advice just adds guilt when she can't."
                  },
                  {
                    action: "Don't dismiss her concerns",
                    description: "Even if her worries seem excessive, they're real and distressing to her."
                  },
                  {
                    action: "Don't expect immediate change",
                    description: "Recovery takes time. Celebrate small improvements."
                  }
                ].map((item, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-medium text-bloom mb-1">{item.action}</h4>
                    <p className="text-bloom/70 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Taking Care of Yourself */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Taking Care of Yourself Too
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Supporting someone with postpartum mental health challenges can be emotionally and physically demanding. Your wellbeing matters too.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <GlassmorphismPanel variant="prominent" className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-4">Signs You Need Support</h3>
                  <ul className="space-y-3">
                    {[
                      "Feeling overwhelmed or resentful",
                      "Difficulty sleeping or eating",
                      "Withdrawing from friends/family",
                      "Irritability or mood changes",
                      "Feeling guilty or helpless"
                    ].map((sign, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-bloompink rounded-full mr-3 mt-2"></span>
                        <span className="text-bloom/80">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-4">Self-Care Strategies</h3>
                  <ul className="space-y-3">
                    {[
                      "Accept help from others",
                      "Maintain some personal interests",
                      "Talk to friends or family",
                      "Consider your own therapy",
                      "Practice patience with the process"
                    ].map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-bloom-accent rounded-full mr-3 mt-2"></span>
                        <span className="text-bloom/80">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassmorphismPanel>
          </div>
        </div>
      </section>

      {/* When to Seek Emergency Help */}
      <section className="py-16 bg-red-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-3xl text-red-800 mb-6">When to Seek Emergency Help</h2>
            <p className="text-red-700 mb-8">
              If your partner expresses any of these thoughts or behaviors, seek immediate professional help:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                "Thoughts of harming herself or the baby",
                "Talking about not wanting to live",
                "Severe confusion or psychosis",
                "Complete inability to care for baby",
                "Substance abuse to cope",
                "Extremely agitated or paranoid behavior"
              ].map((warning, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <span className="text-red-800 font-medium">{warning}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-playfair text-xl text-red-800 mb-4">Emergency Resources</h3>
              <div className="space-y-2 text-red-700">
                <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                <p><strong>Postpartum Support International Crisis Line:</strong> 1-800-944-4773</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                <p><strong>Emergency:</strong> Call 911 or go to nearest emergency room</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Resources for Partners
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Partner Support Groups",
                description: "Connect with other partners going through similar experiences",
                link: "/contact",
                linkText: "Find Groups"
              },
              {
                title: "Educational Resources",
                description: "Learn more about postpartum mental health and recovery",
                link: "/resources",
                linkText: "View Resources"
              },
              {
                title: "Professional Support",
                description: "Individual or couples therapy to strengthen your relationship",
                link: "/book",
                linkText: "Book Session"
              }
            ].map((resource, index) => (
              <GlassmorphismPanel key={index} variant="medium" className="p-6 text-center">
                <h3 className="font-playfair text-xl text-bloom mb-4">{resource.title}</h3>
                <p className="text-bloom/70 mb-6">{resource.description}</p>
                <Link 
                  href={resource.link}
                  className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium"
                >
                  {resource.linkText}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </GlassmorphismPanel>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bloom relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="#FFFFFF"
          size="full"
          position="bottom-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6 text-center">
          <KineticTypography as="h2" animation="fade-in" className="font-playfair text-white text-3xl md:text-4xl mb-6">
            You Don't Have to Navigate This Alone
          </KineticTypography>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10">
            Professional support can help both of you through this challenging time. Schedule a consultation to learn how we can support your family.
          </p>
          
          <Button 
            href="/book" 
            variant="pink" 
            size="lg" 
            className="inline-block"
            pulseOnView
          >
            Schedule Consultation
          </Button>
        </div>
      </section>
    </>
  );
}