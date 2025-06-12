'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Type for our theme variations
type ThemeVariation = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    bg: string;
  };
  typography: {
    heading: string;
    body: string;
    style: string;
  };
  heroMessage: {
    pre: string;
    main: string;
    sub: string;
  };
  designApproach: string;
};

const themeVariations: ThemeVariation[] = [
  {
    id: 'bold-confidence',
    name: 'Bold Confidence',
    description: 'Maximum contrast with sharp typography for strong professional women',
    colors: {
      primary: '#0a0a0a',
      secondary: '#ff3366',
      accent: '#ffd700',
      text: '#333333',
      bg: '#ffffff'
    },
    typography: {
      heading: 'font-black',
      body: 'font-light',
      style: 'Ultra-bold with extreme weight contrast'
    },
    heroMessage: {
      pre: 'Proven Excellence',
      main: 'Command Your Journey',
      sub: 'Elite therapy for ambitious mothers who refuse to compromise.'
    },
    designApproach: 'High contrast, minimal elements, power positioning'
  },
  {
    id: 'soft-authority',
    name: 'Soft Authority',
    description: 'Gentle strength with muted tones and refined typography',
    colors: {
      primary: '#2c3e50',
      secondary: '#e8b4b8',
      accent: '#95a99c',
      text: '#4a5568',
      bg: '#fafaf9'
    },
    typography: {
      heading: 'font-serif',
      body: 'font-sans',
      style: 'Classic serif headers with modern sans body'
    },
    heroMessage: {
      pre: 'Evidence-Based Care',
      main: 'Gentle Power, Real Results',
      sub: 'Where clinical expertise meets maternal intuition.'
    },
    designApproach: 'Sophisticated minimalism with breathing room'
  },
  {
    id: 'tech-forward',
    name: 'Tech Forward',
    description: 'Silicon Valley meets maternal care - clean and systematic',
    colors: {
      primary: '#4338ca',
      secondary: '#ec4899',
      accent: '#06b6d4',
      text: '#1e293b',
      bg: '#f8fafc'
    },
    typography: {
      heading: 'font-mono',
      body: 'font-sans',
      style: 'Tech-inspired mono headers with clean sans body'
    },
    heroMessage: {
      pre: 'Data-Driven Support',
      main: 'Debug Your Motherhood',
      sub: 'Systematic solutions for complex maternal challenges.'
    },
    designApproach: 'Grid-based, systematic, data visualization elements'
  },
  {
    id: 'warm-professional',
    name: 'Warm Professional',
    description: 'Approachable expertise with warm earth tones',
    colors: {
      primary: '#7c2d12',
      secondary: '#fb923c',
      accent: '#fbbf24',
      text: '#451a03',
      bg: '#fffbeb'
    },
    typography: {
      heading: 'font-medium',
      body: 'font-normal',
      style: 'Friendly but professional, readable weights'
    },
    heroMessage: {
      pre: 'Trusted by Thousands',
      main: 'Professional Care, Personal Touch',
      sub: 'Expert guidance that feels like talking to a friend.'
    },
    designApproach: 'Warm gradients, rounded corners, inviting spaces'
  },
  {
    id: 'luxury-wellness',
    name: 'Luxury Wellness',
    description: 'Premium positioning with elegant restraint',
    colors: {
      primary: '#1f2937',
      secondary: '#d4a574',
      accent: '#f5f5f4',
      text: '#374151',
      bg: '#fefefe'
    },
    typography: {
      heading: 'font-light tracking-wide',
      body: 'font-light',
      style: 'Elegant light weights with generous spacing'
    },
    heroMessage: {
      pre: 'Exclusive Care',
      main: 'Elevate Your Experience',
      sub: 'Premium maternal wellness for discerning mothers.'
    },
    designApproach: 'Lots of whitespace, premium photography, subtle gold accents'
  },
  {
    id: 'clinical-trust',
    name: 'Clinical Trust',
    description: 'Medical credibility with approachable warmth',
    colors: {
      primary: '#0e7490',
      secondary: '#fda4af',
      accent: '#10b981',
      text: '#064e3b',
      bg: '#f0fdfa'
    },
    typography: {
      heading: 'font-semibold',
      body: 'font-normal',
      style: 'Clear, medical-inspired typography'
    },
    heroMessage: {
      pre: 'Board Certified',
      main: 'Clinical Excellence, Maternal Heart',
      sub: 'Evidence-based therapy with proven outcomes.'
    },
    designApproach: 'Clean medical aesthetic with trust indicators'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Ultra-minimal with maximum impact',
    colors: {
      primary: '#000000',
      secondary: '#ef4444',
      accent: '#ffffff',
      text: '#171717',
      bg: '#ffffff'
    },
    typography: {
      heading: 'font-thin text-6xl',
      body: 'font-light',
      style: 'Extreme minimal with large type'
    },
    heroMessage: {
      pre: '',
      main: 'Less Noise. More You.',
      sub: 'Strip away everything except what matters.'
    },
    designApproach: 'Maximum whitespace, single accent color, no decoration'
  },
  {
    id: 'energetic-optimist',
    name: 'Energetic Optimist',
    description: 'Vibrant and uplifting without being overwhelming',
    colors: {
      primary: '#7c3aed',
      secondary: '#f59e0b',
      accent: '#10b981',
      text: '#1f2937',
      bg: '#fefce8'
    },
    typography: {
      heading: 'font-bold',
      body: 'font-medium',
      style: 'Confident and energetic typography'
    },
    heroMessage: {
      pre: 'Transform Today',
      main: 'Breakthrough to Brilliance',
      sub: 'Discover the vibrant mother you\'re meant to be.'
    },
    designApproach: 'Gradient accents, dynamic layouts, movement'
  },
  {
    id: 'nordic-calm',
    name: 'Nordic Calm',
    description: 'Scandinavian-inspired serenity and function',
    colors: {
      primary: '#3f3f46',
      secondary: '#fca5a5',
      accent: '#e4e4e7',
      text: '#27272a',
      bg: '#fafafa'
    },
    typography: {
      heading: 'font-normal tracking-tight',
      body: 'font-light',
      style: 'Clean Scandinavian-inspired type'
    },
    heroMessage: {
      pre: 'Simply Effective',
      main: 'Clarity Through Simplicity',
      sub: 'Find peace in proven methods and mindful support.'
    },
    designApproach: 'Functional minimalism, muted colors, cozy elements'
  },
  {
    id: 'academic-authority',
    name: 'Academic Authority',
    description: 'Scholarly credibility with maternal warmth',
    colors: {
      primary: '#1e3a8a',
      secondary: '#f87171',
      accent: '#fbbf24',
      text: '#1e293b',
      bg: '#f1f5f9'
    },
    typography: {
      heading: 'font-serif tracking-tight',
      body: 'font-serif',
      style: 'Academic serif throughout'
    },
    heroMessage: {
      pre: 'Research-Backed',
      main: 'Where Science Meets Soul',
      sub: 'PhD expertise dedicated to your maternal journey.'
    },
    designApproach: 'Journal-inspired layouts, citation styling, credibility markers'
  },
  {
    id: 'boutique-personal',
    name: 'Boutique Personal',
    description: 'Small practice feel with personal attention vibes',
    colors: {
      primary: '#581c87',
      secondary: '#f9a8d4',
      accent: '#c084fc',
      text: '#3b0764',
      bg: '#fdf4ff'
    },
    typography: {
      heading: 'font-medium italic',
      body: 'font-normal',
      style: 'Personal, handwritten-inspired touches'
    },
    heroMessage: {
      pre: 'Boutique Practice',
      main: 'Your Story, Personally Guided',
      sub: 'Individual attention in an intimate setting.'
    },
    designApproach: 'Personal touches, signature elements, intimate scale'
  },
  {
    id: 'executive-edge',
    name: 'Executive Edge',
    description: 'C-suite ready therapy for high-achieving mothers',
    colors: {
      primary: '#0f172a',
      secondary: '#dc2626',
      accent: '#a78bfa',
      text: '#334155',
      bg: '#f8fafc'
    },
    typography: {
      heading: 'font-bold uppercase tracking-wide',
      body: 'font-light',
      style: 'Corporate bold with refined body'
    },
    heroMessage: {
      pre: 'Executive Level',
      main: 'LEAD YOUR LIFE',
      sub: 'Strategic therapy for women who run the world.'
    },
    designApproach: 'Corporate premium, power positioning, achievement focus'
  },
  {
    id: 'creative-spirit',
    name: 'Creative Spirit',
    description: 'Artistic approach for creative professional mothers',
    colors: {
      primary: '#be123c',
      secondary: '#fde047',
      accent: '#2dd4bf',
      text: '#18181b',
      bg: '#fffbeb'
    },
    typography: {
      heading: 'font-black lowercase',
      body: 'font-normal',
      style: 'Playful yet professional typography'
    },
    heroMessage: {
      pre: 'create your path',
      main: 'design your motherhood',
      sub: 'therapy as unique as your creative vision.'
    },
    designApproach: 'Asymmetric layouts, bold color blocks, artistic elements'
  },
  {
    id: 'holistic-integrated',
    name: 'Holistic Integrated',
    description: 'Mind-body-soul approach with modern credibility',
    colors: {
      primary: '#065f46',
      secondary: '#f0abfc',
      accent: '#86efac',
      text: '#064e3b',
      bg: '#ecfdf5'
    },
    typography: {
      heading: 'font-medium',
      body: 'font-light',
      style: 'Balanced, centering typography'
    },
    heroMessage: {
      pre: 'Whole Person Care',
      main: 'Integrate to Elevate',
      sub: 'Comprehensive wellness for modern mothers.'
    },
    designApproach: 'Circular elements, balance symbols, integration graphics'
  },
  {
    id: 'urban-sophisticated',
    name: 'Urban Sophisticated',
    description: 'Metropolitan polish for city-dwelling professionals',
    colors: {
      primary: '#18181b',
      secondary: '#e11d48',
      accent: '#eab308',
      text: '#3f3f46',
      bg: '#fafaf9'
    },
    typography: {
      heading: 'font-light text-5xl tracking-tight',
      body: 'font-normal',
      style: 'Metropolitan editorial style'
    },
    heroMessage: {
      pre: 'Downtown Excellence',
      main: 'Sophisticated Solutions',
      sub: 'Premium therapy for the urban professional mother.'
    },
    designApproach: 'Magazine-inspired, editorial layouts, city imagery'
  },
  {
    id: 'gentle-power',
    name: 'Gentle Power',
    description: 'Soft approach with underlying strength and capability',
    colors: {
      primary: '#4c1d95',
      secondary: '#fbbf24',
      accent: '#f3e8ff',
      text: '#1f2937',
      bg: '#faf5ff'
    },
    typography: {
      heading: 'font-normal',
      body: 'font-light',
      style: 'Approachable with quiet confidence'
    },
    heroMessage: {
      pre: 'Gentle Guidance',
      main: 'Soft Power, Strong Results',
      sub: 'Compassionate expertise for your unique journey.'
    },
    designApproach: 'Flowing elements, soft edges, gradient transitions'
  },
  {
    id: 'data-wellness',
    name: 'Data Wellness',
    description: 'Metrics-driven approach for analytical minds',
    colors: {
      primary: '#1e40af',
      secondary: '#f472b6',
      accent: '#60a5fa',
      text: '#1e3a8a',
      bg: '#eff6ff'
    },
    typography: {
      heading: 'font-bold tabular-nums',
      body: 'font-normal',
      style: 'Data-inspired with clear hierarchy'
    },
    heroMessage: {
      pre: 'Measurable Progress',
      main: 'Track Your Transformation',
      sub: 'Data-driven therapy with measurable outcomes.'
    },
    designApproach: 'Charts, progress indicators, milestone markers'
  },
  {
    id: 'timeless-modern',
    name: 'Timeless Modern',
    description: 'Classic principles with contemporary execution',
    colors: {
      primary: '#292524',
      secondary: '#f87171',
      accent: '#d6d3d1',
      text: '#44403c',
      bg: '#fafaf9'
    },
    typography: {
      heading: 'font-normal tracking-wide uppercase text-sm',
      body: 'font-light',
      style: 'Timeless with modern spacing'
    },
    heroMessage: {
      pre: 'ESTABLISHED EXCELLENCE',
      main: 'TIMELESS CARE FOR MODERN MOTHERS',
      sub: 'Classic therapeutic principles. Contemporary delivery.'
    },
    designApproach: 'Classic proportions, modern spacing, refined details'
  }
];

