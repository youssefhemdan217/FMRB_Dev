# FMRB Backend API Documentation

Complete API reference for the Meeting Room Booking System.

## Base URL

```
http://localhost:3000/api/v1
```

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful deletion (no body) |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., time overlap) |
| 500 | Server Error | Internal server error |

---

## 🏢 Rooms API

### Get All Rooms

```http
GET /rooms
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Conference Room A",
    "location": "Building A, Floor 1",
    "capacity": 10,
    "isActive": true,
    "workHours": {
      "start": "08:00",
      "end": "20:00"
    },
    "amenities": ["Projector", "Whiteboard", "Video Conference"]
  }
]
```

### Get Room by ID

```http
GET /rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "id": "1",
  "name": "Conference Room A",
  "location": "Building A, Floor 1",
  "capacity": 10,
  "isActive": true,
  "workHours": {
    "start": "08:00",
    "end": "20:00"
  },
  "amenities": ["Projector", "Whiteboard"]
}
```

**Error Response (404):**
```json
{
  "error": "Room not found"
}
```

### Create Room

```http
POST /rooms
```

**Request Body:**
```json
{
  "name": "Meeting Room 301",
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

**Required Fields:**
- `name` - Room name
- `location` - Room location
- `capacity` - Maximum capacity
- `workHours` - Working hours object with `start` and `end`

**Optional Fields:**
- `isActive` - Default: `true`
- `amenities` - Array of amenities

**Response (201):**
```json
{
  "id": "7",
  "name": "Meeting Room 301",
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

```http
PUT /rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Request Body:**
(All fields optional - only send fields to update)
```json
{
  "name": "Updated Room Name",
  "capacity": 12
}
```

**Response (200):**
```json
{
  "id": "1",
  "name": "Updated Room Name",
  "location": "Building A, Floor 1",
  "capacity": 12,
  "isActive": true,
  "workHours": {
    "start": "08:00",
    "end": "20:00"
  },
  "amenities": ["Projector", "Whiteboard"]
}
```

### Delete Room

```http
DELETE /rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Response (204):**
No content

**Note:** Deleting a room will also delete all its bookings (CASCADE).

---

## 📅 Bookings API

### Get All Bookings

```http
GET /bookings
```

**Query Parameters:**
- `roomId` (optional) - Filter by room ID

**Examples:**
```http
GET /bookings                    # Get all bookings
GET /bookings?roomId=1          # Get bookings for room 1
```

**Response:**
```json
[
  {
    "id": "1",
    "roomId": "1",
    "title": "Team Standup",
    "organizer": "John Doe",
    "start": "2024-01-15T09:00:00.000Z",
    "end": "2024-01-15T09:30:00.000Z",
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

### Get Bookings by Room

```http
GET /bookings/room/:roomId
```

**Parameters:**
- `roomId` (path) - Room ID

**Response:**
Same as "Get All Bookings"

### Get Booking by ID

```http
GET /bookings/:id
```

**Parameters:**
- `id` (path) - Booking ID

**Response:**
```json
{
  "id": "1",
  "roomId": "1",
  "title": "Team Standup",
  "organizer": "John Doe",
  "start": "2024-01-15T09:00:00.000Z",
  "end": "2024-01-15T09:30:00.000Z",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

### Create Booking

```http
POST /bookings
```

**Request Body:**
```json
{
  "roomId": "1",
  "title": "Project Planning Meeting",
  "organizer": "Jane Smith",
  "start": "2024-01-15T14:00:00.000Z",
  "end": "2024-01-15T15:30:00.000Z"
}
```

**Required Fields:**
- `roomId` - Room ID (must exist)
- `title` - Meeting title
- `start` - Start datetime (ISO 8601 format)
- `end` - End datetime (ISO 8601 format)

**Optional Fields:**
- `organizer` - Meeting organizer name

**Validation Rules:**
- `end` must be after `start`
- Room must exist
- Time slot must not overlap with existing bookings

**Response (201):**
```json
{
  "id": "10",
  "roomId": "1",
  "title": "Project Planning Meeting",
  "organizer": "Jane Smith",
  "start": "2024-01-15T14:00:00.000Z",
  "end": "2024-01-15T15:30:00.000Z",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

**Error Response (409 - Conflict):**
```json
{
  "error": "Time slot is already booked",
  "conflictingBookingId": "5"
}
```

**Error Response (404 - Room not found):**
```json
{
  "error": "Room not found"
}
```

### Update Booking

```http
PUT /bookings/:id
```

**Parameters:**
- `id` (path) - Booking ID

**Request Body:**
(All fields optional - only send fields to update)
```json
{
  "title": "Updated Meeting Title",
  "start": "2024-01-15T15:00:00.000Z",
  "end": "2024-01-15T16:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": "1",
  "roomId": "1",
  "title": "Updated Meeting Title",
  "organizer": "John Doe",
  "start": "2024-01-15T15:00:00.000Z",
  "end": "2024-01-15T16:00:00.000Z",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

**Note:** If updating time or room, the system will check for overlaps (excluding the current booking).

### Delete Booking

```http
DELETE /bookings/:id
```

**Parameters:**
- `id` (path) - Booking ID

**Response (204):**
No content

---

## 🔍 Overlap Detection

The system automatically prevents booking conflicts. A booking overlaps with another if:

1. New booking **starts during** existing booking
2. New booking **ends during** existing booking
3. New booking **completely contains** existing booking

**SQL Logic:**
```sql
WHERE room_id = ? 
AND start < new_end 
AND end > new_start
```

---

## 💾 Data Types

### Room Object

```typescript
{
  id: string;              // Auto-generated
  name: string;            // Room name
  location: string;        // Physical location
  capacity: number;        // Max people
  isActive: boolean;       // Available for booking?
  workHours: {
    start: string;         // Format: "HH:MM"
    end: string;          // Format: "HH:MM"
  };
  amenities?: string[];   // Optional equipment list
}
```

### Booking Object

```typescript
{
  id: string;             // Auto-generated
  roomId: string;         // Foreign key to Room
  title: string;          // Meeting title
  organizer?: string;     // Optional organizer name
  start: string;          // ISO 8601 datetime
  end: string;            // ISO 8601 datetime
  createdAt: string;      // Auto-generated timestamp
}
```

---

## 🧪 Testing with cURL

### Create a Room
```bash
curl -X POST http://localhost:3000/api/v1/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room",
    "location": "Building A, Floor 1",
    "capacity": 10,
    "workHours": {
      "start": "08:00",
      "end": "18:00"
    }
  }'
```

### Get All Rooms
```bash
curl http://localhost:3000/api/v1/rooms
```

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "1",
    "title": "Test Meeting",
    "organizer": "John Doe",
    "start": "2024-01-15T14:00:00.000Z",
    "end": "2024-01-15T15:00:00.000Z"
  }'
```

---

## 🐛 Error Handling

All errors return JSON with an `error` field:

```json
{
  "error": "Error message here"
}
```

In development mode, stack traces are included for debugging.

---

## 📚 Additional Resources

- [MySQL Setup Guide](./MYSQL_SETUP.md)
- [Backend README](./README.md)
- [Database Schema](../database/schema.sql)

