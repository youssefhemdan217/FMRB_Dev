import { Chip, alpha } from '@mui/material';
import { RoomStatus } from '../../types/room.types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';

export interface RoomStatusBadgeProps {
  status: RoomStatus;
  size?: 'small' | 'medium';
}

export const RoomStatusBadge = ({ status, size = 'small' }: RoomStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          color: 'success' as const,
          icon: <CheckCircleIcon />,
          bgColor: '#10b981',
        };
      case 'busy':
        return {
          label: 'Busy',
          color: 'error' as const,
          icon: <CancelIcon />,
          bgColor: '#ef4444',
        };
      case 'unavailable':
        return {
          label: 'Unavailable',
          color: 'default' as const,
          icon: <BlockIcon />,
          bgColor: '#6b7280',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      sx={{ 
        fontWeight: 600,
        fontSize: size === 'medium' ? '0.9rem' : '0.75rem',
        height: size === 'medium' ? 36 : 28,
        px: size === 'medium' ? 1.5 : 1,
        borderRadius: 2.5,
        boxShadow: `0 2px 8px ${alpha(config.bgColor, 0.25)}`,
        '& .MuiChip-icon': {
          fontSize: size === 'medium' ? '1.2rem' : '1rem',
        },
      }}
    />
  );
};

