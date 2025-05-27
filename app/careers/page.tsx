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

            <div className="flex justify-center">
              <Button 
                href="#application" 
                variant="pink" 
                size="lg"
                className="inline-flex items-center"
              >
                Submit General Application
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


      {/* Join Our Team CTA */}
      <section className="py-16 bg-bloom-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-bloom-accent/10">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                Join Our Growing Team
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                We're always interested in connecting with talented mental health professionals who share our 
                passion for supporting women, mothers, and families. Whether you're a licensed therapist, 
                counselor, or psychologist, we'd love to hear from you about potential opportunities to 
                collaborate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎓</div>
                  <h3 className="font-semibold text-bloom mb-1">Licensed Professionals</h3>
                  <p className="text-sm text-gray-600">LCSW, LPC, PhD, PsyD</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💖</div>
                  <h3 className="font-semibold text-bloom mb-1">Our Focus</h3>
                  <p className="text-sm text-gray-600">Women's & Maternal Mental Health</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <h3 className="font-semibold text-bloom mb-1">Growth Opportunities</h3>
                  <p className="text-sm text-gray-600">Professional Development & Support</p>
                </div>
              </div>
              <Button 
                href="#application" 
                variant="pink"
                size="lg"
                className="inline-flex items-center"
              >
                Submit Your Application
              </Button>
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
                Whether you're applying for a specific position or expressing general interest, 
                we'd love to hear from you! Please fill out the application below.
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
                    src="/images/optimized/Team/Jana Rundle.webp"
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