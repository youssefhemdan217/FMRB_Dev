import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { Toast } from '../common/Toast';

export const AppLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f9fafb',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
      <Toast />
    </Box>
  );
};

