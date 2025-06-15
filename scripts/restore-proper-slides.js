const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function restoreProperSlides() {
  console.log('🔧 Restoring properly formatted slides for Week 1 Lesson 1...');

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

    // Properly formatted slides with correct HTML structure
    const properSlides = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }
        
        .slide {
            min-height: 100vh;
            padding: 3rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .slide-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .slide-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            background: #e91e63;
            color: white;
            border-radius: 50%;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 0.5rem 0;
        }
        
        .slide-subtitle {
            font-size: 1.25rem;
            color: #64748b;
            margin: 0;
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            width: 100%;
            align-items: center;
        }
        
        .stat-box {
            background: #2d3748;
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
        }
        
        .stat-number {
            font-size: 3.5rem;
            font-weight: 700;
            color: #f56565;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 1.125rem;
            opacity: 0.9;
        }
        
        .highlight-box {
            background: #38b2ac;
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
        }
        
        .highlight-title {
            font-size: 1.875rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .highlight-text {
            font-size: 1.125rem;
            opacity: 0.9;
        }
        
        .brain-visual {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .key-point {
            background: #d4f1f4;
            border-left: 4px solid #38b2ac;
            padding: 1.5rem;
            margin-top: 2rem;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            color: #1a202c;
            width: 100%;
        }
        
        .hormone-chart {
            width: 100%;
            max-width: 800px;
            margin: 2rem auto;
        }
        
        .hormone-box {
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .hormone-box.estrogen {
            background: #ffe5e5;
            border: 2px solid #ff6b6b;
        }
        
        .hormone-box.progesterone {
            background: #e5f4f3;
            border: 2px solid #4ecdc4;
        }
        
        .hormone-number {
            font-size: 3rem;
            font-weight: 700;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .hormone-box.estrogen .hormone-number {
            color: #e63946;
        }
        
        .hormone-box.progesterone .hormone-number {
            color: #4ecdc4;
        }
        
        .brain-changes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
            width: 100%;
        }
        
        .brain-card {
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .brain-card.amygdala {
            background: #ffe5e5;
            border: 2px solid #ff6b6b;
        }
        
        .brain-card.prefrontal {
            background: #e5f0ff;
            border: 2px solid #4a90e2;
        }
        
        .brain-card.new-growth {
            background: #e5ffe5;
            border: 2px solid #66bb6a;
        }
        
        .brain-card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: #1a202c;
        }
        
        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
            }
            
            .slide-title {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <!-- SLIDE 1 -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-number">1</div>
            <h1 class="slide-title">Your Brain on Motherhood</h1>
        </div>
        
        <div class="content-grid">
            <div>
                <div class="stat-box">
                    <span class="stat-number">6%</span>
                    <span class="stat-label">of gray matter reorganizing</span>
                </div>
                
                <div class="highlight-box">
                    <div class="highlight-title">Most significant</div>
                    <div class="highlight-text">neuroplastic event in adult life</div>
                </div>
            </div>
            
            <div class="brain-visual">
                <img src="/api/placeholder/500/400" alt="Brain scan showing maternal changes" style="width: 100%; border-radius: 1rem;" />
                <p style="text-align: center; color: #64748b; margin-top: 1rem; font-size: 0.875rem;">
                    Actual brain scans showing maternal brain changes<br/>
                    <em>Source: Nature Neuroscience, 2016</em>
                </p>
            </div>
        </div>
        
        <div class="key-point">
            <strong>Key Insight:</strong> The fog, forgetfulness, and hypervigilance are features, not bugs. Your brain is prioritizing your baby's survival.
        </div>
    </div>
    
    <!-- SLIDE -->
    <!-- SLIDE 2 -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-number">2</div>
            <h1 class="slide-title">The Hormone Cliff You Just Survived</h1>
        </div>
        
        <div class="hormone-chart">
            <div class="content-grid">
                <div class="hormone-box estrogen">
                    <span class="hormone-number">1000x</span>
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">Estrogen drop in 3 days</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Equivalent to: Menopause compressed into 72 hours</div>
                </div>
                
                <div class="hormone-box progesterone">
                    <span class="hormone-number">100x</span>
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">Progesterone drop in 3 days</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Effects: Anxiety, insomnia, mood swings</div>
                </div>
            </div>
        </div>
        
        <div class="key-point" style="background: #e8f5e9; border-color: #4caf50;">
            <strong>Normalize This:</strong> If you feel like you're on an emotional rollercoaster, you are. This is the largest hormone shift in human experience. You're not weak - you're adapting to a biochemical earthquake.
        </div>
    </div>
    
    <!-- SLIDE -->
    <!-- SLIDE 3 -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-number">3</div>
            <h1 class="slide-title">Inside Your Maternal Brain</h1>
        </div>
        
        <div class="brain-changes">
            <div class="brain-card amygdala">
                <h3>Amygdala: +20% Reactive</h3>
                <p>Every sound wakes you - peak vigilance at 3-4 months</p>
                <p style="font-size: 0.875rem; font-style: italic; opacity: 0.8;">Purpose: Enhanced threat detection for infant safety</p>
            </div>
            
            <div class="brain-card prefrontal">
                <h3>Prefrontal Cortex: 60% Capacity</h3>
                <p>Decision fatigue is real - recovers over 6-12 months</p>
                <p style="font-size: 0.875rem; font-style: italic; opacity: 0.8;">Why: Resources redirected to intuition and bonding</p>
            </div>
            
            <div class="brain-card new-growth">
                <h3>New Superpowers Growing</h3>
                <p>Enhanced empathy, intuition, and bonding circuits</p>
                <p style="font-size: 0.875rem; font-style: italic; opacity: 0.8;">Timeline: Continues developing for 2+ years</p>
            </div>
        </div>
        
        <div class="key-point" style="background: #fff3cd; border-color: #ffc107;">
            <strong>Key Insight:</strong> You're not losing your mind - you're growing a new one. This is temporary reorganization for permanent superpowers.
        </div>
    </div>
</body>
</html>`;

    // Update the lesson
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ slides_html: properSlides })
      .eq('id', lesson.id);

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      return;
    }

    console.log('✅ Successfully restored properly formatted slides!');
    console.log('📊 The slides now have:');
    console.log('   - Proper HTML structure with styles');
    console.log('   - Three distinct slides with correct formatting');
    console.log('   - Visual placeholders that match the original design');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

restoreProperSlides();