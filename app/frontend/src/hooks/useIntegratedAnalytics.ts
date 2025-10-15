import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAnalyticsSummary } from '../store/slices/analyticsSlice';
import { createAnalyticsSelector } from '../store/selectors/analyticsSelectors';
import { AnalyticsFilters } from '../types/analytics.types';

/**
 * Hook that integrates both local analytics calculations and backend API data
 * Provides a unified interface for analytics data
 */
export const useIntegratedAnalytics = (filters: AnalyticsFilters) => {
  const dispatch = useAppDispatch();
  
  // Local analytics data (calculated from Redux state)
  const analyticsSelector = useMemo(
    () =>
      createAnalyticsSelector(
        filters.dateRange,
        filters.selectedRoomIds,
        filters.workHours
      ),
    [filters.dateRange, filters.selectedRoomIds, filters.workHours]
  );

  const localAnalyticsData = useAppSelector(analyticsSelector);
  
  // Backend analytics data
  const { summary, loading, error, lastFetched } = useAppSelector((state) => state.analytics);

  // Fetch backend analytics when filters change
  useEffect(() => {
    const params = {
      startDate: filters.dateRange.start.toISOString(),
      endDate: filters.dateRange.end.toISOString(),
      roomId: filters.selectedRoomIds.length === 1 ? filters.selectedRoomIds[0] : undefined,
    };

    dispatch(fetchAnalyticsSummary(params));
  }, [dispatch, filters.dateRange, filters.selectedRoomIds]);

  // Combine local and backend data
  const integratedData = useMemo(() => {
    // Use backend data if available, otherwise fall back to local calculations
    const kpis = summary ? {
      utilizationRate: summary.utilization,
      availableNow: summary.availableRooms,
      totalActiveRooms: summary.totalRooms,
      peakHour: summary.peakHour,
      avgMeetingLength: summary.avgMeetingDuration,
      topRoom: summary.topRoom ? {
        name: summary.topRoom.name,
        minutes: parseBookedTimeToMinutes(summary.topRoom.bookedTime),
      } : null,
    } : localAnalyticsData.kpis;

    return {
      kpis,
      heatmapData: localAnalyticsData.heatmapData,
      trendData: localAnalyticsData.trendData,
      leaderboardData: localAnalyticsData.leaderboardData,
      leadTimeData: localAnalyticsData.leadTimeData,
      // Backend-specific data
      backendSummary: summary,
      isLoading: loading,
      error,
      lastFetched: lastFetched ? new Date(lastFetched) : null,
    };
  }, [localAnalyticsData, summary, loading, error, lastFetched]);

  return integratedData;
};

/**
 * Helper function to parse booked time string to minutes
 * Converts "Xh Ym" format to total minutes
 */
function parseBookedTimeToMinutes(bookedTime: string): number {
  const match = bookedTime.match(/(\d+)h\s*(\d+)m/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }
  return 0;
}
