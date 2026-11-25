/**
 * Parsers y reglas deterministas para pensum, constancia de notas y plan de estudio.
 *
 * Inspirado en los problemas reales documentados en `pdf-extraction-prompt.md`.
 * Este módulo es puro (no importa React ni pdf.js) para poder ejecutarse en tests.
 */

export interface PensumCourse {
  code: string;
  name: string;
  semester: number;
  credits: number;
  prerequisites: string[];
  /** Prelaciones en texto ("13 U.C Aprobadas") que no pueden resolverse a códigos. */
  prerequisiteNotes: string[];
}

export interface PensumParseResult {
  career: string | null;
  courses: PensumCourse[];
  warnings: string[];
}

export interface TranscriptRecord {
  code: string;
  subject: string;
  grade: number;
  credits: number;
  period: string;
  enrolled: boolean;
  /** Notas fuera de escala (< 0 o > max) se conservan pero se marcan. */
  invalidGrade?: boolean;
}

export interface GradeScale {
  min: number;
  max: number;
  passing: number;
  declared: boolean;
}

export interface TranscriptParseResult {
  idNumber: string | null;
  fullName: string | null;
  career: string | null;
  cohorte: string | null;
  scale: GradeScale;
  periods: string[];
  records: TranscriptRecord[];
  ia: number | null;
  totals: { ua: number | null; uc: number | null };
  approvedCodes: string[];
  /** "Liso" calculado a partir del último período regular, no de un scan de texto. */
  isLiso: boolean | null;
  warnings: string[];
}

export interface StudyPlanCourse {
  code: string;
  name: string;
  credits: number;
  section: string;
  /** Tratamiento declarado en esa fila; null cuando la celda está vacía. */
  treatment: string | null;
}

export interface StudyPlanParseResult {
  idNumber: string | null;
  apellidos: string | null;
  nombres: string | null;
  period: string | null;
  courses: StudyPlanCourse[];
  warnings: string[];
}

export interface RuleResult {
  ruleId: string;
  description: string;
  kind: 'identity' | 'scale' | 'credits' | 'index' | 'period' | 'plan' | 'grade' | 'prerequisite' | 'subject';
  operator: string;
  threshold?: string | number;
  passed: boolean;
  skipped?: boolean;
  detail: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  checkedRules: RuleResult[];
  reasons: string[];
  warnings: string[];
}

export interface EligibilityThresholds {
  extracreditosUC: number;
  paraleloUC: number;
  proyectoGradoIUC: number;
  examenExtraordinarioPensumFraction: number;
  inscripcionEspecialMaxUC: number;
}

export const TREATMENT_OPTIONS = [
  'EXTRACREDITOS',
  'PARALELO',
  'PROYECTO DE GRADO I',
  'EXAMEN EXTRAORDINARIO',
  'INSCRIPCION ESPECIAL',
  'ULTIMO SEMESTRE',
] as const;

export const DEFAULT_ELIGIBILITY_THRESHOLDS: EligibilityThresholds = {
  extracreditosUC: 80,
  paraleloUC: 120,
  proyectoGradoIUC: 143,
  examenExtraordinarioPensumFraction: 1 / 3,
  inscripcionEspecialMaxUC: 9,
};

const TREATMENT_ALIASES: Record<string, string> = {
  EXTRACREDITO: 'EXTRACREDITOS',
  EXTRACREDITOS: 'EXTRACREDITOS',
  PARALELO: 'PARALELO',
  PROYECTODEGRADOI: 'PROYECTO DE GRADO I',
  PROYECTODEGRADOII: 'PROYECTO DE GRADO II',
  EXAMENEXTRAORDINARIO: 'EXAMEN EXTRAORDINARIO',
  INSCRIPCIONESPECIAL: 'INSCRIPCION ESPECIAL',
  ULTIMOSEMESTRE: 'ULTIMO SEMESTRE',
};

const IGNORE_PATTERNS = [
  /^P[ÁA]GINA\s+\d+\s+DE\s+\d+/i,
  /^D\.?\s?A\.?\s?C\.?\s?E\b/i,
  /^(LUNES|MARTES|MI[ÉE]RCOLES|JUEVES|VIERNES|S[ÁA]BADO|DOMINGO)[,\s]+\d/i,
  /^CARRERA\s*:/i,
  /^PENSUM\b/i,
  /^PENSUM\s+ID\s*:/i,
  /^PLAN\s+DE\s+ESTUDIO\b/i,
  /^CONSTANCIA\s+DE\b/i,
  /^REP[ÚU]BLICA\b/i,
  /^UNIVERSIDAD\b/i,
  /^DIRECCI[ÓO]N\b/i,
  /^C[ÓO]D\.?\s+(ASIGNATURA|MATERIA)/i,
  /^NOMBRE\s+MATERIA\b/i,
  /^HORAS\b/i,
  /^U\.?\s?C\.?\b.*\bNOTA\b/i,
  /^ESTE\s+DOCUMENTO\b/i,
  /^NOTA\s*:/i,
  /^SCN\s*-/i,
];

