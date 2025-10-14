# How to Make a User Admin

## 🎯 Quick Guide

You need to promote your user account to admin role to delete rooms.

---

## Method 1: Using API Endpoint (Recommended)

### Step 1: Find Your User ID

**Option A: Check in database**
```sql
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE fmrb_db;

-- Find your user
SELECT id, email, name, role FROM users WHERE email = 'Youssef@admin.com';
```

**Option B: Using Postman/API**
After logging in, your user ID is in the JWT token or you can check the auth response.

### Step 2: Use the Update Role Endpoint

**Using Postman:**
```
PUT http://localhost:3000/api/v1/auth/users/{userId}/role

Body (JSON):
{
  "role": "admin"
}
```

**Using curl:**
```bash
curl -X PUT http://localhost:3000/api/v1/auth/users/1/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Using fetch (Browser Console):**
```javascript
fetch('http://localhost:3000/api/v1/auth/users/1/role', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'admin' })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Method 2: Direct Database Update

Connect to MySQL and run:

```sql
USE fmrb_db;

-- Update by email
UPDATE users 
SET role = 'admin' 
WHERE email = 'Youssef@admin.com';

-- Verify the change
SELECT id, email, name, role FROM users WHERE email = 'Youssef@admin.com';
```

---

## Method 3: Create Admin User Directly

Register a new admin user by modifying the database after registration:

```sql
-- After registering via API/frontend
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-new-email@example.com';
```

---

## ⚠️ Important Notes

1. **Logout and Login Again** after changing role
   - The role is stored in the JWT token
   - You need to login again to get a new token with admin role

2. **Check Your Role** in the frontend
   - After login, check the navbar profile menu
   - Should show "ADMIN" badge

3. **Test Delete Permission**
   - Try deleting a room from Room Management page
   - Should work now!

---

## 🔍 Verify Admin Role

### In Database:
```sql
SELECT id, email, name, role FROM users WHERE role = 'admin';
```

### Via API:
Your auth token will contain the role. After login, the response includes:
```json
{
  "user": {
    "id": "1",
    "email": "Youssef@admin.com",
    "name": "Youssef",
    "role": "admin"  // ← Should be "admin"
  },
  "accessToken": "..."
}
```

---

## 🚀 Quick Command (MySQL)

If you want a one-liner to make the first user admin:

```sql
USE fmrb_db;
UPDATE users SET role = 'admin' WHERE id = 1;
SELECT id, email, name, role FROM users WHERE id = 1;
```

---

## 📝 Summary

**Fastest Method:**
1. Run MySQL command: `UPDATE users SET role = 'admin' WHERE email = 'Youssef@admin.com';`
2. Logout from frontend
3. Login again
4. Check navbar - should show "ADMIN"
5. Try deleting a room - should work!

**OR**

Use the API endpoint:
```bash
curl -X PUT http://localhost:3000/api/v1/auth/users/1/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

Then logout and login again to get the new admin token.

