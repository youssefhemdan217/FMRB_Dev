import { Box, Paper, Typography } from '@mui/material';
import { HourlyUtilization } from '../../types/analytics.types';
import { format, parseISO } from 'date-fns';

export interface HeatmapChartProps {
  data: HourlyUtilization[];
}

export const HeatmapChart = ({ data }: HeatmapChartProps) => {
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hourly Utilization Heatmap
        </Typography>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  // Get unique days and hours
  const uniqueDays = [...new Set(data.map((d) => d.day))].sort();
  const uniqueHours = [...new Set(data.map((d) => d.hour))].sort((a, b) => a - b);

  // Create a map for quick lookup
  const dataMap = new Map(data.map((d) => [`${d.day}-${d.hour}`, d.utilization]));

  const getColor = (utilization: number) => {
    if (utilization === 0) return '#f3f4f6';
    if (utilization < 25) return '#FFE6CC';
    if (utilization < 50) return '#FFB366';
    if (utilization < 75) return '#FF7F00';
    return '#CC6600';
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: 700, color: '#003D52', fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
        Hourly Utilization Heatmap
      </Typography>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: { xs: 600, sm: '100%' } }}>
          {/* Header row with hours */}
          <Box sx={{ display: 'flex', mb: 0.5, width: '100%' }}>
            <Box sx={{ width: { xs: 60, sm: 80 }, flexShrink: 0 }} />
            <Box sx={{ display: 'flex', flex: 1, gap: 0.5 }}>
              {uniqueHours.map((hour) => (
                <Box
                  key={hour}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: { xs: '0.625rem', sm: '0.7rem' },
                    color: 'text.secondary',
                    minWidth: { xs: 32, sm: 40 },
                  }}
                >
                  {hour}h
                </Box>
              ))}
            </Box>
          </Box>

          {/* Rows for each day */}
          {uniqueDays.map((day) => (
            <Box key={day} sx={{ display: 'flex', mb: 0.5, width: '100%' }}>
              <Box
                sx={{
                  width: { xs: 60, sm: 80 },
                  flexShrink: 0,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  display: 'flex',
                  alignItems: 'center',
                  pr: 1,
                }}
              >
                {format(parseISO(day), 'MMM d')}
              </Box>
              <Box sx={{ display: 'flex', flex: 1, gap: 0.5 }}>
                {uniqueHours.map((hour) => {
                  const utilization = dataMap.get(`${day}-${hour}`) || 0;
                  return (
                    <Box
                      key={hour}
                      sx={{
                        flex: 1,
                        minWidth: { xs: 32, sm: 40 },
                        height: { xs: 24, sm: 30 },
                        backgroundColor: getColor(utilization),
                        border: '1px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '0.6rem', sm: '0.65rem' },
                        color: utilization > 50 ? 'white' : 'text.primary',
                        fontWeight: 500,
                      }}
                      title={`${format(parseISO(day), 'MMM d')} ${hour}:00 - ${Math.round(utilization)}% utilized`}
                    >
                      {utilization > 0 ? Math.round(utilization) : ''}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}

          {/* Legend */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, fontSize: { xs: '0.7rem', sm: '0.75rem' }, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Low</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }} />
              <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, backgroundColor: '#FFE6CC', border: '1px solid #e5e7eb' }} />
              <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, backgroundColor: '#FFB366', border: '1px solid #e5e7eb' }} />
              <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, backgroundColor: '#FF7F00', border: '1px solid #e5e7eb' }} />
              <Box sx={{ width: { xs: 16, sm: 20 }, height: { xs: 16, sm: 20 }, backgroundColor: '#CC6600', border: '1px solid #e5e7eb' }} />
            </Box>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>High</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

