import { Modal } from '../common/Modal';
import { RoomForm } from '../forms/RoomForm';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeRoomModal, showToast } from '../../store/slices/uiSlice';
import { addRoom, updateRoom } from '../../store/slices/roomsSlice';
import { selectRoomById } from '../../store/selectors/roomSelectors';
import { validateRoom } from '../../utils/validators';
import { useState, useMemo } from 'react';

export const RoomModal = () => {
  const dispatch = useAppDispatch();
  const { open, roomId } = useAppSelector((state) => state.ui.roomModal);
  
  // Memoize the selector to avoid creating a new one on each render
  const roomSelector = useMemo(
    () => (roomId ? selectRoomById(roomId) : null),
    [roomId]
  );
  
  const room = useAppSelector((state) => (roomSelector ? roomSelector(state) : null));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (data: {
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

    if (roomId && room) {
      // Update existing room
      dispatch(
        updateRoom({
          ...room,
          ...data,
        })
      );
      dispatch(
        showToast({
          message: 'Room updated successfully',
          type: 'success',
        })
      );
    } else {
      // Create new room
      const newRoom = {
        id: `room-${Date.now()}`,
        ...data,
      };
      dispatch(addRoom(newRoom));
      dispatch(
        showToast({
          message: 'Room created successfully',
          type: 'success',
        })
      );
    }

    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    dispatch(closeRoomModal());
  };

  return (
    <Modal open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <RoomForm room={room} onSubmit={handleSubmit} onCancel={handleClose} errors={errors} />
    </Modal>
  );
};

