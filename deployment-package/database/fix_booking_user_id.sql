-- ====================================
-- Fix: Make user_id nullable in bookings table
-- This allows creating bookings without authentication
-- ====================================

USE fmrb_db;

-- Make user_id nullable (optional)
ALTER TABLE bookings 
MODIFY COLUMN user_id INT NULL;

-- Verify the change
DESCRIBE bookings;

