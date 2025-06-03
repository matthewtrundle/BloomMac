import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Why Texas Clients Travel to Our Austin Office | Bloom Psychology',
  description: 'Discover why mothers from across Texas choose to visit our North Austin office for intensive therapy and specialized perinatal care.',
  keywords: [
    'Austin therapy office',
    'in-person therapy Austin',
    'why travel for therapy',
    'intensive therapy sessions',
    'North Austin psychologist office'
  ],
};

export default function WhyTravelToAustinPage() {
  const intensiveReasons = [
    {
      reason: 'Intensive EMDR Sessions',
      description: 'Some trauma work benefits from extended, in-person sessions.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      )
    },
    {
      reason: 'Initial Assessment',
      description: 'Comprehensive evaluation for complex cases or medication consultation.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      )
    },
    {
      reason: 'Crisis Stabilization',
      description: 'When virtual isn\'t enough and you need immediate, intensive support.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      )
    },
    {
      reason: 'Retreat from Environment',
      description: 'Sometimes healing requires stepping away from daily stressors.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      )
    }
  ];

  const clientStories = [
    {
      location: 'San Antonio',
      distance: '80 miles',
      story: 'Drives monthly for intensive EMDR sessions after birth trauma'
    },
    {
      location: 'Houston',
      distance: '165 miles',
      story: 'Flew in for initial assessment, now continues virtually'
    },
    {
      location: 'Dallas',
      distance: '195 miles',
      story: 'Weekend intensives every quarter for deep healing work'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-cream-50/30 via-transparent to-bloom-sage-50/20"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/texas-service-areas"
              className="inline-flex items-center text-bloom-dark/60 hover:text-bloom-dark mb-6 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Texas Service Areas
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-bloom-dark mb-6">
              When the Journey to <span className="text-bloompink">Austin</span> is Worth It
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              While virtual therapy works beautifully for most, some situations call for the 
              unique benefits of in-person intensive work at our North Austin office.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-soft inline-block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bloom-cream-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-bloom-dark">North Austin Office</p>
                  <p className="text-sm text-bloom-dark/60">A healing space worth the journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When In-Person Makes Sense */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              When In-Person Therapy Makes the Difference
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {intensiveReasons.map((item) => (
                <div key={item.reason} className="bg-white rounded-xl p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-bloom-pink-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-bloom-dark mb-2">{item.reason}</h3>
                      <p className="text-bloom-dark/70">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Austin Office */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              A Space Designed for Healing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__b76c10ee-01e1-4a2a-8894-42d53f2a1be5_2.png"
                    alt="Bloom Psychology's welcoming North Austin therapy office"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bloom-dark/80 to-bloom-dark/20 p-6">
                    <p className="text-white text-lg font-semibold">A space designed for healing</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-semibold text-bloom-dark mb-4">Our North Austin Office</h3>
                <p className="text-bloom-dark/70 mb-6">
                  Located in a quiet professional building with easy highway access, our office 
                  provides a peaceful retreat from daily life.
                </p>
                
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Private, comfortable therapy rooms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Convenient location off Highway 183</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Ample free parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Nursing mother accommodations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Nearby hotels for out-of-town clients</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <h4 className="text-xl font-semibold text-bloom-dark mb-4">Office Address</h4>
                <p className="text-bloom-dark/70 mb-4">
                  13706 N Highway 183, Suite 114<br />
                  Austin, TX 78750
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-bloom-dark/60">
                    <strong>From Houston:</strong> 2.5 hours via Highway 290<br />
                    <strong>From Dallas:</strong> 3 hours via I-35<br />
                    <strong>From San Antonio:</strong> 1.5 hours via I-35
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Stories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Clients Who Make the Journey
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {clientStories.map((client) => (
                <div key={client.location} className="bg-gradient-to-br from-bloom-pink-50 to-bloom-sage-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-bloom-dark">{client.location}</h3>
                    <span className="text-sm text-bloom-dark/60">{client.distance}</span>
                  </div>
                  <p className="text-bloom-dark/70 text-sm italic">"{client.story}"</p>
                </div>
              ))}
            </div>
            
            <p className="text-center text-bloom-dark/60 mt-8 italic">
              Many clients combine virtual regular sessions with periodic in-person intensives
            </p>
          </div>
        </div>
      </section>

      {/* Intensive Options */}
      <section className="py-16 px-4 bg-bloom-cream-50/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Intensive Therapy Options
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="grid md:grid-cols-3">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-3">Half-Day Intensive</h3>
                  <p className="text-bloom-dark/70 mb-4">3-4 hours of focused therapy</p>
                  <ul className="text-sm text-bloom-dark/60 space-y-1">
                    <li>• Deep trauma processing</li>
                    <li>• EMDR sessions</li>
                    <li>• Crisis intervention</li>
                  </ul>
                </div>
                
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-3">Full-Day Intensive</h3>
                  <p className="text-bloom-dark/70 mb-4">6-8 hours with breaks</p>
                  <ul className="text-sm text-bloom-dark/60 space-y-1">
                    <li>• Comprehensive assessment</li>
                    <li>• Multiple modalities</li>
                    <li>• Treatment planning</li>
                  </ul>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-3">Weekend Retreat</h3>
                  <p className="text-bloom-dark/70 mb-4">2-3 day immersive experience</p>
                  <ul className="text-sm text-bloom-dark/60 space-y-1">
                    <li>• Total focus on healing</li>
                    <li>• Away from triggers</li>
                    <li>• Breakthrough work</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-center text-bloom-dark/70 mt-8">
              All intensives include preparation sessions and follow-up support
            </p>
          </div>
        </div>
      </section>

      {/* Making the Decision */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Is Traveling to Austin Right for You?
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <p className="text-bloom-dark/80 mb-6">
                Consider in-person sessions if you:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-bloom-dark/70">Need intensive trauma processing that's difficult to do virtually</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-bloom-dark/70">Want to completely step away from your environment</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-bloom-dark/70">Prefer face-to-face connection for deep work</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-bloom-dark/70">Can arrange childcare and travel logistics</span>
                </div>
              </div>
              
              <div className="bg-bloom-sage-50 rounded-xl p-6">
                <p className="text-bloom-dark text-center">
                  <span className="font-semibold">Remember:</span> Most clients do beautifully with virtual therapy. 
                  In-person is an option, not a requirement, for healing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-cream-50 to-bloom-sage-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              Let's Discuss Your Best Path Forward
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              Whether virtual or in-person, we'll help you choose the right approach for your healing journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-bloompink text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-dark hover:bg-bloom-dark hover:text-white transition-colors"
              >
                Ask About Intensives
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}