'use client';

import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';

import {
  availableCourses,
  currentAcademicPeriod,
  evaluateEligibility,
  normalizeTreatment,
  parseStudyPlan,
  parseTranscript,
  previousRegularPeriod,
  passingGradeFor,
} from '@/app/lib/academicPdf';
import type {
  EligibilityResult,
  IdentityProfile,
  PensumParseResult,
  StudyPlanParseResult,
  TranscriptParseResult,
} from '@/app/lib/academicPdf';
import { readPdfText } from '@/app/lib/pdfText';

// Estructura compatible con el flujo de solicitudes existente.
export interface ExtractedStudentData {
  promedio?: number | null;
  uc?: number | null;
  cohorte?: string | null;
  isLiso?: boolean | null;
}

interface AcademicRequirements {
  promedio?: number | null;
  UC?: number | null;
  cohorte?: string | boolean | null;
  liso?: string | null;
  materia?: string | boolean | null;
  tratamiento?: string | string[] | null;
  [key: string]: unknown;
}

interface PromedioExtractorProps {
  /** Pensum institucional cargado desde el inicio del administrador. */
  initialPensum?: PensumParseResult | null;
  requirementsRules: AcademicRequirements;
  /** Texto de error de identidad que muestra el formulario (compatibilidad). */
  cedula: string;
  onDataExtraida: (data: ExtractedStudentData) => void;
  onDNIextraido: (dni: string) => void;
  profile?: IdentityProfile;
  onTranscriptParsed?: (transcript: TranscriptParseResult | null) => void;
  onPlanParsed?: (plan: StudyPlanParseResult | null) => void;
  /** Guarda el PDF ya parseado como documento de la solicitud. */
  onDocumentFile?: (name: string, file: File | null) => void;
  onEligibilityChange?: (result: EligibilityResult | null) => void;
  selectedSubjectCode?: string | null;
  onSubjectChange?: (code: string | null) => void;
  requestedTreatments?: string[];
  currentPeriod?: string;
  previousPeriod?: string;
  showStudyPlan?: boolean;
}

type DocumentKind = 'constancia' | 'plan';

