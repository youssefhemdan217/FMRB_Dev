import { Box, Typography, Alert, alpha } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { Room, RoomStatus } from '../../types/room.types';
import { RoomStatusBadge } from '../rooms/RoomStatusBadge';

export interface RoomHeaderProps {
  room: Room;
  status: RoomStatus;
  statusMessage: string;
}

export const RoomHeader = ({ room, status, statusMessage }: RoomHeaderProps) => {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      {!room.isActive && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: { xs: 2, md: 3 },
            borderRadius: { xs: 2, md: 3 },
            border: '2px solid',
            borderColor: 'warning.light',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            },
          }}
        >
          This room is currently out of service. Booking is disabled.
        </Alert>
      )}

      <Box 
        sx={{ 
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: { xs: 3, md: 4 },
          backgroundColor: 'rgba(0, 61, 82, 0.03)',
          border: '1px solid',
          borderColor: 'rgba(0, 61, 82, 0.1)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'start' }, 
          mb: { xs: 2, md: 3 },
          gap: { xs: 2, sm: 0 },
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                mb: { xs: 1.5, md: 2 },
                color: '#003D52',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              }}
            >
              {room.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' }, 
              gap: { xs: 1.5, sm: 3 },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    borderRadius: 2,
                    backgroundColor: alpha('#003D52', 0.1),
                    mr: 1,
                  }}
                >
                  <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {room.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    borderRadius: 2,
                    backgroundColor: alpha('#FF7F00', 0.1),
                    mr: 1,
                  }}
                >
                  <PeopleIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Up to {room.capacity} people
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <RoomStatusBadge status={status} size="medium" />
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 1.5,
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {statusMessage}
            </Typography>
          </Box>
        </Box>

        {room.amenities && room.amenities.length > 0 && (
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1.5,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            >
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {room.amenities.map((amenity) => (
                <Box
                  key={amenity}
                  sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    backgroundColor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: alpha('#003D52', 0.05),
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    }}
                  >
                    {amenity}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

