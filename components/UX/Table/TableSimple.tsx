'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, Grid
} from '@mui/material';
import { getAcademicPeriod } from '@/components/UX/Dashboard/utils'; // Asegúrate de ajustar la ruta correcta de importación
import { StudentRequestData } from '@/app/type';
import theme from '@/app/theme';

export interface SimpleColumn {
  id: string;
  label: string;
  render?: (row: StudentRequestData) => React.ReactNode;
}

interface DataTableSimpleProps {
  columns: SimpleColumn[];
  searchPlaceholder?: string;
  statusOptions?: { value: string; label: string }[];
  emptyMessage?: string;
  requestRevisor: StudentRequestData[];
  loading: boolean;
}

export default function DataTableSimple({
  columns,
  searchPlaceholder = "Buscar por ID, solicitante, cédula...",
  statusOptions = [],
  emptyMessage = "No se encontraron registros.",
  requestRevisor = [],
  loading
}: DataTableSimpleProps) {
  
  // Estados para los filtros básicos
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Estados para los filtros avanzados (Periodo y Fechas)
  const [periodFilter, setPeriodFilter] = useState<string>(() => {
      return getAcademicPeriod(new Date());
    });
    
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. Obtener periodos académicos únicos ordenados de forma descendente
  const academicPeriods = useMemo(() => {
    if (!requestRevisor) return [];
    const periodSet = new Set(requestRevisor.map(r => getAcademicPeriod(r.created_at)));
    return Array.from(periodSet).sort((a, b) => b.localeCompare(a)); 
  }, [requestRevisor]);

  // 2. Filtrado reactivo en memoria combinando todos los criterios
  const filteredData = useMemo(() => {
    return requestRevisor.filter((row) => {
      
      // A. Filtrado por Estado
      if (statusFilter !== 'all' && String(row.status) !== statusFilter) {
        return false;
      }

      // B. Filtrado Avanzado por Periodo Académico
      if (periodFilter !== 'all') {
        const rowPeriod = getAcademicPeriod(row.created_at);
        if (rowPeriod !== periodFilter) return false;
      }

      // C. Filtrado Avanzado por Rango de Fechas
      if (startDate || endDate) {
        const rowDate = new Date(row.created_at).getTime();
        
        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`).getTime();
          if (rowDate < start) return false;
        }
        
        if (endDate) {
          const end = new Date(`${endDate}T23:59:59`).getTime();
          if (rowDate > end) return false;
        }
      }

      // D. Buscador inteligente (ID, Solicitante [createByname / user.name+lastname], Cédula [createByDNI / user.dni], Trámite)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();

        // Resolver variables condicionales idénticas a tu PDF
        const nombreSolicitante = row.createByname && row.createByname !== 'No Aplica'
          ? row.createByname
          : `${row.user?.name || ''} ${row.user?.lastname || ''}`.trim();

        const cedulaSolicitante = row.createByDNI && row.createByDNI !== 'No Aplica'
          ? row.createByDNI
          : row.user?.dni || '';

        const tramite = row.type_procedure?.name || '';
        const idSolicitud = row.id || '';

        const matchesId = idSolicitud.toLowerCase().includes(searchLower);
        const matchesNombre = nombreSolicitante.toLowerCase().includes(searchLower);
        const matchesCedula = cedulaSolicitante.toLowerCase().includes(searchLower);
        const matchesTramite = tramite.toLowerCase().includes(searchLower);

        if (!matchesId && !matchesNombre && !matchesCedula && !matchesTramite) {
          return false;
        }
      }

      return true;
    });
  }, [requestRevisor, searchTerm, statusFilter, periodFilter, startDate, endDate]);

  // Manejador para limpiar todos los filtros a su estado base
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPeriodFilter(() => { return getAcademicPeriod(new Date())});
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || periodFilter !== 'all' || startDate || endDate;

  return (
    <Stack spacing={3} sx={{ mt: 3, width: '100%' }}>
      
      {/* SECCIÓN SUPERIOR: Filtrado Avanzado */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Filtrado Avanzado
        </Typography>
        <Grid container spacing={2} sx={{alignItems:"center"}}>
          <Grid>
            <FormControl size="small" fullWidth>
              <InputLabel>Periodo Académico</InputLabel>
              <Select
                value={periodFilter}
                label="Periodo Académico"
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <MenuItem value="all">Todos los periodos</MenuItem>
                {academicPeriods.map((period) => (
                  <MenuItem key={period} value={period}>{period}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid>
            <TextField
              label="Desde"
              type="date"
              size="small"
              fullWidth
              slotProps={{ 
               inputLabel:{shrink: true }}
              }
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          <Grid>
            <TextField
              label="Hasta"
              type="date"
              size="small"
              fullWidth
              slotProps={{ 
               inputLabel:{shrink: true }}
              }
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid>
            <Button 
              variant="outlined" 
              color="error" 
              size="medium"
              onClick={handleResetFilters}
            >
              Limpiar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* SECCIÓN INTERMEDIA: Filtros básicos y de texto */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Buscar"
          placeholder={searchPlaceholder}
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '250px' }}
        />

        {statusOptions.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos los estados</MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* SECCIÓN INFERIOR: Tabla de Datos */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 600, py: 1.5 }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  Cargando solicitudes de revisión...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex} hover>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {col.render 
                        ? col.render(row) 
                        : String((row as any)[col.id] || '')
                      }
                      
                    </TableCell>
                    
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}