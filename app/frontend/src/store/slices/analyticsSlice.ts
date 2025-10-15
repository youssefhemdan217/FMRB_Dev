import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { analyticsApi, AnalyticsSummary, AnalyticsQueryParams } from '../../services/api/analytics.api';

interface AnalyticsState {
  summary: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
  lastFetched: string | null; // Store as ISO string instead of Date object
}

const initialState: AnalyticsState = {
  summary: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching analytics summary
export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (params?: AnalyticsQueryParams) => {
    const response = await analyticsApi.getSummary(params);
    return response;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearAnalyticsData: (state) => {
      state.summary = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action: PayloadAction<AnalyticsSummary>) => {
        state.loading = false;
        state.summary = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics summary';
      });
  },
});

export const { clearAnalyticsError, clearAnalyticsData } = analyticsSlice.actions;
export default analyticsSlice.reducer;
