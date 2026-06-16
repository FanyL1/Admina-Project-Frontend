'use client';
import { Box } from '@mui/material';
import { StatisticsDashboard  } from '@/components/UX/Dashboard/StatisticsDashboard';
//import { useGetAllRequests } from '@../';
import { useGetAllUsers } from '../(management)/managementUser/usePage';
import { useGetAlltype } from '@/app/(auth)/(management)/managementRequest/useGetType';

export default function StatisticsPage() {
 // const { requests } = useGetAllRequests();
  const { users } = useGetAllUsers();
  const { types } = useGetAlltype();

  // Datos de ejemplo para semestres
  const semesters = [
    { id: '1', semester: '1', year: 2024 },
    { id: '2', semester: '2', year: 2024 },
    { id: '3', semester: '1', year: 2025 },
    { id: '4', semester: '2', year: 2025 }
  ];

  // Años disponibles para el filtro
//   const years = Array.from(
//     new Set(requests?.map(r => new Date(r.created_at).getFullYear()) || [])
//   ).sort();

  return (
    <Box sx={{ p: 0 }}>
      <StatisticsDashboard requests={[]} students={[]}/>
    </Box>
  );
}