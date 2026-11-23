'use client';
import { Box, Container } from '@mui/material';

import {useLogin} from '../../login/useLogin'
import DashboardEstudiante from '@/components/UX/Dashboard/Estudiante'
import AdminDashboard from '@/components/UX/Dashboard/Administrativo';
import { SuperUserDashboard } from '@/components/UX/Dashboard/Superusuario';
import {WelcomeBanner }from '@/components/UX/Dashboard/WelcomeBanner'
import AcademicSetup from '@/components/UX/Dashboard/AcademicSetup'

export default function HomePage() {
  const {sessionUser} = useLogin()
  const roleName = sessionUser?.role?.name
  const isAdmin = roleName === 'Administrativo' || roleName === 'Superusuario'


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ py: { xs: 6, sm: 4, md: 0.5},}}>
        <Container maxWidth="lg">
         
        <WelcomeBanner/>

          {isAdmin && <AcademicSetup />}

          <Box>
            {roleName == 'Estudiante' && <DashboardEstudiante/>}
            {roleName == 'Administrativo' && <AdminDashboard/>}
            {roleName == 'Superusuario' && <SuperUserDashboard/>}

          </Box>
           
        </Container>
      </Box>
     
    </Box>
  );
}