#!/usr/bin/env node

/**
 * HTML Slide Production Script
 * Creates professional HTML slides for course lessons
 * Usage: node scripts/create-lesson-slides.js <weekNumber> <lessonNumber>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Slide templates library
const slideTemplates = {
  title: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
        }
        .emoji-accent {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }
        .slide-title {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .slide-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.25rem;
          color: #4a5568;
          max-width: 600px;
          margin: 0 auto;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      </style>
      <div>
        ${content.emoji ? `<div class="emoji-accent">${content.emoji}</div>` : ''}
        <h1 class="slide-title">${content.title}</h1>
        ${content.subtitle ? `<p class="slide-subtitle">${content.subtitle}</p>` : ''}
      </div>
    </div>
  `,

  content: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          padding: 3rem;
          background: linear-gradient(to bottom, #f7fafc, #ffffff);
          border-radius: 12px;
        }
        .content-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
        }
        .content-body {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #4a5568;
          max-width: 800px;
          margin: 0 auto;
        }
        .content-body ul {
          list-style: none;
          padding: 0;
        }
        .content-body li {
          padding: 0.75rem 0 0.75rem 2rem;
          position: relative;
        }
        .content-body li:before {
          content: "🌸";
          position: absolute;
          left: 0;
        }
        .highlight {
          background: linear-gradient(to right, #fce4ec, #f8bbd0);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }
      </style>
      <div>
        <h2 class="content-title">${content.title}</h2>
        <div class="content-body">
          ${content.body}
        </div>
      </div>
    </div>
  `,

  quote: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e6f2ff 0%, #cfe2ff 100%);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
        }
        .quote-text {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #2d3748;
          line-height: 1.6;
          font-style: italic;
          max-width: 700px;
          margin: 0 auto 1.5rem;
        }
        .quote-author {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.125rem;
          color: #4a5568;
        }
        .quote-marks {
          font-size: 4rem;
          color: #cbd5e0;
          line-height: 1;
        }
      </style>
      <div>
        <div class="quote-marks">"</div>
        <p class="quote-text">${content.text}</p>
        ${content.author ? `<p class="quote-author">— ${content.author}</p>` : ''}
      </div>
    </div>
  `,

  stats: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          padding: 3rem;
          background: linear-gradient(to bottom, #f7fafc, #ffffff);
          border-radius: 12px;
        }
        .stats-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 3rem;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .stat-card {
          background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          transform: translateY(0);
          transition: transform 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: bold;
          color: #d53f8c;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          color: #4a5568;
        }
      </style>
      <div>
        <h2 class="stats-title">${content.title}</h2>
        <div class="stats-grid">
          ${content.stats.map(stat => `
            <div class="stat-card">
              <div class="stat-number">${stat.number}</div>
              <div class="stat-label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `,

  list: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          padding: 3rem;
          background: linear-gradient(to bottom, #f7fafc, #ffffff);
          border-radius: 12px;
        }
        .list-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .list-container {
          max-width: 700px;
          margin: 0 auto;
        }
        .list-item {
          background: white;
          border-left: 4px solid #d53f8c;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateX(0);
          transition: transform 0.3s ease;
        }
        .list-item:hover {
          transform: translateX(10px);
        }
        .list-item-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1.25rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        .list-item-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          color: #4a5568;
          line-height: 1.6;
        }
      </style>
      <div>
        <h2 class="list-title">${content.title}</h2>
        <div class="list-container">
          ${content.items.map(item => `
            <div class="list-item">
              <div class="list-item-title">${item.title}</div>
              ${item.description ? `<div class="list-item-desc">${item.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `,

  closing: (content) => `
    <div class="slide-container">
      <style>
        .slide-container {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
        }
        .closing-emoji {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        .closing-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 1rem;
        }
        .closing-message {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.25rem;
          color: #4a5568;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        .next-step {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          color: #d53f8c;
          font-weight: 600;
        }
      </style>
      <div>
        ${content.emoji ? `<div class="closing-emoji">${content.emoji}</div>` : ''}
        <h2 class="closing-title">${content.title}</h2>
        <p class="closing-message">${content.message}</p>
        ${content.nextStep ? `<p class="next-step">${content.nextStep}</p>` : ''}
      </div>
    </div>
  `
};

// Create slides for a specific lesson
function createSlides(weekNumber, lessonNumber, slideData) {
  const slides = slideData.map(slide => {
    const template = slideTemplates[slide.type];
    if (!template) {
      console.error(`Unknown slide type: ${slide.type}`);
      return '';
    }
    return template(slide.content);
  });

  return slides.join('\n<!-- SLIDE -->\n');
}

// Week 1 Lesson content
const weekContent = {
  1: {
    1: [
      {
        type: 'title',
        content: {
          emoji: '🌸',
          title: 'Welcome to Your Fourth Trimester',
          subtitle: 'A Sacred Space for Your Becoming'
        }
      },
      {
        type: 'content',
        content: {
          title: "You're Here. That Takes Courage.",
          body: `
            <p>Taking this first step shows incredible strength. Whether you're feeling overwhelmed, anxious, or simply seeking support, you belong here.</p>
            <ul>
              <li>This is YOUR time</li>
              <li>Your feelings are valid</li>
              <li>You deserve support</li>
              <li>Healing is possible</li>
            </ul>
          `
        }
      },
      {
        type: 'list',
        content: {
          title: 'This Space Is...',
          items: [
            { title: 'Safe', description: 'Free from judgment, full of understanding' },
            { title: 'Supportive', description: 'You\'re not alone in this journey' },
            { title: 'Healing', description: 'Designed for your emotional wellness' },
            { title: 'Yours', description: 'Move at your own pace, honor your needs' }
          ]
        }
      },
      {
        type: 'quote',
        content: {
          text: 'The fourth trimester is as much about birthing a mother as it is about having a baby.',
          author: 'Dr. Jana Rundle'
        }
      },
      {
        type: 'stats',
        content: {
          title: "You're Not Alone",
          stats: [
            { number: '80%', label: 'of new mothers experience baby blues' },
            { number: '1 in 7', label: 'develop postpartum depression' },
            { number: '90%', label: 'feel unprepared for emotional changes' },
            { number: '100%', label: 'deserve support and understanding' }
          ]
        }
      },
      {
        type: 'closing',
        content: {
          emoji: '💝',
          title: 'See You Next Lesson',
          message: 'Take a deep breath. Place your hand on your heart. You\'ve taken the first step.',
          nextStep: 'Next: Understanding Your Changing Body'
        }
      }
    ],
    2: [
      {
        type: 'title',
        content: {
          emoji: '🌱',
          title: 'Your Body After Birth',
          subtitle: 'Understanding Physical Recovery'
        }
      },
      {
        type: 'content',
        content: {
          title: 'Your Body Has Done Something Miraculous',
          body: `
            <p>Whether you gave birth vaginally or by cesarean, your body has been through an incredible transformation. Recovery isn't linear, and that's perfectly normal.</p>
            <ul>
              <li>Healing takes time</li>
              <li>Every recovery is unique</li>
              <li>Rest is productive</li>
              <li>Your body knows how to heal</li>
            </ul>
          `
        }
      },
      {
        type: 'stats',
        content: {
          title: 'Recovery Timeline',
          stats: [
            { number: '6-8', label: 'weeks for uterus to return to size' },
            { number: '4-6', label: 'months for core recovery' },
            { number: '12+', label: 'months for full healing' },
            { number: '∞', label: 'Your body is amazing!' }
          ]
        }
      },
      {
        type: 'closing',
        content: {
          emoji: '🌸',
          title: 'Honor Your Healing',
          message: 'Your body has done the work of creating life. Give it the grace and time it needs to heal.',
          nextStep: 'Next: Navigating Emotional Waves'
        }
      }
    ]
  }
};

async function updateLessonSlides(weekNumber, lessonNumber) {
  try {
    // Get the course and module
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (!course) {
      throw new Error('Course not found');
    }

    const { data: module } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', course.id)
      .eq('week_number', weekNumber)
      .single();

    if (!module) {
      throw new Error(`Module for week ${weekNumber} not found`);
    }

    // Get the lesson
    const { data: lesson } = await supabase
      .from('course_lessons')
      .select('id, title')
      .eq('module_id', module.id)
      .eq('lesson_number', lessonNumber)
      .single();

    if (!lesson) {
      throw new Error(`Lesson ${lessonNumber} for week ${weekNumber} not found`);
    }

    // Generate slides
    const slideData = weekContent[weekNumber]?.[lessonNumber];
    if (!slideData) {
      throw new Error(`No slide content defined for Week ${weekNumber} Lesson ${lessonNumber}`);
    }

    const slidesHtml = createSlides(weekNumber, lessonNumber, slideData);

    // Update the lesson with slides
    const { error } = await supabase
      .from('course_lessons')
      .update({ slides_html: slidesHtml })
      .eq('id', lesson.id);

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully created slides for Week ${weekNumber} Lesson ${lessonNumber}: ${lesson.title}`);
    console.log(`   Created ${slideData.length} slides`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Command line interface
const weekNumber = parseInt(process.argv[2]);
const lessonNumber = parseInt(process.argv[3]);

if (!weekNumber || !lessonNumber) {
  console.log('Usage: node scripts/create-lesson-slides.js <weekNumber> <lessonNumber>');
  console.log('Example: node scripts/create-lesson-slides.js 1 1');
  process.exit(1);
}

updateLessonSlides(weekNumber, lessonNumber).then(() => {
  console.log('✨ Done!');
  process.exit(0);
});