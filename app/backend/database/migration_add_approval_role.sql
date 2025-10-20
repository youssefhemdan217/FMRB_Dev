-- Add 'approval' role to users.role enum

ALTER TABLE mb_users
  MODIFY COLUMN role ENUM('admin','approval','user') NOT NULL DEFAULT 'user';

-- Helpful index already exists (idx_role); no change needed


