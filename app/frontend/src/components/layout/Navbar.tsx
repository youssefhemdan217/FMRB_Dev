import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import { useConfirm } from '../../hooks/useConfirm';
import { ConfirmDialog } from '../common/ConfirmDialog';

const getAllNavItems = (role?: string) => {
  const isAdmin = role === 'admin';
  const isApproval = role === 'approval';
  return [
    { label: 'Rooms', path: '/rooms' },
    ...((isAdmin || isApproval) ? [
      { label: 'Approval', path: '/approvals' },
    ] : []),
    ...(isAdmin ? [
      { label: 'Room Management', path: '/rooms/manage' },
      { label: 'Analytics', path: '/analytics' },
    ] : []),
  ];
};

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  // Filter navigation items based on user role
  const navItems = getAllNavItems(user?.role);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    
    const confirmed = await confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to sign out of your account?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        // Call logout API endpoint (async thunk)
        await dispatch(logout()).unwrap();
        
        dispatch(showToast({
          message: 'Logged out successfully',
          type: 'success',
        }));
        
        navigate('/login');
      } catch (error) {
        // Even if API call fails, user is logged out locally
        dispatch(showToast({
          message: 'Logged out successfully',
          type: 'success',
        }));
        
        navigate('/login');
      }
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/rooms') {
      return location.pathname === '/rooms';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        
        gap: 1 
      }}>
        <img 
          src="/logo.png" 
          alt="Saipem Logo" 
          style={{ 
            height: '40px', 
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '8px'
          }} 
        />
        <Typography variant="h6" sx={{ color: '#003D52', fontWeight: 700 }}>
          BookMeeting
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActivePath(item.path)}
              onClick={handleDrawerToggle}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#003D52',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#002A3A',
                  },
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Mobile Logout */}
        {isAuthenticated && user && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleDrawerToggle();
                  handleLogout();
                }}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white',
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: '#003D52',
          borderRadius: 0,
          borderBottom: '1px solid rgba(0, 61, 82, 0.2)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 }, px: { xs: 1, sm: 2 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              size="small"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 61, 82, 0.08)',
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              mr: 1,
            }}
          >
            <img 
              src="/logo.png" 
              alt="Saipem Logo" 
              style={{ 
                height: '36px', 
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '8px'
              }} 
            />
          </Box>
          
          <Typography
            variant="h6"
            component={Link}
            to="/rooms"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              fontSize: { xs: '1.05rem', sm: '1.2rem' },
              letterSpacing: '-0.5px',
              '&:hover': {
                opacity: 0.9,
              },
              transition: 'opacity 0.2s',
            }}
          >
            BookMeeting
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                      backgroundColor: isActivePath(item.path)
                        ? 'rgba(0, 61, 82, 0.08)'
                        : 'transparent',
                      color: '#003D52',
                      fontSize: '0.9375rem',
                      fontWeight: isActivePath(item.path) ? 600 : 500,
                      backdropFilter: isActivePath(item.path) ? 'blur(10px)' : 'none',
                      border: isActivePath(item.path) 
                        ? '1px solid rgba(0, 61, 82, 0.3)'
                        : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 61, 82, 0.08)',
                        border: '1px solid rgba(0, 61, 82, 0.3)',
                        backdropFilter: 'blur(10px)',
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </Box>
                </Link>
              ))}

              {/* Auth Section */}
              <Box sx={{ ml: 1.5, display: 'flex', gap: 1 }}>
                {isAuthenticated && user ? (
                  <>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      size="small"
                      sx={{
                        color: '#003D52',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 61, 82, 0.08)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'rgba(0, 61, 82, 0.12)',
                          fontSize: '0.9rem',
                          color: '#003D52',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: user.role === 'admin' ? 'primary.main' : 'text.secondary',
                            fontWeight: user.role === 'admin' ? 600 : 400,
                          }}
                        >
                          {user.role.toUpperCase()}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      startIcon={<LoginIcon fontSize="small" />}
                      size="small"
                      sx={{
                        color: '#003D52',
                        borderColor: 'rgba(0, 61, 82, 0.3)',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: '#003D52',
                          backgroundColor: 'rgba(0, 61, 82, 0.08)',
                        },
                      }}
                      variant="outlined"
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      startIcon={<PersonAddIcon fontSize="small" />}
                      size="small"
                      sx={{
                        color: '#003D52',
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 61, 82, 0.3)',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.875rem',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 61, 82, 0.06)',
                        },
                      }}
                      variant="contained"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        confirmColor={options.confirmColor}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

