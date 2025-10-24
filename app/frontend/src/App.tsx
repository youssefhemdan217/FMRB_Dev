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
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initializeAuth } from './store/slices/authSlice';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* App Routes (Protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/rooms/9" replace />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:id" element={<RoomDetailPage />} />
          <Route path="rooms/manage" element={<RoomManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="approvals" element={<ApprovalPage />} />
          <Route path="*" element={<NotFoundPage />} />
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

