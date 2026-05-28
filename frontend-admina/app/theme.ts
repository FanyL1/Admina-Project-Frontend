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
      color: '#090F1B',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    body2: {
      fontSize: 12,
      color: '#090F1B',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    h2: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      backgroundColor: 'linear-gradient(135deg, #0c1527 0%, #253E74, #6586CD 100%)',
      color: 'transparent',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
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
      main: '#32539A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D8E1F3',
      contrastText: '#0c1527',
    },
    text: {
      primary: '#0c1527',
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
            border: '1px solid  #32539A',
            color: ' #32539A',
            '&:hover': {
              backgroundColor: ' #ECF0F9',
              border: '1px solid  #32539A',
            },
            '&:active': {
              backgroundColor: '#253E74',
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