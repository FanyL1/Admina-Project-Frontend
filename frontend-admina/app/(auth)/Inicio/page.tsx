'use client';
import { Box, Container,Typography, useMediaQuery } from '@mui/material';

import {useLogin} from '../../login/useLogin'
import theme from '../../theme';
import DashboardEstudiante from '@/components/UX/Dashboard/Estudiante'
import AdminDashboard from '@/components/UX/Dashboard/Administrativo';
import { SuperUserDashboard } from '@/components/UX/Dashboard/Superusuario';
import {WelcomeBanner }from '@/components/UX/Dashboard/WelcomeBanner'

export default function HomePage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {sessionUser, getUserCreatedAt} = useLogin()

  if (!sessionUser) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ py: { xs: 4, sm: 4, md: 0.5}, }}>
        <Container maxWidth="lg">
         
        <WelcomeBanner/>

          <Box>
            {sessionUser?.role?.name == 'Estudiante' && <DashboardEstudiante/>}
            {sessionUser?.role?.name == 'Administrativo' && <AdminDashboard/>}
            {sessionUser?.role?.name == 'Superusuario' && <SuperUserDashboard/>}

          </Box>
           
        </Container>
      </Box>
     
    </Box>
  );
}