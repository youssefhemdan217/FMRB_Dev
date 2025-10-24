/**
 * Register Page
 * Enhanced user registration page matching app theme
 */

import { useState, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  PersonAdd,
  MeetingRoom,
  Email,
  Lock,
  Person,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { register, clearError } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { ROUTES, navigateTo } from '../constants/routes';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Navigation helper
  const nav = navigateTo(navigate);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    nav.rooms();
  }

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
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
      const result = await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }));

      if (register.fulfilled.match(result)) {
        dispatch(showToast({
          message: `Welcome, ${result.payload.user.name}! Your account has been created.`,
          type: 'success',
        }));
        nav.rooms();
      } else {
        dispatch(showToast({
          message: result.payload || 'Registration failed',
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

  const handleChange = (field: keyof typeof formData) => (
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
              Create Account
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Join BookMeeting
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

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              margin="normal"
              autoComplete="name"
              autoFocus
              disabled={isLoading}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'action.active', fontSize: { xs: 20, sm: 24 } }} />
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
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              autoComplete="email"
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
              autoComplete="new-password"
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
              disabled={isLoading}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'action.active', fontSize: { xs: 20, sm: 24 } }} />
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
              startIcon={!isLoading && <PersonAdd sx={{ fontSize: { xs: 20, sm: 24 } }} />}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Box>
        </Paper>

        {/* Sign In Link */}
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: { xs: 2, sm: 2.5 },
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Already have an account?{' '}
          <Box
            component={RouterLink}
            to={ROUTES.LOGIN}
            sx={{
              color: 'white',
              fontWeight: 700,
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              '&:hover': {
                borderBottom: '2px solid white',
              },
              transition: 'border-bottom 0.2s ease',
            }}
          >
            Sign In
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};

export default RegisterPage;
