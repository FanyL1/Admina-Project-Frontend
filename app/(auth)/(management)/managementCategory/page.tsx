'use client';
import * as React from 'react';
import { useGetAllCategory} from './useCategory';
import toast from 'react-hot-toast';
import {  Box,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField } from '@mui/material';


import AddIcon from '@mui/icons-material/Add';
import AppToaster from '@/components/UX/Toaster/AppToaster';
import DataTable from '@/components/UX/Table/Table';
import { updateStatusCategory } from './useCategory';
import { updateStatus } from '../useManagement';
import { OnlyNameData } from '@/app/type';

export default function CategoryPage() {
  const { categories,  loading,  error,  validationErrors, registerCategory, updateCategories, refreshCategory } = useGetAllCategory();
  
  const [openModal, setOpenModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<OnlyNameData | null>(null);
  const [categoryName, setCategoryName] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true });

  const columns = [
    { id: 'name', label: 'Nombre de la Categoria', numeric: false },
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
    setEditingCategory(null);  // Modo creación
    setCategoryName('');       // Limpiar formulario
    setOpenModal(true);
  };

  const handleEdit = (row: OnlyNameData) => {
    setEditingCategory(row);   //Guardar categoria a editar
    setCategoryName(row.name); // Cargar nombre en el formulario
  };


  //Cambio de estado
  const handleToggleStatus = async (row: OnlyNameData) => {
    try {
      const newStatus = row.status === 'active' ? 'inactive' : 'active';
      await updateStatusCategory(row.id);
      toast.success(`Carerra ${newStatus === 'active' ? 'inactive' : 'activado'} exitosamente`);
      await refreshCategory(); 
    
    } catch (error) {   
      toast.error('Error al cambiar el estado');
    }
  };


  const handleSave = async (updateRow?: any) => {

    if(updateRow && typeof updateRow.preventDefault == 'function') {
          updateRow.preventDefault();
        }
    
        const nameCategory = (updateRow && updateRow.name)?  updateRow.name.trim() : categoryName.trim();
        if (!nameCategory) {
          toast.error('El nombre de la categoria es requerido');
          return;
        }

    try {
      if (editingCategory) {
        
        const data: Partial<OnlyNameData> = {};      
        if (nameCategory.trim() && nameCategory.trim() !== editingCategory.name) {
          data.name = nameCategory.trim();
        }

        await updateCategories(editingCategory.id, data);
        
        setOpenModal(false);
        setCategoryName('');
        setEditingCategory(null);
      } else {
        if (!categoryName.trim()) {
          toast.error('El nombre de la categoria es requerido');
          return;
        }

        const result = await registerCategory({ name: categoryName, id: '' });

       if (result && result.success === false) {
          toast.error('Error de validación:', result.details);
          return; 
        }
        
        setOpenModal(false);
        setCategoryName('');
        toast.success('Categoria creada exitosamente');
      }
      setTimeout(()=>{
        refreshCategory();
      }, 1000);
      
      
    } catch (error) {
      toast.error('Error en handleSave');
      // El error ya se muestra en el hook con toast
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
    setCategoryName('');
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
        data={categories}
        columns={columns}
        title="Gestión de Categorias"
        loading={loading}
        error={error}
        emptyTitle="Aún no hay categoria registrados"
        emptyAction={
          <Button
            onClick={handleOpenCreate}
            startIcon={<AddIcon />}
            variant="contained"
           >
            Agregar Categoria
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
            Agregar Categoria
          </Button>
        }
        onRefresh={refreshCategory}
        onEdit={(row) => handleEdit(row)}
        onSaveEdit={handleSave}
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
          Nueva Categoria
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de la Categiria"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            margin="normal"
            placeholder="Ej: Tratamientos Especiales"
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
            disabled={loading || !categoryName.trim()}
          >
            {loading ? 'Guardando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
