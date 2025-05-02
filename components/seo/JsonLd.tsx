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

interface FaqSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const FaqSchema: React.FC<FaqSchemaProps> = ({ questions }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
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
  FaqSchema
};
