// app/page.tsx (o pages/index.tsx)
'use client';
import { Box, Container,Typography, useMediaQuery } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import { Navbar } from '../../components/Shared/Navbar/navbar';
import { Buttons } from '../../components/UX/Buttons/buttons';
import { floatSuave } from '../../components/UX/Animation/animation404';
import { Copy } from '../../components/UX/Copy/handleCopy';
import theme from './../theme';



export default function HomePage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

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
            Terminos y Condiciones
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
            <Typography>
                Declara que los datos son validos
            </Typography>
        </Box>
           
          </Box>
        </Container>
      </Box>
     
    </Box>
  );
}