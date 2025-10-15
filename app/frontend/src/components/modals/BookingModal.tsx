import { Modal } from '../common/Modal';
import { BookingForm } from '../forms/BookingForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeBookingModal, showToast } from '../../store/slices/uiSlice';
import { createBookingAsync, deleteBookingAsync } from '../../store/slices/bookingsSlice';
import { selectBookingsByRoomId } from '../../store/selectors/roomSelectors';
import { validateBooking } from '../../utils/validators';
import { BookingValidationErrors } from '../../types/booking.types';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export const BookingModal = () => {
  const dispatch = useAppDispatch();
  const { open, booking, roomId, mode } = useAppSelector((state) => state.ui.bookingModal);
  const { loading } = useAppSelector((state) => state.bookings);
  
  // Memoize the selector to avoid creating a new one on each render
  const bookingsByRoomIdSelector = useMemo(
    () => (roomId ? selectBookingsByRoomId(roomId) : null),
    [roomId]
  );
  
  const bookingsInRoom = useAppSelector((state) =>
    bookingsByRoomIdSelector ? bookingsByRoomIdSelector(state) : []
  );

  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [defaultTimes, setDefaultTimes] = useState<{ start?: Date; end?: Date }>({});

  // Handle sessionStorage for selected time slot
  useEffect(() => {
    if (open && mode === 'create') {
      try {
        const selectedSlot = sessionStorage.getItem('selectedSlot');
        if (selectedSlot) {
          const { start, end } = JSON.parse(selectedSlot);
          setDefaultTimes({
            start: new Date(start),
            end: new Date(end),
          });
          // Clear the session storage after using it
          sessionStorage.removeItem('selectedSlot');
        } else {
          // Set default times to current time + 1 hour
          const now = new Date();
          const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
          setDefaultTimes({
            start: now,
            end: nextHour,
          });
        }
      } catch (error) {
        console.error('Error reading selected slot from sessionStorage:', error);
        // Set default times to current time + 1 hour as fallback
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        setDefaultTimes({
          start: now,
          end: nextHour,
        });
      }
    }
  }, [open, mode]);

  const handleSubmit = async (data: {
    title: string;
    organizer?: string;
    start: string;
    end: string;
  }) => {
    if (!roomId) return;

    // Validate booking
    const validation = validateBooking(
      {
        ...data,
        id: booking?.id,
      },
      bookingsInRoom
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (mode === 'edit' && booking) {
      // Edit mode is not supported by the backend API
      dispatch(
        showToast({
          message: 'Editing bookings is not supported yet. Please delete and create a new booking.',
          type: 'warning',
        })
      );
      return;
    }

    // Create new booking
    try {
      const bookingData = {
        roomId,
        title: data.title,
        organizer: data.organizer,
        start: data.start,
        end: data.end,
      };

      const result = await dispatch(createBookingAsync(bookingData));
      
      if (createBookingAsync.fulfilled.match(result)) {
        dispatch(
          showToast({
            message: 'Booking created successfully',
            type: 'success',
          })
        );
        handleClose();
      } else {
        // Handle error
        const errorMessage = result.payload as string || 'Failed to create booking';
        dispatch(
          showToast({
            message: errorMessage,
            type: 'error',
          })
        );
      }
    } catch (error) {
      dispatch(
        showToast({
          message: 'An unexpected error occurred',
          type: 'error',
        })
      );
    }
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (booking) {
      try {
        const result = await dispatch(deleteBookingAsync(booking.id));
        
        if (deleteBookingAsync.fulfilled.match(result)) {
          dispatch(
            showToast({
              message: 'Booking deleted successfully',
              type: 'success',
            })
          );
          setConfirmDeleteOpen(false);
          handleClose();
        } else {
          // Handle error
          const errorMessage = result.payload as string || 'Failed to delete booking';
          dispatch(
            showToast({
              message: errorMessage,
              type: 'error',
            })
          );
          setConfirmDeleteOpen(false);
        }
      } catch (error) {
        dispatch(
          showToast({
            message: 'An unexpected error occurred',
            type: 'error',
          })
        );
        setConfirmDeleteOpen(false);
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    dispatch(closeBookingModal());
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <BookingForm
          booking={booking}
          defaultStart={defaultTimes.start}
          defaultEnd={defaultTimes.end}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onDelete={mode === 'edit' ? handleDelete : undefined}
          errors={errors}
          loading={loading}
          disabled={mode === 'edit'}
        />
      </Modal>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

