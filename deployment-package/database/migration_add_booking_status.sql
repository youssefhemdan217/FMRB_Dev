-- Add booking status column and backfill existing rows

ALTER TABLE mb_bookings
  ADD COLUMN status ENUM('pending','approved','declined') NOT NULL DEFAULT 'pending' AFTER end;

-- Backfill existing rows to approved to preserve prior behavior
UPDATE mb_bookings SET status = 'approved' WHERE status IS NULL;

-- Helpful index for status queries
CREATE INDEX idx_status ON mb_bookings (status);


