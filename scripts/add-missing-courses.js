const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const coursesData = [
  {
    slug: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    subtitle: 'Practical Tools for Peace of Mind',
    description: 'Learn evidence-based techniques to manage postpartum anxiety and worry, specifically designed for the unique challenges of new motherhood.',
    long_description: 'This comprehensive 4-week program provides new mothers with practical, evidence-based strategies to manage anxiety and worry. Through weekly video lessons, interactive exercises, and downloadable resources, you\'ll learn techniques that fit into your busy life as a new mom.',
    price: 127,
    original_price: 197,
    duration: '4 weeks',
    total_modules: 4,
    total_lessons: 16,
    total_duration_minutes: 240,
    instructor_name: 'Dr. Jana Rundle',
    instructor_credentials: 'Licensed Therapist, Perinatal Mental Health Specialist',
    features: [
      'Weekly technique tutorials',
      'Anxiety tracking tools',
      'Quick relief exercises',
      'Emergency coping cards',
      'Progress tracking journal'
    ],
    learning_outcomes: [
      'Reduce anxiety symptoms',
      'Master calming techniques',
      'Build confidence',
      'Sleep better'
    ],
    bonus_materials: [
      'Anxiety Emergency Toolkit',
      'Partner Communication Guide',
      'Sleep Hygiene Checklist'
    ],
    is_active: true,
    is_featured: false,
    sort_order: 1
  },
  {
    slug: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    subtitle: 'For Partners Who Want to Help',
    description: 'Equip partners with the knowledge and skills to provide meaningful support during the postpartum period.',
    long_description: 'This 2-week intensive bootcamp is designed specifically for partners who want to provide effective support during the postpartum period. Learn to recognize symptoms, communicate effectively, and take practical action to support your partner\'s mental health.',
    price: 97,
    original_price: 147,
    duration: '2 weeks',
    total_modules: 2,
    total_lessons: 8,
    total_duration_minutes: 120,
    instructor_name: 'Dr. Jana Rundle',
    instructor_credentials: 'Licensed Therapist, Perinatal Mental Health Specialist',
    features: [
      'Short, practical video lessons',
      'Communication scripts',
      'Warning signs checklist',
      'Support action plans',
      'Partner discussion guides'
    ],
    learning_outcomes: [
      'Recognize postpartum symptoms',
      'Communicate effectively',
      'Provide practical support',
      'Know when to seek help'
    ],
    bonus_materials: [
      'Quick Reference Guide',
      'Emergency Contact List Template',
      'Daily Support Checklist'
    ],
    is_active: true,
    is_featured: false,
    sort_order: 2
  }
];

