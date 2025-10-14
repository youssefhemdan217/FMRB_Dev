import { Modal } from '../common/Modal';
import { RoomForm } from '../forms/RoomForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeRoomModal, showToast } from '../../store/slices/uiSlice';
import { createRoom, updateRoom } from '../../store/slices/roomsSlice';
import { selectRoomById } from '../../store/selectors/roomSelectors';
import { validateRoom } from '../../utils/validators';
import { useState, useMemo } from 'react';

export const RoomModal = () => {
  const dispatch = useAppDispatch();
  const { open, roomId } = useAppSelector((state) => state.ui.roomModal);
  const { loading } = useAppSelector((state) => state.rooms);
  
  // Memoize the selector to avoid creating a new one on each render
  const roomSelector = useMemo(
    () => (roomId ? selectRoomById(roomId) : null),
    [roomId]
  );
  
  const room = useAppSelector((state) => (roomSelector ? roomSelector(state) : null));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: {
    name: string;
    location: string;
    capacity: number;
    isActive: boolean;
    workHours: { start: string; end: string };
    amenities: string[];
  }) => {
    // Validate room data
    const validation = validateRoom(data);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (roomId && room) {
        // Update existing room
        await dispatch(updateRoom({
          id: roomId,
          data: {
            name: data.name,
            location: data.location,
            capacity: data.capacity,
            isActive: data.isActive,
            workHours: data.workHours,
            amenities: data.amenities,
          },
        })).unwrap();
        
        dispatch(showToast({
          message: `Room "${data.name}" updated successfully`,
          type: 'success',
        }));
      } else {
        // Create new room
        await dispatch(createRoom({
          name: data.name,
          location: data.location,
          capacity: data.capacity,
          isActive: data.isActive,
          workHours: data.workHours,
          amenities: data.amenities,
        })).unwrap();
        
        dispatch(showToast({
          message: `Room "${data.name}" created successfully`,
          type: 'success',
        }));
      }

      handleClose();
    } catch (error) {
      dispatch(showToast({
        message: error as string || 'Failed to save room',
        type: 'error',
      }));
    }
  };

  const handleClose = () => {
    setErrors({});
    dispatch(closeRoomModal());
  };

  return (
    <Modal open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <RoomForm 
        room={room} 
        onSubmit={handleSubmit} 
        onCancel={handleClose} 
        errors={errors}
        loading={loading}
      />
    </Modal>
  );
};

