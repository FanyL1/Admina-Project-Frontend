import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  availableCourses,
  compareIdentity,
  currentAcademicPeriod,
  evaluateEligibility,
  normalizePeriod,
  parsePensum,
  parseStudyPlan,
  parseTranscript,
  previousRegularPeriod,
} from '../app/lib/academicPdf.ts';

const fixture = (name: string) =>
  readFile(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

test('pensum: semestres "N Semestre", filas partidas y códigos cortos', async () => {
  const result = parsePensum(await fixture('pensum.txt'));

  assert.ok(result.courses.length >= 45, `se esperaban >=45 materias, se obtuvieron ${result.courses.length}`);
  assert.equal(result.career, 'INGENIERIA EN INFORMATICA');

  const semesters = new Set(result.courses.map((course) => course.semester));
  for (let semester = 1; semester <= 10; semester += 1) {
    assert.ok(semesters.has(semester), `falta el semestre ${semester}`);
  }

  for (const code of ['EL', 'EA', 'IMEV', 'IMEIV', 'IS8424']) {
    assert.ok(result.courses.some((course) => course.code === code), `falta el código ${code}`);
  }

  const splitRow = result.courses.find((course) => course.code === 'IME520');
  assert.equal(splitRow?.name, 'ELECTIVA II (LEGISLACION INFORMATICA)');
  assert.equal(splitRow?.semester, 3);
  assert.equal(splitRow?.credits, 2);

  const withInternalPrefix = result.courses.find((course) => course.code === 'FC0001');
  assert.equal(withInternalPrefix?.name, 'FORMACION CONSTITUCIONAL');
  assert.equal(withInternalPrefix?.credits, 2);

  assert.ok(result.courses.every((course) => course.credits >= 1 && course.credits <= 12));
  assert.ok(result.courses.every((course) => course.name.length > 2));
});

test('pensum: encabezados y filas partidas no generan advertencias de U.C.', () => {
  const text = [
    'JUEVES, 19 DE NOVIEMBRE DE 2026',
    'PENSUM DE ESTUDIOS DE INGENIERIA EN INFORMATICA',
    'CÓD. ASIGNATURA HORAS TEÓRICAS PRÁCTICAS SEMANALES U.C PRELACIONES',
    '4 Semestre',
    '(1497) IME720 (229) ELECTIVA III (MANTENIMIENTO',
    'DEL COMPUTADOR) 0 21 21 2 (571) ELECTIVA II (LEGISLACION INFORMATICA)',
  ].join('\n');

  const result = parsePensum(text);

  assert.ok(
    !result.warnings.some((warning) => warning.includes('No se pudieron leer los U.C.')),
    `warnings inesperados: ${result.warnings.join(' | ')}`,
  );
  const row = result.courses.find((course) => course.code === 'IME720');
  assert.equal(row?.name, 'ELECTIVA III (MANTENIMIENTO DEL COMPUTADOR)');
  assert.equal(row?.credits, 2);
});

test('pensum: fila partida con orden de líneas distinto (pdf.js)', () => {
  const text = [
    '3 Semestre',
    '(1201) IC3323 (679) ALGORITMOS II 0 14 14 3 (40) ALGORITMOS I',
    '(350) IME520',
    '(571) ELECTIVA II (LEGISLACION',
    'INFORMATICA) 0 57 57 2 (656) ELECTIVA I (CONDUCTA HUMANA)',
  ].join('\n');

  const result = parsePensum(text);
  const splitRow = result.courses.find((course) => course.code === 'IME520');
  assert.equal(splitRow?.name, 'ELECTIVA II (LEGISLACION INFORMATICA)');
  assert.equal(result.courses.find((course) => course.code === 'IC3323')?.name, 'ALGORITMOS II');
});

test('constancia: identidad, escala, períodos, notas 00 y I.A. en tabla', async () => {
  const result = parseTranscript(await fixture('constancia.txt'));

  assert.equal(result.idNumber, '00000000');
  assert.equal(result.fullName, 'PrimerApellido SegundoApellido PrimerNombre SegundoNombre');
  assert.equal(result.cohorte, '2022');
  assert.deepEqual(result.scale, { min: 1, max: 10, passing: 6, declared: true });
  assert.ok(result.periods.includes('2026-1'));
  assert.ok(result.periods.includes('2022-2'));
  assert.ok(result.periods.every((period) => /^\d{4}-[1-3]$/.test(period)));

  assert.equal(result.ia, 8.54, 'no debe capturar 17 de 178');
  assert.equal(result.totals.ua, 178);
  assert.equal(result.totals.uc, 178);
  assert.ok(result.records.length >= 50);
  assert.ok(result.records.every((record) => record.period));
  assert.ok(result.approvedCodes.includes('EA'));
  assert.ok(result.approvedCodes.includes('IMEV'));
  assert.ok(result.approvedCodes.includes('IMEIV'));
  assert.equal(result.isLiso, true);

  const shortCode = result.records.find((record) => record.code === 'EA');
  assert.equal(shortCode?.subject, 'ELECTIVA DE AREA I');
  assert.equal(shortCode?.grade, 9);
});

test('constancia: conserva nota 00 como evidencia de materia raspada', () => {
  const text = [
    'C.I.: 12345678 - Perez Lopez Maria',
    'Escala de medición: 1-10 Calificación mínima aprobatoria: 6',
    'COD.MATERIA NOMBRE MATERIA U.C NOTA',
    'Período 20261',
    'IS8424 SISTEMAS DE INFORMACION III 5 00',
    'I.A: 7.10',
  ].join('\n');

  const result = parseTranscript(text);
  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].grade, 0);
  assert.equal(result.records[0].invalidGrade, false);
  assert.equal(result.approvedCodes.includes('IS8424'), false);
  assert.equal(result.ia, 7.1);
});

