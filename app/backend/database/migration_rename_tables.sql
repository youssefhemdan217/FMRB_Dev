-- ====================================
-- FMRB Database Migration: Rename Tables
-- Meeting Room Booking System
-- ====================================

-- Use the database
USE fmrb_db;

-- ====================================
-- STEP 1: Rename Tables
-- ====================================
-- This approach is safe and atomic
-- No data loss, no frontend changes needed

-- Rename users table
RENAME TABLE users TO mb_users;

-- Rename rooms table  
RENAME TABLE rooms TO mb_rooms;

-- Rename bookings table
RENAME TABLE bookings TO mb_bookings;

-- ====================================
-- STEP 2: Verify the changes
-- ====================================
-- Run these commands to verify everything worked:

-- Show all tables (should show mb_* tables)
-- SHOW TABLES;

-- Verify foreign key constraints still work
-- DESCRIBE mb_bookings;

-- Test a simple query
-- SELECT COUNT(*) FROM mb_rooms;

-- ====================================
-- ROLLBACK (if needed)
-- ====================================
-- If something goes wrong, you can rollback:
-- RENAME TABLE mb_users TO users;
-- RENAME TABLE mb_rooms TO rooms;
-- RENAME TABLE mb_bookings TO bookings;
