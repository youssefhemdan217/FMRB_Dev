import { Card, CardContent, Typography, Box, CardActionArea, alpha } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Room, RoomStatus } from '../../types/room.types';
import { RoomStatusBadge } from './RoomStatusBadge';

export interface RoomCardProps {
  room: Room;
  status: RoomStatus;
  nextStatusChange?: string;
  onClick?: () => void;
}

// Status-based gradient backgrounds
const getStatusGradient = (status: RoomStatus) => {
  switch (status) {
    case 'available':
      return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    case 'busy':
      return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    case 'unavailable':
      return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    default:
      return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
  }
};

export const RoomCard = ({ room, status, nextStatusChange, onClick }: RoomCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          '& .status-bar': {
            height: '6px',
          },
        },
      }}
    >
      {/* Status indicator bar */}
      <Box
        className="status-bar"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: getStatusGradient(status),
          transition: 'height 0.3s ease',
          zIndex: 1,
        }}
      />

      <CardActionArea onClick={onClick} sx={{ height: '100%', pt: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2.5 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                {room.name}
              </Typography>
            </Box>
            <RoomStatusBadge status={status} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: alpha('#003D52', 0.1),
                  mr: 1.5,
                }}
              >
                <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {room.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: alpha('#FF7F00', 0.1),
                  mr: 1.5,
                }}
              >
                <PeopleIcon fontSize="small" sx={{ color: 'secondary.main' }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Up to {room.capacity} people
              </Typography>
            </Box>
          </Box>

          {nextStatusChange && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                backgroundColor: status === 'available' 
                  ? alpha('#10b981', 0.08) 
                  : alpha('#ef4444', 0.08),
                border: '1px solid',
                borderColor: status === 'available'
                  ? alpha('#10b981', 0.2)
                  : alpha('#ef4444', 0.2),
              }}
            >
              <AccessTimeIcon 
                fontSize="small" 
                sx={{ 
                  mr: 1, 
                  color: status === 'available' ? 'success.main' : 'error.main' 
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: status === 'available' ? 'success.dark' : 'error.dark',
                }}
              >
                {status === 'available' ? 'Available until ' : 'Busy until '}
                {new Date(nextStatusChange).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
          )}

          {room.amenities && room.amenities.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {room.amenities.slice(0, 3).map((amenity) => (
                <Box
                  key={amenity}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: 'grey.100',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                    }}
                  >
                    {amenity}
                  </Typography>
                </Box>
              ))}
              {room.amenities.length > 3 && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: '#FF7F00',
                    borderRadius: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    +{room.amenities.length - 3} more
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

