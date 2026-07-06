// components/CustomButton.tsx
import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variantType?: 'primary' | 'secondary' | 'tertiary';
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'variantType',
})<CustomButtonProps>(({ theme, variantType = 'primary' }) => {
  const styles = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: '#253E74',
      },
      '&:active': {
        backgroundColor: '#1c3a4a',
      },
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        backgroundColor: '#B2C2E6',
      },
      '&:active': {
        backgroundColor: '#32539A',
        color: '#FFFFFF',
      },
    },
    tertiary: {
      backgroundColor: '#FFFFFF',
      border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: '#ECF0F9',
        border: `1px solid ${theme.palette.primary.main}`,
      },
      '&:active': {
        backgroundColor: '#253E74',
        color: '#FFFFFF',
      },
    },
  };

  return {
    ...styles[variantType],
    textTransform: 'none',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '8px 16px',
    transition: 'all 0.3s ease',
    '&.Mui-disabled': {
      opacity: 0.6,
    },
  };
});

export const Buttons: React.FC<CustomButtonProps> = ({
  variantType = 'primary',
  children,
  ...props
}) => {
  return (
    <StyledButton variantType={variantType} {...props}>
      {children}
    </StyledButton>
  );
};