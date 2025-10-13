import {
  Box,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
} from '@mui/material';
import { Room } from '../../types/room.types';
import { useState, useEffect } from 'react';

export interface RoomFormProps {
  room?: Room | null;
  onSubmit: (data: {
    name: string;
    location: string;
    capacity: number;
    isActive: boolean;
    workHours: { start: string; end: string };
    amenities: string[];
  }) => void;
  onCancel: () => void;
  errors?: Record<string, string>;
}

export const RoomForm = ({ room, onSubmit, onCancel, errors = {} }: RoomFormProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [workHoursStart, setWorkHoursStart] = useState('08:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('20:00');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setLocation(room.location);
      setCapacity(room.capacity);
      setIsActive(room.isActive);
      setWorkHoursStart(room.workHours.start);
      setWorkHoursEnd(room.workHours.end);
      setAmenities(room.amenities || []);
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      location: location.trim(),
      capacity,
      isActive,
      workHours: {
        start: workHoursStart,
        end: workHoursEnd,
      },
      amenities,
    });
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleDeleteAmenity = (amenityToDelete: string) => {
    setAmenities(amenities.filter((a) => a !== amenityToDelete));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>{room ? 'Edit Room' : 'New Room'}</DialogTitle>

      <DialogContent>
        {hasErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please fix the errors below
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Room Name"
          type="text"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Location"
          type="text"
          fullWidth
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          error={!!errors.location}
          helperText={errors.location}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Capacity"
          type="number"
          fullWidth
          required
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          error={!!errors.capacity}
          helperText={errors.capacity}
          inputProps={{ min: 1, max: 1000 }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            margin="dense"
            label="Work Hours Start"
            type="time"
            fullWidth
            required
            value={workHoursStart}
            onChange={(e) => setWorkHoursStart(e.target.value)}
            error={!!errors.workHoursStart}
            helperText={errors.workHoursStart}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="dense"
            label="Work Hours End"
            type="time"
            fullWidth
            required
            value={workHoursEnd}
            onChange={(e) => setWorkHoursEnd(e.target.value)}
            error={!!errors.workHoursEnd}
            helperText={errors.workHoursEnd}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Room is active"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <TextField
            margin="dense"
            label="Add Amenity"
            type="text"
            fullWidth
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={handleKeyPress}
            helperText="Press Enter to add"
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {amenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                onDelete={() => handleDeleteAmenity(amenity)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {room ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
};

