// hooks/useGetAllRoles.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LogResponse, LogsData } from '@/app/type';

export const getAllLogs = async (): Promise<LogResponse> => {
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit-logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener las Logs');
      return {
        success: false,
        message: data.error || 'Error al obtener las Logs',
        data: [],
      };
    }

    toast.dismiss(toastId);
    //toast.success('¡Logs obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Logs obtenidas exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: [],
    };
  }
};


// Hook personalizado para obtener carerras
export const useGetAllLogs = () => {
  const [logs, setLogs] = useState<LogsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllLogs();
    
    if (result.success && result.data) {
      setLogs(result.data);
    } else {
      setError(result.message);
      setLogs([]);
    }
    
    setLoading(false);
  };

  const refreshLogs = () => {
    setRefetch(prev => prev + 1);
  };

  useEffect(() => {
    fetchLogs();
  }, [refetch]);

  return { 
    logs,
    loading, 
    error, 
    refreshLogs,
    refetch: fetchLogs 
  };
};