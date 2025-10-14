# API Endpoints Documentation - Frontend Integration Guide

Base URL: `http://localhost:3000/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "jwt-access-token-string",
  "refreshToken": "jwt-refresh-token-string"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

---

### 2. Login User
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "jwt-access-token-string",
  "refreshToken": "jwt-refresh-token-string"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found

---

### 3. Logout User
**POST** `/api/v1/auth/logout`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200 OK):**
```json
{
  "message": "Logged out successfully",
  "timestamp": "2025-10-14T12:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Note:** While the backend endpoint confirms logout, token invalidation happens client-side by removing the token from localStorage. The backend endpoint can be extended to blacklist tokens or invalidate refresh tokens in the future.

---

### 4. Update User Role (Make Admin)
**PUT** `/api/v1/auth/users/:userId/role`

**Authentication:** Not required (for dev/testing purposes)

**URL Parameters:**
- `userId` - User ID (number)

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid Roles:**
- `"user"` - Regular user
- `"admin"` - Administrator

**Success Response (200 OK):**
```json
{
  "message": "User role updated to admin successfully",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid role value
- `404 Not Found` - User not found

**Note:** In production, this endpoint should be protected and only accessible by existing admins.

---

## 🏢 Room Endpoints

### 5. Get All Rooms
**GET** `/api/v1/rooms`

**Authentication:** Not required (public)

**Success Response (200 OK):**
```json
[
  {
    "id": "room-uuid-1",
    "name": "Conference Room A",
    "location": "Building 1, Floor 2",
    "capacity": 10,
    "isActive": true,
    "workHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "amenities": ["Projector", "Whiteboard", "Video Conference"],
    "status": "available",
    "statusMessage": "Available now",
    "nextChange": "2025-10-14T14:00:00Z"
  },
  {
    "id": "room-uuid-2",
    "name": "Meeting Room B",
    "location": "Building 1, Floor 3",
    "capacity": 6,
    "isActive": true,
    "workHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "amenities": ["TV Screen", "Phone"],
    "status": "occupied",
    "statusMessage": "In use until 15:00",
    "nextChange": "2025-10-14T15:00:00Z"
  }
]
```

**Status Values:**
- `available` - Room is currently free
- `occupied` - Room is currently in use
- `closed` - Room is outside work hours or inactive

---

### 6. Get Room by ID
**GET** `/api/v1/rooms/:id`

**Authentication:** Not required (public)

**URL Parameters:**
- `id` - Room UUID

**Success Response (200 OK):**
```json
{
  "id": "room-uuid-1",
  "name": "Conference Room A",
  "location": "Building 1, Floor 2",
  "capacity": 10,
  "isActive": true,
  "workHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "amenities": ["Projector", "Whiteboard", "Video Conference"]
}
```

**Error Responses:**
- `404 Not Found` - Room not found

---

### 7. Create Room
**POST** `/api/v1/rooms`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "name": "Conference Room A",
  "location": "Building 1, Floor 2",
  "capacity": 10,
  "isActive": true,
  "workHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "amenities": ["Projector", "Whiteboard", "Video Conference"]
}
```

**Success Response (201 Created):**
```json
{
  "id": "room-uuid-1",
  "name": "Conference Room A",
  "location": "Building 1, Floor 2",
  "capacity": 10,
  "isActive": true,
  "workHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "amenities": ["Projector", "Whiteboard", "Video Conference"]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `409 Conflict` - Room already exists

---

### 8. Update Room
**PUT** `/api/v1/rooms/:id`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**URL Parameters:**
- `id` - Room UUID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Conference Room A",
  "location": "Building 2, Floor 3",
  "capacity": 12,
  "isActive": false,
  "workHours": {
    "start": "08:00",
    "end": "18:00"
  },
  "amenities": ["Projector", "Whiteboard", "Video Conference", "TV"]
}
```

**Success Response (200 OK):**
```json
{
  "id": "room-uuid-1",
  "name": "Updated Conference Room A",
  "location": "Building 2, Floor 3",
  "capacity": 12,
  "isActive": false,
  "workHours": {
    "start": "08:00",
    "end": "18:00"
  },
  "amenities": ["Projector", "Whiteboard", "Video Conference", "TV"]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Room not found

---

### 9. Delete Room
**DELETE** `/api/v1/rooms/:id`

**Authentication:** Required (Bearer Token + Admin Role)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**URL Parameters:**
- `id` - Room UUID

**Success Response (204 No Content):**
```
(No body)
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not admin
- `404 Not Found` - Room not found

---

## 📅 Booking Endpoints

### 10. Get All Bookings
**GET** `/api/v1/bookings`

**Authentication:** Not required (public for demo)

**Query Parameters (optional):**
- `roomId` - Filter bookings by room ID

**Example:**
```
GET /api/v1/bookings?roomId=room-uuid-1
```

**Success Response (200 OK):**
```json
[
  {
    "id": "booking-uuid-1",
    "roomId": "room-uuid-1",
    "title": "Team Standup",
    "organizer": "john.doe@example.com",
    "start": "2025-10-14T10:00:00.000Z",
    "end": "2025-10-14T10:30:00.000Z",
    "createdAt": "2025-10-13T15:30:00.000Z"
  },
  {
    "id": "booking-uuid-2",
    "roomId": "room-uuid-1",
    "title": "Client Meeting",
    "organizer": "jane.smith@example.com",
    "start": "2025-10-14T14:00:00.000Z",
    "end": "2025-10-14T15:00:00.000Z",
    "createdAt": "2025-10-13T16:00:00.000Z"
  }
]
```

---

### 11. Get Booking by ID
**GET** `/api/v1/bookings/:id`

**Authentication:** Not required (public for demo)

**URL Parameters:**
- `id` - Booking UUID

**Success Response (200 OK):**
```json
{
  "id": "booking-uuid-1",
  "roomId": "room-uuid-1",
  "title": "Team Standup",
  "organizer": "john.doe@example.com",
  "start": "2025-10-14T10:00:00.000Z",
  "end": "2025-10-14T10:30:00.000Z",
  "createdAt": "2025-10-13T15:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Booking not found

---

### 12. Create Booking
**POST** `/api/v1/bookings`

**Authentication:** Not required (public for demo)

**Request Body:**
```json
{
  "roomId": "room-uuid-1",
  "title": "Team Standup",
  "organizer": "john.doe@example.com",
  "start": "2025-10-14T10:00:00.000Z",
  "end": "2025-10-14T10:30:00.000Z"
}
```

**Field Notes:**
- `organizer` is optional, defaults to "Anonymous"
- `start` and `end` must be ISO 8601 datetime strings
- Booking must be within room's work hours
- Room must not have conflicting bookings

**Success Response (201 Created):**
```json
{
  "id": "booking-uuid-1",
  "roomId": "room-uuid-1",
  "title": "Team Standup",
  "organizer": "john.doe@example.com",
  "start": "2025-10-14T10:00:00.000Z",
  "end": "2025-10-14T10:30:00.000Z",
  "createdAt": "2025-10-14T08:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data or validation failed
- `404 Not Found` - Room not found
- `409 Conflict` - Time slot already booked

**Validation Rules:**
- End time must be after start time
- Booking must be within room's work hours
- No overlapping bookings for the same room

---

### 13. Delete Booking
**DELETE** `/api/v1/bookings/:id`

**Authentication:** Not required (public for demo)

**URL Parameters:**
- `id` - Booking UUID

**Success Response (204 No Content):**
```
(No body)
```

**Error Responses:**
- `404 Not Found` - Booking not found

---

## 📊 Analytics Endpoints

### 14. Get Analytics Summary
**GET** `/api/v1/analytics/summary`

**Authentication:** Not required (public)

**Query Parameters (optional):**
- `startDate` - Start date for analytics (ISO 8601 format)
- `endDate` - End date for analytics (ISO 8601 format)
- `roomId` - Filter analytics by specific room

**Defaults:**
- `startDate` - 7 days ago
- `endDate` - Current date
- `roomId` - All rooms

**Example:**
```
GET /api/v1/analytics/summary?startDate=2025-10-01&endDate=2025-10-14&roomId=room-uuid-1
```

**Success Response (200 OK):**
```json
{
  "utilization": 68.5,
  "availableRooms": 3,
  "totalRooms": 5,
  "peakHour": "14:00",
  "avgMeetingDuration": 45,
  "topRoom": {
    "name": "Conference Room A",
    "bookedTime": "24h 30m"
  }
}
```

**Response Fields:**
- `utilization` - Percentage of time rooms were booked (0-100)
- `availableRooms` - Number of rooms currently available
- `totalRooms` - Total number of active rooms
- `peakHour` - Hour with most bookings (format: "HH:00")
- `avgMeetingDuration` - Average meeting length in minutes
- `topRoom` - Most frequently booked room
  - Can be `null` if no bookings in date range
  - `bookedTime` format: "Xh Ym"

---

## 🚨 Common Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "statusCode": 400,
  "timestamp": "2025-10-14T12:00:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate, booking overlap, etc.)
- `429 Too Many Requests` - Rate limit exceeded (100 requests per 15 minutes)
- `500 Internal Server Error` - Server error

---

## 🔑 Authentication Usage

For protected endpoints, include the access token in the Authorization header:

```javascript
// Example using fetch
fetch('http://localhost:3000/api/v1/rooms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    name: 'New Room',
    location: 'Building 1',
    capacity: 8,
    workHours: { start: '09:00', end: '17:00' }
  })
});
```

**Token Expiration:**
- Tokens do not expire (simplified authentication)
- Tokens remain valid until user logs out or they are manually cleared

**Note:** For production environments, consider implementing token expiration and refresh logic for enhanced security.

---

## 📝 Frontend Integration Checklist

- [ ] Set up base API URL in environment config
- [ ] Create axios/fetch wrapper with base URL and headers
- [ ] Implement authentication state management
- [ ] Add access token to protected requests
- [ ] Add error handling for all API calls
- [ ] Create TypeScript interfaces matching API responses
- [ ] Handle rate limiting (show user-friendly message)
- [ ] Add loading states for async operations
- [ ] Implement optimistic updates where appropriate

---

## 🔍 TypeScript Interface Examples

```typescript
// Auth Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Room Types
interface WorkHours {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  workHours: WorkHours;
  amenities?: string[];
}

interface RoomWithStatus extends Room {
  status: 'available' | 'occupied' | 'closed';
  statusMessage: string;
  nextChange?: string; // ISO date string
}

// Booking Types
interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizer?: string;
  start: string; // ISO date string
  end: string;   // ISO date string
  createdAt: string; // ISO date string
}

// Analytics Types
interface AnalyticsSummary {
  utilization: number;
  availableRooms: number;
  totalRooms: number;
  peakHour: string;
  avgMeetingDuration: number;
  topRoom: {
    name: string;
    bookedTime: string;
  } | null;
}
```

---

## 📞 Support & Issues

If you encounter any issues or need clarification on endpoints, refer to:
- Full API Documentation: `app/backend/API_DOCUMENTATION.md`
- Postman Collection: `app/backend/FMRB_Postman.json`
- Backend README: `app/backend/README.md`

