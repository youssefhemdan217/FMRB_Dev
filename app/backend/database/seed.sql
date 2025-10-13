-- ====================================
-- SEED DATA
-- Sample data for testing
-- ====================================

USE fmrb_db;

-- Clear existing data (be careful in production!)
-- This deletes all data from the tables
SET FOREIGN_KEY_CHECKS = 0;  -- Temporarily disable foreign key checks
TRUNCATE TABLE bookings;
TRUNCATE TABLE rooms;
SET FOREIGN_KEY_CHECKS = 1;  -- Re-enable foreign key checks

-- ====================================
-- INSERT SAMPLE ROOMS
-- ====================================

INSERT INTO rooms (name, location, capacity, is_active, work_hours_start, work_hours_end, amenities) VALUES
('Conference Room A', 'Building A, Floor 1', 10, TRUE, '08:00:00', '20:00:00', '["Projector", "Whiteboard", "Video Conference", "Phone"]'),
('Conference Room B', 'Building A, Floor 2', 8, TRUE, '08:00:00', '18:00:00', '["TV Screen", "Whiteboard"]'),
('Meeting Room 101', 'Building B, Floor 1', 6, TRUE, '09:00:00', '17:00:00', '["Whiteboard", "Video Conference"]'),
('Executive Boardroom', 'Building A, Floor 3', 15, TRUE, '08:00:00', '22:00:00', '["Projector", "TV Screen", "Video Conference", "Phone", "Microphone"]'),
('Small Meeting Room', 'Building B, Floor 2', 4, TRUE, '08:00:00', '18:00:00', '["Whiteboard"]'),
('Training Room', 'Building C, Floor 1', 20, TRUE, '08:00:00', '20:00:00', '["Projector", "Sound System", "Microphone", "Whiteboard"]');

-- ====================================
-- INSERT SAMPLE BOOKINGS
-- ====================================

-- Get today's date and create some bookings
-- Note: In real app, you'd calculate these dates in your application

INSERT INTO bookings (room_id, title, organizer, start, end) VALUES
-- Today's bookings
(1, 'Team Standup', 'John Doe', CONCAT(CURDATE(), ' 09:00:00'), CONCAT(CURDATE(), ' 09:30:00')),
(1, 'Client Meeting', 'Jane Smith', CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 15:30:00')),
(2, 'Project Review', 'Mike Johnson', CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 11:00:00')),
(3, 'Design Session', 'Sarah Williams', CONCAT(CURDATE(), ' 13:00:00'), CONCAT(CURDATE(), ' 14:00:00')),

-- Tomorrow's bookings
(1, 'Sprint Planning', 'John Doe', DATE_ADD(CONCAT(CURDATE(), ' 09:00:00'), INTERVAL 1 DAY), DATE_ADD(CONCAT(CURDATE(), ' 11:00:00'), INTERVAL 1 DAY)),
(4, 'Board Meeting', 'CEO Office', DATE_ADD(CONCAT(CURDATE(), ' 15:00:00'), INTERVAL 1 DAY), DATE_ADD(CONCAT(CURDATE(), ' 17:00:00'), INTERVAL 1 DAY));

-- ====================================
-- VERIFY DATA
-- ====================================

-- Check how many rooms we inserted
SELECT COUNT(*) as total_rooms FROM rooms;

-- Check how many bookings we inserted
SELECT COUNT(*) as total_bookings FROM bookings;

-- Show all rooms with their details
SELECT 
  id,
  name,
  location,
  capacity,
  is_active,
  work_hours_start,
  work_hours_end
FROM rooms;

-- Show all bookings with room names
SELECT 
  b.id,
  r.name as room_name,
  b.title,
  b.organizer,
  b.start,
  b.end
FROM bookings b
JOIN rooms r ON b.room_id = r.id
ORDER BY b.start;

