const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Import course content from existing files
async function loadCourseContent() {
  try {
    // Try to load the enhanced course content
    const contentPath = path.join(__dirname, '../lib/data/enhanced-course-content.ts');
    const content = await fs.readFile(contentPath, 'utf-8');
    
    // For now, we'll use the hardcoded structure
    // In production, you'd parse the TypeScript file or convert it to JSON
    return getHardcodedCourseContent();
  } catch (error) {
    console.log('Using hardcoded course content structure');
    return getHardcodedCourseContent();
  }
}

// Hardcoded course content structure based on existing data
function getHardcodedCourseContent() {
  return {
    weeks: [
      {
        number: 1,
        title: "Understanding Your Fourth Trimester",
        description: "Building awareness and foundation for your postpartum journey",
        objectives: [
          "Understand the concept of the fourth trimester",
          "Identify physical and emotional changes",
          "Create your personal support foundation"
        ],
        lessons: [
          {
            id: "week1-lesson1",
            number: 1,
            title: "Welcome to Your Fourth Trimester",
            description: "Understanding your new reality and creating a foundation for healing",
            duration: 8,
            hasSlides: true
          },
          {
            id: "week1-lesson2",
            number: 2,
            title: "Your Body's Wisdom - Recovery Reimagined",
            description: "Understanding physical recovery with compassion and realistic expectations",
            duration: 12,
            hasSlides: true
          },
          {
            id: "week1-lesson3",
            number: 3,
            title: "Emotional Alchemy - Transforming Difficult Feelings",
            description: "Navigate the full spectrum of motherhood emotions with wisdom and tools",
            duration: 14,
            hasSlides: true
          },
          {
            id: "week1-lesson4",
            number: 4,
            title: "Building Your Foundation",
            description: "Creating your personal support system for wellness",
            duration: 11,
            hasSlides: true
          }
        ]
      },
      {
        number: 2,
        title: "Nurturing Self-Compassion",
        description: "Developing kindness towards yourself during challenging moments",
        objectives: [
          "Practice self-compassion techniques",
          "Challenge perfectionist thinking",
          "Build emotional resilience"
        ],
        lessons: [
          {
            id: "week2-lesson1",
            number: 1,
            title: "The Power of Self-Compassion",
            description: "Understanding and practicing kindness towards yourself",
            duration: 10,
            hasSlides: false
          },
          {
            id: "week2-lesson2",
            number: 2,
            title: "Releasing Perfectionism",
            description: "Embracing good enough mothering",
            duration: 12,
            hasSlides: false
          },
          {
            id: "week2-lesson3",
            number: 3,
            title: "Building Emotional Resilience",
            description: "Tools for bouncing back from difficult moments",
            duration: 14,
            hasSlides: false
          },
          {
            id: "week2-lesson4",
            number: 4,
            title: "Creating Compassionate Boundaries",
            description: "Protecting your energy and wellbeing",
            duration: 11,
            hasSlides: false
          }
        ]
      },
      {
        number: 3,
        title: "Strengthening Relationships",
        description: "Navigating changes in your relationships",
        objectives: [
          "Improve partner communication",
          "Set healthy family boundaries",
          "Build support networks"
        ],
        lessons: [
          {
            id: "week3-lesson1",
            number: 1,
            title: "Partner Communication",
            description: "Strengthening your relationship during transition",
            duration: 12,
            hasSlides: false
          },
          {
            id: "week3-lesson2",
            number: 2,
            title: "Family Boundaries",
            description: "Creating healthy limits with extended family",
            duration: 10,
            hasSlides: false
          },
          {
            id: "week3-lesson3",
            number: 3,
            title: "Building Your Village",
            description: "Creating meaningful support networks",
            duration: 11,
            hasSlides: false
          },
          {
            id: "week3-lesson4",
            number: 4,
            title: "Intimacy and Connection",
            description: "Rediscovering closeness in new ways",
            duration: 13,
            hasSlides: false
          }
        ]
      },
      {
        number: 4,
        title: "Managing Anxiety & Overwhelm",
        description: "Practical tools for calming your nervous system",
        objectives: [
          "Understand postpartum anxiety",
          "Learn grounding techniques",
          "Develop coping strategies"
        ],
        lessons: [
          {
            id: "week4-lesson1",
            number: 1,
            title: "Understanding Postpartum Anxiety",
            description: "Recognizing and normalizing anxiety symptoms",
            duration: 11,
            hasSlides: false
          },
          {
            id: "week4-lesson2",
            number: 2,
            title: "Grounding Techniques",
            description: "Quick tools for calming your nervous system",
            duration: 9,
            hasSlides: false
          },
          {
            id: "week4-lesson3",
            number: 3,
            title: "Managing Intrusive Thoughts",
            description: "Understanding and coping with scary thoughts",
            duration: 13,
            hasSlides: false
          },
          {
            id: "week4-lesson4",
            number: 4,
            title: "Creating Calm Routines",
            description: "Building predictability and peace",
            duration: 10,
            hasSlides: false
          }
        ]
      },
      {
        number: 5,
        title: "Finding Your New Identity",
        description: "Integrating motherhood with your whole self",
        objectives: [
          "Explore identity changes",
          "Reconnect with personal values",
          "Create vision for future"
        ],
        lessons: [
          {
            id: "week5-lesson1",
            number: 1,
            title: "Who Am I Now?",
            description: "Exploring identity shifts in motherhood",
            duration: 12,
            hasSlides: false
          },
          {
            id: "week5-lesson2",
            number: 2,
            title: "Honoring Your Past Self",
            description: "Grieving and celebrating who you were",
            duration: 11,
            hasSlides: false
          },
          {
            id: "week5-lesson3",
            number: 3,
            title: "Discovering Your Values",
            description: "What matters most in this season",
            duration: 10,
            hasSlides: false
          },
          {
            id: "week5-lesson4",
            number: 4,
            title: "Creating Your Vision",
            description: "Imagining your future with hope",
            duration: 13,
            hasSlides: false
          }
        ]
      },
      {
        number: 6,
        title: "Moving Forward with Confidence",
        description: "Integration and sustainable wellness practices",
        objectives: [
          "Create sustainable self-care",
          "Build confidence as a mother",
          "Plan for ongoing wellness"
        ],
        lessons: [
          {
            id: "week6-lesson1",
            number: 1,
            title: "Sustainable Self-Care",
            description: "Creating practices that actually work",
            duration: 10,
            hasSlides: false
          },
          {
            id: "week6-lesson2",
            number: 2,
            title: "Trusting Your Instincts",
            description: "Building confidence in your mothering",
            duration: 11,
            hasSlides: false
          },
          {
            id: "week6-lesson3",
            number: 3,
            title: "Celebrating Your Growth",
            description: "Acknowledging how far you've come",
            duration: 9,
            hasSlides: false
          },
          {
            id: "week6-lesson4",
            number: 4,
            title: "Your Wellness Plan",
            description: "Creating your ongoing support system",
            duration: 12,
            hasSlides: false
          }
        ]
      }
    ]
  };
}

