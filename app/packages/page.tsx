'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Package, Shield, Clock, Sparkles } from 'lucide-react';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const packages = [
  {
    id: 'bronze-getting-started',
    name: 'Getting Started',
    tier: 'Bronze',
    description: 'Perfect for beginning your postpartum wellness journey',
    price: 397,
    originalPrice: 491,
    savings: 94,
    color: 'from-amber-600 to-amber-700',
    accentColor: 'amber',
    features: [
      'Any 1 Course of Your Choice',
      'Express Workbook Review (1 module)',
      'Partner Integration Kit',
      'Email Support for 30 Days',
      'Access to Private Community'
    ],
    included: {
      courses: 1,
      reviews: 1,
      extras: ['Partner Kit', 'Community Access']
    },
    recommended: false,
    paymentOptions: '2 payments of $199'
  },
  {
    id: 'silver-comprehensive',
    name: 'Comprehensive Support',
    tier: 'Silver',
    description: 'Our most popular package for complete postpartum support',
    price: 1297,
    originalPrice: 1618,
    savings: 321,
    color: 'from-gray-500 to-gray-600',
    accentColor: 'gray',
    features: [
      'Postpartum Wellness Foundations Course',
      'Complete Workbook Review (all modules)',
      'Quick Connect 3-Pack Sessions',
      'Partner Integration Kit',
      'Wellness Box (shipped to you)',
      'Priority Email Support for 90 Days'
    ],
    included: {
      courses: 1,
      reviews: 6,
      sessions: 3,
      extras: ['Partner Kit', 'Wellness Box', 'Priority Support']
    },
    recommended: true,
    paymentOptions: '4 payments of $325'
  },
  {
    id: 'gold-transformation',
    name: 'Complete Transformation',
    tier: 'Gold',
    description: 'Everything you need for your wellness journey',
    price: 1897,
    originalPrice: 2415,
    savings: 518,
    color: 'from-yellow-600 to-yellow-700',
    accentColor: 'yellow',
    features: [
      'All 3 Courses (Postpartum, Anxiety, Partner)',
      'Fast-Track Mini Program (3 sessions)',
      'Complete Workbook Review',
      'Quick Connect 3-Pack',
      'Partner Kit + Wellness Box',
      'Priority booking for New Mom Program'
    ],
    included: {
      courses: 3,
      reviews: 6,
      sessions: 6,
      extras: ['Partner Kit', 'Wellness Box', 'Priority Booking']
    },
    recommended: false,
    paymentOptions: '6 payments of $317'
  },
  {
    id: 'platinum-vip',
    name: 'VIP Experience',
    tier: 'Platinum',
    description: 'The ultimate support package with Dr. Jana',
    price: 3997,
    originalPrice: 5200,
    savings: 1203,
    color: 'from-purple-600 to-purple-700',
    accentColor: 'purple',
    features: [
      'New Mom Program (8 sessions with Dr. Jana)',
      'All 3 Online Courses',
      'Monthly workbook reviews for 6 months',
      'Unlimited Quick Connects for 6 months',
      'Partner Kit + Premium Wellness Box',
      'VIP Priority Support & Scheduling'
    ],
    included: {
      courses: 3,
      reviews: 'Unlimited',
      sessions: 'Unlimited',
      therapy: '8 sessions',
      extras: ['Everything included', 'VIP Treatment']
    },
    recommended: false,
    paymentOptions: '8 payments of $500'
  }
];

const testimonials = [
  {
    name: 'Sarah M.',
    package: 'Silver',
    text: 'The comprehensive support package was exactly what I needed. The workbook reviews helped me stay accountable, and the wellness box was such a nice surprise!',
    rating: 5
  },
  {
    name: 'Jessica & Tom L.',
    package: 'Gold',
    text: 'Getting all three courses plus the mini program was a game-changer. My husband did the partner course while I worked through mine. We\'re both better for it.',
    rating: 5
  },
  {
    name: 'Amanda K.',
    package: 'Platinum',
    text: 'The VIP experience with Dr. Jana transformed my postpartum journey. Having unlimited support whenever I needed it gave me such peace of mind.',
    rating: 5
  }
];

