'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function QuietBloomConcept() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-light text-gray-800">
              bloom
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact</a>
              <a href="#" className="bg-rose-100 text-rose-700 px-6 py-2 rounded-full text-sm hover:bg-rose-200 transition-colors">
                Book Now
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Abundant Whitespace */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Life changes.
                <br />
                <span className="text-rose-500">So do you.</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Therapy for mothers navigating the beautiful complexity of modern life.
              </p>
              
              <div className="flex gap-4">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Start Your Journey
                </button>
                <button className="text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Minimal Line Art Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/optimized/Team/Jana Rundle.webp"
                  alt="Dr. Jana Rundle"
                  fill
                  className="object-cover rounded-2xl"
                  style={{ filter: 'grayscale(20%) contrast(1.1)' }}
                />
                {/* Subtle line art overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 500">
                    <path
                      d="M 50 450 Q 200 400 350 450"
                      stroke="#f43f5e"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Card-based, Minimal */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              How We Can Help
            </h2>
            <div className="w-16 h-px bg-rose-300 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Postpartum Support",
                description: "Navigate the emotional complexities of new motherhood with compassionate guidance."
              },
              {
                title: "Anxiety & Stress",
                description: "Find calm in the chaos with evidence-based techniques tailored to your life."
              },
              {
                title: "Life Transitions",
                description: "Embrace change and growth through life's pivotal moments with expert support."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <a href="#" className="inline-block mt-4 text-rose-500 hover:text-rose-600 transition-colors text-sm">
                  Learn more →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Focus on Trust */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                A Safe Space for Your Journey
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At Bloom Psychology, we understand that seeking help takes courage. 
                Our approach combines professional expertise with genuine empathy, 
                creating a space where you can truly be yourself.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether you're struggling with the demands of motherhood, feeling 
                overwhelmed by life's changes, or simply need someone to listen, 
                we're here for you.
              </p>
              <a href="#" className="text-rose-500 hover:text-rose-600 transition-colors">
                Meet Dr. Jana Rundle →
              </a>
            </div>
            <div className="bg-rose-50 p-12 rounded-2xl">
              <blockquote className="text-lg text-gray-700 italic">
                "You don't have to navigate this alone. Together, we can find 
                your path to wellness and peace."
              </blockquote>
              <p className="mt-4 text-sm text-gray-600">— Dr. Jana Rundle</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple and Clear */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Ready to Begin?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Take the first step towards feeling like yourself again. 
            Book a free 15-minute consultation today.
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              © 2024 Bloom Psychology. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}