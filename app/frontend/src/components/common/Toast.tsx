import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { hideToast } from '../../store/slices/uiSlice';

export const Toast = () => {
  const dispatch = useAppDispatch();
  const { open, message, type } = useAppSelector((state) => state.ui.toast);

  const handleClose = () => {
    dispatch(hideToast());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={type as AlertColor} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

