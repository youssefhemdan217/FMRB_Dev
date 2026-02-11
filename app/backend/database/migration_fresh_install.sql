-- ====================================================
-- FMRB Database - Fresh Install Migration
-- Meeting Room Booking System
-- ====================================================
-- This migration creates the database from scratch with
-- ALL tables in their FINAL state (all prior migrations
-- already applied). Run this on a new machine.
--
-- Usage:
--   mysql -u root -p < migration_fresh_install.sql
-- ====================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS fmrb_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fmrb_db;

-- ====================================================
-- USERS TABLE (includes 'approval' role from migration)
-- ====================================================
CREATE TABLE IF NOT EXISTS mb_users (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  name        VARCHAR(255)  NOT NULL,
  role        ENUM('admin', 'approval', 'user') NOT NULL DEFAULT 'user',
  is_active   BOOLEAN       DEFAULT TRUE,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- ROOMS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS mb_rooms (
  id                INT           PRIMARY KEY AUTO_INCREMENT,
  name              VARCHAR(255)  NOT NULL,
  location          VARCHAR(255)  NOT NULL,
  capacity          INT           NOT NULL,
  is_active         BOOLEAN       DEFAULT TRUE,
  work_hours_start  TIME          NOT NULL DEFAULT '08:00:00',
  work_hours_end    TIME          NOT NULL DEFAULT '20:00:00',
  amenities         JSON,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_location  (location),
  INDEX idx_capacity  (capacity),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- BOOKINGS TABLE (includes status column from migration)
-- ====================================================
CREATE TABLE IF NOT EXISTS mb_bookings (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  room_id     INT           NOT NULL,
  user_id     INT           NULL,
  title       VARCHAR(255)  NOT NULL,
  organizer   VARCHAR(255),
  start       DATETIME      NOT NULL,
  end         DATETIME      NOT NULL,
  status      ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (room_id) REFERENCES mb_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES mb_users(id) ON DELETE SET NULL,

  INDEX idx_room_id   (room_id),
  INDEX idx_user_id   (user_id),
  INDEX idx_start     (start),
  INDEX idx_end       (end),
  INDEX idx_status    (status),
  INDEX idx_room_time (room_id, start, end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SEED DATA (optional — sample rooms & bookings)
-- ====================================================

INSERT INTO mb_rooms (name, location, capacity, is_active, work_hours_start, work_hours_end, amenities) VALUES
  ('Conference Room A',  'Building A, Floor 1', 10, TRUE, '08:00:00', '20:00:00', '["Projector", "Whiteboard", "Video Conference", "Phone"]'),
  ('Conference Room B',  'Building A, Floor 2',  8, TRUE, '08:00:00', '18:00:00', '["TV Screen", "Whiteboard"]'),
  ('Meeting Room 101',   'Building B, Floor 1',  6, TRUE, '09:00:00', '17:00:00', '["Whiteboard", "Video Conference"]'),
  ('Executive Boardroom','Building A, Floor 3', 15, TRUE, '08:00:00', '22:00:00', '["Projector", "TV Screen", "Video Conference", "Phone", "Microphone"]'),
  ('Small Meeting Room', 'Building B, Floor 2',  4, TRUE, '08:00:00', '18:00:00', '["Whiteboard"]'),
  ('Training Room',      'Building C, Floor 1', 20, TRUE, '08:00:00', '20:00:00', '["Projector", "Sound System", "Microphone", "Whiteboard"]');

INSERT INTO mb_bookings (room_id, title, organizer, start, end, status) VALUES
  -- Today's bookings (auto-approved for demo)
  (1, 'Team Standup',   'John Doe',       CONCAT(CURDATE(), ' 09:00:00'), CONCAT(CURDATE(), ' 09:30:00'), 'approved'),
  (1, 'Client Meeting',  'Jane Smith',     CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 15:30:00'), 'approved'),
  (2, 'Project Review',  'Mike Johnson',   CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 11:00:00'), 'approved'),
  (3, 'Design Session',  'Sarah Williams', CONCAT(CURDATE(), ' 13:00:00'), CONCAT(CURDATE(), ' 14:00:00'), 'pending'),
  -- Tomorrow's bookings
  (1, 'Sprint Planning', 'John Doe',  DATE_ADD(CONCAT(CURDATE(), ' 09:00:00'), INTERVAL 1 DAY), DATE_ADD(CONCAT(CURDATE(), ' 11:00:00'), INTERVAL 1 DAY), 'approved'),
  (4, 'Board Meeting',   'CEO Office', DATE_ADD(CONCAT(CURDATE(), ' 15:00:00'), INTERVAL 1 DAY), DATE_ADD(CONCAT(CURDATE(), ' 17:00:00'), INTERVAL 1 DAY), 'pending');

-- ====================================================
-- VERIFY
-- ====================================================
SELECT '--- Tables created ---' AS info;
SHOW TABLES;

SELECT '--- Rooms ---' AS info;
SELECT id, name, location, capacity FROM mb_rooms;

SELECT '--- Bookings ---' AS info;
SELECT b.id, r.name AS room, b.title, b.status, b.start, b.end
  FROM mb_bookings b
  JOIN mb_rooms r ON b.room_id = r.id
  ORDER BY b.start;

SELECT 'Fresh install complete!' AS result;
