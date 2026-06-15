'use client';

import * as React from 'react';
import  Table from '@/components/UX/Table/Table';
import { useGetAllStudents } from './usePage';
import { UserData } from '@/app/type';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/material';
import { updateStatus} from '../useManagement';

export default function UsersPage() {
  const { users, loading, error, refreshUsers } = useGetAllStudents();

  
  // Estados para los filtros
  const [searchFields, setSearchFields] = React.useState({ name: true, lastname: true, dni: true, email: true, });
  const [rolFilter, setRolFilter] = React.useState('todos');
  const [estadoFilter, setEstadoFilter] = React.useState('todos');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Definir columnas
  const columns = [
    { id: 'name', label: 'Nombres', numeric: false },
    { id: 'lastname', label: 'Apellidos', numeric: false },
    { id: 'dni', label: 'Cédula', numeric: false },
    { id: 'email', label: 'Email', numeric: false },
    { 
      id: 'status', 
      label: 'Estado', 
      numeric: false,
      render: (value: string) => (
        <Box sx={{ 
          display: 'inline-block', 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 2,
          bgcolor: value === 'active' ? 'success.light' : 'error.light',
          color: value === 'active' ? 'success.dark' : 'error.dark',
          fontWeight: 'medium',
          fontSize: '0.875rem'
        }}>
          {value}
        </Box>
      )
    },
  ];

  // Manejadores de acciones
  const handleEdit = (row: UserData) => {
    toast.success(`Editando usuario: ${row.name} ${row.lastname}`);
  };

  //Cambio de estado
  const handleToggleStatus = async (row: UserData) => {
    try {
      const newStatus = row.status === 'active' ? 'inactive' : 'active';
      await updateStatus(row.id);
      toast.success(`Usuario ${newStatus === 'active' ? 'inactive' : 'activado'} exitosamente`);
      await refreshUsers(); 

    } catch (error) {   
       toast.error('Error al cambiar el estado');
    }
  };

  // Opciones para los filtros

  const estadoOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
  ];

  return (
    <Box>
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
        <Table
        data={users}
        columns={columns}
        title="Gestión de Usuarios"
        loading={loading}
        error={error}
        onRefresh={refreshUsers}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        getRowId={(row) => row.id}
        filterFields={{
            searchFields,
            onSearchFieldsChange: setSearchFields,
            rolFilter,
            onRolFilterChange: setRolFilter,
            estadoFilter,
            onEstadoFilterChange: setEstadoFilter,
            searchTerm,
            onSearchTermChange: setSearchTerm,
            estadoOptions,
            searchLabels: {
              name: 'Nombre',
              lastname: 'Apellido',
              dni: 'Cedula',
              status: 'Estado',
            },
        }}
        />
    </Box>
            
  );
}