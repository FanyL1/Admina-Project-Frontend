'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

import DataTable from '@/components/UX/Table/Table';
import { ProcedureTypeData } from '@/app/type';
import { useGetAlltype} from './useGetType';
import { useGetAllCategory } from '../managementCategory/useCategory';
import { updateStatusType } from './useGetType';
import toast from 'react-hot-toast';

export default function ManagementRequestPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true, status: true });
  const  {types, refreshtype} = useGetAlltype()
  const typesActive = types.filter(col => col.status !== 'inactive');
  const {categories} = useGetAllCategory()

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId)
    return category?.name || 'Categoría no encontrada'
  }

  const columns = [
    { id: 'category_id', 
      label: 'Categoria', 
      numeric: false, 
      render: (value: string) => getCategoryName(value) 
    },
    { id: 'name', label: 'Nombre del trámite', numeric: false },
    {
      id: 'requirements',
      label: 'Requisitos',
      numeric: false,
      render: (value: ProcedureTypeData['requirements']) => (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {value?.documents?.length ? value.documents.map((document) => (
            <Chip key={document} label={document} size="small" variant="outlined" />
          )) : (
            <Typography variant="body2" color="text.secondary">
              Sin requisitos
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Estado',
      numeric: false,
      render: (value: string) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: value === 'active' ? 'success.light' : 'error.light',
            color: value === 'active' ? 'success.dark' : 'error.dark',
            fontWeight: 'medium',
            fontSize: '0.875rem',
          }}
        >
          {value === 'inactive' ? 'Inactivo' : 'Activo'}
        </Box>
      ),
    },
  ];

  //Cambio de estado
    const handleToggleStatus = async (row: ProcedureTypeData) => {
      try {
        const newStatus = row.status === 'active' ? 'inactive' : 'active';
        await updateStatusType(row.id);
        toast.success(`Carerra ${newStatus === 'active' ? 'inactive' : 'activado'} exitosamente`);
        await refreshtype(); 
      
      } catch (error) {   
        toast.error('Error al cambiar el estado');
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
              <Typography variant="caption" color="text.secondary">Trámites registrados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{types.length}</Typography>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#ECF0F9', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <DescriptionIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Tramites Activos</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {typesActive.length}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <DataTable
          data={types}
          columns={columns}
          title="Listado de trámites realizados"
          emptyTitle="Aún no hay trámites registrados"
          emptyDescription="Agrega el primer trámite para configurar sus requisitos y comenzar a organizar el catálogo."
          onRefresh={refreshtype}
          emptyAction={
            <Button
              component={Link}
              href="/managementRequest/add"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Agregar trámite
            </Button>
          }
          toolbarActions={
            <Button
              component={Link}
              href="/managementRequest/add"
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Agregar trámite
            </Button>
          }
          getRowId={(row) => row.id}
          onToggleStatus={handleToggleStatus}
          filterFields={{
            searchFields,
            onSearchFieldsChange: setSearchFields,
            rolFilter: 'todos',
            onRolFilterChange: () => {},
            estadoFilter: 'todos',
            onEstadoFilterChange: () => {},
            searchTerm,
            onSearchTermChange: setSearchTerm,
            estadoOptions: [
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ],
            searchLabels: {
              name: 'Nombre',
              status: 'Estado',
            },
          }}
        />
      </Container>
    </Box>
  );
}
