'use client';

import { Toaster } from 'react-hot-toast';
import { Box, Typography,} from '@mui/material';

import {CardRequest} from '@/components/UX/Card/cardRequest'



export default function TramitesPage() {

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Trámites Disponibles
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona una categoría y solicita el trámite que necesitas
      </Typography>

      <Box sx={{display:'flex', flexDirection:'row'}}>
        <CardRequest/>
      </Box>

    </Box>
  );
}