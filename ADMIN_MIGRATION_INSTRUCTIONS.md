
# Admin Migration Instructions

## Step 1: Create Admin Tables

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of: /supabase/migrations/20250101_create_admin_tables.sql
5. Run the query
6. Verify success message

## Step 2: Set Up Initial Admin User

1. In SQL Editor, create another new query
2. Copy and paste the contents of: /supabase/migrations/20250101_create_initial_admin.sql
3. Run the query
4. Follow the instructions in the output to create your admin user

## Step 3: Update Your Admin Email

Run this in SQL Editor (replace with your email):
```sql
SELECT * FROM setup_initial_admin('your-admin@email.com');
```

## Step 4: After Creating User in Auth

Once you've created the user through Supabase Auth, run:
```sql
SELECT * FROM finalize_admin_setup('your-admin@email.com');
```

## Step 5: Verify Setup

Run the verification script:
```bash
node scripts/verify-admin-setup.js
```

## Important Notes

- The old hardcoded admin authentication will be disabled after migration
- All admin actions will be logged to admin_activity_log
- Email templates are created for automatic responses
- RLS policies ensure only authenticated admins can access admin data
