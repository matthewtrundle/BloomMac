'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-playfair text-bloom-dark mb-6">Terms of Service</h1>
            <p className="text-bloom-dark/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg text-bloom-dark/80 max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Bloom Psychology's website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2>2. Services Provided</h2>
              <p>
                Bloom Psychology provides mental health services, digital courses, and wellness programs. All services are provided by licensed professionals in accordance with applicable laws and regulations.
              </p>

              <h2>3. User Responsibilities</h2>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use services only for lawful purposes</li>
                <li>Respect the privacy and rights of other users</li>
              </ul>

              <h2>4. Privacy and Confidentiality</h2>
              <p>
                We are committed to protecting your privacy and maintaining the confidentiality of your personal and health information in accordance with HIPAA and other applicable privacy laws.
              </p>

              <h2>5. Payment Terms</h2>
              <p>
                Payment for services is due at the time of booking unless other arrangements have been made. Cancellation policies apply to all appointments and services.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                Bloom Psychology shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our services.
              </p>

              <h2>7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.
              </p>

              <h2>8. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at jana@bloompsychologynorthaustin.com.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-bloom-sage/20">
              <Link 
                href="/contact" 
                className="text-bloompink hover:text-bloom-pink-dark font-medium"
              >
                Questions? Contact our team →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}