
import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Paper } from '@mui/material';
import { AccessTime, CheckCircle, Cancel, Pending } from '@mui/icons-material';

interface Activity {
  id: string;
  title: string;
  date: string;
  status: 'approved' | 'rejected' | 'pending' | 'processing';
  description?: string;
}

interface RecentActivityProps {
  activities: Activity[];
  title: string;
}

export const RecentActivity = ({ activities, title }: RecentActivityProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />;
      case 'rejected': return <Cancel sx={{ fontSize: 20, color: '#f44336' }} />;
      case 'pending': return <Pending sx={{ fontSize: 20, color: '#ff9800' }} />;
      default: return <AccessTime sx={{ fontSize: 20, color: '#2196f3' }} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'pending': return 'Pendiente';
      default: return 'En proceso';
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No hay actividad reciente
        </Typography>
      ) : (
        <List disablePadding>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <Box sx={{ mr: 2 }}>{getStatusIcon(activity.status)}</Box>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{fontWeight:500}}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {activity.date}
                      </Typography>
                      <Chip label={getStatusLabel(activity.status)} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    </Box>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};