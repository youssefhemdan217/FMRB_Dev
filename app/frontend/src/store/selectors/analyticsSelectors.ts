import { createSelector } from '@reduxjs/toolkit';
import { DateRange } from '../../types/analytics.types';
import {
  calculateKPIMetrics,
  getHourlyHeatmap,
  getDailyTrend,
  getRoomLeaderboard,
  getLeadTimeDistribution,
} from '../../utils/analyticsCalculators';
import { selectAllRooms, selectAllBookings } from './roomSelectors';

/**
 * Create analytics data selector with filters
 */
export const createAnalyticsSelector = (
  dateRange: DateRange,
  selectedRoomIds: string[],
  workHours: { start: string; end: string }
) => {
  return createSelector(
    [selectAllBookings, selectAllRooms],
    (allBookings, allRooms) => {
      // Filter bookings by selected rooms if any are specified
      const bookings =
        selectedRoomIds.length > 0
          ? allBookings.filter((b) => selectedRoomIds.includes(b.roomId))
          : allBookings;

      // Filter rooms by selected rooms if any are specified
      const rooms =
        selectedRoomIds.length > 0
          ? allRooms.filter((r) => selectedRoomIds.includes(r.id))
          : allRooms;

      // Calculate KPIs
      const kpis = calculateKPIMetrics(bookings, rooms, dateRange, workHours);

      // Get heatmap data
      const heatmapData = getHourlyHeatmap(bookings, rooms, dateRange, workHours);

      // Get daily trend
      const trendData = getDailyTrend(bookings, dateRange, workHours);

      // Get room leaderboard
      const leaderboardData = getRoomLeaderboard(bookings, rooms, dateRange, workHours);

      // Get lead time distribution
      const leadTimeData = getLeadTimeDistribution(bookings, dateRange);

      return {
        kpis,
        heatmapData,
        trendData,
        leaderboardData,
        leadTimeData,
      };
    }
  );
};

