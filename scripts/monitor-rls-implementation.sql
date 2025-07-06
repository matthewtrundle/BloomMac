-- =====================================================
-- RLS Implementation Monitoring & Validation Script
-- Date: 2025-01-05
-- Purpose: Monitor and validate RLS implementation progress
-- =====================================================

-- 1. Overall RLS Status Summary
-- =====================================================
SELECT 
    '=== RLS STATUS SUMMARY ===' as section;

SELECT 
    COUNT(*) FILTER (WHERE rowsecurity = true) as "Tables with RLS",
    COUNT(*) FILTER (WHERE rowsecurity = false) as "Tables without RLS",
    COUNT(*) as "Total Tables",
    ROUND(100.0 * COUNT(*) FILTER (WHERE rowsecurity = true) / COUNT(*), 2) as "RLS Coverage %"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT LIKE 'admin_%';  -- Admin tables should not have RLS

-- 2. Tables Missing RLS (Excluding Admin Tables)
-- =====================================================
SELECT 
    '=== TABLES MISSING RLS ===' as section;

SELECT 
    tablename as "Table Name",
    CASE 
        WHEN tablename LIKE 'admin_%' THEN 'Admin table - RLS not required'
        WHEN tablename LIKE '%_view' THEN 'View - RLS not applicable'
        ELSE 'Needs RLS implementation'
    END as "Status"
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
ORDER BY 
    CASE WHEN tablename LIKE 'admin_%' THEN 1 ELSE 0 END,
    tablename;

-- 3. RLS Policy Count by Table
-- =====================================================
SELECT 
    '=== RLS POLICY COUNT BY TABLE ===' as section;

SELECT 
    pt.tablename as "Table",
    pt.rowsecurity as "RLS Enabled",
    COUNT(pp.policyname) as "Policy Count",
    CASE 
        WHEN pt.rowsecurity = false THEN 'RLS not enabled'
        WHEN COUNT(pp.policyname) = 0 THEN '⚠️  RLS enabled but NO POLICIES'
        WHEN COUNT(pp.policyname) < 2 THEN '⚠️  May need more policies'
        ELSE '✅ OK'
    END as "Status"
FROM pg_tables pt
LEFT JOIN pg_policies pp ON pt.tablename = pp.tablename AND pp.schemaname = 'public'
WHERE pt.schemaname = 'public'
GROUP BY pt.tablename, pt.rowsecurity
ORDER BY 
    CASE WHEN pt.rowsecurity = false THEN 0 ELSE 1 END,
    COUNT(pp.policyname),
    pt.tablename;

-- 4. Detailed Policy Analysis
-- =====================================================
SELECT 
    '=== DETAILED POLICY ANALYSIS ===' as section;

SELECT 
    tablename as "Table",
    policyname as "Policy Name",
    permissive as "Permissive",
    array_to_string(roles, ', ') as "Roles",
    cmd as "Command",
    CASE 
        WHEN qual IS NOT NULL THEN substring(qual, 1, 50) || '...'
        ELSE 'No qualification'
    END as "Qualification (truncated)"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Tables by Functional Group with RLS Status
-- =====================================================
SELECT 
    '=== TABLES BY FUNCTIONAL GROUP ===' as section;

WITH table_groups AS (
    SELECT 
        tablename,
        rowsecurity,
        CASE 
            WHEN tablename LIKE 'user_%' THEN '1. User Data'
            WHEN tablename LIKE 'course_%' OR tablename = 'courses' THEN '2. Course Management'
            WHEN tablename LIKE 'payment_%' OR tablename LIKE '%_payment%' OR tablename LIKE 'stripe_%' THEN '3. Payments'
            WHEN tablename LIKE 'appointment_%' OR tablename LIKE 'calendly_%' OR tablename LIKE 'therapist_%' THEN '4. Appointments'
            WHEN tablename LIKE 'email_%' OR tablename = 'subscribers' THEN '5. Communications'
            WHEN tablename IN ('posts', 'blog_posts', 'blog_images') THEN '6. Content'
            WHEN tablename LIKE '%_log' OR tablename LIKE 'analytics_%' OR tablename LIKE 'audit_%' THEN '7. Analytics'
            WHEN tablename LIKE 'admin_%' THEN '8. Admin (No RLS needed)'
            ELSE '9. Other'
        END as functional_group
    FROM pg_tables
    WHERE schemaname = 'public'
)
SELECT 
    functional_group as "Group",
    COUNT(*) as "Total Tables",
    COUNT(*) FILTER (WHERE rowsecurity = true) as "With RLS",
    COUNT(*) FILTER (WHERE rowsecurity = false) as "Without RLS",
    ROUND(100.0 * COUNT(*) FILTER (WHERE rowsecurity = true) / NULLIF(COUNT(*), 0), 2) as "Coverage %",
    string_agg(
        CASE WHEN rowsecurity = false THEN tablename END, 
        ', ' ORDER BY tablename
    ) as "Tables Missing RLS"
