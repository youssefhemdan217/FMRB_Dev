import { Box, Paper, Typography, alpha } from '@mui/material';
import { DailyTrend } from '../../types/analytics.types';
import { format, parseISO } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export interface TrendChartProps {
  data: DailyTrend[];
  label: string;
  dataKey: 'meetings' | 'occupiedMinutes';
}

export const TrendChart = ({ data, label, dataKey }: TrendChartProps) => {
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#003D52' }}>
          {label}
        </Typography>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  const maxValue = Math.max(...data.map((d) => d[dataKey]), 1);
  const hasData = data.some((d) => d[dataKey] > 0);
  const totalValue = data.reduce((sum, item) => sum + item[dataKey], 0);
  const avgValue = Math.round(totalValue / data.length);

  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      {/* Header with stats */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'start' }, mb: { xs: 2, sm: 3 }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#003D52', mb: { xs: 1, sm: 0.5 }, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2, md: 2 }, mt: 1, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                Total
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#003D52', fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                {totalValue}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                Avg/Day
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF7F00', fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                {avgValue}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                Peak
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981', fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                {maxValue}
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
          <TrendingUpIcon sx={{ color: '#003D52', fontSize: { xs: 24, sm: 28 } }} />
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
            No {dataKey === 'meetings' ? 'meetings' : 'bookings'} in this period
          </Typography>
        </Box>
      ) : (
        <Box>
          {/* Simple bar chart */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {data.map((item) => {
              const value = item[dataKey];
              const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                  <Box key={item.date}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        minWidth: { xs: 48, sm: 60 },
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {format(parseISO(item.date), 'MMM d')}
                    </Typography>
                    <Box sx={{ flex: 1, position: 'relative', height: { xs: 28, sm: 32 } }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '100%',
                          backgroundColor: alpha('#003D52', 0.08),
                          borderRadius: 1.5,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${Math.max(widthPercent, value > 0 ? 2 : 0)}%`,
                          backgroundColor: '#003D52',
                          borderRadius: 1.5,
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          pr: { xs: 1, sm: 1.5 },
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#FF7F00',
                            width: `${Math.min(widthPercent + 2, 100)}%`,
                            boxShadow: '0 2px 8px rgba(255, 127, 0, 0.4)',
                          },
                        }}
                        title={`${format(parseISO(item.date), 'MMM d')}: ${value} ${dataKey === 'meetings' ? 'meetings' : 'minutes'}`}
                      >
                        {value > 0 && widthPercent > 8 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            }}
                          >
                            {value}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {(value === 0 || widthPercent <= 8) && (
                      <Typography
                        variant="caption"
                        sx={{
                          minWidth: { xs: 24, sm: 30 },
                          fontWeight: 700,
                          color: 'text.secondary',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        {value}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

