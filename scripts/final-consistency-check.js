const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalConsistencyCheck() {
  console.log('🔍 FINAL DATABASE CONSISTENCY CHECK\n');
  console.log('=' .repeat(50) + '\n');
  
  const issues = [];
  const verified = [];
  
  // 1. Check critical missing table
  console.log('1️⃣ Checking for missing lesson_progress table...');
  const { error: lessonProgressError } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true });
  
  if (lessonProgressError && lessonProgressError.code === '42P01') {
    console.log('❌ lesson_progress table is MISSING');
    issues.push({
      type: 'MISSING_TABLE',
      table: 'lesson_progress',
      impact: 'Course completion tracking will fail',
      usedBy: ['/api/course/[id]/stats', '/api/achievements/complete-lesson']
    });
  } else {
    console.log('✅ lesson_progress table exists');
    verified.push('lesson_progress table');
  }
  
  // 2. Check RPC functions
  console.log('\n2️⃣ Checking RPC functions...');
  const rpcFunctions = [
    'get_dashboard_data',
    'get_all_courses_progress', 
    'get_course_stats',
    'get_user_dashboard_data',
    'get_all_courses_with_user_progress',
    'get_user_course_stats',
    'get_analytics_dashboard',
    'submit_contact_form'
  ];
  
  for (const func of rpcFunctions) {
    try {
      // Try calling with minimal params
      const { error } = await supabase.rpc(func, { 
        user_id: '00000000-0000-0000-0000-000000000000',
        p_user_id: '00000000-0000-0000-0000-000000000000',
        course_id: 'test'
      });
      
      if (error && error.message.includes('not exist')) {
        console.log(`❌ RPC ${func} - MISSING`);
        issues.push({
          type: 'MISSING_RPC',
          function: func,
          impact: 'Feature dependent on this function will fail'
        });
      } else {
        console.log(`✅ RPC ${func} - EXISTS`);
        verified.push(`RPC: ${func}`);
      }
    } catch (err) {
      console.log(`⚠️  RPC ${func} - UNKNOWN (${err.message})`);
    }
  }
  
  // 3. Check empty but critical tables
  console.log('\n3️⃣ Checking table data status...');
  const criticalTables = [
    { name: 'course_enrollments', critical: true },
    { name: 'email_queue', critical: false },
    { name: 'admin_sessions', critical: false },
    { name: 'career_applications', critical: false },
    { name: 'user_lesson_progress', critical: true }
  ];
  
  for (const { name, critical } of criticalTables) {
    const { count, error } = await supabase
      .from(name)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${name} - ${error.message}`);
    } else if (count === 0) {
      console.log(`⚠️  ${name} - EXISTS but EMPTY (${critical ? 'CRITICAL' : 'OK'})`);
      if (critical) {
        issues.push({
          type: 'EMPTY_CRITICAL_TABLE',
          table: name,
          impact: 'Core functionality may not work without data'
        });
      }
    } else {
      console.log(`✅ ${name} - ${count} rows`);
      verified.push(`${name} (${count} rows)`);
    }
  }
  
  // 4. Test specific problematic queries
  console.log('\n4️⃣ Testing specific API queries...');
  
  // Test email check in registration
  console.log('Testing email lookup (registration)...');
  const { error: emailError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', 'test@example.com')
    .single();
  
  if (emailError && emailError.message.includes('column')) {
    console.log('⚠️  Confirmed: user_profiles has no email column (as expected)');
    verified.push('Email handling correct (in auth.users)');
  }
  
  // Test course progress aggregation
  console.log('\nTesting course progress query...');
  const { data: progressData, error: progressError } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', '00000000-0000-0000-0000-000000000000');
  
  if (!progressError) {
    console.log('✅ Course progress query works');
    verified.push('Course progress queries');
  }
  
  // 5. Check relationships
  console.log('\n5️⃣ Checking critical relationships...');
  
  // User profiles -> auth.users
  const { data: profileWithAuth } = await supabase
    .from('user_profiles')
    .select('id, first_name')
    .limit(1);
  
  if (profileWithAuth) {
    console.log('✅ user_profiles accessible');
    verified.push('user_profiles relationship');
  }
  
  // Course structure
  const { data: courseStructure } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      course_modules (
        id,
        title,
        course_lessons (
          id,
          title
        )
      )
    `)
    .limit(1);
  
  if (courseStructure && courseStructure.length > 0) {
    console.log('✅ Course structure relationships work');
    verified.push('Course -> Module -> Lesson relationships');
  }
  
  // Generate final report
  console.log('\n' + '=' .repeat(50));
  console.log('📊 FINAL CONSISTENCY REPORT\n');
  
  console.log(`✅ Verified Working: ${verified.length} items`);
  verified.forEach(item => console.log(`   - ${item}`));
  
  if (issues.length > 0) {
    console.log(`\n❌ Issues Found: ${issues.length}`);
    issues.forEach(issue => {
      console.log(`\n   ${issue.type}: ${issue.table || issue.function}`);
      console.log(`   Impact: ${issue.impact}`);
      if (issue.usedBy) {
        console.log(`   Used by: ${issue.usedBy.join(', ')}`);
      }
    });
    
    console.log('\n🔧 REQUIRED FIXES:\n');
    
    // Generate SQL for missing lesson_progress table
    if (issues.some(i => i.table === 'lesson_progress')) {
      console.log('-- Create missing lesson_progress table:');
      console.log(`CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL,
    lesson_id UUID NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own progress" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can update own progress" ON public.lesson_progress
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Service role full access" ON public.lesson_progress
    FOR ALL TO service_role USING (true) WITH CHECK (true);`);
    }
    
    // List missing RPC functions
    const missingRPCs = issues.filter(i => i.type === 'MISSING_RPC');
    if (missingRPCs.length > 0) {
      console.log('\n\n-- Missing RPC functions that need to be created:');
      missingRPCs.forEach(rpc => {
        console.log(`-- ${rpc.function}`);
      });
    }
  } else {
    console.log('\n🎉 NO ISSUES FOUND! Database is fully consistent with API expectations.');
  }
  
  console.log('\n' + '=' .repeat(50));
}

finalConsistencyCheck();