/**
 * Route Constants for FMRB Application
 * 
 * This file centralizes all route definitions to ensure consistency
 * across the application when deployed with the MeetingBookingApp base path.
 */

// Base path for deployment (matches vite.config.ts)
export const BASE_PATH = '/MeetingBookingApp';

// Route definitions
export const ROUTES = {
  // Root routes
  ROOT: '/',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // App routes
  ROOMS: '/rooms',
  ROOM_DETAIL: (id?: string | number) => id ? `/rooms/${id}` : '/rooms/:id',
  ROOM_MANAGEMENT: '/rooms/manage',
  ANALYTICS: '/analytics',
  APPROVALS: '/approvals',
  
  // Default room redirect
  DEFAULT_ROOM: '/rooms/9',
  
  // Catch-all
  NOT_FOUND: '*'
} as const;

/**
 * Utility function to get the full path including base
 * Use this for programmatic navigation and external links
 */
export const getFullPath = (route: string): string => {
  if (route.startsWith('http')) return route; // External URLs
  return `${BASE_PATH}${route}`;
};

/**
 * Utility function to get relative path for React Router
 * Use this for Route path definitions and Link to props
 */
export const getRelativePath = (route: string): string => {
  return route;
};

/**
 * Navigation helper for useNavigate hook
 * Automatically handles base path for programmatic navigation
 */
export const navigateTo = (navigate: (path: string, options?: any) => void) => ({
  login: (options?: any) => navigate(ROUTES.LOGIN, options),
  register: (options?: any) => navigate(ROUTES.REGISTER, options),
  rooms: (options?: any) => navigate(ROUTES.ROOMS, options),
  roomDetail: (id: string | number, options?: any) => navigate(ROUTES.ROOM_DETAIL(id), options),
  roomManagement: (options?: any) => navigate(ROUTES.ROOM_MANAGEMENT, options),
  analytics: (options?: any) => navigate(ROUTES.ANALYTICS, options),
  approvals: (options?: any) => navigate(ROUTES.APPROVALS, options),
  defaultRoom: (options?: any) => navigate(ROUTES.DEFAULT_ROOM, options),
  home: (options?: any) => navigate(ROUTES.ROOT, options),
});

export default ROUTES;