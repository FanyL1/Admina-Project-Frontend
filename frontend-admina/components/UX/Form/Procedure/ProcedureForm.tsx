'use client';
import * as React from 'react';
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import { OnlyNameData, ProcedureTypeFormData } from '@/app/type';
import { useGetAllCategory } from '@/app/(auth)/(management)/managementCategory/useCategory';

interface ProcedureFormProps {
  initialValues?: ProcedureTypeFormData;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: any) => Promise<void> | void;
}

const emptyValues: ProcedureTypeFormData = {
  name: '',
  category_id: '',
  requirements: {
    documents: [''],
    promedio: 0,
  },
};

export default function ProcedureForm({
  initialValues = emptyValues,
  loading = false,
  submitLabel = 'Guardar tramite',
  onSubmit,
}: ProcedureFormProps) {
  const [name, setName] = React.useState(initialValues.name);
  const [categoryId, setCategoryId] = React.useState(initialValues.category_id);
  const [promedio, setpromedio] = React.useState<string>('');
  const [UC, setUC] = React.useState<string>('');
  const [cohorte, setCohorte] = React.useState<string>('false'); 
  const [conditionalLiso, setConditionalLiso] = React.useState<string>('No aplica'); 
  const [materia, setmateria] = React.useState<string>('');

  const [documents, setDocuments] = React.useState<string[]>(
    initialValues.requirements.documents.length > 0
      ? initialValues.requirements.documents
      : [''],
  );
  
  const [errors, setErrors] = React.useState<{ name?: string; category_id?: string; documents?: string; promedio?: number }>({});
  const { categories } = useGetAllCategory();

  const handleDocumentChange = (index: number, value: string) => {
    setDocuments((current) => current.map((item, itemIndex) => (
      itemIndex === index ? value : item
    )));
  };

  const handleAddDocument = () => {
    setDocuments((current) => [...current, '']);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((current) => (
      current.length === 1 ? [''] : current.filter((_, itemIndex) => itemIndex !== index)
    ));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedDocuments = documents.map((item) => item.trim()).filter(Boolean);
    const nextErrors: { name?: string; category_id?: string; documents?: string } = {};

    if (name.trim().length < 3) {
      nextErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!categoryId) {
      nextErrors.category_id = 'Selecciona una categoria';
    }

    if (cleanedDocuments.length === 0) {
      nextErrors.documents = 'Agrega al menos un requisito';
    }
    
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const promedioNumber = promedio === '' ? 0 : Number(promedio);
    const promedioFinal = Math.min(Math.max(promedioNumber, 0), 10);

    // Mapeo solicitado para la propiedad Liso: pasar null, "Liso" o "No liso"
    const lisoBackendValue = conditionalLiso === 'No aplica' ? null : conditionalLiso;
    const requiereMateriaBackend = materia === 'true';
    // Mapeo solicitado para Cohorte: string a booleano real
    const cohorteBackendValue = cohorte === 'true';

    await onSubmit({
      name: name.trim(),
      category_id: categoryId,
      requirements: {
        documents: cleanedDocuments,
        promedio: promedioFinal,
        UC: UC !== '' ? Number(UC) : undefined,
        cohorte: cohorteBackendValue,
        liso: lisoBackendValue,
        materia: requiereMateriaBackend
      },
    });
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', maxWidth: 840, borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: '1px solid', borderColor: 'grey.100' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <DescriptionIcon color="primary" />
          Agregar Tramite
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure los requisitos y documentos necesarios para solicitar el trámite
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2.5, sm: 3 } }}
      >
        <TextField
          autoFocus
          fullWidth
          label="Nombre del tramite"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
        />

        <FormControl fullWidth error={!!errors.category_id} disabled={loading}>
          <InputLabel>Categoria</InputLabel>
          <Select
            label="Categoria"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            {categories.map((category: OnlyNameData) => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
          {errors.category_id && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.category_id}
            </Typography>
          )}
        </FormControl>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Divider />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Configuración de Requisitos Especiales
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <TextField
              fullWidth
              label="Promedio mínimo requerido (Opcional)"
              type="number"
              value={promedio}
              onChange={(event) => setpromedio(event.target.value)}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Unidades de Crédito Aprobadas (UA) mínimas (Opcional)"
              type="number"
              value={UC}
              onChange={(event) => setUC(event.target.value)}
              disabled={loading}
            />

            {/* SELECT DE COHORTE (Retorna Booleano en submit) */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Incluir cohorte</InputLabel>
              <Select
                label="Incluir filtro de cohorte"
                value={cohorte}
                onChange={(event) => setCohorte(event.target.value)}
              >
                <MenuItem value="true">Incluir</MenuItem>
                <MenuItem value="false">No incluir</MenuItem>
              </Select>
            </FormControl>

            {/* SELECT DE CONDICIÓN LISO (Mapea a null, Liso o No liso en submit) */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Aprobo todo el semestre anteriror (Liso)</InputLabel>
              <Select
                label="Condición de alumno Regular (Liso)"
                value={conditionalLiso}
                onChange={(event) => setConditionalLiso(event.target.value)}
              >
                <MenuItem value="No aplica">No aplica</MenuItem>
                <MenuItem value="Liso">Liso</MenuItem>
                <MenuItem value="No liso">No liso</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth disabled={loading}>
            <InputLabel>¿Requiere especificar una materia?</InputLabel>
            <Select
              label="¿Requiere especificar una materia?"
              value={materia} // Aquí guardará "true" o "false"
              onChange={(event) => setmateria(event.target.value)}
            >
              <MenuItem value="true">Sí, el estudiante debe especificar una materia</MenuItem>
              <MenuItem value="false">No aplica para este trámite</MenuItem>
            </Select>
          </FormControl>

          <Divider />
          
          <Box sx={{ pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Documentos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingrese el nombre de los documentos requeridos en formato digital
              </Typography>
            </Box>

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddDocument}
              disabled={loading}
            >
              Agregar documento
            </Button>
          </Box>

          {documents.map((document, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
                p: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
                bgcolor: '#FAFBFE',
              }}
            >
              <TextField
                fullWidth
                label={`Requisito de Documento ${index + 1}`}
                value={document}
                onChange={(event) => handleDocumentChange(index, event.target.value)}
                error={!!errors.documents && index === 0}
                helperText={index === 0 ? errors.documents : undefined}
                disabled={loading}
              />
              <IconButton
                aria-label="Eliminar requisito"
                onClick={() => handleRemoveDocument(index)}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        
        <Divider />
          
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Guardando...' : submitLabel}
        </Button>
      </Box>
    </Paper>
  );
}