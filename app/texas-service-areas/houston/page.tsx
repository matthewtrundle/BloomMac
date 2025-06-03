import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Virtual Therapy for Houston Mothers | Bloom Psychology',
  description: 'Austin\'s perinatal mental health specialists now serving Houston families virtually. Expert postpartum support without the drive.',
  keywords: [
    'Houston virtual therapy',
    'Houston postpartum therapy',
    'Houston maternal mental health',
    'online therapy Houston Texas',
    'Houston perinatal counseling',
    'teletherapy Houston moms'
  ],
};

export default function HoustonPage() {
  const houstonAreas = [
    'The Woodlands', 'Sugar Land', 'Katy', 'Pearland',
    'Memorial', 'River Oaks', 'Heights', 'Montrose',
    'Clear Lake', 'Cypress', 'Spring', 'Humble'
  ];

  const houstonChallenges = [
    {
      challenge: 'Long Commutes',
      solution: 'No more fighting Houston traffic. Therapy from your home or office.'
    },
    {
      challenge: 'Busy Medical Center',
      solution: 'Skip the TMC parking hassles. Same quality care, virtually.'
    },
    {
      challenge: 'Suburban Sprawl',
      solution: 'Whether you\'re in Katy or Clear Lake, we\'re just a click away.'
    },
    {
      challenge: 'Work Demands',
      solution: 'Lunch hour sessions for energy corridor professionals.'
    }
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
              Virtual Therapy for <span className="text-bloompink">Houston</span> Mothers
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              Austin's trusted perinatal specialists, now serving Houston families through secure video sessions. 
              No traffic, no parking, just expert care when you need it.
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
                  <p className="font-semibold text-bloom-dark">Serving Greater Houston</p>
                  <p className="text-sm text-bloom-dark/60">2.3 million residents, countless mothers needing support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Houston-Specific Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why Houston Moms Choose Virtual Therapy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {houstonChallenges.map((item) => (
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
              Serving All Houston Communities
            </h2>
            <p className="text-center text-bloom-dark/70 mb-8">
              From the Inner Loop to the suburbs, we're here for you
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {houstonAreas.map((area) => (
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

      {/* Houston Mom Images Gallery */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Houston Mothers Finding Their Way
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.webp"
                  alt="Houston mom managing twins"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.webp"
                  alt="Houston professional in virtual therapy"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.webp"
                  alt="Houston mom practicing self-care"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.webp"
                  alt="Houston mothers support group"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Houston Mom Testimonial Section */}
      <section className="py-16 px-4 bg-bloom-offwhite">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-bloom-pink-50 to-bloom-sage-50 rounded-2xl p-8 md:p-10">
              <svg className="w-12 h-12 text-bloompink/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-bloom-dark/80 italic mb-6">
                "Living in The Woodlands with a newborn, the thought of driving to Austin for specialized help felt impossible. 
                Virtual sessions with Bloom have been a lifesaver. I get the expert postpartum support I need without 
                leaving my baby or battling I-45 traffic."
              </p>
              <p className="text-sm text-bloom-dark/60">
                — Sarah M., The Woodlands
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Houston-Specific Concerns */}
      <section className="py-16 px-4 bg-bloom-cream-50/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Understanding Houston Mothers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">Unique Houston Stressors</h3>
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-start gap-2">
                    <span className="text-bloompink mt-1">•</span>
                    <span>Hurricane season anxiety and trauma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloompink mt-1">•</span>
                    <span>Energy industry boom/bust cycles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloompink mt-1">•</span>
                    <span>International relocation challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloompink mt-1">•</span>
                    <span>Medical Center proximity pressure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloompink mt-1">•</span>
                    <span>Suburban isolation in sprawling city</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">How We Help</h3>
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Trauma-informed care for weather events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Flexible scheduling for demanding careers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Culturally sensitive approaches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Coping strategies for environmental stress</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break - Houston Life */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative">
                <Image
                  src="/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.webp"
                  alt="Finding peace in Houston through virtual therapy"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-bloom-sage/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h3 className="text-2xl font-playfair text-bloom-dark mb-4">
                  From Houston Hustle to <span className="text-bloompink">Inner Peace</span>
                </h3>
                <p className="text-lg text-bloom-dark/80 mb-6">
                  In a city that never slows down, finding moments of calm can feel impossible. 
                  Virtual therapy helps Houston mothers create sanctuary wherever they are.
                </p>
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Process hurricane season anxiety</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Navigate energy industry stress</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Build community despite sprawl</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-bloom-cream-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Virtual vs. Driving to Austin
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Virtual from Houston</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>0 minutes commute</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>No childcare needed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Flexible scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-bloom-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Same expert care</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-8 bg-gray-50">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Driving to Austin</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>3-4 hours round trip</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>$50+ in gas and tolls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Full day commitment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>I-10/290 traffic stress</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-pink-50 to-bloom-sage-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              Houston Moms, You Deserve Support
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              Don't let distance keep you from getting the specialized help you need. 
              Start healing today from the comfort of your Houston home.
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