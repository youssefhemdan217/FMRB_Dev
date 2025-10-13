# 🎉 Clean Architecture Backend - COMPLETE!

## ✅ What Was Built

Your backend now has **production-ready Clean Architecture** with full JWT authentication!

### 🏗️ Architecture Layers

```
app/backend/src/
├── domain/                    # 🔵 DOMAIN LAYER (Business Rules)
│   ├── entities/              # Pure business entities
│   │   ├── User.ts           # User with roles (admin/user)
│   │   ├── Room.ts           # Room entity
│   │   └── Booking.ts        # Booking entity
│   ├── interfaces/            # Repository contracts
│   │   ├── IUserRepository.ts
│   │   ├── IRoomRepository.ts
│   │   └── IBookingRepository.ts
│   └── errors/                # Custom domain errors
│       └── DomainErrors.ts   # NotFoundError, ValidationError, etc.
│
├── application/               # 🟢 APPLICATION LAYER (Business Logic)
│   ├── use-cases/             # Core business operations
│   │   ├── auth/
│   │   │   ├── RegisterUser.ts    # User registration
│   │   │   └── LoginUser.ts       # User login
│   │   ├── rooms/
│   │   │   ├── CreateRoom.ts
│   │   │   └── GetAllRooms.ts
│   │   └── bookings/
│   │       └── CreateBooking.ts   # With overlap detection
│   ├── dtos/                  # Data Transfer Objects
│   │   ├── AuthDTO.ts
│   │   ├── RoomDTO.ts
│   │   └── BookingDTO.ts
│   └── services/              # Application services
│       ├── TokenService.ts    # JWT token generation/verification
│       └── HashService.ts     # Password hashing (bcrypt)
│
├── infrastructure/            # 🟡 INFRASTRUCTURE LAYER (External)
│   └── database/
│       ├── MySQLUserRepository.ts     # User data access
│       ├── MySQLRoomRepository.ts     # Room data access
│       └── MySQLBookingRepository.ts  # Booking data access
│
├── presentation/              # 🔴 PRESENTATION LAYER (HTTP/API)
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── RoomController.ts
│   │   └── BookingController.ts
│   ├── middlewares/
│   │   ├── authenticate.ts     # JWT verification
│   │   ├── authorize.ts        # Role-based access control
│   │   ├── validate.ts         # Request validation (Zod)
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── room.routes.ts
│   │   └── booking.routes.ts
│   └── validators/
│       └── authValidators.ts
│
├── config/                    # ⚙️ CENTRALIZED CONFIGURATION
│   ├── env.config.ts          # Environment variable validation
│   ├── database.config.ts     # MySQL configuration
│   ├── jwt.config.ts          # JWT settings
│   └── server.config.ts       # Server settings
│
└── index.ts                   # Application entry + DI Container
```

---

## 🔐 Authentication System

### Features Implemented:
- ✅ **User Registration** with password hashing (bcrypt)
- ✅ **User Login** with JWT tokens
- ✅ **Access Tokens** (15 minutes expiry)
- ✅ **Refresh Tokens** (7 days expiry)
- ✅ **Role-Based Access Control** (Admin/User)
- ✅ **Protected Routes** with JWT middleware
- ✅ **Request Validation** with Zod schemas

### Endpoints:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

---

## 📡 API Endpoints

### Public Routes:
- `GET /health` - Server health check
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/:id` - Get room by ID

### Protected Routes (Require JWT Token):
- `POST /api/v1/rooms` - Create room (any authenticated user)
- `PUT /api/v1/rooms/:id` - Update room (any authenticated user)
- `DELETE /api/v1/rooms/:id` - Delete room (**Admin only**)
- `GET /api/v1/bookings` - Get bookings (authenticated)
- `POST /api/v1/bookings` - Create booking (authenticated)
- `DELETE /api/v1/bookings/:id` - Delete booking (authenticated)

---

## 💾 Database Changes

### New Tables:

#### 1. **users** table (NEW!)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 2. **bookings** table (UPDATED!)
- Added `user_id` foreign key
- Links bookings to users
- Cascade delete when user is deleted

---

## 🚀 How to Run

### Step 1: Update MySQL Password
Edit `app/backend/.env`:
```env
DB_PASSWORD=your_actual_mysql_password
```

### Step 2: Run Database Schema
In **MySQL Workbench**:
1. Open `app/backend/database/schema.sql`
2. Execute it (⚡ button)
3. Verify tables: `SHOW TABLES;`

### Step 3: Start Backend
```bash
cd app/backend
npm run dev
```

**Expected Output:**
```
✅ MySQL Connected Successfully!
✅ Server is running!
🌐 URL: http://localhost:3000
📡 API: http://localhost:3000/api/v1
💾 Database: fmrb_db on localhost
```

---

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 3. Create a Room (with token)
```bash
curl -X POST http://localhost:3000/api/v1/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "name": "Conference Room",
    "location": "Building A",
    "capacity": 10,
    "workHours": {
      "start": "09:00",
      "end": "17:00"
    }
  }'
