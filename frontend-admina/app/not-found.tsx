'use client';

import { useRouter } from 'next/navigation';
// Importaciones directas de componentes para evitar sobrecargar el bundle
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme, alpha } from '@mui/material/styles';

// Importaciones directas de íconos (Crucial para el rendimiento en Next.js)
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpIcon from '@mui/icons-material/Help';
import { float, pulse } from './components/UX/Animation/animation404';


export default function NotFound() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: '0px', md: '30px' },
      }}
    >
      {/* Círculos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%', // Aseguramos el círculo
          top: '-10%',
          left: '-5%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          animation: `${pulse} 6s ease-in-out infinite`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          bottom: '10%',
          right: '-5%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 70%)`,
          animation: `${pulse} 8s ease-in-out infinite reverse`,
          zIndex: 0,
        }}
      />

      {/* Contenedor Principal */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: '90%', md: '100%' },
          height: { xs: 'auto', md: '100vh' },
          minHeight: { xs: '80vh', md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: { xs: 2, md: 4 },
          position: 'relative',
          background: 'transparent',
          zIndex: 1,
        }}
      >
        {/* SVG*/}
        <Box
          sx={{
            animation: `${float} 4s ease-in-out infinite`,
            display: 'inline-block',
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Círculo exterior */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={theme.palette.primary.main}
              strokeWidth="4"
              strokeDasharray="10 10"
            />
            
            {/* Círculo interior */}
            <circle
              cx="100"
              cy="100"
              r="70"
              fill={alpha(theme.palette.primary.main, 0.1)}
              stroke={theme.palette.secondary.main}
              strokeWidth="2"
            />

            {/* Signo de interrogación */}
            <text
              x="100"
              y="135"
              textAnchor="middle"
              fontSize="90"
              fontWeight="bold"
              fill={theme.palette.primary.main}
              fontFamily="Arial, sans-serif"
            >
              ?
            </text>

            {/* Puntos decorativos */}
            <circle cx="50" cy="100" r="4" fill={theme.palette.warning.main} />
            <circle cx="150" cy="100" r="4" fill={theme.palette.warning.main} />
            <circle cx="100" cy="40" r="3" fill={theme.palette.info.main} />
            <circle cx="100" cy="160" r="3" fill={theme.palette.info.main} />
          </svg>
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '5rem', md: '10rem' },
            fontWeight: 900,
            color: theme.palette.primary.main,
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2.5rem' },
          }}
        >
          ¡Página no encontrada!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#090F1B',
            mb: 2,
            maxWidth: '500px',
            fontSize: { xs: '0.9rem', md: '1.1rem' },
          }}
        >
          Parece que te has perdido en el camino. No te preocupes, 
          incluso los mejores exploradores necesitan una brújula de vez en cuando.
        </Typography>

        {/* Grupo de Botones */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            sx={{ px: 4, py: 1.5 }}
          >
            Ir al inicio
          </Button>

          <Button
            variant="tertiary" 
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ px: 4, py: 1.5 }}
          >
            Volver atrás
          </Button>

          <Button
            variant="text"
            size="large"
            startIcon={<HelpIcon />}
            onClick={() => router.push('/contacto')}
            sx={{ color: theme.palette.primary.main }}
          >
            Ayuda
          </Button>
        </Box>

        {/* Footer simple */}
        <Box
          sx={{
            opacity: 0.6,
            mt: 3
          }}
        >
          <Typography variant="caption" sx={{ color: '#0c1527' }}>
            Error Code: 404_NOT_FOUND_RESOURCE
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}