'use client';
import * as React from 'react';
import Link from 'next/link';
import { 
  Box, Button, Chip, Card, Container, Paper, Typography, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InfoIcon from '@mui/icons-material/Info';

import { useGetAllLogs } from './useLogs';
import { useGetAllUsers } from '../managementUser/usePage';
import { useLogin } from '@/app/login/useLogin';
import { useGetAllCategory } from '../managementCategory/useCategory';
import { useGetAllDegree } from '../managementDegree/useDegre';
import { useGetAlltype } from '../managementType/useGetType';
import { Copy } from '@/components/UX/Copy/handleCopy';

export default function ManagementRequestPage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  
  const { logs = [], loading, refreshLogs, refetch } = useGetAllLogs();
  const [openModal, setOpenModal] = React.useState(false);
  const [modalData, setModalData] = React.useState<{ type: string; id: string; name: string } | null>(null);
  const { users = [] } = useGetAllUsers();
  const { categories } = useGetAllCategory();
  const { degrees } = useGetAllDegree();
  const { types } = useGetAlltype();
  const { sessionUser, getUserCreatedAt } = useLogin();

  
  // FILTRO DE LOGS POR RANGO DE FECHAS
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (!log.date) return false;
      const logDate = new Date(log.date);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }

      return true;
    });
  }, [logs, startDate, endDate]);

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

  // MANEJADOR PARA ABRIR EL MODAL CON LA DATA DEL RECURSO
  const handleOpenResourceDetails = (resourceType: string, resourceId: string) => {
    const name = getResourceName(resourceType, resourceId);
    setModalData({ type: resourceType, id: resourceId, name });
    setOpenModal(true);
  };

  // BUSCADOR DE INFORMACIÓN EXTENDIDA PARA MOSTRAR EN EL MODAL
  const renderResourceExtendedDetails = () => {
    if (!modalData) return null;

    switch (modalData.type) {
      case 'User':
        const user = users?.find((u: any) => u.id === modalData.id);
        return user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', ml:'3px', fontSize: '0.85rem', color: 'text.secondary' }}><strong>ID único:</strong> {user.id}</Typography>
              <Copy children text={`${user.id}`}/>
            </Box>
            <Typography variant="body2"><strong>Nombre Completo:</strong> {user.name} {user.lastname}</Typography>
            <Typography variant="body2"><strong>Cedula:</strong> {user.dni}</Typography>
            <Typography variant="body2"><strong>Correo Electrónico:</strong> {user.email}</Typography>
            <Typography variant="body2"><strong>Rol asignado:</strong> {user.role?.name || 'N/A'}</Typography>
            <Typography variant="body2"><strong>Fecha de Registro:</strong> {getUserCreatedAt(user.created_at) || 'N/A'}</Typography>
            <Typography variant="body2"><strong>Estado:</strong> {user.status|| 'N/A'}</Typography>
          </Box>
        ) : null;

      case 'Category':
        const category = categories?.find((c: any) => c.id === modalData.id);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', ml:'3px',fontSize: '0.85rem', color: 'text.secondary' }}><strong>ID único:</strong> {category?.id}</Typography>
              <Copy children text={`${category?.id}`}/>
            </Box>
            <Typography variant="body2"><strong>Nombre de Categoría:</strong> {category?.name || modalData.name}</Typography>
            <Typography variant="body2"><strong>Estado:</strong> {category?.status|| 'N/A'}</Typography>
          </Box>
        );

      case 'Carrera':
        const degree = degrees?.find((d: any) => d.id === modalData.id);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', ml:'3px', fontSize: '0.85rem', color: 'text.secondary' }}><strong>ID de Carrera:</strong> {modalData.id}</Typography>
              <Copy children text={`${degree?.id}`}/>
            </Box>
            <Typography variant="body2"><strong>Carrera Universitaria:</strong> {degree?.name || modalData.name}</Typography>
            <Typography variant="body2"><strong>Estado:</strong> {degree?.status || 'N/A'}</Typography>
          </Box>
        );

      case 'Type':
        const type = types?.find((t: any) => t.id === modalData.id);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', ml:'3px', fontSize: '0.85rem', color: 'text.secondary' }}><strong>ID de Tipo:</strong> {modalData.id}</Typography>
              <Copy children text={`${type?.id}`}/>
            </Box>
            <Typography variant="body2"><strong>Trámite:</strong> {type?.name || modalData.name}</Typography>
            {type?.requirements?.documents && type.requirements.documents.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}>
                  Documentos Requeridos:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                  {type.requirements.documents.map((doc: any, index: number) => (
                    <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      • {typeof doc === 'string' ? doc : doc.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            {type?.requirements?.promedio && type.requirements.promedio !== 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}>
                  Promedio Requerido: {type.requirements.promedio}
                </Typography>
              </Box>
            )}
            <Typography variant="body2"><strong>Estado:</strong> {type?.status || 'No especificada'}</Typography>
            <Typography variant="body2"><strong>Fecha de Creacion:</strong> {type?.created_at|| 'N/A'}</Typography>

          </Box>
        );

      default:
        return <Typography variant="body2">Información detallada no disponible para este recurso.</Typography>;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        {/* Sección Superior: Resumen e Inputs de Fechas */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, minWidth: 240 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Logs registrados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{filteredLogs.length}</Typography>
            </Box>
          </Paper>

          {/* Inputs de Rango de Fechas */}
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
            <DateRangeIcon color="action" fontSize="small" />
            <TextField
              label="Desde"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ 
                inputLabel: { shrink: true } }}
              size="small"
            />
            <TextField
              label="Hasta"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              slotProps={{ 
                inputLabel: { shrink: true } }}
              size="small"
            />
              <Button variant="outlined" color="error" size="small" onClick={() => { setStartDate(''); setEndDate(''); }}>
                Limpiar
              </Button>
          </Paper>
        </Box>

        {/* Listado de Logs Proporcionados */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filteredLogs.slice(0, 20).map((log) => (
            <Box 
              key={log.id} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%', 
                mt: 0.6,
                textAlign: 'justify', 
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
            >
              {users.map((user) => {
                if (log.user_id !== user.id) return null;

                const formattedDate = log.date ? new Date(log.date).toLocaleString('es-VE', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                }) : 'Fecha no disponible';

                const resourceName = getResourceName(log.resourceType, log.resourceId);

                return (
                  <Box key={user.id} sx={{ py: 0.5 }}>
                    <Box color="text.primary" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      
                      {/* Fecha estilizada sutilmente en gris */}
                      <Box component="span" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        [{formattedDate}]
                      </Box>
                      
                      {/* Usuario y Rol */}
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {user.name} {user.lastname}
                      </Box>
                      <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                        ({user.role?.name || 'Sin rol'})
                      </Box>

                      <Box component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>—</Box>

                      {/* Acción resaltada */}
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.5px' }}>
                        {log.action}
                      </Box>

                      {/* Recurso afectado */}
                      <Box 
                        component="button" 
                        onClick={() => handleOpenResourceDetails(log.resourceType, log.resourceId)}
                        sx={{ 
                          bgcolor: 'action.hover', 
                          px: 0.8, 
                          py: 0.2, 
                          borderRadius: 1, 
                          fontWeight: 500, 
                          border: 'none', 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: 'text.primary',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: 'action.selected',
                          }
                        }}
                      >
                        {resourceName}
                      </Box>

                      {/* Componente Copy */}
                      <Box sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center' }}>
                        <Copy 
                          text={`${formattedDate} ${user.name} ${user.lastname} (${user.role?.name}) - ${log.action} - ${resourceName}`} 
                          children={undefined} 
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}

          {filteredLogs.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No se encontraron logs en el rango de fechas seleccionado.
            </Typography>
          )}
        </Box>

      </Container>

      {/* 💡 DIALOG/MODAL DINÁMICO DE DETALLES DEL RECURSO */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, px: 2, py: 1.5 }}>
          <InfoIcon color="primary" />
          Detalles del Recurso ({modalData?.type})
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 2, py: 2 }}>
          {renderResourceExtendedDetails()}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button onClick={() => setOpenModal(false)} variant="contained" size="small" disableElevation>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}