'use client';
import { Box } from '@mui/material';

import { StatisticsDashboard  } from '@/components/UX/Dashboard/StatisticsDashboard';
import { useGetAllRequest } from '@/app/(auth)/(management)//request/useRequest';
import { useGetAllUsers } from '../(management)/managementUser/usePage';
import { useGetAlltype } from '@/app/(auth)/(management)/managementType/useGetType';
import AppToaster from '@/components/UX/Toaster/AppToaster';
export default function StatisticsPage() {
  
 // const { requests } = useGetAllRequests();
  const { users } = useGetAllUsers();
  const { types } = useGetAlltype();
  const {request} = useGetAllRequest()

  const student = users.filter(
    (t) => t.role.name == 'Estudiante'
  ) ?? []

  return (
    <Box sx={{ p: 0 }}>
      <AppToaster/>
      <StatisticsDashboard/>
    </Box>
  );
}