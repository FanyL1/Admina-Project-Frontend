'use client';
import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, 
  Card, CardContent, LinearProgress, Chip, Button, TextField
} from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { TrendingUp, Assignment, Pending, Assessment } from '@mui/icons-material';

import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import {getAcademicPeriod} from './utils'

export const StatisticsDashboard = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const { request = [] } = useGetAllRequest();

  // 1. FILTRO CENTRALIZADO: Rango de fechas y periodos académicos
  const filteredRequests = useMemo(() => {
    return request.filter((r) => {
      if (!r.created_at) return false;
      
      const requestDate = new Date(r.created_at);
      
      // Filtro Fecha Desde (00:00:00)
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (requestDate < start) return false;
      }
      
      // Filtro Fecha Hasta (23:59:59)
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (requestDate > end) return false;
      }

      // Filtro por Periodo Académico Seleccionado
      if (selectedPeriod) {
        const requestPeriod = getAcademicPeriod(r.created_at); 
        if (requestPeriod !== selectedPeriod) return false;
      }
      
      return true;
    });
  }, [request, startDate, endDate, selectedPeriod]);

  // 2. COHORTES DISPONIBLES: Genera las opciones del Select basadas en toda la data base
  const academicPeriods = useMemo(() => {
    const periodSet = new Set(request.map(r => getAcademicPeriod(r.created_at)));
    return Array.from(periodSet).sort((a, b) => b.localeCompare(a)); 
  }, [request]);

  // 3. GRÁFICO 1: Frecuencia Mensual Reactiva
  const monthlyData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      const count = filteredRequests.filter(r => {
        const date = new Date(r.created_at);
        return date.getMonth() === index;
      }).length;
      return { month, count };
    });
  }, [filteredRequests]);

  // 4. GRÁFICO 2: Datos de Embudo Reactivo
  const funnelData = useMemo(() => {
    const total = filteredRequests.length;
    const send = filteredRequests.filter(r => r.status === 'Enviado').length;
    const inReview = filteredRequests.filter(r => r.status === 'Revisando' || r.status === 'Pendiente').length;
    const approved = filteredRequests.filter(r => r.status === 'Aprobado').length;
    const rejected = filteredRequests.filter(r => r.status === 'Rechazado').length;
    const observation = filteredRequests.filter(r => r.status === 'Observado').length;

    return [
      { stage: 'Creadas', count: total, color: '#71c0c0' },
      { stage: 'Enviadas', count: send, color: '#1976d2' },
      { stage: 'En Revisión', count: inReview, color: '#ed6c02' },
      { stage: 'Aprobadas', count: approved, color: '#2e7d32' },
      { stage: 'Rechazadas', count: rejected, color: '#c62828' },
      { stage: 'Con Observación', count: observation, color: '#9c27b0' }
    ];
  }, [filteredRequests]);

  // 5. GRÁFICO 3: Top Trámites Reactivo
  const topRequests = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRequests.forEach(req => {
      const name = req.type_procedure?.name || 'Sin categoría';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredRequests]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Sección de Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
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
            Estadísticas de Gestión
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
                setSelectedPeriod(''); 
              }}
            >
              Limpiar Filtros
            </Button>
        </Box>
      </Paper>

      {/* Tarjetas de Resumen Dinámicas */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Solicitudes</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{filteredRequests.length}</Typography>
              </Box>
              <Assignment sx={{ color: '#1976d2', fontSize: 32 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Tasa de Éxito</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {filteredRequests.length > 0 
                    ? Math.round((filteredRequests.filter(r => r.status === 'Aprobado' || r.status === 'Rechazado').length / filteredRequests.length) * 100)
                    : 0}%
                </Typography>
              </Box>
              <TrendingUp sx={{ color: '#2e7d32', fontSize: 32 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Solicitudes Estancadas</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                  {filteredRequests.filter(r => r.status === 'Enviado').length}
                </Typography>
              </Box>
              <Pending sx={{ color: '#ed6c02', fontSize: 32 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Gráfico 1: Frecuencia mensual */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Solicitudes por Mes
        </Typography>
        <Box sx={{ height: 300 }}>
          <BarChart
            xAxis={[{ 
              data: monthlyData.map(d => d.month), 
              scaleType: 'band',
              label: 'Mes'
            }]}
            yAxis={[{ label: 'Cantidad' }]}
            series={[{ 
              data: monthlyData.map(d => d.count), 
              label: 'Solicitudes',
              color: '#1976d2'
            }]}
          />
        </Box>
      </Paper>

      {/* Gráfico 2: Embudo */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Flujo de Solicitudes (Embudo)
        </Typography>
        <Box sx={{ height: 300 }}>
          <BarChart
            layout="horizontal"
            xAxis={[{ label: 'Cantidad' }]}
            yAxis={[{ 
              data: funnelData.map(d => d.stage), 
              scaleType: 'band',
              label: 'Etapa'
            }]}
            series={[{
              data: funnelData.map(d => d.count),
              label: 'Solicitudes',
              color: '#1976d2',
              valueFormatter: (value) => `${value} solicitudes`
            }]}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {funnelData.map((item) => (
            <Chip
              key={item.stage}
              label={`${item.stage}: ${item.count}`}
              sx={{
                bgcolor: item.color,
                color: 'white',
                fontWeight: 500,
                '&:hover': { opacity: 0.8 }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Gráfico 3: Top trámites */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Trámites Más Solicitados
        </Typography>
        {topRequests.length > 0 ? (
          <Box sx={{ height: 300 }}>
            <PieChart
              series={[{
                data: topRequests.map(item => ({
                  id: item.name,
                  value: item.count,
                  label: item.name
                })),
              }]}
              slotProps={{
                legend: { position: { vertical: 'middle', horizontal: 'end' } }
              }}
              margin={{ right: 200 }}
            />
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No hay datos disponibles para los filtros seleccionados
          </Typography>
        )}
      </Paper>

      {/* Lista detallada de trámites */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Detalle de Trámites
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {topRequests.map((item, index) => {
            const percentage = filteredRequests.length > 0 
              ? Math.round((item.count / filteredRequests.length) * 100) 
              : 0;
            const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#c62828', '#9c27b0'];
            
            return (
              <Box key={item.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {index + 1}. {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.count} ({percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: colors[index % colors.length]
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};