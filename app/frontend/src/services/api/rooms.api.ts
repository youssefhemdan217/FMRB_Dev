/**
 * Rooms API Service
 * Handles all room-related API calls
 */

import apiClient from '../apiClient';
import { serverConfig } from '../../config/server.config';

export interface WorkHours {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  workHours: WorkHours;
  amenities?: string[];
}

export interface RoomWithStatus extends Room {
  status: 'available' | 'occupied' | 'closed';
  statusMessage: string;
  nextChange?: string; // ISO date string
}

export interface CreateRoomDTO {
  name: string;
  location: string;
  capacity: number;
  isActive?: boolean;
  workHours: WorkHours;
  amenities?: string[];
}

export interface UpdateRoomDTO {
  name?: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
  workHours?: WorkHours;
  amenities?: string[];
}

export const roomsApi = {
  /**
   * Get all rooms (with status)
   */
  getAll: async (): Promise<RoomWithStatus[]> => {
    const response = await apiClient.get<RoomWithStatus[]>(
      serverConfig.endpoints.rooms.base
    );
    return response.data;
  },

  /**
   * Get room by ID (without status)
   */
  getById: async (id: string): Promise<Room> => {
    const response = await apiClient.get<Room>(
      serverConfig.endpoints.rooms.byId(id)
    );
    return response.data;
  },

  /**
   * Create a new room (requires auth)
   */
  create: async (data: CreateRoomDTO): Promise<Room> => {
    const response = await apiClient.post<Room>(
      serverConfig.endpoints.rooms.base,
      data
    );
    return response.data;
  },

  /**
   * Update a room (requires auth)
   */
  update: async (id: string, data: UpdateRoomDTO): Promise<Room> => {
    const response = await apiClient.put<Room>(
      serverConfig.endpoints.rooms.byId(id),
      data
    );
    return response.data;
  },

  /**
   * Delete a room (requires auth + admin)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(serverConfig.endpoints.rooms.byId(id));
  },
};

export default roomsApi;

