import React from 'react';
import { Box, Container, Typography, useTheme, alpha, Stack, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
        {/* Logos */}
        <Box sx={{display:'flex', justifyContent: 'center'}}
        >
          {/* Logo Admina */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src="/Log-A.svg"
              alt="Admina Logo"
              sx={{
                height: { xs: 70, sm: 90, md: 110 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.primary, 0.7),
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Admina
            </Typography>
          </Box>

          {/* Signo de + estilizado */}
          <Box
            sx={{
              width: { xs: 40, sm: 50, md: 60 },
              height: { xs: 40, sm: 50, md: 60 },
              display: 'flex',
              m: {xs: '15px', md:'25px'},
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: alpha(theme.palette.primary.main, 0.1),
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: theme.palette.primary.main,
                lineHeight: 1,
              }}
            >
              +
            </Typography>
          </Box>

          {/* Logo AIS */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src="/Log-AIS-transp.svg"
              alt="AIS Logo"
              sx={{
                height: { xs: 70, sm: 90, md: 110 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.primary, 0.7),
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              AIS
            </Typography>
          </Box>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Transformando la Gestión Académica
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.6rem' },
              fontWeight: 500,
              color: alpha(theme.palette.text.primary, 0.85),
              maxWidth: '750px',
              mx: 'auto',
              lineHeight: 1.4,
            }}
          >
            Alianza que simplifica la administración educativa
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};