// components/UX/Form/Form.tsx
import { ReactNode, FormEvent } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface FormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  sx?: SxProps<Theme>;
  noValidate?: boolean;
}

const Form = ({ children, onSubmit, sx, noValidate = true }: FormProps) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate={noValidate}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Form;