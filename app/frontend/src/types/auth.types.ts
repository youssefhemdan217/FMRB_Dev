/**
 * Authentication Type Definitions
 * Matching backend API responses
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'approval';
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

