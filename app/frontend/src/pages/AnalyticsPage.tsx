import { Container, Typography, Box, Grid, Paper, alpha } from '@mui/material';
import { useState, useMemo } from 'react';
import { useAppSelector } from '../store';
import { selectAllRooms } from '../store/selectors/roomSelectors';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { HeatmapChart } from '../components/analytics/HeatmapChart';
import { TrendChart } from '../components/analytics/TrendChart';
import { LeaderboardTable } from '../components/analytics/LeaderboardTable';
import { useAnalytics } from '../hooks/useAnalytics';
import { getDateRangeForPreset } from '../utils/dateUtils';
import { AnalyticsFilters as Filters, DateRangePreset } from '../types/analytics.types';
import PercentIcon from '@mui/icons-material/Percent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';

export const AnalyticsPage = () => {
  const rooms = useAppSelector(selectAllRooms);

  const [filters, setFilters] = useState<Filters>({
    dateRange: getDateRangeForPreset('last7'),
    dateRangePreset: 'last7' as DateRangePreset,
    selectedRoomIds: [],
    workHours: { start: '08:00', end: '20:00' },
  });

  // Update date range when preset changes
  useMemo(() => {
    if (filters.dateRangePreset !== 'custom') {
      const newRange = getDateRangeForPreset(filters.dateRangePreset);
      setFilters((prev) => ({ ...prev, dateRange: newRange }));
    }
  }, [filters.dateRangePreset]);

  const analyticsData = useAnalytics(filters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Compact Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'start', sm: 'center' }, mb: 3, gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: { xs: 2.5, sm: 3 },
              backgroundColor: '#003D52',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 61, 82, 0.3)',
            }}
          >
            <BarChartIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                color: '#003D52',
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Room usage insights and statistics
            </Typography>
          </Box>
        </Box>
      </Box>

      <AnalyticsFilters filters={filters} rooms={rooms} onChange={handleFiltersChange} />

      {/* Compact KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 3, md: 4 },
        }}
      >
        {/* Utilization Rate */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#003D52', 0.05),
            border: '2px solid',
            borderColor: alpha('#003D52', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#003D52',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 61, 82, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                backgroundColor: '#003D52',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <PercentIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Utilization
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#003D52', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                {analyticsData.kpis.utilizationRate.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Of bookable time
          </Typography>
        </Paper>

        {/* Available Now */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#10b981', 0.05),
            border: '2px solid',
            borderColor: alpha('#10b981', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#10b981',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Available
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                {analyticsData.kpis.availableNow}/{analyticsData.kpis.totalActiveRooms}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Free rooms now
          </Typography>
        </Paper>

        {/* Peak Hour */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#FF7F00', 0.05),
            border: '2px solid',
            borderColor: alpha('#FF7F00', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#FF7F00',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(255, 127, 0, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                backgroundColor: '#FF7F00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <AccessTimeIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Peak Hour
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF7F00', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                {analyticsData.kpis.peakHour}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Busiest time
          </Typography>
        </Paper>

        {/* Avg Meeting */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#06b6d4', 0.05),
            border: '2px solid',
            borderColor: alpha('#06b6d4', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#06b6d4',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <TimerIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Avg Meeting
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#06b6d4', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                {analyticsData.kpis.avgMeetingLength}m
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Meeting length
          </Typography>
        </Paper>

        {/* Top Room */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            backgroundColor: alpha('#f59e0b', 0.05),
            border: '2px solid',
            borderColor: alpha('#f59e0b', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#f59e0b',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 1 }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2 },
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Top Room
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#f59e0b', 
                  lineHeight: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {analyticsData.kpis.topRoom?.name || 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {analyticsData.kpis.topRoom
              ? `${Math.round(analyticsData.kpis.topRoom.minutes / 60)}h booked`
              : 'No data'}
          </Typography>
        </Paper>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <HeatmapChart data={analyticsData.heatmapData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendChart
            data={analyticsData.trendData}
            label="Daily Meetings"
            dataKey="meetings"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendChart
            data={analyticsData.trendData}
            label="Daily Occupied Minutes"
            dataKey="occupiedMinutes"
          />
        </Grid>
        <Grid item xs={12}>
          <LeaderboardTable data={analyticsData.leaderboardData} />
        </Grid>
      </Grid>
    </Container>
  );
};

