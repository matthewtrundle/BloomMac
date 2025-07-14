import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/data/services';

// Client Components
import { AnimatedDiv, AnimatedDetails } from '@/components/services/AnimatedServiceElements';

// UI Components
import Button from '@/components/ui/Button';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import OrganicShape from '@/components/ui/OrganicShape';
import ParallaxContainer from '@/components/ui/ParallaxContainer';
import KineticTypography from '@/components/ui/KineticTypography';
import SmartTitle, { getCleanTitle } from '@/components/ui/SmartTitle';

// SEO Components
import { ServiceSchema, FAQSchema } from '@/components/seo/JsonLd';

// Generate static paths for all services
export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({
    slug,
  }));
}

// Generate metadata for each service page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }
  
  // Remove any line breaks for metadata  
  const cleanTitle = getCleanTitle(service?.title);

  return {
    title: cleanTitle,
    description: service.description,
    keywords: `therapy, ${cleanTitle.toLowerCase()}, Austin, mental health, counseling, psychology`,
    openGraph: {
      title: cleanTitle,
      description: service.shortDescription,
      images: [service.heroImage],
    },
  };
}

export default function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  
  // Handle 404
  if (!service) {
    notFound();
  }
  
  return (
    <>
      {/* SEO Schema */}
      <ServiceSchema
        name={getCleanTitle(service?.title)}
        url={`https://bloompsychologynorthaustin.com/services/${service.slug}`}
        description={service.description}
        provider={{
          name: 'Bloom Psychology',
          url: 'https://bloompsychologynorthaustin.com'
        }}
        serviceType="MentalHealthService"
      />
      
      <FAQSchema faqs={service.faqs} />
      
      {/* Hero Section */}
      <ParallaxContainer
        className="min-h-[70vh] bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 relative flex items-center overflow-hidden"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="order-2 lg:order-1 w-full mt-6 lg:mt-0">
              <SmartTitle 
                title={service?.title}
                as="h1" 
                className="service-title font-playfair text-bloom text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6 leading-tight w-full pr-4 lg:pr-0"
              />
              
              {/* Professional divider */}
              <div className="w-24 h-0.5 bg-bloom-sage/20 rounded-full mb-6"></div>
              
              <div className="text-lg text-bloom/80 mb-8 space-y-4">
                {service?.description ? service.description.split('\n\n').map((paragraph, index) => (
                  <KineticTypography key={index} as="p" animation="fade-in">
                    {paragraph}
                  </KineticTypography>
                )) : (
                  <KineticTypography as="p" animation="fade-in">
                    Service description not available.
                  </KineticTypography>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button href="/book" variant="pink" pulseOnView>
                  Book Now
                </Button>
                <Button href="#how-it-works" variant="outline">
                  Learn How It Works
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={service.heroImage}
                  alt={service.title}
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
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden">
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
              {service.howItWorks.title}
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {service.howItWorks.steps.map((step, index) => (
              <AnimatedDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassmorphismPanel 
                  variant={index === 1 ? 'prominent' : 'medium'}
                  className="p-6 h-full border border-bloom-sage/10"
                  hoverEffect="lift"
                >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-bloom flex items-center justify-center text-white font-bold text-xl mr-4">
                      {index + 1}
                    </div>
                    <h3 className="font-playfair text-xl text-bloom">{step.title}</h3>
                  </div>
                  
                  <p className="text-bloom/80 mt-2 flex-grow">{step.description}</p>
                </div>
                </GlassmorphismPanel>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/20 to-white relative overflow-hidden">
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
              Key Benefits
            </KineticTypography>
            
            <div className="w-32 h-1 bg-gradient-to-r from-bloom-blush to-bloom-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.benefits.map((benefit, index) => (
              <AnimatedDiv 
                key={index} 
                className="group flex hover:-translate-y-1 transition-transform duration-300 ease-out"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mr-4 mt-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bloom-blush/30 to-bloom-accent/30 flex items-center justify-center text-bloom shadow-pink-sm group-hover:shadow-pink-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-bloom mb-2">{benefit.title}</h3>
                  <p className="text-bloom/70">{benefit.description}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden">
        <OrganicShape
          variant="circle"
          color="var(--bloom-blush)"
          size="md"
          position="top-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <KineticTypography as="h2" animation="word-by-word" className="font-playfair text-bloom mb-4">
              Frequently Asked Questions
            </KineticTypography>
            
            <div className="w-20 h-1 bg-bloom-accent mx-auto mb-6"></div>
            <p className="text-bloom/70 max-w-2xl mx-auto">
              We're here to answer your questions about this service.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {service.faqs.map((faq, index) => (
              <AnimatedDetails 
                key={index} 
                className="py-6 group bg-gradient-to-r from-white to-bloom-sage-50/20 rounded-lg px-6 mb-4 border border-bloom-sage/10 hover:shadow-lg transition-all duration-300"
                open={index === 0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-lg font-medium text-bloom pr-6">{faq.question}</h3>
                  <span className="text-bloom transition-transform duration-300 group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-bloom/80">
                  <p>{faq.answer}</p>
                </div>
              </AnimatedDetails>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/faq" 
              className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium"
            >
              View All FAQs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-bloompink to-pink-400 relative overflow-hidden">
        <OrganicShape
          variant="wave"
          color="#FFFFFF"
          size="full"
          position="bottom-right"
          opacity={0.03}
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
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
