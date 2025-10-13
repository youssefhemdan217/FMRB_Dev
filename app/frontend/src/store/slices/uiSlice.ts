import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../types/booking.types';

interface ToastState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface BookingModalState {
  open: boolean;
  booking: Booking | null;
  roomId: string | null;
  mode: 'create' | 'edit';
}

interface RoomModalState {
  open: boolean;
  roomId: string | null;
}

interface UIState {
  toast: ToastState;
  bookingModal: BookingModalState;
  roomModal: RoomModalState;
}

const initialState: UIState = {
  toast: {
    open: false,
    message: '',
    type: 'info',
  },
  bookingModal: {
    open: false,
    booking: null,
    roomId: null,
    mode: 'create',
  },
  roomModal: {
    open: false,
    roomId: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
    openBookingModal: (
      state,
      action: PayloadAction<{
        roomId: string;
        booking?: Booking;
        mode?: 'create' | 'edit';
      }>
    ) => {
      state.bookingModal = {
        open: true,
        roomId: action.payload.roomId,
        booking: action.payload.booking || null,
        mode: action.payload.mode || (action.payload.booking ? 'edit' : 'create'),
      };
    },
    closeBookingModal: (state) => {
      state.bookingModal = {
        open: false,
        booking: null,
        roomId: null,
        mode: 'create',
      };
    },
    openRoomModal: (state, action: PayloadAction<{ roomId?: string }>) => {
      state.roomModal = {
        open: true,
        roomId: action.payload.roomId || null,
      };
    },
    closeRoomModal: (state) => {
      state.roomModal = {
        open: false,
        roomId: null,
      };
    },
  },
});

export const {
  showToast,
  hideToast,
  openBookingModal,
  closeBookingModal,
  openRoomModal,
  closeRoomModal,
} = uiSlice.actions;

export default uiSlice.reducer;

