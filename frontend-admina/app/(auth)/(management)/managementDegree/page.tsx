// app/carreras/page.tsx
'use client';

import * as React from 'react';
import DataTable from '@/components/UX/Table/Table';
import { useGetAllDegree } from './useDegre';
import toast, { Toaster } from 'react-hot-toast';
import {  Box,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { updateStatusDegree } from './useDegre';
import { DegreeData } from '@/app/type';

export default function CarrerasPage() {
  const { degrees,  loading,  error,  validationErrors, registerDegree, updateDegreeById, refreshDegrees } = useGetAllDegree();
  
  const [openModal, setOpenModal] = React.useState(false);
  const [editingDegree, setEditingDegree] = React.useState<DegreeData | null>(null);
  const [degreeName, setDegreeName] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true });

  const columns = [
    { id: 'name', label: 'Nombre de la Carrera', numeric: false },
    { id: 'status', 
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

  const handleOpenCreate = () => {
    setEditingDegree(null);  // Modo creación
    setDegreeName('');       // Limpiar formulario
    setOpenModal(true);
  };

  const handleEdit = (row: DegreeData) => {
    setEditingDegree(row);   //Guardar carrera a editar
    setDegreeName(row.name); // Cargar nombre en el formulario
  };

  //Cambio de estado
    const handleToggleStatus = async (row: DegreeData) => {
      try {
        const newStatus = row.status === 'active' ? 'inactive' : 'active';
        await updateStatusDegree(row.id);
        toast.success(`Carerra ${newStatus === 'active' ? 'inactive' : 'activado'} exitosamente`);
        await refreshDegrees(); 
  
      } catch (error) {   
         toast.error('Error al cambiar el estado');
      }
    };
    
  const handleSave = async () => {
    if (!degreeName.trim()) {
      toast.error('El nombre de la carrera es requerido');
      return;
    }

    try {
      if (editingDegree) {
        
        await updateDegreeById(editingDegree.id, { name: degreeName });
        
        setOpenModal(false);
        setDegreeName('');
        setEditingDegree(null);
        toast.success('Carrera actualizada exitosamente');

      } else {

        console.log('Creando nueva carrera:', degreeName);
        const result = await registerDegree({ name: degreeName, id: '' });
      

       if (result && result.success === false) {
         console.log('Error de validación:', result.details);
        return; 
      }
        
        setOpenModal(false);
        setDegreeName('');
        toast.success('Carrera creada exitosamente');
      }
      refreshDegrees();
      
    } catch (error) {
      console.error('Error en handleSave:', error);
      // El error ya se muestra en el hook con toast
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDegree(null);
    setDegreeName('');
  };

  // Obtener mensaje de error de validación
  const getValidationError = () => {
    if (validationErrors.length > 0) {
      return validationErrors[0].message;
    }
    return null;
  };

  const estadoOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
  ];

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
          Nueva Carrera
        </Button>
      </Box>

      <DataTable
        data={degrees}
        columns={columns}
        title="Gestión de Carreras"
        loading={loading}
        error={error}
        onRefresh={refreshDegrees}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
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
          estadoOptions,
          searchLabels: {
            name: 'Nombre',
          },
        }}
      />

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDegree ? 'Editar Carrera' : 'Nueva Carrera'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de la Carrera"
            value={degreeName}
            onChange={(e) => setDegreeName(e.target.value)}
            margin="normal"
            placeholder="Ej: Ingeniería en Sistemas"
            error={!!getValidationError()}
            helperText={getValidationError()}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={loading || !degreeName.trim()}
          >
            {loading ? 'Guardando...' : (editingDegree ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}