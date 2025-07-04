# PHASE 1: CRITICAL SECURITY FIXES - IMPLEMENTATION GUIDE

## Current Security Issues Found

### 1. Hardcoded Credentials in `/lib/auth.ts`
- **Line 6**: Weak JWT secret with default fallback
- **Line 97**: Hardcoded admin password: `bloom-admin-2024`
- **Line 103**: Hardcoded admin email: `admin@bloompsychologynorthaustin.com`

### 2. Environment Files Present
- `.env` (production - needs audit)
- `.env.local` (local dev)
- Scripts have separate `.env.local` file

## Step-by-Step Security Fix Implementation

### Step 1: Generate Secure Secrets (DO THIS NOW!)

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Generate secure admin password
openssl rand -base64 16

# Generate new Supabase service role key (from Supabase dashboard)
```

### Step 2: Update Environment Variables

Add these to your `.env` file (and `.env.local` for development):

```env
# Security Keys (REQUIRED - NO DEFAULTS!)
JWT_SECRET=<your-generated-64-char-secret>
ADMIN_INITIAL_EMAIL=jana@bloompsychologynorthaustin.com
ADMIN_INITIAL_PASSWORD=<your-generated-password>
ADMIN_PASSWORD_HASH=<bcrypt-hash-of-password>

# Feature Flags
ENABLE_ADMIN_PANEL=true
REQUIRE_ADMIN_2FA=true
```

### Step 3: Fix the Auth Library

Replace `/lib/auth.ts` with the secure version below.

### Step 4: Create Migration Script

Run this to update existing admin passwords.

### Step 5: Update All Service Role Usage

Audit and fix all files using `SUPABASE_SERVICE_ROLE_KEY`.

## Files to Update Immediately

1. `/lib/auth.ts` - Remove hardcoded credentials
2. `/lib/supabase.ts` - Remove service role from client
3. All API routes using `supabaseAdmin`
4. `/middleware.ts` - Update admin auth check

## Verification Checklist

- [ ] No hardcoded passwords in code
- [ ] All secrets in environment variables
- [ ] JWT secret is cryptographically secure
- [ ] Admin password is strong and unique
- [ ] Service role key not used in client code
- [ ] All API routes properly authenticated
- [ ] Middleware protects admin routes
- [ ] Audit logs for admin actions