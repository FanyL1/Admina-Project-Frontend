'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Card, Container, Paper, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

import { useGetAllLogs } from './useLogs';
import { useGetAllUsers } from '../managementUser/usePage';
import {useLogin} from '@/app/login/useLogin'

export default function ManagementRequestPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true, status: true });
  const {logs,loading,refreshLogs,refetch} = useGetAllLogs()
  const {users} = useGetAllUsers()
  const {sessionUser, getUserCreatedAt} = useLogin()
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Trámites registrados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{logs.length}</Typography>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#ECF0F9', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <DescriptionIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Requisitos configurados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {logs.reduce((total, log) => total + (log.message?.length || 0), 0)}
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box>
            {logs.map((log)=>( <Box key={log.id}>
                {users.map((user)=>( <Card key={user.id} sx={{borderColor: 'divider', borderRadius: 2,}}>
                    {log.user_id == user.id && 
                        <Typography>{user.name} {user.lastname}<strong>:</strong> {user.role?.name}</Typography> 
                    }      
                </Card>))}
                <Typography>{log.date}. Descripcion: {log.description}</Typography>
                <Typography>{log.action}. Descripcion: {log.description}</Typography>
            </Box>))}
        </Box>
      </Container>
    </Box>
  );
}
