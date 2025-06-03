import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Virtual Therapy for San Antonio Mothers | Bloom Psychology',
  description: 'Austin\'s perinatal specialists serving San Antonio families. Expert postpartum support for military families and Alamo City mothers.',
  keywords: [
    'San Antonio virtual therapy',
    'San Antonio postpartum therapy',
    'military family therapy San Antonio',
    'Alamo City maternal mental health',
    'San Antonio perinatal counseling',
    'online therapy San Antonio Texas'
  ],
};

export default function SanAntonioPage() {
  const sanAntonioAreas = [
    'Alamo Heights', 'Stone Oak', 'The Dominion', 'Boerne',
    'Medical Center', 'Fort Sam Houston', 'Lackland AFB', 'Randolph AFB',
    'New Braunfels', 'Schertz', 'Helotes', 'Fair Oaks Ranch'
  ];

  const militarySpecificSupport = [
    {
      issue: 'Deployment & Reintegration',
      support: 'Navigate pregnancy and postpartum during spouse\'s deployment'
    },
    {
      issue: 'Frequent Relocations',
      support: 'Continuity of care that moves with you via virtual sessions'
    },
    {
      issue: 'Limited Support Network',
      support: 'Build coping skills when family is stationed elsewhere'
    },
    {
      issue: 'Unique Stressors',
      support: 'Understanding of military culture and challenges'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-sage-50/30 via-transparent to-bloom-cream-50/20"></div>
        
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
              Virtual Therapy for <span className="text-bloompink">San Antonio</span> Mothers
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              Just 80 miles apart, yet worlds away from the specialized perinatal care you need. 
              Austin's maternal mental health experts now available to Alamo City families—no drive required.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-soft inline-block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bloom-cream-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-bloom-dark">Military City USA</p>
                  <p className="text-sm text-bloom-dark/60">Proudly serving military families</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* San Antonio Specific Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Why San Antonio Families Choose Us
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-bloom-dark mb-3">So Close, Yet So Far</h3>
                <p className="text-bloom-dark/70 mb-4">
                  At just 80 miles, many San Antonio moms already make the drive to Austin for specialized care. 
                  Now, get the same expertise without losing half your day to I-35 traffic.
                </p>
                <p className="text-sm text-bloom-dark/60 italic">
                  "The drive to Austin with a newborn was becoming impossible. Virtual sessions saved my sanity."
                  — Maria, Stone Oak
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-bloom-dark mb-3">Cultural Understanding</h3>
                <p className="text-bloom-dark/70 mb-4">
                  We understand San Antonio's rich cultural diversity and family dynamics. 
                  Our approach respects your values while providing evidence-based care.
                </p>
                <p className="text-sm text-bloom-dark/60">
                  Honoring your heritage while supporting your wellness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Military Family Images */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Supporting San Antonio's Diverse Families
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.webp"
                  alt="Strong military spouse with baby"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Military Families</p>
                  <p className="text-white/90 text-sm">Strength through deployment</p>
                </div>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp"
                  alt="Multicultural San Antonio family"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Cultural Diversity</p>
                  <p className="text-white/90 text-sm">Honoring all traditions</p>
                </div>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/optimized/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_9f91dae6-b308-42f4-935f-8c0bb0a6d485_0.webp"
                  alt="San Antonio Latina mother and baby"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Hispanic Heritage</p>
                  <p className="text-white/90 text-sm">Culturally sensitive care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Military Family Support */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-sage-50/30 to-bloom-cream-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-6">
              Specialized Support for Military Families
            </h2>
            <p className="text-center text-bloom-dark/70 mb-12 max-w-2xl mx-auto">
              With multiple military installations, we understand the unique challenges facing San Antonio's military mothers
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {militarySpecificSupport.map((item) => (
                <div key={item.issue} className="bg-white rounded-xl p-6 shadow-soft">
                  <h3 className="text-lg font-semibold text-bloom-dark mb-2">{item.issue}</h3>
                  <p className="text-bloom-dark/70">{item.support}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-bloompink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-bloom-dark mb-2">Military-Informed Care</h3>
                  <p className="text-bloom-dark/70">
                    Our therapists understand military culture and the unique challenges of military family life. 
                    We're here to support you through every transition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-6">
              Serving All San Antonio Communities
            </h2>
            <p className="text-center text-bloom-dark/70 mb-8">
              From the Pearl to the Medical Center, we're here for you
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {sanAntonioAreas.map((area) => (
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

      {/* San Antonio Specific Challenges */}
      <section className="py-16 px-4 bg-bloom-offwhite">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Understanding San Antonio Mothers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">Unique Challenges</h3>
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-cream-dark mt-1">•</span>
                    <span>Extended family expectations and cultural pressures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-cream-dark mt-1">•</span>
                    <span>Balancing traditional values with modern parenting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-cream-dark mt-1">•</span>
                    <span>Military spouse isolation and single parenting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-cream-dark mt-1">•</span>
                    <span>Limited specialized maternal mental health resources</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-bloom-dark mb-4">How We Help</h3>
                <ul className="space-y-3 text-bloom-dark/70">
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Culturally sensitive, judgment-free support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Flexible scheduling for military life unpredictability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Experience with deployment-related stress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bloom-sage mt-1">•</span>
                    <span>Immediate access to specialized care</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* San Antonio Journey Visual */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
                  Your Journey from <span className="text-bloompink">Surviving to Thriving</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/optimized/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.webp"
                      alt="Overwhelmed San Antonio mother before therapy"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-semibold text-sm">Before</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.webp"
                      alt="Peaceful San Antonio mother after therapy"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-semibold text-sm">After</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/optimized/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.webp"
                  alt="Virtual therapy session with San Antonio mother"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-bloom-cream/30 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distance Comparison */}
      <section className="py-16 px-4 bg-bloom-offwhite">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              The Austin Advantage for San Antonio
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-8">
                <p className="text-bloom-dark/80 mb-6">
                  Many San Antonio mothers already know: Austin has the specialized perinatal mental health 
                  experts that are hard to find locally. Now, access them without the drive.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-bloompink mb-2">80 miles</div>
                    <p className="text-bloom-dark/60">One way to Austin</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-bloom-sage mb-2">0 miles</div>
                    <p className="text-bloom-dark/60">With virtual therapy</p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <p className="text-sm text-bloom-dark/70 text-center italic">
                    "I used to drive to Austin monthly. Now I see my therapist weekly from home. 
                    It's made all the difference in my recovery." — Ana, Alamo Heights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-sage-50 to-bloom-cream-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              San Antonio Moms, You've Been Strong Enough
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              It's time to get the specialized support you deserve, right from your San Antonio home.
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