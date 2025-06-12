'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GroundedGrowthConcept() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Earthy Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            {/* Logo with earth tones */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8b6b47] to-[#a0826d] rounded-full"></div>
              <span className="text-2xl font-medium text-[#5a4a3a]">Bloom</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] transition-colors">About</a>
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] transition-colors">Services</a>
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] transition-colors">Resources</a>
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] transition-colors">Contact</a>
              <a href="#" className="bg-[#7a8b7f] text-white px-6 py-2.5 rounded-lg hover:bg-[#6a7b6f] transition-colors">
                Book Now
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Organic Shapes */}
      <section className="relative py-20 overflow-hidden">
        {/* Organic background shape */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8d5c4] rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#d4c4b0] rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-serif text-[#5a4a3a] mb-6 leading-tight">
                Nurture Your Roots,
                <br />
                <span className="text-[#8b6b47]">Embrace Your Growth</span>
              </h1>
              
              <p className="text-lg text-[#6b5d54] mb-8 leading-relaxed">
                Like a garden that needs tending, your mental health deserves 
                patient, nurturing care. We're here to help you flourish.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#8b6b47] text-white px-8 py-3 rounded-lg hover:bg-[#7a5a37] transition-colors text-center">
                  Begin Your Journey
                </button>
                <button className="border-2 border-[#8b6b47] text-[#8b6b47] px-8 py-3 rounded-lg hover:bg-[#8b6b47] hover:text-white transition-all text-center">
                  Learn Our Approach
                </button>
              </div>
              
              {/* Trust indicators with earth elements */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7a8b7f] rounded-full"></div>
                  <span className="text-sm text-[#6b5d54]">15+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7a8b7f] rounded-full"></div>
                  <span className="text-sm text-[#6b5d54]">Specialized in Maternal Health</span>
                </div>
              </div>
            </motion.div>
            
            {/* Image with texture overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/optimized/Team/Jana Rundle.webp"
                  alt="Dr. Jana Rundle"
                  width={500}
                  height={600}
                  className="object-cover"
                />
                {/* Subtle earth texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8b6b47]/20 to-transparent"></div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7a8b7f]/10 rounded-full"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#d4c4b0]/20 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services with Natural Metaphors */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-[#5a4a3a] mb-4">
              Pathways to Wellness
            </h2>
            <p className="text-[#6b5d54] max-w-2xl mx-auto">
              Every journey begins with a single step. Choose the path that resonates with where you are today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🌱",
                title: "New Growth",
                subtitle: "Postpartum Support",
                description: "Gentle guidance through the tender early days of motherhood and beyond."
              },
              {
                icon: "🌿",
                title: "Finding Balance",
                subtitle: "Anxiety & Stress",
                description: "Rooted techniques to help you weather life's storms with grace."
              },
              {
                icon: "🌳",
                title: "Deep Roots",
                subtitle: "Life Transitions",
                description: "Strengthen your foundation as you navigate major life changes."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#faf8f5] p-8 rounded-xl hover:shadow-xl transition-all group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-serif text-[#5a4a3a] mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-[#8b6b47] mb-3">{service.subtitle}</p>
                <p className="text-[#6b5d54] mb-4">
                  {service.description}
                </p>
                <a href="#" className="text-[#7a8b7f] group-hover:text-[#5a6b5f] transition-colors font-medium">
                  Explore this path →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-20 bg-gradient-to-br from-[#e8d5c4]/20 to-[#d4c4b0]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-[#5a4a3a] mb-12">
              Stories of Growth
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-[#6b5d54] italic mb-4">
                  "Working with Dr. Rundle felt like finally having someone who understood 
                  the unique challenges of motherhood. She helped me find my footing again."
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-px bg-[#8b6b47]"></div>
                  <span className="text-sm text-[#8b6b47]">Sarah, Mom of Two</span>
                  <div className="w-8 h-px bg-[#8b6b47]"></div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-[#6b5d54] italic mb-4">
                  "I came in feeling like I was drowning. Now I have tools that help me 
                  stay grounded, even on the hardest days."
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-px bg-[#8b6b47]"></div>
                  <span className="text-sm text-[#8b6b47]">Maria, New Mom</span>
                  <div className="w-8 h-px bg-[#8b6b47]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-[#5a4a3a] mb-4">
                Seeds of Wisdom
              </h2>
              <p className="text-[#6b5d54]">
                Free resources to support your growth between sessions
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: "Grounding Exercises", type: "PDF Guide" },
                { title: "Daily Affirmations", type: "Audio Series" },
                { title: "Self-Care Rituals", type: "Worksheet" },
                { title: "Partner Support", type: "Video Course" }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-[#faf8f5] p-6 rounded-lg text-center cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#7a8b7f]/20 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium text-[#5a4a3a] mb-1">{resource.title}</h4>
                  <p className="text-sm text-[#6b5d54]">{resource.type}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5a4a3a]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">
            Plant the Seeds of Change Today
          </h2>
          <p className="text-[#d4c4b0] mb-8 max-w-2xl mx-auto">
            Your journey to wellness begins with a single conversation. 
            Schedule your free consultation and let's grow together.
          </p>
          <button className="bg-white text-[#5a4a3a] px-8 py-3 rounded-lg hover:bg-[#faf8f5] transition-colors font-medium">
            Schedule Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#faf8f5] border-t border-[#e8d5c4]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-[#8b6b47] to-[#a0826d] rounded-full"></div>
              <span className="text-[#5a4a3a]">Bloom Psychology</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] text-sm">Privacy</a>
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] text-sm">Terms</a>
              <a href="#" className="text-[#6b5d54] hover:text-[#8b6b47] text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}