```

### 4. Create a Booking (with token)
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "roomId": "1",
    "title": "Team Meeting",
    "start": "2024-01-15T14:00:00Z",
    "end": "2024-01-15T15:00:00Z"
  }'
```

---

## 🔒 Security Features

1. **Password Hashing** - bcrypt with 10 salt rounds
2. **JWT Tokens** - Separate access & refresh tokens
3. **Rate Limiting** - 100 requests per 15 minutes per IP
4. **Helmet** - Security headers
5. **CORS** - Configured for frontend
6. **Input Validation** - Zod schemas
7. **SQL Injection Prevention** - Parameterized queries
8. **Error Handling** - Proper error codes and messages

---

## 📝 Configuration Files

### Environment Variables (`.env`):
```env
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fmrb_db
DB_USER=root
DB_PASSWORD=your_password_here

# JWT (CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-min-32-chars-long
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-min-32-chars-long
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🎯 Design Principles Implemented

### 1. **Clean Architecture**
- Domain layer has NO dependencies on external frameworks
- Application layer contains all business logic
- Infrastructure implements interfaces from domain
- Presentation layer handles HTTP concerns only

### 2. **Dependency Injection**
- All dependencies injected through constructors
- DI Container in `index.ts` wires everything
- Easy to test and mock

### 3. **SOLID Principles**
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### 4. **Repository Pattern**
- Abstracts data access
- Easy to swap databases
- Domain doesn't know about MySQL

---

## 🔄 How It All Works Together

### Example: Creating a Booking

1. **HTTP Request** → `POST /api/v1/bookings`
2. **Middleware** → `authenticate` verifies JWT token
3. **Route** → Calls `BookingController.create`
4. **Controller** → Extracts data, calls use case
5. **Use Case** → `CreateBookingUseCase.execute`
   - Validates input
   - Checks room exists
   - Checks for overlaps
6. **Repository** → `MySQLBookingRepository.create`
   - Executes SQL query
   - Returns booking entity
7. **Controller** → Maps entity to DTO
8. **HTTP Response** → Returns JSON

---

## 🎓 What You Learned

- ✅ Clean Architecture layers
- ✅ Dependency Injection
- ✅ Repository Pattern
- ✅ Use Cases (business logic)
- ✅ JWT Authentication
- ✅ Password hashing
- ✅ Role-based access control
- ✅ Request validation
- ✅ Error handling
- ✅ TypeScript advanced patterns

---

## 📚 Next Steps

1. **Update MySQL Password** in `.env`
2. **Run Database Schema** in MySQL Workbench
3. **Start the Server** and test endpoints
4. **Create an admin user** (manually update role in DB to 'admin')
5. **Connect Frontend** to the backend API

---

## 🐛 Troubleshooting

### Can't connect to MySQL?
- Check MySQL service is running
- Verify password in `.env`
- Run the schema.sql file

### JWT errors?
- Check JWT secrets are at least 32 characters
- Verify token in Authorization header: `Bearer <token>`

### Build errors?
- Run `npm install` in app/backend
- Delete `dist` folder and rebuild

---

## 🎉 Congratulations!

You now have a **production-ready, scalable backend** with:
- ✅ Clean Architecture
- ✅ JWT Authentication
- ✅ MySQL Database
- ✅ Full CRUD operations
- ✅ Security best practices
- ✅ Proper error handling

**Everything is ready to connect to your frontend!** 🚀

