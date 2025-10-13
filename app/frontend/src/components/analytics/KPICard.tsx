import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { ReactNode } from 'react';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const getColorValue = (color: string) => {
  const colors = {
    primary: '#003D52',
    secondary: '#FF7F00',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
  };
  return colors[color as keyof typeof colors] || colors.primary;
};

export const KPICard = ({ title, value, icon, subtitle, color = 'primary' }: KPICardProps) => {
  const colorValue = getColorValue(color);
  
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(colorValue, 0.03)} 0%, ${alpha(colorValue, 0.08)} 100%)`,
        border: `1px solid ${alpha(colorValue, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(colorValue, 0.15)}`,
          border: `1px solid ${alpha(colorValue, 0.2)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: colorValue,
        },
      }}
    >
      <CardContent sx={{ pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography 
            color="text.secondary" 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 3,
                backgroundColor: colorValue,
                color: 'white',
                boxShadow: `0 4px 12px ${alpha(colorValue, 0.3)}`,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 800,
            mb: 0.5,
            color: colorValue,
            lineHeight: 1.2,
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {value}
        </Typography>
        
        <Box sx={{ minHeight: '40px', display: 'flex', alignItems: 'start' }}>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mt: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

