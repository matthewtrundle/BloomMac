'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SeedPacketCard from './SeedPacketCard';

export default function DigitalCoursesAlternative() {
  return (
    <>
      {/* Option 2: Featured Sunflower on top, others below */}
      <div className="w-full px-4 md:px-0">
        {/* Featured Course */}
        <div className="max-w-3xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <span className="inline-block bg-bloompink/10 text-bloompink px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              ⭐ Most Popular Course
            </span>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <SeedPacketCard 
              title="Postpartum Wellness"
              seedType="Sunflower"
              icon="🌻"
              growthTime="6 weeks"
              description="Build emotional regulation skills and develop lasting confidence in your new role"
              benefits={[
                "Daily coping strategies",
                "Strong self-care foundation",
                "Sustainable inner peace"
              ]}
              color="yellow"
              href="/courses/postpartum-wellness-foundations"
              featured={true}
              index={0}
            />
          </div>
        </div>
        
        {/* Other Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          <SeedPacketCard 
            title="Anxiety Management"
            seedType="Lavender"
            icon="💜"
            growthTime="4 weeks"
            description="Learn evidence-based techniques to manage anxiety and calm your mind"
            benefits={[
              "Immediate symptom relief",
              "Proven coping strategies",
              "Long-term emotional stability"
            ]}
            color="purple"
            href="/courses"
            index={1}
          />
          
          <SeedPacketCard 
            title="Partner Support"
            seedType="Twin Roses"
            icon="🌹"
            growthTime="3 weeks"
            description="Strengthen your relationship with communication tools and mutual support strategies"
            benefits={[
              "Enhanced communication",
              "Deeper understanding",
              "Unified partnership"
            ]}
            color="pink"
            href="/courses"
            index={2}
          />
        </div>
      </div>
    </>
  );
}