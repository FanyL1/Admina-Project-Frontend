'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { StudentRequestData } from '@/app/type';
import { getRequests } from '@/app/services/requestService';
import DataTable from '@/components/UX/Table/Table';

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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [estadoFilter, setEstadoFilter] = React.useState('todos');
  const [searchFields, setSearchFields] = React.useState({
    applicantName: true,
    typeName: true,
    carreraName: true,
    status: true,
  });

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

  const tableRows = React.useMemo(() => requests.map((request) => ({
    ...request,
    applicantName: `${request.user?.name || ''} ${request.user?.lastname || ''}`.trim() || request.user_id,
    typeName: request.type_procedure?.name || request.type_id,
    carreraName: request.carrera?.name || request.carrera_id,
    dateLabel: formatDate(request.created_at),
  })), [requests]);

  const columns = [
    { id: 'applicantName', label: 'Solicitante', numeric: false, editable: false },
    { id: 'typeName', label: 'Tramite', numeric: false, editable: false },
    { id: 'carreraName', label: 'Carrera', numeric: false, editable: false },
    { id: 'dateLabel', label: 'Fecha', numeric: false, editable: false },
    {
      id: 'status',
      label: 'Estado',
      numeric: false,
      editable: false,
      render: (value: string) => <Chip label={value} size="small" />,
    },
  ];

  const estadoOptions = [
    { value: 'Enviado', label: 'Enviado' },
    { value: 'Revisando', label: 'Revisando' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Observado', label: 'Observado' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Rechazado', label: 'Rechazado' },
  ];

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

          <DataTable
            data={tableRows}
            columns={columns}
            title="Gestion de solicitudes"
            loading={loading}
            error={error}
            onRefresh={loadRequests}
            getRowId={(row) => row.id}
            emptyTitle="No hay solicitudes registradas"
            emptyDescription="Cuando existan solicitudes, apareceran listadas en esta tabla."
            rowActions={(request) => (
              <Button component={Link} href={`/request/${request.id}`} size="small" startIcon={<VisibilityIcon />}>
                Ver
              </Button>
            )}
            filterFields={{
              searchFields,
              onSearchFieldsChange: setSearchFields,
              rolFilter: 'todos',
              onRolFilterChange: () => {},
              estadoFilter,
              onEstadoFilterChange: setEstadoFilter,
              searchTerm,
              onSearchTermChange: setSearchTerm,
              estadoOptions,
              searchLabels: {
                applicantName: 'Solicitante',
                typeName: 'Tramite',
                carreraName: 'Carrera',
                status: 'Estado',
              },
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
