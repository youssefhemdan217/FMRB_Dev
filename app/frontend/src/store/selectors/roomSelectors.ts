import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Room, RoomStatus } from '../../types/room.types';
import { getCurrentStatus } from '../../utils/dateUtils';

/**
 * Select all rooms
 */
export const selectAllRooms = (state: RootState): Room[] => state.rooms.rooms;

/**
 * Select active rooms only
 */
export const selectActiveRooms = createSelector(
  [selectAllRooms],
  (rooms) => rooms.filter((room) => room.isActive)
);

/**
 * Select room by ID
 */
export const selectRoomById = (roomId: string) => (state: RootState): Room | undefined => {
  return state.rooms.rooms.find((room) => room.id === roomId);
};

/**
 * Select all bookings
 */
export const selectAllBookings = (state: RootState) => state.bookings.bookings;

/**
 * Select bookings for a specific room
 */
export const selectBookingsByRoomId = (roomId: string) =>
  createSelector([selectAllBookings], (bookings) =>
    bookings.filter((booking) => booking.roomId === roomId)
  );

/**
 * Select room with current status
 */
export const selectRoomWithStatus = (roomId: string, now: Date = new Date()) =>
  createSelector(
    [selectRoomById(roomId), selectBookingsByRoomId(roomId)],
    (room, bookings) => {
      if (!room) return null;

      // If room is not active, it's unavailable
      if (!room.isActive) {
        return {
          ...room,
          status: 'unavailable' as RoomStatus,
          statusMessage: 'Room is currently out of service',
          nextChange: undefined,
        };
      }

      // Get current status based on bookings
      const { isBusy, currentBooking, nextBooking } = getCurrentStatus(bookings, now);

      const status: RoomStatus = isBusy ? 'busy' : 'available';
      
      let statusMessage = '';
      let nextChange: string | undefined;

      if (isBusy && currentBooking) {
        statusMessage = `Busy until ${new Date(currentBooking.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        nextChange = currentBooking.end;
      } else if (nextBooking) {
        statusMessage = `Available until ${new Date(nextBooking.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        nextChange = nextBooking.start;
      } else {
        statusMessage = 'Available';
      }

      return {
        ...room,
        status,
        statusMessage,
        nextChange,
      };
    }
  );

/**
 * Select rooms loading state
 */
export const selectRoomsLoading = (state: RootState): boolean => state.rooms.loading;

/**
 * Select rooms error
 */
export const selectRoomsError = (state: RootState): string | null => state.rooms.error;

