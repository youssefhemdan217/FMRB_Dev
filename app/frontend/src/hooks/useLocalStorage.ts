import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setRooms } from '../store/slices/roomsSlice';
import { setBookings } from '../store/slices/bookingsSlice';
import { generateMockData } from '../utils/mockData';
import { Room } from '../types/room.types';
import { Booking } from '../types/booking.types';

/**
 * Custom hook to handle localStorage persistence
 * Loads data on mount and initializes with mock data if empty
 */
export const useLocalStorage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Try to load from localStorage
    const loadData = () => {
      try {
        const storedRooms = localStorage.getItem('rooms');
        const storedBookings = localStorage.getItem('bookings');

        if (storedRooms && storedBookings) {
          // Load existing data
          const rooms: Room[] = JSON.parse(storedRooms);
          const bookings: Booking[] = JSON.parse(storedBookings);
          
          dispatch(setRooms(rooms));
          dispatch(setBookings(bookings));
        } else {
          // Initialize with mock data
          const { rooms, bookings } = generateMockData();
          
          dispatch(setRooms(rooms));
          dispatch(setBookings(bookings));
          
          // Save to localStorage
          localStorage.setItem('rooms', JSON.stringify(rooms));
          localStorage.setItem('bookings', JSON.stringify(bookings));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Fallback to mock data
        const { rooms, bookings } = generateMockData();
        dispatch(setRooms(rooms));
        dispatch(setBookings(bookings));
      }
    };

    loadData();
  }, [dispatch]);
};

