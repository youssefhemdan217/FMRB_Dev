import { Dialog, DialogProps } from '@mui/material';

export interface ModalProps extends DialogProps {
  // Can extend with custom props if needed
}

export const Modal = (props: ModalProps) => {
  return (
    <Dialog
      {...props}
      PaperProps={{
        ...props.PaperProps,
        sx: {
          borderRadius: 2,
          ...props.PaperProps?.sx,
        },
      }}
    />
  );
};

