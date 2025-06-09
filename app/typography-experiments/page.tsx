'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TypographyExperiments() {
  const [selectedExperiment, setSelectedExperiment] = useState(1);

  const experiments = [
    {
      id: 1,
      name: "Mixed Serif/Sans with Gradient Shadow",
      description: "Combines Playfair Display and Poppins with colorful gradient shadows",
      component: (
        <div className="text-center md:text-left">
          <h1 className="font-playfair font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black mb-4 leading-tight tracking-tight">
            <span className="block mb-3" style={{ 
              textShadow: '3px 3px 0px rgba(198, 71, 138, 0.4), 6px 6px 0px rgba(198, 71, 138, 0.2), 9px 9px 20px rgba(198, 71, 138, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.9)',
              transform: 'perspective(600px) rotateY(-2deg)'
            }}>
              Life changes—so do you.
            </span>
            <span className="block font-poppins font-extrabold uppercase tracking-wider text-5xl md:text-6xl lg:text-7xl" style={{ 
              textShadow: '4px 4px 0px rgba(163, 216, 244, 0.5), 8px 8px 0px rgba(163, 216, 244, 0.3), 12px 12px 25px rgba(163, 216, 244, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.9)',
              background: 'linear-gradient(135deg, #2C3E50 0%, #C6478A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              We're here for all of it.
            </span>
          </h1>
          
          <p className="font-inter font-light text-xl sm:text-2xl md:text-3xl text-bloom-dark mt-8 tracking-wide" 
             style={{ 
               textShadow: '2px 2px 8px rgba(255, 255, 255, 0.95), -1px -1px 4px rgba(255, 255, 255, 0.8), 0 0 20px rgba(198, 71, 138, 0.2)',
               letterSpacing: '0.05em'
             }}>
            <span className="font-semibold">Bloom Psychology</span> <span className="text-bloompink mx-2">•</span> In-person in Austin <span className="text-bloom-accent mx-2">•</span> Online for all of Texas
          </p>
        </div>
      )
    },
    {
      id: 2,
      name: "Outline Text with Multiple Shadows",
      description: "Bold outline style with layered shadow effects",
      component: (
        <div className="text-center md:text-left">
          <h1 className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight">
            <span className="block mb-3 text-transparent" style={{ 
              WebkitTextStroke: '2px #2C3E50',
              textShadow: '4px 4px 0px #C6478A, 8px 8px 0px #A3D8F4, 12px 12px 30px rgba(198, 71, 138, 0.3)'
            }}>
              Life changes—so do you.
            </span>
            <span className="block text-bloom" style={{ 
              textShadow: '2px 2px 0px #F4C2C2, 4px 4px 0px #C6478A, 6px 6px 15px rgba(0, 0, 0, 0.2), -2px -2px 6px rgba(255, 255, 255, 0.9)'
            }}>
              We're here for all of it.
            </span>
          </h1>
          
          <p className="font-raleway font-medium text-lg sm:text-xl md:text-2xl text-bloom mt-6" 
             style={{ textShadow: '1px 1px 3px rgba(255, 255, 255, 0.95), -1px -1px 2px rgba(255, 255, 255, 0.7)' }}>
            Bloom Psychology • In-person in Austin • Online for all of Texas
          </p>
        </div>
      )
    },
    {
      id: 3,
      name: "Retro Stack Effect",
      description: "3D stacked shadows with italic twist",
      component: (
        <div className="text-center md:text-left">
          <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black mb-4 leading-none">
            <span className="block mb-4 relative">
              <span className="relative z-10" style={{ 
                textShadow: '3px 3px 0px #F4C2C2, 6px 6px 0px #C6478A, 9px 9px 0px #A3D8F4, 12px 12px 20px rgba(0, 0, 0, 0.3)'
              }}>
                Life changes—so do you.
              </span>
            </span>
            <span className="block font-inter font-black italic text-5xl md:text-6xl lg:text-7xl" style={{ 
              textShadow: '4px 4px 0px #A3D8F4, 8px 8px 0px #F4C2C2, 12px 12px 0px #C6478A, 16px 16px 30px rgba(0, 0, 0, 0.2)',
              transform: 'skewY(-3deg)'
            }}>
              We're here for all of it.
            </span>
          </h1>
          
          <p className="font-poppins font-semibold text-xl sm:text-2xl md:text-3xl text-bloom-dark mt-8 uppercase tracking-widest" 
             style={{ textShadow: '2px 2px 0px #F4C2C2, 4px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            Bloom Psychology • Austin • Texas
          </p>
        </div>
      )
    },
    {
      id: 4,
      name: "Neon Glow Effect",
      description: "Vibrant neon-style glow with pulsing animation",
      component: (
        <div className="text-center md:text-left">
          <h1 className="font-inter font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight">
            <span className="block mb-3" style={{ 
              textShadow: '0 0 10px #C6478A, 0 0 20px #C6478A, 0 0 30px #C6478A, 0 0 40px #F4C2C2, 0 0 70px #F4C2C2, 0 0 80px #F4C2C2, 0 0 100px #F4C2C2',
              color: '#fff'
            }}>
              Life changes—so do you.
            </span>
            <span className="block text-bloom-accent" style={{ 
              textShadow: '0 0 10px #A3D8F4, 0 0 20px #A3D8F4, 0 0 30px #A3D8F4, 0 0 40px #2C3E50, 0 0 70px #2C3E50, 0 0 80px #2C3E50, 0 0 100px #2C3E50',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              We're here for all of it.
            </span>
          </h1>
          
          <p className="font-raleway font-light text-xl sm:text-2xl md:text-3xl text-white mt-8" 
             style={{ 
               textShadow: '0 0 5px #2C3E50, 0 0 10px #2C3E50, 0 0 15px #2C3E50, 0 0 20px #A3D8F4'
             }}>
            Bloom Psychology • In-person in Austin • Online for all of Texas
          </p>
        </div>
      )
    },
    {
      id: 5,
      name: "Modern Bebas + Montserrat Combo",
      description: "Bold Bebas Neue with clean Montserrat, modern shadow effects",
      component: (
        <div className="text-center md:text-left">
          <h1 className="mb-4 leading-none">
            <span className="block font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider mb-2" style={{ 
              textShadow: '6px 6px 0px rgba(198, 71, 138, 0.2), -2px -2px 0px rgba(163, 216, 244, 0.3)',
              letterSpacing: '0.1em'
            }}>
              LIFE CHANGES—SO DO YOU.
            </span>
            <span className="block font-montserrat font-light text-3xl md:text-4xl lg:text-5xl text-bloom-dark mt-4" style={{ 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.02em'
            }}>
              We're here for <span className="font-black text-bloompink">all of it</span>.
            </span>
          </h1>
          
          <p className="font-montserrat font-medium text-lg sm:text-xl md:text-2xl text-bloom-dark mt-8 uppercase tracking-[0.2em]" 
             style={{ 
               textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
             }}>
            Bloom Psychology <span className="text-bloompink">•</span> Austin <span className="text-bloom-accent">•</span> Texas
          </p>
        </div>
      )
    },
    {
      id: 6,
      name: "Elegant Cormorant + Space Grotesk",
      description: "Sophisticated serif with modern geometric sans",
      component: (
        <div className="text-center md:text-left">
          <h1 className="mb-4">
            <span className="block font-cormorant font-light italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-bloom leading-[0.9]" style={{ 
              textShadow: '2px 2px 10px rgba(198, 71, 138, 0.15), 4px 4px 20px rgba(198, 71, 138, 0.1)'
            }}>
              Life changes—
            </span>
            <span className="block font-cormorant font-bold italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-bloompink -mt-4" style={{ 
              textShadow: '2px 2px 10px rgba(198, 71, 138, 0.2), 4px 4px 20px rgba(198, 71, 138, 0.15)'
            }}>
              so do you.
            </span>
            <span className="block font-space font-medium text-3xl md:text-4xl lg:text-5xl text-bloom-dark mt-6 tracking-tight" style={{ 
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(90deg, #2C3E50 0%, #A3D8F4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              We're here for all of it.
            </span>
          </h1>
          
          <p className="font-space font-light text-lg sm:text-xl md:text-2xl text-bloom mt-8 tracking-wide">
            <span className="font-normal">Bloom Psychology</span> <span className="text-bloom-accent mx-3">◆</span> 
            <span className="text-bloom-darkGrey">In-person in Austin</span> <span className="text-bloom-accent mx-3">◆</span> 
            <span className="text-bloom-darkGrey">Online for all of Texas</span>
          </p>
        </div>
      )
    },
    {
      id: 7,
      name: "DM Serif + Inter Ultra Modern",
      description: "Classic serif display with ultra-clean sans, minimalist shadows",
      component: (
        <div className="text-center md:text-left">
          <h1 className="mb-4">
            <span className="block font-dmserif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black leading-[1.1]" style={{ 
              textShadow: '0 8px 16px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.04)',
              letterSpacing: '-0.02em'
            }}>
              Life changes—so do you.
            </span>
            <span className="block font-inter font-extralight text-4xl md:text-5xl lg:text-6xl text-bloom mt-2" style={{ 
              textShadow: 'none',
              letterSpacing: '-0.03em'
            }}>
              We're here for <span className="font-black bg-bloompink text-white px-3 py-1 rounded">all of it.</span>
            </span>
          </h1>
          
          <p className="font-inter font-normal text-lg sm:text-xl md:text-2xl text-bloom-darkGrey mt-8" 
             style={{ 
               letterSpacing: '0.02em'
             }}>
            Bloom Psychology <span className="inline-block w-2 h-2 bg-bloompink rounded-full mx-3 -mb-0.5"></span> 
            In-person in Austin <span className="inline-block w-2 h-2 bg-bloom-accent rounded-full mx-3 -mb-0.5"></span> 
            Online for all of Texas
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-bloom mb-4">
            Typography Experiments
          </h1>
          <p className="text-xl text-bloom-darkGrey">
            Click on each option to see different typography treatments
          </p>
        </motion.div>

        {/* Experiment Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {experiments.map((exp) => (
            <motion.button
              key={exp.id}
              onClick={() => setSelectedExperiment(exp.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedExperiment === exp.id
                  ? 'border-bloompink bg-pink-100 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-bloom-accent'
              }`}
            >
              <h3 className="font-poppins font-semibold text-lg mb-2">
                Experiment {exp.id}
              </h3>
              <p className="text-sm text-gray-600">{exp.name}</p>
            </motion.button>
          ))}
        </div>

        {/* Selected Experiment Display */}
        <motion.div
          key={selectedExperiment}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-poppins font-semibold text-bloom mb-2">
              {experiments[selectedExperiment - 1].name}
            </h2>
            <p className="text-bloom-darkGrey">
              {experiments[selectedExperiment - 1].description}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 md:p-12">
            {experiments[selectedExperiment - 1].component}
          </div>
        </motion.div>

        {/* Side by Side Comparison */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-playfair font-bold text-bloom mb-8 text-center">
            All Experiments Side by Side
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiments.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: exp.id * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-poppins font-semibold text-bloom mb-4">
                  Experiment {exp.id}: {exp.name}
                </h3>
                <div className="bg-gray-50 rounded p-6 scale-75 origin-left">
                  {exp.component}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-bloom-darkGrey">
            To switch between experiments on the main page, uncomment the desired experiment in <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}