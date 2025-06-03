import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'How Virtual Therapy Works | Bloom Psychology',
  description: 'Learn how to get started with virtual therapy sessions. Simple setup, secure technology, and expert care from anywhere in Texas.',
  keywords: [
    'how virtual therapy works',
    'teletherapy setup',
    'online therapy guide',
    'virtual session preparation',
    'telehealth counseling Texas'
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-6">
                How Virtual Therapy Works
              </h1>
              <p className="text-xl text-bloom-dark/80">
                Getting started with virtual therapy is simple. Here's everything you need to know.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto">
              <Image
                src="/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png"
                alt="Woman preparing for virtual therapy session in comfortable home setting"
                width={800}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-bloompink text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-bloom-dark mb-4">Schedule Your Appointment</h2>
                    <p className="text-bloom-dark/70 mb-4">
                      Book your session online through our scheduling system. You'll receive a confirmation email with everything you need.
                    </p>
                    <ul className="space-y-2 text-bloom-dark/70">
                      <li className="flex items-start gap-2">
                        <span className="text-bloompink mt-1">•</span>
                        <span>Choose a time that works for your schedule</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloompink mt-1">•</span>
                        <span>Complete intake forms online before your visit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloompink mt-1">•</span>
                        <span>Receive secure video link 24 hours before</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-bloom-sage text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-bloom-dark mb-4">Prepare Your Space & Technology</h2>
                    <p className="text-bloom-dark/70 mb-4">
                      Create a comfortable, private environment for your session and test your technology.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-bloom-dark mb-2">Space Requirements:</h3>
                        <ul className="space-y-1 text-bloom-dark/70 text-sm">
                          <li>• Private, quiet room</li>
                          <li>• Comfortable seating</li>
                          <li>• Good lighting (face the window)</li>
                          <li>• Minimal distractions</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-bloom-dark mb-2">Technology Checklist:</h3>
                        <ul className="space-y-1 text-bloom-dark/70 text-sm">
                          <li>• Stable internet connection</li>
                          <li>• Computer, tablet, or smartphone</li>
                          <li>• Working camera and microphone</li>
                          <li>• Updated web browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-bloom-cream text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-bloom-dark mb-4">Join Your Session</h2>
                    <p className="text-bloom-dark/70 mb-4">
                      Click the secure link at your appointment time and connect with your therapist.
                    </p>
                    <ul className="space-y-2 text-bloom-dark/70">
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-cream-dark mt-1">•</span>
                        <span>Log in 5 minutes early to test audio/video</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-cream-dark mt-1">•</span>
                        <span>Your therapist will admit you from the waiting room</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-cream-dark mt-1">•</span>
                        <span>Sessions are 50 minutes, just like in-person</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-bloom-dark text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-bloom-dark mb-4">Continue Your Care</h2>
                    <p className="text-bloom-dark/70 mb-4">
                      Schedule follow-ups, access resources, and track your progress—all online.
                    </p>
                    <ul className="space-y-2 text-bloom-dark/70">
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-dark mt-1">•</span>
                        <span>Book future sessions through the patient portal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-dark mt-1">•</span>
                        <span>Receive session notes and homework digitally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-bloom-dark mt-1">•</span>
                        <span>Option to switch between virtual and in-person</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Common Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">What if I have technical difficulties?</h3>
                <p className="text-bloom-dark/70">
                  We provide tech support before and during sessions. You can always switch to phone if needed.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">Is virtual therapy as effective as in-person?</h3>
                <p className="text-bloom-dark/70">
                  Research shows virtual therapy is equally effective for most conditions, including postpartum depression and anxiety.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-bloom-dark mb-2">What about privacy with kids at home?</h3>
                <p className="text-bloom-dark/70">
                  We can work with your schedule and situation. Many parents use white noise machines or schedule during nap time.
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-bloom-dark/70 mb-8 max-w-2xl mx-auto">
            Virtual therapy makes expert care accessible. Book your session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-bloompink text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-pink-dark transition-colors"
            >
              Book Your First Session
            </Link>
            <Link
              href="/virtual-therapy/technology-privacy"
              className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-sage hover:bg-bloom-sage-50 transition-colors"
            >
              Learn About Privacy & Security
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}