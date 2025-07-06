const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTemplates() {
  const { data, error } = await supabase
    .from('email_templates')
    .select('id, name, subject, category');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Email Templates:');
  data.forEach(template => {
    console.log(`- ${template.name}: "${template.subject}" (${template.category})`);
  });
}

checkTemplates();