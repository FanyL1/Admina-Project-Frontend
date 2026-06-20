'use client';

import * as React from 'react';
import { Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';


// Estructura limpia para el backend
export interface ExtractedStudentData {
  promedio?: number | null;
  uc?: number | null;
  cohorte?: string | null;
  isLiso?: boolean | null;
}

interface PromedioExtractorProps {
  requirementsRules: {
    promedio?: number | null;
    UC?: number | null;
    cohorte?: string | boolean | null;
    liso?: string | null;
  };
  cedula: string;
  onDataExtraida: (data: ExtractedStudentData) => void;
  onDNIextraido: (dni: string) => void; 
}

export const PromedioExtractor = ({ requirementsRules, cedula, onDataExtraida, onDNIextraido }: PromedioExtractorProps) => {
  const [loadingPdf, setLoadingPdf] = React.useState(false);
  const [errorExtractor, setErrorExtractor] = React.useState('');
  const [extractedData, setExtractedData] = React.useState<ExtractedStudentData | null>(null);

  const { promedio: reqPromedio, UC: reqUC, cohorte: reqCohorte, liso: reqLiso } = requirementsRules;

  const necesitaValidacion = (reqPromedio && reqPromedio > 0) || reqUC || reqCohorte || reqLiso;

  // 💡 SOLUCIÓN ALTERNATIVA PARA EL WORKER: Asegurar que se asigne correctamente en el cliente
// 💡 Solución: Usar la propiedad estándar 'import.meta.url'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecciona un archivo PDF válido.');
      return;
    }

    setLoadingPdf(true);
    setErrorExtractor('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Intentar cargar el documento de manera segura
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let textoCompleto = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .filter((item: any) => item && typeof item.str === 'string')
          .map((item: any) => item.str)
          .join(' ');
          
        textoCompleto += pageText + ' ';
      }

      // 1. EXTRAER CÉDULA
      const regexCedula = /(?:c\.i\.|cedula)\s*[:\.-]?\s*([0-9]{7,8})/i;
      const matchCedula = textoCompleto.match(regexCedula);
      if (matchCedula && matchCedula[1]) {
        onDNIextraido(matchCedula[1]);
      }

      const resultadoBackend: ExtractedStudentData = {};

      // 2. EXTRAER PROMEDIO (I.A)
      if (reqPromedio && reqPromedio > 0) {
        const regexPromedio = /I\.A\.?\s*\d+\s*\|\s*\d+\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)/i;
        const matchPromedio = textoCompleto.match(regexPromedio);
        resultadoBackend.promedio = matchPromedio && matchPromedio[1] 
          ? parseFloat(matchPromedio[1].replace(',', '.')) 
          : null;
      }

      // 3. EXTRAER UNIDADES DE CRÉDITO (U.A)
      if (reqUC && reqUC > 0) {
        const regexUC = /\b([0-9]+)\s*\|\s*[0-9]+/i;
        const matchUC = textoCompleto.match(regexUC);
        resultadoBackend.uc = matchUC && matchUC[1] ? parseInt(matchUC[1], 10) : null;
      }

      // 4. EXTRAER COHORTE
      if (reqCohorte === true || reqCohorte === 'true') {
        const regexCohorte = /COHORTE\s*:\s*([0-9]{4})/i;
        const matchCohorte = textoCompleto.match(regexCohorte);
        resultadoBackend.cohorte = matchCohorte && matchCohorte[1] ? matchCohorte[1].trim() : null;
      }

      // 5. EVALUAR SI ESTÁ LISO
      if (reqLiso && reqLiso !== 'No aplica') {
        const regexPeriodos = /Per[ií]odo\s+([0-9]{5})/gi;
        const todosLosPeriodos = [...textoCompleto.matchAll(regexPeriodos)].map(m => m[1]);
        const periodosRegulares = todosLosPeriodos.filter(p => !p.endsWith('3'));
        
        if (periodosRegulares.length > 0) {
          const ultimoPeriodoRegular = periodosRegulares[periodosRegulares.length - 1];
          const indexInicio = textoCompleto.lastIndexOf(`Período ${ultimoPeriodoRegular}`);
          const textoUltimoSemestre = textoCompleto.substring(indexInicio);

          const regexNotasReprobadas = /\b(0[0-5])\b/;
          resultadoBackend.isLiso = !regexNotasReprobadas.test(textoUltimoSemestre);
        } else {
          resultadoBackend.isLiso = true;
        }
      }

      if (reqPromedio && reqPromedio > 0 && !resultadoBackend.promedio) {
        setErrorExtractor('No se pudo leer el promedio general (I.A) en el documento.');
        return;
      }

      setExtractedData(resultadoBackend);
      onDataExtraida(resultadoBackend); 
      
    } catch (err) {
      // 💡 Esto imprimirá en la consola de tu navegador el motivo exacto del fallo
      console.error("🔴 ERROR DETALLADO DE PDF.JS:", err);
      toast.error('Error al procesar el archivo PDF.');
    } finally {
      setLoadingPdf(false);
    }
  };

  if (!necesitaValidacion) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ fontSize: '15px' }} color="text.secondary">
          <strong>Validación de Requisitos Académicos</strong>
        </Typography>

        <Button 
          variant="outlined" 
          component="label" 
          startIcon={loadingPdf ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
          disabled={loadingPdf}
        >
          {loadingPdf ? 'Analizando documento...' : 'Cargar Constancia de Notas'}
          <input hidden type="file" accept="application/pdf" onChange={handleFileChange} />
        </Button>
      </Box>
     
      {errorExtractor && (
        <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600, color: 'error.main' }}>
          {errorExtractor}
        </Typography>
      )}

      {extractedData && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, bgcolor: '#fbfbfb', p: 1.5, borderRadius: 2 }}>
          {cedula ? (
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600, color: 'error.main' }}>
              {cedula}
            </Typography>
          ) : (
            <>
              {extractedData.promedio !== undefined && (
                <Typography variant="body2" color={extractedData.promedio! >= reqPromedio! ? 'success.main' : 'error.main'}>
                  • Promedio: <strong>{extractedData.promedio ?? 'No detectado'} pts</strong> {extractedData.promedio! >= reqPromedio! ? '(Cumple)' : `(Requerido: ${reqPromedio})`}
                </Typography>
              )}
              
              {extractedData.uc !== undefined && (
                <Typography variant="body2" color={extractedData.uc! >= reqUC! ? 'success.main' : 'error.main'}>
                  • U.C. Aprobadas: <strong>{extractedData.uc ?? 'No detectado'}</strong> {extractedData.uc! >= reqUC! ? '(Cumple)' : `(Requeridas: ${reqUC})`}
                </Typography>
              )}
              
              {extractedData.cohorte !== undefined && (
                <Typography variant="body2" color="text.primary">
                  • Periodo de Ingreso: <strong>{extractedData.cohorte ?? 'No detectado'}</strong>
                </Typography>
              )}
              
              {extractedData.isLiso !== undefined && (
                <Typography variant="body2" color={extractedData.isLiso ? 'success.main' : 'warning.main'}>
                  • Condición de Rendimiento: <strong>{extractedData.isLiso ? 'Semestre anterior invicto (Liso)' : 'Posee materias reprobadas'}</strong>
                </Typography>
              )}
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};