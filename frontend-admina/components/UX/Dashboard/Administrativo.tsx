'use client';
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid as Grid, Paper, List, ListItem, ListItemText, Chip, Button, Link } from '@mui/material';
import { Inbox, AssignmentInd, Today, CheckCircle } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import {useLogin} from '@/app/login/useLogin'
import { statusColor } from '@/app/theme';
import { StatsCard } from '@/components/UX/Dashboard/StatsCard';

export default function AdminDashboard() {

  const {requestRevisor, loading} = useGetAllRequest()
  const TotalRevisorActive = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status !== 'Aprobado' && totalRequest.status !== 'Rechazado'
  ) ?? [];
  const TotalRevisorRev = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status !== 'Revisando'
  ) ?? [];
  const TotalRevisorPending = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status !== 'Pendiente'
  ) ?? [];
  const TotalRevisorObs = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status !== 'Observado' && totalRequest.status !== 'Rechazado'
  ) ?? [];
  const TotalRevisorComp = requestRevisor?.filter(
    (totalRequest)=> totalRequest.status == 'Aprobado' || totalRequest.status == 'Rechazado'
  ) ?? [];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>      
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

      {/* Solicitudes recientes */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Solicitudes Recientes
        </Typography>
        <List>
          {requestRevisor.slice(0,10).map((req) => (
            <ListItem key={req.id} divider>
              <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between'}}>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      <strong>{req.type_procedure?.name || 'Solicitud de Trámite'}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Solicitante: {req?.createByname !== 'No Aplica' ? req.createByname : req.user?.name} {req?.createByname === 'No Aplica' ? req.user?.lastname : ''} - Cédula: {req?.createByDNI !== '0' ? req.createByDNI : req.user?.dni}
                  </Typography>
                </Box>
                <Box>
                  <Chip label={req.status} size="small" sx={{color:'white', marginLeft:'5px',backgroundColor:statusColor(req.status), height: 20, fontSize: '0.7rem' }}/>
                  <Button component={Link} href={`/request/${req.id}`} size="small" startIcon={<VisibilityIcon />}>
                    Ver
                  </Button>
                </Box>
              </Box>
              
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}