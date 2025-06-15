const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSlideImages() {
  try {
    console.log('🔄 Updating Week 1 Lesson 1 slide images...\n');

    // First, get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return;
    }

    // Get Week 1 module
    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', course.id)
      .eq('week_number', 1)
      .single();

    if (moduleError) {
      console.error('Error fetching module:', moduleError);
      return;
    }

    // Get Lesson 1
    const { data: lesson, error: lessonError } = await supabase
      .from('course_lessons')
      .select('id, slides_html')
      .eq('module_id', module.id)
      .eq('lesson_number', 1)
      .single();

    if (lessonError) {
      console.error('Error fetching lesson:', lessonError);
      return;
    }

    console.log('✅ Found Week 1, Lesson 1');
    console.log(`📄 Current slides length: ${lesson.slides_html?.length || 0} characters\n`);

    // Create updated slides with proper images
    let updatedSlides = lesson.slides_html;

    // Replace placeholder image with brain scan
    const brainScanReplacement = updatedSlides.replace(
      '<img src="/api/placeholder/500/400" alt="Brain scan showing maternal changes"',
      '<img src="/images/course/week1/brain-scan-maternal-changes.jpg" alt="Brain scan showing maternal changes - 6% gray matter reorganization visible in regions responsible for empathy and threat detection"'
    );

    // Replace canvas with static hormone chart SVG
    const hormoneChartReplacement = brainScanReplacement.replace(
      '<canvas id="hormoneChart" style="width: 100%; height: 400px;"></canvas>',
      `<div style="width: 100%; height: 400px; background: white; border-radius: 10px; padding: 20px; position: relative;">
        <svg viewBox="0 0 800 400" style="width: 100%; height: 100%;">
          <!-- Title -->
          <text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#2c3e50">
            The 72-Hour Hormone Cliff
          </text>
          
          <!-- Grid -->
          <g stroke="#e0e0e0" stroke-width="1">
            <!-- Horizontal lines -->
            <line x1="80" y1="350" x2="720" y2="350" />
            <line x1="80" y1="280" x2="720" y2="280" stroke-dasharray="5,5" />
            <line x1="80" y1="210" x2="720" y2="210" stroke-dasharray="5,5" />
            <line x1="80" y1="140" x2="720" y2="140" stroke-dasharray="5,5" />
            <line x1="80" y1="70" x2="720" y2="70" />
            
            <!-- Vertical lines -->
            <line x1="80" y1="70" x2="80" y2="350" />
            <line x1="720" y1="70" x2="720" y2="350" />
          </g>
          
          <!-- Axis labels -->
          <text x="40" y="75" text-anchor="middle" font-size="14" fill="#666">100%</text>
          <text x="40" y="145" text-anchor="middle" font-size="14" fill="#666">75%</text>
          <text x="40" y="215" text-anchor="middle" font-size="14" fill="#666">50%</text>
          <text x="40" y="285" text-anchor="middle" font-size="14" fill="#666">25%</text>
          <text x="40" y="355" text-anchor="middle" font-size="14" fill="#666">0%</text>
          
          <text x="80" y="380" text-anchor="middle" font-size="14" fill="#666">Birth</text>
          <text x="400" y="380" text-anchor="middle" font-size="14" fill="#666">Day 1</text>
          <text x="560" y="380" text-anchor="middle" font-size="14" fill="#666">Day 2</text>
          <text x="720" y="380" text-anchor="middle" font-size="14" fill="#666">Day 3</text>
          
          <!-- Estrogen drop (red line) -->
          <path d="M 80 70 Q 200 75 280 120 Q 400 200 560 300 T 720 340" 
                fill="none" stroke="#dc2626" stroke-width="4" />
          
          <!-- Progesterone drop (blue line) -->
          <path d="M 80 90 Q 200 95 280 140 Q 400 220 560 280 T 720 320" 
                fill="none" stroke="#2563eb" stroke-width="4" />
          
          <!-- Drop indicators -->
          <g>
            <!-- Estrogen drop annotation -->
            <line x1="300" y1="120" x2="350" y2="90" stroke="#dc2626" stroke-width="2" />
            <text x="355" y="85" font-size="16" font-weight="bold" fill="#dc2626">1000x drop</text>
            
            <!-- Progesterone drop annotation -->
            <line x1="300" y1="140" x2="350" y2="170" stroke="#2563eb" stroke-width="2" />
            <text x="355" y="175" font-size="16" font-weight="bold" fill="#2563eb">100x drop</text>
          </g>
          
          <!-- Legend -->
          <g transform="translate(550, 90)">
            <rect x="0" y="0" width="30" height="4" fill="#dc2626" />
            <text x="35" y="5" font-size="16" fill="#333">Estrogen</text>
            
            <rect x="0" y="20" width="30" height="4" fill="#2563eb" />
            <text x="35" y="25" font-size="16" fill="#333">Progesterone</text>
          </g>
        </svg>
      </div>`
    );

    // Replace placeholder with 3D brain model
    const brainModelReplacement = hormoneChartReplacement.replace(
      '<img src="/api/placeholder/500/500" alt="3D brain model"',
      '<img src="/images/course/week1/brain-regions-diagram.png" alt="3D brain model showing key regions affected during postpartum: amygdala (threat detection), prefrontal cortex (executive function), and hippocampus (memory)"'
    );

    // Update the lesson with new slides
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ slides_html: brainModelReplacement })
      .eq('id', lesson.id);

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      return;
    }

    console.log('✅ Successfully updated slide images!');
    console.log('\n📋 Updated placeholders:');
    console.log('  1. Brain scan placeholder → /images/course/week1/brain-scan-maternal-changes.jpg');
    console.log('  2. Canvas hormone chart → Static SVG hormone chart');
    console.log('  3. 3D brain model placeholder → /images/course/week1/brain-regions-diagram.png');
    
    console.log('\n⚠️  Note: Make sure to upload the actual images to:');
    console.log('  - /public/images/course/week1/brain-scan-maternal-changes.jpg');
    console.log('  - /public/images/course/week1/brain-regions-diagram.png');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the update
updateSlideImages();