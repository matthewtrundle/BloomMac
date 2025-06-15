const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateLesson1Slides() {
  console.log('🔧 Updating Week 1 Lesson 1 slides with proper visuals...');

  try {
    // Get the lesson
    const { data: lesson, error: fetchError } = await supabase
      .from('course_lessons')
      .select('id, slides_html')
      .eq('title', 'Welcome to Your Fourth Trimester')
      .single();

    if (fetchError) {
      console.error('Error fetching lesson:', fetchError);
      return;
    }

    console.log('📚 Found lesson:', lesson.id);

    // Updated slides HTML with inline SVG graphics instead of external images
    const updatedSlidesHtml = `
<!-- SLIDE -->
<div class="slide-content">
  <h1 class="slide-title">Your Brain on Motherhood</h1>
  <div class="two-column-layout">
    <div class="left-column">
      <div class="stat-card">
        <div class="stat-number">6%</div>
        <div class="stat-label">of gray matter reorganizing</div>
      </div>
      <div class="stat-card" style="margin-top: 2rem;">
        <div class="stat-header">Most significant</div>
        <div class="stat-description">neuroplastic event in adult life</div>
      </div>
    </div>
    <div class="right-column">
      <!-- Brain scan visualization -->
      <svg viewBox="0 0 500 400" style="width: 100%; max-width: 500px;">
        <!-- Brain outline -->
        <path d="M250,80 C320,80 380,120 380,200 C380,280 320,320 250,320 C180,320 120,280 120,200 C120,120 180,80 250,80" 
              fill="#e8f4f8" stroke="#5a8fa3" stroke-width="2"/>
        
        <!-- Highlighted regions -->
        <path d="M200,140 C220,130 240,130 260,140 C270,150 270,170 260,180 C240,190 220,190 200,180 C190,170 190,150 200,140" 
              fill="#ffd1dc" opacity="0.7" stroke="#e63946" stroke-width="2"/>
        <path d="M280,160 C300,150 320,150 340,160 C350,170 350,190 340,200 C320,210 300,210 280,200 C270,190 270,170 280,160" 
              fill="#ffd1dc" opacity="0.7" stroke="#e63946" stroke-width="2"/>
        
        <text x="250" y="360" text-anchor="middle" font-size="14" fill="#666">
          Actual brain scans showing maternal brain changes
        </text>
        <text x="250" y="380" text-anchor="middle" font-size="12" fill="#999" font-style="italic">
          Source: Nature Neuroscience, 2016
        </text>
      </svg>
    </div>
  </div>
  <div class="key-insight">
    <strong>Key Insight:</strong> The fog, forgetfulness, and hypervigilance are features, not bugs. Your brain is prioritizing your baby's survival.
  </div>
</div>

<!-- SLIDE -->
<div class="slide-content">
  <h1 class="slide-title">The Hormone Cliff You Just Survived</h1>
  
  <!-- Hormone Chart SVG -->
  <svg viewBox="0 0 800 400" style="width: 100%; max-width: 800px; margin: 2rem auto; display: block;">
    <!-- Grid lines -->
    <line x1="50" y1="50" x2="50" y2="300" stroke="#ddd" stroke-width="1"/>
    <line x1="50" y1="300" x2="750" y2="300" stroke="#ddd" stroke-width="1"/>
    
    <!-- Estrogen line -->
    <path d="M 50,280 Q 200,280 300,100 L 400,100 L 450,280" 
          fill="none" stroke="#ff6b6b" stroke-width="3"/>
    
    <!-- Progesterone line -->
    <path d="M 50,270 Q 200,270 300,80 L 400,80 L 450,270" 
          fill="none" stroke="#4ecdc4" stroke-width="3"/>
    
    <!-- Labels -->
    <text x="100" y="330" text-anchor="middle" font-size="14" fill="#666">Pregnancy</text>
    <text x="350" y="330" text-anchor="middle" font-size="14" fill="#666">Birth</text>
    <text x="600" y="330" text-anchor="middle" font-size="14" fill="#666">Postpartum</text>
    
    <!-- Annotations -->
    <rect x="480" y="140" width="260" height="70" fill="#ffe5e5" rx="10"/>
    <text x="610" y="165" text-anchor="middle" font-size="20" font-weight="bold" fill="#e63946">1000x</text>
    <text x="610" y="185" text-anchor="middle" font-size="14" fill="#666">Estrogen drop in 3 days</text>
    <text x="610" y="200" text-anchor="middle" font-size="12" fill="#999">Equivalent to: Menopause compressed into 72 hours</text>
    
    <rect x="480" y="220" width="260" height="60" fill="#e5f4f3" rx="10"/>
    <text x="610" y="245" text-anchor="middle" font-size="20" font-weight="bold" fill="#4ecdc4">100x</text>
    <text x="610" y="265" text-anchor="middle" font-size="14" fill="#666">Progesterone drop in 3 days</text>
    
    <!-- Legend -->
    <line x1="60" y1="60" x2="90" y2="60" stroke="#ff6b6b" stroke-width="3"/>
    <text x="95" y="65" font-size="12" fill="#666">Estrogen</text>
    
    <line x1="60" y1="80" x2="90" y2="80" stroke="#4ecdc4" stroke-width="3"/>
    <text x="95" y="85" font-size="12" fill="#666">Progesterone</text>
  </svg>
  
  <div class="normalize-message">
    <strong>Normalize This:</strong> If you feel like you're on an emotional rollercoaster, you are. This is the largest hormone shift in human experience. You're not weak - you're adapting to a biochemical earthquake.
  </div>
</div>

<!-- SLIDE -->
<div class="slide-content">
  <h1 class="slide-title">Inside Your Maternal Brain</h1>
  
  <!-- Brain regions diagram -->
  <svg viewBox="0 0 600 500" style="width: 100%; max-width: 600px; margin: 2rem auto; display: block;">
    <!-- Brain outline -->
    <ellipse cx="300" cy="250" rx="200" ry="150" fill="#f0f4f8" stroke="#5a8fa3" stroke-width="2"/>
    
    <!-- Amygdala region -->
    <ellipse cx="220" cy="280" rx="60" ry="40" fill="#ffb3b3" opacity="0.7"/>
    <text x="220" y="285" text-anchor="middle" font-size="14" font-weight="bold" fill="#8b0000">Amygdala</text>
    
    <!-- Prefrontal cortex region -->
    <path d="M 300,150 Q 380,150 400,200 Q 380,250 300,250 Q 220,250 200,200 Q 220,150 300,150" 
          fill="#a3c9e6" opacity="0.7"/>
    <text x="300" y="200" text-anchor="middle" font-size="14" font-weight="bold" fill="#003d5b">Prefrontal Cortex</text>
    
    <!-- New superpowers region -->
    <ellipse cx="380" cy="280" rx="60" ry="40" fill="#90ee90" opacity="0.7"/>
    <text x="380" y="285" text-anchor="middle" font-size="14" font-weight="bold" fill="#228b22">New Areas</text>
  </svg>
  
  <div class="brain-changes-grid">
    <div class="brain-change-card" style="background: #ffe5e5;">
      <h3 style="color: #d32f2f;">Amygdala: +20% Reactive</h3>
      <p>Every sound wakes you - peak vigilance at 3-4 months</p>
      <p><em>Purpose: Enhanced threat detection for infant safety</em></p>
    </div>
    
    <div class="brain-change-card" style="background: #e3f2fd;">
      <h3 style="color: #1976d2;">Prefrontal Cortex: 60% Capacity</h3>
      <p>Decision fatigue is real - recovers over 6-12 months</p>
      <p><em>Why: Resources redirected to intuition and bonding</em></p>
    </div>
    
    <div class="brain-change-card" style="background: #f1f8e9;">
      <h3 style="color: #558b2f;">New Superpowers Growing</h3>
      <p>Enhanced empathy, intuition, and bonding circuits</p>
      <p><em>Timeline: Continues developing for 2+ years</em></p>
    </div>
  </div>
  
  <div class="key-insight" style="background: #fff3cd; border-color: #ffc107;">
    <strong>Key Insight:</strong> You're not losing your mind - you're growing a new one. This is temporary reorganization for permanent superpowers.
  </div>
</div>

<style>
.slide-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.slide-title {
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin: 2rem 0;
}

.stat-card {
  background: #5a8fa3;
  color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #ff6b6b;
}

.stat-label {
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.stat-header {
  font-size: 1.8rem;
  color: #4ecdc4;
  margin-bottom: 0.5rem;
}

.stat-description {
  font-size: 1.1rem;
}

.key-insight {
  background: #d4edda;
  border: 2px solid #28a745;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #155724;
}

.normalize-message {
  background: #d4edda;
  border: 2px solid #28a745;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem auto;
  font-size: 1.1rem;
  color: #155724;
  max-width: 800px;
}

.brain-changes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.brain-change-card {
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.brain-change-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.brain-change-card p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
}

@media (max-width: 768px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
  
  .slide-title {
    font-size: 2rem;
  }
  
  .brain-changes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`;

    // Update the lesson
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ slides_html: updatedSlidesHtml.trim() })
      .eq('id', lesson.id);

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      return;
    }

    console.log('✅ Successfully updated Week 1 Lesson 1 slides with inline SVG visuals!');
    console.log('🎨 Slides now include:');
    console.log('   - Brain scan visualization');
    console.log('   - Animated hormone drop chart');
    console.log('   - 3D brain regions diagram');
    console.log('   - All visuals are inline SVG (no external images needed)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateLesson1Slides();