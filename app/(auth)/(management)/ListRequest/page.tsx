'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Container, FormControl, MenuItem, InputLabel, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Assessment } from '@mui/icons-material';

import { StudentRequestData } from '@/app/type';
import { getRequests } from '@/app/services/requestService';
import DataTable from '@/components/UX/Table/Table';
import { statusColor } from '@/app/theme';
import { getAcademicPeriod, formatDate } from '@/components/UX/Dashboard/utils'; 
import { ModalFiltrosLocal } from '@/components/UX/Buttons/ModalDowloadTable';
import { filtrarYExportarPDF } from '@/components/UX/Buttons/dowloadTable';
import { useGetAllCategory } from '../managementCategory/useCategory';
import { useGetAlltype } from '../managementType/useGetType';

export default function ListRequestPage() {
  const [requests, setRequests] = React.useState<StudentRequestData[]>([]);
  const {categories} = useGetAllCategory();
  const {types} = useGetAlltype();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [estadoFilter, setEstadoFilter] = React.useState('todos');
  const [searchFields, setSearchFields] = React.useState({
    ID: true,
    applicantName: true,
    typeName: true,
    status: true,
  });
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>(() => {
    return getAcademicPeriod(new Date());
  });

  
    const academicPeriods = React.useMemo(() => {
      const periodSet = new Set(requests.map(r => getAcademicPeriod(r.created_at)));
      return Array.from(periodSet).sort((a, b) => b.localeCompare(a)); 
    }, [requests]);

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

  const handleProcesarDescarga = (filtrosSeleccionados: { periodo: string; categoria: string; tipoTramite: string }) => {
    filtrarYExportarPDF(requests, filtrosSeleccionados);
  };

  const tableRows = React.useMemo(() => {
    return requests
      .filter((request: any) => {
        const requestDate = new Date(request.created_at);

        // 1. Filtro por Fecha Desde
        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`);
          if (requestDate < start) return false;
        }

        // 2. Filtro por Fecha Hasta
        if (endDate) {
          const end = new Date(`${endDate}T23:59:59`);
          if (requestDate > end) return false;
        }

        // 3. 💡 SOLUCIÓN: Calculamos el periodo en tiempo real para compararlo con el seleccionado
        if (selectedPeriod) {
          const requestPeriod = getAcademicPeriod(request.created_at);
          if (requestPeriod !== selectedPeriod) {
            return false;
          }
        }

        return true;
      })

      .map((request: any) => {
        const solicitante = request.createByname === 'No Aplica' || !request.createByname
          ? `${request.user?.name || ''} ${request.user?.lastname || ''}`.trim() || 'Desconocido'
          : request.createByname;

        const dni = request.createByDNI === "0" || !request.createByDNI
          ? request.user?.dni || 'N/A'
          : request.createByDNI;

        const revisor = request.revisor_id && request.revisor 
          ? `${request.revisor.name || ''} ${request.revisor.lastname || ''}`.trim() || 'Asignado'
          : 'No asignado';

        return {
          ...request,
          ID: request.id, 
          applicantName: solicitante,
          applicantDNI: dni,
          typeName: request.type_procedure?.name || request.type_id,
          assignedUser: revisor,
          dateLabel: formatDate(request.created_at),
        };
      });
  }, [requests, startDate, endDate, selectedPeriod]); 

  const columns = [
    { id: 'applicantName', label: 'Solicitante', numeric: false, editable: false },
    { id: 'applicantDNI', label: 'Cedula', numeric: false, editable: false },
    { id: 'typeName', label: 'Tramite', numeric: false, editable: false },
    { id: 'dateLabel', label: 'Fecha', numeric: false, editable: false },
    { id: 'assignedUser', label: 'Asignado', numeric: false, editable: false },
    {
      id: 'status',
      label: 'Estado',
      numeric: false,
      editable: false,
      render: (value: string) => 
      <Chip 
        label={value}
        size="small"
        sx={{color:'white', backgroundColor:statusColor(value)}} 
      />,
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
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Filtros Avanzados
              </Typography>
            </Box>
                  
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="select-periodo-label">Periodo Académico</InputLabel>
                <Select
                  labelId="select-periodo-label"
                  id="select-periodo"
                  value={selectedPeriod}
                  label="Periodo Académico"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todos los periodos</em>
                  </MenuItem>
                  {academicPeriods.map((period) => (
                    <MenuItem key={period} value={period}>
                      Periodo {period}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          
              <TextField
                label="Fecha Desde"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                size="small"
              />
                    
              <TextField
                label="Fecha Hasta"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                size="small"
              />
          
              <Button 
                variant="outlined" 
                color="error"
                size="small"
                onClick={() => { 
                  setStartDate(''); 
                  setEndDate(''); 
                  setSelectedPeriod(() => { return getAcademicPeriod(new Date())})
                }}
              >
                Limpiar Filtros
              </Button>
                <Box style={{ padding: '20px' }}>
                  {/* Botón que acciona el flujo */}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Descargar Reporte Filtrado
                  </Button>

                  {/* El modal controlado */}
                  <ModalFiltrosLocal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAplicarFiltros={handleProcesarDescarga}
                    categories={categories}
                    types={types}
                    requests={requests}
                  />
                </Box>
              </Box>
          </Paper>

          <DataTable
            data={tableRows}
            columns={columns}
            title="Gestión de solicitudes"
            loading={loading}
            error={error}
            onRefresh={loadRequests}
            getRowId={(row) => row.id}
            emptyTitle="No hay solicitudes registradas"
            emptyDescription="Cuando existan solicitudes que coincidan con los filtros, aparecerán listadas aquí."
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
                ID: 'ID',
                applicantName: 'Solicitante',
                typeName: 'Trámite',
                status: 'Estado',
              },
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}