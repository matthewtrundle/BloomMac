'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export default function WhenFamilyWantsToHelpPage() {
  const [activeTab, setActiveTab] = useState('helpful');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-bloom-blush/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-bloom-dark mb-6">
            Supporting Without Overstepping
          </h1>
          <p className="text-lg md:text-xl text-bloom max-w-3xl mx-auto mb-8">
            Learn how to be a positive presence in a new family's life while respecting 
            boundaries and building lasting, healthy relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#helpful-actions" variant="pink">
              Learn How to Help
            </Button>
            <Button href="/resources" variant="outline">
              Download Free Guides
            </Button>
          </div>
        </div>
      </section>

      {/* Understanding Your Role Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Understanding Your Role as Extended Family
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Boundaries */}
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Respecting Boundaries</h3>
                <p className="text-bloom">
                  New parents need space to find their rhythm. Always ask before visiting, 
                  offering advice, or making plans involving the baby.
                </p>
              </div>

              {/* Cultural Sensitivity */}
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Cultural Considerations</h3>
                <p className="text-bloom">
                  Every family has different traditions and values. Be open to learning 
                  their preferences rather than imposing your own expectations.
                </p>
              </div>

              {/* Support vs Control */}
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-bloom-dark mb-3">Support, Don't Control</h3>
                <p className="text-bloom">
                  Your role is to support their choices, not make decisions for them. 
                  Offer help in ways that empower rather than undermine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful vs Harmful Actions */}
      <section id="helpful-actions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Most Helpful Actions
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-white shadow-sm">
              <button
                onClick={() => setActiveTab('helpful')}
                className={`px-6 py-3 rounded-l-lg font-medium transition-colors ${
                  activeTab === 'helpful' 
                    ? 'bg-bloom-accent text-white' 
                    : 'text-bloom hover:bg-gray-100'
                }`}
              >
                Do This ✓
              </button>
              <button
                onClick={() => setActiveTab('harmful')}
                className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
                  activeTab === 'harmful' 
                    ? 'bg-red-500 text-white' 
                    : 'text-bloom hover:bg-gray-100'
                }`}
              >
                Avoid This ✗
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'helpful' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Practical Support
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Bring meals in disposable containers</li>
                    <li>• Offer specific help: "I'm going to the store, what do you need?"</li>
                    <li>• Do a load of laundry or dishes</li>
                    <li>• Take older siblings for activities</li>
                    <li>• Walk the dog or care for pets</li>
                    <li>• Handle grocery pickup/delivery</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Emotional Support
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Listen without giving advice</li>
                    <li>• Validate their feelings and choices</li>
                    <li>• Share positive observations about their parenting</li>
                    <li>• Ask "How are YOU doing?"</li>
                    <li>• Respect their parenting decisions</li>
                    <li>• Offer encouragement, not criticism</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Respectful Visiting
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Always ask before visiting</li>
                    <li>• Keep visits short (30-60 minutes)</li>
                    <li>• Bring your own food/drinks</li>
                    <li>• Wash hands immediately upon arrival</li>
                    <li>• Leave when baby needs to eat/sleep</li>
                    <li>• Don't expect to be entertained</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Gifts That Help
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Meal delivery service subscriptions</li>
                    <li>• House cleaning service</li>
                    <li>• Grocery delivery credits</li>
                    <li>• Postpartum massage gift certificates</li>
                    <li>• Quality sleep aids for parents</li>
                    <li>• Practical items from their registry</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md border-2 border-red-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Avoid These Behaviors
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Showing up unannounced</li>
                    <li>• Giving unsolicited parenting advice</li>
                    <li>• Comparing to other babies/parents</li>
                    <li>• Taking photos without permission</li>
                    <li>• Posting about baby on social media</li>
                    <li>• Staying too long during visits</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border-2 border-red-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Don't Say These Things
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• "When I had babies..."</li>
                    <li>• "You're spoiling the baby"</li>
                    <li>• "Is the baby sleeping through the night?"</li>
                    <li>• "You look tired"</li>
                    <li>• "Breast/bottle is best"</li>
                    <li>• "Enjoy every moment"</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border-2 border-red-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Boundary Violations
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Rearranging their home/nursery</li>
                    <li>• Inviting others to visit without asking</li>
                    <li>• Insisting on holding baby when crying</li>
                    <li>• Questioning medical decisions</li>
                    <li>• Undermining parenting choices</li>
                    <li>• Making plans without consulting parents</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border-2 border-red-100">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Unhelpful "Help"
                  </h3>
                  <ul className="space-y-2 text-bloom">
                    <li>• Expecting to be served during visits</li>
                    <li>• Creating more work than help</li>
                    <li>• Only wanting to hold the baby</li>
                    <li>• Bringing sick family members</li>
                    <li>• Giving gifts that require assembly</li>
                    <li>• Offering outdated baby care advice</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Long-term Relationships */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark text-center mb-12">
            Building Long-term Family Relationships
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-bloom-blush/10 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Be a Positive Presence</h3>
                  <p className="text-bloom mb-4">
                    Your relationship with the new family sets the tone for years to come. 
                    Being supportive now builds trust and closeness that benefits everyone, 
                    especially the children.
                  </p>
                  <ul className="space-y-2 text-bloom">
                    <li>✓ Respect evolving family dynamics</li>
                    <li>✓ Adapt as children grow</li>
                    <li>✓ Support parents' authority</li>
                    <li>✓ Create positive memories</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Remember Your Impact</h3>
                  <p className="text-bloom mb-4">
                    Extended family members play a crucial role in a child's life. 
                    Your supportive presence provides:
                  </p>
                  <ul className="space-y-2 text-bloom">
                    <li>• Additional secure attachments</li>
                    <li>• Cultural and family connections</li>
                    <li>• Different perspectives and experiences</li>
                    <li>• A wider support network</li>
                    <li>• Unconditional love from multiple sources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-bloom-accent/20 to-bloom-blush/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-bloom-dark mb-6">
            Get Our Free Family Support Guide
          </h2>
          <p className="text-lg text-bloom max-w-2xl mx-auto mb-8">
            Download our comprehensive guide with checklists, conversation starters, 
            and practical tips for being the family support every new parent wishes for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#download-guide" variant="pink" size="lg">
              Download Free Guide
            </Button>
            <Button href="/resources" variant="outline" size="lg">
              Explore More Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}