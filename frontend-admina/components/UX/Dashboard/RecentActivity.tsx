import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Paper, CircularProgress } from '@mui/material';
import { AccessTime, CheckCircle, Cancel, Pending } from '@mui/icons-material';
import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest'; // Ajusta la ruta de tu hook según tu proyecto
import { statusColor } from '@/app/theme';

interface RecentActivityProps {
  title: string; 
}

export const RecentActivity = ({ title }: RecentActivityProps) => {
  // 1. Obtenemos los datos desde tu hook personalizado de Admina
  const { requestUser, loading } = useGetAllRequest();
  // 2. Filtramos y extraemos únicamente las últimas 3 solicitudes
  // Si tu backend ya las trae ordenadas de la más nueva a la más vieja, basta con el .slice(0, 3)
  // Si vienen al revés, puedes hacer: [...requestUser].reverse().slice(0, 3)
  const recentRequests = requestUser ? requestUser.slice(0, 3) : [];

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* 3. Manejo del estado de carga */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : recentRequests.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No hay actividad reciente
        </Typography>
      ) : (
        <List disablePadding>
          {recentRequests.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {/* Adaptado a los campos de tu tipo StudentRequestData */}
                      {activity.type_procedure?.name || 'Solicitud de Trámite'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" suppressHydrationWarning>
                        {activity.updated_at 
                          ? new Date(activity.updated_at).toLocaleDateString() 
                          : 'Fecha no disponible'}
                      </Typography>
                      <Chip label={activity.status} size="small" sx={{color:'white', backgroundColor:statusColor(activity.status), height: 20, fontSize: '0.7rem' }} suppressHydrationWarning/>
                    </Box>
                  }
                />
              </ListItem>
              {index < recentRequests.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};