export default function PackagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleAddToCart = (pkg: typeof packages[0]) => {
    // If user is not logged in, redirect to sign up with the package in mind
    if (!user) {
      // Store the intended package in sessionStorage
      sessionStorage.setItem('intendedPackage', JSON.stringify({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price
      }));
      router.push('/auth/signup?redirect=/packages&requireAccount=true');
      return;
    }
    
    // User is logged in, add to cart normally
    setSelectedPackage(pkg.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-bloom-sage-50/20 to-bloom-pink-50/20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-sage/5 to-bloom-pink/5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-bloom-pink/10 text-bloom-pink px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Save up to $1,203 with our packages
            </div>
            
            <h1 className="text-5xl md:text-6xl font-playfair mb-6">
              <span className="text-bloom-dark">Choose Your </span>
              <span className="text-bloom-pink">Transformation Package</span>
            </h1>
            
            <p className="text-xl text-bloom-dark/80 mb-8 max-w-3xl mx-auto">
              Expertly curated packages that combine our courses, support services, and premium add-ons 
              to give you everything you need for your postpartum wellness journey—at significant savings.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-bloom-dark/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>30-Day Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Lifetime Access to Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                <span>Flexible Payment Plans</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Account Creation Notice */}
      {!user && (
        <div className="bg-bloom-sage/10 border-y border-bloom-sage/20 py-4">
          <div className="container mx-auto px-6 text-center">
            <p className="text-bloom-dark/70">
              <span className="font-medium">Note:</span> You'll need to create a free account to purchase packages. 
              This helps us deliver your content and track your progress.
            </p>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${pkg.recommended ? 'lg:-mt-8' : ''}`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-bloom-pink text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-lg z-10 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    Most Popular
                  </div>
                )}
                
                <div className={`h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col ${
                  pkg.recommended ? 'ring-2 ring-bloom-pink' : ''
                }`}>
                  {/* Package Header */}
                  <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}>
                    <div className="text-center">
                      <p className="text-white/80 text-sm font-medium mb-1">{pkg.tier}</p>
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <p className="text-white/90 text-sm">{pkg.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2 mb-1">
                        <span className="text-4xl font-bold text-bloom-dark">${pkg.price}</span>
                        <span className="text-lg text-gray-400 line-through">${pkg.originalPrice}</span>
                      </div>
                      <p className="text-green-600 font-medium mb-3">Save ${pkg.savings}</p>
                      <p className="text-sm text-bloom-dark/60">or {pkg.paymentOptions}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6 flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 text-${pkg.accentColor}-500 mt-0.5 flex-shrink-0`} />
                          <span className="text-sm text-bloom-dark/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-0">
                    {user ? (
                      <AddToCartButton
                        courseId={pkg.id}
                        courseName={`${pkg.tier} Package - ${pkg.name}`}
                        price={pkg.price * 100}
                        description={pkg.description}
                        image="/images/optimized/Hero/herooptimzed.webp"
                        size="md"
                        variant={pkg.recommended ? 'primary' : 'secondary'}
                        className="w-full"
                      />
                    ) : (
                      <button
                        onClick={() => handleAddToCart(pkg)}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                          pkg.recommended
                            ? 'bg-bloom-pink text-white hover:bg-bloom-pink-dark'
                            : 'bg-bloom-sage text-white hover:bg-bloom-sage-dark'
                        }`}
                      >
                        Select Package
                      </button>
                    )}
                    
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="block text-center mt-3 text-sm text-bloom-dark/60 hover:text-bloom-dark transition-colors"
                    >
                      View Details <ArrowRight className="inline w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-center mb-12 text-bloom-dark">
            Compare Package Features
          </h2>
          
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-bloom-dark">Features</th>
                  {packages.map(pkg => (
                    <th key={pkg.id} className="text-center py-4 px-4">
                      <div className="font-medium text-bloom-dark">{pkg.tier}</div>
                      <div className="text-sm text-gray-500">${pkg.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium">Online Courses</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.included.courses === 3 ? 'All 3' : pkg.included.courses}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4 font-medium">Workbook Reviews</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.included.reviews}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium">1:1 Sessions</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.included.sessions || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4 font-medium">New Mom Program</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.included.therapy ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium">Wellness Box</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.included.extras.some(e => e.includes('Wellness Box')) ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Payment Plans</td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-bloom-sage-50/30 to-bloom-pink-50/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-playfair text-center mb-12 text-bloom-dark">
            What Moms Are Saying
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-bloom-dark/80 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-bloom-dark">{testimonial.name}</p>
                  <span className="text-sm text-bloom-dark/60 bg-bloom-sage-50 px-3 py-1 rounded-full">
                    {testimonial.package} Package
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-bloom-dark to-bloom-sage text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair mb-6">
              Ready to Invest in Your Wellness?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of mothers who have transformed their postpartum experience 
              with our comprehensive support packages.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#packages"
                className="inline-flex items-center px-8 py-4 bg-white text-bloom-dark rounded-lg hover:bg-gray-100 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('.grid.lg\\:grid-cols-4')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Choose Your Package
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/book"
                className="inline-flex items-center px-8 py-4 bg-white/10 border-2 border-white rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                Book a Free Consultation
              </Link>
            </div>
            
            <p className="mt-8 text-white/70 text-sm">
              Questions? Email us at support@bloompsychology.com
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}