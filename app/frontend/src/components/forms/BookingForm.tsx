import {
  Box,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import { Booking, BookingValidationErrors } from '../../types/booking.types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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
}

export const BookingForm = ({
  booking,
  defaultStart,
  defaultEnd,
  onSubmit,
  onCancel,
  onDelete,
  errors = {},
}: BookingFormProps) => {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (booking) {
      setTitle(booking.title);
      setOrganizer(booking.organizer || '');
      setStart(format(new Date(booking.start), "yyyy-MM-dd'T'HH:mm"));
      setEnd(format(new Date(booking.end), "yyyy-MM-dd'T'HH:mm"));
    } else if (defaultStart && defaultEnd) {
      setStart(format(defaultStart, "yyyy-MM-dd'T'HH:mm"));
      setEnd(format(defaultEnd, "yyyy-MM-dd'T'HH:mm"));
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
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
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
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 2,
        }}>
          <TextField
            margin="dense"
            label="Start Time"
            type="datetime-local"
            fullWidth
            required
            value={start}
            onChange={(e) => setStart(e.target.value)}
            error={!!errors.start}
            helperText={errors.start}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
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
            label="End Time"
            type="datetime-local"
            fullWidth
            required
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            error={!!errors.end}
            helperText={errors.end}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
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
        {booking && onDelete && (
          <Button 
            onClick={onDelete} 
            color="error" 
            variant="outlined"
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
          sx={{
            minWidth: 120,
          }}
        >
          {booking ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
};

