'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SlideDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Example HTML slides with embedded styles
  const htmlSlides = `
<!-- SLIDE -->
<div class="slide slide-title">
  <div class="slide-content">
    <div class="emoji-accent">👶</div>
    <h1 class="slide-heading">Welcome to Your Fourth Trimester</h1>
    <p class="slide-subtitle">A journey of self-discovery and growth</p>
    <div class="decorative-line"></div>
  </div>
</div>

<!-- SLIDE -->
<div class="slide slide-intro">
  <div class="slide-content">
    <h2 class="section-title">What We'll Cover Today</h2>
    <div class="topics-grid">
      <div class="topic-card">
        <div class="topic-icon">🌱</div>
        <h3>Understanding Change</h3>
        <p>Your body, mind, and identity are transforming</p>
      </div>
      <div class="topic-card">
        <div class="topic-icon">💗</div>
        <h3>Self-Compassion</h3>
        <p>Learning to be gentle with yourself</p>
      </div>
      <div class="topic-card">
        <div class="topic-icon">🌟</div>
        <h3>Finding Balance</h3>
        <p>Navigating your new normal</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE -->
<div class="slide slide-quote">
  <div class="slide-content">
    <blockquote class="beautiful-quote">
      <p>"Becoming a mother doesn't mean losing yourself. It means discovering a new, stronger version of who you are."</p>
      <cite>- Dr. Jana Rundle</cite>
    </blockquote>
    <div class="floating-petals">
      <span class="petal petal-1">🌸</span>
      <span class="petal petal-2">🌸</span>
      <span class="petal petal-3">🌸</span>
    </div>
  </div>
</div>

<!-- SLIDE -->
<div class="slide slide-content-main">
  <div class="slide-content">
    <h2 class="content-heading">The Reality of Postpartum</h2>
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-number">70%</div>
        <div class="stat-label">of new mothers experience mood changes</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">1 in 5</div>
        <div class="stat-label">develop postpartum anxiety or depression</div>
      </div>
    </div>
    <div class="key-message">
      <p>You are <strong>not alone</strong>, and what you're feeling is <strong>valid</strong></p>
    </div>
  </div>
</div>

<!-- SLIDE -->
<div class="slide slide-interactive">
  <div class="slide-content">
    <h2 class="activity-title">Pause & Reflect</h2>
    <div class="reflection-card">
      <h3>Take a moment to consider:</h3>
      <ul class="reflection-questions">
        <li>What emotions have you experienced today?</li>
        <li>What support do you need right now?</li>
        <li>What would self-compassion look like today?</li>
      </ul>
      <div class="cta-box">
        <p>Write your thoughts in your journal 📝</p>
      </div>
    </div>
  </div>
</div>
`;

  const htmlStyles = `
    <style>
      /* Base Slide Styles */
      .slide {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        position: relative;
        overflow: hidden;
      }

      .slide-content {
        max-width: 1000px;
        width: 100%;
        animation: fadeInUp 0.8s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Title Slide */
      .slide-title {
        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
        text-align: center;
      }

      .emoji-accent {
        font-size: 5rem;
        margin-bottom: 1rem;
        animation: bounce 2s infinite;
      }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      .slide-heading {
        font-size: 3.5rem;
        font-weight: 800;
        color: #2d3748;
        margin-bottom: 1rem;
        font-family: 'Playfair Display', serif;
      }

      .slide-subtitle {
        font-size: 1.5rem;
        color: #4a5568;
        margin-bottom: 2rem;
      }

      .decorative-line {
        width: 100px;
        height: 4px;
        background: #e2348d;
        margin: 0 auto;
        border-radius: 2px;
      }

      /* Topics Grid Slide */
      .slide-intro {
        background: linear-gradient(to bottom right, #f0fdf4, #dcfce7);
      }

      .section-title {
        font-size: 2.5rem;
        text-align: center;
        color: #166534;
        margin-bottom: 3rem;
      }

      .topics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .topic-card {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.3s ease;
      }

      .topic-card:hover {
        transform: translateY(-5px);
      }

      .topic-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .topic-card h3 {
        font-size: 1.25rem;
        color: #166534;
        margin-bottom: 0.5rem;
      }

      .topic-card p {
        color: #6b7280;
        font-size: 0.95rem;
      }

      /* Quote Slide */
      .slide-quote {
        background: radial-gradient(circle at top right, #fef3c7, #fde68a);
        position: relative;
      }

      .beautiful-quote {
        max-width: 700px;
        margin: 0 auto;
        text-align: center;
      }

      .beautiful-quote p {
        font-size: 2rem;
        font-style: italic;
        color: #92400e;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .beautiful-quote cite {
        font-size: 1.2rem;
        color: #b45309;
        font-style: normal;
      }

      .floating-petals {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .petal {
        position: absolute;
        font-size: 2rem;
        opacity: 0.6;
        animation: float 10s infinite ease-in-out;
      }

      .petal-1 { top: 10%; left: 10%; animation-delay: 0s; }
      .petal-2 { top: 20%; right: 15%; animation-delay: 3s; }
      .petal-3 { bottom: 20%; left: 20%; animation-delay: 6s; }

      @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(30px, -30px) rotate(120deg); }
        66% { transform: translate(-20px, 20px) rotate(240deg); }
      }

      /* Content Slide */
      .slide-content-main {
        background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      }

      .content-heading {
        font-size: 2.5rem;
        text-align: center;
        color: #312e81;
        margin-bottom: 3rem;
      }

      .stat-cards {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        text-align: center;
      }

      .stat-number {
        font-size: 4rem;
        font-weight: bold;
        color: #4c1d95;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 1.1rem;
        color: #6b7280;
        max-width: 150px;
      }

      .key-message {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }

      .key-message p {
        font-size: 1.5rem;
        color: #1f2937;
      }

      .key-message strong {
        color: #7c3aed;
      }

      /* Interactive Slide */
      .slide-interactive {
        background: linear-gradient(to bottom right, #fef3c7, #fed7aa);
      }

      .activity-title {
        font-size: 2.5rem;
        text-align: center;
        color: #92400e;
        margin-bottom: 2rem;
      }

      .reflection-card {
        background: white;
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        max-width: 600px;
        margin: 0 auto;
      }

      .reflection-card h3 {
        font-size: 1.5rem;
        color: #92400e;
        margin-bottom: 1.5rem;
      }

      .reflection-questions {
        list-style: none;
        padding: 0;
        margin-bottom: 2rem;
      }

      .reflection-questions li {
        padding: 1rem;
        margin-bottom: 1rem;
        background: #fef3c7;
        border-radius: 8px;
        font-size: 1.1rem;
        color: #78350f;
        position: relative;
        padding-left: 2rem;
      }

      .reflection-questions li:before {
        content: "✨";
        position: absolute;
        left: 0.5rem;
      }

      .cta-box {
        background: #f59e0b;
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
        font-size: 1.2rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .slide-heading { font-size: 2.5rem; }
        .section-title { font-size: 2rem; }
        .beautiful-quote p { font-size: 1.5rem; }
        .stat-cards { flex-direction: column; gap: 2rem; }
        .stat-number { font-size: 3rem; }
      }
    </style>
  `;

  // Parse slides
  const slides = htmlSlides.split('<!-- SLIDE -->').filter(slide => slide.trim());

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">HTML Slide Quality Demo</h1>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Slide Container */}
      <div className="relative">
        {/* Inject styles */}
        <div dangerouslySetInnerHTML={{ __html: htmlStyles }} />
        
        {/* Current slide */}
        <div 
          key={currentSlide}
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] || '' }} 
        />

        {/* Navigation */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-bloompink' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide counter */}
        <div className="fixed top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white mt-8 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">HTML vs React Component Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-600">✅ What HTML Can Do Well</h3>
              <ul className="space-y-2 text-sm">
                <li>• Beautiful gradients and backgrounds</li>
                <li>• Smooth CSS animations</li>
                <li>• Responsive layouts</li>
                <li>• Typography and spacing</li>
                <li>• Hover effects and transitions</li>
                <li>• Grid and flexbox layouts</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-red-600">❌ HTML Limitations</h3>
              <ul className="space-y-2 text-sm">
                <li>• No complex state management</li>
                <li>• Limited interactivity</li>
                <li>• Can't use React components</li>
                <li>• No dynamic data binding</li>
                <li>• Harder to maintain consistency</li>
                <li>• More verbose for complex layouts</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">💡 The Verdict</h3>
            <p className="text-gray-700 mb-3">
              HTML with inline styles CAN create beautiful slides that are:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Visually stunning with gradients, animations, and effects</li>
              <li>Fully responsive and mobile-friendly</li>
              <li>Easy to edit through an admin interface</li>
              <li>Good enough for 80% of slide content needs</li>
            </ul>
            <p className="text-gray-700 mt-3">
              <strong>However</strong>, for complex interactions, data visualization, or component reuse, 
              React components are still superior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}