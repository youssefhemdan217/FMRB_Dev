/**
 * API Services Index
 * Centralized export for all API services
 */

export { authApi } from './auth.api';
export { roomsApi } from './rooms.api';
export { bookingsApi } from './bookings.api';
export { analyticsApi } from './analytics.api';

// Re-export types
export type { RegisterDTO, LoginDTO, AuthResponse, User } from '../../types/auth.types';
export type { Room, RoomWithStatus, CreateRoomDTO, UpdateRoomDTO, WorkHours } from './rooms.api';
export type { Booking, CreateBookingDTO, UpdateBookingDTO } from './bookings.api';
export type { AnalyticsSummary, AnalyticsQueryParams } from './analytics.api';