// Load HTML slides from files
async function loadSlidesContent(weekNumber, lessonNumber) {
  try {
    const slidesPath = path.join(
      __dirname,
      '../course-materials',
      `week${weekNumber}-slides-lesson${lessonNumber}.html`
    );
    
    const content = await fs.readFile(slidesPath, 'utf-8');
    console.log(`  ✓ Loaded slides for Week ${weekNumber}, Lesson ${lessonNumber}`);
    return content;
  } catch (error) {
    console.log(`  - No slides found for Week ${weekNumber}, Lesson ${lessonNumber}`);
    return null;
  }
}

// Main migration function
async function migrateCourseContent() {
  console.log('🚀 Starting course content migration...\n');
  
  try {
    // 1. Check if course exists
    console.log('1. Checking for existing course...');
    let { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
    
    if (courseError || !course) {
      console.log('   Course not found. Creating new course...');
      
      // Create the course
      const { data: newCourse, error: createError } = await supabase
        .from('courses')
        .insert({
          slug: 'postpartum-wellness-foundations',
          title: 'Postpartum Wellness Foundations',
          subtitle: 'Your 6-Week Journey to Emotional Balance',
          description: 'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life with confidence and clarity.',
          price: 197,
          original_price: 297,
          duration: '6 weeks',
          total_modules: 6,
          total_lessons: 24,
          image_url: '/images/courses/postpartum-wellness.jpg',
          instructor_name: 'Dr. Jana Rundle',
          instructor_credentials: 'Licensed Therapist, Perinatal Mental Health Specialist',
          features: [
            'Weekly video lessons with Dr. Jana',
            'Downloadable workbooks and exercises',
            'Audio meditations for busy moms',
            'Lifetime access to materials',
            'Certificate of completion'
          ],
          learning_outcomes: [
            'Understand and normalize your postpartum emotions',
            'Build practical coping strategies for daily challenges',
            'Create sustainable self-care routines',
            'Strengthen your support system and relationships'
          ],
          is_active: true,
          is_featured: true
        })
        .select()
        .single();
      
      if (createError) throw createError;
      course = newCourse;
      console.log('   ✓ Course created successfully');
    } else {
      console.log('   ✓ Course found:', course.title);
    }
    
    // 2. Load course content
    console.log('\n2. Loading course content structure...');
    const courseContent = await loadCourseContent();
    console.log('   ✓ Loaded', courseContent.weeks.length, 'weeks of content');
    
    // 3. Migrate modules and lessons
    console.log('\n3. Migrating course modules and lessons...');
    
    for (const week of courseContent.weeks) {
      console.log(`\n   Week ${week.number}: ${week.title}`);
      
      // Check if module exists
      let { data: module } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', course.id)
        .eq('week_number', week.number)
        .single();
      
      if (!module) {
        // Create module
        const { data: newModule, error: moduleError } = await supabase
          .from('course_modules')
          .insert({
            course_id: course.id,
            week_number: week.number,
            title: week.title,
            description: week.description,
            objectives: week.objectives || [],
            order_index: week.number - 1,
            is_published: true
          })
          .select()
          .single();
        
        if (moduleError) throw moduleError;
        module = newModule;
        console.log('   ✓ Module created');
      } else {
        console.log('   - Module already exists');
      }
      
      // Migrate lessons
      for (const lesson of week.lessons) {
        // Check if lesson exists
        const { data: existingLesson } = await supabase
          .from('course_lessons')
          .select('id')
          .eq('module_id', module.id)
          .eq('lesson_number', lesson.number)
          .single();
        
        if (!existingLesson) {
          // Load slides content if available
          const slidesHtml = lesson.hasSlides 
            ? await loadSlidesContent(week.number, lesson.number)
            : null;
          
          // Create lesson
          const { error: lessonError } = await supabase
            .from('course_lessons')
            .insert({
              module_id: module.id,
              lesson_number: lesson.number,
              title: lesson.title,
              description: lesson.description,
              video_duration_minutes: lesson.duration,
              slides_html: slidesHtml,
              order_index: lesson.number - 1,
              is_published: true,
              is_preview: lesson.number === 1 // First lesson is preview
            });
          
          if (lessonError) throw lessonError;
          console.log(`     ✓ Lesson ${lesson.number}: ${lesson.title}`);
        } else {
          console.log(`     - Lesson ${lesson.number} already exists`);
        }
      }
    }
    
    // 4. Update course statistics
    console.log('\n4. Updating course statistics...');
    const { data: stats } = await supabase
      .from('course_overview')
      .select('module_count, lesson_count')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
    
    if (stats) {
      console.log(`   ✓ Course now has ${stats.module_count} modules and ${stats.lesson_count} lessons`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test the course viewing pages to ensure content loads correctly');
    console.log('2. Update the course viewing components to use database content');
    console.log('3. Test the admin course management interface at /admin/courses');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the migration
console.log('Course Content Migration Tool');
console.log('============================\n');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease ensure these are set in your .env.local file');
  process.exit(1);
}

migrateCourseContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });