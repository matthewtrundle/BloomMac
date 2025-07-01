-- Complete Supabase Schema Dump
-- This will show all tables, columns, constraints, and relationships

\echo '=== ALL TABLES ==='
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('public', 'auth') 
ORDER BY schemaname, tablename;

\echo '=== ALL COLUMNS FOR ALL TABLES ==='
SELECT 
    t.table_schema,
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    c.ordinal_position
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.table_name AND c.table_schema = t.table_schema
WHERE t.table_schema IN ('public', 'auth')
ORDER BY t.table_schema, t.table_name, c.ordinal_position;

\echo '=== FOREIGN KEY CONSTRAINTS ==='
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name;

\echo '=== CHECK CONSTRAINTS ==='
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name;

\echo '=== UNIQUE CONSTRAINTS ==='
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema IN ('public', 'auth')
GROUP BY tc.table_schema, tc.table_name, tc.constraint_name
ORDER BY tc.table_schema, tc.table_name;

\echo '=== SAMPLE DATA FROM KEY TABLES ==='
\echo '--- auth.users (first 2 rows) ---'
SELECT id, email, created_at FROM auth.users LIMIT 2;

\echo '--- user_profiles (first 2 rows) ---'
SELECT * FROM user_profiles LIMIT 2;

\echo '--- courses (first 2 rows) ---'
SELECT id, slug, title FROM courses LIMIT 2;

\echo '--- user_course_access (first 2 rows) ---'
SELECT * FROM user_course_access LIMIT 2;

\echo '--- course_enrollments (first 2 rows) ---'
SELECT * FROM course_enrollments LIMIT 2;