
import React from 'react'

import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import { Box, Grid, Typography } from '@mui/material';
import { StatsCard } from './StatsCard';
import { AssignmentInd, CheckCircle, Inbox, Today } from '@mui/icons-material';

export default function ResumAdmin() {

const {requestRevisor, loading} = useGetAllRequest()

  const TotalRevisorActive = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Enviado'
  ) ?? [];
  const TotalRevisorRev = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Revisando'
  ) ?? [];
  const TotalRevisorPending = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Pendiente'
  ) ?? [];
  const TotalRevisorObs = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Observado'
  ) ?? [];
  const TotalRevisorComp = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Aprobado' || totalRequest.status == 'Rechazado'
  ) ?? [];
  return (
    <Box>
        {/* Estadísticas principales */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Resumen de Solicitudes
        </Typography>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <StatsCard
              title="Solicitudes Activas"
              value={TotalRevisorActive.length}
              icon={<AssignmentInd sx={{ fontSize: 32, color: '#1976d2' }} />}
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.2 }}>
            <StatsCard
              title="Revisando"
              value={TotalRevisorRev.length}
              icon={<Inbox sx={{ fontSize: 32, color: '#ff9800' }} />}
              loading={loading}
              color="#ff9800"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.2 }}>
            <StatsCard
              title="Observadas"
              value={TotalRevisorObs.length}
              icon={<Today sx={{ fontSize: 32, color: '#ffc107' }} />}
              loading={loading}
              color="#ffc107"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.2 }}>
            <StatsCard
              title="Pendiente"
              value={TotalRevisorPending.length}
              icon={<Today sx={{ fontSize: 32, color: '#ffc107' }} />}
              loading={loading}
              color="#ffc107"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 46, md: 2.5}}>
            <StatsCard
              title="Completadas"
              value={TotalRevisorComp.length}
              icon={<CheckCircle sx={{ fontSize: 32, color: '#4caf50' }} />}
              loading={loading}
              color="#4caf50"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}