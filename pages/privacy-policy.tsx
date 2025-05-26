import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdPageLayout from '@/components/layout/AdPageLayout';

export default function PrivacyPolicy() {
  return (
    <AdPageLayout
      title="Privacy Policy | Bloom Psychology"
      description="Privacy policy for Bloom Psychology. Learn about how we protect your information."
    >
      <div className="flex flex-col">
        {/* Privacy Policy Content */}
        <section className="py-16 flex-grow">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Logo at the top */}
              <div className="relative mx-auto mb-8 w-40 h-40">
                <Image
                  src="/images/Logo/BLOOM-LOGO.png"
                  alt="Bloom Psychology Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h1 className="font-playfair text-3xl md:text-4xl text-bloom mb-6 text-center">
                Privacy Policy
              </h1>
              
              <div className="prose max-w-none">
                <p className="mb-4">
                  Last Updated: May 8, 2025
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
                <p>
                  Bloom Psychology ("we", "our", or "us") is committed to protecting your privacy. This Privacy
                  Policy explains how your personal information is collected, used, and disclosed by Bloom Psychology.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">2. Information We Collect</h2>
                <p>
                  We may collect personal information that you provide to us, such as your name, email address, phone number, 
                  and other contact details when you request a consultation or contact us through our website.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>To provide and maintain our services</li>
                  <li>To notify you about changes to our services</li>
                  <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our services</li>
                  <li>To monitor the usage of our services</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">4. HIPAA Compliance</h2>
                <p>
                  As healthcare providers, we are required by law to maintain the privacy of Protected Health 
                  Information (PHI) and to provide individuals with notice of our legal duties and privacy practices 
                  with respect to PHI. We are required to abide by the terms of this notice.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">5. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                  Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">6. Third-Party Services</h2>
                <p>
                  Our website may contain links to other sites that are not operated by us. If you click on a third-party link, 
                  you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every 
                  site you visit.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">8. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-2">
                  Bloom Psychology<br />
                  13706 N Highway 183, Suite 114<br />
                  Austin, TX 78750<br />
                  (512) 898-9510<br />
                  info@bloompsychology.com
                </p>
              </div>
              
              <div className="mt-12">
                <Link href="/" className="text-bloompink hover:text-bloom hover:underline">
                  &larr; Return to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdPageLayout>
  );
}
