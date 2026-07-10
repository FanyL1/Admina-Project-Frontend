import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAcademicPeriod } from '../Dashboard/utils';
import { StudentRequestData, OnlyNameData, ProcedureTypeData } from '@/app/type'; 
// ==========================================================================
// Tus interfaces reales de la base de datos
// ==========================================================================

interface CriteriosFiltro {
  periodo: string;
  categoria: string; // Filtrará por Nombre de la Carrera
  tipoTramite: string; // Filtrará por Nombre del Procedimiento
}

export const filtrarYExportarPDF = (todasLasSolicitudes: StudentRequestData[], filtros: CriteriosFiltro) => {
  
  // 1. FILTRAR EN MEMORIA: Adaptado a las propiedades de StudentRequestData
  const solicitudesFiltradas = todasLasSolicitudes.filter((solicitud) => {
    // Extraer valores resolviendo posibles nulos de los objetos anidados
    const periodoRequest = getAcademicPeriod(solicitud.created_at) || "";
    const tramiteRequest = solicitud.type_procedure?.name || "";

    const cumplePeriodo = filtros.periodo === "" || periodoRequest === filtros.periodo;
    const cumpleTramite = filtros.tipoTramite === "" || tramiteRequest === filtros.tipoTramite;
    
    return cumplePeriodo && cumpleTramite;
  });

  // Validar si el filtro resultó vacío
  if (solicitudesFiltradas.length === 0) {
    alert("No se encontraron solicitudes que coincidan con los criterios seleccionados.");
    return;
  }

  // 2. CONFIGURAR jspdf (Horizontal / Landscape)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Encabezado del documento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(43, 54, 76);
  doc.text("ADMINA - REPORTE DE SOLICITUDES ACADÉMICAS", 14, 15);

  // Subtítulo con los filtros usados
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  const textoFiltros = `Filtros aplicados -> Período: ${filtros.periodo || 'Todos'} | Carrera: INGENIERIA EN INFORMATICA - INGENIERIA DE SISTEMAS (SAN JUAN DE LOS MORROS) | Trámite: ${filtros.tipoTramite || 'Todos'}`;
  doc.text(textoFiltros, 14, 22);
  doc.text(`Total registros: ${solicitudesFiltradas.length} | Fecha: ${new Date().toLocaleDateString()}`, 14, 27);

  const tieneUC = solicitudesFiltradas.some(s => s.additionalData?.UC !== null && s.additionalData?.UC !== undefined);
  const tieneCohorte = solicitudesFiltradas.some(s => s.additionalData?.cohorte !== null && s.additionalData?.cohorte !== undefined);
  const tienePromedio = solicitudesFiltradas.some(s => s.additionalData?.promedio !== null && s.additionalData?.promedio !== undefined);
  const tieneMateria = solicitudesFiltradas.some(s => s.additionalData?.materia !== null && s.additionalData?.materia !== undefined);
  const tieneCondicion = solicitudesFiltradas.some(s => s.additionalData?.conditionLiso !== null && s.additionalData?.conditionLiso !== undefined);

  // 3. COLUMNAS DE LA TABLA (Nombres de columnas más descriptivos)
  const baseHeaders = ["ID TRÁMITE", "ESTUDIANTE", "CEDULA", "FECHA DE SOLICITUD", "ESTADO"];

  if (tieneUC) baseHeaders.push("UC");
  if (tieneCohorte) baseHeaders.push("COHORTE");
  if (tieneMateria) baseHeaders.push("MATERIA");
  if (tienePromedio) baseHeaders.push("PROMEDIO");
  if (tieneCondicion) baseHeaders.push("CONDICIÓN LISO");

  const headers = [baseHeaders];

  // 4. MAPEAR FILAS Y RECORTE DEL UUID (split)
  const rows = solicitudesFiltradas.map((solicitud) => {
    // REQUISITO CRÍTICO: Tomar solo el primer tramo antes del guion '-' del UUID
    const idCorto = solicitud.id ? solicitud.id.split('-')[0].toUpperCase() : 'N/A';
    
    // Obtener el nombre del estudiante de forma segura
    const estudiantename = 
    solicitud.createByname && solicitud.createByname !== 'No Aplica'
        ? solicitud.createByname 
        : (solicitud.user?.name || "No registrado");

    const estudiantelastname = 
    solicitud.createByname && solicitud.createByname !== 'No Aplica'
        ? "" 
        : (solicitud.user?.lastname || "");

    const estudiante = `${estudiantename} ${estudiantelastname}`.trim();
    
    const dni = solicitud.createByDNI && solicitud.createByDNI !== '0'
        ? solicitud.createByDNI
        : (solicitud.user?.dni || "N/A")

    const fecha = solicitud.created_at ? new Date(solicitud.created_at).toLocaleDateString() : 'N/A';
    const estado = solicitud.status || 'Pendiente';

    // Fila base con las celdas estándar
    const fila: string[] = [idCorto, estudiante, dni, fecha, estado];

    if (tieneUC) {
      fila.push(solicitud.additionalData?.UC?.toString() || 'N/A');
    }
    if (tieneCohorte) {
      fila.push(solicitud.additionalData?.cohorte?.toString() || 'N/A');
    }
    if (tieneMateria) {
      fila.push(solicitud.additionalData?.materia?.toString() || 'N/A');
    }
    if (tienePromedio) {
      fila.push(solicitud.additionalData?.promedio?.toString() || 'N/A');
    }
    if (tieneCondicion) {
      // Formateamos el booleano de manera amigable para el reporte
      const cond = solicitud.additionalData?.conditionLiso;
      fila.push(cond === true ? 'Sí' : cond === false ? 'No' : 'N/A');
    }

    return fila;
  });

  // 5. RENDERIZAR TABLA CON JS-PDF
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 32,
    theme: 'striped',
    headStyles: { fillColor: [43, 54, 76], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [33, 37, 41] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
        const pageString = `Página ${doc.internal.pages.length - 1}`; 
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(pageString, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  // 6. DESCARGAR ARCHIVO
  doc.save(`reporte_solicitudes_${Date.now()}.pdf`);
};