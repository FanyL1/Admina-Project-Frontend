'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import DataTable from '@/components/UX/Table/Table';
import { ProcedureTypeData } from '@/app/type';

export default function ManagementRequestPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true, status: true });

  const procedures: ProcedureTypeData[] = [];

  const columns = [
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0c1527 0%, #32539A 55%, #6586CD 100%)',
              color: 'white',
              p: { xs: 3, md: 4 },
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                <AssignmentIcon fontSize="small" />
                <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 600 }}>
                  Administración académica
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
              >
                Gestión de trámites
              </Typography>
            </Box>

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
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Trámites registrados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{procedures.length}</Typography>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#ECF0F9', color: 'primary.main', borderRadius: 2, p: 1.25, display: 'flex' }}>
              <DescriptionIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Requisitos configurados</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {procedures.reduce((total, procedure) => total + (procedure.requirements?.documents?.length || 0), 0)}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <DataTable
          data={procedures}
          columns={columns}
          title="Listado de trámites realizados"
          emptyTitle="Aún no hay trámites registrados"
          emptyDescription="Agrega el primer trámite para configurar sus requisitos y comenzar a organizar el catálogo."
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