const modulesData = {
  'anxiety-management-new-moms': [
    {
      week_number: 1,
      title: 'Understanding Postpartum Anxiety',
      description: 'Learn about the nature of postpartum anxiety and how it affects new mothers.',
      objectives: [
        'Identify symptoms of postpartum anxiety',
        'Understand triggers and patterns',
        'Learn the difference between normal worry and anxiety'
      ],
      order_index: 1,
      is_published: true,
      lessons: [
        { lesson_number: 1, title: 'What is Postpartum Anxiety?', description: 'Understanding the basics of postpartum anxiety', video_duration_minutes: 15 },
        { lesson_number: 2, title: 'Common Triggers and Symptoms', description: 'Identifying your personal anxiety patterns', video_duration_minutes: 12 },
        { lesson_number: 3, title: 'The Science Behind Anxiety', description: 'How anxiety affects your brain and body', video_duration_minutes: 10 },
        { lesson_number: 4, title: 'Creating Your Anxiety Map', description: 'Tracking and understanding your anxiety', video_duration_minutes: 15 }
      ]
    },
    {
      week_number: 2,
      title: 'Calming Techniques That Work',
      description: 'Master evidence-based techniques for managing anxiety in the moment.',
      objectives: [
        'Learn breathing techniques',
        'Practice grounding exercises',
        'Build a personal toolkit'
      ],
      order_index: 2,
      is_published: true,
      lessons: [
        { lesson_number: 5, title: 'The Power of Breath', description: 'Breathing techniques for instant calm', video_duration_minutes: 15 },
        { lesson_number: 6, title: 'Grounding in the Present', description: '5-4-3-2-1 and other grounding techniques', video_duration_minutes: 12 },
        { lesson_number: 7, title: 'Progressive Muscle Relaxation', description: 'Release tension from your body', video_duration_minutes: 15 },
        { lesson_number: 8, title: 'Quick Calm Techniques', description: 'Tools for when you only have 2 minutes', video_duration_minutes: 10 }
      ]
    },
    {
      week_number: 3,
      title: 'Changing Anxious Thoughts',
      description: 'Learn cognitive techniques to challenge and change anxiety-producing thoughts.',
      objectives: [
        'Identify thought patterns',
        'Challenge anxious thoughts',
        'Build new thinking habits'
      ],
      order_index: 3,
      is_published: true,
      lessons: [
        { lesson_number: 9, title: 'Catching Anxious Thoughts', description: 'Becoming aware of your thought patterns', video_duration_minutes: 15 },
        { lesson_number: 10, title: 'The Worry Window Technique', description: 'Managing intrusive worries', video_duration_minutes: 12 },
        { lesson_number: 11, title: 'Fact vs. Fear', description: 'Challenging catastrophic thinking', video_duration_minutes: 15 },
        { lesson_number: 12, title: 'Building Balanced Thoughts', description: 'Creating realistic perspectives', video_duration_minutes: 12 }
      ]
    },
    {
      week_number: 4,
      title: 'Building Long-Term Resilience',
      description: 'Create sustainable practices for managing anxiety over time.',
      objectives: [
        'Develop daily routines',
        'Build support systems',
        'Create emergency plans'
      ],
      order_index: 4,
      is_published: true,
      lessons: [
        { lesson_number: 13, title: 'Daily Anxiety Prevention', description: 'Routines that reduce anxiety', video_duration_minutes: 15 },
        { lesson_number: 14, title: 'Sleep and Anxiety', description: 'Breaking the anxiety-insomnia cycle', video_duration_minutes: 15 },
        { lesson_number: 15, title: 'Building Your Support Network', description: 'Getting help when you need it', video_duration_minutes: 12 },
        { lesson_number: 16, title: 'Your Anxiety Action Plan', description: 'Creating your personalized toolkit', video_duration_minutes: 15 }
      ]
    }
  ],
  'partner-support-bootcamp': [
    {
      week_number: 1,
      title: 'Understanding the Postpartum Experience',
      description: 'Learn what your partner is experiencing physically and emotionally.',
      objectives: [
        'Understand postpartum changes',
        'Recognize warning signs',
        'Learn when to seek help'
      ],
      order_index: 1,
      is_published: true,
      lessons: [
        { lesson_number: 1, title: 'The Fourth Trimester Explained', description: 'What happens after birth', video_duration_minutes: 15 },
        { lesson_number: 2, title: 'Normal vs. Concerning Signs', description: 'When to worry and when to wait', video_duration_minutes: 15 },
        { lesson_number: 3, title: 'Understanding Mood Changes', description: 'Baby blues, anxiety, and depression', video_duration_minutes: 15 },
        { lesson_number: 4, title: 'Your Role as a Partner', description: 'How to be truly helpful', video_duration_minutes: 15 }
      ]
    },
    {
      week_number: 2,
      title: 'Practical Support Strategies',
      description: 'Learn specific actions you can take to support your partner.',
      objectives: [
        'Master communication skills',
        'Provide practical help',
        'Build connection'
      ],
      order_index: 2,
      is_published: true,
      lessons: [
        { lesson_number: 5, title: 'Communication That Helps', description: 'What to say and what to avoid', video_duration_minutes: 15 },
        { lesson_number: 6, title: 'Taking Action at Home', description: 'Practical ways to lighten the load', video_duration_minutes: 15 },
        { lesson_number: 7, title: 'Supporting Without Fixing', description: 'Being present vs. problem-solving', video_duration_minutes: 15 },
        { lesson_number: 8, title: 'Creating Your Support Plan', description: 'Your personalized action guide', video_duration_minutes: 15 }
      ]
    }
  ]
};

async function addCourses() {
  console.log('=== ADDING MISSING COURSES ===\n');
  
  for (const courseData of coursesData) {
    try {
      console.log(`Adding course: ${courseData.title}`);
      
      // Insert course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();
        
      if (courseError) {
        console.error(`Error adding course ${courseData.title}:`, courseError);
        continue;
      }
      
      console.log(`✅ Course added with ID: ${course.id}`);
      
      // Add modules for this course
      const modules = modulesData[courseData.slug];
      if (modules) {
        for (const moduleData of modules) {
          const { lessons, ...moduleInfo } = moduleData;
          
          // Insert module
          const { data: module, error: moduleError } = await supabase
            .from('course_modules')
            .insert({
              ...moduleInfo,
              course_id: course.id
            })
            .select()
            .single();
            
          if (moduleError) {
            console.error(`Error adding module ${moduleInfo.title}:`, moduleError);
            continue;
          }
          
          console.log(`  ✅ Module added: Week ${moduleInfo.week_number} - ${moduleInfo.title}`);
          
          // Add lessons for this module
          if (lessons && lessons.length > 0) {
            const lessonsData = lessons.map((lesson, index) => ({
              ...lesson,
              module_id: module.id,
              order_index: index + 1,
              is_preview: lesson.lesson_number === 1, // First lesson is preview
              is_published: true,
              slides_html: '', // Will be populated later
              video_url: '', // Will be populated later
              transcript: '',
              script_notes: '',
              resources: []
            }));
            
            const { error: lessonsError } = await supabase
              .from('course_lessons')
              .insert(lessonsData);
              
            if (lessonsError) {
              console.error(`Error adding lessons:`, lessonsError);
            } else {
              console.log(`    ✅ ${lessons.length} lessons added`);
            }
          }
        }
      }
      
      console.log('');
    } catch (error) {
      console.error(`Error processing course ${courseData.title}:`, error);
    }
  }
  
  console.log('=== COURSE ADDITION COMPLETE ===');
}

addCourses().catch(console.error);