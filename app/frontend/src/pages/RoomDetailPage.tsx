import { Container, Box, Button, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../store';
import { selectRoomById, selectBookingsByRoomId } from '../store/selectors/roomSelectors';
import { openBookingModal, showToast } from '../store/slices/uiSlice';
import { RoomHeader } from '../components/calendar/RoomHeader';
import { CalendarView } from '../components/calendar/CalendarView';
import { useRoomStatus } from '../hooks/useRoomStatus';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Booking } from '../types/booking.types';
import { useMemo, useEffect, useRef, useState } from 'react';
import { fetchBookingsByRoomId } from '../store/slices/bookingsSlice';
import { fetchRoomById } from '../store/slices/roomsSlice';

export const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.rooms);
  const hasFetchedRef = useRef<string | null>(null);
  // Initialize as true - we assume we're loading until proven otherwise
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);

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

  // Fetch room and bookings when component mounts or ID changes
  useEffect(() => {
    if (!id) return;

    // Check if we have the room in Redux store
    // If we have both the room AND the ref says we fetched, skip
    if (room && hasFetchedRef.current === id) {
      setIsLoadingRoom(false);
      return;
    }

    // If room exists in store but we haven't marked it as fetched, show it immediately
    if (room) {
      setIsLoadingRoom(false);
      // Still fetch bookings in the background
      dispatch(fetchBookingsByRoomId(id));
      hasFetchedRef.current = id;
      return;
    }

    // If we don't have room data, we need to fetch it
    hasFetchedRef.current = id;
    setIsLoadingRoom(true);

    const loadRoomData = async () => {
      try {
        // Always fetch room data on mount/ID change for fresh data
        const roomResult = await dispatch(fetchRoomById(id));
        
        if (fetchRoomById.rejected.match(roomResult)) {
          setIsLoadingRoom(false);
          dispatch(showToast({
            message: roomResult.payload || 'Room not found',
            type: 'error',
          }));
          setTimeout(() => navigate('/rooms'), 2000);
          return;
        }
        
        // Fetch bookings for this room
        const bookingsResult = await dispatch(fetchBookingsByRoomId(id));
        
        setIsLoadingRoom(false);
        
        if (fetchBookingsByRoomId.rejected.match(bookingsResult)) {
          dispatch(showToast({
            message: 'Failed to load bookings',
            type: 'warning',
          }));
        }
      } catch (error) {
        setIsLoadingRoom(false);
        console.error('Error loading room data:', error);
      }
    };

    loadRoomData();
    
    // Cleanup function to reset ref when navigating away
    return () => {
      // Don't reset hasFetchedRef here - let it persist for this ID
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, navigate]);

  const { status, statusMessage } = useRoomStatus(room, bookings);

  if (!id) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Invalid room ID</Alert>
      </Container>
    );
  }

  // Show loading spinner while fetching room data
  if (isLoadingRoom) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  // Show error if room fetch failed
  if (error && !room && !isLoadingRoom) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/rooms')}
          variant="contained"
        >
          Back to Rooms
        </Button>
      </Container>
    );
  }

  // If still no room after loading completed, show not found
  if (!room && !isLoadingRoom) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Room not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/rooms')}
          variant="contained"
        >
          Back to Rooms
        </Button>
      </Container>
    );
  }

  // At this point, room must exist (TypeScript type guard)
  if (!room) return null;

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

  const handleAddBooking = () => {
    if (!id || !room.isActive) return;

    dispatch(
      openBookingModal({
        roomId: id,
        mode: 'create',
      })
    );

    // Clear any existing selected slot from session storage
    sessionStorage.removeItem('selectedSlot');
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
        onAddBooking={handleAddBooking}
        disabled={!room.isActive}
      />
    </Container>
  );
};

