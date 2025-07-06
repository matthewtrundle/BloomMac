-- Get complete schema for all tables
\o production-schema-complete.txt
\dt public.*
\echo '=== DETAILED TABLE STRUCTURES ==='
\d+ public.*
\o