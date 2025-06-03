import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Technology & Privacy for Virtual Therapy | Bloom Psychology',
  description: 'Learn about our HIPAA-compliant technology, privacy protections, and security measures for virtual therapy sessions.',
  keywords: [
    'HIPAA compliant therapy',
    'secure video therapy',
    'teletherapy privacy',
    'virtual therapy security',
    'confidential online counseling'
  ],
};

export default function TechnologyPrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-6">
              Your Privacy & Security Matter
            </h1>
            <p className="text-xl text-bloom-dark/80">
              We use HIPAA-compliant technology to ensure your virtual therapy sessions are private, secure, and confidential.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Enterprise-Grade Security
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="w-14 h-14 bg-bloom-sage-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">End-to-End Encryption</h3>
                <p className="text-bloom-dark/70">
                  All video, audio, and data are encrypted during transmission. No one can intercept or access your session.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="w-14 h-14 bg-bloompink/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">HIPAA Compliant</h3>
                <p className="text-bloom-dark/70">
                  Our platform meets all HIPAA requirements for protecting your health information and maintaining confidentiality.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="w-14 h-14 bg-bloom-cream-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Secure Cloud Storage</h3>
                <p className="text-bloom-dark/70">
                  Session notes and records are stored in HIPAA-compliant cloud servers with multi-factor authentication.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="w-14 h-14 bg-bloom-dark/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-bloom-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">No Recording Default</h3>
                <p className="text-bloom-dark/70">
                  Sessions are never recorded without explicit consent. Your privacy is protected by default.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 bg-bloom-sage-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Simple, Reliable Technology
            </h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">What You Need</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Any device with camera and microphone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Stable internet connection (3+ Mbps)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Updated Chrome, Safari, or Firefox</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Private, quiet space</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">What We Provide</h3>
                  <ul className="space-y-3 text-bloom-dark/70">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloompink mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure session link via email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloompink mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tech support before sessions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloompink mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Backup phone option if needed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-bloompink mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Clear connection instructions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Practices */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Our Privacy Commitment
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border-l-4 border-bloompink">
                <h3 className="font-semibold text-bloom-dark mb-2">Your Sessions Stay Private</h3>
                <p className="text-bloom-dark/70">
                  What you share in therapy stays between you and your therapist. We follow the same confidentiality rules as in-person therapy.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-bloom-sage">
                <h3 className="font-semibold text-bloom-dark mb-2">Data Minimization</h3>
                <p className="text-bloom-dark/70">
                  We only collect information necessary for your care. No tracking cookies, no data selling, no third-party sharing.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-bloom-cream">
                <h3 className="font-semibold text-bloom-dark mb-2">Your Control</h3>
                <p className="text-bloom-dark/70">
                  You can request your records, ask for corrections, or have your data deleted according to HIPAA guidelines.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-bloom-dark">
                <h3 className="font-semibold text-bloom-dark mb-2">Texas Law Compliance</h3>
                <p className="text-bloom-dark/70">
                  We follow all Texas state laws regarding mental health privacy and mandatory reporting requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Space Image Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
                  Your Private, Secure Space
                </h2>
                <p className="text-lg text-bloom-dark/80 mb-6">
                  Create a therapeutic environment in your own home. Our technology ensures your 
                  sessions remain completely confidential, just like in-office visits.
                </p>
                <div className="bg-bloom-sage-50 rounded-xl p-6">
                  <h3 className="font-semibold text-bloom-dark mb-3">Quick Privacy Tips:</h3>
                  <ul className="space-y-2 text-sm text-bloom-dark/70">
                    <li>• Use headphones for extra privacy</li>
                    <li>• Position camera away from personal items</li>
                    <li>• Close other apps during sessions</li>
                    <li>• Test your setup before first session</li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/biff01_imagine_calming_therapy_office_waiting_room_comfortabl_c7ddc6f2-21ca-462c-9f36-f7e006d516f8_0.png"
                  alt="Private and comfortable therapy space setup"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Support */}
      <section className="py-16 px-4 bg-gradient-to-r from-bloom-pink-50 to-bloom-sage-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              We're Here to Help
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              Questions about technology or privacy? We provide support every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/virtual-therapy/is-virtual-right-for-you"
                className="inline-block bg-white text-bloom-dark px-8 py-4 rounded-full font-medium border-2 border-bloom-dark hover:bg-bloom-dark hover:text-white transition-colors"
              >
                Is Virtual Right for You?
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-bloom-dark text-white px-8 py-4 rounded-full font-medium hover:bg-bloom-dark/90 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}