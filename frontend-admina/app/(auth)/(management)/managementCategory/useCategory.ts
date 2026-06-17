// hooks/useGetAllRoles.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GetAllResponseOnlyName, OnlyNameData, OnlyNameResponse } from '@/app/type';
import { onlyNameSchem } from "@/schemas/onlyNameSchem"; 
import { z } from "zod";

export const getAllcategory = async (): Promise<GetAllResponseOnlyName> => {
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener las Categorias');
      return {
        success: false,
        message: data.error || 'Error al obtener las Categorias',
        data: [],
      };
    }

    toast.dismiss(toastId);
    toast.success('¡Categorias obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Categorias obtenidas exitosamente',
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

export const createCategory= async (formData: OnlyNameData): Promise<any> =>{
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken');
    const validatedData = onlyNameSchem.parse({ name: formData.name });
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
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
      toast.error(data.error || 'Error al añadir categoria');
      throw new Error(data.error || 'Error al añadir la categoria');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Categoria creada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};
export const updateCategory = async ( id: string,  updates: { name?: string; status?: string }): Promise<any> => {
  
  let toastId: string | undefined;
  
  try {
    if (!updates.name && !updates.status) {
      toast.error('Debe proporcionar al menos un campo para actualizar');
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`, {
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
      toast.error(data.error || 'Error al actualizar la categoria');  throw new Error(data.error || 'Error al actualizar la categoria');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Categoria actualizada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

export const updateStatusCategory = async ( id: string): Promise<any> => {
  
  let toastId: string | undefined;
  
  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al actualizar la categoria');  throw new Error(data.error || 'Error al actualizar la categoria');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Categoria actualizada exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

// Hook personalizado para obtener carerras
export const useGetAllCategory = () => {
  const [categories, setCategories] = useState<OnlyNameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]); // Estado para errores de validación


    const registerCategory = async (formData: OnlyNameData) => {
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
      
  
      const result = await createCategory(formData);
      
      if (!result.success) {
        setError(result.message);
        if (result.details) {
          setValidationErrors(result.details);
        }
      }
      
      setLoading(false);
      return result;
    };

    const updateCategoriesById = async (id: string, updates: { name?: string; status?: string }) => {
      setLoading(true);
      setError(null);
      setValidationErrors([]);
      
      try {
        // Validar si el nombre está presente y es válido
        if (updates.name) {
          onlyNameSchem.parse({ name: updates.name });
        }
        
        const result = await updateCategory(id, updates);
        
        if (result && result.success !== false) {
          refreshCategory();
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
          setError(error.message || 'Error al actualizar la categoria');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    };

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllcategory();
    
    if (result.success && result.data) {
      setCategories(result.data);
    } else {
      setError(result.message);
      setCategories([]);
    }
    
    setLoading(false);
  };

  const refreshCategory = () => {
    setRefetch(prev => prev + 1);
  };

  useEffect(() => {
    fetchCategory();
  }, [refetch]);


  return { 
    categories, 
    loading, 
    error, 
    validationErrors,
    registerCategory,
    updateCategoriesById,
    refreshCategory,
    refetch: fetchCategory 
  };
};