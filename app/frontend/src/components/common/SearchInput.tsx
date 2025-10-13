import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';

export interface SearchInputProps extends Omit<TextFieldProps, 'onChange'> {
  onSearchChange: (value: string) => void;
  debounceMs?: number;
}

export const SearchInput = ({
  onSearchChange,
  debounceMs = 300,
  ...textFieldProps
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onSearchChange]);

  return (
    <TextField
      {...textFieldProps}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        ...textFieldProps.InputProps,
      }}
    />
  );
};

