-- ====================================
-- FMRB Database Schema
-- Meeting Room Booking System
-- ====================================

-- Create the database (run this first!)
CREATE DATABASE IF NOT EXISTS fmrb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE fmrb_db;

-- ====================================
-- USERS TABLE
-- ====================================
-- This table stores user accounts for authentication

CREATE TABLE IF NOT EXISTS users (
  -- Primary Key
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- User credentials
  email VARCHAR(255) NOT NULL UNIQUE,      -- Unique email
  password VARCHAR(255) NOT NULL,          -- Hashed password (bcrypt)
  name VARCHAR(255) NOT NULL,              -- User's full name
  
  -- User role for authorization
  role ENUM('admin', 'user') DEFAULT 'user',
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- ROOMS TABLE
-- ====================================
-- This table stores all meeting rooms
-- Similar to a MongoDB collection, but with a fixed structure (schema)

CREATE TABLE IF NOT EXISTS rooms (
  -- Primary Key: Unique identifier for each room
  -- AUTO_INCREMENT means MySQL will automatically assign numbers (1, 2, 3...)
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Room details
  name VARCHAR(255) NOT NULL,           -- Room name (e.g., "Conference Room A")
  location VARCHAR(255) NOT NULL,       -- Location (e.g., "Building A, Floor 3")
  capacity INT NOT NULL,                -- Maximum number of people
  is_active BOOLEAN DEFAULT TRUE,       -- Is room available for booking?
  
  -- Work hours stored as TIME format (HH:MM:SS)
  work_hours_start TIME NOT NULL DEFAULT '08:00:00',
  work_hours_end TIME NOT NULL DEFAULT '20:00:00',
  
  -- Amenities stored as JSON (MySQL supports JSON!)
  -- Similar to arrays in MongoDB
  -- Example: ["Projector", "Whiteboard", "Video Conference"]
  amenities JSON,
  
  -- Timestamps: When was this record created/updated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for faster searching
  INDEX idx_location (location),
  INDEX idx_capacity (capacity),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- BOOKINGS TABLE
-- ====================================
-- This table stores all room bookings
-- Has a FOREIGN KEY relationship with rooms table

CREATE TABLE IF NOT EXISTS bookings (
  -- Primary Key
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Foreign Key
  room_id INT NOT NULL,
  
  -- Booking details
  title VARCHAR(255) NOT NULL,          -- Meeting title
  organizer VARCHAR(255),               -- Optional: Who organized it
  
  -- Date/Time fields stored as DATETIME
  -- Format: 'YYYY-MM-DD HH:MM:SS' (e.g., '2024-01-15 09:00:00')
  start DATETIME NOT NULL,
  end DATETIME NOT NULL,
  
  -- When was this booking created
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Key Constraint
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  
  -- Indexes for faster queries
  INDEX idx_room_id (room_id),
  INDEX idx_start (start),
  INDEX idx_end (end),
  
  -- Composite index for overlapping booking checks
  INDEX idx_room_time (room_id, start, end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- HELPFUL COMMENTS FOR LEARNING
-- ====================================

-- VARCHAR vs TEXT:
-- VARCHAR(255) = String with max length, faster for searching
-- TEXT = Unlimited length, slower

-- INT vs BIGINT:
-- INT = Numbers up to ~2 billion
-- BIGINT = Larger numbers

-- TIMESTAMP vs DATETIME:
-- TIMESTAMP = Stored in UTC, auto-converts to timezone
-- DATETIME = Stored as-is, no conversion

-- JSON Column:
-- MySQL can store JSON data just like MongoDB!
-- You can query inside JSON: WHERE JSON_CONTAINS(amenities, '"Projector"')

-- Foreign Keys:
-- Unlike MongoDB where you just store an ID, MySQL enforces the relationship
-- ON DELETE CASCADE = If parent is deleted, delete children too
-- ON DELETE SET NULL = If parent is deleted, set this field to NULL
-- ON DELETE RESTRICT = Prevent deletion if children exist

-- Indexes:
-- Like MongoDB indexes, they make queries faster
-- But they slow down INSERT/UPDATE slightly
-- Trade-off: Read speed vs Write speed

