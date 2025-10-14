# Frontend API Integration Guide

This guide explains how to use the centralized API structure in the FMRB frontend application.

## 📁 Project Structure

```
src/
├── config/
│   └── server.config.ts          # Centralized server configuration
├── services/
│   ├── apiClient.ts               # Axios instance with interceptors
│   └── api/
│       ├── index.ts               # Export all API services
│       ├── auth.api.ts            # Authentication endpoints
│       ├── rooms.api.ts           # Rooms endpoints
│       ├── bookings.api.ts        # Bookings endpoints
│       └── analytics.api.ts       # Analytics endpoints
├── utils/
│   └── errorHandler.ts            # Error handling utilities
├── components/
│   └── common/
│       ├── Toast.tsx              # Toast notification (MUI)
│       └── ConfirmDialog.tsx      # Confirmation dialog
├── hooks/
│   └── useConfirm.ts              # Confirmation dialog hook
├── store/
│   └── slices/
│       ├── authSlice.ts           # Auth Redux slice
│       ├── roomsSlice.ts          # Rooms Redux slice
│       ├── bookingsSlice.ts       # Bookings Redux slice
│       └── uiSlice.ts             # UI state (toasts, etc.)
└── types/
    ├── auth.types.ts              # Auth type definitions
    ├── room.types.ts              # Room type definitions
    ├── booking.types.ts           # Booking type definitions
    └── analytics.types.ts         # Analytics type definitions
```

---

## 🔧 Configuration

### Server Configuration

All API endpoints and configuration are centralized in `config/server.config.ts`:

```typescript
import { serverConfig } from './config/server.config';

// Access base URL
console.log(serverConfig.baseURL); // http://localhost:3000/api/v1

// Access endpoints
console.log(serverConfig.endpoints.rooms.base); // /rooms
console.log(serverConfig.endpoints.rooms.byId('123')); // /rooms/123

// Access token keys
console.log(serverConfig.token.accessTokenKey); // accessToken
```

### Environment Variables

Create a `.env` file in the frontend root:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SERVER_URL=http://localhost:3000
VITE_NODE_ENV=development
```

---

## 🚀 Using API Services

### 1. Authentication

```typescript
import { authApi } from './services/api';

