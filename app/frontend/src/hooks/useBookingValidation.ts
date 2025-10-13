import { useMemo } from 'react';
import { Booking, BookingValidationErrors } from '../types/booking.types';
import { validateBooking } from '../utils/validators';

export interface UseBookingValidationResult {
  errors: BookingValidationErrors;
  isValid: boolean;
  validate: (data: {
    title: string;
    start: string;
    end: string;
    id?: string;
  }) => { isValid: boolean; errors: BookingValidationErrors };
}

/**
 * Custom hook for booking validation
 */
export const useBookingValidation = (
  existingBookings: Booking[]
): UseBookingValidationResult => {
  const validate = useMemo(
    () => (data: { title: string; start: string; end: string; id?: string }) => {
      return validateBooking(data, existingBookings);
    },
    [existingBookings]
  );

  return {
    errors: {},
    isValid: true,
    validate,
  };
};

