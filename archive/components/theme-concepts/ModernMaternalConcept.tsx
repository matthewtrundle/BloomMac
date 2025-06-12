'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ModernMaternalConcept() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Modern Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Geometric logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-[#1e3a5f] rounded-tl-full rounded-br-full"></div>
                <div className="absolute inset-2 bg-[#f8b5c4] rounded-tl-full rounded-br-full"></div>
              </div>
              <span className="text-2xl font-medium text-[#1e3a5f]">Bloom</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-[#1e3a5f] transition-colors font-medium text-sm">About</a>
              <a href="#" className="text-gray-700 hover:text-[#1e3a5f] transition-colors font-medium text-sm">Services</a>
              <a href="#" className="text-gray-700 hover:text-[#1e3a5f] transition-colors font-medium text-sm">Programs</a>
              <a href="#" className="text-gray-700 hover:text-[#1e3a5f] transition-colors font-medium text-sm">Resources</a>
              <a href="#" className="bg-[#f8b5c4] text-[#1e3a5f] px-6 py-2.5 rounded-lg hover:bg-[#f4a0b5] transition-colors font-medium text-sm">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold and Contemporary */}
      <section className="py-20 relative overflow-hidden">
        {/* Geometric background elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-[#f8b5c4]/10 rounded-full"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-[#1e3a5f]/5 rounded-full"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Bold Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Small accent */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#f8b5c4]"></div>
                <span className="text-sm font-medium text-[#f8b5c4] uppercase tracking-wide">Modern Motherhood</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1e3a5f] mb-6 leading-tight">
                Redefine Your
                <span className="block text-[#f8b5c4]">Strength</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Expert therapy designed for the complexities of modern motherhood. 
                Because you deserve support that matches your ambition.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-[#1e3a5f] text-white px-8 py-4 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Book Consultation
                </button>
                <button className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Take Assessment
                </button>
              </div>
              
              {/* Modern trust badges */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">PhD Clinical Psychology</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">15+ Years Experience</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-700">5000+ Moms Helped</span>
                </div>
              </div>
            </motion.div>
            
            {/* Modern image treatment */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Geometric frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#f8b5c4]/20 to-[#1e3a5f]/10 rounded-2xl transform rotate-3"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/optimized/Team/Jana Rundle.webp"
                    alt="Dr. Jana Rundle"
                    width={500}
                    height={600}
                    className="object-cover"
                  />
                  {/* Modern overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="font-bold text-xl">Dr. Jana Rundle</p>
                      <p className="text-sm opacity-90">Maternal Mental Health Specialist</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Build Trust */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "98%", label: "Client Satisfaction" },
              { number: "24hr", label: "Response Time" },
              { number: "50+", label: "Insurance Plans" },
              { number: "4.9", label: "Google Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[#1e3a5f]">{stat.number}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Card Based Modern Design */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
              Tailored Support for Every Phase
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Evidence-based therapy programs designed to fit your life, not the other way around.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "01",
                title: "Perinatal Mental Health",
                features: ["Pregnancy anxiety", "Postpartum depression", "Birth trauma", "Identity shifts"],
                color: "#f8b5c4"
              },
              {
                icon: "02",
                title: "Executive Mom Support",
                features: ["Work-life integration", "Perfectionism", "Burnout prevention", "Leadership coaching"],
                color: "#1e3a5f"
              },
              {
                icon: "03",
                title: "Family Dynamics",
                features: ["Partner communication", "Parenting strategies", "Boundary setting", "Multi-gen support"],
                color: "#d4a574"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all group"
              >
                <div className={`text-5xl font-bold mb-4 opacity-20`} style={{ color: service.color }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                  {service.title}
                </h3>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#f8b5c4] rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="text-[#1e3a5f] font-medium group-hover:text-[#f8b5c4] transition-colors">
                  Learn more →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clean Process */}
      <section className="py-20 bg-[#faf5f7]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
                Your Journey, Simplified
              </h2>
              <p className="text-gray-600">
                Getting started is easier than you think
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Book", desc: "Schedule your free 15-min call" },
                { step: "2", title: "Match", desc: "Get paired with the right therapist" },
                { step: "3", title: "Meet", desc: "Start with your first session" },
                { step: "4", title: "Grow", desc: "See real progress week by week" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Programs */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-[#f8b5c4]"></div>
                  <span className="text-sm font-medium text-[#f8b5c4] uppercase tracking-wide">New</span>
                </div>
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
                  Self-Paced Digital Programs
                </h2>
                <p className="text-gray-600 mb-6">
                  Can't make it to therapy? Access expert-designed programs from your 
                  phone, on your schedule.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f8b5c4]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#1e3a5f] font-bold">6W</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1e3a5f]">Postpartum Wellness Foundations</p>
                      <p className="text-sm text-gray-600">Evidence-based recovery program</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f8b5c4]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#1e3a5f] font-bold">4W</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1e3a5f]">Anxiety Reset for Moms</p>
                      <p className="text-sm text-gray-600">Practical tools for daily calm</p>
                    </div>
                  </div>
                </div>
                
                <button className="mt-8 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152a47] transition-colors font-medium">
                  Explore Programs
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-[#f8b5c4]/10 to-[#1e3a5f]/5 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                  <p className="text-2xl mb-2">📱</p>
                  <p className="font-medium text-[#1e3a5f]">Mobile First</p>
                  <p className="text-sm text-gray-600">Designed for busy moms on-the-go</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <p className="text-2xl mb-2">🎯</p>
                  <p className="font-medium text-[#1e3a5f]">Evidence Based</p>
                  <p className="text-sm text-gray-600">Created by licensed therapists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#152a47]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            You Deserve This
          </h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-lg">
            Stop putting yourself last. Your mental health matters, and we're here to help you prioritize it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#1e3a5f] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Book Free Consultation
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#1e3a5f] transition-all font-medium">
              Take Self-Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-[#1e3a5f] rounded-tl-full rounded-br-full"></div>
                  <div className="absolute inset-1.5 bg-[#f8b5c4] rounded-tl-full rounded-br-full"></div>
                </div>
                <span className="text-xl font-medium text-[#1e3a5f]">Bloom</span>
              </div>
              <p className="text-sm text-gray-600">
                Modern therapy for modern mothers.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-[#1e3a5f] mb-3">Services</h4>
              <div className="space-y-2">
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Individual Therapy</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Digital Programs</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Group Sessions</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-[#1e3a5f] mb-3">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Blog</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Self-Assessment</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">FAQ</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-[#1e3a5f] mb-3">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Instagram</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Newsletter</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f] block">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© 2024 Bloom Psychology. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f]">Privacy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f]">Terms</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#1e3a5f]">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}