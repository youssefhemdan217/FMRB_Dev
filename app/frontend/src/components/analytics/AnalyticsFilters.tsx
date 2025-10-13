import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Autocomplete,
  Paper,
  Typography,
} from '@mui/material';
import { AnalyticsFilters as Filters, DateRangePreset } from '../../types/analytics.types';
import { Room } from '../../types/room.types';

export interface AnalyticsFiltersProps {
  filters: Filters;
  rooms: Room[];
  onChange: (filters: Filters) => void;
}

export const AnalyticsFilters = ({ filters, rooms, onChange }: AnalyticsFiltersProps) => {
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

  const selectedRooms = rooms.filter((r) => filters.selectedRoomIds.includes(r.id));

  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '1.0625rem', sm: '1.25rem' } }}>
        Filters
      </Typography>

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
    </Paper>
  );
};

