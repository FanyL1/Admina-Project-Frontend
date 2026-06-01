'use client';
import { Box, Container,Typography, useMediaQuery } from '@mui/material';

import {useLogin} from '../../login/useLogin'
import theme from '../../theme';

//PRUEBA DE INICIO DE SESSION

export default function HomePage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {sessionUser, getUserCreatedAt} = useLogin()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

       {/* Seccion de Contactos */}
      <Box sx={{ py: { xs: 2, sm: 6, md: 12}, }}
      >
        <Box sx={{  mx: { xs: 2, sm: 3, md: 12 }}}>
          <Box
            sx={{ width: 80, height: 4,
              background: `linear-gradient(90deg,${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                mb: 3, borderRadius: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem' },
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Session 
          </Typography>
        </Box>
        <Container maxWidth="lg">
          <Box
           sx={{
              position: 'relative',
              textAlign: 'justify',
              p: {xs: 2, sm: 4, md: 6},                         
            }}
          >

        <Box>
            <Typography variant='h3'>
                <strong>Email:</strong>{sessionUser?.email}
            </Typography>
            <Typography variant='h6'>
               <strong>ID Usuario:</strong> {sessionUser?.id}
            </Typography>
            <Typography>
               <strong>Nombres:</strong>  {sessionUser?.name}
            </Typography>
            <Typography>
               <strong> Apellidos:</strong> {sessionUser?.lastname}
            </Typography>
             <Typography>
                <strong>Cedula:</strong> {sessionUser?.dni}
            </Typography>
            <Typography>
               <strong> Fecha de creacion</strong> {sessionUser?.created_at}
            </Typography>
            <Typography>
                <strong>Fecha de creacion con getUserCreatedAt()</strong> {getUserCreatedAt()}
            </Typography>
            <Typography>
                <strong>ID Rol </strong>{sessionUser?.role?.id}
            </Typography>
             <Typography>
                <strong>Rol </strong>{sessionUser?.role?.name}
            </Typography>
            <Typography>
                <strong>Estado</strong> {sessionUser?.status}
            </Typography>
        </Box>
           
          </Box>
        </Container>
      </Box>
     
    </Box>
  );
}