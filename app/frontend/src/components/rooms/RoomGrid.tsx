import { Box, Typography } from '@mui/material';
import { Room, RoomStatus } from '../../types/room.types';
import { RoomCard } from './RoomCard';

export interface RoomGridProps {
  rooms: Room[];
  statuses: Map<string, { status: RoomStatus; nextChange?: string }>;
  onRoomClick: (roomId: string) => void;
}

export const RoomGrid = ({ rooms, statuses, onRoomClick }: RoomGridProps) => {
  if (rooms.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No rooms found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or search query
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {rooms.map((room) => {
        const roomStatus = statuses.get(room.id);
        return (
          <RoomCard
            key={room.id}
            room={room}
            status={roomStatus?.status || 'unavailable'}
            nextStatusChange={roomStatus?.nextChange}
            onClick={() => onRoomClick(room.id)}
          />
        );
      })}
    </Box>
  );
};

