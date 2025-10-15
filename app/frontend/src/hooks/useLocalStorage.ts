import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { fetchAllBookings } from '../store/slices/bookingsSlice';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle data initialization
 * Fetches bookings from the backend API only when needed
 * Note: Must be used inside Router context
 */
export const useLocalStorage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // Only fetch all bookings on pages that need all bookings data
    // Individual room pages will fetch their own bookings
    const needsAllBookings = location.pathname === '/rooms' || location.pathname === '/';
    
    if (needsAllBookings) {
      const loadData = async () => {
        try {
          await dispatch(fetchAllBookings());
        } catch (error) {
          console.error('Error loading bookings from API:', error);
        }
      };

      loadData();
    }
  }, [dispatch, location.pathname]);
};

