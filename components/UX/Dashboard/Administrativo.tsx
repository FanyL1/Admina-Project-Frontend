'use client';
import { Container, Paper, Chip, Link, Button, Typography,} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import { statusColor } from '@/app/theme';
import ResumAdmin from './resumAdmin';
import DataTableSimple, { SimpleColumn } from '../Table/TableSimple';
import { formatDate } from './utils';

export default function AdminDashboard() {

  const { requestRevisor, loading } = useGetAllRequest();

  const columnas: SimpleColumn[] = [
    
    { 
      id: 'solicitante', 
      label: 'Solicitante',
      render: (row) => {
        return row.createByname && row.createByname !== 'No Aplica'
          ? row.createByname
          : `${row.user?.name || ''} ${row.user?.lastname || ''}`.trim() || 'No especificado';
      }
    },
    {
      id: 'cedula',
      label: 'Cédula',
      render: (row) => {
        return row.createByDNI && row.createByDNI !== '0'
          ? row.createByDNI
          : row.user?.dni || 'No especificado';
      }
    },
    { 
      id: 'tramite', 
      label: 'Trámite',
      render: (row) => row.type_procedure?.name || 'No especificado' 
    },
    { 
      id: 'fecha', 
      label: 'Fecha',
      render: (row) => formatDate(row.created_at) || 'No disponible' 
    },
    { 
      id: 'status',
      label: 'Estado',
      render: (row) => 
        <Chip 
          label= {row.status}
          size="small"
          sx={{color:'white', backgroundColor:statusColor(row.status)}} 
        />,
    },
    { 
      id: 'action',
      label: 'Acciones',
      render: (row) => {
        return(
          <Button component={Link} href={`/request/${row.id}`} size="small" startIcon={<VisibilityIcon />}>
                Ver
          </Button>
        )
      }
    }
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
    <Container maxWidth="xl" sx={{ py: {xs:6,md:2}}}>      
    
    <ResumAdmin/>

      {/* Solicitudes recientes */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Mis Solicitudes
        </Typography>
        <DataTableSimple
        columns={columnas}
        requestRevisor={requestRevisor || []} // Si es undefined por la carga, pasamos array vacío
        loading={loading}
        statusOptions={estadoOptions}
        searchPlaceholder="Buscar por ID, nombre, cédula..."
        />
      </Paper>
    </Container>
  );
}