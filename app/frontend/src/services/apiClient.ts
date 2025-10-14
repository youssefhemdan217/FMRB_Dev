/**
 * Axios API Client
 * Centralized axios instance with interceptors and error handling
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { serverConfig } from '../config/server.config';
import { getErrorMessage, logError } from '../utils/errorHandler';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: serverConfig.baseURL,
  timeout: serverConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Adds authentication token to requests
 * - Logs requests in development
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem(serverConfig.token.accessTokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Logs responses in development
 * - Centralized error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Invalid token or user not authenticated
    if (error.response?.status === 401 && originalRequest) {
      // Only clear auth data and redirect if not on login/register page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Clear auth data
        localStorage.removeItem(serverConfig.token.accessTokenKey);
        localStorage.removeItem(serverConfig.token.refreshTokenKey);
        localStorage.removeItem(serverConfig.token.userKey);

        // Redirect to login
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      logError(error, 'Forbidden - Insufficient Permissions');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      logError(error, 'Resource Not Found');
    }

    // Handle 409 Conflict
    if (error.response?.status === 409) {
      logError(error, 'Conflict - Resource Already Exists or Overlap');
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      logError(error, 'Rate Limit Exceeded');
    }

    // Handle 5xx Server Errors
    if (error.response?.status && error.response.status >= 500) {
      logError(error, 'Server Error');
    }

    // Handle network errors
    if (!error.response) {
      logError(error, 'Network Error');
    }

    // Log error message
    const errorMessage = getErrorMessage(error);
    console.error('[API Error]:', errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;

