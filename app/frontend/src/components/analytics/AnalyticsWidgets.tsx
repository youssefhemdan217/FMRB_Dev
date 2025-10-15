import { Box, Paper, Typography, alpha, LinearProgress, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { KPIMetrics } from '../../types/analytics.types';

export interface AnalyticsWidgetsProps {
  kpis: KPIMetrics;
  previousKpis?: KPIMetrics;
}

interface WidgetData {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  color: string;
  icon: React.ReactNode;
}

export const AnalyticsWidgets = ({ kpis, previousKpis }: AnalyticsWidgetsProps) => {
  const calculateTrend = (current: number, previous?: number): 'up' | 'down' | 'flat' => {
    if (!previous) return 'flat';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'flat';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444' }} />;
      default:
        return <TrendingFlatIcon sx={{ fontSize: 16, color: '#6b7280' }} />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const widgets: WidgetData[] = [
    {
      title: 'Utilization Rate',
      value: `${kpis.utilizationRate.toFixed(1)}%`,
      subtitle: 'Of bookable time',
      trend: calculateTrend(kpis.utilizationRate, previousKpis?.utilizationRate),
      trendValue: previousKpis ? `${(kpis.utilizationRate - previousKpis.utilizationRate).toFixed(1)}%` : undefined,
      color: '#003D52',
      icon: '📊',
    },
    {
      title: 'Room Availability',
      value: `${kpis.availableNow}/${kpis.totalActiveRooms}`,
      subtitle: 'Free rooms now',
      trend: calculateTrend(kpis.availableNow, previousKpis?.availableNow),
      trendValue: previousKpis ? `${kpis.availableNow - previousKpis.availableNow}` : undefined,
      color: '#10b981',
      icon: '✅',
    },
    {
      title: 'Peak Hour',
      value: kpis.peakHour,
      subtitle: 'Busiest time',
      color: '#FF7F00',
      icon: '⏰',
    },
    {
      title: 'Avg Meeting Length',
      value: `${kpis.avgMeetingLength}m`,
      subtitle: 'Meeting duration',
      trend: calculateTrend(kpis.avgMeetingLength, previousKpis?.avgMeetingLength),
      trendValue: previousKpis ? `${kpis.avgMeetingLength - previousKpis.avgMeetingLength}m` : undefined,
      color: '#06b6d4',
      icon: '⏱️',
    },
    {
      title: 'Top Room',
      value: kpis.topRoom?.name || 'N/A',
      subtitle: kpis.topRoom ? `${Math.round(kpis.topRoom.minutes / 60)}h booked` : 'No data',
      color: '#f59e0b',
      icon: '🏆',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
        gap: { xs: 1.5, sm: 2 },
        mb: { xs: 3, md: 4 },
      }}
    >
      {widgets.map((widget) => (
        <Paper
          key={widget.title}
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha(widget.color, 0.05),
            border: '2px solid',
            borderColor: alpha(widget.color, 0.1),
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: widget.color,
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(widget.color, 0.15)}`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: widget.color,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  borderRadius: { xs: 1.5, sm: 2 },
                  backgroundColor: alpha(widget.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {widget.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                  {widget.title}
                </Typography>
                {widget.trend && widget.trendValue && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    {getTrendIcon(widget.trend)}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.6rem', sm: '0.65rem' },
                        color: getTrendColor(widget.trend),
                      }}
                    >
                      {widget.trendValue}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: widget.color, lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }, mb: 0.5 }}>
            {widget.value}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {widget.subtitle}
          </Typography>

          {/* Progress bar for utilization */}
          {widget.title === 'Utilization Rate' && (
            <Box sx={{ mt: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(kpis.utilizationRate, 100)}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: alpha(widget.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: widget.color,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}

          {/* Status chip for availability */}
          {widget.title === 'Room Availability' && (
            <Box sx={{ mt: 1.5 }}>
              <Chip
                label={kpis.availableNow > 0 ? 'Available' : 'Fully Booked'}
                size="small"
                sx={{
                  backgroundColor: kpis.availableNow > 0 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                  color: kpis.availableNow > 0 ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                }}
              />
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
};
