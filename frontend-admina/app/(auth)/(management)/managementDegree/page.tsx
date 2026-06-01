// app/roles/page.tsx (versión simplificada)
'use client';

import * as React from 'react';
import DataTable from '@/components/UX/Table/Table';
import { useGetAllDegree} from './useDegre';
import { RoleData } from '@/app/type';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function RolesPage() {
  const { roles, loading, error, refreshRoles } = useGetAllDegree();
  const [openModal, setOpenModal] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<RoleData | null>(null);
  const [roleName, setRoleName] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true });

  const columns = [
    { id: 'name', label: 'Nombre de la Carrera', numeric: false },
  ];

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleName('');
    setOpenModal(true);
  };

  const handleEdit = (row: RoleData) => {
    setEditingRole(row);
    setRoleName(row.name);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3 }}>
        <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nuevo Rol
        </Button>
      </Box>

      <DataTable
        data={roles}
        columns={columns}
        title="Gestión de Roles"
        loading={loading}
        error={error}
        onRefresh={refreshRoles}
        onEdit={handleEdit}
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
          rolOptions: [],
          estadoOptions: [],
        }}
      />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRole ? 'Editar Rol' : 'Nuevo Rol'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nombre del Rol"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}