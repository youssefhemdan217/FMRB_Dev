# 🎓 MySQL Beginner's Guide - Complete Tutorial

## What is MySQL?

MySQL is a **database** - like a digital filing cabinet for your data. Instead of folders and files, it uses **databases** (like folders) and **tables** (like spreadsheets).

---

## 📦 Step 1: Access MySQL Workbench

1. **Open MySQL Workbench** (search in Windows start menu)
2. You'll see a **connection** box (usually "Local instance MySQL80")
3. **Double-click** the connection
4. **Enter your root password** when prompted

💡 **Tip:** If you forgot your password, you'll need to reset it through MySQL installation settings.

---

## 🗄️ Step 2: Understanding Databases

Think of it like this:
- **MySQL Server** = Your entire filing cabinet
- **Database** = A drawer in the cabinet (e.g., "fmrb_db")
- **Table** = A folder in the drawer (e.g., "users", "rooms")
- **Row** = A single file in the folder (e.g., one user)

---

## 🛠️ Step 3: Create Your Database

### Method 1: Using Our Ready-Made Script (Easiest!)

1. In MySQL Workbench, click **File** → **Open SQL Script**
2. Navigate to your project:
   ```
   D:\Programming\GitHub Repos\FMRB_Dev\app\backend\database\schema.sql
   ```
3. Click **Open**
4. Click the **⚡ lightning bolt** icon (or press Ctrl+Shift+Enter)
5. Check the **Action Output** at the bottom - should show success messages

**What this does:**
- Creates database `fmrb_db`
- Creates 3 tables: `users`, `rooms`, `bookings`
- Sets up relationships between tables

### Method 2: Manual Creation (Learning!)

Type these commands in the query window:

```sql
-- Create a new database
CREATE DATABASE fmrb_db;

-- Switch to using this database
USE fmrb_db;

-- Verify it was created
SHOW DATABASES;
```

Click **⚡ Execute** after each command (or select all and execute together).

---

## 📋 Step 4: Create Tables

If you used **Method 1** above, skip this - tables are already created!

To manually create the users table:

```sql
USE fmrb_db;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔍 Step 5: Verify Your Setup

### Check if database exists:
```sql
SHOW DATABASES;
```

You should see `fmrb_db` in the list.

### Check if tables exist:
```sql
USE fmrb_db;
SHOW TABLES;
```

You should see:
- users
- rooms  
- bookings

### See table structure:
```sql
DESCRIBE users;
```

This shows all columns, types, and constraints.

---

## 📊 Step 6: Add Sample Data

Run our seed file to add test data:

1. **File** → **Open SQL Script**
2. Open: `app\backend\database\seed.sql`
3. Click **⚡ Execute**

This adds:
- 6 sample rooms (Conference Room A, Meeting Room B, etc.)
- 6 sample bookings

---

## 👀 Step 7: View Your Data

### See all data in a table:
```sql
SELECT * FROM rooms;
```

### Count records:
```sql
SELECT COUNT(*) FROM rooms;
```

### Filter data:
```sql
-- Find rooms with capacity > 10
SELECT * FROM rooms WHERE capacity > 10;

-- Find active rooms only
SELECT * FROM rooms WHERE is_active = TRUE;
```

### Sort data:
```sql
-- Sort by name
SELECT * FROM rooms ORDER BY name;

-- Sort by capacity (highest first)
SELECT * FROM rooms ORDER BY capacity DESC;
```

---

## ✏️ Step 8: Basic CRUD Operations

### **CREATE** - Add new data
```sql
INSERT INTO rooms (name, location, capacity, work_hours_start, work_hours_end)
VALUES ('New Room', 'Building C', 8, '09:00:00', '17:00:00');
```

### **READ** - View data
```sql
-- Get all rooms
SELECT * FROM rooms;

-- Get one specific room
SELECT * FROM rooms WHERE id = 1;

-- Get rooms in a specific location
SELECT * FROM rooms WHERE location LIKE '%Building A%';
```

### **UPDATE** - Modify data
```sql
-- Update room capacity
UPDATE rooms 
SET capacity = 15 
WHERE id = 1;

-- Update multiple fields
UPDATE rooms 
SET capacity = 12, is_active = FALSE 
WHERE id = 2;
```

### **DELETE** - Remove data
```sql
-- Delete a specific room
DELETE FROM rooms WHERE id = 1;

-- Delete all inactive rooms
DELETE FROM rooms WHERE is_active = FALSE;
```

⚠️ **Warning:** DELETE is permanent! Always use WHERE clause!

---

## 🔗 Step 9: Understanding Relationships

### Foreign Keys
The `bookings` table has foreign keys:
- `room_id` → links to `rooms.id`
- `user_id` → links to `users.id`

This means: "A booking belongs to a room and a user"

### JOIN queries (combining tables):
```sql
-- Get bookings with room names
SELECT 
  b.id,
  b.title,
  r.name as room_name,
  b.start,
  b.end
