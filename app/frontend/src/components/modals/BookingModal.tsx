import { Modal } from '../common/Modal';
import { BookingForm } from '../forms/BookingForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeBookingModal, showToast } from '../../store/slices/uiSlice';
import { addBooking, updateBooking, deleteBooking } from '../../store/slices/bookingsSlice';
import { selectBookingsByRoomId } from '../../store/selectors/roomSelectors';
import { validateBooking } from '../../utils/validators';
import { BookingValidationErrors } from '../../types/booking.types';
import { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export const BookingModal = () => {
  const dispatch = useAppDispatch();
  const { open, booking, roomId, mode } = useAppSelector((state) => state.ui.bookingModal);
  
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

  const handleSubmit = (data: {
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
      // Update existing booking
      dispatch(
        updateBooking({
          ...booking,
          ...data,
        })
      );
      dispatch(
        showToast({
          message: 'Booking updated successfully',
          type: 'success',
        })
      );
    } else {
      // Create new booking
      const newBooking = {
        id: `booking-${Date.now()}`,
        roomId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      dispatch(addBooking(newBooking));
      dispatch(
        showToast({
          message: 'Booking created successfully',
          type: 'success',
        })
      );
    }

    handleClose();
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (booking) {
      dispatch(deleteBooking(booking.id));
      dispatch(
        showToast({
          message: 'Booking deleted successfully',
          type: 'success',
        })
      );
    }
    setConfirmDeleteOpen(false);
    handleClose();
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
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onDelete={mode === 'edit' ? handleDelete : undefined}
          errors={errors}
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

