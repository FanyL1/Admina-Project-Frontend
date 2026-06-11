'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import { ProcedureTypeFormData } from '@/app/type';

interface ProcedureFormProps {
  initialValues?: ProcedureTypeFormData;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: ProcedureTypeFormData) => Promise<void> | void;
}

const emptyValues: ProcedureTypeFormData = {
  name: '',
  requirements: {
    documents: [''],
  },
};

export default function ProcedureForm({
  initialValues = emptyValues,
  loading = false,
  submitLabel = 'Guardar tramite',
  onSubmit,
}: ProcedureFormProps) {
  const [name, setName] = React.useState(initialValues.name);
  const [documents, setDocuments] = React.useState<string[]>(
    initialValues.requirements.documents.length > 0
      ? initialValues.requirements.documents
      : [''],
  );
  const [errors, setErrors] = React.useState<{ name?: string; documents?: string }>({});

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
    const nextErrors: { name?: string; documents?: string } = {};

    if (name.trim().length < 3) {
      nextErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (cleanedDocuments.length === 0) {
      nextErrors.documents = 'Agrega al menos un requisito';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({
      name: name.trim(),
      requirements: {
        documents: cleanedDocuments,
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
          Informacion del tramite
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Divider />
          <Box sx={{ pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Requisitos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cada requisito se guardara como documento dentro del JSON del tramite.
              </Typography>
            </Box>

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddDocument}
              disabled={loading}
            >
              Agregar requisito
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
                label={`Requisito ${index + 1}`}
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