FROM bookings b
JOIN rooms r ON b.room_id = r.id;
```

---

## 🎯 Step 10: Connect Your Backend

Now that your database is ready:

1. **Update `.env` file:**
   ```env
   DB_PASSWORD=your_mysql_password_here
   ```

2. **Restart your backend:**
   ```bash
   cd app/backend
   npm run dev
   ```

3. **You should see:**
   ```
   ✅ MySQL Connected Successfully!
   🚀 Server running on http://localhost:3000
   ```

---

## 🛠️ Useful MySQL Commands Cheat Sheet

```sql
-- DATABASES
SHOW DATABASES;                    -- List all databases
CREATE DATABASE db_name;           -- Create new database
DROP DATABASE db_name;             -- Delete database (careful!)
USE db_name;                       -- Switch to a database

-- TABLES
SHOW TABLES;                       -- List all tables in current DB
DESCRIBE table_name;               -- Show table structure
DROP TABLE table_name;             -- Delete table (careful!)
TRUNCATE TABLE table_name;         -- Delete all data (keep structure)

-- DATA
SELECT * FROM table_name;          -- Get all data
INSERT INTO table_name (col1, col2) VALUES (val1, val2);
UPDATE table_name SET col1 = val1 WHERE condition;
DELETE FROM table_name WHERE condition;

-- FILTERING
WHERE column = value
WHERE column LIKE '%pattern%'      -- Pattern matching
WHERE column IN (val1, val2)       -- Multiple values
WHERE column > value AND other_column < value

-- SORTING
ORDER BY column ASC                -- Ascending (A-Z, 1-9)
ORDER BY column DESC               -- Descending (Z-A, 9-1)

-- LIMITING
LIMIT 10                           -- Get only 10 rows
LIMIT 5, 10                        -- Skip 5, get next 10

-- COUNTING
SELECT COUNT(*) FROM table_name;
SELECT COUNT(DISTINCT column) FROM table_name;
```

---

## 🐛 Common Mistakes & Solutions

### Mistake 1: Forgot to USE database
```sql
-- ❌ ERROR: No database selected
SELECT * FROM rooms;

-- ✅ SOLUTION: Select database first
USE fmrb_db;
SELECT * FROM rooms;
```

### Mistake 2: Forgot WHERE in DELETE/UPDATE
```sql
-- ❌ DANGER: Deletes ALL rooms!
DELETE FROM rooms;

-- ✅ CORRECT: Delete specific room
DELETE FROM rooms WHERE id = 1;
```

### Mistake 3: Foreign Key Violation
```sql
-- ❌ ERROR: Can't delete room that has bookings
DELETE FROM rooms WHERE id = 1;

-- ✅ SOLUTION: Delete bookings first, or use CASCADE
DELETE FROM bookings WHERE room_id = 1;
DELETE FROM rooms WHERE id = 1;
```

---

## 📚 Practice Exercises

Try these yourself:

1. **Create a new room:**
   ```sql
   INSERT INTO rooms (name, location, capacity, work_hours_start, work_hours_end)
   VALUES ('Study Room', 'Building D', 4, '08:00:00', '22:00:00');
   ```

2. **Find all rooms with capacity >= 10:**
   ```sql
   SELECT * FROM rooms WHERE capacity >= 10;
   ```

3. **Update a room's capacity:**
   ```sql
   UPDATE rooms SET capacity = 20 WHERE name = 'Conference Room A';
   ```

4. **Count active rooms:**
   ```sql
   SELECT COUNT(*) FROM rooms WHERE is_active = TRUE;
   ```

5. **Get bookings with room details:**
   ```sql
   SELECT b.title, r.name, b.start 
   FROM bookings b 
   JOIN rooms r ON b.room_id = r.id;
   ```

---

## 🎓 Next Steps

1. ✅ Practice basic SELECT queries
2. ✅ Try INSERT, UPDATE, DELETE
3. ✅ Experiment with WHERE clauses
4. ✅ Learn JOINs (combining tables)
5. ✅ Understand indexes and performance
6. ✅ Learn about transactions

---

## 💡 Tips for Learning

1. **Don't be afraid to break things** - you can always recreate the database
2. **Use LIMIT** when testing queries: `SELECT * FROM rooms LIMIT 5;`
3. **Always backup** before major changes
4. **Read error messages** - they usually tell you what's wrong
5. **Practice daily** - try writing one query per day

---

## 🆘 Getting Help

### In MySQL Workbench:
- Hover over SQL keywords for documentation
- Use auto-complete (Ctrl+Space)
- Check the Output panel for errors

### Common Error Codes:
- `1045` - Wrong password
- `1049` - Database doesn't exist
- `1146` - Table doesn't exist
- `1054` - Unknown column
- `1062` - Duplicate entry (violates UNIQUE constraint)

---

## 🎉 You're Ready!

Now you know how to:
- ✅ Create and manage databases
- ✅ Create and query tables
- ✅ Add, view, update, and delete data
- ✅ Connect your backend to MySQL
- ✅ Troubleshoot common issues

**Keep practicing and you'll become a MySQL pro!** 🚀

