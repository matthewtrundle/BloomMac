-- =====================================================
-- Compare Local vs Production Database Schema
-- Run this on BOTH local and production to compare
-- =====================================================

-- 1. List all tables
\echo '=== ALL TABLES ==='
SELECT tablename, 
       CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'No RLS' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. List all functions
\echo ''
\echo '=== ALL FUNCTIONS ==='
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 3. List all triggers
\echo ''
\echo '=== ALL TRIGGERS ==='
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_timing,
    event_manipulation as event,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 4. Check auth schema tables
\echo ''
\echo '=== AUTH SCHEMA TABLES ==='
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'auth' 
ORDER BY tablename;

-- 5. Check auth triggers
\echo ''
\echo '=== AUTH TRIGGERS ==='
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
ORDER BY event_object_table, trigger_name;

-- 6. Check RLS policies count by table
\echo ''
\echo '=== RLS POLICIES COUNT ==='
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname IN ('public', 'auth')
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

-- 7. Check for custom types
\echo ''
\echo '=== CUSTOM TYPES ==='
SELECT 
    n.nspname as schema,
    t.typname as type_name,
    t.typtype as type_type
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
AND t.typtype IN ('e', 'c') -- enums and composite types
ORDER BY schema, type_name;

-- 8. Check indexes
\echo ''
\echo '=== INDEXES COUNT PER TABLE ==='
SELECT 
    tablename,
    COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 9. Check constraints
\echo ''
\echo '=== CONSTRAINTS COUNT PER TABLE ==='
SELECT 
    tc.table_name,
    COUNT(*) as constraint_count,
    STRING_AGG(tc.constraint_type, ', ') as constraint_types
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
GROUP BY tc.table_name
ORDER BY tc.table_name;