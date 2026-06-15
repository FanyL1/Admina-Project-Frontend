'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast, { Toaster } from 'react-hot-toast';
import { useLogin } from '@/app/login/useLogin';
import { OnlyNameData, ProcedureTypeData } from '@/app/type';
import {
  createRequest,
  getDegrees,
  getProcedureTypes,
  uploadRequestDocument,
} from '@/app/services/requestService';

const isAverageRequirement = (value: string) => value.toLowerCase().includes('promedio');

export default function RequestPage() {
  const router = useRouter();
  const { sessionUser } = useLogin();
  const [types, setTypes] = React.useState<ProcedureTypeData[]>([]);
  const [degrees, setDegrees] = React.useState<OnlyNameData[]>([]);
  const [selectedTypeId, setSelectedTypeId] = React.useState('');
  const [degreeId, setDegreeId] = React.useState('');
  const [externalApplicant, setExternalApplicant] = React.useState(false);
  const [externalName, setExternalName] = React.useState('');
  const [externalDni, setExternalDni] = React.useState('');
  const [requirementValues, setRequirementValues] = React.useState<Record<string, string>>({});
  const [requirementFiles, setRequirementFiles] = React.useState<Record<string, File | null>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [typeData, degreeData] = await Promise.all([getProcedureTypes(), getDegrees()]);
        setTypes(typeData);
        setDegrees(degreeData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo cargar la informacion';
        setError(message);
      }
    };

    void Promise.resolve().then(loadData);
  }, []);

  const selectedType = types.find((item) => item.id === selectedTypeId);
  const requirements = selectedType?.requirements?.documents || [];

  const handleSelectType = (id: string) => {
    setSelectedTypeId(id);
    setRequirementValues({});
    setRequirementFiles({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionUser?.id) return toast.error('No hay usuario en sesion');
    if (!selectedTypeId) return toast.error('Selecciona un tramite');
    if (!degreeId) return toast.error('Selecciona una carrera');
    if (externalApplicant && (externalName.trim().length < 3 || externalDni.trim().length < 6)) {
      return toast.error('Completa nombre y cedula del solicitante');
    }

    for (const requirement of requirements) {
      if (isAverageRequirement(requirement)) {
        if (!requirementValues[requirement]) return toast.error(`Completa ${requirement}`);
      } else if (!requirementFiles[requirement]) {
        return toast.error(`Carga el PDF de ${requirement}`);
      }
    }

    setLoading(true);
    try {
      const observationLines = Object.entries(requirementValues)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => `${key}: ${value.trim()}`);

      const request = await createRequest({
        user_id: sessionUser.id,
        type_id: selectedTypeId,
        carrera_id: degreeId,
        createByname: externalName,
        createByDNI: externalDni,
        observation: observationLines.length ? `Datos de requisitos: ${observationLines.join(' | ')}` : undefined,
      });

      if (!request?.id) throw new Error('No se recibio el ID de la solicitud');

      const files = Object.entries(requirementFiles).filter(([, file]) => Boolean(file)) as Array<[string, File]>;
      for (const [requirement, file] of files) {
        await uploadRequestDocument(request.id, requirement, file);
      }

      toast.success('Solicitud enviada exitosamente');
      router.push('/myRequest');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo enviar la solicitud';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Solicitar tramite</Typography>
            <Typography color="text.secondary">Selecciona un tramite y completa sus requisitos.</Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            {types.map((type) => (
              <Grid key={type.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  role="button"
                  onClick={() => handleSelectType(type.id)}
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedTypeId === type.id ? 'primary.main' : 'grey.200',
                    bgcolor: selectedTypeId === type.id ? 'primary.light' : 'background.paper',
                    color: selectedTypeId === type.id ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <AssignmentIcon />
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{type.name}</Typography>
                      <Typography variant="body2">
                        {(type.requirements?.documents || []).length} requisito(s)
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {selectedType && (
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedType.name}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {requirements.map((requirement) => (
                      <Chip key={requirement} label={requirement} size="small" />
                    ))}
                  </Stack>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Carrera</InputLabel>
                  <Select value={degreeId} label="Carrera" onChange={(event) => setDegreeId(event.target.value)}>
                    {degrees.map((degree) => (
                      <MenuItem key={degree.id} value={degree.id}>{degree.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={externalApplicant} onChange={(event) => setExternalApplicant(event.target.checked)} />}
                    label="No soy el solicitante"
                  />
                  {externalApplicant ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <TextField fullWidth label="Nombre completo del solicitante" value={externalName} onChange={(event) => setExternalName(event.target.value)} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth label="Cedula" value={externalDni} onChange={(event) => setExternalDni(event.target.value)} />
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Solicitante: {sessionUser?.name} {sessionUser?.lastname} - DNI: {sessionUser?.dni}
                    </Typography>
                  )}
                </Paper>

                <Stack spacing={2}>
                  {requirements.map((requirement) => (
                    <Paper key={requirement} variant="outlined" sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>{requirement}</Typography>
                      {isAverageRequirement(requirement) ? (
                        <TextField
                          fullWidth
                          type="number"
                          label="Promedio"
                          value={requirementValues[requirement] || ''}
                          onChange={(event) => setRequirementValues((current) => ({ ...current, [requirement]: event.target.value }))}
                        />
                      ) : (
                        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                          {requirementFiles[requirement]?.name || 'Cargar PDF'}
                          <input
                            hidden
                            type="file"
                            accept="application/pdf"
                            onChange={(event) => setRequirementFiles((current) => ({
                              ...current,
                              [requirement]: event.target.files?.[0] || null,
                            }))}
                          />
                        </Button>
                      )}
                    </Paper>
                  ))}
                </Stack>

                <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={loading} sx={{ alignSelf: 'flex-start' }}>
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
