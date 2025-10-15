/**
 * Rooms Redux Slice
 * Manages rooms state with API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roomsApi, type RoomWithStatus, type CreateRoomDTO, type UpdateRoomDTO } from '../../services/api/rooms.api';
import { handleError } from '../../utils/errorHandler';

interface RoomsState {
  rooms: RoomWithStatus[];
  selectedRoom: RoomWithStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
};

/**
 * Async thunk: Fetch all rooms
 */
export const fetchRooms = createAsyncThunk<RoomWithStatus[], void, { rejectValue: string }>(
  'rooms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const rooms = await roomsApi.getAll();
      return rooms;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Fetch Rooms'));
    }
  }
);

/**
 * Async thunk: Fetch room by ID
 */
export const fetchRoomById = createAsyncThunk<RoomWithStatus, string, { rejectValue: string }>(
  'rooms/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const room = await roomsApi.getById(id);
      // Cast to RoomWithStatus - getById doesn't include status, but we need it for compatibility
      return room as RoomWithStatus;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Fetch Room'));
    }
  }
);

/**
 * Async thunk: Create room
 */
export const createRoom = createAsyncThunk<RoomWithStatus, CreateRoomDTO, { rejectValue: string }>(
  'rooms/create',
  async (data, { rejectWithValue }) => {
    try {
      const room = await roomsApi.create(data);
      return room as RoomWithStatus;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Create Room'));
    }
  }
);

/**
 * Async thunk: Update room
 */
export const updateRoom = createAsyncThunk<
  RoomWithStatus,
  { id: string; data: UpdateRoomDTO },
  { rejectValue: string }
>(
  'rooms/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const room = await roomsApi.update(id, data);
      return room as RoomWithStatus;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Update Room'));
    }
  }
);

/**
 * Async thunk: Delete room
 */
export const deleteRoom = createAsyncThunk<string, string, { rejectValue: string }>(
  'rooms/delete',
  async (id, { rejectWithValue }) => {
    try {
      await roomsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Delete Room'));
    }
  }
);

/**
 * Rooms slice
 */
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRoom: (state, action: PayloadAction<RoomWithStatus | null>) => {
      state.selectedRoom = action.payload;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all rooms
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms = action.payload;
      state.error = null;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch rooms';
    });

    // Fetch room by ID
    builder.addCase(fetchRoomById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoomById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedRoom = action.payload;
      
      // Also add/update the room in the rooms array so selectors can find it
      const existingIndex = state.rooms.findIndex(room => room.id === action.payload.id);
      if (existingIndex >= 0) {
        // Update existing room
        state.rooms[existingIndex] = action.payload;
      } else {
        // Add new room to array
        state.rooms.push(action.payload);
      }
      
      state.error = null;
    });
    builder.addCase(fetchRoomById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch room';
    });

    // Create room
    builder.addCase(createRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms.push(action.payload);
      state.error = null;
    });
    builder.addCase(createRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create room';
    });

    // Update room
    builder.addCase(updateRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRoom.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.rooms.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rooms[index] = action.payload;
      }
      if (state.selectedRoom?.id === action.payload.id) {
        state.selectedRoom = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update room';
    });

    // Delete room
    builder.addCase(deleteRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms = state.rooms.filter((r) => r.id !== action.payload);
      if (state.selectedRoom?.id === action.payload) {
        state.selectedRoom = null;
      }
      state.error = null;
    });
    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete room';
    });
  },
});

export const { clearError, setSelectedRoom, clearSelectedRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
