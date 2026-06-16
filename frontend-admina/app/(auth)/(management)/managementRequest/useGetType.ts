// hooks/useGetAllRoles.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ProcedureTypeData, GetAllTypeResponse } from '@/app/type';
import { onlyNameSchem } from "@/schemas/onlyNameSchem"; 
import { z } from "zod";

export const getAlltype = async (): Promise<GetAllTypeResponse> => {
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/procedure-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener las Tramite');
      return {
        success: false,
        message: data.error || 'Error al obtener las Tramite',
        data: [],
      };
    }

    toast.dismiss(toastId);
    toast.success('¡Tramite obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Tramite obtenidas exitosamente',
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

type ProcedureTypeUpdates = { name?: string; category_id?: string; status?: string };

export const updateType = async ( id: string,  updates: ProcedureTypeUpdates): Promise<any> => {
  
  let toastId: string | undefined;
  
  try {
    if (!updates.name && !updates.category_id && !updates.status) {
      toast.error('Debe proporcionar al menos un campo para actualizar');
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/procedure-types/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates), 
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al actualizar la Tramite');  throw new Error(data.error || 'Error al actualizar la Tramite');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Tramite actualizada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};



// Hook personalizado para obtener carerras
export const useGetAlltype = () => {
  const [types, setTypes] = useState<ProcedureTypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]); // Estado para errores de validación

  const updateTypesById = async (id: string, updates: ProcedureTypeUpdates) => {
  setLoading(true);
  setError(null);
  setValidationErrors([]);
  
  try {
    // Validar si el nombre está presente y es válido
    if (updates.name) {
      onlyNameSchem.parse({ name: updates.name });
    }
    
    const result = await updateType(id, updates);
    
    if (result && result.success !== false) {
      refreshtype();
      return result;
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      setValidationErrors(formattedErrors);
      setError('Por favor, corrige los errores del formulario');
    } else {
      setError(error.message || 'Error al actualizar la Tramite');
    }
    throw error;
  } finally {
    setLoading(false);
  }
};

  const fetchtype = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAlltype();
    
    if (result.success && result.data) {
      setTypes(result.data);
    } else {
      setError(result.message);
      setTypes([]);
    }
    
    setLoading(false);
  };

  const refreshtype = () => {
    setRefetch(prev => prev + 1);
  };

  useEffect(() => {
    fetchtype();
  }, [refetch]);

  console.log(types)
  return { 
    types, 
    loading, 
    error, 
    validationErrors,
    updateTypesById,
    refreshtype,
    refetch: fetchtype 
  };
};
