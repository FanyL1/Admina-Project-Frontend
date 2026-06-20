// hooks/useGetAllRoles.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GetAllResponseOnlyName, OnlyNameData, OnlyNameResponse } from '@/app/type';
import { onlyNameSchem } from "@/schemas/onlyNameSchem"; 
import { z } from "zod";

export const getAllDegree = async (): Promise<GetAllResponseOnlyName> => {
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/degree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener las Carreras');
      return {
        success: false,
        message: data.error || 'Error al obtener las Carreras',
        data: [],
      };
    }

    toast.dismiss(toastId);
    toast.success('¡Carreras obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Carreras obtenidas exitosamente',
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

export const createDegree = async (formData: OnlyNameData): Promise<any> =>{
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken');
    const validatedData = onlyNameSchem.parse({ name: formData.name });
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/degree`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: validatedData.name }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al añadir carrera');
      throw new Error(data.error || 'Error al añadir la carrera');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Carrera creada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};
export const updateDegree = async ( id: string,  updates: { name?: string; status?: string }): Promise<any> => {
  
  let toastId: string | undefined;
  
  try {
    if (!updates.name && !updates.status) {
      toast.error('Debe proporcionar al menos un campo para actualizar');
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/degree/${id}`, {
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
      toast.error(data.error || 'Error al actualizar la carrera');  throw new Error(data.error || 'Error al actualizar la carrera');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Carrera actualizada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

export const updateStatusDegree = async ( id: string): Promise<any> => {
  
  let toastId: string | undefined;
  
  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/degree/status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al actualizar la carrera');  throw new Error(data.error || 'Error al actualizar la carrera');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Carrera actualizada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

// Hook personalizado para obtener carerras
export const useGetAllDegree = () => {
  const [degrees, setDegrees] = useState<OnlyNameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]); // Estado para errores de validación


    const registerDegree = async (formData: OnlyNameData) => {
      setLoading(true);
      setError(null);
      setValidationErrors([]); 
      
       try {
  
        onlyNameSchem.parse(formData);
  
      } catch (error: any) {
        
        if (error instanceof z.ZodError) {
          const formattedErrors = error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          
          setValidationErrors(formattedErrors);
          setLoading(false);
          
          return {
            success: false,
            message: 'Error de validación',
            details: formattedErrors, 
          };
        }
      }
      
  
      const result = await createDegree(formData);
      
      if (!result.success) {
        setError(result.message);
        if (result.details) {
          setValidationErrors(result.details);
        }
      }
      
      setLoading(false);
      return result;
    };

    const updateDegreeById = async (id: string, updates: { name?: string; status?: string }) => {
  setLoading(true);
  setError(null);
  setValidationErrors([]);
  
  try {
    // Validar si el nombre está presente y es válido
    if (updates.name) {
      onlyNameSchem.parse({ name: updates.name });
    }
    
    const result = await updateDegree(id, updates);
    
    if (result && result.success !== false) {
      refreshDegrees();
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
      setError(error.message || 'Error al actualizar la carrera');
    }
    throw error;
  } finally {
    setLoading(false);
  }
};

  const fetchDegrees = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllDegree();
    
    if (result.success && result.data) {
      setDegrees(result.data);
    } else {
      setError(result.message);
      setDegrees([]);
    }
    
    setLoading(false);
  };

  const refreshDegrees = () => {
    setRefetch(prev => prev + 1);
  };

  useEffect(() => {
    fetchDegrees();
  }, [refetch]);


  return { 
    degrees, 
    loading, 
    error, 
    validationErrors,
    registerDegree,
    updateDegreeById,
    refreshDegrees,
    refetch: fetchDegrees 
  };
};