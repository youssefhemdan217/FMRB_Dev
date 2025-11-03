import {
  Box,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Booking, BookingValidationErrors } from '../../types/booking.types';
import { useState, useEffect } from 'react';
import { TimeSelector } from './TimeSelector';

export interface BookingFormProps {
  booking?: Booking | null;
  defaultStart?: Date;
  defaultEnd?: Date;
  onSubmit: (data: {
    title: string;
    organizer?: string;
    start: string;
    end: string;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
  errors?: BookingValidationErrors;
  loading?: boolean;
  disabled?: boolean;
}

export const BookingForm = ({
  booking,
  defaultStart,
  defaultEnd,
  onSubmit,
  onCancel,
  onDelete,
  errors = {},
  loading = false,
  disabled = false,
}: BookingFormProps) => {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (booking) {
      setTitle(booking.title);
      setOrganizer(booking.organizer || '');
      setStart(booking.start);
      setEnd(booking.end);
    } else if (defaultStart && defaultEnd) {
      setStart(defaultStart.toISOString());
      setEnd(defaultEnd.toISOString());
      // Load last organizer from localStorage
      const lastOrganizer = localStorage.getItem('lastOrganizer');
      if (lastOrganizer) {
        setOrganizer(lastOrganizer);
      }
    }
  }, [booking, defaultStart, defaultEnd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save organizer to localStorage
    if (organizer) {
      localStorage.setItem('lastOrganizer', organizer);
    }

    onSubmit({
      title: title.trim(),
      organizer: organizer.trim() || undefined,
      start: start,
      end: end,
    });
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle 
        sx={{ 
          pb: 1,
          color: '#003D52',
          fontSize: '1.75rem',
          fontWeight: 700,
        }}
      >
        {booking ? '✏️ Edit Booking' : '📅 New Booking'}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>

        {hasErrors && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
            }}
          >
            Please fix the errors below
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Meeting Title"
          type="text"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          placeholder="e.g., Team Standup, Client Meeting"
          disabled={disabled || loading}
          sx={{ 
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          }}
        />

        <TextField
          margin="dense"
          label="Organizer"
          type="text"
          fullWidth
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          placeholder="Your name (optional)"
          disabled={disabled || loading}
          sx={{ 
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          }}
        />

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: 2,
          mb: 2,
        }}>
          <TimeSelector
            label="Start"
            value={start}
            onChange={setStart}
            error={!!errors.start}
            helperText={errors.start}
            disabled={disabled || loading}
            required
            maxTime={end || undefined}
          />

          <TimeSelector
            label="End"
            value={end}
            onChange={setEnd}
            error={!!errors.end}
            helperText={errors.end}
            disabled={disabled || loading}
            required
            minTime={start || undefined}
          />
        </Box>

        {errors.overlap && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
            }}
          >
            {errors.overlap}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {booking && onDelete && !disabled && (
          <Button 
            onClick={onDelete} 
            color="error" 
            variant="outlined"
            disabled={loading}
            sx={{ 
              mr: 'auto',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'error.main',
                color: 'white',
              },
            }}
          >
            Delete
          </Button>
        )}
        <Button 
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          size="large"
          color="primary"
          disabled={disabled || loading}
          sx={{
            minWidth: 120,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : disabled ? (
            'Editing Not Supported'
          ) : booking ? (
            'Update'
          ) : (
            'Create'
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

