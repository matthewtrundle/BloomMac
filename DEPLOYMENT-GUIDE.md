# Production Deployment Guide - Phase 1 Security Fixes

## Overview
This guide covers deploying the Phase 1 security fixes that remove service role key usage from all API routes.

## Pre-Deployment Checklist

- [x] All API routes updated to use secure Supabase clients
- [x] Contact form converted to use RPC function
- [x] Local testing completed successfully
- [x] Changes committed and pushed to GitHub
- [ ] Production Supabase migration ready
- [ ] Monitoring setup prepared

## Deployment Steps

### 1. Run Production Database Migration

**IMPORTANT**: This migration creates the RPC function needed for the contact form to work.

```sql
-- Run this in your production Supabase SQL Editor
-- File: supabase/migrations/20250105_contact_form_complete.sql

-- Complete contact form RPC setup

-- Drop existing function if it exists with wrong signature
DROP FUNCTION IF EXISTS submit_contact_form CASCADE;

-- Create a simpler RPC function for anonymous contact form submissions
CREATE OR REPLACE FUNCTION submit_contact_form(
  contact_data jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_submission_id UUID;
  v_name TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_service TEXT;
  v_message TEXT;
  v_page TEXT;
  v_user_agent TEXT;
  v_ip_address TEXT;
BEGIN
  -- Extract values from JSON
  v_name := contact_data->>'p_name';
  v_email := contact_data->>'p_email';
  v_phone := contact_data->>'p_phone';
  v_service := COALESCE(contact_data->>'p_service', 'general');
  v_message := contact_data->>'p_message';
  v_page := COALESCE(contact_data->>'p_page', '/contact');
  v_user_agent := COALESCE(contact_data->>'p_user_agent', '');
  v_ip_address := COALESCE(contact_data->>'p_ip_address', '');
  
  -- Validate required fields
  IF v_name IS NULL OR v_email IS NULL OR v_message IS NULL THEN
    RAISE EXCEPTION 'Name, email, and message are required';
  END IF;
  
  -- Insert contact submission
  INSERT INTO contact_submissions (
    name,
    email,
    phone,
    service,
    message,
    status,
    source,
    metadata
  ) VALUES (
    v_name,
    v_email,
    v_phone,
    v_service,
    v_message,
    'new',
    'website',
    jsonb_build_object(
      'page', v_page,
      'user_agent', v_user_agent,
      'ip_address', v_ip_address,
      'submitted_at', NOW()
    )
  )
  RETURNING id INTO v_submission_id;
  
  -- Track analytics event using 'contact_form' instead of 'contact_form_submission'
  INSERT INTO analytics_events (
    type,
    page,
    session_id,
    data
  ) VALUES (
    'contact_form',  -- Changed to match allowed types
    v_page,
    gen_random_uuid(),
    jsonb_build_object(
      'service', v_service,
      'has_phone', v_phone IS NOT NULL,
      'submission_id', v_submission_id
    )
  );
  
  -- Return submission details
  RETURN jsonb_build_object(
    'id', v_submission_id,
    'success', true
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE EXCEPTION 'Contact form submission failed: %', SQLERRM;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION submit_contact_form(jsonb) TO anon;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow contact form submissions via RPC" ON contact_submissions;

-- Create policy for the function to insert (using SECURITY DEFINER)
CREATE POLICY "Allow contact form submissions via RPC" 
ON contact_submissions 
FOR INSERT 
TO anon 
WITH CHECK (false); -- Direct inserts not allowed, only via function
```

### 2. Deploy Application Code

The application will automatically deploy via your CI/CD pipeline (Vercel, Netlify, etc.) when you push to main. The deployment includes:

- Updated API routes without service role keys
- New secure Supabase client utilities
- Enhanced middleware with better auth handling

### 3. Environment Variables

Ensure your production environment has these variables set:

```bash
# Required Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Still needed for server-side operations

# Other required variables
JWT_SECRET=your-jwt-secret
RESEND_API_KEY=your-resend-key
# ... other existing variables
```

### 4. Post-Deployment Testing

Test these critical paths after deployment:

1. **Contact Form**
   ```bash
   curl -X POST https://your-domain.com/api/contact/submit \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "message": "Test message from production",
       "service": "general"
     }'
   ```

2. **Admin Login**
   - Navigate to `/admin/login`
   - Test login with admin credentials
   - Verify session management works

3. **Career Applications** (if applicable)
   - Test the careers form submission
   - Verify applications are saved correctly

### 5. Monitoring

Monitor these areas for the first 2 hours after deployment:

1. **Vercel/Netlify Logs**
   - Check for any 500 errors
   - Look for authentication failures
   - Monitor API response times

2. **Supabase Dashboard**
   - Check API logs for errors
   - Monitor database queries
   - Verify RPC function calls

3. **Key Metrics to Watch**
   - Contact form submission success rate
   - Admin authentication success rate
   - API error rates
   - Response times

### 6. Rollback Plan

If critical issues occur:

1. **Revert Code**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Database Rollback** (if needed)
   ```sql
   -- Only if absolutely necessary
   DROP FUNCTION IF EXISTS submit_contact_form CASCADE;
   ```

## Common Issues & Solutions

### Contact Form Not Working
- **Symptom**: 500 error on form submission
- **Solution**: Ensure the RPC function migration was run successfully

### Admin Login Issues
- **Symptom**: Can't log in to admin panel
- **Solution**: Check JWT_SECRET environment variable matches production

### Missing Environment Variables
- **Symptom**: Various API errors
- **Solution**: Verify all required env vars are set in production

## Next Steps - Phase 2

After successful deployment and monitoring:

1. Implement comprehensive RLS policies
2. Add request validation middleware
3. Set up proper CORS configuration
4. Implement rate limiting on all endpoints
5. Add security headers

## Support

If you encounter issues:
1. Check the logs in your hosting provider
2. Review Supabase logs
3. Test affected endpoints with curl
4. Document any errors for debugging

Remember: The main goal of Phase 1 was removing service role keys from client-side code. This has been achieved! 🎉