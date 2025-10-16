# 🔄 Database Migration Guide: Rename Tables to mb_* Pattern

## 📋 Overview
This guide walks you through renaming your MySQL tables from the current names to the new `mb_*` pattern:
- `users` → `mb_users`
- `rooms` → `mb_rooms`
- `bookings` → `mb_bookings`

## ✅ What's Already Done
- ✅ Updated all repository files to use new table names
- ✅ Updated schema.sql for future deployments
- ✅ Created migration script
- ✅ **Frontend remains unchanged** - no frontend code changes needed!

## 🚀 Migration Steps

### Step 1: Backup Your Database (IMPORTANT!)
```sql
-- Create a backup before making changes
CREATE DATABASE fmrb_db_backup;
-- Then export your current data to backup
```

### Step 2: Run the Migration Script
```bash
# Navigate to your backend directory
cd app/backend

# Run the migration script in MySQL
mysql -u your_username -p fmrb_db < database/migration_rename_tables.sql
```

### Step 3: Verify the Migration
```sql
-- Connect to your database
USE fmrb_db;

-- Check that tables were renamed
SHOW TABLES;
-- Should show: mb_bookings, mb_rooms, mb_users

-- Test a simple query
SELECT COUNT(*) FROM mb_rooms;
SELECT COUNT(*) FROM mb_bookings;
SELECT COUNT(*) FROM mb_users;
```

### Step 4: Restart Your Backend
```bash
# Stop your backend server
# Then restart it
npm run dev
```

### Step 5: Test Your Application
1. **Frontend**: Open your app in the browser
2. **Create a booking**: Test that bookings still work
3. **Update a booking**: Verify update functionality
4. **Delete a booking**: Confirm delete works
5. **Room management**: Test room CRUD operations

## 🔄 Rollback Plan (If Needed)
If something goes wrong, you can rollback:

```sql
-- Rollback the table names
RENAME TABLE mb_users TO users;
RENAME TABLE mb_rooms TO rooms;
RENAME TABLE mb_bookings TO bookings;
```

## 🎯 Benefits of This Approach

### ✅ **Zero Frontend Impact**
- No frontend code changes needed
- All API endpoints remain the same
- User experience unchanged

### ✅ **Safe Migration**
- Atomic operations (all or nothing)
- Easy rollback if needed
- Preserves all data and relationships

### ✅ **Clean Architecture**
- Better table naming convention
- Consistent with project naming
- Easier to identify project tables

## 🔍 What Changed in the Code

### Repository Files Updated:
- `MySQLUserRepository.ts` - All queries now use `mb_users`
- `MySQLRoomRepository.ts` - All queries now use `mb_rooms`  
- `MySQLBookingRepository.ts` - All queries now use `mb_bookings`

### Schema File Updated:
- `schema.sql` - Updated for future deployments with new table names

### No Changes Needed:
- ❌ Frontend code
- ❌ API endpoints
- ❌ Controllers
- ❌ Use cases
- ❌ Domain entities

## 🚨 Important Notes

1. **Run migration during maintenance window** - Brief downtime during table rename
2. **Test thoroughly** - Verify all functionality works after migration
3. **Keep backup** - Don't delete backup until you're confident everything works
4. **Update documentation** - Update any internal docs that reference old table names

## 🎉 After Migration

Your application will work exactly the same, but with better organized database tables:
- `mb_users` - User accounts and authentication
- `mb_rooms` - Meeting rooms and their configurations  
- `mb_bookings` - Room reservations and scheduling

The `mb_` prefix makes it clear these tables belong to your Meeting Booking system!