test('plan: tratamiento por fila y PROYECTO DE GRADO II como materia', async () => {
  const result = parseStudyPlan(await fixture('plan.txt'));

  assert.equal(result.idNumber, '31415658');
  assert.equal(result.apellidos, 'Vásquez Sanchez');
  assert.equal(result.nombres, 'Rafael Andres');
  assert.equal(result.period, '2026-2');
  assert.equal(result.courses.length, 6);

  const elective = result.courses.find((course) => course.code === 'EL');
  assert.equal(elective?.name, 'ELECTIVA LIBRE II');
  assert.equal(elective?.treatment, 'EXTRACREDITOS');

  const pg2 = result.courses.find((course) => course.code === 'PG0083');
  assert.equal(pg2?.name, 'PROYECTO DE GRADO II');
  assert.equal(pg2?.treatment, null, 'PROYECTO DE GRADO II es materia, no tratamiento');

  assert.ok(result.courses.filter((course) => course.treatment === null).length === 5);
});

test('identidad: tolera tildes/mayúsculas/segundo nombre ausente y detecta tokens distintos', () => {
  const profile = { dni: '31415658', name: 'Rafael Andres', lastname: 'Vásquez Sanchez' };

  assert.equal(
    compareIdentity(
      { idNumber: '0031415658', fullName: 'VASQUEZ SANCHEZ RAFAEL' },
      profile,
    ).ok,
    true,
  );

  const mismatch = compareIdentity(
    { idNumber: '99999999', fullName: 'VASQUEZ GONZALEZ RAFAEL' },
    profile,
  );
  assert.equal(mismatch.ok, false);
  assert.match(mismatch.issues.join(' '), /C\.I\./);
  assert.match(mismatch.issues.join(' '), /en el PDF sobra «GONZALEZ»/);
  assert.match(mismatch.issues.join(' '), /en tu perfil aparece «SANCHEZ ANDRES»/);
});

test('períodos: normalización compacta y período regular anterior', () => {
  assert.equal(normalizePeriod('20261'), '2026-1');
  assert.equal(normalizePeriod('20262'), '2026-2');
  assert.equal(normalizePeriod('2026-1'), '2026-1');
  assert.equal(previousRegularPeriod('2026-2'), '2026-1');
  assert.equal(previousRegularPeriod('2026-1'), '2025-2');
  assert.match(currentAcademicPeriod(new Date('2026-11-22')), /^2026-2$/);
});

test('elegibilidad: nota 00 en período anterior bloquea PAR-PER-01', async () => {
  const transcript = parseTranscript(await fixture('constancia.txt'));
  const plan = parseStudyPlan(await fixture('plan.txt'));
  transcript.records.push({
    code: 'IS0222',
    subject: 'INFORMATICA EDUCATIVA',
    grade: 0,
    credits: 3,
    period: '2026-1',
    enrolled: true,
  });

  const result = evaluateEligibility({
    transcript,
    plan,
    profile: { dni: '00000000', name: 'PrimerNombre SegundoNombre', lastname: 'PrimerApellido SegundoApellido' },
    requestedTreatments: ['PARALELO'],
    config: { minIA: 7, currentPeriod: '2026-2', previousPeriod: '2026-1' },
  });

  const previousPeriodRule = result.checkedRules.find((rule) => rule.ruleId === 'PAR-PER-01');
  assert.equal(previousPeriodRule?.passed, false);
  assert.match(previousPeriodRule?.detail ?? '', /IS0222 \(0\)/);
  assert.equal(result.isEligible, false);
  assert.ok(result.reasons.some((reason) => reason.includes('PAR-PER-01')));
});

test('elegibilidad: materia aprobada se oculta y tratamiento incorrecto se rechaza', async () => {
  const transcript = parseTranscript(await fixture('constancia.txt'));
  const pensum = parsePensum(await fixture('pensum.txt'));
  const plan = parseStudyPlan(await fixture('plan.txt'));

  const choices = availableCourses(pensum, transcript);
  assert.equal(choices.some((course) => course.code === 'EA'), false, 'EA ya aprobada no debe aparecer');
  assert.equal(choices.some((course) => course.code === 'IMEV'), false);
  assert.equal(choices.some((course) => course.code === 'EL'), true);

  const result = evaluateEligibility({
    transcript,
    pensum,
    plan,
    profile: { dni: '00000000', name: 'PrimerNombre SegundoNombre', lastname: 'PrimerApellido SegundoApellido' },
    requestedTreatments: ['PARALELO'],
    selectedSubjects: [{ code: 'EL', name: 'ELECTIVA LIBRE II', credits: 3 }],
    config: { minIA: 8, currentPeriod: '2026-2', previousPeriod: '2026-1' },
  });

  const treatmentRule = result.checkedRules.find((rule) => rule.ruleId === 'TRAT-SEL-01');
  assert.equal(treatmentRule?.passed, false, 'EL tiene EXTRACREDITOS en el plan, no PARALELO');

  const accepted = evaluateEligibility({
    transcript,
    pensum,
    plan,
    profile: { dni: '00000000', name: 'PrimerNombre SegundoNombre', lastname: 'PrimerApellido SegundoApellido' },
    requestedTreatments: ['EXTRACREDITOS'],
    selectedSubjects: [{ code: 'EL', name: 'ELECTIVA LIBRE II', credits: 3 }],
    config: { minIA: 8, currentPeriod: '2026-2', previousPeriod: '2026-1' },
  });
  assert.equal(accepted.checkedRules.find((rule) => rule.ruleId === 'TRAT-SEL-01')?.passed, true);
});
