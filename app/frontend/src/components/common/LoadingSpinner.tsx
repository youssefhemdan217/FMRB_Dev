import { CircularProgress, Box } from '@mui/material';

export interface LoadingSpinnerProps {
  size?: number;
  fullPage?: boolean;
}

export const LoadingSpinner = ({ size = 40, fullPage = false }: LoadingSpinnerProps) => {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress size={size} />
    </Box>
  );
};

