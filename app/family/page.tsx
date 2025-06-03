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
  title: 'Family Support Resources | Bloom Psychology',
  description: 'Resources for family members supporting someone through postpartum depression, anxiety, or motherhood challenges. Help for parents, siblings, and extended family.',
  keywords: 'family support, grandparent support, postpartum depression help, supporting new mom, maternal mental health, family resources',
};

export default function FamilyPage() {
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
                  Supporting Your
                </KineticTypography>
                <br />
                <KineticTypography animation="letter-by-letter" className="text-bloompink">
                  Family Member
                </KineticTypography>
              </h1>
              
              <KineticTypography as="p" animation="fade-in" className="text-xl text-bloom/80 mb-8">
                When someone you love is struggling with postpartum mental health challenges, you want to help. Understanding how to provide meaningful support can make all the difference in their recovery.
              </KineticTypography>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button href="#understanding" variant="pink" pulseOnView>
                  Learn How to Help
                </Button>
                <Button href="/contact" variant="outline">
                  Ask Questions
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/optimized/Services/Walking through fields.webp"
                  alt="Multi-generational family support"
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
      <section id="understanding" className="py-20 bg-gray-50 relative overflow-hidden">
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
              Understanding Postpartum Mental Health
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-3xl mx-auto">
              Postpartum mental health challenges are medical conditions, not character flaws. With understanding and support, recovery is possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6">Common Misconceptions</h3>
              <div className="space-y-4">
                {[
                  {
                    myth: "\"She just needs to be grateful for her healthy baby\"",
                    reality: "Gratitude and depression can coexist. PPD is not about lack of appreciation."
                  },
                  {
                    myth: "\"She should be over this by now\"",
                    reality: "Recovery timelines vary. Some need support for months or longer."
                  },
                  {
                    myth: "\"She's just being dramatic\"",
                    reality: "PPD involves real brain chemistry changes and genuine suffering."
                  },
                  {
                    myth: "\"This means she's a bad mother\"",
                    reality: "PPD affects excellent mothers. It's an illness, not a judgment on parenting."
                  }
                ].map((item, index) => (
                  <div key={index} className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">✗</span>
                      <div>
                        <p className="text-red-800 font-medium mb-1">{item.myth}</p>
                        <p className="text-red-700 text-sm">{item.reality}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6">The Reality</h3>
              <div className="space-y-4">
                {[
                  "1 in 5 mothers experience postpartum depression or anxiety",
                  "Hormonal changes, sleep deprivation, and life stress all contribute",
                  "It can happen to anyone, regardless of age, race, or socioeconomic status",
                  "Professional treatment is often necessary and highly effective",
                  "Family support significantly improves recovery outcomes",
                  "Most mothers fully recover with appropriate care"
                ].map((fact, index) => (
                  <div key={index} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <p className="text-green-800">{fact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Support */}
      <section className="py-20 bg-white relative overflow-hidden">
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
              Support by Family Role
            </KineticTypography>
            
            <div className="w-32 h-1 bg-gradient-to-r from-bloom-blush to-bloom-accent mx-auto rounded-full mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Different family members can provide unique types of support. Here's how you can help based on your relationship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grandparents */}
            <GlassmorphismPanel variant="medium" className="p-6">
              <h3 className="font-playfair text-xl text-bloom mb-4">For Grandparents</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-bloom mb-1">Practical Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Bring meals without being asked</li>
                    <li>• Help with household chores</li>
                    <li>• Offer to hold baby while she showers</li>
                    <li>• Run errands or grocery shop</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-bloom mb-1">Emotional Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Share your own parenting struggles</li>
                    <li>• Reassure her she's a good mother</li>
                    <li>• Avoid comparing to "your generation"</li>
                    <li>• Respect new parenting approaches</li>
                  </ul>
                </div>
              </div>
            </GlassmorphismPanel>

            {/* Siblings */}
            <GlassmorphismPanel variant="medium" className="p-6">
              <h3 className="font-playfair text-xl text-bloom mb-4">For Siblings</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-bloom mb-1">Practical Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Take older children for activities</li>
                    <li>• Coordinate family meal deliveries</li>
                    <li>• Help with baby gear assembly</li>
                    <li>• Offer childcare for appointments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-bloom mb-1">Emotional Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Maintain normal sibling relationship</li>
                    <li>• Include her in family activities (with flexibility)</li>
                    <li>• Don't take mood changes personally</li>
                    <li>• Advocate for her needs with parents</li>
                  </ul>
                </div>
              </div>
            </GlassmorphismPanel>

            {/* Extended Family */}
            <GlassmorphismPanel variant="medium" className="p-6">
              <h3 className="font-playfair text-xl text-bloom mb-4">For Extended Family</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-bloom mb-1">Practical Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Respect visiting boundaries</li>
                    <li>• Bring specific, useful gifts</li>
                    <li>• Help coordinate support efforts</li>
                    <li>• Offer respite care</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-bloom mb-1">Emotional Support</h4>
                  <ul className="text-sm text-bloom/70 space-y-1">
                    <li>• Follow immediate family's lead</li>
                    <li>• Avoid unsolicited advice</li>
                    <li>• Normalize seeking professional help</li>
                    <li>• Maintain family traditions flexibly</li>
                  </ul>
                </div>
              </div>
            </GlassmorphismPanel>
          </div>
        </div>
      </section>

      {/* Communication Guide */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Communication Guidelines
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              What you say and how you say it can significantly impact her recovery. Here's guidance on supportive communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Helpful Phrases */}
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">💚</span>
                Helpful Things to Say
              </h3>
              
              <div className="space-y-4">
                {[
                  "\"You're a wonderful mother, even when you don't feel like it.\"",
                  "\"This is temporary. You will feel better.\"",
                  "\"What specific help do you need today?\"",
                  "\"Your feelings are valid and understandable.\"",
                  "\"I'm proud of you for seeking help.\"",
                  "\"Would you like me to research therapists for you?\"",
                  "\"I'll handle [specific task] so you can rest.\"",
                  "\"You're doing the best you can in a difficult situation.\""
                ].map((phrase, index) => (
                  <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="text-green-800 italic">{phrase}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Harmful Phrases */}
            <div>
              <h3 className="font-playfair text-2xl text-bloom mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">⚠️</span>
                Phrases to Avoid
              </h3>
              
              <div className="space-y-4">
                {[
                  "\"At least you have a healthy baby.\"",
                  "\"When I had kids, we just got on with it.\"",
                  "\"You just need to think positively.\"",
                  "\"Everyone feels like this after having a baby.\"",
                  "\"You should be grateful.\"",
                  "\"It's all in your head.\"",
                  "\"You chose to have this baby.\"",
                  "\"Other moms manage just fine.\""
                ].map((phrase, index) => (
                  <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <p className="text-red-800 italic">{phrase}</p>
                    <p className="text-red-600 text-xs mt-1">This minimizes her experience and can increase shame.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Considerations */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Cultural and Generational Considerations
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Different cultures and generations may have varying perspectives on mental health. Bridge these differences with understanding.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <GlassmorphismPanel variant="prominent" className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-4">Common Cultural Barriers</h3>
                  <ul className="space-y-3">
                    {[
                      "Stigma around mental health treatment",
                      "Belief that mothers should be naturally fulfilled",
                      "Pressure to be strong and self-reliant",
                      "Fear of bringing shame to the family",
                      "Religious beliefs about suffering",
                      "Language barriers with healthcare providers"
                    ].map((barrier, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-bloompink rounded-full mr-3 mt-2"></span>
                        <span className="text-bloom/80">{barrier}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-4">Bridging Differences</h3>
                  <ul className="space-y-3">
                    {[
                      "Educate family about medical nature of PPD",
                      "Find culturally competent therapists",
                      "Respect traditional practices while encouraging treatment",
                      "Include respected elders in treatment decisions",
                      "Use religious/spiritual frameworks positively",
                      "Address language needs in healthcare settings"
                    ].map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-bloom-accent rounded-full mr-3 mt-2"></span>
                        <span className="text-bloom/80">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassmorphismPanel>
          </div>
        </div>
      </section>

      {/* Family Resources */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Resources for Families
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Family Education Sessions",
                description: "Learn about postpartum mental health and how to support recovery",
                features: ["Understanding PPD/PPA", "Communication skills", "Boundary setting", "Self-care for supporters"],
                link: "/contact",
                linkText: "Schedule Session"
              },
              {
                title: "Support Groups",
                description: "Connect with other families facing similar challenges",
                features: ["Peer support", "Shared experiences", "Practical tips", "Professional guidance"],
                link: "/contact",
                linkText: "Find Groups"
              },
              {
                title: "Crisis Planning",
                description: "Know how to respond to mental health emergencies",
                features: ["Warning signs", "Emergency contacts", "Safety planning", "Hospital resources"],
                link: "/resources",
                linkText: "View Resources"
              }
            ].map((resource, index) => (
              <GlassmorphismPanel key={index} variant="medium" className="p-6">
                <h3 className="font-playfair text-xl text-bloom mb-4">{resource.title}</h3>
                <p className="text-bloom/70 mb-4">{resource.description}</p>
                <ul className="space-y-1 mb-6">
                  {resource.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-bloom/70 flex items-start">
                      <span className="w-1 h-1 bg-bloom-accent rounded-full mr-2 mt-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
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
            Your Support Can Make the Difference
          </KineticTypography>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10">
            Family support is one of the strongest predictors of recovery from postpartum mental health challenges. Let us help you provide the best support possible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/contact" 
              variant="pink" 
              size="lg"
              pulseOnView
            >
              Get Support Resources
            </Button>
            <Button 
              href="/book" 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-bloom"
            >
              Schedule Family Session
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}