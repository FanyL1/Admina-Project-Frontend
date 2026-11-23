'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Box, Button, Checkbox, Chip, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper,
  Select, Stack, TextField, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';

import { useLogin } from '@/app/login/useLogin';
import { OnlyNameData, ProcedureTypeData } from '@/app/type';
import { createRequest, getDegrees, getProcedureTypes, uploadRequestDocument,} from '@/app/services/requestService';
import AppToaster from '@/components/UX/Toaster/AppToaster';
import { PromedioExtractor } from '@/components/UX/Buttons/ExtractorData';
import { compareIdentity } from '@/app/lib/academicPdf';
import type { EligibilityResult } from '@/app/lib/academicPdf';
import { usePensumCatalog } from '@/hooks/useAcademicCatalog';
import { useGetAllCategory } from '../../managementCategory/useCategory';

const isAverageRequirement = (value: string) => value.toLowerCase().includes('promedio');

// Estos PDFs se cargan en el validador académico; no se pide una segunda copia.
const VALIDATOR_DOCUMENTS = ['Constancia de notas', 'Plan de estudio'];

export default function RequestFormPage() {
  return (
    <React.Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Cargando tramite...</Typography>
        </Box>
      }
    >
      <RequestFormContent />
    </React.Suspense>
  );
}

function RequestFormContent() {
  const router = useRouter();
  const { sessionUser } = useLogin();
  const [types, setTypes] = React.useState<ProcedureTypeData[]>([]);
  const [degrees, setDegrees] = React.useState<OnlyNameData[]>([]);
  const {categories} = useGetAllCategory()
  const [degreeId, setDegreeId] = React.useState('');
  const [externalApplicant, setExternalApplicant] = React.useState(false);
  const [externalName, setExternalName] = React.useState('');
  const [externalDni, setExternalDni] = React.useState('');
  const [requirementValues, setRequirementValues] = React.useState<Record<string, string>>({});
  const [requirementFiles, setRequirementFiles] = React.useState<Record<string, File | null>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const idUrl = searchParams.get('id') ?? '';
  const [promedioStudent, setPromedioStudent] = React.useState<number | null>(null);
  const [errorPromedio, seterrorPromedio] = React.useState('')
  const [ucStudent, setUcStudent] = React.useState<number | null>(null);
  const [cohorteStudent, setCohorteStudent] = React.useState<string | null>(null);
  const [isLisoStudent, setIsLisoStudent] = React.useState<boolean | null>(null);
  const [materiaStudent, setMateriaStudent] = React.useState<string | null>(null);
  const [eligibilityResult, setEligibilityResult] = React.useState<EligibilityResult | null>(null);
  const catalogPensum = usePensumCatalog();

  const tramite = types?.filter(
    (selecType) => selecType.id === idUrl
  ) ?? [];

const categoryName = categories?.find(
  (c) => c.id === tramite[0]?.category_id
)?.name ?? 'Categoría no encontrada';

  // El validador memoiza la elegibilidad con este objeto; si se crea en cada
  // render, el efecto de onEligibilityChange entra en un ciclo infinito.
  const identityProfile = React.useMemo(
    () => (externalApplicant
      ? { dni: externalDni, name: externalName }
      : {
          dni: sessionUser?.dni,
          name: sessionUser?.name,
          lastname: sessionUser?.lastname,
        }),
    [
      externalApplicant,
      externalDni,
      externalName,
      sessionUser?.dni,
      sessionUser?.name,
      sessionUser?.lastname,
    ],
  );

  React.useEffect(() => {
    const loadData = async () => {
      if (!idUrl) {
        setError('No se indico el tramite');
        return;
      }
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
  }, [idUrl]);

  const requirements = tramite[0]?.requirements.documents || [];
  const visibleRequirements = requirements.filter((name) => !VALIDATOR_DOCUMENTS.includes(name));
  const promedio = tramite[0]?.requirements.promedio;
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionUser?.id) return toast.error('No hay usuario en sesion');
    if (!degreeId) return toast.error('Selecciona una carrera');
    if (externalApplicant && (externalName.trim().length < 3 || externalDni.trim().length < 6)) {
      return toast.error('Completa nombre y cedula del solicitante');
    }
    if (errorPromedio) {
      return toast.error(errorPromedio);
    }
    if (promedio !== null && promedio !== undefined && promedio > 0) {
      if (promedioStudent === null || promedioStudent < promedio) {
        const message = 'No puedes enviar la solicitud porque tu promedio es inferior al requerido o no se pudo leer.';
        seterrorPromedio(message);
        return toast.error(message);
      }
    }
    if (eligibilityResult && !eligibilityResult.isEligible) {
      return toast.error(`No cumples la validación académica: ${eligibilityResult.reasons[0] ?? 'revisa el resultado'}`);
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
        type_id: idUrl,
        carrera_id: degreeId,
        createByname: externalApplicant ? externalName.trim() : undefined,
        createByDNI: externalApplicant ? externalDni.trim() : undefined,
        observation: observationLines.length ? `Datos de requisitos: ${observationLines.join(' | ')}` : undefined,
        additionalData: {
          promedio: promedioStudent, 
          UC: ucStudent, 
          cohorte: cohorteStudent,  
          conditionLiso: isLisoStudent,
          materia: materiaStudent,
          academicValidation: eligibilityResult
            ? {
                isEligible: eligibilityResult.isEligible,
                checkedRules: eligibilityResult.checkedRules,
                reasons: eligibilityResult.reasons,
              }
            : undefined,
        }
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 8, md: 4 } }}>
      <AppToaster />
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ alignSelf: 'flex-start' }}>
            Volver
          </Button>

          {error && <Alert severity="error">{error}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{tramite[0]?.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{categoryName}</Typography>
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
                  {externalApplicant ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <TextField 
                          fullWidth 
                          label="Nombre completo del solicitante"
                          placeholder='Ej. Juan Luis Rodriguez Herrera' 
                          value={externalName} 
                          onChange={(event) => setExternalName(event.target.value)} 
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth 
                        type='number'
                        label="Cedula" 
                        value={externalDni} 
                        onChange={(event) => setExternalDni(event.target.value)} />
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" sx={{fontSize:'18px'}} color="text.secondary">
                      <strong>Solicitante:</strong> {sessionUser?.name} {sessionUser?.lastname} - Cedula: {sessionUser?.dni}
                    </Typography>
                  )}
                  <FormControlLabel
                    control={<Checkbox checked={externalApplicant} onChange={(event) => setExternalApplicant(event.target.checked)} />}
                    label="No soy el solicitante"
                  />
                </Paper>
                <PromedioExtractor
                  initialPensum={catalogPensum}
                  requirementsRules={tramite[0]?.requirements || {}}
                  cedula={errorPromedio}
                  profile={identityProfile}
                  onDNIextraido={(dniLeido) => {
                    const expectedDni = externalApplicant ? externalDni : sessionUser?.dni;
                    const identity = compareIdentity({ idNumber: dniLeido }, { dni: expectedDni });
                    seterrorPromedio(identity.ok ? '' : identity.issues.join('. '));
                  }}
                  onDataExtraida={(data) => {
                    setPromedioStudent(data.promedio ?? null);
                    setUcStudent(data.uc ?? null);
                    setCohorteStudent(data.cohorte ?? null);
                    setIsLisoStudent(data.isLiso ?? null);
                  }}
                  onEligibilityChange={setEligibilityResult}
                  onDocumentFile={(name, file) => setRequirementFiles((current) => ({
                    ...current,
                    [name]: file,
                  }))}
                  selectedSubjectCode={materiaStudent}
                  onSubjectChange={setMateriaStudent}
                />

                <Stack spacing={2}>
                  {visibleRequirements.map((requirement) => (
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

        </Stack>
      </Container>
    </Box>
  );
}
