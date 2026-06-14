'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { StudentRequestData } from '@/app/type';
import { getRequests } from '@/app/services/requestService';

const formatDate = (value: string) => new Date(value).toLocaleString('es-VE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export default function ListRequestPage() {
  const [requests, setRequests] = React.useState<StudentRequestData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void Promise.resolve().then(loadRequests);
  }, [loadRequests]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Gestion de solicitudes</Typography>
              <Typography color="text.secondary">Solicitudes realizadas por estudiantes, ordenadas por fecha reciente.</Typography>
            </Box>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRequests} disabled={loading}>
              Actualizar
            </Button>
          </Stack>

          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }}>Solicitante</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }}>Tramite</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }}>Carrera</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 800 }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Cargando...</TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No hay solicitudes registradas.</TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && requests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        {request.createByname && request.createByname !== 'Mismo Usuario'
                          ? request.createByname
                          : `${request.user?.name || ''} ${request.user?.lastname || ''}`.trim() || request.user_id}
                      </TableCell>
                      <TableCell>{request.type_procedure?.name || request.type_id}</TableCell>
                      <TableCell>{request.carrera?.name || request.carrera_id}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell><Chip label={request.status} size="small" /></TableCell>
                      <TableCell align="center">
                        <Button component={Link} href={`/requests/${request.id}`} size="small" startIcon={<VisibilityIcon />}>
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
