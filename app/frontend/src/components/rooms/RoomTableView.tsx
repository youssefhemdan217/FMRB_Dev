import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Room, RoomStatus } from '../../types/room.types';
import { RoomStatusBadge } from './RoomStatusBadge';

export interface RoomTableViewProps {
  rooms: Room[];
  statuses: Map<string, { status: RoomStatus; nextChange?: string }>;
  onRoomClick: (roomId: string) => void;
}

// Status-based colors
const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case 'available':
      return { bg: alpha('#10b981', 0.1), color: '#059669' };
    case 'busy':
      return { bg: alpha('#ef4444', 0.1), color: '#dc2626' };
    case 'unavailable':
      return { bg: alpha('#6b7280', 0.1), color: '#4b5563' };
    default:
      return { bg: alpha('#6366f1', 0.1), color: '#4f46e5' };
  }
};

export const RoomTableView = ({ rooms, statuses, onRoomClick }: RoomTableViewProps) => {
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
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="rooms table">
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha('#003D52', 0.05) }}>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Room Name
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Location
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Capacity
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Next Change
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem' }}>
              Amenities
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#003D52', fontSize: '0.875rem', textAlign: 'center' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => {
            const roomStatus = statuses.get(room.id);
            const status = roomStatus?.status || 'unavailable';
            const nextChange = roomStatus?.nextChange;
            const statusColors = getStatusColor(status);

            return (
              <TableRow
                key={room.id}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha('#003D52', 0.02),
                    cursor: 'pointer',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
                onClick={() => onRoomClick(room.id)}
              >
                <TableCell>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {room.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {room.id}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {room.location}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {room.capacity} people
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <RoomStatusBadge status={status} />
                </TableCell>
                
                <TableCell>
                  {nextChange ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        backgroundColor: statusColors.bg,
                      }}
                    >
                      <AccessTimeIcon 
                        fontSize="small" 
                        sx={{ color: statusColors.color }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          color: statusColors.color,
                        }}
                      >
                        {new Date(nextChange).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  {room.amenities && room.amenities.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                      {room.amenities.slice(0, 2).map((amenity) => (
                        <Chip
                          key={amenity}
                          label={amenity}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            backgroundColor: 'grey.100',
                            color: 'text.secondary',
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        />
                      ))}
                      {room.amenities.length > 2 && (
                        <Chip
                          label={`+${room.amenities.length - 2}`}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            backgroundColor: '#FF7F00',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRoomClick(room.id);
                    }}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: alpha('#003D52', 0.1),
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
