'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Box, Button, Chip, Container, Paper, Typography, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, FormControlLabel, Checkbox, Divider, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import toast from 'react-hot-toast';

import DataTable from '@/components/UX/Table/Table';
import { ProcedureTypeData } from '@/app/type';
import { useGetAlltype} from './useGetType';
import { useGetAllCategory } from '../managementCategory/useCategory';
import { updateStatusType } from './useGetType';
import AppToaster from '@/components/UX/Toaster/AppToaster';

export default function ManagementRequestPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFields, setSearchFields] = React.useState({ name: true, status: true });
  const [estadoFilter, setEstadoFilter] = React.useState('todos');
  const [newDocName, setNewDocName] = React.useState('');
  const { types, loading, error, updateTypesById, refreshtype } = useGetAlltype();
  const typesActive = types.filter(col => col.status !== 'inactive');
  const { categories } = useGetAllCategory();

  // Estados para el Modal de Requisitos
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedProcedure, setSelectedProcedure] = React.useState<ProcedureTypeData | null>(null);
  
  // 💡 Estado dinámico que incluye TODAS las posibles configuraciones (incluso las nuevas)
  const [formRequirements, setFormRequirements] = React.useState({
    promedio: 0,
    UC: 0,
    cohorte: false,
    liso: 'No aplica',
    materia: 'No aplica',
    documents: [] as string[]
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    console.log(category?.name)
    return category?.name || 'Categoría no encontrada';
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // Abrir modal cargando los requisitos actuales o inicializando por si vienen vacíos
  const handleOpenRequirements = (procedure: ProcedureTypeData) => {
    setSelectedProcedure(procedure);
    setFormRequirements({
      promedio: procedure.requirements?.promedio ?? 0,
      UC: procedure.requirements?.UC ?? 0,
      cohorte: !!procedure.requirements?.cohorte,
     liso: typeof procedure.requirements?.conditionLiso === 'boolean'
        ? (procedure.requirements.conditionLiso ? 'Liso' : 'No aplica')
        : (procedure.requirements?.conditionLiso || 'No aplica'),
      materia: typeof procedure.requirements?.materia === 'string' 
        ? (procedure.requirements.materia ? 'Incluir' : 'No aplica')
        : (procedure.requirements?.materia || 'No aplica'),
      documents: procedure.requirements?.documents || []
    });
    setOpenModal(true);
  };

  // Guardar los cambios del Modal hacia el backend
  const handleSaveRequirements = async () => {
    if (!selectedProcedure) return;

    try {
      await updateTypesById(selectedProcedure.id, {
        name: selectedProcedure.name,
        category_id: selectedProcedure.category_id,
        requirements: formRequirements, // Enviamos el objeto estructurado completo
      } as any);

      toast.success('Requisitos actualizados correctamente');
      setOpenModal(false);
      await refreshtype();
    } catch (err) {
      toast.error('Error al guardar las nuevas configuraciones');
    }
  };

  const handleSaveEdit = async (row: ProcedureTypeData) => {
    if (!row.name?.trim()) {
      toast.error('El nombre del tramite es requerido');
      return;
    }
    if (!row.category_id) {
      toast.error('Selecciona una categoria');
      return;
    }

    await updateTypesById(row.id, {
      name: row.name.trim(),
      category_id: row.category_id,
      requirements: row.requirements,
    } as any);
  };

  const columns = [
    { id: 'category_id', 
      label: 'Categoria', 
      numeric: false, 
      editOptions: categoryOptions,
      render: (value: string, row: ProcedureTypeData) => {
        const id = value || row?.category_id;
        return getCategoryName(id);
      }
    },
    { id: 'name', label: 'Nombre del trámite', numeric: false },
    {
      id: 'requirements',
      label: 'Requisitos Configurables',
      numeric: false,
      // 💡 MAPEO VISUAL DE LOS REQUISITOS EN LA CELDA
      render: (value: ProcedureTypeData['requirements'], row: ProcedureTypeData) => (
        <Box sx={{ display: 'flex',flexDirection:'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {value?.promedio ? <Chip label={`Promedio: ≥${value.promedio}`} size="small" color="primary" variant="outlined" /> : null}
            {value?.UC ? <Chip label={`U.C: ≥${value.UC}`} size="small" color="primary" variant="outlined" /> : null}
            {value?.cohorte ? <Chip label="Exige Cohorte" size="small" color="info" variant="outlined" /> : null}
            {value?.liso && value.liso !== 'No aplica' ? <Chip label="Exige Liso" size="small" color="warning" variant="outlined" /> : null}
            {value?.materia && value.materia !== 'No aplica' ? <Chip label="Exige Materia" size="small" color="warning" variant="outlined" /> : null}

          {value?.documents?.map((doc: string) => (
            <Chip 
              key={doc} 
              label={doc} 
              size="small" 
              variant="filled"
              sx={{ 
                bgcolor: 'action.selected', 
                color: 'text.primary',
                fontWeight: 'normal',
                fontSize: '11px'
              }} 
            />
          ))}
          
          </Stack>
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
            display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 2,
            bgcolor: value === 'active' ? 'success.light' : 'error.light',
            color: value === 'active' ? 'success.dark' : 'error.dark',
            fontWeight: 'medium', fontSize: '0.875rem',
          }}
        >
          {value === 'inactive' ? 'Inactivo' : 'Activo'}
        </Box>
      ),
    }
  ];

  const handleToggleStatus = async (row: ProcedureTypeData) => {
    try {
      await updateStatusType(row.id);
      toast.success(`Estado actualizado exitosamente`);
      await refreshtype(); 
    } catch (error) {   
      toast.error('Error al cambiar el estado');
    }
  };

  const handleAddDocument = () => {
  const trimmed = newDocName.trim();
  if (trimmed && !formRequirements.documents.includes(trimmed)) {
    setFormRequirements({
      ...formRequirements,
      documents: [...formRequirements.documents, trimmed]
    });
    setNewDocName(''); // Limpiamos el input
  } else if (formRequirements.documents.includes(trimmed)) {
    toast.error('Este documento ya está en la lista');
  }
};

const handleRemoveDocument = (docToDelete: string) => {
  setFormRequirements({
    ...formRequirements,
    documents: formRequirements.documents.filter(doc => doc !== docToDelete)
  });
};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <AppToaster />
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
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{typesActive.length}</Typography>
            </Box>
          </Paper>
        </Box>

        <DataTable
          data={types} 
          columns={columns} 
          title="Listado de trámites realizados"
          loading={loading} 
          error={error}
          onRefresh={refreshtype} 
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
          renderAdditionalActions={(row: ProcedureTypeData) => (
            <Button 
              size="small" 
              variant="text" 
              startIcon={<SettingsIcon sx={{fontSize:16}} />}
              onClick={() => handleOpenRequirements(row)}
              sx={{ fontSize: '12px', textTransform: 'none', ml: 'auto' }}
            >
              Configurar
            </Button>
          )}
          onSaveEdit={handleSaveEdit} 
          onToggleStatus={handleToggleStatus} 
          getRowId={(row) => row.id}
          filterFields={{
            searchFields, onSearchFieldsChange: setSearchFields,
            rolFilter: 'todos', onRolFilterChange: () => {},
            estadoFilter, onEstadoFilterChange: setEstadoFilter,
            searchTerm, onSearchTermChange: setSearchTerm,
            estadoOptions: [{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }],
            searchLabels: { name: 'Nombre', status: 'Estado' },
          }}
        />
      </Container>

      {/* 💡 MODAL INDEPENDIENTE PARA CONFIGURACIÓN AVANZADA DE REQUISITOS */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          Configurar Requisitos Académicos
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Determina qué datos extraerá y validará el sistema en la Constancia de Notas.
            </Typography>

            <TextField
              label="Promedio Mínimo Requerido"
              type="number"
              fullWidth
              size="small"
              slotProps={{
                htmlInput: { step: "0.1", min: 0, max: 20 }
              }}
              value={formRequirements.promedio}
              onChange={(e) => setFormRequirements({ ...formRequirements, promedio: parseFloat(e.target.value) || 0 })}
            />

            <TextField
              label="Unidades de Crédito Mínimas (U.A)"
              type="number"
              fullWidth
              size="small"
              slotProps={{
                htmlInput: { min: 0 }
              }}
              value={formRequirements.UC}
              onChange={(e) => setFormRequirements({ ...formRequirements, UC: parseInt(e.target.value, 10) || 0 })}
            />

            <Divider />

            <FormControlLabel
              control={
                <Checkbox 
                  checked={formRequirements.cohorte} 
                  onChange={(e) => setFormRequirements({ ...formRequirements, cohorte: e.target.checked })}
                />
              }
              label="Solicitar año de Cohorte de Ingreso"
            />

            <FormControlLabel
              control={
                <Checkbox 
                  checked={formRequirements.liso !== 'No aplica'} 
                  onChange={(e) => setFormRequirements({ ...formRequirements, liso: e.target.checked ? 'Liso' : 'No aplica' })}
                />
              }
              label="Exigir condición de alumno Invicto/Liso"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formRequirements.materia !== 'No aplica'} 
                  onChange={(e) => setFormRequirements({ ...formRequirements, materia: e.target.checked ? 'Incluir' : 'No aplica' })}
                />
              }
              label="El estudiante debe especificar la materia"
            />

            {/* SECCIÓN 2: DOCUMENTOS A CARGAR (ARRAY) */}
            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'primary.main' }}>
                Documentos Requeridos
              </Typography>
              
              {/* Input para agregar nuevo documento */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  placeholder="Ej: Copia de Cédula"
                  fullWidth
                  size="small"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                />
                <Button variant="contained" onClick={handleAddDocument} sx={{ minWidth: '40px' }}>
                  +
                </Button>
              </Box>

              {/* Lista de documentos actuales */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: '40px', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {formRequirements.documents.length > 0 ? (
                  formRequirements.documents.map((doc) => (
                    <Chip
                      key={doc}
                      label={doc}
                      size="small"
                      onDelete={() => handleRemoveDocument(doc)}
                      color="secondary"
                    />
                  ))
                ) : (
                  <Typography variant="caption" color="text.secondary">No hay documentos asignados</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveRequirements} variant="contained" color="primary">Guardar Requisitos</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}