import axios from 'axios';
import { Room } from '../types/room.types';
import { Booking } from '../types/booking.types';

/**
 * Axios instance configured with base URL from environment
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth headers (future use)
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

/**
 * API functions for rooms
 */
export const roomsApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },

  getById: async (id: string): Promise<Room> => {
    const response = await apiClient.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  create: async (room: Omit<Room, 'id'>): Promise<Room> => {
    const response = await apiClient.post<Room>('/rooms', room);
    return response.data;
  },

  update: async (id: string, room: Partial<Room>): Promise<Room> => {
    const response = await apiClient.put<Room>(`/rooms/${id}`, room);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};

/**
 * API functions for bookings
 */
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  getByRoomId: async (roomId: string): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/bookings?roomId=${roomId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', booking);
    return response.data;
  },

  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}`, booking);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};

export default apiClient;

