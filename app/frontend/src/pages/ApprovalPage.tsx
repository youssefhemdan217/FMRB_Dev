import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip, IconButton, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import bookingsApi, { Booking } from '../services/api/bookings.api';
import { useAppSelector, useAppDispatch } from '../store';
import { showToast } from '../store/slices/uiSlice';

export const ApprovalPage = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [pending, setPending] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getPending();
      setPending(data);
    } catch (e) {
      dispatch(showToast({ message: 'Failed to load pending bookings', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canApprove = isAuthenticated && ['admin', 'approval'].includes((user?.role || '') as any);
    if (canApprove) {
      void loadPending();
    }
  }, [isAuthenticated, user]);

  const handleApprove = async (id: string) => {
    try {
      setActioningId(id);
      await bookingsApi.approve(id);
      dispatch(showToast({ message: 'Booking approved', type: 'success' }));
      await loadPending();
    } catch (e) {
      dispatch(showToast({ message: 'Failed to approve booking', type: 'error' }));
    } finally {
      setActioningId(null);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setActioningId(id);
      await bookingsApi.decline(id);
      dispatch(showToast({ message: 'Booking declined', type: 'success' }));
      await loadPending();
    } catch (e) {
      dispatch(showToast({ message: 'Failed to decline booking', type: 'error' }));
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Pending Approvals
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Organizer</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{b.organizer || '-'}</TableCell>
                  <TableCell>{b.roomId}</TableCell>
                  <TableCell>{new Date(b.start).toLocaleString()}</TableCell>
                  <TableCell>{new Date(b.end).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label={b.status} color={b.status === 'approved' ? 'success' : b.status === 'pending' ? 'warning' : 'error'} size="small" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="approve" color="success" disabled={actioningId === b.id} onClick={() => handleApprove(b.id)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton aria-label="decline" color="error" disabled={actioningId === b.id} onClick={() => handleDecline(b.id)}>
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                      No pending bookings
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ApprovalPage;


