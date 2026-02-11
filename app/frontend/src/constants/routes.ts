/**
 * Route Constants for FMRB Application
 * Centralizes all route definitions for consistency.
 */

// Route definitions
export const ROUTES = {
  // Root
  ROOT: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // App
  ROOMS: '/rooms',
  ROOM_DETAIL: (id?: string | number) => id ? `/rooms/${id}` : '/rooms/:id',
  ROOM_MANAGEMENT: '/rooms/manage',
  ANALYTICS: '/analytics',
  APPROVALS: '/approvals',

  // Catch-all
  NOT_FOUND: '*',
} as const;

/**
 * Navigation helper for useNavigate hook
 */
export const navigateTo = (navigate: (path: string, options?: any) => void) => ({
  login: (options?: any) => navigate(ROUTES.LOGIN, options),
  register: (options?: any) => navigate(ROUTES.REGISTER, options),
  rooms: (options?: any) => navigate(ROUTES.ROOMS, options),
  roomDetail: (id: string | number, options?: any) => navigate(ROUTES.ROOM_DETAIL(id), options),
  roomManagement: (options?: any) => navigate(ROUTES.ROOM_MANAGEMENT, options),
  analytics: (options?: any) => navigate(ROUTES.ANALYTICS, options),
  approvals: (options?: any) => navigate(ROUTES.APPROVALS, options),
  home: (options?: any) => navigate(ROUTES.ROOT, options),
});

export default ROUTES;