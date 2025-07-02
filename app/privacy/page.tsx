'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-playfair text-bloom-dark mb-6">Privacy Policy</h1>
            <p className="text-bloom-dark/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg text-bloom-dark/80 max-w-none">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, schedule appointments, or contact us for support.
              </p>
              
              <h3>Personal Information</h3>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Health information relevant to your care</li>
                <li>Payment and billing information</li>
                <li>Communication preferences</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and improve our mental health services</li>
                <li>Process payments and manage appointments</li>
                <li>Communicate with you about your care</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>

              <h2>3. HIPAA Compliance</h2>
              <p>
                As a healthcare provider, we are committed to protecting your health information in accordance with the Health Insurance Portability and Accountability Act (HIPAA). Your protected health information will only be used and disclosed as permitted by law.
              </p>

              <h2>4. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only:
              </p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect the safety of you or others</li>
                <li>With trusted service providers who assist in our operations</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of certain communications</li>
              </ul>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to improve your experience on our website, analyze usage patterns, and provide personalized content.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13 without parental consent.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at jana@bloompsychologynorthaustin.com or (512) 898-9510.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-bloom-sage/20">
              <Link 
                href="/contact" 
                className="text-bloompink hover:text-bloom-pink-dark font-medium"
              >
                Questions about your privacy? Contact us →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}