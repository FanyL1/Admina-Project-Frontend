'use client';

import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { clearPensumCatalog, savePensumCatalog } from '@/app/lib/academicCatalog';
import { parsePensum } from '@/app/lib/academicPdf';
import { readPdfText } from '@/app/lib/pdfText';
import { usePensumCatalog } from '@/hooks/useAcademicCatalog';

export default function AcademicSetup() {
  const pensum = usePensumCatalog();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handlePensum = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    if (file.type !== 'application/pdf') {
      setError('Selecciona un archivo PDF válido.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const text = await readPdfText(file, { pageJoiner: '\n' });
      const parsed = parsePensum(text);
      if (!parsed.courses.length) {
        setError('No se encontraron materias en el pensum cargado.');
        return;
      }
      savePensumCatalog(parsed);
    } catch (err) {
      console.error('Error al procesar el pensum:', err);
      setError('No se pudo procesar el PDF del pensum.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Pensum institucional
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Carga el pensum una sola vez. Se usará al validar las solicitudes de trámites.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            component="label"
            size="small"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
            disabled={loading}
          >
            {loading ? 'Analizando...' : pensum ? 'Cambiar pensum' : 'Cargar pensum'}
            <input hidden type="file" accept="application/pdf" onChange={(event) => void handlePensum(event)} />
          </Button>

          {pensum && (
            <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={clearPensumCatalog}>
              Quitar pensum
            </Button>
          )}
        </Stack>

        {error && <Alert severity="warning">{error}</Alert>}

        {pensum && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip size="small" color="success" label="Pensum cargado" />
            {pensum.career && <Chip size="small" variant="outlined" label={pensum.career} />}
            <Chip size="small" variant="outlined" label={`${pensum.courses.length} materias`} />
            {pensum.warnings.length > 0 && (
              <Chip size="small" color="warning" label={`${pensum.warnings.length} advertencias`} />
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
