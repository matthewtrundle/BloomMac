const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');

// Local Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBasicFlow() {
  console.log(chalk.blue('\n🧪 Testing Basic User Flow\n'));
  
  // Create a test user
  const testEmail = `test-${Date.now()}@example.com`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!'
  });
  
  if (signUpError) {
    console.log(chalk.red('❌ Sign up failed:', signUpError.message));
    return;
  }
  
  console.log(chalk.green('✅ User created successfully'));
  const userId = signUpData.user.id;
  
  // Sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: 'TestPassword123!'
  });
  
  if (signInError) {
    console.log(chalk.red('❌ Sign in failed:', signInError.message));
    return;
  }
  
  console.log(chalk.green('✅ Signed in successfully'));
  
  // Check if profile was created
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.log(chalk.red('❌ Profile not found:', profileError.message));
  } else {
    console.log(chalk.green('✅ Profile exists:', profile));
  }
  
  // Test the API
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    try {
      const response = await fetch('http://localhost:3000/api/profile/get', {
        headers: {
          'Cookie': `sb-${SUPABASE_URL.replace('http://', '').replace('https://', '').split('.')[0]}-auth-token=${JSON.stringify({
            access_token: session.data.session.access_token,
            refresh_token: session.data.session.refresh_token
          })}`
        }
      });
      
      const data = await response.json();
      console.log('\nAPI Response:', response.status);
      console.log('API Data:', data);
    } catch (error) {
      console.error('API Error:', error);
    }
  }
  
  // Clean up
  await supabase.auth.signOut();
}

testBasicFlow().catch(console.error);