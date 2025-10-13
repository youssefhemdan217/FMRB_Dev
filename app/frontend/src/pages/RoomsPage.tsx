import { Container, Typography, Box, Paper, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { selectAllRooms, selectAllBookings } from '../store/selectors/roomSelectors';
import { RoomFilters } from '../components/rooms/RoomFilters';
import { RoomGrid } from '../components/rooms/RoomGrid';
import { useRoomFilters } from '../hooks/useFilters';
import { useMemo } from 'react';
import { RoomStatus } from '../types/room.types';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { calculateRoomStatus } from '../utils/dateUtils';

export const RoomsPage = () => {
  const navigate = useNavigate();
  const rooms = useAppSelector(selectAllRooms);
  const bookings = useAppSelector(selectAllBookings);
  const { activeFilter, searchQuery, setActiveFilter, setSearchQuery, filterRooms } =
    useRoomFilters();

  // Calculate statuses for all rooms
  const roomStatuses = useMemo(() => {
    const statuses = new Map<string, { status: RoomStatus; nextChange?: string }>();
    
    rooms.forEach((room) => {
      const roomBookings = bookings.filter((b) => b.roomId === room.id);
      const status = calculateRoomStatus(room, roomBookings);
      statuses.set(room.id, status);
    });
    
    return statuses;
  }, [rooms, bookings]);

  // Filter rooms
  const filteredRooms = filterRooms(rooms, roomStatuses);

  // Calculate summary stats
  const availableNow = Array.from(roomStatuses.values()).filter(
    (s) => s.status === 'available'
  ).length;
  
  const busyNow = Array.from(roomStatuses.values()).filter(
    (s) => s.status === 'busy'
  ).length;
  
  const inactiveRooms = rooms.filter(room => !room.isActive).length;

  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Compact Header with Integrated Stats */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'start', sm: 'center' }, mb: 3, gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: { xs: 2.5, sm: 3 },
              backgroundColor: '#003D52',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 61, 82, 0.3)',
            }}
          >
            <MeetingRoomIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                color: '#003D52',
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              Meeting Rooms
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Browse and book available rooms for your team
            </Typography>
          </Box>
        </Box>

        {/* Compact Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {/* Total Rooms */}
          <Paper
            sx={{
              p: 2.5,
              backgroundColor: alpha('#003D52', 0.05),
              border: '2px solid',
              borderColor: alpha('#003D52', 0.1),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#003D52',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 61, 82, 0.15)',
              },
            }}
            onClick={() => setActiveFilter('all')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#003D52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <MeetingRoomIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Total Rooms
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#003D52', lineHeight: 1 }}>
                  {rooms.length}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Available Now */}
          <Paper
            sx={{
              p: 2.5,
              backgroundColor: alpha('#10b981', 0.05),
              border: '2px solid',
              borderColor: alpha('#10b981', 0.1),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#10b981',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
              },
            }}
            onClick={() => setActiveFilter('available')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Available
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                  {availableNow}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {Math.round((availableNow / Math.max(rooms.length, 1)) * 100)}% free now
            </Typography>
          </Paper>

          {/* Busy Now */}
          <Paper
            sx={{
              p: 2.5,
              backgroundColor: alpha('#ef4444', 0.05),
              border: '2px solid',
              borderColor: alpha('#ef4444', 0.1),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#ef4444',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              },
            }}
            onClick={() => setActiveFilter('busy')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <EventBusyIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Busy
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
                  {busyNow}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {Math.round((busyNow / Math.max(rooms.length, 1)) * 100)}% occupied
            </Typography>
          </Paper>

          {/* Inactive */}
          <Paper
            sx={{
              p: 2.5,
              backgroundColor: alpha('#6b7280', 0.05),
              border: '2px solid',
              borderColor: alpha('#6b7280', 0.1),
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#6b7280',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(107, 114, 128, 0.15)',
              },
            }}
            onClick={() => setActiveFilter('unavailable')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <ToggleOffIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Inactive
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#6b7280', lineHeight: 1 }}>
                  {inactiveRooms}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Out of service
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Filters */}
      <RoomFilters
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
        resultCount={filteredRooms.length}
      />

      {/* Room grid */}
      <RoomGrid rooms={filteredRooms} statuses={roomStatuses} onRoomClick={handleRoomClick} />
    </Container>
  );
};

