import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

// UI Components
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import Button from '@/components/ui/Button';
import ParallaxContainer from '@/components/ui/ParallaxContainer';

// Client components can't use the revalidate export 
// Use route handlers for data revalidation instead

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet Dr. Jana Rundle and the Bloom Psychology North Austin team. Learn about our approach to mental health care for women, mothers, and families.',
  keywords: 'about, therapist, psychologist, Jana Rundle, women therapy, approach, philosophy',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with Hero2.png */}
      <section className="pt-20 pb-10 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 h-[50vh] overflow-hidden">
          <Image
            src="/images/Hero/Hero2.png"
            alt="Bloom Psychology hero"
            fill
            className="object-cover"
            objectPosition="center"
            priority
          />
          <div className="absolute inset-0 bg-white/40"></div>
        </div>
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="bottom-left"
          opacity={0.05}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
          rotate={45}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <KineticTypography as="h1" animation="letter-by-letter" className="font-playfair text-bloom text-4xl md:text-5xl lg:text-6xl mb-6">
              About Bloom Psychology
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-8"></div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              Dedicated to providing compassionate, evidence-based mental health care for women, mothers, and families in North Austin.
            </p>
          </div>
        </div>
      </section>
      
      {/* Meet Dr. Rundle Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
                Meet Dr. Jana Rundle
              </KineticTypography>
              
              <div className="w-20 h-1 bg-bloom-accent mb-8"></div>
              
              <div className="space-y-6 text-bloom/80">
                <p>
                  Dr. Jana Rundle is a licensed clinical psychologist with over 10 years of experience specializing in women's mental health, maternal wellness, and family therapy.
                </p>
                
                <p>
                  After completing her doctoral training at the University of Texas at Austin and her internship at Dell Children's Medical Center, Dr. Rundle developed a passion for supporting women through life transitions, particularly those related to motherhood and family dynamics.
                </p>
                
                <p>
                  Her approach integrates evidence-based practices including Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and attachment-focused interventions, all delivered with warmth, empathy, and cultural sensitivity.
                </p>
                
                <p>
                  As a mother herself, Dr. Rundle brings both professional expertise and personal understanding to her work with clients navigating the complex terrain of modern womanhood and parenthood.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">PsyD, Clinical Psychology</span>
                </div>
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">Licensed Psychologist</span>
                </div>
                <div className="bg-bloom-accent/10 px-4 py-2 rounded-md text-bloom">
                  <span className="font-medium">Perinatal Mental Health Certified</span>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <ParallaxContainer 
                className="relative"
                layers={[
                  {
                    element: <OrganicShape variant="blob-2" color="var(--bloom-blush)" size="lg" position="bottom-right" opacity={0.1} />,
                    speed: 0.2,
                    zIndex: -1
                  }
                ]}
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg shadow-xl relative z-10">
                  <Image
                    src="/images/Team/Jana Rundle.jpg"
                    alt="Dr. Jana Rundle"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-bloom-accent/20 rounded-full -z-10"></div>
                <div className="absolute -top-5 -right-5 w-16 h-16 bg-bloom-blush/30 rounded-full -z-10"></div>
              </ParallaxContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
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
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
              Our Approach
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-8"></div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              At Bloom Psychology, we believe in providing holistic, compassionate care tailored to each individual's unique needs and circumstances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassmorphismPanel variant="medium" className="p-8 h-full" hoverEffect="lift">
              <div className="text-bloom-accent mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-xl text-bloom mb-4">Evidence-Based Practices</h3>
              
              <p className="text-bloom/70">
                We integrate proven therapeutic techniques from CBT, ACT, mindfulness, and attachment theory to provide effective, research-supported treatments customized to your specific needs.
              </p>
            </GlassmorphismPanel>
            
            <GlassmorphismPanel variant="prominent" className="p-8 h-full" hoverEffect="lift">
              <div className="text-bloom-accent mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-xl text-bloom mb-4">Whole-Person Approach</h3>
              
              <p className="text-bloom/70">
                We recognize that mental health is connected to physical, social, and spiritual wellbeing. Our therapy considers all aspects of your life to support comprehensive healing and growth.
              </p>
            </GlassmorphismPanel>
            
            <GlassmorphismPanel variant="medium" className="p-8 h-full" hoverEffect="lift">
              <div className="text-bloom-accent mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-xl text-bloom mb-4">Compassionate Care</h3>
              
              <p className="text-bloom/70">
                We create a warm, non-judgmental space where you can feel safe exploring difficult emotions and experiences. Our relationship-based approach emphasizes empathy, understanding, and genuine connection.
              </p>
            </GlassmorphismPanel>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
                Our Core Values
              </KineticTypography>
              
              <div className="w-20 h-1 bg-bloom-accent mx-auto"></div>
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-bloom-accent/20 flex items-center justify-center text-bloom-accent">
                    <span className="font-playfair text-lg">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Authenticity</h3>
                  <p className="text-bloom/70">
                    We value genuine connections and believe that honest, transparent relationships are essential for effective therapy. We create a space where you can be your true self without fear of judgment.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-bloom-accent/20 flex items-center justify-center text-bloom-accent">
                    <span className="font-playfair text-lg">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Growth</h3>
                  <p className="text-bloom/70">
                    We believe in your inherent capacity for growth and resilience. Our therapy focuses on identifying strengths, building new skills, and fostering personal development throughout life's challenges.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-bloom-accent/20 flex items-center justify-center text-bloom-accent">
                    <span className="font-playfair text-lg">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Inclusivity</h3>
                  <p className="text-bloom/70">
                    We are committed to creating a welcoming environment for people of all backgrounds, identities, and experiences. We continuously educate ourselves about diverse perspectives and provide culturally responsive care.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-bloom-accent/20 flex items-center justify-center text-bloom-accent">
                    <span className="font-playfair text-lg">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Balance</h3>
                  <p className="text-bloom/70">
                    We recognize the importance of finding harmony among the different aspects of your life. Our therapy helps you develop sustainable practices that honor your needs while meeting your responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Office Environment Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <OrganicShape
          variant="circle"
          color="var(--bloom-accent)"
          size="md"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
                Our Welcoming Space
              </KineticTypography>
              
              <div className="w-20 h-1 bg-bloom-accent mb-8"></div>
              
              <div className="space-y-6 text-bloom/80">
                <p>
                  Located in North Austin, our office provides a calm, comfortable environment designed to help you feel at ease from the moment you arrive.
                </p>
                
                <p>
                  Our thoughtfully designed space features private therapy rooms with comfortable seating, soft lighting, and soothing décor that promotes relaxation and openness.
                </p>
                
                <p>
                  For parents with young children, we offer a family-friendly setting with child-appropriate spaces and resources. Parents with babies are always welcome to bring their little ones to sessions.
                </p>
              </div>
              
              <div className="mt-8">
                <Button href="/contact" variant="primary">
                  Schedule a Visit
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src="/images/Home/Cozy Sunlit movie room.png"
                  alt="Bloom Psychology office space"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-md mt-8">
                <Image
                  src="/images/Services/Empty Armchair.png"
                  alt="Therapy room"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src="/images/Services/Symbolic Shoes.png"
                  alt="Office detail"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-md mt-8">
                <Image
                  src="/images/Services/Hopeful Hands.png"
                  alt="Therapy tools"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
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
            Ready to Begin Your Journey?
          </KineticTypography>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-10">
            Take the first step toward healing and growth with a free 15-minute consultation.
          </p>
          
          <Button 
            href="/contact" 
            variant="accent" 
            size="lg" 
            className="inline-block"
            pulseOnView
          >
            Schedule Your Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
