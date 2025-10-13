import { Box, ToggleButtonGroup, ToggleButton, alpha, Typography, Chip, Divider } from '@mui/material';
import { RoomStatus } from '../../types/room.types';
import { SearchInput } from '../common/SearchInput';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterListIcon from '@mui/icons-material/FilterList';

export interface RoomFiltersProps {
  activeFilter: RoomStatus | 'all';
  searchQuery: string;
  onFilterChange: (filter: RoomStatus | 'all') => void;
  onSearchChange: (query: string) => void;
  resultCount?: number;
}

export const RoomFilters = ({
  activeFilter,
  onFilterChange,
  onSearchChange,
  resultCount,
}: RoomFiltersProps) => {
  const getFilterLabel = (filter: RoomStatus | 'all') => {
    switch (filter) {
      case 'all': return 'All Rooms';
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'unavailable': return 'Unavailable';
      default: return 'All Rooms';
    }
  };

  return (
    <Box
      sx={{
        mb: { xs: 3, md: 4 },
        backgroundColor: 'white',
        borderRadius: { xs: 3, md: 4 },
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          px: { xs: 2, sm: 2.5, md: 3 },
          py: { xs: 1.5, sm: 2 },
          backgroundColor: alpha('#003D52', 0.02),
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FilterListIcon sx={{ color: '#003D52', fontSize: { xs: 20, sm: 24 } }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003D52', fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
            Filter & Search
          </Typography>
          {activeFilter !== 'all' && (
            <Chip
              label={getFilterLabel(activeFilter)}
              size="small"
              onDelete={() => onFilterChange('all')}
              sx={{
                backgroundColor: '#003D52',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: { xs: 16, sm: 18 },
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          )}
        </Box>
        {resultCount !== undefined && (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
            {resultCount} {resultCount === 1 ? 'room' : 'rooms'} found
          </Typography>
        )}
      </Box>

      {/* Filters Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 2.5, md: 2 },
          alignItems: { xs: 'stretch', md: 'center' },
          p: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {/* Status Filter Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.7rem' }, display: { xs: 'none', sm: 'block' } }}>
            Status:
          </Typography>
          <ToggleButtonGroup
            value={activeFilter}
            exclusive
            onChange={(_, value) => value !== null && onFilterChange(value)}
            aria-label="room status filter"
            size="small"
            sx={{ 
              flexShrink: 0,
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              width: { xs: '100%', sm: 'auto' },
              '& .MuiToggleButton-root': {
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.65, sm: 0.75 },
                fontWeight: 600,
                textTransform: 'none',
                border: '2px solid',
                borderColor: 'grey.300',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' },
                '&:not(:first-of-type)': {
                  marginLeft: { xs: 0, sm: 1 },
                  borderLeft: '2px solid',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: alpha('#003D52', 0.08),
                  borderColor: 'primary.light',
                },
              },
            }}
          >
            <ToggleButton value="all" aria-label="all rooms">
              <GridViewIcon sx={{ mr: { xs: 0.25, sm: 0.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              All
            </ToggleButton>
            <ToggleButton value="available" aria-label="available rooms">
              <CheckCircleIcon sx={{ mr: { xs: 0.25, sm: 0.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              Available
            </ToggleButton>
            <ToggleButton value="busy" aria-label="busy rooms">
              <EventBusyIcon sx={{ mr: { xs: 0.25, sm: 0.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              Busy
            </ToggleButton>
            <ToggleButton value="unavailable" aria-label="unavailable rooms">
              <CancelIcon sx={{ mr: { xs: 0.25, sm: 0.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              Unavailable
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

        {/* Search Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem', display: { xs: 'none', md: 'block' } }}>
            Search:
          </Typography>
          <SearchInput
            placeholder="Search by name or location..."
            onSearchChange={onSearchChange}
            size="small"
            sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: 200 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                '&:hover': {
                  backgroundColor: 'white',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

