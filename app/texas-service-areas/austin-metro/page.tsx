import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Therapy for Austin & Central Texas Families | Bloom Psychology',
  description: 'Serving our Austin-area neighbors with both in-person and virtual options. Convenient North Austin location for Round Rock, Cedar Park, and surrounding communities.',
  keywords: [
    'Austin therapy',
    'Round Rock therapy',
    'Cedar Park counseling',
    'Georgetown therapy',
    'Pflugerville mental health',
    'North Austin psychologist',
    'Central Texas therapy'
  ],
};

export default function AustinMetroPage() {
  const austinSuburbs = [
    { name: 'Round Rock', distance: '20 min', population: '133K' },
    { name: 'Cedar Park', distance: '15 min', population: '79K' },
    { name: 'Georgetown', distance: '25 min', population: '79K' },
    { name: 'Pflugerville', distance: '20 min', population: '66K' },
    { name: 'Leander', distance: '20 min', population: '60K' },
    { name: 'Buda', distance: '30 min', population: '18K' },
    { name: 'Kyle', distance: '35 min', population: '50K' },
    { name: 'Lakeway', distance: '30 min', population: '19K' }
  ];

  const convenientFor = [
    'Tech professionals working from home',
    'Families in master-planned communities',
    'Stay-at-home parents in the suburbs',
    'Dual-income households needing flexibility',
    'Mothers avoiding downtown traffic'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-pink-50/30 via-transparent to-bloom-sage-50/20"></div>
        
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
              Your <span className="text-bloompink">Neighborhood</span> Mental Health Specialists
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              While we now serve all of Texas virtually, we haven't forgotten our roots. 
              Our North Austin office remains your convenient local option for in-person therapy.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-soft inline-block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bloom-sage-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-bloom-dark">North Austin Location</p>
                  <p className="text-sm text-bloom-dark/60">Easy access from 183, 45, and MoPac</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best of Both Worlds */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              The Best of Both Worlds for Austin Families
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-soft">
                <div className="w-14 h-14 bg-bloompink/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">In-Person When You Want It</h3>
                <p className="text-bloom-dark/70 mb-4">
                  Sometimes you need that face-to-face connection. Our North Austin office is just minutes 
                  away from most Central Texas communities.
                </p>
                <ul className="space-y-2 text-sm text-bloom-dark/60">
                  <li>• Morning appointments before school drop-off</li>
                  <li>• Lunch hour sessions for working moms</li>
                  <li>• Evening availability</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-soft">
                <div className="w-14 h-14 bg-bloom-sage-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Virtual When You Need It</h3>
                <p className="text-bloom-dark/70 mb-4">
                  Kids home sick? Bad weather? Just need to save time? Switch seamlessly between 
                  in-person and virtual sessions.
                </p>
                <ul className="space-y-2 text-sm text-bloom-dark/60">
                  <li>• No childcare stress</li>
                  <li>• Skip the commute</li>
                  <li>• Therapy during naptime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suburbs We Serve */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-6">
              Conveniently Located for Central Texas
            </h2>
            <p className="text-center text-bloom-dark/70 mb-12 max-w-2xl mx-auto">
              Our North Austin office at Highway 183 is centrally located for easy access from all surrounding communities
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {austinSuburbs.map((suburb) => (
                <div key={suburb.name} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-bloom-dark">{suburb.name}</h3>
                  <p className="text-sm text-bloom-dark/60">{suburb.distance} drive</p>
                  <p className="text-xs text-bloom-dark/50">Pop. {suburb.population}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-bloom-dark/70">
                <span className="font-semibold">No downtown traffic.</span> No parking hassles. 
                Just easy access from major highways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Stay Local */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why Austin-Area Families Choose Bloom
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-bloom-cream-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">Specialized Expertise</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Advanced training in perinatal mental health that's rare even in Austin
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-bloom-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">Community Connection</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Strong relationships with Austin-area OBs, pediatricians, and resources
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">Flexible Scheduling</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Same-week availability with options that work for busy Austin families
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Convenience */}
      <section className="py-16 px-4 bg-bloom-cream-50/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Perfect for Austin's Busy Families
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
              <p className="text-lg text-bloom-dark/80 mb-6 text-center">
                We understand the unique rhythm of Austin-area life
              </p>
              
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {convenientFor.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-bloom-dark/70">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-bloom-sage-50 rounded-xl">
                <p className="text-center text-bloom-dark">
                  <span className="font-semibold">Your choice:</span> Drive 15 minutes for in-person care or 
                  connect instantly from home. Both options, one trusted provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Image Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
                  A Healing Space <span className="text-bloompink">Close to Home</span>
                </h2>
                <p className="text-lg text-bloom-dark/80 mb-6">
                  Our North Austin office provides a peaceful retreat for in-person therapy. 
                  With easy access from major highways and ample parking, we've removed the 
                  typical barriers to getting help.
                </p>
                <div className="bg-bloom-cream-50 rounded-xl p-6">
                  <h3 className="font-semibold text-bloom-dark mb-3">Why Austin Families Love Us:</h3>
                  <ul className="space-y-2 text-bloom-dark/70">
                    <li>• No downtown traffic or parking stress</li>
                    <li>• Quiet, professional environment</li>
                    <li>• Easy to find location off 183</li>
                    <li>• Flexible hybrid options available</li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__87ea8e1d-e48f-4436-a390-728d4d6d8640_3.png"
                  alt="Comfortable therapy office in North Austin"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-bloompink/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Focus Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-bloom-pink-50 to-bloom-sage-50 rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-playfair text-bloom-dark mb-4 text-center">
                Still Your Local Mental Health Home
              </h2>
              <p className="text-bloom-dark/80 text-center mb-6">
                Yes, we now serve all of Texas virtually. But for our Austin-area neighbors, 
                we remain your trusted local provider with the added convenience of virtual options.
              </p>
              <div className="text-center">
                <p className="text-sm text-bloom-dark/60 italic">
                  "I love having both options. Most weeks I do virtual from Cedar Park, 
                  but when I need that in-person connection, the drive is so easy." 
                  <br />— Ashley, Cedar Park Mom
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-sage-50 to-bloom-pink-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              Austin Families, We're Right Here for You
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              Whether you prefer our North Austin office or the convenience of virtual sessions, 
              expert maternal mental health care is always within reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-bloompink text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors"
              >
                Book Your Local Session
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-dark hover:bg-bloom-dark hover:text-white transition-colors"
              >
                Visit Our Office
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-bloom-dark/60">
              <p className="font-semibold">Office Location</p>
              <p>13706 N Highway 183, Suite 114, Austin, TX 78750</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}