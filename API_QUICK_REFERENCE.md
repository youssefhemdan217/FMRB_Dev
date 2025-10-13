# 🚀 API Quick Reference - FMRB Backend

Base URL: `http://localhost:3000/api/v1`

---

## 🔐 **Authentication**

### Register User
```bash
POST /api/v1/auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "user": { "id": "1", "email": "...", "name": "...", "role": "user" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Login
```bash
POST /api/v1/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: Same as register
```

---

## 🏢 **Rooms** (With Real-Time Status!)

### Get All Rooms
```bash
GET /api/v1/rooms

Response:
[
  {
    "id": "1",
    "name": "Conference Room A",
    "location": "Building A, Floor 1",
    "capacity": 10,
    "isActive": true,
    "workHours": { "start": "08:00", "end": "20:00" },
    "amenities": ["Projector", "Whiteboard"],
    "status": "available",                    # Real-time calculation!
    "statusMessage": "Available until 2:00 PM",
    "nextChange": "2024-10-12T14:00:00Z"
  }
]
```

### Get Room by ID
```bash
GET /api/v1/rooms/:id

Response: Single room object (same structure)
```

### Create Room
```bash
POST /api/v1/rooms

Body:
{
  "name": "Meeting Room 101",
  "location": "Building B, Floor 3",
  "capacity": 8,
  "isActive": true,
  "workHours": {
    "start": "09:00",
    "end": "18:00"
  },
  "amenities": ["Whiteboard", "TV Screen"]
}
```

### Update Room
```bash
PUT /api/v1/rooms/:id

Body: (any fields to update)
{
  "capacity": 12,
  "isActive": false
}
```

### Delete Room
```bash
DELETE /api/v1/rooms/:id

Response: 204 No Content
```

---

## 📅 **Bookings**

### Get All Bookings
```bash
GET /api/v1/bookings
GET /api/v1/bookings?roomId=1    # Filter by room

Response:
[
  {
    "id": "1",
    "roomId": "1",
    "title": "Team Standup",
    "organizer": "John Doe",
    "start": "2024-10-12T09:00:00Z",
    "end": "2024-10-12T09:30:00Z",
    "createdAt": "2024-10-10T08:00:00Z"
  }
]
```

### Create Booking
```bash
POST /api/v1/bookings

Body:
{
  "roomId": "1",
  "title": "Project Planning",
  "organizer": "Jane Smith",
  "start": "2024-10-12T14:00:00Z",
  "end": "2024-10-12T15:30:00Z"
}

# Automatically checks for overlaps!
# Returns 409 Conflict if time slot is taken
```

### Delete Booking
```bash
DELETE /api/v1/bookings/:id

Response: 204 No Content
```

---

## 📊 **Analytics**

### Get Summary Stats
```bash
GET /api/v1/analytics/summary?startDate=2024-10-06&endDate=2024-10-12

Response:
{
  "utilization": 27.4,              # Percentage of time booked
  "availableRooms": 2,              # Free right now
  "totalRooms": 9,                  # Total active rooms
  "peakHour": "10:00",              # Busiest hour
  "avgMeetingDuration": 71,         # Minutes
  "topRoom": {
    "name": "Executive Suite",
    "bookedTime": "31h 0m"
  }
}
```

---

## 🎯 **Status Calculation Logic**

The backend automatically calculates room status:

1. **Unavailable** if:
   - Room is not active (isActive = false)
   - Current time is outside work hours

2. **Busy** if:
   - Room has a booking right now
   - Shows: "Busy until [end time]"

3. **Available** otherwise:
   - Shows: "Available" or "Available until [next booking]"

---

## 💡 **Error Responses**

### 400 Bad Request
```json
{ "error": "Validation error message", "type": "ValidationError" }
```

### 404 Not Found
```json
{ "error": "Room with id 123 not found", "type": "NotFoundError" }
```

### 409 Conflict
```json
{ "error": "Time slot is already booked", "type": "ConflictError" }
```

### 401 Unauthorized
```json
{ "error": "Invalid or expired token", "type": "UnauthorizedError" }
```

---

## 🧪 **Quick Test Commands**

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get rooms (with status!)
curl http://localhost:3000/api/v1/rooms

# Create room
curl -X POST http://localhost:3000/api/v1/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Room","location":"Building A","capacity":10,"workHours":{"start":"09:00","end":"17:00"}}'

# Create booking
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId":"1","title":"Meeting","start":"2024-10-12T14:00:00Z","end":"2024-10-12T15:00:00Z"}'

# Get analytics
curl http://localhost:3000/api/v1/analytics/summary

# Get bookings for a room
curl http://localhost:3000/api/v1/bookings?roomId=1
```

---

## 📝 **Next: Connect Frontend**

Your frontend needs these small updates:

1. **Create Login Page** (I can help!)
2. **Update API calls** to use real backend instead of localStorage
3. **Add token handling** (already in api.ts!)
4. **Test the integration**

---

## ✅ **What's Complete**

- ✅ Clean Architecture backend
- ✅ MySQL database with proper schema
- ✅ JWT authentication
- ✅ All CRUD operations
- ✅ Room status calculation
- ✅ Overlap detection
- ✅ Analytics endpoint
- ✅ Error handling
- ✅ Security (bcrypt, JWT, rate limiting)
- ✅ Type safety (TypeScript)
- ✅ Professional code structure

**Your backend is production-ready!** 🎉