const SEMESTER_RE = /^(\d{1,2})\s+(?:SEMESTRE|SEM\.?)\b/i;
const ROW_START_RE = /^\s*(?:\(\d+\)\s+)?([A-Z]{1,6}\d{0,5})(?=\s|$)/;
const HOURS_BLOCK_RE = /(?:^|\s)(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,2})(?=\s|$)/;
const CODE_RE = /\b[A-Z]{2,6}\d{2,5}\b/g;

/** Quita acentos sin alterar el resto del texto (solo para comparaciones). */
export const stripAccents = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Normaliza texto para comparar: mayúsculas, sin acentos, sin puntuación, espacios colapsados. */
export const normalizeForCompare = (value: string): string =>
  stripAccents(value)
    .toUpperCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

/** Normaliza `20261` / `2026-1` / `2026/1` a `2026-1`. */
export const normalizePeriod = (value: string): string | null => {
  const match = String(value).trim().match(/^(\d{4})\D?([1-3])$/);
  return match ? `${match[1]}-${match[2]}` : null;
};

/** período regular anterior al indicado (`2026-2` -> `2026-1`, `2026-1` -> `2025-2`). */
export const previousRegularPeriod = (period: string): string | null => {
  const normalized = normalizePeriod(period);
  if (!normalized) return null;
  const [year, lap] = normalized.split('-').map(Number);
  if (lap === 2) return `${year}-1`;
  if (lap === 1) return `${year - 1}-2`;
  return `${year}-2`;
};

/** Período académico actual según la convención usada en el resto de la app. */
export const currentAcademicPeriod = (date: string | Date = new Date()): string => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  if (month >= 3 && month <= 7) return `${year}-1`;
  if (month >= 8 && month <= 9) return `${year}-3`;
  if (month >= 10) return `${year}-2`;
  return `${year - 1}-2`;
};

/** Normaliza el nombre del tratamiento declarado en el plan. */
export const normalizeTreatment = (value: string): string | null => {
  const key = normalizeForCompare(value).replace(/\s/g, '');
  if (!key) return null;
  return TREATMENT_ALIASES[key] ?? normalizeForCompare(value);
};

/** Calificación mínima aprobatoria declarada en la constancia (fallback documentado: 6). */
export const passingGradeFor = (transcript: Pick<TranscriptParseResult, 'scale'>): number =>
  transcript.scale.passing;

/** Códigos de materia presentes en un texto (incluye prefijos numéricos entre paréntesis). */
export const extractCodes = (value: string): string[] =>
  Array.from(new Set(value.match(CODE_RE) ?? []));

const cleanLines = (text: string): string[] =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u200b-\u200f\ufeff]/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const isIgnorableLine = (line: string): boolean => {
  const comparable = stripAccents(line).trim();
  return IGNORE_PATTERNS.some((pattern) => pattern.test(comparable));
};

const parseNumber = (value: string): number => {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
};

/** Extrae la C.I. y el nombre completo cuando aparecen en la misma línea. */
const parseIdentityLine = (line: string): { idNumber: string | null; fullName: string | null } | null => {
  const match = line.match(/^C\.?\s?I\.?\s*[:\-.]?\s*(\d{6,9})\s*(?:[-–]\s*(.*))?$/i);
  if (!match) return null;
  return { idNumber: match[1], fullName: match[2]?.trim() || null };
};

// ---------------------------------------------------------------------------
// Pensum
// ---------------------------------------------------------------------------

