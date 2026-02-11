import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
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
import { ROUTES } from './constants/routes';

// Component inside Router context that handles data loading
function DataLoader() {
  useLocalStorage();
  return null; // This component only handles side effects
}

function AppContent() {
  return (
    <BrowserRouter
      basename="/"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Data loader inside Router context */}
      <DataLoader />
      
      <Routes>
        {/* Auth Routes (Public) */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* App Routes (Protected) */}
        <Route
          path={ROUTES.ROOT}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.ROOMS} replace />} />
          <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
          <Route path={ROUTES.ROOM_DETAIL()} element={<RoomDetailPage />} />
          <Route path={ROUTES.ROOM_MANAGEMENT} element={<RoomManagementPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.APPROVALS} element={<ApprovalPage />} />
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

