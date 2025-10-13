export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangePreset = 'today' | 'last7' | 'last30' | 'custom';

export interface AnalyticsFilters {
  dateRange: DateRange;
  dateRangePreset: DateRangePreset;
  selectedRoomIds: string[];
  workHours: {
    start: string;
    end: string;
  };
}

export interface KPIMetrics {
  utilizationRate: number; // percentage
  availableNow: number;
  totalActiveRooms: number;
  peakHour: string;
  avgMeetingLength: number; // minutes
  topRoom: {
    name: string;
    minutes: number;
  } | null;
}

export interface HourlyUtilization {
  day: string; // ISO date string
  hour: number; // 0-23
  utilization: number; // percentage
}

export interface DailyTrend {
  date: string; // ISO date string
  meetings: number;
  occupiedMinutes: number;
}

export interface RoomLeaderboard {
  roomId: string;
  roomName: string;
  bookedMinutes: number;
  utilizationRate: number;
}

export interface LeadTimeData {
  range: string; // e.g., "0-1h", "1-6h", "6-24h", "1-7d", ">7d"
  count: number;
}

