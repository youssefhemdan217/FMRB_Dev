import { Box, Paper, Typography, alpha } from '@mui/material';
import { LeadTimeData } from '../../types/analytics.types';
import ScheduleIcon from '@mui/icons-material/Schedule';

export interface LeadTimeDistributionChartProps {
  data: LeadTimeData[];
}

export const LeadTimeDistributionChart = ({ data }: LeadTimeDistributionChartProps) => {
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#003D52' }}>
          Booking Lead Time Distribution
        </Typography>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const hasData = data.some((d) => d.count > 0);

  const getColor = (index: number) => {
    const colors = [
      '#003D52', // Primary blue
      '#FF7F00', // Orange
      '#10b981', // Green
      '#06b6d4', // Cyan
      '#f59e0b', // Amber
    ];
    return colors[index % colors.length];
  };

  const getLabel = (range: string) => {
    const labels: Record<string, string> = {
      '0-1h': 'Same Day',
      '1-6h': 'Same Day',
      '6-24h': 'Next Day',
      '1-7d': 'This Week',
      '>7d': 'Future',
    };
    return labels[range] || range;
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      {/* Header with stats */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'start' }, mb: { xs: 2, sm: 3 }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#003D52', mb: { xs: 1, sm: 0.5 }, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            Booking Lead Time Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2, md: 2 }, mt: 1, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                Total Bookings
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#003D52', fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                {totalBookings}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                Avg Lead Time
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF7F00', fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                {data.length > 0 ? Math.round(totalBookings / data.length) : 0} bookings
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#003D52', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScheduleIcon sx={{ color: '#003D52', fontSize: { xs: 24, sm: 28 } }} />
        </Box>
      </Box>

      {!hasData ? (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 200,
          backgroundColor: 'grey.50',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'grey.300',
        }}>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            No booking data in this period
          </Typography>
        </Box>
      ) : (
        <Box>
          {/* Horizontal bar chart */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {data.map((item, index) => {
              const percentage = totalBookings > 0 ? (item.count / totalBookings) * 100 : 0;
              const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              const color = getColor(index);
              
              return (
                <Box key={item.range}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        minWidth: { xs: 60, sm: 80 },
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {getLabel(item.range)}
                    </Typography>
                    <Box sx={{ flex: 1, position: 'relative', height: { xs: 28, sm: 32 } }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '100%',
                          backgroundColor: alpha(color, 0.08),
                          borderRadius: 1.5,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${Math.max(widthPercent, item.count > 0 ? 2 : 0)}%`,
                          backgroundColor: color,
                          borderRadius: 1.5,
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          pr: { xs: 1, sm: 1.5 },
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: alpha(color, 0.8),
                            width: `${Math.min(widthPercent + 2, 100)}%`,
                            boxShadow: `0 2px 8px ${alpha(color, 0.4)}`,
                          },
                        }}
                        title={`${getLabel(item.range)}: ${item.count} bookings (${percentage.toFixed(1)}%)`}
                      >
                        {item.count > 0 && widthPercent > 8 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            }}
                          >
                            {item.count}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: { xs: 50, sm: 60 } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        {item.count}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: { xs: '0.6rem', sm: '0.65rem' },
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, fontSize: { xs: '0.7rem', sm: '0.75rem' }, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Lead Time Categories:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {data.map((item, index) => (
                <Box key={item.range} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: getColor(index), borderRadius: 0.5 }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                    {getLabel(item.range)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
