'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Star } from 'lucide-react';
import { packages, formatPackagePrice, getPaymentMessage } from '@/lib/products/packages';
import { useCart } from '@/lib/cart/cart-context';

export default function PackagesPage() {
  const { addItem, toggleCart } = useCart();

  const handleAddPackage = (pkg: typeof packages[0]) => {
    // Add package as a bundle to cart
    addItem({
      type: 'package',
      productId: pkg.id,
      name: pkg.name,
      description: pkg.tagline,
      price: pkg.price,
      quantity: 1,
      metadata: {
        products: pkg.products,
        savings: pkg.savings
      }
    });

    // Show cart after adding
    setTimeout(() => {
      toggleCart();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-playfair mb-6">
              <span className="text-bloom-dark">Choose Your </span>
              <span className="text-bloom-pink-600">Journey to Wellness</span>
            </h1>
            <p className="text-xl text-bloom-dark/80 mb-8">
              Thoughtfully designed packages to support you at every stage of motherhood
            </p>
            <p className="text-bloom-dark/60">
              Each package includes everything you need for your unique healing journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${pkg.popular ? 'lg:-mt-8' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-bloom-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`
                  bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col
                  ${pkg.popular ? 'ring-2 ring-bloom-pink-500' : ''}
                `}>
                  {/* Header */}
                  <div className="p-6 text-center border-b border-gray-100">
                    <h3 className="text-2xl font-semibold text-bloom-dark mb-2">{pkg.name}</h3>
                    <p className="text-bloom-dark/60 text-sm mb-4">{pkg.tagline}</p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-bloom-dark">
                          {formatPackagePrice(pkg.price)}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-lg text-bloom-dark/40 line-through">
                            {formatPackagePrice(pkg.originalPrice)}
                          </span>
                        )}
                      </div>
                      {pkg.savings && (
                        <p className="text-green-600 text-sm font-medium mt-1">
                          Save {formatPackagePrice(pkg.savings)}
                        </p>
                      )}
                    </div>

                    {/* Payment Options */}
                    <p className="text-bloom-dark/70 text-sm">
                      {getPaymentMessage(pkg)}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="p-6 flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-bloom-dark/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleAddPackage(pkg)}
                      className={`
                        w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
                        ${pkg.popular 
                          ? 'bg-gradient-to-r from-bloom-pink-500 to-bloom-pink-600 text-white hover:from-bloom-pink-600 hover:to-bloom-pink-700 shadow-lg' 
                          : 'bg-bloom-sage/10 text-bloom-dark hover:bg-bloom-sage/20'
                        }
                      `}
                    >
                      Choose This Package
                    </button>
                    
                    {pkg.paymentOptions.affirm && (
                      <p className="text-xs text-bloom-dark/60 text-center mt-2">
                        Affirm financing available
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-playfair mb-8">Why Moms Choose Our Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-bloom-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-bloom-sage" />
              </div>
              <h3 className="font-semibold mb-2">Complete Support</h3>
              <p className="text-sm text-bloom-dark/70">Everything you need in one thoughtful package</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-bloom-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-bloom-pink-500" />
              </div>
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-bloom-dark/70">Direct access to Dr. Jana and certified counselors</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-bloom-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-bloom-sage" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Payment</h3>
              <p className="text-sm text-bloom-dark/70">Start your journey today with easy payment options</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-playfair text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">Which package is right for me?</summary>
              <p className="mt-4 text-bloom-dark/70">
                If you're just starting, the First Steps Package gives you everything you need to begin. 
                Most moms choose Nurturing Support for the complete experience with personalized feedback. 
                If you want the fastest transformation with personal attention, consider Embraced Journey or Full Bloom.
              </p>
            </details>
            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">Can I upgrade my package later?</summary>
              <p className="mt-4 text-bloom-dark/70">
                Absolutely! You can upgrade anytime and we'll credit what you've already paid toward your new package.
              </p>
            </details>
            <details className="bg-white rounded-lg p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">What if I need more support than the package includes?</summary>
              <p className="mt-4 text-bloom-dark/70">
                Each package is designed to be complete, but you can always add individual services or upgrade to our Full Bloom Experience for unlimited support.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}