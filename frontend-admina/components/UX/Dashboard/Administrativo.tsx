'use client';
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid as Grid, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Inbox, AssignmentInd, Today, CheckCircle } from '@mui/icons-material';
import { StatsCard } from '@/components/UX/Dashboard/StatsCard';
import { WelcomeBanner } from '@/components/UX/Dashboard/WelcomeBanner';


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inboxTotal: 0,
    reviewerTotal: 0,
    attendedToday: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setStats({
          inboxTotal: 15,
          reviewerTotal: 8,
          attendedToday: 12,
          approvedToday: 9,
          rejectedToday: 3
        });
        setRecentRequests([
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>      
      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatsCard
            title="Bandeja de Entrada"
            value={stats.inboxTotal}
            icon={<Inbox sx={{ fontSize: 32 }} />}
            loading={loading}
            subtitle="Sin asignar"
            color="#2196f3"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatsCard
            title="Mis Asignaciones"
            value={stats.reviewerTotal}
            icon={<AssignmentInd sx={{ fontSize: 32 }} />}
            loading={loading}
            subtitle="Pendientes de revisión"
            color="#ff9800"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatsCard
            title="Atendidos Hoy"
            value={stats.attendedToday}
            icon={<Today sx={{ fontSize: 32 }} />}
            loading={loading}
            subtitle={`${stats.approvedToday} aprobados, ${stats.rejectedToday} rechazados`}
            color="#4caf50"
            trend={15}
          />
        </Grid>
      </Grid>

      {/* Solicitudes recientes */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Solicitudes Recientes
        </Typography>
        <List>
          {recentRequests.map((req) => (
            <ListItem key={req} divider>
              <ListItemText
                primary={req}
                secondary={`${req} - ${req}`}
              />
              <Chip 
                label={req=== 'alta' ? 'Urgente' : req=== 'media' ? 'Normal' : 'Baja'}
                size="small"
                color={req=== 'alta' ? 'error' : req=== 'media' ? 'warning' : 'default'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Resumen del día */}
      <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
        <Typography variant="body2" color="success.main">
          ✅ Hoy has atendido {stats.attendedToday} solicitudes, superando tu promedio diario
        </Typography>
      </Box>
    </Container>
  );
}