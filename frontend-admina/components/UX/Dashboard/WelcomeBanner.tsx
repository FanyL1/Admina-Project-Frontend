import { Box, Paper, Typography, Avatar, Chip } from '@mui/material';
import { School, AdminPanelSettings, SupervisorAccount } from '@mui/icons-material';

import { useLogin } from '@/app/login/useLogin';

export const WelcomeBanner = () => {
  const {sessionUser} = useLogin()
  const roleGradients: Record<string, string> = {
    Estudiante: 'linear-gradient(135deg, #32539A, #6586CD)',
    Administrativo: 'linear-gradient(135deg, #0c1527, #32539A)',
    Superusuario: 'linear-gradient(135deg, #1a1a2e, #E94560)',
  };
  const gradient = roleGradients[sessionUser?.role?.name || ''] ||'linear-gradient(135deg, #32539A, #6586CD)';

  const getRoleIcon = (name: string | undefined) => {
    switch (sessionUser?.role?.name) {
      case 'Estudiante': return <School sx={{ fontSize: 40, color: '#ffffff' }} />;
      case 'Administrativo': return <AdminPanelSettings sx={{ fontSize: 40, color: '#ffffff' }} />;
      case 'Super Usuario': return <SupervisorAccount sx={{ fontSize: 40, color: '#ffffff' }} />;
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, background: gradient, color: 'white', mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            {getRoleIcon(sessionUser?.role?.name)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              ¡Bienvenido, {sessionUser?.name} {sessionUser?.lastname}!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color:'white' }}>
              Rol: {sessionUser?.role?.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};