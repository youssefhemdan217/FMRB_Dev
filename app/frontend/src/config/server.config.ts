/**
 * Server Configuration
 * Centralized configuration for API endpoints and server settings
 */

export const serverConfig = {
  // Base API URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // Backend server URL (for WebSocket connections, etc.)
  serverURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
  
  // API endpoints
  endpoints: {
    auth: {
      register: '/auth/register',
      login: '/auth/login',
      logout: '/auth/logout',
    },
    rooms: {
      base: '/rooms',
      byId: (id: string) => `/rooms/${id}`,
    },
    bookings: {
      base: '/bookings',
      byId: (id: string) => `/bookings/${id}`,
      byRoomId: (roomId: string) => `/bookings?roomId=${roomId}`,
    },
    analytics: {
      summary: '/analytics/summary',
    },
  },
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Rate limit settings (matching backend)
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Token settings (tokens do not expire)
  token: {
    accessTokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
  },
  
  // Error messages
  errorMessages: {
    network: 'Network error. Please check your connection.',
    timeout: 'Request timeout. Please try again.',
    unauthorized: 'You are not authorized. Please login.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    conflict: 'A conflict occurred. The resource may already exist.',
    validation: 'Validation failed. Please check your input.',
    server: 'Server error. Please try again later.',
    unknown: 'An unexpected error occurred.',
  },
} as const;

export default serverConfig;

