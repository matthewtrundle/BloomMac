export const slideTemplates = {
  title: {
    name: "Title Slide",
    preview: "🎯 Opening slide with emoji, title, and subtitle",
    template: `<div class="slide slide-title">
  <div class="slide-content">
    <div class="emoji-accent">👶</div>
    <h1 class="slide-heading">Your Title Here</h1>
    <p class="slide-subtitle">Your subtitle here</p>
    <div class="decorative-line"></div>
  </div>
</div>`,
  },

  threeColumns: {
    name: "Three Column Layout",
    preview: "📊 Three topic cards in a grid",
    template: `<div class="slide slide-intro">
  <div class="slide-content">
    <h2 class="section-title">Section Title</h2>
    <div class="topics-grid">
      <div class="topic-card">
        <div class="topic-icon">🌱</div>
        <h3>Topic 1</h3>
        <p>Description here</p>
      </div>
      <div class="topic-card">
        <div class="topic-icon">💗</div>
        <h3>Topic 2</h3>
        <p>Description here</p>
      </div>
      <div class="topic-card">
        <div class="topic-icon">🌟</div>
        <h3>Topic 3</h3>
        <p>Description here</p>
      </div>
    </div>
  </div>
</div>`,
  },

  quote: {
    name: "Quote Slide",
    preview: "💬 Beautiful quote with floating elements",
    template: `<div class="slide slide-quote">
  <div class="slide-content">
    <blockquote class="beautiful-quote">
      <p>"Your inspiring quote goes here."</p>
      <cite>- Attribution</cite>
    </blockquote>
    <div class="floating-petals">
      <span class="petal petal-1">🌸</span>
      <span class="petal petal-2">🌸</span>
      <span class="petal petal-3">🌸</span>
    </div>
  </div>
</div>`,
  },

  statistics: {
    name: "Statistics Slide",
    preview: "📈 Big numbers with key message",
    template: `<div class="slide slide-content-main">
  <div class="slide-content">
    <h2 class="content-heading">Your Heading</h2>
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-number">70%</div>
        <div class="stat-label">of something important</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">1 in 5</div>
        <div class="stat-label">experience this</div>
      </div>
    </div>
    <div class="key-message">
      <p>Your <strong>key message</strong> goes here</p>
    </div>
  </div>
</div>`,
  },

  reflection: {
    name: "Reflection/Activity",
    preview: "✍️ Interactive reflection questions",
    template: `<div class="slide slide-interactive">
  <div class="slide-content">
    <h2 class="activity-title">Pause & Reflect</h2>
    <div class="reflection-card">
      <h3>Take a moment to consider:</h3>
      <ul class="reflection-questions">
        <li>Question 1?</li>
        <li>Question 2?</li>
        <li>Question 3?</li>
      </ul>
      <div class="cta-box">
        <p>Action item here 📝</p>
      </div>
    </div>
  </div>
</div>`,
  },

  bulletPoints: {
    name: "Bullet Points",
    preview: "📝 Key points with visual hierarchy",
    template: `<div class="slide slide-bullets">
  <div class="slide-content">
    <h2 class="content-heading">Key Points</h2>
    <div class="bullet-container">
      <div class="bullet-item">
        <span class="bullet-icon">✓</span>
        <div class="bullet-content">
          <h3>Point 1</h3>
          <p>Explanation of the first point</p>
        </div>
      </div>
      <div class="bullet-item">
        <span class="bullet-icon">✓</span>
        <div class="bullet-content">
          <h3>Point 2</h3>
          <p>Explanation of the second point</p>
        </div>
      </div>
      <div class="bullet-item">
        <span class="bullet-icon">✓</span>
        <div class="bullet-content">
          <h3>Point 3</h3>
          <p>Explanation of the third point</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },

  imageWithText: {
    name: "Image + Text",
    preview: "🖼️ Split layout with image and content",
    template: `<div class="slide slide-image-text">
  <div class="slide-content split-layout">
    <div class="image-side">
      <img src="https://via.placeholder.com/600x400" alt="Description" />
    </div>
    <div class="text-side">
      <h2>Your Heading</h2>
      <p>Your content here explaining the image or concept.</p>
      <ul class="feature-list">
        <li>Key point 1</li>
        <li>Key point 2</li>
        <li>Key point 3</li>
      </ul>
    </div>
  </div>
</div>`,
  },

  callToAction: {
    name: "Call to Action",
    preview: "🎯 End slide with clear next steps",
    template: `<div class="slide slide-cta">
  <div class="slide-content">
    <div class="cta-container">
      <h2 class="cta-heading">Ready for the Next Step?</h2>
      <p class="cta-description">
        Brief description of what comes next
      </p>
      <div class="cta-buttons">
        <div class="cta-primary">
          <h3>Action 1</h3>
          <p>Description</p>
        </div>
        <div class="cta-secondary">
          <h3>Action 2</h3>
          <p>Description</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
  }
};

export const slideStyles = `
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

/* Topics Grid */
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

/* Statistics Slide */
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

/* Bullet Points Slide */
.slide-bullets {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.bullet-container {
  max-width: 700px;
  margin: 0 auto;
}

.bullet-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.bullet-icon {
  font-size: 2rem;
  color: #0284c7;
  flex-shrink: 0;
}

.bullet-content h3 {
  font-size: 1.5rem;
  color: #075985;
  margin-bottom: 0.5rem;
}

.bullet-content p {
  color: #64748b;
  line-height: 1.6;
}

/* Image + Text Slide */
.slide-image-text {
  background: #fafafa;
}

.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.image-side img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.text-side h2 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.text-side p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.8;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: #374151;
}

.feature-list li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #e2348d;
  font-weight: bold;
}

/* CTA Slide */
.slide-cta {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.cta-container {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-heading {
  font-size: 3rem;
  color: #78350f;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.3rem;
  color: #92400e;
  margin-bottom: 3rem;
}

.cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.cta-primary, .cta-secondary {
  padding: 2rem;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.cta-primary {
  background: #e2348d;
  color: white;
}

.cta-secondary {
  background: white;
  color: #1f2937;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.cta-primary:hover, .cta-secondary:hover {
  transform: translateY(-5px);
}

.cta-primary h3, .cta-secondary h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .slide-heading { font-size: 2.5rem; }
  .section-title { font-size: 2rem; }
  .content-heading { font-size: 2rem; }
  .beautiful-quote p { font-size: 1.5rem; }
  .stat-cards { flex-direction: column; gap: 2rem; }
  .stat-number { font-size: 3rem; }
  .split-layout { grid-template-columns: 1fr; }
  .cta-buttons { grid-template-columns: 1fr; }
  .topics-grid { grid-template-columns: 1fr; }
}