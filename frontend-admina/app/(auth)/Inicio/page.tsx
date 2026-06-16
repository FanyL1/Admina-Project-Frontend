'use client';
import { Box, Container,Typography, useMediaQuery } from '@mui/material';

import {useLogin} from '../../login/useLogin'
import theme from '../../theme';
import DashboardEstudiante from '@/components/UX/Dashboard/Estudiante'
import AdminDashboard from '@/components/UX/Dashboard/Administrativo';
import { SuperUserDashboard } from '@/components/UX/Dashboard/Superusuario';
import {WelcomeBanner }from '@/components/UX/Dashboard/WelcomeBanner'
//PRUEBA DE INICIO DE SESSION

export default function HomePage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {sessionUser, getUserCreatedAt} = useLogin()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ py: { xs: 2, sm: 2, md: 0.5}, }}>
        <Container maxWidth="lg">
         
        <WelcomeBanner/>

          <Box>
            {sessionUser?.role?.name == 'Estudiante' && <DashboardEstudiante/>}
            {sessionUser?.role?.name == 'Administrativo' && <AdminDashboard/>}
            {sessionUser?.role?.name == 'Superusuario' && <SuperUserDashboard activeUsers={{
              total: 30,
              students: 29,
              admins: 1
            }} inactiveUsers={{
              total: 5,
              students: 4,
              admins: 1
            }} successRate={{
              approved:100,
              rejected: 20,
              pending: 150,
              total: 270
            }}/>}
          </Box>
           
        </Container>
      </Box>
     
    </Box>
  );
}