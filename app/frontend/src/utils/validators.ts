import { parseISO, isAfter } from 'date-fns';
import { Booking, BookingValidationErrors } from '../types/booking.types';
import { isOverlapping } from './dateUtils';

/**
 * Validate booking times (end must be after start)
 */
export const validateBookingTimes = (start: string, end: string): boolean => {
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    return isAfter(endDate, startDate);
  } catch {
    return false;
  }
};

/**
 * Validate that a new booking doesn't overlap with existing bookings
 */
export const validateNoOverlap = (
  newBooking: { start: string; end: string; id?: string },
  existingBookings: Booking[]
): { isValid: boolean; overlappingBooking?: Booking } => {
  // Filter out the booking being edited (if it has an id)
  const bookingsToCheck = newBooking.id
    ? existingBookings.filter((b) => b.id !== newBooking.id)
    : existingBookings;

  const overlapping = bookingsToCheck.find((booking) =>
    isOverlapping(newBooking, booking)
  );

  return {
    isValid: !overlapping,
    overlappingBooking: overlapping,
  };
};

/**
 * Comprehensive booking validation
 */
export const validateBooking = (
  data: {
    title: string;
    start: string;
    end: string;
    id?: string;
  },
  existingBookings: Booking[]
): { isValid: boolean; errors: BookingValidationErrors } => {
  const errors: BookingValidationErrors = {};

  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Validate start time
  if (!data.start) {
    errors.start = 'Start time is required';
  }

  // Validate end time
  if (!data.end) {
    errors.end = 'End time is required';
  }

  // Validate that end is after start
  if (data.start && data.end && !validateBookingTimes(data.start, data.end)) {
    errors.end = 'End time must be after start time';
  }

  // Validate no overlap
  if (data.start && data.end && !errors.end) {
    const overlapCheck = validateNoOverlap(
      { start: data.start, end: data.end, id: data.id },
      existingBookings
    );

    if (!overlapCheck.isValid) {
      errors.overlap = `This time slot overlaps with "${overlapCheck.overlappingBooking?.title}"`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate room data
 */
export const validateRoom = (data: {
  name: string;
  location: string;
  capacity: number;
  workHours: { start: string; end: string };
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Room name is required';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Room name must be less than 50 characters';
  }

  // Validate location
  if (!data.location || data.location.trim().length === 0) {
    errors.location = 'Location is required';
  }

  // Validate capacity
  if (!data.capacity || data.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  } else if (data.capacity > 1000) {
    errors.capacity = 'Capacity must be less than 1000';
  }

  // Validate work hours
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(data.workHours.start)) {
    errors.workHoursStart = 'Invalid start time format (use HH:mm)';
  }
  if (!timeRegex.test(data.workHours.end)) {
    errors.workHoursEnd = 'Invalid end time format (use HH:mm)';
  }

  // Validate that end is after start
  if (timeRegex.test(data.workHours.start) && timeRegex.test(data.workHours.end)) {
    const [startHour, startMin] = data.workHours.start.split(':').map(Number);
    const [endHour, endMin] = data.workHours.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      errors.workHoursEnd = 'End time must be after start time';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

