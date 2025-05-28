const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminTables() {
  console.log('Creating admin tables...\n');

  // Note: Since we can't execute raw SQL through the API, you'll need to run this SQL
  // directly in the Supabase SQL editor at:
  // https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/sql/new

  const sql = `
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Add updated_at trigger
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin Sessions Table for tracking active sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for session lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
`;

  console.log('Please run the following SQL in your Supabase SQL editor:');
  console.log('https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/sql/new\n');
  console.log('```sql');
  console.log(sql);
  console.log('```\n');
  
  // For now, let's create a default admin user using the API
  // First check if the table exists by trying to query it
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ Admin users table does not exist yet.');
      console.log('Please create it using the SQL above in Supabase dashboard.');
      return;
    }
    
    if (!error) {
      console.log('✅ Admin users table exists!');
      
      // Check if any admin exists
      if (!data || data.length === 0) {
        console.log('\nCreating default admin user...');
        
        // Use bcrypt directly since we're in a Node.js script
        const bcrypt = require('bcryptjs');
        const defaultPassword = 'bloom-admin-2024';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            email: 'jana@bloompsychologynorthaustin.com',
            password: hashedPassword,
            name: 'Jana Rundle',
            role: 'super_admin',
            is_active: true
          });
        
        if (insertError) {
          console.error('Error creating admin user:', insertError);
        } else {
          console.log('\n✅ Default admin user created!');
          console.log('Email: jana@bloompsychologynorthaustin.com');
          console.log('Password: bloom-admin-2024');
          console.log('\n⚠️  IMPORTANT: Change this password after first login!');
        }
      } else {
        console.log('Admin user already exists.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminTables();