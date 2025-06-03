import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Texas Service Areas | Bloom Psychology',
  description: 'Bloom Psychology serves clients throughout Texas with virtual therapy. Based in Austin, we provide specialized care to Houston, Dallas, San Antonio, and beyond.',
  keywords: [
    'Texas therapy services',
    'virtual therapy Texas cities',
    'Austin therapist serving Texas',
    'statewide mental health Texas',
    'teletherapy coverage Texas'
  ],
};

export default function TexasServiceAreasPage() {
  const majorCities = [
    {
      name: 'Houston',
      population: '2.3M',
      description: 'Texas\'s largest city',
      link: '/texas-service-areas/houston',
      highlights: ['Texas Medical Center area', 'The Woodlands', 'Sugar Land', 'Katy']
    },
    {
      name: 'Dallas-Fort Worth',
      population: '1.3M',
      description: 'The Metroplex',
      link: '/texas-service-areas/dallas',
      highlights: ['Highland Park', 'Plano', 'Fort Worth', 'Arlington']
    },
    {
      name: 'San Antonio',
      population: '1.5M',
      description: 'Military City USA',
      link: '/texas-service-areas/san-antonio',
      highlights: ['Alamo Heights', 'Stone Oak', 'Medical Center', 'Boerne']
    },
    {
      name: 'Austin Area',
      population: '1M',
      description: 'Our home base',
      link: '/texas-service-areas/why-travel-to-austin',
      highlights: ['North Austin office', 'Virtual throughout metro', 'In-person available']
    }
  ];

  const additionalAreas = [
    'El Paso', 'Corpus Christi', 'Lubbock', 'Amarillo', 
    'Laredo', 'Irving', 'Garland', 'Frisco', 
    'McKinney', 'Brownsville', 'Killeen', 'Waco'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section with Texas Imagery */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-sage-50/30 via-transparent to-bloom-pink-50/20"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-bloom-dark mb-6">
              Serving Mothers Across <span className="text-bloompink">Texas</span>
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8 max-w-2xl mx-auto">
              Austin's premier perinatal mental health specialists, now available virtually throughout the Lone Star State.
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-soft">
              <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-bloom-dark">254 Counties, One Mission: Your Wellness</span>
            </div>
              </div>
              
              {/* Hero Image Collage */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Image
                      src="/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_3.webp"
                      alt="Diverse Texas family with newborn"
                      width={250}
                      height={200}
                      className="rounded-xl shadow-lg w-full h-auto"
                    />
                    <Image
                      src="/images/optimized/biff01_imagine_two_mothers_with_their_baby_rainbow_subtle_ele_a05a6c20-728d-4ccc-93f4-400a990a192e_1.webp"
                      alt="LGBTQ+ families welcomed"
                      width={250}
                      height={200}
                      className="rounded-xl shadow-lg w-full h-auto"
                    />
                  </div>
                  <div className="space-y-4 mt-8">
                    <Image
                      src="/images/optimized/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_9f91dae6-b308-42f4-935f-8c0bb0a6d485_0.webp"
                      alt="Latina mother and baby in Texas"
                      width={250}
                      height={200}
                      className="rounded-xl shadow-lg w-full h-auto"
                    />
                    <Image
                      src="/images/optimized/biff01_imagine_parent_and_child_connection_playful_interactio_052891a2-ca43-43be-b8ef-bc2b96e01f05_1.webp"
                      alt="Parent-child connection across Texas"
                      width={250}
                      height={200}
                      className="rounded-xl shadow-lg w-full h-auto"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-bloompink/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-bloom-sage/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Cities Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
            Major Texas Cities We Serve
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {majorCities.map((city) => (
              <div key={city.name} className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-bloom-dark">{city.name}</h3>
                    <p className="text-bloom-dark/60">{city.description}</p>
                  </div>
                  <span className="text-sm text-bloom-dark/50 bg-bloom-offwhite px-3 py-1 rounded-full">
                    Pop. {city.population}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-bloom-dark/70 mb-2">Serving families in:</p>
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.map((area) => (
                      <span key={area} className="text-xs bg-bloom-sage-50 text-bloom-dark px-3 py-1 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                
                {city.link !== '#' ? (
                  <Link 
                    href={city.link}
                    className="inline-flex items-center text-bloompink hover:text-bloom-pink-dark font-medium transition-colors"
                  >
                    Learn more 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-bloom-dark/50 text-sm">Coming soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Areas with Visual Interest */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* Small image accent */}
            <div className="flex justify-center mb-8">
              <Image
                src="/images/optimized/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.webp"
                alt="Texas mothers finding peace through therapy"
                width={600}
                height={300}
                className="rounded-2xl shadow-lg"
              />
            </div>
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-6">
              We Also Serve
            </h2>
            <p className="text-center text-bloom-dark/70 mb-8">
              Virtual therapy is available to families throughout Texas, including:
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {additionalAreas.map((area) => (
                <span 
                  key={area}
                  className="bg-white px-4 py-2 rounded-full text-bloom-dark shadow-sm"
                >
                  {area}
                </span>
              ))}
              <span className="bg-bloom-dark text-white px-4 py-2 rounded-full">
                + All Texas Communities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Distance Doesn't Matter */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why Distance Doesn't Matter
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-bloompink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Same Expert Care</h3>
                <p className="text-bloom-dark/70">
                  Whether you're in Houston or Amarillo, you receive the same specialized expertise.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Your Safe Space</h3>
                <p className="text-bloom-dark/70">
                  Heal from the comfort of your own home, wherever in Texas that may be.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-cream-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Texas Community</h3>
                <p className="text-bloom-dark/70">
                  Join a supportive community of Texas mothers on similar journeys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break - Mother Support Image */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png"
                  alt="Supportive community of Texas mothers"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-bloom-sage/20 rounded-full blur-2xl"></div>
              </div>
              <div>
                <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
                  Connecting Texas Mothers to <span className="text-bloompink">Expert Care</span>
                </h2>
                <p className="text-lg text-bloom-dark/80 mb-6">
                  From El Paso to Beaumont, we're breaking down barriers to specialized maternal mental health care. 
                  No matter where you are in our vast state, you deserve support that understands your journey.
                </p>
                <div className="bg-bloom-sage-50 rounded-xl p-6">
                  <p className="text-bloom-dark/90 italic">
                    "Finding specialized postpartum care in rural Texas felt impossible until I found Bloom. 
                    Virtual sessions have been a lifeline." — Sarah, Fredericksburg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Austin Advantage */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-pink-50 to-bloom-sage-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              The Austin Advantage
            </h2>
            <p className="text-xl text-bloom-dark/80 mb-8 max-w-2xl mx-auto">
              Why Texas families choose Austin's perinatal specialists
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">Specialized Training</h3>
                <p className="text-bloom-dark/70">
                  Advanced certifications in perinatal mental health that few Texas providers have.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">Proven Results</h3>
                <p className="text-bloom-dark/70">
                  Years of experience helping mothers overcome postpartum challenges.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">Collaborative Care</h3>
                <p className="text-bloom-dark/70">
                  Strong network with OBs, pediatricians, and specialists across Texas.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">Flexible Options</h3>
                <p className="text-bloom-dark/70">
                  Virtual for convenience, in-person when you need that extra support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-bloom-dark/70 mb-8 max-w-2xl mx-auto">
            Wherever you are in Texas, expert help is just a click away.
          </p>
          <Link
            href="/book"
            className="inline-block bg-bloompink text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-bloom-pink-dark transition-colors"
          >
            Book Your Virtual Session
          </Link>
        </div>
      </section>
    </div>
  );
}