export const parsePensum = (text: string): PensumParseResult => {
  const lines = cleanLines(text);
  const warnings: string[] = [];
  const courses: PensumCourse[] = [];
  let career: string | null = null;
  let semester = 0;
  let buffer = '';
  /** Líneas sin código vistas antes de la fila (el PDF parte algunas filas en ese orden). */
  let pendingContinuation: string[] = [];

  const flush = () => {
    const row = buffer.trim();
    buffer = '';
    if (!row) return;

    const match = row.match(ROW_START_RE);
    if (!match) return;
    const code = match[1];
    const afterCode = row.slice(match[0].length).replace(/^\s*\(\d+\)\s*/, '');

    const hoursMatch = afterCode.match(HOURS_BLOCK_RE);
    let credits: number;
    let namePart: string;
    let remainder: string;

    if (hoursMatch) {
      credits = Number(hoursMatch[4]);
      namePart = afterCode.slice(0, hoursMatch.index).trim();
      remainder = afterCode.slice((hoursMatch.index ?? 0) + hoursMatch[0].length).trim();
    } else {
      const explicitCredits = afterCode.match(/U\.?\s?C\.?\s*[:\-]?\s*(\d{1,2})\b/i);
      if (!explicitCredits) {
        // Encabezados y filas partidas por el PDF se descartan sin ruido.
        // El bloque numérico suele llegar en la siguiente línea.
        return;
      }
      credits = Number(explicitCredits[1]);
      namePart = afterCode.slice(0, explicitCredits.index).trim();
      remainder = afterCode.slice((explicitCredits.index ?? 0) + explicitCredits[0].length).trim();
    }

    const name = namePart
      .split(/\s+(?:U\.?\s?C\.?|CREDITOS|PRELACION|SECCION)\b/i)[0]
      .replace(/[.,;:]+$/, '')
      .trim();

    if (!name) {
      warnings.push(`Fila de pensum sin nombre de materia: ${row}`);
      return;
    }

    const prerequisiteCodes = extractCodes(remainder).filter((item) => item !== code);
    const prerequisiteNote = remainder
      .replace(/[()]/g, ' ')
      .replace(/\b\d+\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!semester) {
      warnings.push(`Materia ${code} posterior a un encabezado de semestre desconocido.`);
    }

    courses.push({
      code,
      name,
      semester,
      credits,
      prerequisites: prerequisiteCodes,
      prerequisiteNotes: prerequisiteNote && prerequisiteCodes.length === 0 ? [prerequisiteNote] : [],
    });
  };

  for (const line of lines) {
    const semesterMatch = line.match(SEMESTER_RE);
    if (semesterMatch) {
      flush();
      pendingContinuation = [];
      semester = Number(semesterMatch[1]);
      continue;
    }

    if (/^CARRERA\s*:/i.test(line)) {
      career = line.replace(/^CARRERA\s*:\s*/i, '').trim() || null;
      continue;
    }

    if (isIgnorableLine(line)) {
      continue;
    }

    const lineHasNumbers = HOURS_BLOCK_RE.test(line) || /U\.?\s?C\.?\s*[:\-]?\s*\d/i.test(line);
    const bufferIncomplete = Boolean(buffer) &&
      !HOURS_BLOCK_RE.test(buffer) &&
      !/U\.?\s?C\.?\s*[:\-]?\s*\d/i.test(buffer);

    // El PDF parte algunas filas dejando el bloque numérico en la línea siguiente,
    // que además puede empezar con una palabra que parece código ("DEL ...").
    if (bufferIncomplete && lineHasNumbers) {
      buffer += ` ${line}`;
      continue;
    }

    const startsRow = ROW_START_RE.test(line);
    if (startsRow) {
      flush();
      if (pendingContinuation.length) {
        // Ejemplo real: "(571) ELECTIVA II (LEGISLACION" viene antes de
        // "(350) IME520 INFORMATICA) 0 57 57 2 ...". Se recompone la fila
        // insertando la continuación justo después del código.
        const rowStart = line.match(ROW_START_RE)?.[0] ?? line;
        const rest = line.slice(rowStart.length);
        const prefix = pendingContinuation
          .map((part) => part.replace(/^\(\d+\)\s*/, ''))
          .join(' ');
        buffer = `${rowStart} ${prefix} ${rest}`.replace(/\s+/g, ' ').trim();
      } else {
        buffer = line;
      }
      pendingContinuation = [];
    } else if (buffer) {
      const bufferComplete = HOURS_BLOCK_RE.test(buffer) || /U\.?\s?C\.?\s*[:\-]?\s*\d/i.test(buffer);
      if (!bufferComplete || lineHasNumbers) {
        // La fila aún no tiene su bloque numérico: toda línea siguiente es su continuación.
        buffer += ` ${line}`;
      } else {
        // El PDF puede imprimir el inicio del nombre ANTES del renglón con el
        // código; se guarda para reinsertarlo cuando aparezca ese código.
        pendingContinuation.push(line);
      }
    } else {
      pendingContinuation.push(line);
    }
  }
  flush();

  return { career, courses, warnings };
};

// ---------------------------------------------------------------------------
// Constancia de notas
// ---------------------------------------------------------------------------

