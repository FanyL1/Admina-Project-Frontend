import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useGetAllUsers } from '@/app/(auth)/(management)/managementUser/usePage';
import { StudentRequestData } from '@/app/type';

// Definir los estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    color: '#333333',
    fontFamily: 'Helvetica',
  },
  // Membrete / Encabezado
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2B364C', // Color institucional
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B364C',
  },
  // Información de la Solicitud
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#ffffff',
    backgroundColor: '#2B364C',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#000000',
  },
  value: {
    flex: 1,
    color: '#000000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 5,
    fontSize: 9,
    color: '#000000',
  }
});
export const DownloadRequest = ({ data, nameRevisor }: { data: StudentRequestData, nameRevisor: string }) => {
  const {users} = useGetAllUsers()

  const nameRequest = 
    data.createByname && data.createByname !== 'No Aplica'
      ? data.createByname
      : `${data.user?.name || ''} ${data.user?.lastname || ''}`.trim() || 'No especificado';


  const dniSolicitante = 
    data.createByDNI && data.createByDNI.trim() !== '0' && data.createByDNI.trim() !== ''
      ? data.createByDNI
      : data.user?.dni || 'No especificado';

  // Formatear la fecha a un formato local legible
  const fechaFormateada = new Date(data.created_at).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        
        {/* Membrete */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/AIS.png" /> 
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {data.type_procedure?.name || 'SOLICITUD FORMAL'}
            </Text>
            <Text>Código: #{data.id}</Text>
            <Text>Fecha: {fechaFormateada}</Text>
          </View>
        </View>

        {/* Contenido / Datos del Solicitante */}
        <Text style={styles.sectionTitle}>Datos del Solicitante</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{nameRequest}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cédula de Identidad:</Text>
          <Text style={styles.value}>{dniSolicitante}</Text>
        </View>

        {data.carrera?.name && (
          <View style={styles.row}>
            <Text style={styles.label}>Carrera:</Text>
            <Text style={styles.value}>{data.carrera.name}</Text>
          </View>
        )}

        {data.additionalData?.cohorte && data.additionalData?.cohorte !== null && (
          <View style={styles.row}>
            <Text style={styles.label}>Cohorte:</Text>
            <Text style={styles.value}>{data.additionalData.cohorte}</Text>
          </View>
        )}
        {data.additionalData?.conditionLiso && data.additionalData?.conditionLiso !== null && (
          <View style={styles.row}>
            <Text style={styles.label}>Cohorte:</Text>
            <Text style={styles.value}>{data.additionalData?.conditionLiso == true ? 'Semestre anterior invicto (Liso)' : 'Posee materias reprobadas'}</Text>
          </View>
        )}
        {data.additionalData?.cohorte && data.additionalData?.cohorte !== null && (
          <View style={styles.row}>
            <Text style={styles.label}>Rendimiento:</Text>
            <Text style={styles.value}>{data.additionalData.cohorte}</Text>
          </View>
        )}
        {data.additionalData?.promedio && data.additionalData?.promedio !== 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Promedio:</Text>
            <Text style={styles.value}>{data.additionalData.promedio}</Text>
          </View>
        )}
        {data.additionalData?.UC && data.additionalData?.UC > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Unidades de Credito (UC):</Text>
            <Text style={styles.value}>{data.additionalData.UC}</Text>
          </View>
        )}
        {data.additionalData?.materia && data.additionalData?.materia !== '' && (
          <View style={styles.row}>
            <Text style={styles.label}>Materia:</Text>
            <Text style={styles.value}>{data.additionalData.materia}</Text>
          </View>
        )}


        {/* Detalles de la Solicitud */}
        <Text style={styles.sectionTitle}>Detalles de la Solicitud</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Trámite:</Text>
          <Text style={styles.value}>{data.type_procedure?.name || 'No especificado'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Revisor asignado:</Text>
          <Text style={styles.value}>{nameRevisor}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado actual:</Text>
          <Text style={styles.value}>{data.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Observaciones:</Text>
          <Text style={styles.value}>
            {data.observation || 'Sin observaciones adicionales.'}
          </Text>
        </View>

        {/* Pie de página */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages} — Sistema de Gestión de Tramites`
        )} fixed />

      </Page>
    </Document>
  );
};