// Register
const registerUser = async () => {
  try {
    const response = await authApi.register({
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
    });
    console.log('User registered:', response.user);
    console.log('Access token:', response.accessToken);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Login
const loginUser = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('User logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Logout
authApi.logout();

// Check if authenticated
const isAuth = authApi.isAuthenticated();

// Get current user
const currentUser = authApi.getCurrentUser();
```

### 2. Rooms

```typescript
import { roomsApi } from './services/api';

// Get all rooms
const fetchRooms = async () => {
  try {
    const rooms = await roomsApi.getAll();
    console.log('Rooms:', rooms);
    // Each room includes status, statusMessage, nextChange
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
  }
};

// Get room by ID
const fetchRoom = async (id: string) => {
  try {
    const room = await roomsApi.getById(id);
    console.log('Room:', room);
  } catch (error) {
    console.error('Failed to fetch room:', error);
  }
};

// Create room (requires authentication)
const createRoom = async () => {
  try {
    const newRoom = await roomsApi.create({
      name: 'Conference Room A',
      location: 'Building 1, Floor 2',
      capacity: 10,
      workHours: { start: '09:00', end: '17:00' },
      amenities: ['Projector', 'Whiteboard'],
    });
    console.log('Room created:', newRoom);
  } catch (error) {
    console.error('Failed to create room:', error);
  }
};

// Update room (requires authentication)
const updateRoom = async (id: string) => {
  try {
    const updated = await roomsApi.update(id, {
      capacity: 12,
      isActive: true,
    });
    console.log('Room updated:', updated);
  } catch (error) {
    console.error('Failed to update room:', error);
  }
};

// Delete room (requires authentication + admin)
const deleteRoom = async (id: string) => {
  try {
    await roomsApi.delete(id);
    console.log('Room deleted');
  } catch (error) {
    console.error('Failed to delete room:', error);
  }
};
```

### 3. Bookings

```typescript
import { bookingsApi } from './services/api';

// Get all bookings
const fetchBookings = async () => {
  try {
    const bookings = await bookingsApi.getAll();
    console.log('Bookings:', bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
  }
};

// Get bookings by room ID
const fetchRoomBookings = async (roomId: string) => {
  try {
    const bookings = await bookingsApi.getByRoomId(roomId);
    console.log('Room bookings:', bookings);
  } catch (error) {
    console.error('Failed to fetch room bookings:', error);
  }
};

// Create booking
const createBooking = async () => {
  try {
    const booking = await bookingsApi.create({
      roomId: 'room-123',
      title: 'Team Meeting',
      organizer: 'john.doe@example.com',
      start: new Date('2025-10-14T10:00:00Z').toISOString(),
      end: new Date('2025-10-14T11:00:00Z').toISOString(),
    });
    console.log('Booking created:', booking);
  } catch (error) {
    console.error('Failed to create booking:', error);
  }
};

// Delete booking
const deleteBooking = async (id: string) => {
  try {
    await bookingsApi.delete(id);
    console.log('Booking deleted');
  } catch (error) {
    console.error('Failed to delete booking:', error);
  }
};
```

### 4. Analytics

```typescript
import { analyticsApi } from './services/api';

// Get analytics summary (last 7 days by default)
const fetchAnalytics = async () => {
  try {
    const summary = await analyticsApi.getSummary();
    console.log('Utilization:', summary.utilization);
    console.log('Available rooms:', summary.availableRooms);
    console.log('Peak hour:', summary.peakHour);
    console.log('Top room:', summary.topRoom);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }
};

// Get analytics with custom date range
const fetchCustomAnalytics = async () => {
  try {
    const summary = await analyticsApi.getSummary({
      startDate: '2025-10-01',
      endDate: '2025-10-14',
      roomId: 'room-123', // Optional: filter by room
    });
    console.log('Custom analytics:', summary);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }
};
```

---

## 🎯 Using Redux (Async Thunks)

### Auth Slice Example

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { register, login, logout } from '../store/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(login({
      email: 'user@example.com',
      password: 'password123',
    }));

    if (login.fulfilled.match(result)) {
      console.log('Login successful:', result.payload.user);
    } else {
      console.error('Login failed:', result.payload);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

---

## 🔔 Toast Notifications

### Using the Toast Component

The Toast component is already integrated with Redux. Just dispatch the `showToast` action:

```typescript
import { useAppDispatch } from '../store';
import { showToast } from '../store/slices/uiSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  const showSuccessMessage = () => {
    dispatch(showToast({
      message: 'Operation completed successfully!',
      type: 'success',
    }));
  };

  const showErrorMessage = () => {
    dispatch(showToast({
      message: 'Something went wrong!',
      type: 'error',
    }));
  };

  const showInfoMessage = () => {
    dispatch(showToast({
      message: 'This is an informational message',
      type: 'info',
    }));
  };

  return (
    <div>
      <button onClick={showSuccessMessage}>Show Success</button>
      <button onClick={showErrorMessage}>Show Error</button>
      <button onClick={showInfoMessage}>Show Info</button>
    </div>
  );
};
```

Make sure the `<Toast />` component is rendered in your app:

```typescript
// In App.tsx or AppLayout.tsx
import { Toast } from './components/common/Toast';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Toast />
    </div>
  );
}
```

---

## ✅ Confirmation Dialogs

### Using the useConfirm Hook

```typescript
import { useState } from 'react';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { roomsApi } from '../services/api';

