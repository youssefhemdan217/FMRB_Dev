import { Container, Box, Button, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../store';
import { selectRoomById, selectBookingsByRoomId } from '../store/selectors/roomSelectors';
import { openBookingModal } from '../store/slices/uiSlice';
import { RoomHeader } from '../components/calendar/RoomHeader';
import { CalendarView } from '../components/calendar/CalendarView';
import { useRoomStatus } from '../hooks/useRoomStatus';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Booking } from '../types/booking.types';
import { useMemo } from 'react';

export const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Memoize the selectors to avoid creating new ones on each render
  const roomSelector = useMemo(
    () => (id ? selectRoomById(id) : null),
    [id]
  );
  
  const bookingsByRoomIdSelector = useMemo(
    () => (id ? selectBookingsByRoomId(id) : null),
    [id]
  );

  const room = useAppSelector((state) => (roomSelector ? roomSelector(state) : null));
  const bookings = useAppSelector((state) =>
    bookingsByRoomIdSelector ? bookingsByRoomIdSelector(state) : []
  );

  const { status, statusMessage } = useRoomStatus(room, bookings);

  if (!id) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Invalid room ID</Alert>
      </Container>
    );
  }

  if (!room) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  const handleSlotSelect = (start: Date, end: Date) => {
    if (!room.isActive) return;

    dispatch(
      openBookingModal({
        roomId: id,
        mode: 'create',
      })
    );

    // Store the selected time in session storage for the form
    sessionStorage.setItem(
      'selectedSlot',
      JSON.stringify({
        start: start.toISOString(),
        end: end.toISOString(),
      })
    );
  };

  const handleEventClick = (booking: Booking) => {
    dispatch(
      openBookingModal({
        roomId: id,
        booking,
        mode: 'edit',
      })
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/rooms')}
          sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          size="small"
        >
          Back to Rooms
        </Button>
      </Box>

      <RoomHeader room={room} status={status} statusMessage={statusMessage} />

      <CalendarView
        bookings={bookings}
        workHours={room.workHours}
        onSlotSelect={handleSlotSelect}
        onEventClick={handleEventClick}
        disabled={!room.isActive}
      />
    </Container>
  );
};

