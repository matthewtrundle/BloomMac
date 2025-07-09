'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/lib/data/services';
import SmartTitle, { getCleanTitle } from '@/components/ui/SmartTitle';

// SEO will be handled by layout or separate metadata file for client components

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloompink/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-playfair text-bloom mb-6">
                Mental Health Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Comprehensive, specialized care for women, mothers, and families. 
                Dr. Jana Rundle provides expert support for life's most challenging moments.
              </p>
              
              {/* Quick stats */}
              <div className="flex justify-center gap-8 mb-12 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">500+</div>
                  <div className="text-gray-600">Clients Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">10+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">100%</div>
                  <div className="text-gray-600">Specialized Care</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/services/${service.slug}`} className="block group">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                      {/* Service Image */}
                      {service.heroImage && (
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={service.heroImage}
                            alt={getCleanTitle(service?.title)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <SmartTitle 
                          title={service?.title}
                          as="h3" 
                          className="text-xl font-semibold text-bloom mb-3 group-hover:text-bloompink transition-colors"
                        />
                        <p className="text-gray-600 mb-4">
                          {service?.description || 'Service description not available.'}
                        </p>
                        
                        {/* Key benefits */}
                        {service.keyBenefits && service.keyBenefits.length > 0 && (
                          <div className="mb-4">
                            <ul className="text-sm text-gray-600 space-y-1">
                              {service.keyBenefits.slice(0, 3).map((benefit, idx) => (
                                <li key={idx} className="flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-bloompink flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-bloompink font-medium group-hover:text-bloom transition-colors">
                            Learn More →
                          </span>
                          {service.duration && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {service.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-bloom mb-6">Areas of Specialization</h2>
              <p className="text-lg text-gray-700">
                Dr. Jana Rundle specializes in providing comprehensive mental health support 
                with expertise in the following areas:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-bloom mb-3">Perinatal Mental Health</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Postpartum depression and anxiety</li>
                  <li>• Prenatal mental health</li>
                  <li>• Birth trauma recovery</li>
                  <li>• Pregnancy loss support</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-bloom mb-3">Women's Mental Health</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Anxiety and depression</li>
                  <li>• Life transitions</li>
                  <li>• Relationship challenges</li>
                  <li>• Work-life balance</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-bloom mb-3">Family & Relationships</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mother-child bonding</li>
                  <li>• Partner relationship strain</li>
                  <li>• Family dynamics</li>
                  <li>• Communication skills</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bloom text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Healing Journey?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Take the first step towards feeling like yourself again. 
              Schedule a free consultation to discuss which service is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/book" 
                className="bg-white text-bloom px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Schedule Free Consultation
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                Ask a Question
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}