import React from 'react';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email: string;
  sameAs?: string[];
  priceRange?: string;
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  url,
  logo,
  description,
  address,
  telephone,
  email,
  sameAs = [],
  priceRange = "$$$"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": url,
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      ...address
    },
    telephone,
    email,
    sameAs,
    priceRange,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00"
      }
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.452948",  // Approx. for N Highway 183, Austin
      longitude: "-97.802354"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ServiceSchemaProps {
  name: string;
  url: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  serviceType: string;
  areaServed?: string;
}

export const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  url,
  description,
  provider,
  serviceType,
  areaServed = "Austin, TX"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalService",
    name,
    url,
    description,
    provider: {
      "@type": "MedicalBusiness",
      name: provider.name,
      url: provider.url
    },
    serviceType,
    areaServed: {
      "@type": "City",
      name: areaServed
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Course Schema for educational programs
interface CourseSchemaProps {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  courseMode: string;
  duration: string;
  instructor: {
    name: string;
    description: string;
  };
}

export const CourseSchema: React.FC<CourseSchemaProps> = ({ 
  name, 
  description, 
  provider, 
  offers, 
  courseMode, 
  duration, 
  instructor 
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      ...provider
    },
    offers: {
      '@type': 'Offer',
      ...offers
    },
    courseMode,
    duration,
    instructor: {
      '@type': 'Person',
      '@id': `${provider.url}/#instructor`,
      ...instructor
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// FAQ Schema - supports both 'faqs' and 'questions' props
interface FAQSchemaProps {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs, questions }) => {
  const items = faqs || questions || [];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default {
  OrganizationSchema,
  ServiceSchema,
  CourseSchema,
  FAQSchema,
  FaqSchema: FAQSchema // For backwards compatibility
};
