import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../types/booking.types';
import { bookingsApi, CreateBookingDTO, UpdateBookingDTO } from '../../services/api/bookings.api';

// Async thunks for API operations
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const bookings = await bookingsApi.getAll();
      return bookings;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to fetch bookings'
        : 'Failed to fetch bookings';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookingsByRoomId = createAsyncThunk(
  'bookings/fetchByRoomId',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const bookings = await bookingsApi.getByRoomId(roomId);
      return bookings;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to fetch room bookings'
        : 'Failed to fetch room bookings';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const booking = await bookingsApi.getById(id);
      return booking;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to fetch booking'
        : 'Failed to fetch booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBookingAsync = createAsyncThunk(
  'bookings/create',
  async (bookingData: CreateBookingDTO, { rejectWithValue }) => {
    try {
      const booking = await bookingsApi.create(bookingData);
      return booking;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to create booking'
        : 'Failed to create booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBookingAsync = createAsyncThunk(
  'bookings/update',
  async ({ id, data }: { id: string; data: UpdateBookingDTO }, { rejectWithValue }) => {
    try {
      const updatedBooking = await bookingsApi.update(id, data);
      return updatedBooking;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to update booking'
        : 'Failed to update booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBookingAsync = createAsyncThunk(
  'bookings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await bookingsApi.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Failed to delete booking'
        : 'Failed to delete booking';
      return rejectWithValue(errorMessage);
    }
  }
);

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all bookings
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Fetch bookings by room ID
    builder
      .addCase(fetchBookingsByRoomId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByRoomId.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingsByRoomId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Fetch booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        // Update existing booking or add if not found
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        } else {
          state.bookings.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Create booking
    builder
      .addCase(createBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.error = null;
      })
      .addCase(createBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Update booking
    builder
      .addCase(updateBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Delete booking
    builder
      .addCase(deleteBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setBookings, 
  addBooking, 
  updateBooking, 
  deleteBooking, 
  setLoading, 
  setError 
} = bookingsSlice.actions;

export default bookingsSlice.reducer;