export default function ModernMaternalVariations() {
  const [selectedVariation, setSelectedVariation] = useState<ThemeVariation>(themeVariations[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'full'>('grid');

  return (
    <div className="min-h-screen" style={{ backgroundColor: selectedVariation.colors.bg }}>
      {/* Controls */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Modern Maternal - 18 Variations</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded ${viewMode === 'full' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
              >
                Full Preview
              </button>
            </div>
          </div>
          
          {/* Variation Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {themeVariations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => setSelectedVariation(variation)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
                  selectedVariation.id === variation.id
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedVariation.id === variation.id ? variation.colors.primary : undefined
                }}
              >
                {variation.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Grid View - All Variations */
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themeVariations.map((variation) => (
              <div
                key={variation.id}
                onClick={() => {
                  setSelectedVariation(variation);
                  setViewMode('full');
                }}
                className="cursor-pointer group"
              >
                <div 
                  className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: variation.colors.bg }}
                >
                  {/* Mini Hero Preview */}
                  <div className="p-6" style={{ backgroundColor: variation.colors.bg }}>
                    <div className="mb-4">
                      <div 
                        className="w-8 h-8 rounded-lg mb-3"
                        style={{ backgroundColor: variation.colors.primary }}
                      ></div>
                      <h3 
                        className={`text-2xl mb-2 ${variation.typography.heading}`}
                        style={{ color: variation.colors.primary }}
                      >
                        {variation.heroMessage.main}
                      </h3>
                      <p 
                        className={`text-sm ${variation.typography.body}`}
                        style={{ color: variation.colors.text }}
                      >
                        {variation.heroMessage.sub}
                      </p>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex gap-2 mb-4">
                      {Object.entries(variation.colors).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: color }}
                          title={key}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="border-t pt-4" style={{ borderColor: variation.colors.accent }}>
                      <h4 className="font-semibold text-sm mb-1" style={{ color: variation.colors.primary }}>
                        {variation.name}
                      </h4>
                      <p className="text-xs" style={{ color: variation.colors.text, opacity: 0.7 }}>
                        {variation.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Full Preview - Selected Variation */
        <div style={{ backgroundColor: selectedVariation.colors.bg }}>
          {/* Header */}
          <header className="border-b" style={{ borderColor: selectedVariation.colors.accent }}>
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: selectedVariation.colors.primary }}
                  ></div>
                  <span 
                    className="text-2xl font-medium"
                    style={{ color: selectedVariation.colors.primary }}
                  >
                    Bloom
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-8">
                  {['About', 'Services', 'Programs', 'Resources'].map((item) => (
                    <a 
                      key={item}
                      href="#" 
                      className={`transition-colors font-medium text-sm ${selectedVariation.typography.body}`}
                      style={{ color: selectedVariation.colors.text }}
                    >
                      {item}
                    </a>
                  ))}
                  <a 
                    href="#" 
                    className="px-6 py-2.5 rounded-lg transition-colors font-medium text-sm"
                    style={{ 
                      backgroundColor: selectedVariation.colors.secondary,
                      color: selectedVariation.colors.bg
                    }}
                  >
                    Get Started
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  {selectedVariation.heroMessage.pre && (
                    <div className="flex items-center gap-2 mb-6">
                      <div 
                        className="w-12 h-px"
                        style={{ backgroundColor: selectedVariation.colors.secondary }}
                      ></div>
                      <span 
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: selectedVariation.colors.secondary }}
                      >
                        {selectedVariation.heroMessage.pre}
                      </span>
                    </div>
                  )}
                  
                  <h1 
                    className={`text-5xl lg:text-6xl mb-6 leading-tight ${selectedVariation.typography.heading}`}
                    style={{ color: selectedVariation.colors.primary }}
                  >
                    {selectedVariation.heroMessage.main}
                  </h1>
                  
                  <p 
                    className={`text-lg mb-8 leading-relaxed max-w-lg ${selectedVariation.typography.body}`}
                    style={{ color: selectedVariation.colors.text }}
                  >
                    {selectedVariation.heroMessage.sub}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button 
                      className="px-8 py-4 rounded-lg transition-colors font-medium"
                      style={{ 
                        backgroundColor: selectedVariation.colors.primary,
                        color: selectedVariation.colors.bg
                      }}
                    >
                      Book Consultation
                    </button>
                    <button 
                      className="border-2 px-8 py-4 rounded-lg transition-colors font-medium"
                      style={{ 
                        borderColor: selectedVariation.colors.primary,
                        color: selectedVariation.colors.primary
                      }}
                    >
                      Take Assessment
                    </button>
                  </div>
                  
                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-4">
                    {['PhD Clinical Psychology', '15+ Years Experience', '5000+ Moms Helped'].map((badge) => (
                      <div 
                        key={badge}
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: selectedVariation.colors.accent }}
                      >
                        <span 
                          className="text-sm font-medium"
                          style={{ color: selectedVariation.colors.text }}
                        >
                          {badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Image placeholder */}
                <div className="relative">
                  <div 
                    className="absolute -inset-4 rounded-2xl transform rotate-3"
                    style={{ backgroundColor: `${selectedVariation.colors.secondary}20` }}
                  ></div>
                  <div 
                    className="relative rounded-2xl overflow-hidden shadow-2xl h-[600px] flex items-center justify-center"
                    style={{ backgroundColor: selectedVariation.colors.accent }}
                  >
                    <p 
                      className={`text-center ${selectedVariation.typography.body}`}
                      style={{ color: selectedVariation.colors.text }}
                    >
                      Professional Image Here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Approach Note */}
          <section className="py-12 border-t" style={{ borderColor: selectedVariation.colors.accent }}>
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h3 
                  className={`text-xl mb-2 ${selectedVariation.typography.heading}`}
                  style={{ color: selectedVariation.colors.primary }}
                >
                  Design Approach: {selectedVariation.name}
                </h3>
                <p 
                  className={`${selectedVariation.typography.body}`}
                  style={{ color: selectedVariation.colors.text }}
                >
                  {selectedVariation.designApproach}
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="text-sm" style={{ color: selectedVariation.colors.text }}>
                    <span className="font-semibold">Typography:</span> {selectedVariation.typography.style}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}