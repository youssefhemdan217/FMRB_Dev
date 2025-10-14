/**
 * Analytics API Service
 * Handles all analytics-related API calls
 */

import apiClient from '../apiClient';
import { serverConfig } from '../../config/server.config';

export interface AnalyticsSummary {
  utilization: number;        // Percentage 0-100
  availableRooms: number;     // Free now
  totalRooms: number;         // Total active rooms
  peakHour: string;           // Busiest hour "HH:00"
  avgMeetingDuration: number; // Minutes
  topRoom: {
    name: string;
    bookedTime: string;       // "Xh Ym"
  } | null;
}

export interface AnalyticsQueryParams {
  startDate?: string; // ISO 8601 format
  endDate?: string;   // ISO 8601 format
  roomId?: string;
}

export const analyticsApi = {
  /**
   * Get analytics summary
   * @param params Optional query parameters (startDate, endDate, roomId)
   */
  getSummary: async (params?: AnalyticsQueryParams): Promise<AnalyticsSummary> => {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.roomId) {
      queryParams.append('roomId', params.roomId);
    }

    const url = `${serverConfig.endpoints.analytics.summary}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await apiClient.get<AnalyticsSummary>(url);
    return response.data;
  },
};

export default analyticsApi;

