'use client';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import {  Box,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField, Link } from '@mui/material';
import toast from 'react-hot-toast';

import DataTable from '@/components/UX/Table/Table';
import { useGetAllDegree } from './useDegre';
import { DegreeData, OnlyNameData } from '@/app/type';
import AppToaster from '@/components/UX/Toaster/AppToaster';
import { updateStatusDegree } from './useDegre';
import { useState } from 'react';

export default function CarrerasPage() {
  const { degrees,  loading,  error,  validationErrors, registerDegree, updateDegree, refreshDegrees } = useGetAllDegree();
  
  const [openModal, setOpenModal] = useState(false);
  const [editingDegree, setEditingDegree] = useState<DegreeData | null>(null);
  const [degreeName, setDegreeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFields, setSearchFields] = useState({ name: true });
  const [originalName, setOriginalName] = useState('')
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

  //Agregar
  const handleOpenCreate = () => {
    setEditingDegree(null);  // Modo creación
    setDegreeName('');       // Limpiar formulario
    setOpenModal(true);
  };

  const handleEdit = (row: DegreeData) => {
    setEditingDegree({...row});   //Guardar carrera a editar
    setDegreeName(row.name); // Cargar nombre
    setOriginalName(row.name)
  };

    
  const handleSave = async (updateRow?: any) => {

    if(updateRow && typeof updateRow.preventDefault == 'function') {
      updateRow.preventDefault();
    }

    const nameDegree = (updateRow && updateRow.name)?  updateRow.name.trim() : degreeName.trim();
    if (!nameDegree) {
      toast.error('El nombre de la carrera es requerido');
      return;
    }

    try {
      
      if (editingDegree) {

        const data: Partial<OnlyNameData> = {};
          
        if (nameDegree.trim() && nameDegree.trim() !== editingDegree.name) {
          data.name = nameDegree.trim();
        }

        await updateDegree(editingDegree.id, data);
        
        setOpenModal(false);
        setDegreeName('');
        setEditingDegree(null);
        toast.success('Carrera actualizada exitosamente');

      } else {

        if (!degreeName.trim()) {
          toast.error('El nombre de la carrera es requerido');
          return;
        }

        const result = await registerDegree({ name: degreeName, id: '' });
      
        if (result && result.success === false) {
          toast.error('Error de validación:', result.details);
          return; 
        }
        
        setOpenModal(false);
        setDegreeName('');
        toast.success('Carrera creada exitosamente');
      }
      setTimeout(()=>{
        refreshDegrees();
      }, 1000)
      
    } catch (error) {
      toast.error('Error en handleSave');
      // El error ya se muestra en el hook con toast
    }
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
      <AppToaster />

      <DataTable
        data={degrees}
        columns={columns}
        title="Gestión de Carreras"
        loading={loading}
        error={error}
        onRefresh={refreshDegrees}
        onEdit={(row)=> handleEdit(row)}
        onSaveEdit={handleSave}
        onToggleStatus={handleToggleStatus}
        emptyTitle="Aún no hay carrera registrados"
        emptyAction={
          <Button
            onClick={handleOpenCreate}
            startIcon={<AddIcon />}
            variant="contained"
           >
            Agregar Carrera
          </Button>
        }
        toolbarActions={
          <Button
            onClick={handleOpenCreate}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
           >
            Agregar Carrera
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
          estadoOptions,
          searchLabels: {
            name: 'Nombre',
          },
        }}
      />

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Nueva Carrera
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
            {loading ? 'Guardando...' :  'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
