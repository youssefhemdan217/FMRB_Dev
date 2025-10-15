import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../store';
import { fetchAllBookings } from '../store/slices/bookingsSlice';
import { fetchRooms } from '../store/slices/roomsSlice';

export interface UseRealTimeAnalyticsOptions {
  enabled?: boolean;
  intervalMs?: number;
  onUpdate?: () => void;
}

/**
 * Hook for real-time analytics updates
 * Polls the backend for fresh data at regular intervals
 */
export const useRealTimeAnalytics = (options: UseRealTimeAnalyticsOptions = {}) => {
  const {
    enabled = true,
    intervalMs = 30000, // 30 seconds default
    onUpdate,
  } = options;

  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const refreshData = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      // Fetch fresh data from backend
      await Promise.all([
        dispatch(fetchAllBookings()),
        dispatch(fetchRooms()),
      ]);
      
      setLastUpdate(new Date().toISOString());
      onUpdate?.();
    } catch (error) {
      console.error('Failed to refresh analytics data:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial data fetch
    refreshData();

    // Set up polling interval
    intervalRef.current = setInterval(refreshData, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs]);

  const manualRefresh = () => {
    refreshData();
  };

  return {
    isUpdating,
    lastUpdate,
    manualRefresh,
  };
};
