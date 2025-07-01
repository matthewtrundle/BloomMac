const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser() {
  const email = 'matthewtrundle@gmail.com';
  
  console.log(`Checking if user exists: ${email}\n`);

  // Check auth.users
  const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error checking auth users:', authError);
    return;
  }

  const userExists = authUser.users.some(u => u.email === email);
  
  if (userExists) {
    console.log('❌ User already exists in auth.users');
    const existingUser = authUser.users.find(u => u.email === email);
    console.log('User ID:', existingUser.id);
    console.log('Created:', new Date(existingUser.created_at).toLocaleString());
    
    // Check user_profiles
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', existingUser.id)
      .single();
      
    if (profile) {
      console.log('\nProfile exists:');
      console.log('- Name:', profile.first_name, profile.last_name);
      console.log('- Role:', profile.role);
      console.log('- Total Stars:', profile.total_stars);
    }
  } else {
    console.log('✅ User does not exist - you can sign up with this email!');
  }
  
  // Also check subscribers
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
    
  if (subscriber) {
    console.log('\n📧 Email exists in newsletter subscribers');
    console.log('- Status:', subscriber.status);
    console.log('- Subscribed:', new Date(subscriber.created_at).toLocaleString());
  }
}

checkUser().catch(console.error);