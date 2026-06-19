import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Paper, CircularProgress, Button, Link } from '@mui/material';
import { AccessTime, CheckCircle, Cancel, Pending } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import { statusColor } from '@/app/theme';

interface RecentActivityProps {
  title: string; 
}

export const RecentActivity = ({ title }: RecentActivityProps) => {

  const { requestUser, loading } = useGetAllRequest();
  const recentRequests = requestUser ? requestUser.slice(0, 3) : [];
  console.log(requestUser)
  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

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
                <Box sx={{display: 'flex', justifyContent:'space-between', width:"100%"}}>
                    <Box sx={{display:'flex', flexDirection:'column'}}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                       <strong> {activity.type_procedure?.name || 'Solicitud de Trámite'}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Revisor asignado: {activity?.revisor_id?.name || 'No asignado'} {activity?.revisor_id?.lastname}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.updated_at 
                          ? new Date(activity.updated_at).toLocaleString('es-VE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            }) : 'Fecha no disponible'}
                      </Typography>
                    </Box>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0.5 }}>
                     
                      <Chip label={activity.status} size="small" sx={{color:'white', ml:'5px', backgroundColor:statusColor(activity.status), height: 20, fontSize: '0.7rem' }}/>
                      <Button component={Link} href={`/request/${activity.id}`} size="small" startIcon={<VisibilityIcon />}>
                        Ver
                      </Button>
                    </Box>
                </Box>
              </ListItem>
              {index < recentRequests.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};