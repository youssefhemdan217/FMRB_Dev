/**
 * Error Handler Utilities
 * Centralized error handling and exception treatment
 */

import { AxiosError } from 'axios';
import { serverConfig } from '../config/server.config';

export interface ApiError {
  message: string;
  statusCode?: number;
  timestamp?: string;
  field?: string;
}

export interface ErrorResponse {
  error: string;
  statusCode?: number;
  timestamp?: string;
  field?: string;
  errors?: { [key: string]: string };
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Network error
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return serverConfig.errorMessages.timeout;
      }
      return serverConfig.errorMessages.network;
    }

    // API error response
    const errorData = error.response.data as ErrorResponse;
    
    if (errorData?.error) {
      return errorData.error;
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 400:
        return errorData?.error || serverConfig.errorMessages.validation;
      case 401:
        return serverConfig.errorMessages.unauthorized;
      case 403:
        return serverConfig.errorMessages.forbidden;
      case 404:
        return serverConfig.errorMessages.notFound;
      case 409:
        return errorData?.error || serverConfig.errorMessages.conflict;
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return serverConfig.errorMessages.server;
      default:
        return errorData?.error || serverConfig.errorMessages.unknown;
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return serverConfig.errorMessages.unknown;
};

/**
 * Extract detailed error information from API error
 */
export const getErrorDetails = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse;
    
    return {
      message: getErrorMessage(error),
      statusCode: error.response?.status,
      timestamp: errorData?.timestamp,
      field: errorData?.field,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};

/**
 * Check if error is a specific HTTP status code
 */
export const isErrorStatus = (error: unknown, statusCode: number): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === statusCode;
  }
  return false;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  return isErrorStatus(error, 401);
};

/**
 * Check if error is forbidden (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
  return isErrorStatus(error, 403);
};

/**
 * Check if error is not found (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  return isErrorStatus(error, 404);
};

/**
 * Check if error is conflict (409)
 */
export const isConflictError = (error: unknown): boolean => {
  return isErrorStatus(error, 409);
};

/**
 * Check if error is validation error (400)
 */
export const isValidationError = (error: unknown): boolean => {
  return isErrorStatus(error, 400);
};

/**
 * Check if error is server error (5xx)
 */
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return status ? status >= 500 && status < 600 : false;
  }
  return false;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code !== 'ECONNABORTED';
  }
  return false;
};

/**
 * Log error to console in development
 */
export const logError = (error: unknown, context?: string) => {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    
    if (error instanceof AxiosError) {
      console.error('Request:', error.config);
      console.error('Response:', error.response?.data);
    }
  }
};

/**
 * Handle error and return user-friendly message
 */
export const handleError = (error: unknown, context?: string): string => {
  logError(error, context);
  return getErrorMessage(error);
};

