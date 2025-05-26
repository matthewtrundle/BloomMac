import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

// UI Components
import Button from '@/components/ui/Button';
import OrganicShape from '@/components/ui/OrganicShape';
import CareersApplicationForm from '@/components/careers/CareersApplicationForm';

export const metadata: Metadata = {
  title: 'Careers | Join Our Mental Health Team',
  description: 'Join the Bloom Psychology team in Austin, Texas. We\'re looking for passionate mental health professionals to support women, mothers, and families.',
  keywords: [
    'mental health careers austin',
    'therapist jobs austin',
    'psychology careers',
    'perinatal mental health jobs',
    'therapy practice employment',
    'mental health professional positions'
  ],
  openGraph: {
    title: 'Careers | Join Our Mental Health Team at Bloom Psychology',
    description: 'Join our team of mental health professionals supporting women, mothers, and families in Austin, Texas.',
    url: 'https://bloompsychologynorthaustin.com/careers',
    siteName: 'Bloom Psychology',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const openPositions = [
  {
    title: "Licensed Clinical Social Worker (LCSW)",
    type: "Full-time",
    location: "Austin, TX (Hybrid)",
    description: "Join our team to provide individual and group therapy focusing on women's mental health, postpartum support, and family therapy.",
    requirements: [
      "Licensed Clinical Social Worker in Texas",
      "2+ years of clinical experience",
      "Experience with women's mental health preferred",
      "Trauma-informed care background",
      "Strong communication and empathy skills"
    ],
    responsibilities: [
      "Provide individual therapy sessions",
      "Lead group therapy programs",
      "Collaborate with multidisciplinary team",
      "Maintain detailed clinical documentation",
      "Participate in team meetings and training"
    ]
  },
  {
    title: "Licensed Professional Counselor (LPC)",
    type: "Part-time",
    location: "Austin, TX (Hybrid)",
    description: "Seeking an LPC to provide specialized therapy for anxiety, depression, and life transitions with focus on maternal mental health.",
    requirements: [
      "Licensed Professional Counselor in Texas",
      "Experience with anxiety and mood disorders",
      "Perinatal mental health training preferred",
      "Group therapy experience a plus",
      "Flexible schedule availability"
    ],
    responsibilities: [
      "Conduct individual therapy sessions",
      "Develop treatment plans",
      "Provide crisis intervention when needed",
      "Participate in case consultations",
      "Contribute to program development"
    ]
  },
  {
    title: "Administrative Assistant",
    type: "Part-time",
    location: "Austin, TX (In-person)",
    description: "Support our growing practice with administrative tasks, client communication, and office management.",
    requirements: [
      "High school diploma or equivalent",
      "1+ years administrative experience",
      "Healthcare experience preferred",
      "Excellent communication skills",
      "Proficiency with office software"
    ],
    responsibilities: [
      "Manage client scheduling and communications",
      "Handle insurance verification and billing",
      "Maintain client records and files",
      "Coordinate office operations",
      "Assist with marketing and outreach"
    ]
  }
];

const benefits = [
  {
    icon: "💰",
    title: "Competitive Compensation",
    description: "Market-rate salaries with performance bonuses and annual reviews"
  },
  {
    icon: "🏥",
    title: "Health Benefits",
    description: "Comprehensive health, dental, and vision insurance coverage"
  },
  {
    icon: "📚",
    title: "Professional Development",
    description: "Continuing education support, conference attendance, and training opportunities"
  },
  {
    icon: "⏰",
    title: "Flexible Scheduling",
    description: "Work-life balance with flexible hours and hybrid work options"
  },
  {
    icon: "🌱",
    title: "Growth Opportunities",
    description: "Career advancement pathways and leadership development programs"
  },
  {
    icon: "🤝",
    title: "Supportive Team",
    description: "Collaborative environment with regular supervision and team support"
  }
];

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5 relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-right"
          opacity={0.03}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-bloom-accent/10 text-bloom-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Join Our Team
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-bloom mb-6">
              Make a Difference in
              <span className="text-bloom-accent block mt-2">
                Mental Health Care
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our passionate team of mental health professionals dedicated to supporting women, 
              mothers, and families through their wellness journeys.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="#positions" 
                variant="pink" 
                size="lg"
                className="inline-flex items-center"
              >
                View Open Positions
              </Button>
              <Button 
                href="#application" 
                variant="outline" 
                size="lg"
                className="inline-flex items-center"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                Why Work at Bloom Psychology?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're committed to creating a supportive, growth-oriented environment where you can thrive professionally while making a meaningful impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-bloom mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                Current Openings
              </h2>
              <p className="text-gray-600 text-lg">
                Explore opportunities to join our growing practice
              </p>
            </div>

            <div className="space-y-8">
              {openPositions.map((position, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-bloom mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-bloom-accent/10 text-bloom-accent">
                          {position.type}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                          📍 {position.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{position.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-bloom mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-bloom-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-bloom mb-3">Responsibilities</h4>
                      <ul className="space-y-2">
                        {position.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className="flex items-start text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-bloom-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button 
                      href="#application" 
                      variant="pink"
                      size="sm"
                      className="inline-flex items-center"
                    >
                      Apply for This Position
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                Apply to Join Our Team
              </h2>
              <p className="text-gray-600 text-lg">
                We'd love to hear from you! Please fill out the application below.
              </p>
            </div>

            <CareersApplicationForm />
          </div>
        </div>
      </section>

      {/* About Our Culture */}
      <section className="py-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                Our Culture & Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-bloom mb-6">What We Believe</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-bloom mb-2">Compassionate Care</h4>
                    <p className="text-gray-600 text-sm">We provide empathetic, non-judgmental support to every client and colleague.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-bloom mb-2">Professional Growth</h4>
                    <p className="text-gray-600 text-sm">We invest in our team's development through training, supervision, and mentorship.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-bloom mb-2">Work-Life Balance</h4>
                    <p className="text-gray-600 text-sm">We understand the importance of self-care and maintaining healthy boundaries.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-bloom mb-2">Collaborative Approach</h4>
                    <p className="text-gray-600 text-sm">We work together as a team to provide the best possible care for our clients.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-bloom-blush/20 to-bloom-accent/20">
                  <Image
                    src="/images/Team/Jana Rundle.jpg"
                    alt="Bloom Psychology team culture"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}