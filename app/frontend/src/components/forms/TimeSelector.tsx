import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { format, parse, setHours, setMinutes, startOfDay, isValid, isBefore, isAfter } from 'date-fns';

export interface TimeSelectorProps {
  label: string;
  value: string; // ISO datetime string
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  minTime?: string; // ISO datetime string for minimum allowed time
  maxTime?: string; // ISO datetime string for maximum allowed time
}

// Generate time slots from 8:00 AM to 8:00 PM in 30-minute intervals
const generateTimeSlots = () => {
  const slots: { value: string; label: string }[] = [];
  
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = setMinutes(setHours(startOfDay(new Date()), hour), minute);
      const timeString = format(time, 'HH:mm');
      const displayString = format(time, 'h:mm a');
      
      slots.push({
        value: timeString,
        label: displayString,
      });
    }
  }
  
  return slots;
};

const timeSlots = generateTimeSlots();

export const TimeSelector = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  minTime,
  maxTime,
}: TimeSelectorProps) => {
  // Extract date and time from the ISO string
  const dateTime = new Date(value);
  const currentDate = isValid(dateTime) ? format(dateTime, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  const currentTime = isValid(dateTime) ? format(dateTime, 'HH:mm') : '09:00';

  // Filter time slots based on min/max constraints
  const getFilteredTimeSlots = () => {
    if (!minTime && !maxTime) return timeSlots;
    
    return timeSlots.filter(slot => {
      const slotDateTime = parse(`${currentDate} ${slot.value}`, 'yyyy-MM-dd HH:mm', new Date());
      
      if (minTime) {
        const minDateTime = new Date(minTime);
        // If it's the same date, check time constraints
        if (format(minDateTime, 'yyyy-MM-dd') === currentDate) {
          if (isBefore(slotDateTime, minDateTime)) {
            return false;
          }
        }
      }
      
      if (maxTime) {
        const maxDateTime = new Date(maxTime);
        // If it's the same date, check time constraints
        if (format(maxDateTime, 'yyyy-MM-dd') === currentDate) {
          if (isAfter(slotDateTime, maxDateTime)) {
            return false;
          }
        }
      }
      
      return true;
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const newDateTime = parse(`${newDate} ${currentTime}`, 'yyyy-MM-dd HH:mm', new Date());
    onChange(newDateTime.toISOString());
  };

  const handleTimeChange = (event: SelectChangeEvent<string>) => {
    const newTime = event.target.value;
    const newDateTime = parse(`${currentDate} ${newTime}`, 'yyyy-MM-dd HH:mm', new Date());
    onChange(newDateTime.toISOString());
  };

  const filteredTimeSlots = getFilteredTimeSlots();

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      {/* Date Picker */}
      <FormControl 
        sx={{ 
          minWidth: 160,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
        error={error}
      >
        <InputLabel shrink>{label} Date</InputLabel>
        <input
          type="date"
          value={currentDate}
          onChange={handleDateChange}
          disabled={disabled}
          required={required}
          style={{
            padding: '16.5px 14px',
            border: error ? '2px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '1rem',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = '#1976d2';
              e.target.style.borderWidth = '2px';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
              e.target.style.borderWidth = '1px';
            }
          }}
        />
      </FormControl>

      {/* Time Picker */}
      <FormControl 
        sx={{ 
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
        error={error}
      >
        <InputLabel>{label} Time</InputLabel>
        <Select
          value={currentTime}
          onChange={handleTimeChange}
          label={`${label} Time`}
          disabled={disabled}
          required={required}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              },
            },
          }}
        >
          {filteredTimeSlots.map((slot) => (
            <MenuItem key={slot.value} value={slot.value}>
              {slot.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};