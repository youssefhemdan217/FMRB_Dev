# 🔐 User Authentication & Booking Ownership Roadmap

## 📋 Table of Contents
- [Current State](#current-state)
- [Why user_id is Nullable](#why-user_id-is-nullable)
- [Database Design](#database-design)
- [Future Authentication Plans](#future-authentication-plans)
- [Migration Path](#migration-path)
- [Code Examples](#code-examples)

---

## 🎯 Current State (As of October 2025)

### What Works Now:
- ✅ **Bookings**: Fully functional (Create, Read, Delete)
- ✅ **Rooms**: Complete CRUD operations
- ✅ **Anonymous Bookings**: Anyone can create/delete any booking
- ✅ **Users Table**: Exists in database (ready for auth)
- ✅ **Frontend Auth Pages**: Login/Register pages built (not connected)

### What's NOT Implemented:
- ❌ **User Authentication**: No login/logout functionality
- ❌ **Booking Ownership**: Can't track who created a booking
- ❌ **Permissions**: No protection on edit/delete operations
- ❌ **JWT Tokens**: Backend has JWT config but not enforced

---

## 🔧 Why `user_id` is Nullable

### The Problem We Fixed:

**Error we encountered:**
```
Field 'user_id' doesn't have a default value
```

**Root Cause:**
- Database had `user_id INT NOT NULL` (required)
- But no authentication system to provide user IDs
- Mismatch between database design and implementation

**Solution Applied:**
```sql
ALTER TABLE bookings 
MODIFY COLUMN user_id INT NULL;
```

### Current Database Schema:

```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  user_id INT NULL,              -- ← NULLABLE (optional)
  title VARCHAR(255) NOT NULL,
  organizer VARCHAR(255),         -- Text field for name
  start DATETIME NOT NULL,
  end DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Why This Design is OK:

1. **Supports anonymous bookings** - Good for public kiosks, demos
2. **No authentication friction** - Quick MVP deployment
3. **Future-proof** - Can add auth later without breaking changes
4. **Dual-purpose** - Works with AND without authentication

---

## 📊 Database Design

### Current Booking Flow:

```javascript
// Frontend sends:
{
  "roomId": "7",
  "title": "Team Meeting",
  "organizer": "John Doe",  // Just text, anyone can put anything
  "start": "2025-10-17T08:00:00.000Z",
  "end": "2025-10-17T10:30:00.000Z"
}

// Backend stores:
{
  "id": 123,
  "room_id": 7,
  "user_id": null,           // ← No user tracking
  "title": "Team Meeting",
  "organizer": "John Doe",
  "start": "2025-10-17 08:00:00",
  "end": "2025-10-17 10:30:00"
}
```

### Issues with Current Approach:

| Issue | Impact | Severity |
|-------|--------|----------|
| No ownership tracking | Anyone can delete any booking | ⚠️ Medium |
| Fake organizer names | "CEO" when it's really an intern | ⚠️ Low |
| No accountability | Can't audit who created what | ⚠️ Medium |
| No user preferences | Can't save favorite rooms, etc. | ℹ️ Low |

---

## 🚀 Future Authentication Plans

### Phase 1: Current (✅ Complete)
- Anonymous bookings working
- Basic CRUD operations
- `user_id` is nullable

### Phase 2: Add Authentication (🔜 Next)

**Backend Changes Needed:**

1. **Enable Authentication Middleware**
   ```typescript
   // File: src/presentation/routes/booking.routes.ts
   
   // BEFORE (Current - Public routes):
   router.post('/', bookingController.create);
   router.delete('/:id', bookingController.delete);
   
   // AFTER (With optional auth):
   router.post('/', optionalAuth, bookingController.create);
   router.delete('/:id', optionalAuth, bookingController.delete);
   ```

2. **Auto-fill user_id when logged in**
   ```typescript
   // File: src/application/use-cases/bookings/CreateBooking.ts
   
   create = async (req: AuthRequest, res: Response) => {
     const bookingData = {
       ...req.body,
       userId: req.user?.id || null,  // Auto-fill if logged in
       organizer: req.user?.name || req.body.organizer
     };
     
     const booking = await this.createBookingUseCase.execute(bookingData);
     res.status(201).json(booking);
   };
   ```

3. **Add ownership validation for delete**
   ```typescript
   // File: src/presentation/controllers/BookingController.ts
   
   delete = async (req: AuthRequest, res: Response) => {
     const booking = await this.bookingRepository.findById(req.params.id);
     
     // Allow delete if:
     // 1. No user_id (anonymous booking) - anyone can delete
     // 2. User owns the booking
     // 3. User is admin
     if (booking.userId && 
         booking.userId !== req.user?.id && 
         req.user?.role !== 'admin') {
       throw new ForbiddenError('Cannot delete other users bookings');
     }
     
     await this.bookingRepository.delete(req.params.id);
     res.status(204).send();
   };
   ```

**Frontend Changes Needed:**

1. **Connect Login/Register pages to backend**
   ```typescript
   // File: src/services/api/auth.api.ts
   // Already exists! Just needs testing
   ```

2. **Store JWT token**
   ```typescript
   // After successful login:
   localStorage.setItem('accessToken', response.accessToken);
   ```

3. **Add token to API requests**
   ```typescript
   // File: src/services/apiClient.ts
   // Already implemented! Token auto-added from localStorage
   ```

### Phase 3: Enforce Authentication (🎯 Production)

**Make authentication required:**

```sql
-- Make user_id required for new bookings
ALTER TABLE bookings 
MODIFY COLUMN user_id INT NOT NULL;

-- Migrate existing anonymous bookings to a default user
UPDATE bookings 
SET user_id = 1  -- "Anonymous" user
WHERE user_id IS NULL;
```

**Update routes:**
```typescript
// Require auth for all booking operations
router.post('/', authenticate, bookingController.create);
router.delete('/:id', authenticate, bookingController.delete);
```

---

## 🛣️ Migration Path

### Gradual Migration Strategy (Recommended):

```
┌─────────────────────────────────────────────────────────┐
│ Stage 1: Current (Anonymous)                            │
│ ✅ Anyone can book                                      │
│ ✅ Anyone can delete                                    │
│ user_id: NULL                                           │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Stage 2: Optional Auth (Hybrid) ← RECOMMENDED           │
│ ✅ Logged-in users: auto-tracked                       │
│ ✅ Anonymous users: still allowed                       │
│ ✅ Users can only delete their own bookings            │
│ user_id: NULL or ID                                     │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Stage 3: Required Auth (Strict)                         │
│ ✅ Must login to book                                   │
│ ✅ Full accountability                                  │
│ ✅ Advanced features (recurring, notifications)        │
│ user_id: NOT NULL                                       │
└─────────────────────────────────────────────────────────┘
```

### Migration Checklist:

**When you're ready to add authentication:**

- [ ] Test existing login/register endpoints
- [ ] Update BookingController to accept optional user
- [ ] Add middleware: `optionalAuth` for backward compatibility
- [ ] Update frontend to store JWT tokens
- [ ] Add "My Bookings" page to show user's bookings
- [ ] Add delete protection (users can only delete their own)
- [ ] Test both logged-in and anonymous flows
- [ ] Update API documentation
- [ ] Consider: Should anonymous bookings still be allowed?

**When moving to required authentication:**

- [ ] Migrate existing `NULL` user_id bookings to default user
- [ ] Change `user_id` to `NOT NULL` in database
- [ ] Remove `optionalAuth`, use `authenticate` middleware
- [ ] Update frontend to require login for booking
- [ ] Update error messages for unauthenticated users
- [ ] Add admin panel to manage bookings

---

## 💻 Code Examples

### Example: Optional Authentication Middleware

```typescript
// File: src/presentation/middlewares/optionalAuth.ts

export const optionalAuth = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Token provided - verify it
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await userRepository.findById(decoded.userId);
    } else {
      // No token - that's OK, continue without user
      req.user = null;
    }
    
    next();
  } catch (error) {
    // Invalid token - continue without user (don't block request)
    req.user = null;
    next();
  }
};
```

### Example: Smart Booking Creation

```typescript
// File: src/application/use-cases/bookings/CreateBooking.ts

export class CreateBookingUseCase {
  async execute(data: CreateBookingDTO, user?: User): Promise<Booking> {
    const bookingData: BookingCreateData = {
      roomId: data.roomId,
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      
      // Smart user handling:
      userId: user?.id || null,
      
      // Auto-fill organizer from user, or use provided value
      organizer: user?.name || data.organizer || 'Anonymous'
    };
    
    // ... validation and creation logic
    
    return await this.bookingRepository.create(bookingData);
  }
}
```

### Example: Permission Check

```typescript
// File: src/application/use-cases/bookings/DeleteBooking.ts

export class DeleteBookingUseCase {
  async execute(bookingId: string, user?: User): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);
    
    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }
    
    // Permission logic:
    const isAnonymousBooking = !booking.userId;
    const isOwner = booking.userId === user?.id;
    const isAdmin = user?.role === 'admin';
    
    if (!isAnonymousBooking && !isOwner && !isAdmin) {
      throw new ForbiddenError(
        'You can only delete your own bookings'
      );
    }
    
    await this.bookingRepository.delete(bookingId);
  }
}
```

---

## 📚 Additional Resources

- **JWT Guide**: See `src/config/jwt.config.ts` for token configuration
- **Auth Middleware**: Check `src/presentation/middlewares/authenticate.ts`
- **User Repository**: Review `src/infrastructure/database/MySQLUserRepository.ts`
- **Frontend Auth**: See `src/services/api/auth.api.ts`

---

## 🤔 Decision Log

### Why we chose Nullable user_id:

**Decision Date**: October 2025

**Context:**
- Building MVP quickly
- Authentication system exists but not connected
- Need working booking system now

**Decision:**
Make `user_id` nullable to support anonymous bookings

**Consequences:**
- ✅ **Pros**: Quick deployment, no login friction, flexible
- ⚠️ **Cons**: No ownership tracking, potential security issues
- 🔄 **Reversible**: Can be changed later without data loss

**Review Date**: When moving to beta/production

---

## 🎯 Quick Reference

### Current Setup:
```
Authentication: ❌ Not implemented
user_id field:  ✅ Nullable (INT NULL)
Booking access: 🌍 Public (anyone can CRUD)
Best for:       📝 Demo, MVP, Internal tools
```

### Recommended Next Step:
```
1. Test login/register endpoints
2. Implement optional authentication
3. Track user_id for logged-in users
4. Add "My Bookings" feature
5. Add delete permissions
```

---

**Last Updated**: October 2025  
**Status**: Current approach is VALID for MVP  
**Next Review**: Before production deployment

