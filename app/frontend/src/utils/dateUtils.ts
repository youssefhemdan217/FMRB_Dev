import { 
  parseISO, 
  format, 
  differenceInMinutes,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  addDays,
  startOfToday
} from 'date-fns';
import { Booking } from '../types/booking.types';

/**
 * Check if two bookings overlap in time
 */
export const isOverlapping = (
  booking1: { start: string; end: string },
  booking2: { start: string; end: string }
): boolean => {
  const start1 = parseISO(booking1.start);
  const end1 = parseISO(booking1.end);
  const start2 = parseISO(booking2.start);
  const end2 = parseISO(booking2.end);

  // Two bookings overlap if one starts before the other ends
  // But back-to-back meetings (end1 === start2 or end2 === start1) are allowed
  return (
    (start1 < end2 && end1 > start2) &&
    !(end1.getTime() === start2.getTime() || end2.getTime() === start1.getTime())
  );
};

/**
 * Calculate booked minutes clipped to work hours
 */
export const clipToWorkHours = (
  start: string,
  end: string,
  workHours: { start: string; end: string }
): number => {
  const bookingStart = parseISO(start);
  const bookingEnd = parseISO(end);
  
  // Get the date part and construct work hour boundaries
  const dateStr = format(bookingStart, 'yyyy-MM-dd');
  const workStart = parseISO(`${dateStr}T${workHours.start}:00`);
  const workEnd = parseISO(`${dateStr}T${workHours.end}:00`);

  // Clip the booking to work hours
  const clippedStart = isAfter(bookingStart, workStart) ? bookingStart : workStart;
  const clippedEnd = isBefore(bookingEnd, workEnd) ? bookingEnd : workEnd;

  // If the clipped range is invalid, return 0
  if (clippedStart >= clippedEnd) {
    return 0;
  }

  return differenceInMinutes(clippedEnd, clippedStart);
};

/**
 * Get the current status of a room based on active bookings
 */
export const getCurrentStatus = (
  bookings: Booking[],
  now: Date = new Date()
): { 
  isBusy: boolean; 
  currentBooking?: Booking;
  nextBooking?: Booking;
} => {
  const nowTime = now.getTime();

  // Find current booking
  const currentBooking = bookings.find((booking) => {
    const start = parseISO(booking.start).getTime();
    const end = parseISO(booking.end).getTime();
    return nowTime >= start && nowTime < end;
  });

  // Find next booking
  const futureBookings = bookings
    .filter((booking) => parseISO(booking.start).getTime() > nowTime)
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const nextBooking = futureBookings[0];

  return {
    isBusy: !!currentBooking,
    currentBooking,
    nextBooking,
  };
};

/**
 * Format time for display (e.g., "14:30")
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm');
};

/**
 * Format date for display (e.g., "Oct 8, 2025")
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

/**
 * Format datetime for display (e.g., "Oct 8, 2025 14:30")
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy HH:mm');
};

/**
 * Get date range for analytics presets
 */
export const getDateRangeForPreset = (preset: 'today' | 'last7' | 'last30'): { start: Date; end: Date } => {
  const today = startOfToday();
  
  switch (preset) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'last7':
      return {
        start: startOfDay(addDays(today, -6)),
        end: endOfDay(today),
      };
    case 'last30':
      return {
        start: startOfDay(addDays(today, -29)),
        end: endOfDay(today),
      };
  }
};

/**
 * Check if a booking is within a date range
 */
export const isBookingInRange = (
  booking: Booking,
  range: { start: Date; end: Date }
): boolean => {
  const bookingStart = parseISO(booking.start);
  const bookingEnd = parseISO(booking.end);
  
  // Booking overlaps with range if it starts before range ends and ends after range starts
  return bookingStart < range.end && bookingEnd > range.start;
};

/**
 * Parse time string (HH:mm) and combine with date
 */
export const combineDateTime = (date: Date, time: string): Date => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return parseISO(`${dateStr}T${time}:00`);
};

/**
 * Calculate total work minutes in a day
 */
export const getWorkMinutesPerDay = (workHours: { start: string; end: string }): number => {
  const [startHour, startMinute] = workHours.start.split(':').map(Number);
  const [endHour, endMinute] = workHours.end.split(':').map(Number);
  
  return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
};

/**
 * Calculate room status from room and bookings (utility function, not a hook)
 */
export const calculateRoomStatus = (
  room: { isActive: boolean } | null | undefined,
  bookings: Booking[],
  now: Date = new Date()
): {
  status: 'available' | 'busy' | 'unavailable';
  statusMessage: string;
  nextChange?: string;
} => {
  if (!room) {
    return {
      status: 'unavailable',
      statusMessage: 'Room not found',
    };
  }

  if (!room.isActive) {
    return {
      status: 'unavailable',
      statusMessage: 'Room is currently out of service',
    };
  }

  const { isBusy, currentBooking, nextBooking } = getCurrentStatus(bookings, now);

  const status = isBusy ? 'busy' : 'available';
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
};

