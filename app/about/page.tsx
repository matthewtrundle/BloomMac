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
  description: 'Meet Dr. Jana Rundle and the Bloom Psychology team. Learn about our approach to mental health care for women, mothers, and parents.',
  keywords: 'about, therapist, psychologist, Jana Rundle, women therapy, approach, philosophy',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with Hero2.png */}
      <section className="pt-20 pb-10 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 h-[50vh] overflow-hidden">
          <Image
            src="/images/optimized/Hero/ABoutHero.webp"
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
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <KineticTypography as="h1" animation="fade-in" className="font-playfair text-bloom-dark text-4xl md:text-5xl lg:text-6xl mb-6 text-shadow-lg">
              About Bloom Psychology
            </KineticTypography>
            
            <div className="w-20 h-1 bg-[#C63780] mx-auto mb-8"></div>
            
            <p className="text-bloom-dark/90 max-w-2xl mx-auto font-medium text-shadow">
              Dedicated to providing compassionate, evidence-based mental health care for women, mothers, and parents in North Austin.
            </p>
          </div>
        </div>
      </section>
      
      {/* About text is in the hero section above */}
      
      {/* Meet Dr. Rundle Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
                Meet Dr. Jana Rundle
              </KineticTypography>
              
              <div className="w-20 h-1 bg-[#C63780] mb-8"></div>
              
              <GlassmorphismPanel variant="medium" className="p-8 space-y-6">
                <p className="text-bloom/80">
                  Hi! I'm glad you're here! I am a licensed clinical psychologist with over 10 years of experience specializing in women's mental health, maternal wellness, and parent support.
                </p>

                <p className="text-bloom/80">
                  Being a woman in today's world is difficult. The demands and expectations that society places on us to be all things to all people can become a huge burden. Perhaps you are someone who is feeling overwhelmed with trying to "do it all." If so, you're in the right place.
                </p>

                <p className="text-bloom/80">
                  After having my own children and seeing just how little support moms receive, I developed a passion for supporting women through life transitions, particularly those related to motherhood and family dynamics. I am certified in perinatal mental health, and I bring both professional expertise and personal understanding to my work with clients navigating the complex terrain of modern womanhood and parenthood.
                </p>

                <p className="text-bloom/80">
                  Typically my work with clients focuses on reducing stress, improving social connection, while also improving family dynamics so they feel like the best version of themselves. I have specialized training in Interpersonal Psychotherapy (IPT), an evidenced-based therapy for women with perinatal mood disorders. I also integrate practices of Cognitive Behavioral Therapy (CBT) and psychodynamically focussed interventions to help clients go from "survive" to "thrive."
                </p>

                <p className="text-bloom/80">
                  In my spare time, I enjoy traveling, hiking, a good cup of coffee, and volunteering for local non-profits. Reach out to see how I might be able to help you!
                </p>
              </GlassmorphismPanel>
              
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
                <div className="h-full w-full">
                  <div className="relative w-full aspect-[3/4] overflow-hidden shadow-md">
                    <Image 
                      src="/images/optimized/Team/Jana Rundle.webp" 
                      alt="Dr. Jana Rundle" 
                      fill
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
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
            
            <div className="w-20 h-1 bg-[#C63780] mx-auto mb-8"></div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              At Bloom Psychology, we believe in providing holistic, compassionate care tailored to each individual's unique needs and circumstances.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <GlassmorphismPanel variant="medium" className="p-8">
              <p className="text-bloom/80">
                At Bloom Psychology, we believe lasting change happens when expertise meets empathy. I partner with you—sharing both professional insight and real-world experience—to guide your journey toward a more balanced, joyful life. Every session is tailored to your unique story, weaving together evidence-based practices (like CBT, IPT, and psychodynamic tools) with warmth, humor, and genuine care.
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
              
              <div className="w-20 h-1 bg-[#C63780] mx-auto"></div>
            </div>
            
            <div className="space-y-12">
              <GlassmorphismPanel variant="medium" className="p-8 space-y-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                    <div className="w-12 h-12 rounded-full bg-bloom-accent/20 flex items-center justify-center text-bloom-accent">
                      <span className="font-playfair text-lg">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Connection</h3>
                    <p className="text-bloom/80">
                      You're never alone in this process. We build a trusting, collaborative space where your voice always matters.
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
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Compassion</h3>
                    <p className="text-bloom/80">
                      Life is messy—and that's okay. I'm here to meet you where you are, with kindness, curiosity, and a judgment-free ear.
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
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Authenticity</h3>
                    <p className="text-bloom/80">
                      Your story is one-of-a-kind. Together, we uncover what really matters to you and honor your strengths every step of the way.
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
                    <h3 className="font-playfair text-xl text-bloom mb-3 text-center md:text-left">Growth</h3>
                    <p className="text-bloom/80">
                      Small steps lead to big change. I'll help you set realistic goals, celebrate every win, and learn from each challenge—so you can thrive long after our work together.
                    </p>
                  </div>
                </div>
              </GlassmorphismPanel>
            </div>
          </div>
        </div>
      </section>
      
      {/* Office Environment Section removed as requested */}
      
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
            href="/book" 
            variant="pink" 
            size="lg" 
            className="inline-block"
            pulseOnView
          >
            Book Now
          </Button>
        </div>
      </section>
    </>
  );
}
