'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Card, Container, Paper, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

import { useGetAllLogs } from './useLogs';
import { useGetAllUsers } from '../managementUser/usePage';
import {useLogin} from '@/app/login/useLogin'
import { useGetAllCategory } from '../managementCategory/useCategory';
import { useGetAllDegree } from '../managementDegree/useDegre';
import { useGetAlltype } from '../managementRequest/useGetType';
import { Copy } from '@/components/UX/Copy/handleCopy';

export default function ManagementRequestPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true, status: true });
  const {logs,loading,refreshLogs,refetch} = useGetAllLogs()
  const {users} = useGetAllUsers()
  const {categories} = useGetAllCategory();
  const {degrees} = useGetAllDegree()
  const {types} = useGetAlltype()
  const {sessionUser, getUserCreatedAt} = useLogin()
  console.log(logs)

  // Función para obtener el nombre del recurso según el tipo y ID
const getResourceName = (resourceType: string, resourceId: string) => {
  if (!resourceId) return 'N/A';
  
  switch (resourceType) {
    case 'User':
      const user = users?.find((u: any) => u.id === resourceId);
      return user ? `${user.email}` : 'Usuario no encontrado';
      
    case 'Category':
      const category = categories?.find((c: any) => c.id === resourceId);
      return category?.name || 'Categoría no encontrada';
      
    case 'Carrera':
      const degree = degrees?.find((d: any) => d.id === resourceId);
      return degree?.name || 'Carrera no encontrado';
      
    case 'Type':
      const type = types?.find((t: any) => t.id === resourceId);
      return type?.name || 'Tipo no encontrado';
  
    default:
      return `Recurso ${resourceType} no manejado`;
  }
};
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Logs registrados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{logs.length}</Typography>
            </Box>
          </Paper>
        </Box>
        <Box>
            {logs.slice(0, 20).map((log)=>( <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', mt:0.6,
                textAlign: 'justify', transition: 'transform 0.3s, box-shadow 0.3s',}} key={log.id}
               >
                {users.map((user)=>( <Box key={user.id} >
                    {log.user_id == user.id && 
                      <Box>
                        <Typography><strong>{user.name} {user.lastname}&nbsp;: {user.role?.name}</strong> 
                        - {log.date} - ACCION:&nbsp;<strong>{log.action}</strong> &nbsp;
                          {getResourceName(log.resourceType, log.resourceId)} &nbsp;&nbsp;&nbsp;
                          <Copy text={`${user.name} ${user.lastname}: ${user.role?.name} - ${log.date} - ACCION: ${log.action} ${getResourceName(log.resourceType, log.resourceId)}`} children={undefined} />
                        </Typography> 
                      </Box>
                    }      
                </Box>))}
             </Box>))}
        </Box>
      </Container>
    </Box>
  );
}
