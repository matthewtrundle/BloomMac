import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import VirtualTherapyAssessment from '@/components/ui/VirtualTherapyAssessment';

export const metadata: Metadata = {
  title: 'Is Virtual Therapy Right for You? | Bloom Psychology',
  description: 'Discover if virtual therapy is a good fit for your needs. Learn about who benefits most from online therapy and when in-person might be better.',
  keywords: [
    'is virtual therapy effective',
    'online therapy benefits',
    'virtual vs in-person therapy',
    'teletherapy effectiveness',
    'who needs virtual therapy'
  ],
};

export default function IsVirtualRightForYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-6">
              Is Virtual Therapy Right for You?
            </h1>
            <p className="text-xl text-bloom-dark/80">
              Virtual therapy works wonderfully for many people. Let's explore if it's the right fit for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/optimized/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.webp"
                alt="Woman journaling and reflecting on therapy journey"
                width={1200}
                height={600}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Virtual Therapy is <span className="text-bloompink">Perfect</span> For You If...
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You're a Busy Parent</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      No need for childcare or commute time. Therapy fits into naptime or after bedtime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You Live Outside Austin</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      Access specialized perinatal care without the drive from Houston, Dallas, or rural Texas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You Have Limited Mobility</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      Whether due to pregnancy, postpartum recovery, or other reasons, therapy comes to you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You Prefer Home Comfort</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      Some people open up more easily in their own space with their comfort items nearby.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You Have a Demanding Schedule</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      Evening and lunch-hour sessions without travel time make therapy possible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-bloom-sage mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-2">You're Managing Anxiety</h3>
                    <p className="text-bloom-dark/70 text-sm">
                      Skip the waiting room and parking stress. Start sessions from your calm space.
                    </p>
                  </div>
                </div>
              </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Image
                  src="/images/optimized/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.webp"
                  alt="Mother practicing self-care while baby plays nearby"
                  width={400}
                  height={300}
                  className="rounded-xl shadow-lg w-full h-auto"
                />
                <Image
                  src="/images/optimized/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__ee80f468-185d-4a1e-bc41-4400f6cec9b8_0.webp"
                  alt="Woman taking time for self-care routine"
                  width={400}
                  height={300}
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Conditions Well-Suited for Virtual Therapy
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Postpartum Depression & Anxiety</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Pregnancy-Related Mood Changes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Birth Trauma Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Parenting Stress & Overwhelm</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Relationship Adjustments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Return-to-Work Anxiety</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Identity & Life Transitions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bloompink rounded-full"></div>
                  <span className="text-bloom-dark">Grief & Loss</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When In-Person Might Be Better */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              When Our Austin Office Might Be Better
            </h2>
            
            <div className="bg-bloom-cream-50 rounded-2xl p-8 md:p-10">
              <p className="text-bloom-dark/80 mb-6">
                While virtual therapy is highly effective, some situations benefit from in-person care:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-bloom-cream-dark mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="text-bloom-dark/80">
                      <span className="font-semibold">Severe symptoms</span> requiring close monitoring or immediate intervention
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-bloom-cream-dark mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="text-bloom-dark/80">
                      <span className="font-semibold">No private space</span> at home for confidential conversations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-bloom-cream-dark mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="text-bloom-dark/80">
                      <span className="font-semibold">Technology barriers</span> that can't be overcome with support
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-bloom-cream-dark mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <p className="text-bloom-dark/80">
                      <span className="font-semibold">Personal preference</span> for face-to-face connection
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-bloom-dark/70 mt-6 text-sm italic">
                Many clients use a hybrid approach—virtual for regular sessions and in-person for intensive work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Assessment */}
      <section className="py-16 px-4 bg-gradient-to-b from-bloom-offwhite to-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair text-bloom-dark mb-4">
                Interactive Virtual Therapy Assessment
              </h2>
              <p className="text-xl text-bloom-dark/70 max-w-3xl mx-auto">
                Get personalized recommendations in just 2 minutes. Our assessment considers your unique situation and provides tailored next steps.
              </p>
            </div>
            
            <VirtualTherapyAssessment />
            
            {/* Trust Indicators */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-bloom-sage/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-bloom-dark mb-1">Personalized Results</h3>
                <p className="text-sm text-bloom-dark/60">Tailored recommendations based on your specific needs</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-bloompink/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-bloom-dark mb-1">Confidential & Secure</h3>
                <p className="text-sm text-bloom-dark/60">Your responses are private and not stored</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-bloom-cream/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-bloom-dark mb-1">Instant Guidance</h3>
                <p className="text-sm text-bloom-dark/60">Get immediate next steps and booking options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
            Still Not Sure? Let's Talk
          </h2>
          <p className="text-xl text-bloom-dark/70 mb-8 max-w-2xl mx-auto">
            Book a free consultation to discuss your specific needs and preferences. We'll help you choose the best option.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-bloompink text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-dark hover:bg-bloom-dark hover:text-white transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}