export const parseTranscript = (text: string): TranscriptParseResult => {
  const lines = cleanLines(text);
  const joined = lines.join(' ');
  const joinedComparable = stripAccents(joined);
  const warnings: string[] = [];

  const identityLine = lines.map(parseIdentityLine).find(Boolean);
  const idNumber = identityLine?.idNumber ?? null;
  const fullName = identityLine?.fullName ?? null;

  const careerMatch = joinedComparable.match(/CARRERA\s*:\s*(.*?)(?=\s+COHORTE\s*:|\s+STATUS\s*:|$)/i);
  const career = careerMatch?.[1]?.trim() ?? null;
  const cohorte = joinedComparable.match(/COHORTE\s*:\s*(\d{4})/i)?.[1] ?? null;

  const scaleMatch = joinedComparable.match(/ESCALA\s+DE\s+MEDICION\s*[:\-]?\s*(\d+)\s*-\s*(\d+)/i);
  const passingMatch = joinedComparable.match(/CALIFICACION\s+MINIMA\s+APROBATORIA\s*[:\-]?\s*(\d+)/i);
  const scale: GradeScale = {
    min: scaleMatch ? Number(scaleMatch[1]) : 1,
    max: scaleMatch ? Number(scaleMatch[2]) : 10,
    passing: passingMatch ? Number(passingMatch[1]) : 6,
    declared: Boolean(scaleMatch && passingMatch),
  };
  if (!scale.declared) {
    warnings.push('La constancia no declara escala y/o nota mínima aprobatoria; se usa el fallback 1-10, aprobatoria 6.');
  }

  const periods: string[] = [];
  const records: TranscriptRecord[] = [];
  let currentPeriod = '';

  const totalsIndex = lines.findIndex((line) => /TOTALES\b/i.test(line));
  let ia: number | null = null;
  let ua: number | null = null;
  let uc: number | null = null;

  const directIa = joined.match(/I\.?\s?A\.?\s*[:\-]?\s*(\d{1,2}[.,]\d{1,2})(?!\d)/i);
  if (directIa) {
    ia = parseNumber(directIa[1]);
  } else if (totalsIndex >= 0) {
    for (let index = totalsIndex; index < Math.min(totalsIndex + 4, lines.length); index += 1) {
      const totalsMatch = lines[index].match(/(\d{1,4})\s*\|\s*(\d{1,4})\s+(\d{1,2}[.,]\d{1,2})(?!\d)/);
      if (!totalsMatch) continue;
      ua = Number(totalsMatch[1]);
      uc = Number(totalsMatch[2]);
      ia = parseNumber(totalsMatch[3]);
      break;
    }
  }
  if (ia === null) {
    const fallbackIa = joined.match(/\|\s*\d{1,4}\s+(\d{1,2}[.,]\d{1,2})(?!\d)/);
    if (fallbackIa) ia = parseNumber(fallbackIa[1]);
  }
  if (ia === null) warnings.push('No se pudo leer el I.A. de la constancia.');

  if (totalsIndex >= 0) {
    for (let index = totalsIndex; index < Math.min(totalsIndex + 4, lines.length); index += 1) {
      const totalsMatch = lines[index].match(/(\d{1,4})\s*\|\s*(\d{1,4})/);
      if (!totalsMatch) continue;
      ua = Number(totalsMatch[1]);
      uc = Number(totalsMatch[2]);
      break;
    }
  }

  for (const line of lines) {
    const periodMatch = line.match(/PER[IÍ]ODO\s*[:\-]?\s*(\d{5}|\d{4}-\d)/i);
    const standalonePeriod = /^\d{5}$/.test(line) ? normalizePeriod(line) : null;
    if (periodMatch) {
      currentPeriod = normalizePeriod(periodMatch[1]) ?? '';
      if (currentPeriod && !periods.includes(currentPeriod)) periods.push(currentPeriod);
      continue;
    }
    if (standalonePeriod) {
      currentPeriod = standalonePeriod;
      if (!periods.includes(currentPeriod)) periods.push(currentPeriod);
      continue;
    }
    if (isIgnorableLine(line)) continue;

    const rowMatch = line.match(
      /^\s*(?:\(\d+\)\s+)?([A-Z]{1,6}\d{0,5})\s+(.+?)\s+(\d{1,2}(?:[.,]\d{1,2})?)\s+(\d{1,2}(?:[.,]\d{1,2})?)\s*$/,
    );
    if (!rowMatch) continue;

    const grade = parseNumber(rowMatch[4]);
    const invalidGrade = grade < 0 || grade > scale.max;
    if (invalidGrade) {
      warnings.push(`Nota fuera de escala para ${rowMatch[1]}: ${rowMatch[4]}`);
    }

    records.push({
      code: rowMatch[1],
      subject: rowMatch[2].trim(),
      credits: parseNumber(rowMatch[3]),
      grade,
      period: currentPeriod,
      enrolled: true,
      invalidGrade,
    });
  }

  const approvedCodes = records
    .filter((record) => !record.invalidGrade && record.grade >= scale.passing)
    .map((record) => record.code);

  const regularPeriods = periods.filter((period) => !period.endsWith('-3'));
  const lastRegularPeriod = regularPeriods[regularPeriods.length - 1] ?? '';
  const lastPeriodRecords = lastRegularPeriod
    ? records.filter((record) => record.period === lastRegularPeriod)
    : [];
  const isLiso = lastPeriodRecords.length
    ? lastPeriodRecords.every((record) => record.grade >= scale.passing)
    : null;

  return {
    idNumber,
    fullName,
    career,
    cohorte,
    scale,
    periods,
    records,
    ia,
    totals: { ua, uc },
    approvedCodes: Array.from(new Set(approvedCodes)),
    isLiso,
    warnings,
  };
};

// ---------------------------------------------------------------------------
// Plan de estudio
// ---------------------------------------------------------------------------

