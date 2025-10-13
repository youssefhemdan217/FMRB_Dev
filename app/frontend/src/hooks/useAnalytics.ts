import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { createAnalyticsSelector } from '../store/selectors/analyticsSelectors';
import { AnalyticsFilters } from '../types/analytics.types';

/**
 * Custom hook for analytics data
 */
export const useAnalytics = (filters: AnalyticsFilters) => {
  const analyticsSelector = useMemo(
    () =>
      createAnalyticsSelector(
        filters.dateRange,
        filters.selectedRoomIds,
        filters.workHours
      ),
    [filters.dateRange, filters.selectedRoomIds, filters.workHours]
  );

  const analyticsData = useAppSelector(analyticsSelector);

  return analyticsData;
};

