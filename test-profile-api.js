const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://utetcmirepwdxbtrcczv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXRjbWlyZXB3ZHhidHJjY3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODA5NzYsImV4cCI6MjA2Mzk1Njk3Nn0.n4btw4MPMgMhUz3VC4FBGXsYA11XW39nhK8l0x_Cc0Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileAccess() {
  console.log('Testing profile access...\n');

  // Test 1: Sign in with a test user
  const email = 'test@example.com';
  const password = 'test123456';
  
  console.log('1. Attempting to sign in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.log('Auth error:', authError.message);
    console.log('\nCreating test user...');
    
    // Try to create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (signUpError) {
      console.error('Failed to create user:', signUpError);
      return;
    }
    
    console.log('User created, signing in...');
    const { data: newAuth, error: newAuthError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (newAuthError) {
      console.error('Failed to sign in:', newAuthError);
      return;
    }
  }

  console.log('✓ Signed in successfully');
  const userId = authData?.user?.id || signUpData?.user?.id;
  console.log('User ID:', userId);

  // Test 2: Try to read user_profiles directly
  console.log('\n2. Testing direct database access to user_profiles...');
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.log('Profile error:', profileError.message);
    console.log('Error code:', profileError.code);
    
    if (profileError.code === 'PGRST116') {
      console.log('\nProfile doesn\'t exist, trying to create one...');
      
      // Try to insert a profile
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          first_name: 'Test',
          last_name: 'User'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Insert error:', insertError.message);
        console.error('Error details:', insertError.details);
      } else {
        console.log('✓ Profile created successfully:', newProfile);
      }
    }
  } else {
    console.log('✓ Profile found:', profileData);
  }

  // Test 3: Test the API endpoint
  console.log('\n3. Testing API endpoint...');
  const session = await supabase.auth.getSession();
  
  if (session.data.session) {
    try {
      const response = await fetch('http://localhost:3000/api/profile/get', {
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
          'Cookie': `sb-access-token=${session.data.session.access_token}; sb-refresh-token=${session.data.session.refresh_token}`
        }
      });
      
      const data = await response.json();
      console.log('API Response status:', response.status);
      console.log('API Response:', data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  }

  // Clean up
  await supabase.auth.signOut();
}

testProfileAccess().catch(console.error);