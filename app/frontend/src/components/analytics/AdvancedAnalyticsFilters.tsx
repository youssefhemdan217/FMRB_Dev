import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { AnalyticsFilters as Filters, DateRangePreset } from '../../types/analytics.types';
import { Room } from '../../types/room.types';

export interface AdvancedAnalyticsFiltersProps {
  filters: Filters;
  rooms: Room[];
  onChange: (filters: Filters) => void;
}

export const AdvancedAnalyticsFilters = ({ filters, rooms, onChange }: AdvancedAnalyticsFiltersProps) => {
  const [expanded, setExpanded] = useState(false);

  const handlePresetChange = (preset: DateRangePreset) => {
    onChange({
      ...filters,
      dateRangePreset: preset,
    });
  };

  const handleRoomsChange = (_: unknown, value: Room[]) => {
    onChange({
      ...filters,
      selectedRoomIds: value.map((r) => r.id),
    });
  };

  const handleWorkHoursChange = (field: 'start' | 'end', value: string) => {
    onChange({
      ...filters,
      workHours: {
        ...filters.workHours,
        [field]: value,
      },
    });
  };

  const handleCapacityFilter = (capacity: string) => {
    // This would need to be added to the filters type
    // For now, we'll just log it
    console.log('Capacity filter:', capacity);
  };

  const handleAmenitiesFilter = (amenities: string[]) => {
    // This would need to be added to the filters type
    // For now, we'll just log it
    console.log('Amenities filter:', amenities);
  };

  const clearAllFilters = () => {
    onChange({
      ...filters,
      selectedRoomIds: [],
      dateRangePreset: 'last7',
    });
  };

  const selectedRooms = rooms.filter((r) => filters.selectedRoomIds.includes(r.id));

  // Get unique capacities and amenities from rooms
  const uniqueCapacities = [...new Set(rooms.map(r => r.capacity))].sort((a, b) => a - b);
  const uniqueAmenities = [...new Set(rooms.flatMap(r => r.amenities || []))].sort();

  const hasActiveFilters = filters.selectedRoomIds.length > 0;

  return (
    <Paper sx={{ mb: { xs: 2, sm: 3 } }}>
      <Accordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          boxShadow: 'none',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1.5, sm: 2 },
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 1,
            },
          }}
        >
          <FilterListIcon sx={{ color: '#003D52' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#003D52', fontSize: { xs: '1.0625rem', sm: '1.25rem' } }}>
            Advanced Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${filters.selectedRoomIds.length} filter${filters.selectedRoomIds.length > 1 ? 's' : ''} active`}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </AccordionSummary>
        
        <AccordionDetails sx={{ px: { xs: 2, sm: 2.5, md: 3 }, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {/* Basic Filters Row */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, sm: 2.5, md: 3 },
                alignItems: { xs: 'stretch', md: 'flex-start' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  Date Range
                </Typography>
                <ToggleButtonGroup
                  value={filters.dateRangePreset}
                  exclusive
                  onChange={(_, value) => value !== null && handlePresetChange(value)}
                  aria-label="date range"
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 0.75, sm: 1 },
                    },
                  }}
                >
                  <ToggleButton value="today">Today</ToggleButton>
                  <ToggleButton value="last7">Last 7 Days</ToggleButton>
                  <ToggleButton value="last30">Last 30 Days</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  Rooms
                </Typography>
                <Autocomplete
                  multiple
                  options={rooms}
                  getOptionLabel={(option) => option.name}
                  value={selectedRooms}
                  onChange={handleRoomsChange}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="All rooms" size="small" />
                  )}
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 1 }, flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Work Hours Start
                  </Typography>
                  <TextField
                    type="time"
                    value={filters.workHours.start}
                    onChange={(e) => handleWorkHoursChange('start', e.target.value)}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Work Hours End
                  </Typography>
                  <TextField
                    type="time"
                    value={filters.workHours.end}
                    onChange={(e) => handleWorkHoursChange('end', e.target.value)}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Advanced Filters Row */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, sm: 2.5, md: 3 },
                alignItems: { xs: 'stretch', md: 'flex-start' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  Room Capacity
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Min Capacity</InputLabel>
                  <Select
                    value=""
                    onChange={(e) => handleCapacityFilter(e.target.value)}
                    label="Min Capacity"
                    sx={{
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    {uniqueCapacities.map(capacity => (
                      <MenuItem key={capacity} value={capacity.toString()}>
                        {capacity}+ people
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                  Amenities
                </Typography>
                <Autocomplete
                  multiple
                  options={uniqueAmenities}
                  value={[]}
                  onChange={(_, value) => handleAmenitiesFilter(value)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select amenities" size="small" />
                  )}
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Tooltip title="Clear all filters">
                  <IconButton
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters}
                    size="small"
                    sx={{
                      color: hasActiveFilters ? '#ef4444' : 'text.disabled',
                      '&:hover': {
                        backgroundColor: hasActiveFilters ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};
