import axios from 'axios';

/**
 * Axios instance configured with base URL from environment
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://spmwsm02x3zd.saipemnet.saipem.intranet/MeetingBookingApi/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth headers (future use)
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);


export default apiClient;

