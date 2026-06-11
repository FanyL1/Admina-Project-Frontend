'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTaskIcon from '@mui/icons-material/AddTask';
import toast, { Toaster } from 'react-hot-toast';
import ProcedureForm from '@/components/UX/Form/Procedure/ProcedureForm';
import { ProcedureTypeFormData } from '@/app/type';
import { createProcedureType } from './useProcedureType';


export default function AddProcedurePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: ProcedureTypeFormData) => {
    setLoading(true);

    try {
      await createProcedureType(values);
      router.push('/managementRequest');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el tramite';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Toaster position="top-center" reverseOrder={false} />

      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0c1527 0%, #32539A 55%, #6586CD 100%)',
              color: 'white',
              p: { xs: 3, md: 4 },
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'rgba(255,255,255,0.82)' }}>
                <AddTaskIcon fontSize="small" />
                <Typography variant="body2">Nuevo tipo de tramite</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Agregar tramite
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/managementRequest')}
            >
              Volver
            </Button>
          </Box>
        </Paper>

        <ProcedureForm
          loading={loading}
          submitLabel="Crear tramite"
          onSubmit={handleSubmit}
        />
      </Container>
    </Box>
  );
}