FROM table_groups
GROUP BY functional_group
ORDER BY functional_group;

-- 6. Recent Table Modifications
-- =====================================================
SELECT 
    '=== RECENTLY MODIFIED TABLES ===' as section;

SELECT 
    schemaname,
    tablename,
    tableowner,
    CASE 
        WHEN rowsecurity THEN 'Enabled'
        ELSE 'Disabled'
    END as "RLS Status"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 7. Missing Critical Tables
-- =====================================================
SELECT 
    '=== MISSING CRITICAL TABLES ===' as section;

WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'user_preferences',
        'user_achievements', 
        'user_notifications',
        'wellness_entries',
        'user_payment_methods',
        'stripe_webhook_events',
        'calendly_webhook_events',
        'payment_intents',
        'refund_requests',
        'therapist_profiles',
        'email_campaign_metrics',
        'course_discount_codes'
    ]) as tablename
)
SELECT 
    et.tablename as "Expected Table",
    CASE 
        WHEN pt.tablename IS NOT NULL THEN '✅ Exists'
        ELSE '❌ Missing'
    END as "Status",
    CASE 
        WHEN pt.rowsecurity = true THEN 'RLS Enabled'
        WHEN pt.rowsecurity = false THEN 'RLS Disabled'
        ELSE 'N/A'
    END as "RLS Status"
FROM expected_tables et
LEFT JOIN pg_tables pt ON et.tablename = pt.tablename AND pt.schemaname = 'public'
ORDER BY 
    CASE WHEN pt.tablename IS NULL THEN 0 ELSE 1 END,
    et.tablename;

-- 8. Policy Effectiveness Check
-- =====================================================
SELECT 
    '=== POLICY EFFECTIVENESS CHECK ===' as section;

-- Check for tables with RLS but potentially ineffective policies
WITH policy_analysis AS (
    SELECT 
        pt.tablename,
        COUNT(DISTINCT pp.cmd) as command_types,
        bool_or(pp.cmd = 'SELECT') as has_select,
        bool_or(pp.cmd = 'INSERT') as has_insert,
        bool_or(pp.cmd = 'UPDATE') as has_update,
        bool_or(pp.cmd = 'DELETE') as has_delete,
        COUNT(pp.policyname) as total_policies
    FROM pg_tables pt
    LEFT JOIN pg_policies pp ON pt.tablename = pp.tablename AND pp.schemaname = 'public'
    WHERE pt.schemaname = 'public' AND pt.rowsecurity = true
    GROUP BY pt.tablename
)
SELECT 
    tablename as "Table",
    total_policies as "Total Policies",
    CASE 
        WHEN NOT has_select THEN '⚠️  Missing SELECT policy'
        WHEN total_policies < 2 THEN '⚠️  May need more policies'
        ELSE '✅ Appears complete'
    END as "Assessment",
    CONCAT(
        CASE WHEN has_select THEN 'SELECT ' ELSE '' END,
        CASE WHEN has_insert THEN 'INSERT ' ELSE '' END,
        CASE WHEN has_update THEN 'UPDATE ' ELSE '' END,
        CASE WHEN has_delete THEN 'DELETE ' ELSE '' END
    ) as "Commands Covered"
FROM policy_analysis
ORDER BY 
    CASE 
        WHEN NOT has_select THEN 0
        WHEN total_policies < 2 THEN 1
        ELSE 2
    END,
    tablename;

-- 9. Security Risk Assessment
-- =====================================================
SELECT 
    '=== SECURITY RISK ASSESSMENT ===' as section;

