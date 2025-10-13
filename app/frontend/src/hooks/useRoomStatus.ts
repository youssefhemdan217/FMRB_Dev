import { useMemo } from 'react';
import { Booking } from '../types/booking.types';
import { Room, RoomStatus } from '../types/room.types';
import { getCurrentStatus } from '../utils/dateUtils';

export interface UseRoomStatusResult {
  status: RoomStatus;
  statusMessage: string;
  nextChange?: string;
}

/**
 * Custom hook to calculate room status based on bookings
 */
export const useRoomStatus = (room: Room | null | undefined, bookings: Booking[]): UseRoomStatusResult => {
  return useMemo(() => {
    if (!room) {
      return {
        status: 'unavailable' as RoomStatus,
        statusMessage: 'Room not found',
      };
    }

    if (!room.isActive) {
      return {
        status: 'unavailable' as RoomStatus,
        statusMessage: 'Room is currently out of service',
      };
    }

    const now = new Date();
    const { isBusy, currentBooking, nextBooking } = getCurrentStatus(bookings, now);

    const status: RoomStatus = isBusy ? 'busy' : 'available';
    let statusMessage = '';
    let nextChange: string | undefined;

    if (isBusy && currentBooking) {
      statusMessage = `Busy until ${new Date(currentBooking.end).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      nextChange = currentBooking.end;
    } else if (nextBooking) {
      statusMessage = `Available until ${new Date(nextBooking.start).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      nextChange = nextBooking.start;
    } else {
      statusMessage = 'Available';
    }

    return {
      status,
      statusMessage,
      nextChange,
    };
  }, [room, bookings]);
};

