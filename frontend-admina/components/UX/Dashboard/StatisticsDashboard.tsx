'use client';
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  SelectChangeEvent,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  LineChart,
  BarChart,
  PieChart
} from '@mui/x-charts';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
  Assessment
} from '@mui/icons-material';

interface StatisticsDashboardProps {
  requests: any[];
  students: any[];
}

export const StatisticsDashboard = ({ requests, students }: StatisticsDashboardProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Años disponibles
  const years = useMemo(() => {
    const yearSet = new Set(requests.map(r => new Date(r.created_at).getFullYear()));
    return Array.from(yearSet).sort();
  }, [requests]);

  // 1. Datos de frecuencia mensual
  const monthlyData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      const count = requests.filter(r => {
        const date = new Date(r.created_at);
        return date.getFullYear() === selectedYear && date.getMonth() === index;
      }).length;
      return { month, count };
    });
  }, [requests, selectedYear]);

  // 2. Datos del embudo (como barras)
  const funnelData = useMemo(() => {
    const total = requests.length;
    const inReview = requests.filter(r => r.status === 'En revisión' || r.status === 'Pendiente').length;
    const approved = requests.filter(r => r.status === 'Aprobada').length;
    const rejected = requests.filter(r => r.status === 'Rechazada').length;
    const completed = requests.filter(r => r.status === 'Completada' || r.status === 'Finalizada').length;

    return [
      { stage: 'Creadas', count: total, color: '#1976d2' },
      { stage: 'En Revisión', count: inReview, color: '#ed6c02' },
      { stage: 'Aprobadas', count: approved, color: '#2e7d32' },
      { stage: 'Rechazadas', count: rejected, color: '#c62828' },
      { stage: 'Completadas', count: completed, color: '#9c27b0' }
    ];
  }, [requests]);

  // 3. Top de trámites
  const topRequests = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(req => {
      const name = req.type?.name || req.name || 'Sin categoría';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [requests]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Filtros */}
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
            Estadísticas
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Año</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange} label="Año">
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Tarjetas de resumen */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Solicitudes</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{requests.length}</Typography>
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
                  {requests.length > 0 
                    ? Math.round((requests.filter(r => r.status === 'Aprobada' || r.status === 'Completada').length / requests.length) * 100)
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
                <Typography variant="caption" color="text.secondary">Pendientes</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                  {requests.filter(r => r.status === 'Pendiente' || r.status === 'En revisión').length}
                </Typography>
              </Box>
              <Pending sx={{ color: '#ed6c02', fontSize: 32 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Gráfico 1: Frecuencia mensual */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
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

      {/* Gráfico 2: Embudo (usando barras horizontales) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
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
        {/* Detalle del embudo */}
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
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
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
                legend: {
                
                  position: { vertical: 'middle', horizontal: 'end' },
                  
                }
              }}
              margin={{ right: 200 }}
            />
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No hay datos disponibles
          </Typography>
        )}
      </Paper>

      {/* Lista detallada de trámites */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Detalle de Trámites
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {topRequests.map((item, index) => {
            const percentage = requests.length > 0 
              ? Math.round((item.count / requests.length) * 100) 
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