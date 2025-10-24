/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient from '../apiClient';
import { serverConfig } from '../../config/server.config';
import { RegisterDTO, LoginDTO, AuthResponse } from '../../types/auth.types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      serverConfig.endpoints.auth.register,
      data
    );
    
    // Store auth data
    if (response.data) {
      localStorage.setItem(serverConfig.token.accessTokenKey, response.data.accessToken);
      localStorage.setItem(serverConfig.token.refreshTokenKey, response.data.refreshToken);
      localStorage.setItem(serverConfig.token.userKey, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      serverConfig.endpoints.auth.login,
      data
    );
    
    // Store auth data
    if (response.data) {
      localStorage.setItem(serverConfig.token.accessTokenKey, response.data.accessToken);
      localStorage.setItem(serverConfig.token.refreshTokenKey, response.data.refreshToken);
      localStorage.setItem(serverConfig.token.userKey, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint (requires auth token)
      await apiClient.post(serverConfig.endpoints.auth.logout);
    } catch (error) {
      // Even if backend call fails, clear local storage
      console.error('Logout endpoint error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(serverConfig.token.accessTokenKey);
      localStorage.removeItem(serverConfig.token.refreshTokenKey);
      localStorage.removeItem(serverConfig.token.userKey);
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem(serverConfig.token.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(serverConfig.token.accessTokenKey);
    const user = localStorage.getItem(serverConfig.token.userKey);
    
    // Both token and user must exist
    if (!token || !user) {
      // Clear any partial auth data
      localStorage.removeItem(serverConfig.token.accessTokenKey);
      localStorage.removeItem(serverConfig.token.refreshTokenKey);
      localStorage.removeItem(serverConfig.token.userKey);
      return false;
    }
    
    try {
      // Validate user data can be parsed
      JSON.parse(user);
      return true;
    } catch {
      // Clear invalid data
      localStorage.removeItem(serverConfig.token.accessTokenKey);
      localStorage.removeItem(serverConfig.token.refreshTokenKey);
      localStorage.removeItem(serverConfig.token.userKey);
      return false;
    }
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(serverConfig.token.accessTokenKey);
  },

  /**
   * Clear all authentication data
   */
  clearAuth: (): void => {
    localStorage.removeItem(serverConfig.token.accessTokenKey);
    localStorage.removeItem(serverConfig.token.refreshTokenKey);
    localStorage.removeItem(serverConfig.token.userKey);
  },
};

export default authApi;

