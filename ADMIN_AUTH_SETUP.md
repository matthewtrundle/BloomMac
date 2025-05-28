# Admin Authentication Setup

## ✅ What's Been Implemented

### 1. Authentication System
- JWT-based authentication with secure httpOnly cookies
- Password hashing with bcrypt
- 24-hour token expiration
- Session management

### 2. Protected Routes
All admin routes are now protected with authentication:
- `/admin/*` - All admin pages
- `/api/newsletter-admin` - Newsletter management API
- `/api/email-analytics` - Email analytics API
- `/api/email-automations` - Email automation API
- `/api/chat-analytics` - Chat analytics API
- `/api/backup` - Backup functionality

### 3. Login System
- Login page at `/admin/login`
- Secure password verification
- Automatic redirect after login
- Logout functionality with cookie clearing

### 4. Middleware Protection
- Next.js middleware automatically checks authentication
- Redirects unauthenticated users to login
- API routes return 401 for unauthorized access
- User info passed to API routes via headers

## 🔧 Setup Instructions

### 1. Create Database Tables

You need to create the admin tables in your Supabase database. Go to:
https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/sql/new

And run this SQL:

```sql
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
```

### 2. Create Default Admin User

After creating the tables, run:

```bash
node scripts/create-admin-tables.js
```

This will create a default admin user:
- Email: `jana@bloompsychologynorthaustin.com`
- Password: `bloom-admin-2024`

**⚠️ IMPORTANT: Change this password immediately after first login!**

### 3. Environment Variables

Add to your `.env.local`:

```env
JWT_SECRET=your-secure-jwt-secret-here
```

Generate a secure secret with:
```bash
openssl rand -base64 32
```

## 🔒 Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (12 rounds)
   - Never stored in plain text

2. **Token Security**
   - JWT tokens with expiration
   - httpOnly cookies (not accessible via JavaScript)
   - Secure flag in production (HTTPS only)

3. **Session Management**
   - Tokens expire after 24 hours
   - Last login tracking
   - IP address logging for admin activity

4. **Middleware Protection**
   - All admin routes require authentication
   - API routes check authentication headers
   - Invalid tokens automatically cleared

## 📝 Usage

### Login
Navigate to `/admin/login` and enter your credentials.

### Accessing Admin Pages
Once logged in, you can access:
- `/admin/analytics` - Analytics dashboard
- `/admin/email` - Email management
- `/admin/newsletter` - Newsletter subscribers
- etc.

### Logout
Click the "Logout" button in the admin header or navigate to any admin page and click logout.

## 🚨 Important Notes

1. **Change Default Password**: The default password must be changed immediately
2. **Secure JWT Secret**: Use a strong, random JWT secret in production
3. **HTTPS Required**: In production, ensure site uses HTTPS for secure cookies
4. **Regular Reviews**: Regularly review admin user access and remove inactive accounts

## 🔐 Adding New Admin Users

To add a new admin user, insert directly into the database:

```sql
INSERT INTO admin_users (email, password, name, role, is_active)
VALUES (
  'new@example.com',
  '$2a$12$...', -- Use bcrypt to hash the password
  'User Name',
  'admin',
  true
);
```

Or create an admin user management interface in the admin panel.

## ✅ Testing

1. Try accessing `/admin/analytics` without logging in - should redirect to login
2. Login with credentials
3. Verify you can access admin pages
4. Test logout functionality
5. Try accessing admin API endpoints without authentication - should return 401

The authentication system is now fully implemented and ready for use!