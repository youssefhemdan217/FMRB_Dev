import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setBookings } from '../store/slices/bookingsSlice';
import { Booking } from '../types/booking.types';

/**
 * Custom hook to handle localStorage persistence for bookings
 * Note: Rooms are now fetched from the backend API, not localStorage
 */
export const useLocalStorage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load bookings from localStorage (until Phase 3 integration)
    const loadData = () => {
      try {
        const storedBookings = localStorage.getItem('bookings');

        if (storedBookings) {
          const bookings: Booking[] = JSON.parse(storedBookings);
          dispatch(setBookings(bookings));
        }
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    };

    loadData();
  }, [dispatch]);
};

