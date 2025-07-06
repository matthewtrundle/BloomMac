#!/bin/bash

# Staging Environment Setup Script
# This script helps you set up a staging environment that mirrors production

set -e  # Exit on error

echo "🚀 Bloom Staging Environment Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Production credentials (already known)
PROD_DB="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Step 1: Prompt for staging credentials
echo -e "${BLUE}Step 1: Staging Project Setup${NC}"
echo "Please create a new Supabase project for staging at: https://supabase.com/dashboard"
echo "Name it something like 'bloom-staging' and choose us-east-2 region"
echo ""
read -p "Enter your staging project ID (the part before .supabase.co): " STAGING_PROJECT_ID
read -sp "Enter your staging database password: " STAGING_PASSWORD
echo ""
read -p "Enter your staging anon key: " STAGING_ANON_KEY
read -p "Enter your staging service role key: " STAGING_SERVICE_KEY

# Construct staging database URL
STAGING_DB="postgresql://postgres.${STAGING_PROJECT_ID}:${STAGING_PASSWORD}@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Step 2: Create backup directory
echo -e "\n${BLUE}Step 2: Creating backup directory${NC}"
mkdir -p staging-setup-backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Step 3: Dump production schema
echo -e "\n${BLUE}Step 3: Dumping production schema${NC}"
echo "This may take a few minutes..."

pg_dump "$PROD_DB" \
  --schema-only \
  --no-owner \
  --no-acl \
  --schema=public \
  --schema=auth \
  --schema=storage \
  > staging-setup-backups/production-schema-${TIMESTAMP}.sql

echo -e "${GREEN}✅ Schema dump complete${NC}"

# Step 4: Clean up schema for staging
echo -e "\n${BLUE}Step 4: Preparing schema for staging${NC}"
sed -e 's/OWNER TO postgres/OWNER TO postgres/g' \
    -e '/^GRANT.*TO "supabase_admin"/d' \
    -e '/^GRANT.*TO "supabase_auth_admin"/d' \
    -e '/^GRANT.*TO "supabase_storage_admin"/d' \
    staging-setup-backups/production-schema-${TIMESTAMP}.sql > staging-setup-backups/staging-schema-${TIMESTAMP}.sql

# Step 5: Apply schema to staging
echo -e "\n${BLUE}Step 5: Applying schema to staging${NC}"
echo -e "${YELLOW}⚠️  This will create all tables and functions in your staging database${NC}"
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    psql "$STAGING_DB" < staging-setup-backups/staging-schema-${TIMESTAMP}.sql
    echo -e "${GREEN}✅ Schema applied successfully${NC}"
else
    echo -e "${RED}❌ Schema application cancelled${NC}"
    exit 1
fi

# Step 6: Copy essential data
echo -e "\n${BLUE}Step 6: Copying essential data${NC}"
echo "Copying non-sensitive lookup data..."

# Tables with essential data (no user data)
ESSENTIAL_TABLES=(
    "courses"
    "course_modules"
    "course_lessons"
    "email_templates"
    "appointment_types"
    "blog_posts"
    "blog_categories"
    "faq_items"
    "faq_categories"
)

for table in "${ESSENTIAL_TABLES[@]}"; do
    echo -n "Copying $table... "
    pg_dump "$PROD_DB" \
        --data-only \
        --table=$table \
        2>/dev/null | psql "$STAGING_DB" 2>/dev/null && echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}skipped${NC}"
done

# Step 7: Create environment file
echo -e "\n${BLUE}Step 7: Creating staging environment file${NC}"
cat > .env.staging << EOF
# Staging Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://${STAGING_PROJECT_ID}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${STAGING_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${STAGING_SERVICE_KEY}

# Use test mode for external services
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_TEST_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY

# Email service in test mode
RESEND_API_KEY=re_test_YOUR_TEST_KEY

# Other services
NEXT_PUBLIC_ENVIRONMENT=staging
EOF

echo -e "${GREEN}✅ Environment file created${NC}"

# Step 8: Update package.json scripts
echo -e "\n${BLUE}Step 8: Updating package.json scripts${NC}"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['dev:staging'] = 'cp .env.staging .env.local && next dev';
pkg.scripts['build:staging'] = 'cp .env.staging .env.local && next build';
pkg.scripts['test:staging'] = 'cp .env.staging .env.local && npm test';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Scripts updated');
"

# Step 9: Create test data script
echo -e "\n${BLUE}Step 9: Creating test data script${NC}"
cat > scripts/create-staging-test-data.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.staging' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestData() {
  console.log('🧪 Creating test data for staging...\n');

  // Create test users
  const testUsers = [
    { email: 'admin@staging.bloom.com', password: 'StageTest123!', role: 'admin' },
    { email: 'user1@staging.bloom.com', password: 'StageTest123!', role: 'user' },
    { email: 'user2@staging.bloom.com', password: 'StageTest123!', role: 'user' },
  ];

  for (const user of testUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { role: user.role }
    });

    if (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`✅ Created test user: ${user.email}`);
    }
  }

  console.log('\n✨ Test data creation complete!');
  console.log('Test credentials saved to: staging-test-credentials.txt');
  
  // Save credentials
  const credentials = testUsers.map(u => `${u.email} / ${u.password}`).join('\n');
  require('fs').writeFileSync('staging-test-credentials.txt', credentials);
}

createTestData().catch(console.error);
EOF

# Step 10: Create staging sync script
echo -e "\n${BLUE}Step 10: Creating sync script${NC}"
cat > scripts/sync-staging-with-production.sh << 'EOF'
#!/bin/bash

# Sync staging database with production schema changes

echo "🔄 Syncing staging with production..."

PROD_DB="${PROD_DB}"
STAGING_DB="${STAGING_DB}"

# Dump production schema
pg_dump "$PROD_DB" \
  --schema-only \
  --no-owner \
  --no-acl \
  --schema=public \
  > temp-prod-schema.sql

# Dump staging schema
pg_dump "$STAGING_DB" \
  --schema-only \
  --no-owner \
  --no-acl \
  --schema=public \
  > temp-staging-schema.sql

# Compare schemas
diff temp-prod-schema.sql temp-staging-schema.sql > schema-diff.txt

if [ -s schema-diff.txt ]; then
  echo "📝 Schema differences found. Review schema-diff.txt"
else
  echo "✅ Schemas are in sync!"
fi

rm temp-prod-schema.sql temp-staging-schema.sql
EOF

chmod +x scripts/sync-staging-with-production.sh

# Step 11: Final setup
echo -e "\n${BLUE}Step 11: Final setup${NC}"
echo -e "${GREEN}✅ Staging environment setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev:staging' to start development with staging database"
echo "2. Run 'node scripts/create-staging-test-data.js' to create test users"
echo "3. Test all features in staging before deploying to production"
echo ""
echo "🔧 Useful commands:"
echo "  npm run dev:staging     - Start dev server with staging DB"
echo "  npm run build:staging   - Build with staging config"
echo "  npm run test:staging    - Run tests against staging"
echo ""
echo -e "${YELLOW}⚠️  Remember: Never use production data in staging!${NC}"

# Save configuration
cat > staging-config.json << EOF
{
  "projectId": "${STAGING_PROJECT_ID}",
  "created": "${TIMESTAMP}",
  "region": "us-east-2"
}
EOF

echo -e "\n${GREEN}🎉 Staging setup complete!${NC}"