-- Identify high-risk tables without RLS
WITH risk_assessment AS (
    SELECT 
        tablename,
        rowsecurity,
        CASE 
            WHEN tablename LIKE 'user_%' AND tablename != 'user_course_stats' THEN 'HIGH - User data'
            WHEN tablename LIKE '%payment%' OR tablename LIKE 'stripe_%' THEN 'HIGH - Financial data'
            WHEN tablename LIKE '%_log' AND tablename NOT LIKE 'admin_%' THEN 'MEDIUM - Audit data'
            WHEN tablename = 'subscribers' THEN 'MEDIUM - PII data'
            WHEN tablename LIKE 'email_%' THEN 'MEDIUM - Communication data'
            WHEN tablename LIKE 'admin_%' THEN 'LOW - Admin only'
            ELSE 'LOW - General data'
        END as risk_level
    FROM pg_tables
    WHERE schemaname = 'public'
)
SELECT 
    risk_level as "Risk Level",
    COUNT(*) as "Total Tables",
    COUNT(*) FILTER (WHERE rowsecurity = false) as "Without RLS",
    string_agg(
        CASE WHEN rowsecurity = false THEN tablename END,
        ', ' ORDER BY tablename
    ) as "Unprotected Tables"
FROM risk_assessment
WHERE risk_level != 'LOW - Admin only'
GROUP BY risk_level
ORDER BY 
    CASE 
        WHEN risk_level LIKE 'HIGH%' THEN 0
        WHEN risk_level LIKE 'MEDIUM%' THEN 1
        ELSE 2
    END;

-- 10. Implementation Progress Summary
-- =====================================================
SELECT 
    '=== IMPLEMENTATION PROGRESS SUMMARY ===' as section;

WITH progress AS (
    SELECT 
        COUNT(*) FILTER (WHERE tablename IN ('user_profiles', 'user_preferences', 'user_achievements', 'user_notifications', 'wellness_entries', 'user_payment_methods') AND rowsecurity = true) as phase1_complete,
        6 as phase1_total,
        COUNT(*) FILTER (WHERE (tablename LIKE '%payment%' OR tablename LIKE 'stripe_%') AND tablename NOT LIKE 'admin_%' AND rowsecurity = true) as phase2_complete,
        COUNT(*) FILTER (WHERE (tablename LIKE '%payment%' OR tablename LIKE 'stripe_%') AND tablename NOT LIKE 'admin_%') as phase2_total,
        COUNT(*) FILTER (WHERE (tablename LIKE 'course_%' OR tablename = 'courses') AND rowsecurity = true) as phase3_complete,
        COUNT(*) FILTER (WHERE tablename LIKE 'course_%' OR tablename = 'courses') as phase3_total,
        COUNT(*) FILTER (WHERE (tablename LIKE 'email_%' OR tablename = 'subscribers') AND rowsecurity = true) as phase4_complete,
        COUNT(*) FILTER (WHERE tablename LIKE 'email_%' OR tablename = 'subscribers') as phase4_total
    FROM pg_tables
    WHERE schemaname = 'public'
)
SELECT 
    'Phase 1: User Data' as "Phase",
    phase1_complete || '/' || phase1_total as "Progress",
    ROUND(100.0 * phase1_complete / NULLIF(phase1_total, 0), 2) || '%' as "Completion"
FROM progress
UNION ALL
SELECT 
    'Phase 2: Financial',
    phase2_complete || '/' || phase2_total,
    ROUND(100.0 * phase2_complete / NULLIF(phase2_total, 0), 2) || '%'
FROM progress
UNION ALL
SELECT 
    'Phase 3: Courses',
    phase3_complete || '/' || phase3_total,
    ROUND(100.0 * phase3_complete / NULLIF(phase3_total, 0), 2) || '%'
FROM progress
UNION ALL
SELECT 
    'Phase 4: Communications',
    phase4_complete || '/' || phase4_total,
    ROUND(100.0 * phase4_complete / NULLIF(phase4_total, 0), 2) || '%'
FROM progress;

-- Instructions for use:
-- =====================================================
-- Run this script periodically to monitor RLS implementation progress
-- Pay special attention to:
-- 1. Tables with RLS enabled but no policies (security risk!)
-- 2. High-risk tables without RLS
-- 3. Phase completion percentages
-- 
-- To run specific sections, execute the queries between the section headers