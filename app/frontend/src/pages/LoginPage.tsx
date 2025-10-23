/**
 * Login Page
 * Enhanced user authentication page matching app theme
 */

import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  MeetingRoom,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { login, clearError } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get the page user was trying to access before being redirected to login
  const from = (location.state as any)?.from?.pathname || '/rooms/9';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(login(formData));

      if (login.fulfilled.match(result)) {
        dispatch(showToast({
          message: `Welcome back, ${result.payload.user.name}!`,
          type: 'success',
        }));
        navigate(from, { replace: true });
      } else {
        dispatch(showToast({
          message: result.payload || 'Login failed',
          type: 'error',
        }));
      }
    } catch (err) {
      dispatch(showToast({
        message: 'An unexpected error occurred',
        type: 'error',
      }));
    }
  };

  const handleChange = (field: 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
    // Clear API error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha('#003D52', 0.95)} 0%, ${alpha('#005670', 0.9)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: { xs: 3, sm: 4 },
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 56, sm: 64 },
                height: { xs: 56, sm: 64 },
                borderRadius: { xs: 2.5, sm: 3 },
                background: 'linear-gradient(135deg, #003D52 0%, #005670 100%)',
                boxShadow: '0 8px 24px rgba(0, 61, 82, 0.4)',
                mb: { xs: 2, sm: 2.5 },
              }}
            >
              <MeetingRoom sx={{ fontSize: { xs: 32, sm: 36 }, color: 'white' }} />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#003D52',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '1.875rem' },
              }}
            >
              Welcome Back
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Sign in to BookMeeting
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '& .MuiAlert-icon': {
                  fontSize: { xs: 20, sm: 22 },
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'action.active', fontSize: { xs: 20, sm: 24 } }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha('#003D52', 0.02),
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '&:hover': {
                    backgroundColor: alpha('#003D52', 0.04),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              margin="normal"
              autoComplete="current-password"
              disabled={isLoading}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'action.active', fontSize: { xs: 20, sm: 24 } }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                      size="small"
                      sx={{ color: 'action.active' }}
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <Visibility sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha('#003D52', 0.02),
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '&:hover': {
                    backgroundColor: alpha('#003D52', 0.04),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              startIcon={!isLoading && <LoginIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
              sx={{
                mt: { xs: 2.5, sm: 3 },
                mb: 2,
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #003D52 0%, #005670 100%)',
                boxShadow: '0 8px 24px rgba(0, 61, 82, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002A39 0%, #003D52 100%)',
                  boxShadow: '0 12px 32px rgba(0, 61, 82, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: alpha('#003D52', 0.5),
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>

        {/* Demo Credentials */}
        <Paper
          sx={{
            mt: { xs: 2, sm: 2.5 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 2, sm: 3 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#003D52',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          >
            Demo Credentials
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ fontSize: { xs: 12, sm: 14 }, mr: 1, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  color: 'text.primary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Youssef@admin.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Lock sx={{ fontSize: { xs: 12, sm: 14 }, mr: 1, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  color: 'text.primary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Admin1234
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
