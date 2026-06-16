import { Box, Typography, Paper, Chip, Divider, List, ListItem, ListItemText, LinearProgress, Card, CardContent } from '@mui/material';
import { People, PersonOff, TrendingUp, TrendingDown, CheckCircle, Cancel, PieChart } from '@mui/icons-material';

interface SuperUserDashboardProps {
  activeUsers: {
    total: number;
    students: number;
    admins: number;
  };
  inactiveUsers: {
    total: number;
    students: number;
    admins: number;
  };
  successRate: {
    approved: number;
    rejected: number;
    pending: number;
    total: number;
  };
}

export const SuperUserDashboard = ({ activeUsers, inactiveUsers, successRate }: SuperUserDashboardProps) => {
  const totalUsers = activeUsers.total + inactiveUsers.total;
  const successPercentage = successRate.total > 0 
    ? ((successRate.approved + successRate.rejected) / successRate.total) * 100 
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Tarjetas de Usuarios */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Usuarios Activos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {activeUsers.total}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Estudiantes: {activeUsers.students}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Administrativos: {activeUsers.admins}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <People sx={{ fontSize: 48 }} />
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Usuarios Inactivos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {inactiveUsers.total}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Estudiantes: {inactiveUsers.students}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Administrativos: {inactiveUsers.admins}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonOff sx={{ fontSize: 48 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Tasa de Éxito */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tasa de Éxito del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {successRate.total} solicitudes procesadas
            </Typography>
          </Box>
          <PieChart color="primary" sx={{ fontSize: 32 }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Aprobadas */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Aprobadas</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                {successRate.approved} ({successRate.total > 0 ? ((successRate.approved / successRate.total) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={successRate.total > 0 ? (successRate.approved / successRate.total) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e8f5e9',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#2e7d32'
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CheckCircle sx={{ fontSize: 16, color: '#2e7d32' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes exitosas
              </Typography>
            </Box>
          </Box>

          {/* Rechazadas */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Rechazadas</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                {successRate.rejected} ({successRate.total > 0 ? ((successRate.rejected / successRate.total) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={successRate.total > 0 ? (successRate.rejected / successRate.total) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#ffebee',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#c62828'
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Cancel sx={{ fontSize: 16, color: '#c62828' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes rechazadas
              </Typography>
            </Box>
          </Box>

          {/* Pendientes */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Pendientes</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e65100' }}>
                {successRate.pending} ({successRate.total > 0 ? ((successRate.pending / successRate.total) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={successRate.total > 0 ? (successRate.pending / successRate.total) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#fff3e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#e65100'
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TrendingDown sx={{ fontSize: 16, color: '#e65100' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes estancadas
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Resumen */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tasa de éxito general
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {successPercentage.toFixed(1)}%
          </Typography>
        </Box>
      </Paper>

      {/* Últimos usuarios activos (opcional) */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {totalUsers} usuarios totales • {activeUsers.total} activos • {inactiveUsers.total} inactivos
      </Typography>
    </Box>
  );
};