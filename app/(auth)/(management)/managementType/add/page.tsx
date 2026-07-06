'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTaskIcon from '@mui/icons-material/AddTask';
import toast from 'react-hot-toast';
import ProcedureForm from '@/components/UX/Form/Procedure/ProcedureForm';
import { ProcedureTypeFormData } from '@/app/type';
import { createProcedureType } from './useProcedureType';
import AppToaster from '@/components/UX/Toaster/AppToaster';

export default function AddProcedurePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: ProcedureTypeFormData) => {
    setLoading(true);

    try {
      await createProcedureType(values);
      router.push('/managementType');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el tramite';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <AppToaster />

      <Container maxWidth="lg">
        <Box
          sx={{ overflow: 'hidden',mb: 3, }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ alignSelf: 'flex-start' }}>
            Volver
          </Button>
        </Box>

        <ProcedureForm
          loading={loading}
          submitLabel="Crear tramite"
          onSubmit={handleSubmit}
        />
      </Container>
    </Box>
  );
}
