import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppSelector, useAppDispatch } from '../store';
import { selectAllRooms } from '../store/selectors/roomSelectors';
import { deleteRoom } from '../store/slices/roomsSlice';
import { openRoomModal, showToast } from '../store/slices/uiSlice';
import { RoomModal } from '../components/modals/RoomModal';
import { useState } from 'react';

export const RoomManagementPage = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(selectAllRooms);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleAddRoom = () => {
    dispatch(openRoomModal({}));
  };

  const handleEditRoom = (roomId: string) => {
    dispatch(openRoomModal({ roomId }));
  };

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      dispatch(deleteRoom(roomToDelete));
      dispatch(
        showToast({
          message: 'Room deleted successfully',
          type: 'success',
        })
      );
    }
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 3, md: 4 },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Room Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Manage meeting rooms and their settings
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddRoom}
          fullWidth={false}
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            py: { xs: 1.5, sm: 1 },
          }}
        >
          Add Room
        </Button>
      </Box>

      {/* Desktop Table View */}
      <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Capacity</TableCell>
              <TableCell>Work Hours</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {room.name}
                  </Typography>
                </TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell align="center">{room.capacity}</TableCell>
                <TableCell>
                  {room.workHours.start} - {room.workHours.end}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={room.isActive ? 'Active' : 'Inactive'}
                    icon={room.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                    color={room.isActive ? 'success' : 'error'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      px: 1,
                      '& .MuiChip-icon': {
                        fontSize: '1rem',
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditRoom(room.id)}
                      sx={{
                        backgroundColor: 'rgba(0, 61, 82, 0.08)',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(room.id)}
                      sx={{
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {rooms.map((room) => (
          <Paper 
            key={room.id} 
            sx={{ 
              mb: 2, 
              p: 2.5,
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#003D52' }}>
                  {room.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {room.location}
                </Typography>
              </Box>
              <Chip
                label={room.isActive ? 'Active' : 'Inactive'}
                icon={room.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                color={room.isActive ? 'success' : 'error'}
                size="small"
                sx={{
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Capacity
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {room.capacity} people
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Work Hours
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {room.workHours.start} - {room.workHours.end}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEditRoom(room.id)}
                fullWidth
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(room.id)}
                fullWidth
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {rooms.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No rooms yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click &quot;Add Room&quot; to create your first meeting room
          </Typography>
        </Box>
      )}

      {/* Room Modal */}
      <RoomModal />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this room? All associated bookings will remain
            but won&apos;t be visible. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

