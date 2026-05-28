// components/Hero.tsx
import React from 'react';
import { Box, Container, Typography, useTheme, alpha } from '@mui/material';

export const Hero: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.3)} 50%, ${theme.palette.secondary.main} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
              sx={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary.main}`,
                opacity: 0.1,
                top: '-250px',
                left: '-200px',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary.main}`,
                bottom: '-150px',
                opacity: 0.1,
                right: '-100px',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: '250px',
                height: '250px',
                opacity: 0.1,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary.main}`,
                top: '30%',
                left: '10%',
              }}
            />
      
      <Container maxWidth="lg">
        {/* Espacio para los dos logos */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, sm: 4, md: 6 },
            mb: { xs: 2, sm: 3, md: 4 },
            flexWrap: 'wrap',
          }}
        >
          {/* Logo Admina */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              component="img"
              src="/Log-A.svg"
              alt="Logo Admina"
              sx={{
                height: { xs: 60, sm: 80, md: 100 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Admina
            </Typography>
          </Box>

          {/* Signo de más + */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            +
          </Typography>

          {/* Logo AIS */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              component="img"
              src="/Log-AIS.svg"
              alt="Logo AIS"
              sx={{
                height: { xs: 60, sm: 80, md: 100 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              AIS
            </Typography>
          </Box>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2,
                }}
              >
                Bienvenidos a la nueva era de la gestión 
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              color: theme.palette.text.primary,
              maxWidth: '800px',
              opacity: 0.9,
              mx: 'auto',
              mb: 4,
            }}
          >
            La solución integral para simplificar la administracion academica
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};