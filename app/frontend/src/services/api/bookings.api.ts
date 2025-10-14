/**
 * Bookings API Service
 * Handles all booking-related API calls
 */

import apiClient from '../apiClient';
import { serverConfig } from '../../config/server.config';

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizer?: string;
  start: string; // ISO date string
  end: string;   // ISO date string
  createdAt: string; // ISO date string
}

export interface CreateBookingDTO {
  roomId: string;
  title: string;
  organizer?: string;
  start: string; // ISO string
  end: string;   // ISO string
}

export interface UpdateBookingDTO {
  title?: string;
  organizer?: string;
  start?: string;
  end?: string;
}

export const bookingsApi = {
  /**
   * Get all bookings
   */
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(
      serverConfig.endpoints.bookings.base
    );
    return response.data;
  },

  /**
   * Get bookings by room ID
   */
  getByRoomId: async (roomId: string): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(
      serverConfig.endpoints.bookings.byRoomId(roomId)
    );
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(
      serverConfig.endpoints.bookings.byId(id)
    );
    return response.data;
  },

  /**
   * Create a new booking
   */
  create: async (data: CreateBookingDTO): Promise<Booking> => {
    const response = await apiClient.post<Booking>(
      serverConfig.endpoints.bookings.base,
      data
    );
    return response.data;
  },

  /**
   * Update a booking
   */
  update: async (id: string, data: UpdateBookingDTO): Promise<Booking> => {
    const response = await apiClient.put<Booking>(
      serverConfig.endpoints.bookings.byId(id),
      data
    );
    return response.data;
  },

  /**
   * Delete a booking
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(serverConfig.endpoints.bookings.byId(id));
  },
};

export default bookingsApi;

