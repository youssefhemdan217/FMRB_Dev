import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  // Can extend with custom props if needed
}

export const Button = (props: ButtonProps) => {
  return <MuiButton {...props} />;
};

