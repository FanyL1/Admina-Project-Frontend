import * as React from 'react';
import { Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PromedioExtractorProps {
  promedioMin: number | null;
  cedula: string;
  onPromedioExtraido: (promedio: number) => void;
  onDNIextraido: (dni: string) => void; 
}

export const PromedioExtractor = ({ promedioMin, cedula, onPromedioExtraido, onDNIextraido }: PromedioExtractorProps) => {
  const [loadingPdf, setLoadingPdf] = React.useState(false);
  const [promedioStudent, setPromedioStudent] = React.useState<number | null>(null);
  const [errorExtractor, setErrorExtractor] = React.useState('');

  if (promedioMin == null) {
    promedioMin = 0;
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecciona un archivo PDF válido.');
      return;
    }

    setLoadingPdf(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoCompleto = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        textoCompleto += pageText + ' ';
      }

      // Regex flexible para capturar el patrón de promedios (ej: "Promedio: 15.4" o "Promedio 16,50")
    const regexPromedio = /I\.A\.?\s*\d+\s*\|\s*\d+\s*([0-9]{1,2}(?:[.,][0-9]{1,2})?)/i;    
    const match = textoCompleto.match(regexPromedio);
    const regexCedula = /(?:c\.i\.|cedula)(?:\s*de\s*identidad)?\s*[:\.-]?\s*([0-9]{7,8})/i;
    const matchCedula = textoCompleto.match(regexCedula);

    if (matchCedula && matchCedula[1]) {
        const DNIDetect = matchCedula[1];
        onDNIextraido(DNIDetect);
    }


    if (match && match[1]) {
        const valorNumerico = parseFloat(match[1].replace(',', '.'));
        setPromedioStudent(valorNumerico);
        onPromedioExtraido(valorNumerico); // Le enviamos el valor de vuelta a la página principal
        setErrorExtractor('')
    } else {
        setErrorExtractor('No se pudo leer el promedio, revise que sea el documento correcto');
    }

      
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ fontSize: '15px' }} color="text.secondary">
          <strong>Promedio mínimo para optar por el trámite:</strong>{' '}
          {promedioMin === 0 ? 'No aplica' : promedioMin}
        </Typography>

        {/* Tu estilo exacto de Botón */}
        {promedioMin > 0 && <Button 
            variant="outlined" 
            component="label" 
            startIcon={loadingPdf ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
            disabled={loadingPdf}
            >
            {loadingPdf ? 'Leyendo documento...' : 'Cargar Constancia de Notas del Solicitante'}
            <input
                hidden
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
            />
        </Button>}
        
      </Box>
     
      {errorExtractor !== '' && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: 'error.main' 
          }}
        >
            {errorExtractor}
        </Typography>
      )}

      {/* Feedback visual para el Estudinate */}
      {promedioStudent !== null && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color:( promedioMin === 0 || promedioStudent >= promedioMin ) && cedula == '' ? 'success.main' : 'error.main' 
          }}
        >
          {cedula === '' ? `Tu promedio detectado: ${promedioStudent} ` : cedula}
          { cedula !== '' ? '' : (promedioMin !== 0 && promedioStudent < promedioMin
            ? '(No cumples con el promedio mínimo requerido para este trámite)' 
            : '(Cumple con el requisito)')}
        </Typography>
      )}
    </Paper>
  );
};