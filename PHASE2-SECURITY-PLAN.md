# Phase 2 Security Remediation Plan

## Overview
Phase 2 focuses on implementing defense-in-depth security measures beyond removing service role keys.

## Timeline: Days 5-10

### Day 5-6: Comprehensive RLS Policies

#### 1. User Data Protection
```sql
-- Ensure users can only access their own data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for:
-- - appointment_data
-- - user_achievements
-- - course_enrollments
-- - user_workbooks
```

#### 2. Admin Access Policies
```sql
-- Admins can access all data based on their role
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  ));
```

#### 3. Public Data Policies
```sql
-- Public can view published content
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT TO anon
  USING (status = 'published');
```

### Day 7-8: Request Validation & Middleware

#### 1. Input Validation Middleware
```typescript
// middleware/validation.ts
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      throw new ValidationError('Invalid request data');
    }
  };
};
```

#### 2. Rate Limiting Enhancement
```typescript
// Implement tiered rate limiting
export const rateLimits = {
  public: { requests: 10, window: '1m' },
  authenticated: { requests: 100, window: '1m' },
  admin: { requests: 1000, window: '1m' }
};
```

#### 3. CORS Configuration
```typescript
// middleware/cors.ts
export const corsMiddleware = {
  allowedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://bloompsychologynorthaustin.com'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

### Day 9-10: Security Headers & Monitoring

#### 1. Security Headers
```typescript
// middleware/security-headers.ts
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://calendly.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  `.replace(/\n/g, ' ').trim()
};
```

#### 2. Audit Logging
```typescript
// lib/audit.ts
export async function logSecurityEvent(event: {
  type: 'auth_failure' | 'suspicious_request' | 'rate_limit_exceeded';
  userId?: string;
  ip?: string;
  details: any;
}) {
  await supabase.from('security_audit_log').insert(event);
}
```

#### 3. Monitoring Setup
- Set up alerts for:
  - Multiple failed login attempts
  - Unusual API usage patterns
  - Rate limit violations
  - Unauthorized access attempts

## Implementation Checklist

### Database Security
- [ ] Enable RLS on all tables
- [ ] Create appropriate policies for each table
- [ ] Test policies with different user roles
- [ ] Remove any unnecessary database functions
- [ ] Audit all existing policies

### API Security
- [ ] Add input validation to all endpoints
- [ ] Implement request signing for sensitive operations
- [ ] Add CSRF protection
- [ ] Implement proper error handling (no info leakage)
- [ ] Add API versioning

### Authentication & Authorization
- [ ] Implement session timeout
- [ ] Add MFA support (optional)
- [ ] Implement proper password policies
- [ ] Add account lockout after failed attempts
- [ ] Audit all auth flows

### Infrastructure Security
- [ ] Enable HTTPS everywhere
- [ ] Implement proper CORS policies
- [ ] Add security headers
- [ ] Set up WAF rules (if using Cloudflare)
- [ ] Enable DDoS protection

### Monitoring & Compliance
- [ ] Set up security event logging
- [ ] Implement anomaly detection
- [ ] Create security dashboards
- [ ] Document security procedures
- [ ] Plan regular security audits

## Testing Strategy

### 1. Security Testing
```bash
# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-domain.com

# Test RLS policies
npm run test:security
```

### 2. Penetration Testing Checklist
- [ ] SQL injection attempts
- [ ] XSS vulnerabilities
- [ ] CSRF attacks
- [ ] Authentication bypass
- [ ] Authorization flaws
- [ ] Rate limit bypass
- [ ] Input validation bypass

### 3. Load Testing
```bash
# Test rate limiting
npm run test:load
```

## Rollout Plan

1. **Development Environment**
   - Implement all changes
   - Run security tests
   - Fix any issues

2. **Staging Environment**
   - Deploy changes
   - Run full security audit
   - Performance testing

3. **Production Deployment**
   - Deploy during low-traffic period
   - Monitor closely for 24 hours
   - Have rollback plan ready

## Success Metrics

- Zero security incidents
- <1% false positive rate on security rules
- No impact on legitimate user experience
- All OWASP Top 10 vulnerabilities addressed
- Passing security audit score

## Long-term Maintenance

### Weekly Tasks
- Review security logs
- Update dependencies
- Check for new vulnerabilities

### Monthly Tasks
- Security audit
- Penetration testing
- Policy review

### Quarterly Tasks
- Full security assessment
- Update security documentation
- Security training for team

## Resources

- [OWASP Security Guidelines](https://owasp.org)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)