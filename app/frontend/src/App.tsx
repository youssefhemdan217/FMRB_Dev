import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { store, useAppDispatch } from './store';
import { theme } from './theme';
import { AppLayout } from './components/layout/AppLayout';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { RoomManagementPage } from './pages/RoomManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ApprovalPage } from './pages/ApprovalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookingModal } from './components/modals/BookingModal';
import { Toast } from './components/common/Toast';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initializeAuth } from './store/slices/authSlice';
import { ROUTES } from './constants/routes';

// Component to initialize auth state
function AuthInitializer() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return null;
}

// Component inside Router context that handles data loading
function DataLoader() {
  useLocalStorage();
  return null; // This component only handles side effects
}

function AppContent() {
  return (
    <BrowserRouter
      basename="/MeetingBookingApp"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Initialize auth state */}
      <AuthInitializer />
      
      {/* Data loader inside Router context */}
      <DataLoader />
      
      <Routes>
        {/* Auth Routes (Public) */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Public App Routes (No authentication required) */}
        <Route
          path={ROUTES.ROOT}
          element={<AppLayout />}
        >
          <Route index element={<Navigate to={ROUTES.DEFAULT_ROOM} replace />} />
          <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
          <Route path={ROUTES.ROOM_DETAIL()} element={<RoomDetailPage />} />
          
          {/* Protected Routes (Admin/Approval only) */}
          <Route
            path={ROUTES.ROOM_MANAGEMENT}
            element={
              <AdminProtectedRoute requiredRole="admin">
                <RoomManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ANALYTICS}
            element={
              <AdminProtectedRoute requiredRole="admin">
                <AnalyticsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path={ROUTES.APPROVALS}
            element={
              <AdminProtectedRoute requiredRole="admin_or_approval">
                <ApprovalPage />
              </AdminProtectedRoute>
            }
          />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
      
      {/* Global Components */}
      <BookingModal />
      <Toast />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

