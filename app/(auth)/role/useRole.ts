// hooks/useGetAllRoles.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GetAllRolesResponse, RoleData } from '@/app/type';

export const getAllRoles = async (): Promise<GetAllRolesResponse> => {
  let toastId: string | undefined;

  try {
    toastId = toast.loading('Obteniendo roles...');
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/role`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener los roles');
      return {
        success: false,
        message: data.error || 'Error al obtener los roles',
        data: [],
      };
    }

    toast.dismiss(toastId);
    toast.success('¡Roles obtenidos exitosamente!');
    
    return {
      success: true,
      message: 'Roles obtenidos exitosamente',
      data: data.data || data.roles || data,
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

export const createRole = async (name: string): Promise<any> => {
  let toastId: string | undefined;
  
  try {
    toastId = toast.loading('Creando rol...');
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al crear el rol');
      throw new Error(data.error || 'Error al crear el rol');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Rol creado exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

export const updateRole = async (id: string, name: string): Promise<any> => {
  let toastId: string | undefined;
  
  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/role/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al actualizar el rol');
      throw new Error(data.error || 'Error al actualizar el rol');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Rol actualizado exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<any> => {
  let toastId: string | undefined;
  
  try {
    toastId = toast.loading('Eliminando rol...');
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const cleanToken = token?.replace(/undefined\.undefined\./g, '');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`,
      },
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al eliminar el rol');
      throw new Error(data.error || 'Error al eliminar el rol');
    }
    
    toast.dismiss(toastId);
    toast.success('¡Rol eliminado exitosamente!');
    
    return data;
  } catch (error) {
    toast.dismiss(toastId);
    throw error;
  }
};

// Hook personalizado para obtener roles
export const useGetAllRoles = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllRoles();
    
    if (result.success && result.data) {
      setRoles(result.data);
    } else {
      setError(result.message);
      setRoles([]);
    }
    
    setLoading(false);
  };

  const refreshRoles = () => {
    setRefetch(prev => prev + 1);
  };

  useEffect(() => {
    fetchRoles();
  }, [refetch]);

  return { 
    roles, 
    loading, 
    error, 
    refreshRoles,
    refetch: fetchRoles 
  };
};