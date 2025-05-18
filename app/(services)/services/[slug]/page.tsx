import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/data/services';

// UI Components
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import KineticTypography from '@/components/ui/KineticTypography';
import OrganicShape from '@/components/ui/OrganicShape';
import Button from '@/components/ui/Button';
import ParallaxContainer from '@/components/ui/ParallaxContainer';

// SEO Components
import { ServiceSchema, FaqSchema } from '@/components/seo/JsonLd';

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
  const cleanTitle = service.title.replace('\n', ' ');

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
        name={service.title.replace('\n', ' ')}
        url={`https://bloompsychologynorthaustin.com/services/${service.slug}`}
        description={service.description}
        provider={{
          name: 'Bloom Psychology North Austin',
          url: 'https://bloompsychologynorthaustin.com'
        }}
        serviceType="MentalHealthService"
      />
      
      <FaqSchema questions={service.faqs} />
      
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
              <h1 className="font-playfair text-bloom text-3xl lg:text-4xl xl:text-5xl mb-6 max-w-[90%] lg:max-w-[95%]">
                {service.title.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i === 0 ? (
                      <KineticTypography animation="letter-by-letter">{line}</KineticTypography>
                    ) : (
                      <>
                        <br />
                        <KineticTypography animation="letter-by-letter">{line}</KineticTypography>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </h1>
              
              <KineticTypography as="p" animation="fade-in" className="text-lg text-bloom/80 mb-8">
                {service.description}
              </KineticTypography>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button href="/contact" variant="primary" pulseOnView>
                  Schedule Consultation
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
      <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
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
              <GlassmorphismPanel 
                key={index}
                variant={index === 1 ? 'prominent' : 'medium'}
                className="p-6 h-full"
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
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
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
              <div key={index} className="group flex hover:-translate-y-1 transition-transform duration-300 ease-out">
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
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
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
              <details 
                key={index} 
                className="py-6 group"
                open={index === 0}
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
              </details>
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
      
      {/* Secondary Image (if available) */}
      {service.secondaryImage && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto relative">
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={service.secondaryImage}
                  alt={`Additional information about ${service.title}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-bloom-accent/10 rounded-full -z-10"></div>
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-bloom-blush/20 rounded-full -z-10"></div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
