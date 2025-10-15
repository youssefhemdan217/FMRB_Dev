import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import roomsReducer from './slices/roomsSlice';
import bookingsReducer from './slices/bookingsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import analyticsReducer from './slices/analyticsSlice';

/**
 * LocalStorage middleware to persist bookings
 */
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Type guard for action with type property
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const typedAction = action as { type: string };

    // Save bookings to localStorage whenever they change
    if (typedAction.type.startsWith('bookings/')) {
      const state = store.getState();
      try {
        localStorage.setItem('bookings', JSON.stringify(state.bookings.bookings));
      } catch (error) {
        console.error('Failed to save bookings to localStorage:', error);
      }
    }

    // Save rooms to localStorage whenever they change
    if (typedAction.type.startsWith('rooms/')) {
      const state = store.getState();
      try {
        localStorage.setItem('rooms', JSON.stringify(state.rooms.rooms));
      } catch (error) {
        console.error('Failed to save rooms to localStorage:', error);
      }
    }
  }

  return result;
};

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['analytics/fetchSummary/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['analytics.lastFetched'],
      },
    }).concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

