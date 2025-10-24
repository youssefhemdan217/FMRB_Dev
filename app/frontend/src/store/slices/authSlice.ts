/**
 * Authentication Redux Slice
 * Manages authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api/auth.api';
import { User, RegisterDTO, LoginDTO, AuthResponse } from '../../types/auth.types';
import { handleError } from '../../utils/errorHandler';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Async thunk for user registration
 */
export const register = createAsyncThunk<AuthResponse, RegisterDTO, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Registration'));
    }
  }
);

/**
 * Async thunk for user login
 */
export const login = createAsyncThunk<AuthResponse, LoginDTO, { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Login'));
    }
  }
);

/**
 * Async thunk for user logout
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails, we still clear local state
      return rejectWithValue(handleError(error, 'Logout'));
    }
  }
);

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal: (state) => {
      // Local logout without API call (fallback)
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    initializeAuth: (state) => {
      // Re-check authentication state and clear invalid data
      const isAuth = authApi.isAuthenticated();
      const user = authApi.getCurrentUser();
      
      if (isAuth && user) {
        state.user = user;
        state.isAuthenticated = true;
      } else {
        // Clear invalid state
        authApi.clearAuth();
        state.user = null;
        state.isAuthenticated = false;
      }
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Registration failed';
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state) => {
      // Even if logout fails, clear the state
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { logoutLocal, clearError, setUser, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

