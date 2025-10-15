import { Box, Button, Menu, MenuItem, Typography, alpha } from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { AnalyticsFilters } from '../../types/analytics.types';
import { 
  KPIMetrics, 
  DailyTrend, 
  RoomLeaderboard,
  LeadTimeData 
} from '../../types/analytics.types';

export interface AnalyticsExportProps {
  filters: AnalyticsFilters;
  kpis: KPIMetrics;
  trendData: DailyTrend[];
  leaderboardData: RoomLeaderboard[];
  leadTimeData: LeadTimeData[];
}

export const AnalyticsExport = ({
  filters,
  kpis,
  trendData,
  leaderboardData,
  leadTimeData,
}: AnalyticsExportProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const exportToCSV = () => {
    const csvData = generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${formatDate(filters.dateRange.start)}-to-${formatDate(filters.dateRange.end)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const exportToPDF = () => {
    // For now, we'll create a simple HTML report that can be printed as PDF
    const htmlContent = generateHTMLReport();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
    handleClose();
  };

  const generateCSVData = () => {
    const headers = [
      'Metric',
      'Value',
      'Date Range',
      'Rooms Filtered',
      'Work Hours',
    ];

    const rows = [
      ['Utilization Rate', `${kpis.utilizationRate.toFixed(1)}%`, `${formatDate(filters.dateRange.start)} - ${formatDate(filters.dateRange.end)}`, filters.selectedRoomIds.length > 0 ? filters.selectedRoomIds.length.toString() : 'All', `${filters.workHours.start} - ${filters.workHours.end}`],
      ['Available Now', kpis.availableNow.toString(), '', '', ''],
      ['Total Active Rooms', kpis.totalActiveRooms.toString(), '', '', ''],
      ['Peak Hour', kpis.peakHour, '', '', ''],
      ['Average Meeting Length', `${kpis.avgMeetingLength} minutes`, '', '', ''],
      ['Top Room', kpis.topRoom?.name || 'N/A', '', '', ''],
      ['', '', '', '', ''],
      ['Daily Trends', '', '', '', ''],
      ...trendData.map(trend => ['', `${formatDate(new Date(trend.date))}`, `Meetings: ${trend.meetings}`, `Minutes: ${trend.occupiedMinutes}`, '']),
      ['', '', '', '', ''],
      ['Room Leaderboard', '', '', '', ''],
      ...leaderboardData.map(room => ['', room.roomName, `${room.bookedMinutes} minutes`, `${room.utilizationRate.toFixed(1)}%`, '']),
    ];

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateHTMLReport = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
          .kpi-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #003D52; }
          .kpi-label { color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .date-range { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Room Booking Analytics Report</h1>
          <p class="date-range">${formatDate(filters.dateRange.start)} - ${formatDate(filters.dateRange.end)}</p>
        </div>

        <div class="section">
          <h2>Key Performance Indicators</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${kpis.utilizationRate.toFixed(1)}%</div>
              <div class="kpi-label">Utilization Rate</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${kpis.availableNow}/${kpis.totalActiveRooms}</div>
              <div class="kpi-label">Available Now</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${kpis.peakHour}</div>
              <div class="kpi-label">Peak Hour</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${kpis.avgMeetingLength}m</div>
              <div class="kpi-label">Avg Meeting Length</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${kpis.topRoom?.name || 'N/A'}</div>
              <div class="kpi-label">Top Room</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Daily Trends</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Meetings</th>
                <th>Occupied Minutes</th>
              </tr>
            </thead>
            <tbody>
              ${trendData.map(trend => `
                <tr>
                  <td>${formatDate(new Date(trend.date))}</td>
                  <td>${trend.meetings}</td>
                  <td>${trend.occupiedMinutes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Room Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Booked Minutes</th>
                <th>Utilization Rate</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboardData.map(room => `
                <tr>
                  <td>${room.roomName}</td>
                  <td>${room.bookedMinutes}</td>
                  <td>${room.utilizationRate.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Lead Time Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Lead Time Range</th>
                <th>Number of Bookings</th>
              </tr>
            </thead>
            <tbody>
              ${leadTimeData.map(item => `
                <tr>
                  <td>${item.range}</td>
                  <td>${item.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleClick}
        sx={{
          borderColor: alpha('#003D52', 0.3),
          color: '#003D52',
          '&:hover': {
            borderColor: '#003D52',
            backgroundColor: alpha('#003D52', 0.04),
          },
        }}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={exportToCSV}>
          <TableChartIcon sx={{ mr: 1, fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Export as CSV
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Download data as spreadsheet
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={exportToPDF}>
          <PictureAsPdfIcon sx={{ mr: 1, fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Export as PDF
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Generate printable report
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