export const PromedioExtractor = ({
  initialPensum,
  requirementsRules,
  cedula,
  onDataExtraida,
  onDNIextraido,
  profile,
  onTranscriptParsed,
  onPlanParsed,
  onDocumentFile,
  onEligibilityChange,
  selectedSubjectCode,
  onSubjectChange,
  requestedTreatments,
  currentPeriod,
  previousPeriod,
  showStudyPlan,
}: PromedioExtractorProps) => {
  const [loadingDoc, setLoadingDoc] = React.useState<DocumentKind | null>(null);
  const [errorExtractor, setErrorExtractor] = React.useState('');
  const [extractedData, setExtractedData] = React.useState<ExtractedStudentData | null>(null);
  const [transcript, setTranscript] = React.useState<TranscriptParseResult | null>(null);
  const [plan, setPlan] = React.useState<StudyPlanParseResult | null>(null);

  const activePensum = initialPensum;

  const { promedio: reqPromedio, UC: reqUC, cohorte: reqCohorte, liso: reqLiso } = requirementsRules;

  const treatments = React.useMemo(() => {
    const fromProp = (requestedTreatments ?? [])
      .map((value) => normalizeTreatment(value))
      .filter((value): value is string => Boolean(value));
    if (fromProp.length) return fromProp;

    const configured = requirementsRules.tratamiento;
    const values = Array.isArray(configured) ? configured : configured ? [configured] : [];
    return values
      .map((value) => normalizeTreatment(String(value)))
      .filter((value): value is string => Boolean(value));
  }, [requestedTreatments, requirementsRules.tratamiento]);

  const documentNames = Array.isArray(requirementsRules.documents)
    ? requirementsRules.documents.map(String)
    : [];
  const hasAcademicDocument = documentNames.some((name) =>
    /constancia|notas|pensum|plan de estudio/i.test(name),
  );

  const needsAcademicValidation = Boolean(
    (reqPromedio && reqPromedio > 0) ||
      reqUC ||
      reqCohorte ||
      (reqLiso && reqLiso !== 'No aplica') ||
      requirementsRules.materia ||
      treatments.length ||
      hasAcademicDocument ||
      showStudyPlan,
  );

  const planVisible = Boolean(
    showStudyPlan ??
      (requirementsRules.materia || treatments.length > 0 || documentNames.some((name) => /plan de estudio/i.test(name))),
  );

  const period = currentPeriod || currentAcademicPeriod();
  const previous = previousPeriod || previousRegularPeriod(period) || '';
  const catalog = React.useMemo(() => availableCourses(activePensum, transcript), [activePensum, transcript]);

  const eligibility = React.useMemo<EligibilityResult | null>(() => {
    if (!transcript) return null;

    return evaluateEligibility({
      transcript,
      pensum: activePensum,
      plan,
      profile: profile ?? {},
      requestedTreatments: treatments,
      selectedSubjects: selectedSubjectCode
        ? [{ code: selectedSubjectCode, credits: catalog.find((item) => item.code === selectedSubjectCode)?.credits }]
        : [],
      config: {
        minIA: Number(reqPromedio ?? 0) || 0,
        currentPeriod: period,
        previousPeriod: previous,
      },
    });
  }, [
    transcript,
    activePensum,
    plan,
    profile,
    treatments,
    selectedSubjectCode,
    catalog,
    reqPromedio,
    period,
    previous,
  ]);

  React.useEffect(() => {
    onEligibilityChange?.(eligibility);
  }, [eligibility, onEligibilityChange]);

  const handleFile = async (kind: DocumentKind, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecciona un archivo PDF válido.');
      return;
    }

    setLoadingDoc(kind);
    setErrorExtractor('');
    try {
      const text = await readPdfText(file, { pageJoiner: '\n' });

      if (kind === 'plan') {
        const parsed = parseStudyPlan(text);
        setPlan(parsed);
        onPlanParsed?.(parsed);
        onDocumentFile?.('Plan de estudio', file);
        if (!parsed.courses.length) {
          setErrorExtractor('No se encontraron materias en el plan de estudio cargado.');
        }
        return;
      }

      const parsed = parseTranscript(text);
      setTranscript(parsed);
      onTranscriptParsed?.(parsed);
      onDocumentFile?.('Constancia de notas', file);
      onDNIextraido(parsed.idNumber ?? '');

      const approvedCredits = parsed.totals.uc ??
        parsed.records
          .filter((record) => !record.invalidGrade && record.grade >= passingGradeFor(parsed))
          .reduce((total, record) => total + record.credits, 0);
      const legacyData: ExtractedStudentData = {
        promedio: parsed.ia,
        uc: approvedCredits,
        cohorte: parsed.cohorte,
        isLiso: parsed.isLiso,
      };
      setExtractedData(legacyData);
      onDataExtraida(legacyData);

      if (reqPromedio && reqPromedio > 0 && parsed.ia === null) {
        setErrorExtractor('No se pudo leer el promedio general (I.A) en el documento.');
      }
    } catch (err) {
      console.error('Error al procesar el PDF académico:', err);
      toast.error('Error al procesar el archivo PDF.');
    } finally {
      setLoadingDoc(null);
    }
  };

  if (!needsAcademicValidation) return null;

  const uploadButton = (kind: DocumentKind, label: string) => (
    <Button
      variant="outlined"
      component="label"
      size="small"
      startIcon={loadingDoc === kind ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
      disabled={loadingDoc !== null}
    >
      {loadingDoc === kind ? 'Analizando...' : label}
      <input hidden type="file" accept="application/pdf" onChange={(event) => void handleFile(kind, event)} />
    </Button>
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ fontSize: '15px' }} color="text.secondary">
          <strong>Validación académica de documentos</strong>
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          {uploadButton('constancia', transcript ? 'Constancia cargada' : 'Cargar constancia')}
          {planVisible && uploadButton('plan', plan ? 'Plan cargado' : 'Cargar plan de estudio')}
          {planVisible && (
            <Button
              component="a"
              href="/plantillas/plan-de-estudio.docx"
              download="plan-de-estudio.docx"
              size="small"
              startIcon={<DownloadIcon />}
            >
              Plantilla Word
            </Button>
          )}
        </Stack>
      </Box>

      {cedula && <Alert severity="error">{cedula}</Alert>}
      {errorExtractor && <Alert severity="warning">{errorExtractor}</Alert>}

      {extractedData && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {extractedData.promedio !== undefined && (
            <Chip size="small" label={`I.A.: ${extractedData.promedio ?? 'N/D'}`} color={extractedData.promedio !== null && reqPromedio && extractedData.promedio >= reqPromedio ? 'success' : 'default'} />
          )}
          {extractedData.uc !== undefined && <Chip size="small" label={`U.C. aprobadas: ${extractedData.uc ?? 'N/D'}`} />}
          {extractedData.cohorte !== undefined && <Chip size="small" label={`Cohorte: ${extractedData.cohorte ?? 'N/D'}`} />}
          {extractedData.isLiso !== undefined && (
            <Chip
              size="small"
              label={extractedData.isLiso ? 'Último período regular aprobado' : 'Notas raspadas en el último período regular'}
              color={extractedData.isLiso ? 'success' : 'warning'}
            />
          )}
          {transcript && <Chip size="small" label={`Escala ${transcript.scale.min}-${transcript.scale.max} · aprobatoria ${transcript.scale.passing}`} />}
        </Box>
      )}

      {requirementsRules.materia && (
        <FormControl fullWidth size="small">
          <InputLabel id="academic-subject-label">Materia a inscribir</InputLabel>
          <Select
            labelId="academic-subject-label"
            label="Materia a inscribir"
            value={selectedSubjectCode ?? ''}
            onChange={(event) => onSubjectChange?.(event.target.value || null)}
            disabled={!activePensum}
          >
            <MenuItem value="">Selecciona una materia</MenuItem>
            {catalog.map((course) => (
              <MenuItem key={course.code} value={course.code}>
                {course.code} — {course.name} ({course.credits} U.C.)
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {!activePensum
              ? 'El pensum institucional lo carga el administrador desde el inicio.'
              : `${catalog.length} materia(s) disponibles. Las ya aprobadas se ocultan.`}
          </Typography>
        </FormControl>
      )}

      {eligibility && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Resultado: {eligibility.isEligible ? 'elegible' : 'no elegible'}
            </Typography>
            <Stack spacing={0.5}>
              {eligibility.checkedRules.filter((rule) => !rule.skipped).map((rule) => (
                <Box key={rule.ruleId}>
                  <Chip
                    size="small"
                    sx={{ mr: 1 }}
                    color={rule.passed ? 'success' : 'error'}
                    label={`${rule.ruleId} · ${rule.passed ? 'cumple' : 'falla'}`}
                  />
                  <Typography component="span" variant="caption" color="text.secondary">
                    {rule.detail}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {!eligibility.isEligible && (
            <Alert severity="error">
              {eligibility.reasons.map((reason) => (
                <Typography key={reason} variant="caption" component="div">{reason}</Typography>
              ))}
            </Alert>
          )}
          {eligibility.warnings.length > 0 && (
            <Alert severity="warning">
              {eligibility.warnings.map((warning) => (
                <Typography key={warning} variant="caption" component="div">{warning}</Typography>
              ))}
            </Alert>
          )}
        </>
      )}
    </Paper>
  );
};
