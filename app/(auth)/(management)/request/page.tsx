'use client';
import { Box, Typography,} from '@mui/material';
import {CardRequest} from '@/components/UX/Card/cardRequest'
import AppToaster from '@/components/UX/Toaster/AppToaster';
export default function TramitesPage() {

  return (
    <Box sx={{ p: { xs: 8, sm: 3, md: 4 } }}>
      <AppToaster/>

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Solicitudes Disponibles
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