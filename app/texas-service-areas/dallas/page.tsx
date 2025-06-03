import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Virtual Therapy for Dallas-Fort Worth Mothers | Bloom Psychology',
  description: 'Austin\'s perinatal mental health specialists now serving DFW families virtually. Expert postpartum support for the Metroplex.',
  keywords: [
    'Dallas virtual therapy',
    'Fort Worth online therapy',
    'DFW postpartum therapy',
    'Dallas maternal mental health',
    'Metroplex teletherapy',
    'Plano virtual counseling'
  ],
};

export default function DallasPage() {
  const dallasAreas = [
    'Highland Park', 'Plano', 'Frisco', 'Richardson',
    'Fort Worth', 'Arlington', 'Irving', 'McKinney',
    'Southlake', 'University Park', 'Allen', 'Flower Mound'
  ];

  const dallasChallenges = [
    {
      challenge: 'Competitive Parenting Culture',
      solution: 'Non-judgmental support for your unique journey, not comparison.'
    },
    {
      challenge: 'Career-Family Balance',
      solution: 'Evening sessions for corporate professionals and entrepreneurs.'
    },
    {
      challenge: 'Metroplex Traffic',
      solution: 'Skip the Dallas North Tollway. Therapy from your home or office.'
    },
    {
      challenge: 'Limited Specialists',
      solution: 'Access Austin\'s perinatal experts without the waitlist.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section with Image */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-sage-50/30 via-transparent to-bloom-pink-50/20"></div>
        
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
              Virtual Therapy for <span className="text-bloompink">Dallas-Fort Worth</span> Mothers
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              Bringing Austin's specialized perinatal care to the Metroplex. 
              Expert support for DFW mothers, without the drive or the wait.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-soft inline-block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bloom-sage-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-bloom-dark">Serving the Metroplex</p>
                  <p className="text-sm text-bloom-dark/60">7.6 million residents across DFW</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/optimized/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__94d6aae4-5275-4cd2-82da-84152a031c82_0.webp"
                alt="Dallas mothers finding comfort in virtual therapy"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-2xl font-playfair">Your Dallas Home, Your Healing Space</p>
                <p className="text-white/90 mt-2">No traffic. No parking fees. Just support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dallas-Specific Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why DFW Moms Choose Virtual Therapy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {dallasChallenges.map((item) => (
                <div key={item.challenge} className="bg-white rounded-xl p-6 shadow-soft">
                  <h3 className="text-lg font-semibold text-bloom-dark mb-2">
                    {item.challenge}
                  </h3>
                  <p className="text-bloom-dark/70">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-6">
              Serving All DFW Communities
            </h2>
            <p className="text-center text-bloom-dark/70 mb-8">
              From Park Cities to Fort Worth, we're here for Metroplex mothers
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {dallasAreas.map((area) => (
                <span 
                  key={area}
                  className="bg-white px-4 py-2 rounded-full text-bloom-dark shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dallas Mom Profile with Images */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Understanding Dallas Mothers
            </h2>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.webp"
                  alt="Confident Dallas mother with baby"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg col-span-2">
                <Image
                  src="/images/optimized/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.webp"
                  alt="Dallas professional mom working from home"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.webp"
                  alt="Busy Dallas mom juggling twins"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.webp"
                  alt="Dallas mother finding peace through therapy"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_parent_and_child_connection_playful_interactio_b5f4a5f6-bb82-40c5-b2c8-2afa9175b6d4_3.webp"
                  alt="Dallas parent-child bonding moment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="w-14 h-14 bg-bloom-pink-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">High-Achieving Professionals</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Corporate executives and entrepreneurs juggling demanding careers with motherhood.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="w-14 h-14 bg-bloom-sage-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">Social Pressure</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Navigating competitive mom groups and maintaining the "perfect" image.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="w-14 h-14 bg-bloom-cream-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">Education Focus</h3>
                <p className="text-bloom-dark/70 text-sm">
                  Stress about school choices, activities, and child development milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dallas-Specific Support */}
      <section className="py-16 px-4 bg-bloom-cream-50/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Tailored Support for DFW Families
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Common Concerns</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-start gap-2">
                      <span className="text-bloompink mt-1">•</span>
                      <span>Returning to demanding corporate roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloompink mt-1">•</span>
                      <span>Managing household staff and responsibilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloompink mt-1">•</span>
                      <span>Social isolation in suburban communities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloompink mt-1">•</span>
                      <span>Perfectionism and imposter syndrome</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Our Approach</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-1">•</span>
                      <span>Executive-friendly scheduling options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-1">•</span>
                      <span>Understanding of high-pressure environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-1">•</span>
                      <span>Strategies for authentic connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bloom-sage mt-1">•</span>
                      <span>Evidence-based perfectionism treatment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story with Visual */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <Image
                  src="/images/optimized/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.webp"
                  alt="Virtual therapy session with Dallas mother"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-bloom-sage/20 rounded-full blur-xl"></div>
              </div>
              <div className="bg-gradient-to-br from-bloom-sage-50 to-bloom-pink-50 rounded-2xl p-8 md:p-10">
              <svg className="w-12 h-12 text-bloom-sage/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-bloom-dark/80 italic mb-6">
                "As a partner at a Dallas law firm with two under three, I thought I had to have it all together. 
                Virtual sessions with Bloom gave me permission to be vulnerable without anyone in my Highland Park 
                circle knowing. It's been transformative for both my mental health and my mothering."
              </p>
              <p className="text-sm text-bloom-dark/60">
                — Jennifer K., Highland Park
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Not Local Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-bloom-offwhite to-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why Choose Austin Specialists Over Local Options?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">Specialized Expertise</h3>
                <p className="text-bloom-dark/70 mb-4">
                  While Dallas has many therapists, few have advanced perinatal mental health training. 
                  Our Austin team specializes exclusively in maternal mental health.
                </p>
                <p className="text-sm text-bloom-dark/60 italic">
                  "Generalists mean well, but you need someone who truly understands."
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">Privacy & Discretion</h3>
                <p className="text-bloom-dark/70 mb-4">
                  In close-knit Dallas communities, privacy matters. Virtual sessions with an Austin 
                  provider offer complete confidentiality.
                </p>
                <p className="text-sm text-bloom-dark/60 italic">
                  "No awkward encounters at NorthPark or the country club."
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
              DFW Moms, It's Time to Prioritize You
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              You give so much to everyone else. Virtual therapy makes it easy to finally invest in yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-bloompink text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors"
              >
                Book Virtual Session
              </Link>
              <Link
                href="/virtual-therapy"
                className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-dark hover:bg-bloom-dark hover:text-white transition-colors"
              >
                Learn About Virtual Therapy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}