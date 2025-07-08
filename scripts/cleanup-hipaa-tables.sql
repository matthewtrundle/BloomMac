-- HIPAA Cleanup Script: Remove PHI-containing tables
-- WARNING: This will permanently delete data. Make sure to backup first!
-- Run this in your Supabase SQL editor

-- 1. Drop appointment-related tables
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS appointment_data CASCADE;
DROP TABLE IF EXISTS appointment_reminders CASCADE;
DROP TABLE IF EXISTS appointment_no_shows CASCADE;
DROP TABLE IF EXISTS payment_intents CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;

-- 2. Drop clinical notes and provider tables
DROP TABLE IF EXISTS clinical_notes CASCADE;
DROP TABLE IF EXISTS provider_profiles CASCADE;
DROP TABLE IF EXISTS provider_settings CASCADE;
DROP TABLE IF EXISTS provider_availability CASCADE;

-- 3. Drop patient-linked workbook tables
DROP TABLE IF EXISTS user_workbook_responses CASCADE;
DROP TABLE IF EXISTS user_week_submissions CASCADE;
DROP TABLE IF EXISTS treatment_workbooks CASCADE;
DROP TABLE IF EXISTS patient_workbook_assignments CASCADE;

-- 4. Drop any audit logs that might contain PHI
DROP TABLE IF EXISTS clinical_audit_logs CASCADE;
DROP TABLE IF EXISTS patient_activity_logs CASCADE;

-- 5. Clean up functions that might reference these tables
DROP FUNCTION IF EXISTS get_patient_appointments CASCADE;
DROP FUNCTION IF EXISTS update_appointment_status CASCADE;
DROP FUNCTION IF EXISTS process_no_show_fees CASCADE;
DROP FUNCTION IF EXISTS get_provider_schedule CASCADE;

-- 6. Remove any RLS policies that reference deleted tables
-- (These will be dropped automatically with CASCADE, but being explicit)

-- 7. Remove any triggers related to appointments or clinical data
DROP TRIGGER IF EXISTS appointment_reminder_trigger ON appointments;
DROP TRIGGER IF EXISTS clinical_note_audit_trigger ON clinical_notes;

-- 8. Clean up any views that might contain PHI
DROP VIEW IF EXISTS patient_appointment_history CASCADE;
DROP VIEW IF EXISTS provider_patient_list CASCADE;
DROP VIEW IF EXISTS treatment_progress_summary CASCADE;

-- 9. Remove indexes on deleted tables
-- (These will be dropped automatically with CASCADE)

-- 10. Clean up any sequences
DROP SEQUENCE IF EXISTS appointment_number_seq;
DROP SEQUENCE IF EXISTS clinical_note_id_seq;

-- Log what we've done
DO $$
BEGIN
  RAISE NOTICE 'HIPAA cleanup completed. The following actions were taken:';
  RAISE NOTICE '- Removed appointment-related tables';
  RAISE NOTICE '- Removed clinical notes and provider tables';
  RAISE NOTICE '- Removed patient-linked workbook tables';
  RAISE NOTICE '- Removed PHI-containing audit logs';
  RAISE NOTICE '- Cleaned up related functions, views, and triggers';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify all PHI has been removed';
  RAISE NOTICE '2. Update application code to remove references to these tables';
  RAISE NOTICE '3. Run VACUUM to reclaim disk space';
END $$;

-- Optional: Run VACUUM to reclaim space (uncomment if needed)
-- VACUUM FULL;