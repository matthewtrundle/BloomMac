const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCourseTables() {
  try {
    console.log('Setting up course system tables...');

    // Read and execute the SQL schema
    const sqlPath = path.join(__dirname, '../supabase/create-course-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(statement => statement.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement.trim() 
        });

        if (error) {
          console.error('Error executing statement:', error);
          // Continue with other statements
        } else {
          console.log('✓ Statement executed successfully');
        }
      }
    }

    console.log('\n✅ Course system setup complete!');
    console.log('\nNext steps:');
    console.log('1. Test the course purchase flow at /courses');
    console.log('2. Verify email delivery is working');
    console.log('3. Test the My Courses portal at /my-courses');
    console.log('4. Set up Stripe for payment processing in production');

  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

// Add some sample course data
async function addSampleData() {
  try {
    console.log('\nAdding sample course enrollment for testing...');

    // Add a test user
    const testUser = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      password_hash: 'testpass123',
      temp_password: 'testpass123',
      status: 'active'
    };

    const { data: user, error: userError } = await supabase
      .from('course_users')
      .insert([testUser])
      .select()
      .single();

    if (userError && !userError.message.includes('duplicate')) {
      console.error('Error creating test user:', userError);
    } else {
      console.log('✓ Test user created');
    }

    // Add a test enrollment
    const testEnrollment = {
      course_id: 'postpartum-wellness-foundations',
      user_email: 'test@example.com',
      user_first_name: 'Test',
      user_last_name: 'User',
      enrolled_at: new Date().toISOString(),
      payment_status: 'completed',
      payment_amount: 197,
      access_granted: true
    };

    const { error: enrollmentError } = await supabase
      .from('course_enrollments')
      .insert([testEnrollment]);

    if (enrollmentError && !enrollmentError.message.includes('duplicate')) {
      console.error('Error creating test enrollment:', enrollmentError);
    } else {
      console.log('✓ Test enrollment created');
      console.log('\nTest credentials:');
      console.log('Email: test@example.com');
      console.log('Password: testpass123');
    }

  } catch (error) {
    console.error('Sample data error:', error);
  }
}

// Run setup
setupCourseTables().then(() => {
  if (process.argv.includes('--with-sample-data')) {
    return addSampleData();
  }
});