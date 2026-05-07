'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tertiary: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 14,
    body1: {
      fontSize: 14,
      color: '#0A141A',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    body2: {
      fontSize: 12,
      color: '#0A141A',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    h2: {
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    h5: {
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    h6: {
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
  },
  palette: {
    primary: {
      main: '#377495',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DAE9F1',
      contrastText: '#0E1D25',
    },
    text: {
      primary: '#0A141A',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
      variants: [
        {
          props: { variant: 'tertiary' as any },
          style: {
            backgroundColor: '#FFFFFF',
            border: '1px solid #377495',
            color: '#377495',
            '&:hover': {
              backgroundColor: '#ECF4F8',
              border: '1px solid #377495',
            },
            '&:active': {
              backgroundColor: '#8FBDD6',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;