export const parseStudyPlan = (text: string): StudyPlanParseResult => {
  const lines = cleanLines(text);
  const joined = lines.join(' ');
  const warnings: string[] = [];
  const courses: StudyPlanCourse[] = [];

  const rowRegex = /^\s*(?:\(\d+\)\s+)?([A-Z]{1,6}\d{0,5})\s+(.+?)\s+(\d{1,2})\s+(\d{1,2})\s*(.*)$/;
  const isCourseLine = (value: string) => rowRegex.test(value);
  const isTreatmentContinuation = (value: string) => {
    const candidate = value.trim();
    if (!candidate || isCourseLine(candidate) || isIgnorableLine(candidate)) return false;
    if (/^(NOTA|CARGADO|PERIODO|SEMESTRE|C[ÓO]DIGO|PLAN\b)/i.test(candidate)) return false;
    // Fragmentos como "EXTRAordinario" salen en su propia línea cuando Word
    // ajusta el texto de la celda TRATAMIENTO.
    return candidate.length <= 60 && /^[\p{L}\p{N}\s.,()\-/]+$/u.test(candidate);
  };

  const identityLine = lines.map(parseIdentityLine).find(Boolean);
  const idNumber = identityLine?.idNumber ?? null;
  const apellidos = joined.match(/APELLIDOS\s*[:\-]\s*(.*?)(?=\s+NOMBRES\s*:|$)/i)?.[1]?.trim() ?? null;
  const nombres = joined.match(/NOMBRES\s*[:\-]\s*(.*?)(?=\s+PERIODO\s*:|$)/i)?.[1]?.trim() ?? null;
  const rawPeriod = joined.match(/PERIODO\s*[:\-]?\s*(\d{5}|\d{4}-\d)/i)?.[1] ?? null;
  const period = rawPeriod ? normalizePeriod(rawPeriod) : null;

  if (rawPeriod && !period) warnings.push(`Período del plan no reconocido: ${rawPeriod}`);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (isIgnorableLine(line)) continue;
    const match = line.match(rowRegex);
    if (!match) continue;

    const fragments = match[5].trim() ? [match[5].trim()] : [];
    let cursor = index + 1;
    while (cursor < lines.length && isTreatmentContinuation(lines[cursor])) {
      fragments.push(lines[cursor].trim());
      cursor += 1;
    }
    index = cursor - 1;

    const rawTreatment = fragments.join(' ').trim();
    const treatment = normalizeTreatment(rawTreatment);
    if (rawTreatment && !treatment) {
      warnings.push(`Tratamiento no reconocido en la fila de ${match[1]}: ${rawTreatment}`);
    }

    courses.push({
      code: match[1],
      name: match[2].trim(),
      credits: Number(match[3]),
      section: match[4],
      treatment,
    });
  }

  return { idNumber, apellidos, nombres, period, courses, warnings };
};

// ---------------------------------------------------------------------------
// Identidad
// ---------------------------------------------------------------------------

export interface IdentityProfile {
  dni?: string | null;
  name?: string | null;
  lastname?: string | null;
}

const normalizeDni = (value: string | null | undefined): string =>
  String(value ?? '').replace(/\D/g, '').replace(/^0+/, '');

/** Compara C.I. y nombres tolerando mayúsculas, tildes, espacios y nombres ausentes. */
export const compareIdentity = (
  document: { idNumber?: string | null; fullName?: string | null },
  profile: IdentityProfile,
): { ok: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (document.idNumber && profile.dni && normalizeDni(document.idNumber) !== normalizeDni(profile.dni)) {
    issues.push(`C.I. del PDF «${document.idNumber}» · perfil «${profile.dni}»`);
  }

  const documentTokens = normalizeForCompare(document.fullName ?? '').split(' ').filter(Boolean);
  const profileTokens = normalizeForCompare(`${profile.lastname ?? ''} ${profile.name ?? ''}`)
    .split(' ')
    .filter(Boolean);

  if (documentTokens.length && profileTokens.length) {
    const documentHasExtra = documentTokens.filter((token) => !profileTokens.includes(token));
    const profileHasExtra = profileTokens.filter((token) => !documentTokens.includes(token));
    const subset = documentHasExtra.length === 0 || profileHasExtra.length === 0;
    if (!subset) {
      const parts = [
        documentHasExtra.length ? `en el PDF sobra «${documentHasExtra.join(' ')}»` : '',
        profileHasExtra.length ? `en tu perfil aparece «${profileHasExtra.join(' ')}»` : '',
      ].filter(Boolean);
      issues.push(
        `Nombres PDF «${documentTokens.join(' ')}» · perfil «${profileTokens.join(' ')}» (${parts.join('; ')})`,
      );
    }
  }

  return { ok: issues.length === 0, issues };
};

// ---------------------------------------------------------------------------
// Reglas de elegibilidad
// ---------------------------------------------------------------------------

export interface EligibilityInput {
  transcript: TranscriptParseResult;
  pensum?: PensumParseResult | null;
  plan?: StudyPlanParseResult | null;
  profile: IdentityProfile;
  requestedTreatments?: string[];
  selectedSubjects?: Array<{ code?: string | null; name?: string | null; credits?: number | null }>;
  config: {
    minIA?: number;
    currentPeriod?: string;
    previousPeriod?: string;
    thresholds?: Partial<EligibilityThresholds>;
  };
}

const subjectsMatch = (left: { code?: string | null; name?: string | null }, right: { code?: string | null; name?: string | null }) => {
  if (left.code && right.code && normalizeForCompare(left.code) === normalizeForCompare(right.code)) return true;
  const leftName = normalizeForCompare(left.name ?? '');
  const rightName = normalizeForCompare(right.name ?? '');
  return Boolean(leftName && rightName && (leftName === rightName || leftName.includes(rightName) || rightName.includes(leftName)));
};

