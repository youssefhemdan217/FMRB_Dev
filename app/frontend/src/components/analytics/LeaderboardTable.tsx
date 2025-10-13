import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Box,
  alpha,
} from '@mui/material';
import { RoomLeaderboard } from '../../types/analytics.types';

export interface LeaderboardTableProps {
  data: RoomLeaderboard[];
}

export const LeaderboardTable = ({ data }: LeaderboardTableProps) => {
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Room Leaderboard
        </Typography>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  const maxMinutes = Math.max(...data.map((d) => d.bookedMinutes));

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: 700, color: '#003D52', fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
        Room Leaderboard
      </Typography>

      {/* Desktop Table View */}
      <TableContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Room</TableCell>
              <TableCell align="right">Booked Time</TableCell>
              <TableCell align="right">Utilization</TableCell>
              <TableCell>Usage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.roomId} hover>
                <TableCell>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: index < 3 ? 'primary.main' : 'grey.300',
                      color: index < 3 ? 'white' : 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.roomName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatMinutes(row.bookedMinutes)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {row.utilizationRate.toFixed(1)}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: 150 }}>
                    <LinearProgress
                      variant="determinate"
                      value={maxMinutes > 0 ? (row.bookedMinutes / maxMinutes) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {data.map((row, index) => (
          <Box 
            key={row.roomId}
            sx={{ 
              mb: 1.5, 
              p: 2,
              borderRadius: 2,
              backgroundColor: index < 3 ? alpha('#003D52', 0.05) : 'grey.50',
              border: '1px solid',
              borderColor: index < 3 ? alpha('#003D52', 0.15) : 'grey.200',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: index < 3 ? '#003D52' : 'grey.400',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, flex: 1, color: '#003D52' }}>
                {row.roomName}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8125rem' }}>
                {row.utilizationRate.toFixed(1)}%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.625rem' }}>
                  Booked Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                  {formatMinutes(row.bookedMinutes)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <LinearProgress
                variant="determinate"
                value={maxMinutes > 0 ? (row.bookedMinutes / maxMinutes) * 100 : 0}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

