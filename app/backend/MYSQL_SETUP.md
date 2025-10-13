# MySQL Setup Guide

Step-by-step guide to set up MySQL for the FMRB Backend.

## Prerequisites

✅ MySQL installed on Windows  
✅ MySQL Workbench installed  
✅ MySQL Server running

---

## Step 1: Configure MySQL Connection

### 1.1 Find Your MySQL Password

When you installed MySQL, you set a root password. You'll need this!

### 1.2 Update Backend Environment File

Edit `app/backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fmrb_db
DB_USER=root
DB_PASSWORD=your_actual_password_here    # 👈 Change this!
```

**Replace `your_actual_password_here` with your MySQL root password.**

---

## Step 2: Create the Database

You have **two options**: Use MySQL Workbench (GUI) or Command Line

### Option A: Using MySQL Workbench (Recommended for Beginners)

1. **Open MySQL Workbench**

2. **Connect to your MySQL Server**
   - Click on your local MySQL connection
   - Enter your password

3. **Run the Schema Script**
   - Click "File" → "Open SQL Script"
   - Navigate to: `app/backend/database/schema.sql`
   - Click the ⚡ **Execute** button (lightning bolt)
   - You should see: "Action Output: CREATE DATABASE..."

4. **Verify Database Creation**
   ```sql
   SHOW DATABASES;
   ```
   You should see `fmrb_db` in the list!

5. **Run the Seed Data (Optional)**
   - Open: `app/backend/database/seed.sql`
   - Click ⚡ **Execute**
   - This adds sample rooms and bookings

### Option B: Using Command Line

1. **Open Command Prompt**

2. **Login to MySQL**
   ```bash
   mysql -u root -p
   ```
   Enter your password when prompted.

3. **Run the Schema Script**
   ```bash
   source C:/path/to/your/project/app/backend/database/schema.sql
   ```
   (Adjust the path to match your project location)

4. **Verify**
   ```sql
   SHOW DATABASES;
   USE fmrb_db;
   SHOW TABLES;
   ```

5. **Run Seed Data (Optional)**
   ```bash
   source C:/path/to/your/project/app/backend/database/seed.sql
   ```

---

## Step 3: Verify the Setup

### 3.1 Check Tables

In MySQL Workbench or command line:

```sql
USE fmrb_db;
SHOW TABLES;
```

You should see:
```
+-------------------+
| Tables_in_fmrb_db |
+-------------------+
| bookings          |
| rooms             |
+-------------------+
```

### 3.2 Check Table Structure

```sql
DESCRIBE rooms;
DESCRIBE bookings;
```

### 3.3 Check Sample Data (if you ran seed.sql)

```sql
SELECT * FROM rooms;
SELECT * FROM bookings;
```

---

## Step 4: Test Backend Connection

### 4.1 Install Backend Dependencies

From the **root directory** of your project:

```bash
npm install
```

This installs the `mysql2` package.

### 4.2 Start the Backend

```bash
npm run dev:backend
```

**Expected Output:**
```
✅ MySQL Connected Successfully!
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api/v1
💾 Database: fmrb_db on localhost
```

**If you see this, SUCCESS! 🎉**

### 4.3 Common Errors

#### ❌ Error: "Access denied for user 'root'@'localhost'"

**Problem:** Wrong password in `.env` file

**Solution:**
- Check your `.env` file
- Make sure `DB_PASSWORD` matches your MySQL password
- Try resetting MySQL password if forgotten

#### ❌ Error: "Unknown database 'fmrb_db'"

**Problem:** Database not created yet

**Solution:**
- Run `schema.sql` in MySQL Workbench (see Step 2)
- Or manually create: `CREATE DATABASE fmrb_db;`

#### ❌ Error: "connect ECONNREFUSED"

**Problem:** MySQL Server not running

**Solution:**
- Open Windows Services (Win + R, type `services.msc`)
- Find "MySQL80" (or similar)
- Right-click → Start

---

## Step 5: Test API Endpoints

### 5.1 Test Health Check

Open your browser or use cURL:

```bash
curl http://localhost:3000/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### 5.2 Test Get All Rooms

```bash
curl http://localhost:3000/api/v1/rooms
```

If you ran seed data, you should see the sample rooms!

### 5.3 Test Create Room

```bash
curl -X POST http://localhost:3000/api/v1/rooms \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"My Test Room\",\"location\":\"Test Building\",\"capacity\":5,\"workHours\":{\"start\":\"09:00\",\"end\":\"17:00\"}}"
```

---

## Understanding MySQL vs MongoDB

Since you're coming from MongoDB, here are the key differences:

| Aspect | MongoDB | MySQL |
|--------|---------|-------|
| **Structure** | Collections (flexible) | Tables (fixed schema) |
| **Schema** | Dynamic | Must define first |
| **Queries** | `db.rooms.find()` | `SELECT * FROM rooms` |
| **Relationships** | References (manual) | Foreign Keys (automatic) |
| **Arrays** | Native support | Store as JSON |
| **ID** | `_id` (ObjectId) | `id` (INT AUTO_INCREMENT) |

### Example Comparison

**MongoDB:**
```javascript
db.rooms.insertOne({
  name: "Room A",
  capacity: 10,
  amenities: ["Projector"]
})
```

**MySQL:**
```sql
INSERT INTO rooms (name, capacity, amenities) 
VALUES ('Room A', 10, '["Projector"]');
```

---

## Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Use a database
USE fmrb_db;

-- Show all tables
SHOW TABLES;

-- Show table structure
DESCRIBE rooms;

-- Count rows
SELECT COUNT(*) FROM rooms;

-- Delete all data (be careful!)
TRUNCATE TABLE bookings;
TRUNCATE TABLE rooms;

-- Drop database (⚠️ DANGER!)
DROP DATABASE fmrb_db;
```

---

## Troubleshooting

### Reset Everything

If something goes wrong, you can start fresh:

1. **In MySQL Workbench:**
   ```sql
   DROP DATABASE IF EXISTS fmrb_db;
   ```

2. **Run schema.sql again**

3. **Run seed.sql again** (optional)

4. **Restart backend**

### View MySQL Logs

Check: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\{computername}.err`

### Change MySQL Port

If port 3306 is taken:

1. Edit MySQL config: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
2. Find `port=3306` and change it
3. Restart MySQL service
4. Update `DB_PORT` in your `.env` file

---

## Next Steps

1. ✅ Database set up
2. ✅ Backend connected
3. 🚀 **Start building!**

Read the [API Documentation](./API_DOCUMENTATION.md) to see all available endpoints.

---

## Learning Resources

### MySQL Basics
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- [W3Schools MySQL](https://www.w3schools.com/mysql/)

### SQL Queries
- [SQL Cheat Sheet](https://www.sqltutorial.org/sql-cheat-sheet/)

### From MongoDB to MySQL
- Focus on learning: SELECT, INSERT, UPDATE, DELETE, JOIN
- Understand Foreign Keys and relationships
- Practice writing queries in MySQL Workbench

Good luck! 🎉

