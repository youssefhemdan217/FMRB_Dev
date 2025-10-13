# 📮 Postman Setup Guide

Complete guide to test your FMRB Backend API using Postman.

---

## 📥 **Step 1: Import Collection (Single File!)**

1. **Open Postman**

2. **Import Collection:**
   - Click "Import" button (top left)
   - Click "Upload Files"
   - Select: `app/backend/FMRB_Postman.json`
   - Click "Import"

**That's it!** Everything is in one file:
- ✅ All endpoints
- ✅ Environment variables
- ✅ Auto-authentication
- ✅ Dynamic variables
- ✅ Test scripts

---

## 🔐 **Step 2: Authentication Flow**

### **The collection has AUTO-AUTH built-in!**

1. **Register or Login:**
   - Open "Authentication" folder
   - Click "Register User" or "Login User"
   - Click "Send"
   
2. **Token is Automatically Saved! ✨**
   - The response script extracts the `accessToken`
   - Saves it to collection variables
   - All subsequent requests use it automatically!

3. **Verify Token is Saved:**
   - Look at the "Console" (bottom panel)
   - You should see: "✅ Login successful! Token saved."
   - Check variables: Click "..." → "Edit" → See "accessToken" filled

---

## 🧪 **Step 3: Test the API**

### **Recommended Testing Order:**

1. ✅ **Health Check** - Make sure server is running
2. ✅ **Register User** - Create your first user (token auto-saved!)
3. ✅ **Get All Rooms** - Should return empty array (no rooms yet)
4. ✅ **Create Room** - Add a room (ID auto-saved to `{{roomId}}`)
5. ✅ **Get All Rooms** - Now you'll see your room with status!
6. ✅ **Create Booking** - Book the room (uses `{{roomId}}` variable)
7. ✅ **Get All Bookings** - See your bookings
8. ✅ **Get Analytics** - View statistics

---

## 🎯 **Using Dynamic Variables**

### **Collection Variables (Auto-Updated):**

These are automatically set when you create resources:

- `{{baseUrl}}` - API base URL (http://localhost:3000/api/v1)
- `{{accessToken}}` - Your JWT token (auto-saved after login!)
- `{{roomId}}` - Last created room ID
- `{{bookingId}}` - Last created booking ID
- `{{userId}}` - Your user ID

### **How It Works:**

When you **create a room**, the response script runs:
```javascript
pm.collectionVariables.set('roomId', response.id);
```

So the next request can use `{{roomId}}`!

### **Edit Variables Manually:**

1. Click "..." on "FMRB Backend API" collection
2. Click "Edit"
3. Go to "Variables" tab
4. Change any values you want

---

## 📝 **Example Requests**

### **Create a Room**
```json
POST {{baseUrl}}/rooms

{
  "name": "Executive Boardroom",
  "location": "Building A, Floor 3",
  "capacity": 15,
  "isActive": true,
  "workHours": {
    "start": "08:00",
    "end": "22:00"
  },
  "amenities": ["Large Screen", "Video Conference", "Conference Phone"]
}
```

### **Create a Booking**
```json
POST {{baseUrl}}/bookings

{
  "roomId": "{{roomId}}",    // Uses the last created room!
  "title": "Team Meeting",
  "organizer": "Jane Smith",
  "start": "2024-10-15T14:00:00Z",
  "end": "2024-10-15T15:30:00Z"
}
```

### **Get Analytics**
```
GET {{baseUrl}}/analytics/summary?startDate=2024-10-06&endDate=2024-10-12
```

---

## 🔄 **Testing Workflows**

### **Workflow 1: Complete Room Lifecycle**
1. Register/Login → Token saved ✅
2. Create Room → Room ID saved ✅
3. Get Room by ID (uses `{{roomId}}`)
4. Update Room (uses `{{roomId}}`)
5. Delete Room (uses `{{roomId}}`)

### **Workflow 2: Booking Lifecycle**
1. Create Room → Room ID saved
2. Create Booking → Booking ID saved
3. Try create overlapping booking → Should get 409 error
4. Update Booking
5. Delete Booking

### **Workflow 3: Analytics Flow**
1. Create multiple rooms
2. Create multiple bookings
3. Get analytics summary
4. See utilization, peak hours, top rooms

---

## 🎨 **Customize for Production**

When deploying, update the environment:

1. Click "FMRB Development" environment
2. Click "..." → "Duplicate"
3. Rename to "FMRB Production"
4. Update variables:
   ```
   baseUrl: https://api.yourapp.com/api/v1
   serverUrl: https://api.yourapp.com
   ```

---

## 💡 **Pro Tips**

### **1. Use Pre-request Scripts**

Already set up! Login/Register automatically save tokens.

### **2. Use Test Scripts**

Already set up! Created resources save their IDs automatically.

### **3. Environment Switching**

Switch between Dev/Staging/Production:
- Top right dropdown → Select environment
- All requests update automatically!

### **4. Share with Team**

Export and share:
- Right-click collection → Export
- Send to teammates
- They import and start testing immediately!

---

## 🐛 **Troubleshooting**

### **401 Unauthorized Error**

**Problem:** Token expired or not set

**Solution:**
1. Go to "Authentication" folder
2. Run "Login User" again
3. Token will be refreshed automatically

### **Variables Not Working**

**Problem:** Wrong environment selected

**Solution:**
- Check top-right corner
- Make sure "FMRB Development" is selected

### **404 Not Found**

**Problem:** Server not running

**Solution:**
```bash
npm run dev:backend
```

### **409 Conflict (Booking)**

**Problem:** Time slot already booked (this is correct behavior!)

**Solution:**
- Choose different time
- Or delete conflicting booking first

---

## 📚 **Collection Features**

### ✅ **Auto-Auth Inheritance**
- Collection-level auth with Bearer token
- Individual requests can override
- Token automatically applied to all requests

### ✅ **Dynamic Variables**
- All IDs are variables
- Easy to chain requests
- No copy-paste needed!

### ✅ **Auto-Save Tokens**
- Login once
- Token saved automatically
- All requests authenticated

### ✅ **Auto-Save IDs**
- Create resources once
- IDs saved as variables
- Use in subsequent requests

---

## 🎯 **Quick Start Checklist**

- [ ] Import `FMRB_Postman_Collection.json`
- [ ] Import `FMRB_Postman_Environment.json`
- [ ] Select "FMRB Development" environment
- [ ] Start backend (`npm run dev:backend`)
- [ ] Run "Register User" → Token auto-saved!
- [ ] Run other requests → Everything works!

---

## 🎉 **You're Ready!**

Your Postman collection is:
- ✅ Fully configured
- ✅ Has auto-authentication
- ✅ Uses dynamic variables
- ✅ Includes all endpoints
- ✅ Has test scripts
- ✅ Production-ready

**Happy testing!** 🚀

