import React, { useState, useMemo } from 'react';
import { StudentRequestData, OnlyNameData, ProcedureTypeData } from '@/app/type'; 
import { getAcademicPeriod, formatDate } from '@/components/UX/Dashboard/utils'; 

interface ModalFiltrosProps {
  isOpen: boolean;
  onClose: () => void;
  onAplicarFiltros: (filtros: { periodo: string; categoria: string; tipoTramite: string }) => void;
  categories: OnlyNameData[];    // Variable con las categorías existentes
  types: ProcedureTypeData[];     // Variable con los trámites existentes
  requests: StudentRequestData[]; // Variable con todas las solicitudes para calcular los períodos
}

export const ModalFiltrosLocal: React.FC<ModalFiltrosProps> = ({ 
  isOpen, 
  onClose, 
  onAplicarFiltros,
  categories,
  types,
  requests
}) => {

  const [periodo, setPeriodo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoTramite, setTipoTramite] = useState('');

  // 1. EXTRAER PERÍODOS ÚNICOS UTILIZANDO getAcademicPeriod
  const periodosExistentes = useMemo(() => {
    const periodosSet = new Set<string>();
    
    requests.forEach((req) => {
      if (req.created_at) {
        // Calculamos el período académico real usando la función utilitaria nativa de tu Dashboard
        const periodoCalculado = getAcademicPeriod(req.created_at);
        if (periodoCalculado) {
          periodosSet.add(periodoCalculado);
        }
      }
    });

    // Devolvemos la lista ordenada de manera ascendente
    return Array.from(periodosSet).sort();
  }, [requests]);

  if (!isOpen) return null;

  const handleDescargar = () => {
    onAplicarFiltros({ periodo, categoria, tipoTramite });
    onClose(); 
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Filtrar y Descargar PDF</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <div style={styles.body}>
          {/* 1. Selector de Período Dinámico */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Período Académico</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={styles.select}>
              <option value="">Todos los períodos</option>
              {periodosExistentes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 3. Selector de Tipo de Trámite Dinámico */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Trámite</label>
            <select value={tipoTramite} onChange={(e) => setTipoTramite(e.target.value)} style={styles.select}>
              <option value="">Todos los trámites</option>
              {types.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.btnCancelar}>Cancelar</button>
          <button onClick={handleDescargar} style={styles.btnDescargar}>Generar Tabla PDF</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '400px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', paddingBottom: '10px' },
  title: { margin: 0, fontSize: '1.15rem', color: '#2b364c', fontWeight: 600 },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' },
  body: { padding: '15px 0' },
  formGroup: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 500, color: '#475569' },
  select: { width: '100%', padding: '8px 10px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eef2f6', paddingTop: '12px' },
  btnCancelar: { padding: '8px 14px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '5px', cursor: 'pointer', color: '#64748b' },
  btnDescargar: { padding: '8px 14px', border: 'none', backgroundColor: '#2b364c', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontWeight: 500 }
};