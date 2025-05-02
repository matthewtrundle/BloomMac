import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';

// UI Components
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import SimpleParallaxContainer from '@/components/ui/SimpleParallaxContainer';
import ScrollingTicker from '@/components/ui/ScrollingTicker';

// SEO Components
import { OrganizationSchema } from '@/components/seo/JsonLd';

// ISR revalidation (60 seconds)
export const revalidate = 60;

export default function Home() {
  // Use a consistent pink-toned hero image for better branding
  const heroImage = '/images/Home/Decorative Floral Pattern.png';
  
  return (
    <>
      {/* SEO Schema */}
      <OrganizationSchema
        name="Bloom Psychology North Austin"
        url="https://bloompsychologynorthaustin.com"
        logo="https://bloompsychologynorthaustin.com/images/Logo/logo.jpg"
        description="Specialized therapy for women, moms, parents, and families in North Austin. Evidence-based approaches for anxiety, stress, and postpartum support."
        address={{
          streetAddress: "13706 N Highway 183, Suite 114",
          addressLocality: "Austin",
          addressRegion: "TX",
          postalCode: "78750",
          addressCountry: "US"
        }}
        telephone="+15128989510"
        email="jana@bloompsychologynorthaustin.com"
        sameAs={["https://instagram.com", "https://linkedin.com"]}
      />
      
      {/* Hero Section */}
      <section className="min-h-[90vh] relative bg-white overflow-hidden">
        {/* Hero background image with parallax */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Bloom Psychology hero"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-bloom/30" />
        </div>
        
        {/* Organic shapes for decoration */}
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="bottom-left"
          opacity={0.2}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.2}
          rotate={45}
        />
        
        <div className="container mx-auto px-6 py-24 min-h-[90vh] flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <KineticTypography 
              as="h1" 
              animation="letter-by-letter" 
              className="font-playfair text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              Bloom Psychology
            </KineticTypography>
            
            <KineticTypography 
              as="p"
              animation="fade-in" 
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Specialized mental health care for women, moms, and families in North Austin.
            </KineticTypography>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button 
                href="/contact" 
                variant="accent" 
                size="lg"
                pulseOnView
              >
                Schedule Free Consultation
              </Button>
              
              <Button 
                href="#services" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/50 hover:bg-white/20"
              >
                Explore Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="var(--bloom-accent)"
          size="full"
          position="bottom-left"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/Team/Jana Rundle.jpg"
                  alt="Dr. Jana Rundle"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-bloom-blush/10 rounded-full -z-10"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-bloom-accent/10 rounded-full -z-10"></div>
            </div>
            
            <div>
              <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
                Welcome to Bloom Psychology North Austin
              </KineticTypography>
              
              <div className="w-20 h-1 bg-bloom-accent mb-8"></div>
              
              <div className="space-y-6 text-bloom/80">
                <p>
                  At Bloom Psychology, we believe in providing compassionate, evidence-based therapy tailored to the unique needs of women, mothers, parents, and families.
                </p>
                
                <p>
                  Led by Dr. Jana Rundle, our practice specializes in addressing anxiety, stress, parenting challenges, and postpartum mental health in a warm, non-judgmental environment.
                </p>
                
                <p>
                  Whether you're seeking individual therapy, parent support, or help with specific challenges, we're here to support your journey toward healing and growth.
                </p>
                
                <div className="pt-4">
                  <Button href="/about" variant="outline">
                    Learn More About Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Scrolling Ticker for Postpartum Journey */}
      <ScrollingTicker 
        words={["HEALING", "SUPPORT", "GROWTH", "RESILIENCE", "RECOVERY", "HOPE", "CONNECTION", "STRENGTH"]} 
        separator="•" 
        bgColor="bg-gradient-to-r from-bloom-blush/10 to-bloom-pink-100/20" 
        textColor="text-bloom-pink-700" 
        speed={30}
        className="border-y border-bloom-blush/10"
      />
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
        <OrganicShape
          variant="blob-2"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.08}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-accent)"
          size="md"
          position="bottom-left"
          opacity={0.05}
          rotate={120}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
              Our Services
            </KineticTypography>
            
            <div className="w-32 h-1 bg-gradient-to-r from-bloom-blush to-bloom-accent mx-auto mb-8 rounded-full"></div>
            
            <p className="text-bloom/70 max-w-2xl mx-auto">
              We offer a range of specialized mental health services designed to support women, mothers, and families at every stage of life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <GlassmorphismPanel
                key={service.id}
                variant={index % 2 === 0 ? "medium" : "pink"}
                shape="rounded-lg"
                className="h-full p-6 flex flex-col"
                hoverEffect="lift"
              >
                <h3 className="font-playfair text-xl text-bloom mb-4">{service.title}</h3>
                <p className="text-bloom/70 mb-6 flex-grow">{service.shortDescription}</p>
                <Button 
                  href={`/services/${service.slug}`} 
                  variant={index % 2 === 0 ? "outline" : "pink-outline"} 
                  className="mt-auto"
                >
                  Learn More
                </Button>
              </GlassmorphismPanel>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-accent)"
          size="lg"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
              Client Testimonials
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <SimpleParallaxContainer className="relative">
              <OrganicShape variant="blob-1" color="var(--bloom-blush)" size="md" position="top-left" opacity={0.1} />
              <OrganicShape variant="blob-2" color="var(--bloom-accent)" size="sm" position="bottom-right" opacity={0.1} />
              <GlassmorphismPanel variant="prominent" className="p-8 md:p-12">
                <blockquote className="text-xl italic text-bloom/80 mb-8">
                  "Dr. Rundle created a safe space for me to explore my feelings around motherhood and anxiety. Her compassionate approach and practical strategies have made a profound difference in my life. I finally feel like myself again."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-bloom-blush/20 flex items-center justify-center text-bloom-blush mr-4">
                    <span className="font-playfair text-lg">K</span>
                  </div>
                  <div>
                    <p className="font-medium text-bloom">Katie R.</p>
                    <p className="text-bloom/60 text-sm">Anxiety Management Client</p>
                  </div>
                </div>
              </GlassmorphismPanel>
            </SimpleParallaxContainer>
          </div>
        </div>
      </section>
      
      {/* Featured In Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-2xl text-bloom/80 mb-10">As Featured In</h2>
            
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <div className="w-32 h-12 bg-bloom-accent/20 rounded flex items-center justify-center">
                <span className="font-playfair font-bold text-bloom">Austin Journal</span>
              </div>
              <div className="w-32 h-12 bg-bloom-accent/20 rounded flex items-center justify-center">
                <span className="font-playfair font-bold text-bloom">Psychology Today</span>
              </div>
              <div className="w-32 h-12 bg-bloom-accent/20 rounded flex items-center justify-center">
                <span className="font-playfair font-bold text-bloom">Mind & Wellness</span>
              </div>
              <div className="w-32 h-12 bg-bloom-accent/20 rounded flex items-center justify-center">
                <span className="font-playfair font-bold text-bloom">Parent Guide</span>
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
            Begin Your Healing Journey Today
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