const RoomManagement = () => {
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    const confirmed = await confirm({
      title: 'Delete Room',
      message: `Are you sure you want to delete "${roomName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        setLoading(true);
        await roomsApi.delete(roomId);
        // Show success message
        console.log('Room deleted successfully');
      } catch (error) {
        console.error('Failed to delete room:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <button onClick={() => handleDeleteRoom('room-123', 'Conference Room A')}>
        Delete Room
      </button>

      {/* Render the confirmation dialog */}
      <ConfirmDialog
        open={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        confirmColor={options.confirmColor}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};
```

---

## 🛡️ Error Handling

### Using Error Handler Utilities

```typescript
import {
  getErrorMessage,
  getErrorDetails,
  isUnauthorizedError,
  isNotFoundError,
  isConflictError,
  handleError,
} from '../utils/errorHandler';
import { roomsApi } from '../services/api';
import { showToast } from '../store/slices/uiSlice';
import { useAppDispatch } from '../store';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  const createRoom = async () => {
    try {
      const room = await roomsApi.create({
        name: 'New Room',
        location: 'Building 1',
        capacity: 10,
        workHours: { start: '09:00', end: '17:00' },
      });
      
      dispatch(showToast({
        message: 'Room created successfully!',
        type: 'success',
      }));
    } catch (error) {
      // Get user-friendly error message
      const errorMessage = handleError(error, 'Create Room');
      
      // Show error toast
      dispatch(showToast({
        message: errorMessage,
        type: 'error',
      }));

      // Handle specific errors
      if (isUnauthorizedError(error)) {
        // Redirect to login
        window.location.href = '/login';
      } else if (isConflictError(error)) {
        // Room name already exists
        console.log('Room with this name already exists');
      } else if (isNotFoundError(error)) {
        // Resource not found
        console.log('Resource not found');
      }

      // Get detailed error information
      const details = getErrorDetails(error);
      console.log('Error details:', details);
    }
  };

  return <button onClick={createRoom}>Create Room</button>;
};
```

---

## 🔐 Authentication Flow

### Protecting Routes

```typescript
import { Navigate } from 'react-router-dom';
import { authApi } from '../services/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authApi.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Usage in router
<Route
  path="/rooms/manage"
  element={
    <ProtectedRoute>
      <RoomManagementPage />
    </ProtectedRoute>
  }
/>
```

### Token Handling

Tokens are automatically:
- Stored in localStorage on login/register
- Added to all API requests via axios interceptor
- Removed on logout or 401 error
- Used for authentication checks

---

## 📦 Complete Example: Creating a Booking with Error Handling

```typescript
import { useState } from 'react';
import { useAppDispatch } from '../store';
import { bookingsApi } from '../services/api';
import { showToast } from '../store/slices/uiSlice';
import { handleError, isConflictError } from '../utils/errorHandler';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const BookingForm = ({ roomId }: { roomId: string }) => {
  const dispatch = useAppDispatch();
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    start: '',
    end: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show confirmation
    const confirmed = await confirm({
      title: 'Create Booking',
      message: 'Are you sure you want to create this booking?',
      confirmText: 'Create',
      confirmColor: 'primary',
    });

    if (!confirmed) return;

    try {
      setLoading(true);

      const booking = await bookingsApi.create({
        roomId,
        title: formData.title,
        organizer: formData.organizer,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
      });

      dispatch(showToast({
        message: 'Booking created successfully!',
        type: 'success',
      }));

      console.log('Created booking:', booking);
      
      // Reset form
      setFormData({ title: '', organizer: '', start: '', end: '' });
    } catch (error) {
      const errorMessage = handleError(error, 'Create Booking');
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error',
      }));

      // Handle conflict (time slot already booked)
      if (isConflictError(error)) {
        dispatch(showToast({
          message: 'This time slot is already booked. Please choose a different time.',
          type: 'warning',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Meeting Title"
        required
      />
      <input
        type="email"
        value={formData.organizer}
        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
        placeholder="Organizer Email"
      />
      <input
        type="datetime-local"
        value={formData.start}
        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        value={formData.end}
        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Booking'}
      </button>

      <ConfirmDialog
        open={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        confirmColor={options.confirmColor}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />
    </form>
  );
};
```

---

## 🎨 Best Practices

1. **Always use try-catch blocks** when calling API services
2. **Show user feedback** using toasts for success/error messages
3. **Use confirmation dialogs** for destructive actions (delete, etc.)
4. **Handle specific errors** when needed (401, 404, 409, etc.)
5. **Keep API logic in Redux thunks** for complex state management
6. **Use the centralized config** instead of hardcoding URLs
7. **Log errors in development** using the error handler utilities
8. **Validate form data** before sending to API
9. **Use loading states** to provide visual feedback
10. **Clean up on component unmount** to prevent memory leaks

---

## 📚 Additional Resources

- Backend API Documentation: `app/backend/FRONTEND_API_INTEGRATION.md`
- Postman Collection: `app/backend/FMRB_Postman.json`
- Server Config: `src/config/server.config.ts`
- Error Handler: `src/utils/errorHandler.ts`

---

## 🐛 Troubleshooting

### CORS Errors
Make sure the backend CORS origin matches your frontend URL (default: http://localhost:5173)

### 401 Unauthorized
- Check if token is stored in localStorage
- Verify token hasn't expired (15 minutes)
- Try logging in again

### Network Errors
- Ensure backend server is running on http://localhost:3000
- Check VITE_API_BASE_URL in .env file
- Verify firewall/antivirus settings

### Type Errors
- All types are defined in `src/types/` and `src/services/api/`
- Import types from `src/services/api` for consistency
- Use TypeScript strict mode for better type safety

