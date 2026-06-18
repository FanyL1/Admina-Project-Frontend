'use client';
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid as Grid } from '@mui/material';
import { Assignment, CheckCircle, Pending, Schedule } from '@mui/icons-material';
import { StatsCard } from '@/components/UX/Dashboard/StatsCard';
import { RecentActivity } from '@/components/UX/Dashboard/RecentActivity';

import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import {useLogin} from '@/app/login/useLogin'
export default function StudentDashboard() {

  const {requestUser, loading} = useGetAllRequest()
  const [stats, setStats] = useState({
    activeRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    processingRequests: 0
  });
  const [recentResolved, setRecentResolved] = useState([]);
  const {sessionUser} = useLogin()



  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>      
      {/* 
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Resumen de Solicitudes
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Solicitudes Activas"
              value={stats.activeRequests}
              icon={<Assignment sx={{ fontSize: 32, color: '#1976d2' }} />}
              loading={loading}
              trend={12}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="En Proceso"
              value={stats.processingRequests}
              icon={<Schedule sx={{ fontSize: 32, color: '#ff9800' }} />}
              loading={loading}
              color="#ff9800"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Pendientes"
              value={stats.pendingRequests}
              icon={<Pending sx={{ fontSize: 32, color: '#ffc107' }} />}
              loading={loading}
              color="#ffc107"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Completadas"
              value={stats.completedRequests}
              icon={<CheckCircle sx={{ fontSize: 32, color: '#4caf50' }} />}
              loading={loading}
              color="#4caf50"
              trend={8}
            />
          </Grid>
        </Grid>
      </Box> */}

      {/* Solicitudes recientes resueltas */}
      <RecentActivity title="Solicitudes Recientes" />

    </Container>
  );
}