const isApproved = (
  transcript: TranscriptParseResult,
  subject: { code?: string | null; name?: string | null },
): boolean => {
  if (subject.code && transcript.approvedCodes.includes(subject.code)) return true;
  return transcript.records.some(
    (record) => record.grade >= passingGradeFor(transcript) && subjectsMatch(record, subject),
  );
};

/** Materias del pensum que todavía no aparecen aprobadas en la constancia. */
export const availableCourses = (
  pensum: PensumParseResult | null | undefined,
  transcript: TranscriptParseResult | null | undefined,
): PensumCourse[] => {
  if (!pensum) return [];
  if (!transcript) return pensum.courses;
  return pensum.courses.filter((course) => !isApproved(transcript, course));
};

export const evaluateEligibility = (input: EligibilityInput): EligibilityResult => {
  const { transcript, pensum, plan, profile, config } = input;
  const thresholds: EligibilityThresholds = { ...DEFAULT_ELIGIBILITY_THRESHOLDS, ...config.thresholds };
  const requestedTreatments = (input.requestedTreatments ?? [])
    .map(normalizeTreatment)
    .filter((value): value is string => Boolean(value));
  const selectedSubjects = input.selectedSubjects ?? [];
  const checkedRules: RuleResult[] = [];
  const warnings: string[] = [...transcript.warnings, ...(pensum?.warnings ?? []), ...(plan?.warnings ?? [])];

  const addRule = (
    ruleId: string,
    description: string,
    kind: RuleResult['kind'],
    operator: string,
    threshold: string | number | undefined,
    passed: boolean,
    detail: string,
    skipped = false,
  ) => {
    checkedRules.push({ ruleId, description, kind, operator, threshold, passed, skipped, detail });
  };

  const identity = compareIdentity(transcript, profile);
  addRule(
    'ID-DNI-01',
    'La C.I. de la constancia coincide con el solicitante',
    'identity',
    '=',
    profile.dni ?? 'perfil',
    identity.issues.filter((issue) => issue.startsWith('C.I.')).length === 0,
    identity.issues.filter((issue) => issue.startsWith('C.I.')).join('. ') || 'C.I. verificada',
  );
  addRule(
    'ID-NAME-01',
    'Los apellidos y nombres de la constancia coinciden con el perfil',
    'identity',
    'contains',
    `${profile.lastname ?? ''} ${profile.name ?? ''}`.trim(),
    identity.issues.filter((issue) => issue.startsWith('Nombres')).length === 0,
    identity.issues.filter((issue) => issue.startsWith('Nombres')).join('. ') || 'Identidad verificada',
  );

  if (plan) {
    const planIdentity = compareIdentity(
      { idNumber: plan.idNumber, fullName: `${plan.apellidos ?? ''} ${plan.nombres ?? ''}`.trim() },
      profile,
    );
    addRule(
      'ID-PLAN-01',
      'La identidad del plan de estudio coincide con el solicitante',
      'identity',
      '=',
      profile.dni ?? 'perfil',
      planIdentity.ok,
      planIdentity.ok ? 'Identidad del plan verificada' : planIdentity.issues.join('. '),
    );
  }

  const invalidGrades = transcript.records.filter((record) => record.invalidGrade);
  addRule(
    'DATA-GRADES-01',
    'Todas las notas están dentro de la escala declarada (00 es válida)',
    'grade',
    `0 <= nota <= ${transcript.scale.max}`,
    transcript.scale.max,
    invalidGrades.length === 0,
    invalidGrades.length
      ? `${invalidGrades.length} nota(s) fuera de escala: ${invalidGrades.map((item) => `${item.code} (${item.grade})`).join(', ')}`
      : `${transcript.records.length} nota(s) válidas`,
  );

  const minIA = Number(config.minIA ?? 0);
  addRule(
    'IA-MIN-01',
    'El índice académico alcanza el mínimo configurado',
    'index',
    '>=',
    minIA,
    minIA > 0 && transcript.ia !== null ? transcript.ia >= minIA : true,
    transcript.ia === null
      ? 'I.A. no disponible en la constancia'
      : `I.A. ${transcript.ia} ${minIA > 0 ? `(mínimo ${minIA})` : '(sin mínimo configurado)'}`,
    minIA <= 0 || transcript.ia === null,
  );

  if (plan) {
    addRule(
      'PER-PLAN-01',
      'El plan de estudio corresponde al período actual',
      'period',
      '=',
      config.currentPeriod ?? 'actual',
      Boolean(config.currentPeriod) && plan.period === config.currentPeriod,
      `Plan ${plan.period ?? 'sin período'} · actual ${config.currentPeriod ?? 'no configurado'}`,
      !config.currentPeriod,
    );
  }

  if (plan && pensum) {
    const missing = plan.courses.filter((course) => !pensum.courses.some((item) => item.code === course.code));
    const mismatches = plan.courses.filter((course) => {
      const pensumCourse = pensum.courses.find((item) => item.code === course.code);
      return (
        pensumCourse &&
        (pensumCourse.credits !== course.credits || !subjectsMatch(pensumCourse, course))
      );
    });
    addRule(
      'PEN-PLAN-01',
      'Las materias del plan existen en el pensum con nombre y U.C. compatibles',
      'plan',
      'exists',
      pensum.courses.length,
      missing.length === 0 && mismatches.length === 0,
      missing.length
        ? `No están en el pensum: ${missing.map((item) => item.code).join(', ')}`
        : mismatches.length
          ? `Nombre/U.C. distintos: ${mismatches.map((item) => item.code).join(', ')}`
          : `${plan.courses.length} materia(s) verificadas`,
    );
  }

  if (plan && requestedTreatments.length) {
    const declared = new Set(plan.courses.map((course) => course.treatment).filter(Boolean));
    const undeclared = requestedTreatments.filter((treatment) => !declared.has(treatment));
    addRule(
      'TRAT-PLAN-01',
      'El plan declara el tratamiento solicitado',
      'plan',
      'contains',
      requestedTreatments.join(' | '),
      undeclared.length === 0,
      undeclared.length
        ? `Faltan tratamientos en el plan: ${undeclared.join(', ')}`
        : `Tratamientos declarados: ${requestedTreatments.join(', ')}`,
    );
  }

  if (plan && selectedSubjects.length && requestedTreatments.length) {
    const wrongTreatment = selectedSubjects.filter((subject) => {
      const planRow = plan.courses.find((course) => subjectsMatch(course, subject));
      return !planRow || !planRow.treatment || !requestedTreatments.includes(planRow.treatment);
    });
    addRule(
      'TRAT-SEL-01',
      'Cada materia elegida tiene el tratamiento solicitado en su fila del plan',
      'subject',
      '=',
      requestedTreatments.join(' | '),
      wrongTreatment.length === 0,
      wrongTreatment.length
        ? `Sin tratamiento válido en el plan: ${wrongTreatment.map((item) => item.code ?? item.name ?? '?').join(', ')}`
        : `${selectedSubjects.length} materia(s) con tratamiento válido`,
    );
  }

  if (selectedSubjects.length) {
    const alreadyApproved = selectedSubjects.filter((subject) => isApproved(transcript, subject));
    addRule(
      'APR-SEL-01',
      'Las materias aprobadas no se reinscriben',
      'subject',
      'not in',
      'materias aprobadas',
      alreadyApproved.length === 0,
      alreadyApproved.length
        ? `Ya aprobadas: ${alreadyApproved.map((item) => item.code ?? item.name ?? '?').join(', ')}`
        : 'Sin materias aprobadas en la selección',
    );
  }

  const approvedUC = transcript.totals.uc ??
    transcript.records
      .filter((record) => record.grade >= passingGradeFor(transcript) && !record.invalidGrade)
      .reduce((total, record) => total + record.credits, 0);
  const previousPeriod = config.previousPeriod ?? '';
  const previousRecords = previousPeriod
    ? transcript.records.filter((record) => record.period === previousPeriod)
    : [];
  const previousAllApproved = previousRecords.length > 0 &&
    previousRecords.every((record) => record.grade >= passingGradeFor(transcript));
  const previousDetail = previousRecords.length
    ? previousRecords
        .filter((record) => record.grade < passingGradeFor(transcript))
        .map((record) => `${record.code} (${record.grade})`)
        .join(', ') || `${previousRecords.length} materia(s) aprobadas en ${previousPeriod}`
    : `Sin cargas registradas en ${previousPeriod || 'el período anterior'}`;

  const pensumUC = pensum?.courses.reduce((total, course) => total + course.credits, 0) ?? 0;
  const planUC = plan?.courses.reduce((total, course) => total + course.credits, 0) ?? 0;

  const prereqCodesForSelection = (): string[] => {
    if (!pensum) return [];
    return pensum.courses
      .filter((course) => selectedSubjects.some((subject) => subjectsMatch(course, subject)))
      .flatMap((course) => course.prerequisites);
  };
  const prerequisitesApproved = (codes: string[]): boolean =>
    codes.every((code) => transcript.approvedCodes.includes(code));

  for (const treatment of requestedTreatments) {
    if (treatment === 'EXTRACREDITOS') {
      addRule('EXT-UC-01', 'Más de 80 U.C. aprobadas', 'credits', '>', thresholds.extracreditosUC,
        approvedUC > thresholds.extracreditosUC, `${approvedUC} U.C. aprobadas`);
      addRule('EXT-IA-01', 'I.A. >= mínimo global', 'index', '>=', minIA,
        transcript.ia !== null && transcript.ia >= minIA, `I.A. ${transcript.ia ?? 'N/D'} · mínimo ${minIA}`);
      addRule('EXT-PLAN-01', 'El plan declara Extracréditos', 'plan', 'contains', 'EXTRACREDITOS',
        Boolean(plan?.courses.some((course) => course.treatment === 'EXTRACREDITOS')),
        plan ? 'Revisado en el plan de estudio' : 'Plan de estudio no cargado', !plan);
    }

    if (treatment === 'PARALELO') {
      addRule('PAR-UC-01', 'Más de 120 U.C. aprobadas', 'credits', '>', thresholds.paraleloUC,
        approvedUC > thresholds.paraleloUC, `${approvedUC} U.C. aprobadas`);
      addRule('PAR-PER-01', 'Toda la carga del período regular anterior está aprobada', 'grade', 'all approved',
        previousPeriod || 'anterior', previousAllApproved, previousDetail);
    }

    if (treatment === 'PROYECTO DE GRADO I') {
      addRule('PG1-UC-01', 'Al menos 143 U.C. aprobadas', 'credits', '>=', thresholds.proyectoGradoIUC,
        approvedUC >= thresholds.proyectoGradoIUC, `${approvedUC} U.C. aprobadas`);
      const pg1Rows = plan?.courses.filter((course) => course.treatment === 'PROYECTO DE GRADO I') ?? [];
      addRule('PG1-PLAN-01', 'El plan declara Proyecto de Grado I', 'plan', 'contains', 'PROYECTO DE GRADO I',
        pg1Rows.length > 0, pg1Rows.length ? `${pg1Rows.length} fila(s) con el tratamiento` : 'Sin filas con el tratamiento', !plan);
      const pg1Unapproved = pg1Rows.filter((course) => !isApproved(transcript, course));
      addRule('PG1-PLAN-02', 'Las asignaturas de Proyecto de Grado I están aprobadas', 'grade', 'all approved',
        'plan PG1', pg1Rows.length > 0 && pg1Unapproved.length === 0,
        pg1Unapproved.length ? `Pendientes: ${pg1Unapproved.map((item) => item.code).join(', ')}` : `${pg1Rows.length} materia(s) aprobadas`,
        pg1Rows.length === 0);
    }

    if (treatment === 'EXAMEN EXTRAORDINARIO') {
      addRule('EE-UC-01', 'Más de un tercio del pensum aprobado', 'credits', '>',
        Number(thresholds.examenExtraordinarioPensumFraction.toFixed(3)), pensumUC > 0 && approvedUC > pensumUC * thresholds.examenExtraordinarioPensumFraction,
        `${approvedUC} de ${pensumUC} U.C. del pensum`, !pensum);
      addRule('EE-PER-01', 'Toda la carga del período anterior está aprobada', 'grade', 'all approved',
        previousPeriod || 'anterior', previousAllApproved, previousDetail);
      addRule('EE-IA-01', 'I.A. >= mínimo global', 'index', '>=', minIA,
        transcript.ia !== null && transcript.ia >= minIA, `I.A. ${transcript.ia ?? 'N/D'} · mínimo ${minIA}`);
    }

    if (treatment === 'INSCRIPCION ESPECIAL') {
      addRule('IE-UC-01', 'Menos de 9 U.C. inscritas en el período actual', 'credits', '<',
        thresholds.inscripcionEspecialMaxUC, planUC > 0 && planUC < thresholds.inscripcionEspecialMaxUC,
        `${planUC || selectedSubjects.reduce((total, item) => total + (item.credits ?? 0), 0)} U.C. inscritas`,
        !plan && selectedSubjects.length === 0);
      const prerequisiteCodes = prereqCodesForSelection();
      addRule('IE-PRE-01', 'Las prelaciones de las materias elegidas están aprobadas', 'prerequisite',
        'all approved', prerequisiteCodes.join(', ') || 'sin prelaciones por código',
        prerequisitesApproved(prerequisiteCodes),
        prerequisiteCodes.length
          ? prerequisiteCodes.filter((code) => !transcript.approvedCodes.includes(code)).join(', ') || 'Todas aprobadas'
          : 'Las prelaciones del pensum son referencias por texto; no se puede verificar por código',
        prerequisiteCodes.length === 0);
    }

    if (treatment === 'ULTIMO SEMESTRE') {
      const pg2 = pensum?.courses.find(
        (course) => course.code === 'PG0083' || normalizeForCompare(course.name).includes('PROYECTO DE GRADO II'),
      );
      const pg2Approved = Boolean(pg2 && isApproved(transcript, pg2));
      addRule('US-PG2-01', 'Proyecto de Grado II aprobado', 'grade', 'approved', 'PG0083', pg2Approved,
        pg2 ? `${pg2.code} ${isApproved(transcript, pg2) ? 'aprobada' : 'no aprobada'}` : 'No encontrado en el pensum',
        !pensum);
      const prerequisiteCodes = prereqCodesForSelection();
      addRule('US-PRE-01', 'Las prelaciones de las materias elegidas están aprobadas', 'prerequisite',
        'all approved', prerequisiteCodes.join(', ') || 'sin prelaciones por código',
        prerequisitesApproved(prerequisiteCodes),
        prerequisiteCodes.length
          ? prerequisiteCodes.filter((code) => !transcript.approvedCodes.includes(code)).join(', ') || 'Todas aprobadas'
          : 'Sin prelaciones por código para la selección',
        prerequisiteCodes.length === 0);
    }
  }

  const failed = checkedRules.filter((rule) => !rule.passed);
  return {
    isEligible: failed.length === 0,
    checkedRules,
    reasons: failed.map((rule) => `${rule.ruleId}: ${rule.description}. ${rule.detail}`),
    warnings,
  };
};
