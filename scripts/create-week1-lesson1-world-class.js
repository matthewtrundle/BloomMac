#!/usr/bin/env node

/**
 * World-Class E-Learning Slides for Week 1 Lesson 1
 * Based on expert panel recommendations and enhanced course content
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Professional slide templates
const professionalSlideTemplates = {
  // Hero Welcome Slide - Creates immediate emotional safety
  heroWelcome: (content) => `
    <div class="slide-container hero-welcome">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap');
        
        .slide-container {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8D5D5 0%, #F5E6D3 50%, #B8D4C8 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-welcome::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: gentle-pulse 8s ease-in-out infinite;
        }

        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }

        .content-wrapper {
          text-align: center;
          z-index: 2;
          max-width: 900px;
          padding: 60px;
        }

        .emoji-accent {
          font-size: 80px;
          margin-bottom: 30px;
          animation: gentle-float 3s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .main-title {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 700;
          color: #2D3748;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 300;
          color: #4A5568;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .warm-message {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #718096;
          font-style: italic;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
          padding: 25px;
          background: rgba(255,255,255,0.5);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .decorative-element {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(to right, transparent, #E8D5D5, transparent);
        }
      </style>
      
      <div class="content-wrapper">
        ${content.emoji ? `<div class="emoji-accent">${content.emoji}</div>` : ''}
        <h1 class="main-title">${content.title}</h1>
        ${content.subtitle ? `<p class="subtitle">${content.subtitle}</p>` : ''}
        ${content.message ? `<p class="warm-message">${content.message}</p>` : ''}
        <div class="decorative-element"></div>
      </div>
    </div>
  `,

  // Safe Container Slide - Establishes boundaries and safety
  safeContainer: (content) => `
    <div class="slide-container safe-container">
      <style>
        .safe-container {
          background: #FAFAF8;
          padding: 80px 60px;
        }

        .container-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          margin-bottom: 50px;
          text-align: center;
          grid-column: 1 / -1;
        }

        .container-column {
          background: white;
          border-radius: 20px;
          padding: 50px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
        }

        .container-column.is-column {
          background: linear-gradient(135deg, #E8F4F0 0%, #F0FAF7 100%);
          border: 2px solid #B8D4C8;
        }

        .container-column.is-not-column {
          background: linear-gradient(135deg, #FEF0F0 0%, #FFF5F5 100%);
          border: 2px solid #E8D5D5;
        }

        .column-header {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 35px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .is-column .column-header {
          color: #2D6A4F;
        }

        .is-not-column .column-header {
          color: #9B2C2C;
        }

        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .is-column .icon-circle {
          background: #D4E9E2;
        }

        .is-not-column .icon-circle {
          background: #FED7D7;
        }

        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .item-list li {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          line-height: 1.8;
          color: #4A5568;
          padding: 15px 0;
          padding-left: 35px;
          position: relative;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .item-list li:last-child {
          border-bottom: none;
        }

        .item-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          font-size: 24px;
        }

        .is-column .item-list li::before {
          color: #48BB78;
        }

        .is-not-column .item-list li::before {
          color: #F56565;
        }

        .subtle-pattern {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          opacity: 0.05;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            currentColor 10px,
            currentColor 20px
          );
          transform: rotate(45deg);
        }
      </style>

      <h2 class="section-title">${content.title}</h2>
      
      <div class="container-grid">
        <div class="container-column is-column">
          <div class="subtle-pattern"></div>
          <div class="column-header">
            <div class="icon-circle">✓</div>
            <span>This Space IS</span>
          </div>
          <ul class="item-list">
            ${content.thisIs.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div class="container-column is-not-column">
          <div class="subtle-pattern"></div>
          <div class="column-header">
            <div class="icon-circle">✗</div>
            <span>This Space is NOT</span>
          </div>
          <ul class="item-list">
            ${content.thisIsNot.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `,

  // Statistics with Humanity Slide
  statsWithHumanity: (content) => `
    <div class="slide-container stats-humanity">
      <style>
        .stats-humanity {
          background: linear-gradient(180deg, #FAFAF8 0%, #F7FAFC 100%);
          padding: 80px 60px;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 70px;
        }

        .stats-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          color: #2D3748;
          margin-bottom: 20px;
        }

        .stats-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          color: #718096;
          font-style: italic;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 60px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #E8D5D5 0%, #B8D4C8 100%);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 700;
          background: linear-gradient(135deg, #D53F8C 0%, #805AD5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 15px;
        }

        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #2D3748;
          font-weight: 500;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .stat-context {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          color: #718096;
          font-style: italic;
          line-height: 1.5;
        }

        .humanity-message {
          background: linear-gradient(135deg, #FEF0F5 0%, #F0F7FE 100%);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .message-text {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #2D3748;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .message-emphasis {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #D53F8C;
          font-weight: 600;
        }
      </style>

      <div class="stats-header">
        <h2 class="stats-title">${content.title}</h2>
        <p class="stats-subtitle">${content.subtitle}</p>
      </div>

      <div class="stats-grid">
        ${content.stats.map((stat) => `
          <div class="stat-card">
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-context">${stat.context}</div>
          </div>
        `).join('')}
      </div>

      <div class="humanity-message">
        <p class="message-text">${content.message}</p>
        <p class="message-emphasis">${content.emphasis}</p>
      </div>
    </div>
  `,

  // Interactive Practice Slide
  practiceSlide: (content) => `
    <div class="slide-container practice-slide">
      <style>
        .practice-slide {
          background: linear-gradient(135deg, #FEF0F5 0%, #F0F7FE 100%);
          padding: 80px 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .practice-wrapper {
          max-width: 1000px;
          width: 100%;
        }

        .practice-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .practice-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          margin-bottom: 20px;
        }

        .practice-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          color: #718096;
        }

        .practice-card {
          background: white;
          border-radius: 30px;
          padding: 60px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          position: relative;
        }

        .practice-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: #D53F8C;
          text-align: center;
          margin-bottom: 20px;
        }

        .practice-frequency {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #718096;
        }

        .frequency-icon {
          width: 40px;
          height: 40px;
          background: #E8D5D5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .instruction {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          color: #2D3748;
          text-align: center;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .practice-steps {
          background: linear-gradient(135deg, #FAFAF8 0%, #F7FAFC 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 40px;
        }

        .step-item {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #2D3748;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          font-style: italic;
          position: relative;
        }

        .step-item::before {
          content: '"';
          position: absolute;
          left: 20px;
          top: 10px;
          font-size: 40px;
          color: #E8D5D5;
        }

        .hand-icon {
          font-size: 60px;
          text-align: center;
          margin: 30px 0;
          animation: gentle-pulse 2s ease-in-out infinite;
        }

        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .science-note {
          background: #F0F7FE;
          border-left: 4px solid #B8D4C8;
          padding: 25px 30px;
          border-radius: 10px;
          margin-top: 40px;
        }

        .science-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          color: #4A5568;
          line-height: 1.6;
        }

        .science-emphasis {
          font-weight: 600;
          color: #2D3748;
        }
      </style>

      <div class="practice-wrapper">
        <div class="practice-header">
          <h2 class="practice-title">${content.title}</h2>
          <p class="practice-subtitle">${content.subtitle}</p>
        </div>

        <div class="practice-card">
          <h3 class="practice-name">${content.practice.name}</h3>
          
          <div class="practice-frequency">
            <div class="frequency-icon">⏰</div>
            <span>${content.practice.frequency}</span>
          </div>

          <p class="instruction">${content.practice.instruction}</p>

          <div class="practice-steps">
            ${content.practice.steps.map((step) => `
              <div class="step-item">${step}</div>
            `).join('')}
          </div>

          <div class="hand-icon">🤲</div>

          <div class="science-note">
            <p class="science-text">
              ${content.science.text}
              <span class="science-emphasis">${content.science.emphasis}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,

  // Key Concept with Visual Metaphor
  conceptMetaphor: (content) => `
    <div class="slide-container concept-metaphor">
      <style>
        .concept-metaphor {
          background: #FAFAF8;
          padding: 80px 60px;
          display: flex;
          align-items: center;
        }

        .concept-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1400px;
          margin: 0 auto;
          align-items: center;
        }

        .text-content {
          padding-right: 40px;
        }

        .concept-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          margin-bottom: 30px;
          line-height: 1.2;
        }

        .concept-description {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          color: #4A5568;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .key-points {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .key-point {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 25px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .key-point:hover {
          transform: translateX(10px);
          box-shadow: 0 6px 30px rgba(0,0,0,0.08);
        }

        .point-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #E8D5D5 0%, #B8D4C8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .point-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          color: #2D3748;
          line-height: 1.5;
        }

        .visual-metaphor {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metaphor-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #E8D5D5 0%, #B8D4C8 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 200px;
          position: relative;
          overflow: hidden;
        }

        .metaphor-layers {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .layer {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          animation: ripple 4s ease-out infinite;
        }

        .layer:nth-child(1) {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 0s;
        }

        .layer:nth-child(2) {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 1s;
        }

        .layer:nth-child(3) {
          width: 400px;
          height: 400px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 2s;
        }

        @keyframes ripple {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .metaphor-caption {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          color: white;
          font-style: italic;
          background: rgba(0,0,0,0.3);
          padding: 15px;
          backdrop-filter: blur(10px);
          border-radius: 15px;
          margin: 0 30px;
        }
      </style>

      <div class="concept-grid">
        <div class="text-content">
          <h2 class="concept-title">${content.title}</h2>
          <p class="concept-description">${content.description}</p>
          
          <ul class="key-points">
            ${content.points.map((point) => `
              <li class="key-point">
                <div class="point-icon">${point.icon}</div>
                <div class="point-text">${point.text}</div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="visual-metaphor">
          <div class="metaphor-image">
            <div class="metaphor-layers">
              <div class="layer"></div>
              <div class="layer"></div>
              <div class="layer"></div>
            </div>
            ${content.metaphor.visual}
            <p class="metaphor-caption">${content.metaphor.caption}</p>
          </div>
        </div>
      </div>
    </div>
  `,

  // Closing Integration Slide
  closingIntegration: (content) => `
    <div class="slide-container closing-integration">
      <style>
        .closing-integration {
          background: linear-gradient(135deg, #2D3748 0%, #1A202C 100%);
          color: white;
          padding: 80px 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .closing-integration::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><path d="M0,400 Q300,300 600,400 T1200,400" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/></svg>');
          opacity: 0.3;
        }

        .closing-wrapper {
          max-width: 1000px;
          text-align: center;
          z-index: 2;
        }

        .closing-emoji {
          font-size: 80px;
          margin-bottom: 40px;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
        }

        .closing-title {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #FED7E2 0%, #D6F5D6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .closing-message {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          line-height: 1.7;
          margin-bottom: 50px;
          color: rgba(255,255,255,0.9);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .takeaways {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 50px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .takeaway-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 25px;
          color: #FED7E2;
        }

        .takeaway-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .takeaway-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          padding: 15px 0;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .takeaway-icon {
          color: #B8D4C8;
          font-size: 24px;
        }

        .next-step {
          background: linear-gradient(135deg, #E8D5D5 0%, #B8D4C8 100%);
          color: #2D3748;
          padding: 20px 40px;
          border-radius: 50px;
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 600;
          display: inline-block;
          margin-top: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .next-step:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        .lesson-number {
          position: absolute;
          bottom: 30px;
          right: 30px;
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.5);
        }
      </style>

      <div class="closing-wrapper">
        <div class="closing-emoji">${content.emoji}</div>
        <h2 class="closing-title">${content.title}</h2>
        <p class="closing-message">${content.message}</p>

        <div class="takeaways">
          <h3 class="takeaway-title">Remember These Truths:</h3>
          <ul class="takeaway-list">
            ${content.takeaways.map((takeaway) => `
              <li class="takeaway-item">
                <span class="takeaway-icon">✨</span>
                ${takeaway}
              </li>
            `).join('')}
          </ul>
        </div>

        <a href="#" class="next-step">${content.nextStep}</a>
      </div>

      <div class="lesson-number">Lesson ${content.lessonNumber} Complete</div>
    </div>
  `
};

// Week 1 Lesson 1: Welcome to Your Fourth Trimester
// Aligned with enhanced script from COMPLETE-COURSE-WEEK1.md
const lesson1Slides = [
  // Slide 1: Hero Welcome (30 seconds)
  {
    template: 'heroWelcome',
    content: {
      emoji: '🌸',
      title: 'Welcome to Your Fourth Trimester',
      subtitle: 'A Sacred Space for Your Becoming',
      message: 'Before we begin, honor yourself. You are here, investing in your mental health during one of life\'s most challenging transitions. That isn\'t just courage - that\'s profound wisdom.'
    }
  },

  // Slide 2: Personal Connection (30 seconds)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'Hello, Beautiful Mama',
      description: 'I\'m Dr. Jana, and what you\'re experiencing right now - the overwhelm, the uncertainty, maybe even the numbness - it\'s not a flaw in your character.',
      points: [
        { icon: '🧠', text: 'It\'s your nervous system responding to the most significant transformation a human can experience' },
        { icon: '💝', text: 'You\'re not broken. You\'re becoming.' },
        { icon: '🌱', text: 'This space is designed for exactly where you are right now' }
      ],
      metaphor: {
        visual: '🦋',
        caption: 'Like a butterfly in chrysalis, transformation feels like dissolution before it feels like emergence'
      }
    }
  },

  // Slide 3: Safe Container (45 seconds)
  {
    template: 'safeContainer',
    content: {
      title: 'Our Sacred Container',
      thisIs: [
        'Trauma-informed and attachment-focused',
        'Based on 15+ years of clinical research',
        'A place where ALL parts of you are welcomed',
        'Designed for your nervous system\'s current capacity',
        'Your permission slip to prioritize yourself'
      ],
      thisIsNot: [
        'A substitute for crisis intervention',
        'A place for toxic positivity',
        'Somewhere you need to perform or be "grateful enough"',
        'Another source of pressure or judgment'
      ]
    }
  },

  // Slide 4: Reframe - The Science (1 minute)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'The Truth About Your Fourth Trimester',
      description: 'Society tells us the fourth trimester is "just" the first three months. But neuroscience tells us a different story.',
      points: [
        { icon: '🧬', text: 'Your brain is literally rewiring itself - growing new neural pathways at an unprecedented rate' },
        { icon: '🔬', text: 'Your gray matter is reorganizing for vigilance, empathy, and connection' },
        { icon: '⚡', text: 'You\'re experiencing the largest hormonal shift in human biology' },
        { icon: '🛡️', text: 'Your amygdala is hyperactive - not because you\'re anxious, but because you\'re evolutionarily designed to protect' }
      ],
      metaphor: {
        visual: '🧠',
        caption: 'Your brain isn\'t malfunctioning - it\'s magnificently adapting'
      }
    }
  },

  // Slide 5: What You're Really Navigating (1 minute)
  {
    template: 'statsWithHumanity',
    content: {
      title: 'What You\'re Really Navigating',
      subtitle: 'All of this. Simultaneously.',
      stats: [
        { number: '🧠', label: 'Identity Death & Rebirth', context: 'Matrescence - as profound as adolescence' },
        { number: '🌊', label: 'Massive Hormonal Shifts', context: 'Larger than puberty and menopause combined' },
        { number: '💤', label: 'Sleep Deprivation', context: 'That would be considered torture in other contexts' },
        { number: '🔗', label: 'Attachment Reorganization', context: 'With everyone in your life, including yourself' }
      ],
      message: 'When you think about it this way...',
      emphasis: 'Your resilience is actually extraordinary.'
    }
  },

  // Slide 6: You're Not Alone - Statistics (1 minute)
  {
    template: 'statsWithHumanity',
    content: {
      title: 'Your Invisible Community',
      subtitle: 'Not as statistics - as your neighbors, sisters, friends',
      stats: [
        { number: '80%', label: 'experience baby blues', context: 'That\'s 4 out of every 5 moms at the playground' },
        { number: '20%', label: 'develop postpartum depression', context: 'Your neighbor, your sister, your best friend' },
        { number: '15%', label: 'experience postpartum anxiety', context: 'Including the moms who "have it all together"' },
        { number: '40%', label: 'report intrusive thoughts', context: 'Most too ashamed to tell anyone' }
      ],
      message: 'Struggling is NORMAL. It\'s not a bug in the system...',
      emphasis: 'It\'s a feature of profound transformation.'
    }
  },

  // Slide 7: Cultural Truth Bomb (30 seconds)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'The Real Problem',
      description: 'The problem isn\'t you. The problem is a culture that expects you to "bounce back" from an experience that\'s meant to fundamentally change you.',
      points: [
        { icon: '🌍', text: 'Other cultures have 40-day lying-in periods' },
        { icon: '👥', text: 'Mothers were never meant to do this alone' },
        { icon: '💔', text: 'Modern isolation is the anomaly, not your struggle' }
      ],
      metaphor: {
        visual: '🏝️',
        caption: 'You\'re not failing at motherhood. You\'re succeeding in impossible conditions.'
      }
    }
  },

  // Slide 8: Your Fourth Trimester Rights (1.5 minutes)
  {
    template: 'practiceSlide',
    content: {
      title: 'Your Fourth Trimester Rights',
      subtitle: 'Not just nice ideas - therapeutic prescriptions for your healing',
      practice: {
        name: 'Rights to Embody',
        frequency: 'Read daily, believe gradually',
        instruction: 'You have the RIGHT to:',
        steps: [
          'Feel whatever you feel without justification',
          'Ask for help as many times as you need it',
          'Prioritize your mental health as much as baby\'s physical health',
          'Grieve who you were before becoming a mother',
          'Have needs that exist beyond your baby\'s needs'
        ]
      },
      science: {
        text: 'As you read each one, notice which ones your body resists.',
        emphasis: 'That\'s where your healing work begins.'
      }
    }
  },

  // Slide 9: The Practice - Your Medicine (1 minute)
  {
    template: 'practiceSlide',
    content: {
      title: 'Your Medicine This Week',
      subtitle: 'Not homework - medicine for your nervous system',
      practice: {
        name: 'The "Enough" Practice',
        frequency: '3 times daily (morning, afternoon, bedtime)',
        instruction: 'Place both hands on your heart and say:',
        steps: [
          'I am learning, and that\'s enough.',
          'I am trying, and that\'s enough.',
          'I am here, and that\'s enough.'
        ]
      },
      science: {
        text: 'This isn\'t positive thinking. This is nervous system regulation through self-touch (oxytocin release) and self-compassion (vagal tone improvement).',
        emphasis: 'It\'s neuroscience-backed healing.'
      }
    }
  },

  // Slide 10: Integration & Looking Forward (30 seconds)
  {
    template: 'closingIntegration',
    content: {
      emoji: '💝',
      title: 'You\'ve Already Begun',
      message: 'By showing up today, by staying present through this lesson, you\'ve already started rewiring your nervous system for self-compassion.',
      takeaways: [
        'Your struggles are normal responses to extraordinary circumstances',
        'You\'re not alone - you\'re part of an invisible sisterhood',
        'Healing happens in small, gentle moments of self-compassion'
      ],
      nextStep: 'Next Lesson: Your Body\'s Wisdom',
      lessonNumber: 1
    }
  }
];

// Script alignment for Lesson 1 (from enhanced content)
const lesson1Script = `
Welcome, brave mama. I'm Dr. Jana, and I want you to know something before we begin: 
What you're experiencing right now - the overwhelm, the uncertainty, maybe even the 
numbness - it's not a flaw in your character. It's your nervous system responding to 
the most significant biological and psychological transformation a human can experience.

[PAUSE - Let them breathe]

This space we're creating together? It's different. It's trauma-informed and 
attachment-focused. It's based on 15+ years of clinical research, but more importantly, 
it's based on the truth that you deserve to be held with the same tenderness you're 
learning to offer your baby.

The truth is, the "fourth trimester" isn't just about your baby adjusting to the world. 
It's about you undergoing a complete metamorphosis - neurologically, hormonally, 
psychologically, spiritually. Your brain is literally rewiring itself. You're not 
broken. You're BECOMING.

[Show statistics with humanity]

When we look at the numbers - 80% experiencing baby blues, 20% developing PPD - these 
aren't just statistics. This is your neighbor. Your sister. The mom at Target who 
looks like she has it all together. This is the vast, invisible community of women 
navigating the same storms.

The problem isn't you. The problem is a culture that expects you to "bounce back" 
from an experience that's meant to fundamentally change you.

[Introduce the rights]

So today, we're reclaiming your Fourth Trimester Rights. These aren't just nice 
ideas - they're therapeutic prescriptions for your healing. You have the right to 
feel whatever you feel without justification. To ask for help as many times as you 
need it. To prioritize your mental health as much as your baby's physical health.

[Practice introduction]

Your medicine this week is simple but profound: The "Enough" Practice. Three times 
a day, place both hands on your heart and say: "I am learning, and that's enough. 
I am trying, and that's enough. I am here, and that's enough."

This isn't woo-woo positive thinking. This is nervous system regulation. Your touch 
releases oxytocin. Your voice speaking kindness rewires your internal dialogue. 
This is neuroscience-backed self-compassion.

Remember: You're not behind. You're not failing. You're navigating something 
extraordinary. And you're doing it beautifully, even when it doesn't feel that way.

See you in our next lesson, where we'll explore what's really happening in your 
body during recovery - not the sanitized version, but the truth that helps you 
understand why healing takes time.

Until then, be gentle with yourself. You're doing sacred work.
`;

async function createWorldClassSlides() {
  try {
    console.log('🎨 Creating world-class slides for Week 1 Lesson 1...\n');

    // Generate HTML for all slides
    const slidesHtml = lesson1Slides.map((slide, index) => {
      const template = professionalSlideTemplates[slide.template];
      if (!template) {
        console.error(`❌ Unknown template: ${slide.template}`);
        return '';
      }
      
      console.log(`✅ Created slide ${index + 1}: ${slide.content.title || 'Slide'}`);
      return template(slide.content);
    }).join('\n<!-- SLIDE -->\n');

    // Save to file for review
    const fs = require('fs');
    const outputPath = './course-materials/week1-lesson1-world-class.html';
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week 1 Lesson 1: Welcome to Your Fourth Trimester</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .slide-container {
        display: none;
      }
      .slide-container.active {
        display: flex;
      }
      .slide-nav {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        z-index: 1000;
      }
    </style>
</head>
<body>
    ${slidesHtml}
    
    <div class="slide-nav">
      <span id="slideNumber">1</span> / ${lesson1Slides.length}
    </div>

    <script>
      let currentSlide = 0;
      const slides = document.querySelectorAll('.slide-container');
      const slideNumber = document.getElementById('slideNumber');
      
      function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        slideNumber.textContent = currentSlide + 1;
      }
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
      });
      
      showSlide(0);
    </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, fullHtml);
    console.log(`\n📁 Saved to: ${outputPath}`);

    // Update in database
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (course) {
      console.log('\n📊 Found course:', course.id);
      
      const { data: module, error: moduleError } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', course.id)
        .eq('week_number', 1)
        .single();

      if (moduleError) {
        console.error('❌ Module error:', moduleError);
        return;
      }

      if (module) {
        console.log('📊 Found module:', module.id);
        
        const { data: updateData, error: updateError } = await supabase
          .from('course_lessons')
          .update({ 
            slides_html: slidesHtml,
            video_script_formatted: lesson1Script.trim(),
            script_notes: 'World-class slides created with enhanced course content'
          })
          .eq('module_id', module.id)
          .eq('lesson_number', 1)
          .select();

        if (updateError) {
          console.error('❌ Update error:', updateError);
        } else {
          console.log('\n✅ Successfully updated database with world-class slides!');
          console.log('📊 Updated lesson:', updateData?.[0]?.id);
          
          // Verify the update
          const { data: verifyData } = await supabase
            .from('course_lessons')
            .select('slides_html')
            .eq('module_id', module.id)
            .eq('lesson_number', 1)
            .single();
          
          if (verifyData) {
            console.log('✅ Verified: slides_html length is now', verifyData.slides_html?.length || 0);
          }
        }
      } else {
        console.error('❌ Module not found');
      }
    } else {
      console.error('❌ Course not found');
    }

    console.log('\n🎯 Summary:');
    console.log(`- Created ${lesson1Slides.length} professional slides`);
    console.log('- Aligned with enhanced course content');
    console.log('- Incorporated all expert recommendations');
    console.log('- Ready for new mom focus group testing!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createWorldClassSlides();